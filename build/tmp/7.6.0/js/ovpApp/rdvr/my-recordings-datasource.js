'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
    'use strict';

    factory.$inject = ["AbstractDatasource", "$q", "rx", "rxhttp", "config", "recordingViewModelDefinition", "rdvrCacheService", "recordingsListType"];
    angular.module('ovpApp.rdvr.datasource').factory('MyRecordingsDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, recordingViewModelDefinition, rdvrCacheService, recordingsListType) {
        return (function (_AbstractDatasource) {
            _inherits(MyRecordingsDatasource, _AbstractDatasource);

            function MyRecordingsDatasource(stb) {
                var _this = this;

                _classCallCheck(this, MyRecordingsDatasource);

                _get(Object.getPrototypeOf(MyRecordingsDatasource.prototype), 'constructor', this).call(this, stb, recordingsListType.COMPLETED, {
                    data: []
                });

                if (this.stb && this.stb.dvr) {
                    this.locallyDeleted = new rx.BehaviorSubject([]);

                    this.source = this.reset.map(function () {
                        return true;
                    }).startWith(false).flatMapLatest(function (force) {
                        return _this.fetchAndCombineWithLocalChanges(force).startWith(_this.initialValue).takeUntil(_this.reset);
                    }).shareReplay(1);
                } else {
                    this.source = rx.Observable.never();
                }
            }

            _createClass(MyRecordingsDatasource, [{
                key: 'fetchAndCombineWithLocalChanges',
                value: function fetchAndCombineWithLocalChanges(force) {
                    var _this2 = this;

                    this.locallyDeleted.onNext([]);

                    return rx.Observable.combineLatest(this.fetchCompleted(force), this.fetchInProgress(), this.locallyDeleted, function (completed, inProgress, locallyDeleted) {
                        var recordings = inProgress.data.concat(completed.data);
                        locallyDeleted.forEach(function (deleted) {
                            var found = recordings.find(function (r) {
                                return _this2.recordingsEqual(r, deleted);
                            });
                            if (found) {
                                var index = recordings.indexOf(found);
                                if (index > -1) {
                                    recordings.splice(index, 1);
                                }
                            }
                        });

                        var completedRecordings = completed.data.slice();
                        locallyDeleted.forEach(function (deleted) {
                            var found = completedRecordings.find(function (r) {
                                return _this2.recordingsEqual(r, deleted);
                            });
                            if (found) {
                                var index = completedRecordings.indexOf(found);
                                if (index > -1) {
                                    completedRecordings.splice(index, 1);
                                }
                            }
                        });

                        if (completedRecordings.length === completed.data.length) {
                            rdvrCacheService.createNewCache(recordingsListType.COMPLETED, _this2.stb, {
                                data: completedRecordings,
                                nextParams: completed.nextParams
                            });
                        } else {
                            rdvrCacheService.updateCache(recordingsListType.COMPLETED, _this2.stb, {
                                data: completedRecordings,
                                nextParams: completed.nextParams
                            });
                        }

                        return {
                            data: recordings.map(function (r) {
                                return _this2.wrapRecording(r);
                            }),
                            isComplete: !completed.nextParams && !inProgress.nextParams,
                            error: completed.error || inProgress.error,
                            lastUpdated: completed.lastUpdated,
                            busyUntil: completed.busyUntil
                        };
                    });
                }
            }, {
                key: 'fetchCompleted',
                value: function fetchCompleted(force) {
                    if (force) {
                        this.clearCache();
                    }

                    return this.batchGetWithCache({
                        getter: this.getOneCompletedRecordingBatch.bind(this),
                        initialParams: 0
                    })['catch'](function (error) {
                        return rx.Observable.just({ data: [], error: error });
                    }).scan(this.mergeBatches);
                }
            }, {
                key: 'getOneCompletedRecordingBatch',
                value: function getOneCompletedRecordingBatch(startIndex) {
                    var _this3 = this;

                    var url = config.piHost + config.nrsApi + this.getDvrBase() + this.stb.macAddressNormalized + config.services.dvrRecorded;
                    var params = { startIndex: startIndex };

                    return rxhttp.get(url, { params: params, withCredentials: true }).retry(2).map(function (result) {
                        if (result.status == 206) {
                            result.nextParams = result.data.recordings.length + startIndex;
                        }

                        result.data = result.data.recordings.map(function (r) {
                            if (!r.programMetadata) {
                                _this3.createEmptyProgramMetadata(r);
                            }
                            return r;
                        });

                        return result;
                    });
                }
            }, {
                key: 'fetchInProgress',
                value: function fetchInProgress() {
                    var _this4 = this;

                    var baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                    var url = baseUrl + this.stb.macAddressNormalized + config.services.dvrRecording;
                    return rxhttp.get(url, { withCredentials: true }).retry(2).map(function (result) {
                        result.data = result.data.recordings.map(function (r) {
                            if (!r.programMetadata) {
                                _this4.createEmptyProgramMetadata(r);
                            }
                            return r;
                        });

                        result.isComplete = true;

                        return result;
                    })['catch'](function (error) {
                        return rx.Observable.just({ data: [], error: error });
                    });
                }
            }, {
                key: 'deleteRecordings',
                value: function deleteRecordings(recordings) {
                    var _this5 = this;

                    if (!this.stb || !this.stb.dvr) {
                        return $q.resolve();
                    }

                    var baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                    var fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrRecordedDelete;

                    if (!angular.isArray(recordings)) {
                        recordings = [recordings];
                    }

                    var deletions = recordings.map(function (recording) {
                        return {
                            tmsProgramId: recording.tmsProgramId,
                            mystroServiceId: recording.mystroServiceId,
                            startUnixTimestampSeconds: recording.startTime,
                            //we always set recordSeries to false on deletes
                            recordSeries: false
                        };
                    });

                    return rxhttp.put(fullUrl, { deletions: deletions }, { withCredentials: true }).toPromise($q).then(function (result) {
                        var failures = result.data.failedDeletions.map(function (r) {
                            if (!r.programMetadata) {
                                _this5.createEmptyProgramMetadata(r);
                            }

                            return recordingViewModelDefinition.createInstance(r);
                        });

                        var successfulDeletions = recordings.filter(function (r) {
                            return !failures.find(function (f) {
                                return _this5.recordingsEqual(f, r);
                            });
                        });

                        var currentValue = _this5.locallyDeleted.getValue();
                        // unwraping the data delegates, so it can be saved to the cache correctly
                        currentValue.push.apply(currentValue, _toConsumableArray(successfulDeletions.map(function (sd) {
                            return sd._context.data;
                        })));
                        _this5.locallyDeleted.onNext(currentValue);

                        //TODO: Analytics event

                        return result;
                    });
                }
            }]);

            return MyRecordingsDatasource;
        })(AbstractDatasource);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/my-recordings-datasource.js.map
