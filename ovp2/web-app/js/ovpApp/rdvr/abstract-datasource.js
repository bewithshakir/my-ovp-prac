(function () {
    'use strict';

    /**
     * Base class for RDVR datasources. Each datasource is responsible for fetching, storing,
     * and making available a set of data. For example: scheduled recordings, or disk usage.
     *
     * The primary means of interacting with the data source is by calling its .fetch() method.
     * Fetch() returns an observable sequence, which will emit the associated value over time.
     * The observable will never complete, but instead will continue to emit new data as it is
     * received. The data takes the form of:
     *
     *   {
     *      data: someBlobOfDataDependingOnWhichDataSourceThisIs
     *      isComplete: boolean,
     *      error: object,
     *      lastUpdated: number,
     *      busyUntil: number
     *   }
     *
     * If isComplete = false, then the data is only a partial dataset and more data is actively
     * being downloaded. If isComplete = true, then the data is not expected to change in the
     * near future. However, new data may still be emitted if circumstances change, (eg, if a
     * recording is deleted)
     *
     * If an error occurs, the error value will be filled out with the error response. This will
     * still be emitted as an onNext, not an onError, so the subscription will stay active and
     * will resume emitting data if for some reason we retry. If partial data was received prior
     * to the error then the data field will continue to be populated with it.
     *
     * If data was loaded from the cache, lastUpdated and busyUntil may be filled out. If
     * busyUntil is filled out, it indicates that the data is dirty, but is not allowed to
     * update until the specified time. If lastUpdated is filled out, it indicates that the
     * data was last updated at the specified time.
     *
     * You can safely call fetch as many times as you like, without risking sending additional
     * http requests; the datasource will cache and reuse values automatically. To invalidate
     * the cache, call .reset()
     *
     */

    angular
        .module('ovpApp.rdvr.datasource', [
            'rx',
            'ovpApp.services.rxUtils',
            'ovpApp.config',
            'ovpApp.dataDelegate',
            'ovpApp.rdvr.recordingsCache',
            'ovpApp.rdvr.cacheService'])
        .factory('AbstractDatasource', factory);

    /* @ngInject */
    function factory(rx, config, rdvrCacheService, createObservableFunction, recordingViewModelDefinition) {
        return class AbstractDatasource {
            constructor(stb, cacheKey, initialValue) {
                this.stb = stb;
                this.cacheKey = cacheKey;
                this.initialValue = initialValue;
                this.reset = createObservableFunction();

                // wrap a recording in a datadelegate, and memoize the result so we only do it once per recording
                this.wrapRecording = (function () {
                    const memo = {};
                    function makeKey(r) {
                        return '' + r.tmsProgramId + r.mystroServiceId + r.startUnixTimestampSeconds + r.recordSeries;
                    }

                    return function wrapRecording(recording) {
                        const key = makeKey(recording);
                        if (!memo[key]) {
                            memo[key] = recordingViewModelDefinition.createInstance(recording);
                        }
                        return memo[key];
                    };
                })();
            }

            //////////////

            clearCache() {
                rdvrCacheService.clearCache(this.cacheKey, this.stb);
            }

            saveToCache(result) {
                if (result === this.initialValue) {
                    return;
                }

                rdvrCacheService.createNewCache(this.cacheKey, this.stb, {
                    data: result.data,
                    nextParams: result.nextParams
                });
            }

            /**
             * removes extraneous data which is only needed internally
             * @param  {object} result result object which may have extra data, such as http status codes
             *                           or parameters for subsequent http requests
             * @return {object}        limited version of the result object which only has data that the
             *                           outside world needs to know
             */
            convertResultBeforeEmitting(result) {
                return {
                    data: result.data,
                    isComplete: result === this.initialValue ? false : !result.nextParams,
                    error: result.error,
                    lastUpdated: result.lastUpdated,
                    busyUntil: result.busyUntil
                };
            }

            /**
             * Generalized method for sending a sequence of requests until all data is downloaded.
             *
             * @param  {function} getter   function which fetches data. The function must accept one argument,
             *                                 containing the parameters for fetching the data, and must return
             *                                 an observable which emits the result. If more data needs to be
             *                                 fetched, the result should include a nextParams field, containing
             *                                 the parameters to use on the next iteration.
             * @param  {object} params     initial parameters to pass to the getter
             * @return {observable}        an observable which emits each batch of results as they arrive
             */
            batchGet(getter, params) {
                return getter(params)
                    .concatMap(result => {
                        if (!result.nextParams) {
                            return rx.Observable.just(result);
                        } else {
                            return this.batchGet(getter, result.nextParams)
                                .startWith(result);
                        }
                    });
            }

            /**
             * Generalized method for partially or fully restoring from a cache, and then using batchGet
             * for any data that's still needed.
             * @param  {[type]} options.getter                 [description]
             * @param  {[type]} options.initialParams          [description]
             * @return {[type]}                                [description]
             */
            batchGetWithCache({getter, initialParams}) {
                let cache = rdvrCacheService.getCache(this.cacheKey, this.stb);
                let cachedResult, source;
                if (cache) {
                    cachedResult = cache.getJson();
                }

                if (cache && !cachedResult.nextParams) {
                    cachedResult.lastUpdated = cache.getLastRefreshTimeUtcMsec();
                    if (cache.isDirty()) {
                        cachedResult.busyUntil = cache.lastDirtiedTimeUtcMsec + cache.getDirtyIntervalMsec();
                    }

                    source = rx.Observable.just(cachedResult);
                } else {
                    const params = (cachedResult && cachedResult.nextParams) || initialParams;
                    source = this.batchGet(getter, params);
                    if (cachedResult) {
                        source = source.startWith(cachedResult);
                    }
                }

                return source;
            }

            mergeBatches(accumulated, newBatch) {
                if (accumulated) {
                    newBatch.data = accumulated.data.concat(newBatch.data);
                }
                return newBatch;
            }

            mergeBatchesWithDuplicates(accumulated, newBatch) {
                if (accumulated) {
                    const data = accumulated.data;
                    newBatch.data.forEach(rec => {
                        if (!data.find(oldRec => this.recordingsEqual(oldRec, rec))) {
                            data[data.length] = rec;
                        }
                    });
                    newBatch.data = data;
                }
                return newBatch;
            }

            getDvrBase() {
                return config.services.dvrBase.replace('*', this.stb.rdvrVersion);
            }

            createEmptyProgramMetadata(recording) {
                recording.programMetadata = {
                    imageUrl: '/imageserver/program/' + recording.tmsProgramId,
                    mystroServiceId: recording.mystroServiceId,
                    rating: '',
                    title: '',
                    episodeTitle: '',
                    seasonNumber: '',
                    episodeNumber: '',
                    genres: []
                };
            }

            recordingsEqual(recordingA, recordingB) {
                return recordingA.tmsProgramId === recordingB.tmsProgramId &&
                    recordingA.mystroServiceId === recordingB.mystroServiceId &&
                    recordingA.startUnixTimestampSeconds === recordingB.startUnixTimestampSeconds &&
                    recordingA.recordSeries === recordingB.recordSeries;
            }
        };
    }
})();
