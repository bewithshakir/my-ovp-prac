'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
    'use strict';

    factory.$inject = ["AbstractDatasource", "$q", "rx", "rxhttp", "config", "recordingViewModelDefinition", "rdvrCacheService", "recordingsListType"];
    angular.module('ovpApp.rdvr.datasource').factory('ScheduledRecordingsDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, recordingViewModelDefinition, rdvrCacheService, recordingsListType) {
        return (function (_AbstractDatasource) {
            _inherits(ScheduledRecordingsDatasource, _AbstractDatasource);

            function ScheduledRecordingsDatasource(stb) {
                var _this = this;

                _classCallCheck(this, ScheduledRecordingsDatasource);

                _get(Object.getPrototypeOf(ScheduledRecordingsDatasource.prototype), 'constructor', this).call(this, stb, recordingsListType.SCHEDULED, {
                    data: []
                });

                if (this.stb && this.stb.dvr) {
                    this.locallyScheduled = new rx.BehaviorSubject([]);
                    this.locallyCancelled = new rx.BehaviorSubject([]);

                    this.source = this.reset.map(function () {
                        return true;
                    }).startWith(false).flatMapLatest(function (force) {
                        return _this.fetchAndCombineWithLocalChanges(force).startWith(_this.initialValue).takeUntil(_this.reset);
                    }).shareReplay(1);
                } else {
                    this.source = rx.Observable.never();
                }
            }

            _createClass(ScheduledRecordingsDatasource, [{
                key: 'fetchAndCombineWithLocalChanges',
                value: function fetchAndCombineWithLocalChanges(force) {
                    var _this2 = this;

                    this.locallyScheduled.onNext([]);
                    this.locallyCancelled.onNext([]);

                    return rx.Observable.combineLatest(this.fetch(force), this.locallyScheduled, this.locallyCancelled, function (fromStb, locallyScheduled, locallyCancelled) {
                        var recordings = fromStb.data.concat(locallyScheduled);
                        if (locallyScheduled.length > 0) {
                            recordings.sort(function (a, b) {
                                return a.startTime - b.startTime;
                            });
                        }

                        locallyCancelled.forEach(function (cancelled) {
                            var found = recordings.find(function (r) {
                                return _this2.recordingsEqual(r, cancelled);
                            });
                            if (found) {
                                var index = recordings.indexOf(found);
                                if (index > -1) {
                                    recordings.splice(index, 1);
                                }
                            }
                        });

                        if (locallyScheduled.length === 0 && locallyCancelled.length === 0) {
                            rdvrCacheService.createNewCache(recordingsListType.SCHEDULED, _this2.stb, {
                                data: recordings,
                                nextParams: fromStb.nextParams
                            });
                        } else {
                            rdvrCacheService.updateCache(recordingsListType.SCHEDULED, _this2.stb, {
                                data: recordings,
                                nextParams: fromStb.nextParams
                            });
                        }

                        return {
                            data: recordings.map(function (r) {
                                return _this2.wrapRecording(r);
                            }),
                            isComplete: !fromStb.nextParams,
                            error: fromStb.error,
                            lastUpdated: fromStb.lastUpdated,
                            busyUntil: fromStb.busyUntil
                        };
                    });
                }
            }, {
                key: 'fetch',
                value: function fetch(force) {
                    if (force) {
                        this.clearCache();
                    }

                    return this.batchGetWithCache({
                        getter: this.getOneScheduledRecordingBatch.bind(this),
                        initialParams: { startTime: 0, includeCurrent: true }
                    })['catch'](function (error) {
                        return rx.Observable.just({ data: [], error: error });
                    }).scan(this.mergeBatchesWithDuplicates.bind(this));
                }
            }, {
                key: 'scheduleRecording',
                value: function scheduleRecording(scheduledItem) {
                    var _this3 = this;

                    if (!this.stb || !this.stb.dvr) {
                        return $q.resolve();
                    }

                    var baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                    var fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrSchedule + '/' + scheduledItem.mystroServiceId + '/' + scheduledItem.tmsProgramId + '/' + scheduledItem.startTime + '/' + (scheduledItem.recordSeries ? 'series' : 'single');

                    var source = rxhttp.put(fullUrl, { settings: scheduledItem.settings }, { withCredentials: true });

                    // The server may return a 500 error due to a timeout, followed by a 439 indicating it's already
                    // scheduled. We want to treat this as a success.
                    source = this.expectErrors(source, [500, 439])['do'](function () {
                        var currentValue = _this3.locallyScheduled.getValue();
                        // unwraping the data delegate, so it can be saved to the cache correctly
                        currentValue.push(scheduledItem._context.data);
                        _this3.locallyScheduled.onNext(currentValue);
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
            }, {
                key: 'expectErrors',
                value: function expectErrors(source, expectedErrors) {
                    var retryDelay = arguments.length <= 2 || arguments[2] === undefined ? 500 : arguments[2];
                    var scheduler = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

                    return source.retryWhen(function (errors) {
                        return errors.take(expectedErrors.length).scan(function (memo, error) {
                            memo.push(error);
                            return memo;
                        }, []).flatMap(function (accumulatedErrors) {
                            var okSoFar = accumulatedErrors.every(function (e, i) {
                                return expectedErrors[i] === e.status;
                            });
                            if (okSoFar) {
                                if (accumulatedErrors.length === expectedErrors.length) {
                                    // All done. We got the predicted sequence of errors, so treat as success
                                    var error = accumulatedErrors[accumulatedErrors.length - 1];
                                    error._treatAsNotAnError = true;
                                    return rx.Observable['throw'](error);
                                } else {
                                    // The pattern matches so far, but we need to retry and see if it continues
                                    return rx.Observable.timer(retryDelay, scheduler);
                                }
                            } else {
                                // Pattern does not match. Throw the error.
                                return rx.Observable['throw'](accumulatedErrors[accumulatedErrors.length - 1]);
                            }
                        });
                    })['catch'](function (error) {
                        if (error.status === expectedErrors[expectedErrors.length - 1] && error._treatAsNotAnError) {
                            delete error._treatAsNotAnError;
                            return rx.Observable.just(error);
                        } else {
                            return rx.Observable['throw'](error);
                        }
                    });
                }
            }, {
                key: 'cancelScheduled',
                value: function cancelScheduled(scheduledItem, cancelSingle) {
                    var _this4 = this;

                    if (!this.stb || !this.stb.dvr) {
                        return rx.Observable.empty();
                    }

                    var baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                    var singleOrSeries = scheduledItem.recordSeries ? 'series' : 'single';

                    if (cancelSingle === true) {
                        singleOrSeries = 'single';
                    }

                    var fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrScheduled + '/' + scheduledItem.mystroServiceId + '/' + scheduledItem.tmsProgramId + '/' + scheduledItem.startTime + '/' + singleOrSeries;

                    var source = rxhttp['delete'](fullUrl, { withCredentials: true });

                    // The server may return a 500 error due to a timeout, followed by a 404 indicating it's already
                    // deleted. We want to treat this as a success.
                    source = this.expectErrors(source, [500, 404])['do'](function () {
                        var currentValue = _this4.locallyCancelled.getValue();
                        // unwraping the data delegate, so it can be saved to the cache correctly
                        currentValue.push(scheduledItem._context.data);
                        _this4.locallyCancelled.onNext(currentValue);
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
            }, {
                key: 'getOneScheduledRecordingBatch',
                value: function getOneScheduledRecordingBatch(_ref) {
                    var _this5 = this;

                    var startTime = _ref.startTime;
                    var includeCurrent = _ref.includeCurrent;

                    var params = {};
                    params.startUnixTimestampSeconds = startTime;
                    if (params.includeCurrent === true) {
                        params.includeCurrent = includeCurrent;
                    }

                    var url = config.piHost + config.nrsApi + this.getDvrBase() + this.stb.macAddressNormalized + config.services.dvrScheduled;

                    return rxhttp.get(url, { params: params, withCredentials: true }).retry(2).map(function (result) {
                        // Flatten current and future recordings into a single array
                        var recordings = undefined;
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
                        result.data = recordings.map(function (r) {
                            if (!r.programMetadata) {
                                _this5.createEmptyProgramMetadata(r);
                            }

                            return r;
                        });

                        return result;
                    });
                }
            }]);

            return ScheduledRecordingsDatasource;
        })(AbstractDatasource);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/scheduled-recordings-datasource.js.map
