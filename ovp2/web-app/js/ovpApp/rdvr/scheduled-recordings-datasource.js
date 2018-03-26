(function () {
    'use strict';

    angular
        .module('ovpApp.rdvr.datasource')
        .factory('ScheduledRecordingsDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, recordingViewModelDefinition,
        rdvrCacheService, recordingsListType) {
        return class ScheduledRecordingsDatasource extends AbstractDatasource {
            constructor(stb) {
                super(stb, recordingsListType.SCHEDULED, {
                    data: []
                });

                if (this.stb && this.stb.dvr) {
                    this.locallyScheduled = new rx.BehaviorSubject([]);
                    this.locallyCancelled = new rx.BehaviorSubject([]);

                    this.source = this.reset.map(() => true)
                        .startWith(false)
                        .flatMapLatest(force => {
                            return this.fetchAndCombineWithLocalChanges(force)
                                .startWith(this.initialValue)
                                .takeUntil(this.reset);
                        })
                        .shareReplay(1);
                } else {
                    this.source = rx.Observable.never();
                }
            }

            fetchAndCombineWithLocalChanges(force) {
                this.locallyScheduled.onNext([]);
                this.locallyCancelled.onNext([]);

                return rx.Observable.combineLatest(
                    this.fetch(force), this.locallyScheduled, this.locallyCancelled,
                    (fromStb, locallyScheduled, locallyCancelled) => {
                        let recordings = fromStb.data.concat(locallyScheduled);
                        if (locallyScheduled.length > 0) {
                            recordings.sort((a, b) => a.startTime - b.startTime);
                        }

                        locallyCancelled.forEach(cancelled => {
                            const found = recordings.find(r => this.recordingsEqual(r, cancelled));
                            if (found) {
                                const index = recordings.indexOf(found);
                                if (index > -1) {
                                    recordings.splice(index, 1);
                                }
                            }
                        });

                        if (locallyScheduled.length === 0 && locallyCancelled.length === 0) {
                            rdvrCacheService.createNewCache(recordingsListType.SCHEDULED, this.stb, {
                                data: recordings,
                                nextParams: fromStb.nextParams
                            });
                        } else {
                            rdvrCacheService.updateCache(recordingsListType.SCHEDULED, this.stb, {
                                data: recordings,
                                nextParams: fromStb.nextParams
                            });
                        }

                        return {
                            data: recordings.map(r => this.wrapRecording(r)),
                            isComplete: !fromStb.nextParams,
                            error: fromStb.error,
                            lastUpdated: fromStb.lastUpdated,
                            busyUntil: fromStb.busyUntil
                        };
                    });
            }

            fetch(force) {
                if (force) {
                    this.clearCache();
                }

                return this.batchGetWithCache({
                        getter: this.getOneScheduledRecordingBatch.bind(this),
                        initialParams: {startTime: 0, includeCurrent: true}
                    })
                    .catch(error => rx.Observable.just({data: [], error}))
                    .scan(this.mergeBatchesWithDuplicates.bind(this));
            }

            scheduleRecording(scheduledItem) {
                if (!this.stb || !this.stb.dvr) {
                    return $q.resolve();
                }

                const baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                const fullUrl = baseUrl + this.stb.macAddressNormalized +
                    config.services.dvrSchedule + '/' +
                    scheduledItem.mystroServiceId + '/' +
                    scheduledItem.tmsProgramId + '/' +
                    scheduledItem.startTime + '/' +
                    (scheduledItem.recordSeries ? 'series' : 'single');

                let source = rxhttp.put(fullUrl, {settings: scheduledItem.settings}, {withCredentials: true});

                // The server may return a 500 error due to a timeout, followed by a 439 indicating it's already
                // scheduled. We want to treat this as a success.
                source = this.expectErrors(source, [500, 439])
                    .do(() => {
                        let currentValue = this.locallyScheduled.getValue();
                        // unwraping the data delegate, so it can be saved to the cache correctly
                        currentValue.push(scheduledItem._context.data);
                        this.locallyScheduled.onNext(currentValue);
                    });

                return source.toPromise($q);


                // epgsService.getChannels().then(function (channels) {
                //     var channel = getChannelInfoFromMystroServiceId(channels, scheduledItem.mystroServiceId);
                //     var tmsGuideId = channel.streamTmsGuideId || null;
                //     var airingTime = scheduledItem.startTime * 1000;
                //     var channelNumber = channel.channelNumber;
                //     var eventData = {
                //         operation: scheduledItem.isNew ? 'new' : 'edit',
                //         isSeries:  scheduledItem.recordSeries
                //     };

                //     if (tmsGuideId && tmsGuideId !== '') {
                //         eventData.assetMetadata = {
                //             tmsGuideId:    tmsGuideId.toString(),
                //             airingTime:    airingTime.toString(),
                //             channelNumber: channelNumber.toString()
                //         };

                //         $rootScope.$emit('EG:scheduleNewDvrRecording', eventData);
                //     }
                // });

            }

            /**
             * Adds retry and catch logic so that a predicted sequence of errors can be treated as not an error
             *
             * @param  {observable} source     The source observable
             * @param  {array} expectedErrors  an array of http status codes. If errors occur in the specified order,
             *                                    then we will keep retrying until either an unexpected error occurs,
             *                                    or the array is completed. If all the expected errors happen, then
             *                                    a success is emitted rather than an error.
             * @param  {Number} retryDelay     amount of time to wait before retrying. Defaults to 500
             * @param  {object} scheduler      used for unit testing. Leave undefined for normal operation
             * @return {observable}            The modified version of the source observable
             */
            expectErrors(source, expectedErrors, retryDelay = 500, scheduler = undefined) {
                return source.retryWhen(errors => {
                    return errors
                        .take(expectedErrors.length)
                        .scan((memo, error) => {
                            memo.push(error);
                            return memo;
                        }, [])
                        .flatMap(accumulatedErrors => {
                            let okSoFar = accumulatedErrors.every((e, i) => expectedErrors[i] === e.status);
                            if (okSoFar) {
                                if (accumulatedErrors.length === expectedErrors.length) {
                                    // All done. We got the predicted sequence of errors, so treat as success
                                    let error = accumulatedErrors[accumulatedErrors.length - 1];
                                    error._treatAsNotAnError = true;
                                    return rx.Observable.throw(error);
                                } else {
                                    // The pattern matches so far, but we need to retry and see if it continues
                                    return rx.Observable.timer(retryDelay, scheduler);
                                }
                            } else {
                                // Pattern does not match. Throw the error.
                                return rx.Observable.throw(accumulatedErrors[accumulatedErrors.length - 1]);
                            }
                        });
                })
                .catch(error => {
                    if (error.status === expectedErrors[expectedErrors.length - 1] && error._treatAsNotAnError) {
                        delete error._treatAsNotAnError;
                        return rx.Observable.just(error);
                    } else {
                        return rx.Observable.throw(error);
                    }
                });
            }

            cancelScheduled(scheduledItem, cancelSingle) {
                if (!this.stb || !this.stb.dvr) {
                    return rx.Observable.empty();
                }

                const baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                let singleOrSeries = scheduledItem.recordSeries ? 'series' : 'single';

                if (cancelSingle === true) {
                    singleOrSeries = 'single';
                }

                const fullUrl = baseUrl + this.stb.macAddressNormalized +
                        config.services.dvrScheduled + '/' +
                        scheduledItem.mystroServiceId + '/' +
                        scheduledItem.tmsProgramId + '/' +
                        scheduledItem.startTime + '/' +
                        singleOrSeries;

                let source = rxhttp.delete(fullUrl, {withCredentials: true});

                // The server may return a 500 error due to a timeout, followed by a 404 indicating it's already
                // deleted. We want to treat this as a success.
                source = this.expectErrors(source, [500, 404])
                    .do(() => {
                        let currentValue = this.locallyCancelled.getValue();
                        // unwraping the data delegate, so it can be saved to the cache correctly
                        currentValue.push(scheduledItem._context.data);
                        this.locallyCancelled.onNext(currentValue);
                    });

                return source.toPromise($q);

                // .do(() => publishUnscheduledEvent({
                //     item: scheduledItem,
                //     isSeries: singleOrSeries === 'single' ? false : true
                // }))
            }

            /**
             * Gets a batch of scheduled recordings
             */
            getOneScheduledRecordingBatch({startTime, includeCurrent}) {
                let params = {};
                params.startUnixTimestampSeconds = startTime;
                if (params.includeCurrent === true) {
                    params.includeCurrent = includeCurrent;
                }

                const url = config.piHost + config.nrsApi + this.getDvrBase() + this.stb.macAddressNormalized +
                        config.services.dvrScheduled;

                return rxhttp.get(url, {params, withCredentials: true})
                    .retry(2)
                    .map(result => {
                        // Flatten current and future recordings into a single array
                        let recordings;
                        if (result.data.current) {
                            recordings = result.data.current.concat(result.data.recordings);
                        } else {
                            recordings = result.data.recordings;
                        }

                        // Determine whether another batch is necessary
                        if (result.status === 206 && recordings.length > 0) {
                            result.nextParams = {
                                startTime: result.data.lastStartTime,
                                includeCurrent: false
                            };
                        }

                        // If data is missing, fill it up.
                        result.data = recordings.map(r => {
                            if (!r.programMetadata) {
                                this.createEmptyProgramMetadata(r);
                            }

                            return r;
                        });

                        return result;
                    });
            }
        };
    }
})();
