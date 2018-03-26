(function () {
    'use strict';

    angular
        .module('ovpApp.rdvr.datasource')
        .factory('MyRecordingsDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, recordingViewModelDefinition,
        rdvrCacheService, recordingsListType) {
        return class MyRecordingsDatasource extends AbstractDatasource {
            constructor(stb) {
                super(stb, recordingsListType.COMPLETED, {
                    data: []
                });

                if (this.stb && this.stb.dvr) {
                    this.locallyDeleted = new rx.BehaviorSubject([]);

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
                this.locallyDeleted.onNext([]);

                return rx.Observable.combineLatest(
                        this.fetchCompleted(force), this.fetchInProgress(), this.locallyDeleted,
                        (completed, inProgress, locallyDeleted) => {
                            let recordings = inProgress.data.concat(completed.data);
                            locallyDeleted.forEach(deleted => {
                                const found = recordings.find(r => this.recordingsEqual(r, deleted));
                                if (found) {
                                    const index = recordings.indexOf(found);
                                    if (index > -1) {
                                        recordings.splice(index, 1);
                                    }
                                }
                            });

                            let completedRecordings = completed.data.slice();
                            locallyDeleted.forEach(deleted => {
                                const found = completedRecordings.find(r => this.recordingsEqual(r, deleted));
                                if (found) {
                                    const index = completedRecordings.indexOf(found);
                                    if (index > -1) {
                                        completedRecordings.splice(index, 1);
                                    }
                                }
                            });

                            if (completedRecordings.length === completed.data.length) {
                                rdvrCacheService.createNewCache(recordingsListType.COMPLETED, this.stb, {
                                    data: completedRecordings,
                                    nextParams: completed.nextParams
                                });
                            } else {
                                rdvrCacheService.updateCache(recordingsListType.COMPLETED, this.stb, {
                                    data: completedRecordings,
                                    nextParams: completed.nextParams
                                });
                            }

                            return {
                                data: recordings.map(r => this.wrapRecording(r)),
                                isComplete: !completed.nextParams && !inProgress.nextParams,
                                error: completed.error || inProgress.error,
                                lastUpdated: completed.lastUpdated,
                                busyUntil: completed.busyUntil
                            };
                        }
                    );
            }

            fetchCompleted(force) {
                if (force) {
                    this.clearCache();
                }

                return this.batchGetWithCache({
                        getter: this.getOneCompletedRecordingBatch.bind(this),
                        initialParams: 0
                    })
                    .catch(error => rx.Observable.just({data: [], error}))
                    .scan(this.mergeBatches);
            }

            getOneCompletedRecordingBatch(startIndex) {
                const url = config.piHost + config.nrsApi + this.getDvrBase() +
                    this.stb.macAddressNormalized + config.services.dvrRecorded;
                const params = {startIndex: startIndex};

                return rxhttp.get(url, {params, withCredentials: true})
                    .retry(2)
                    .map(result => {
                        if (result.status == 206) {
                            result.nextParams = result.data.recordings.length + startIndex;
                        }

                        result.data = result.data.recordings.map(r => {
                            if (!r.programMetadata) {
                                this.createEmptyProgramMetadata(r);
                            }
                            return r;
                        });

                        return result;
                    });
            }

            fetchInProgress() {
                const baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                const url = baseUrl + this.stb.macAddressNormalized + config.services.dvrRecording;
                return rxhttp.get(url, {withCredentials: true})
                    .retry(2)
                    .map(result => {
                        result.data = result.data.recordings.map(r => {
                            if (!r.programMetadata) {
                                this.createEmptyProgramMetadata(r);
                            }
                            return r;
                        });

                        result.isComplete = true;

                        return result;
                    })
                    .catch(error => rx.Observable.just({data: [], error}));
            }

            deleteRecordings(recordings) {
                if (!this.stb || !this.stb.dvr) {
                    return $q.resolve();
                }

                const baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                const fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrRecordedDelete;

                if (!angular.isArray(recordings)) {
                    recordings = [recordings];
                }

                const deletions = recordings.map(recording => {
                    return {
                        tmsProgramId: recording.tmsProgramId,
                        mystroServiceId: recording.mystroServiceId,
                        startUnixTimestampSeconds: recording.startTime,
                        //we always set recordSeries to false on deletes
                        recordSeries: false
                    };
                });

                return rxhttp.put(fullUrl, {deletions}, {withCredentials: true})
                    .toPromise($q)
                    .then((result) => {
                        let failures = result.data.failedDeletions.map(r => {
                            if (!r.programMetadata) {
                                this.createEmptyProgramMetadata(r);
                            }

                            return recordingViewModelDefinition.createInstance(r);
                        });

                        let successfulDeletions = recordings.filter(r =>
                        !failures.find(f => this.recordingsEqual(f, r)));

                        let currentValue = this.locallyDeleted.getValue();
                        // unwraping the data delegates, so it can be saved to the cache correctly
                        currentValue.push(...successfulDeletions.map(sd => sd._context.data));
                        this.locallyDeleted.onNext(currentValue);

                        //TODO: Analytics event

                        return result;
                    });
            }
        };
    }
})();
