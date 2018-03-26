'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * rdvrScheduled
     *
     * Scheduled recordings subpage for Remote DVR
     *
     * Example Usage:
     * <rdvr-scheduled></rdvr-scheduled>
     */
    angular.module('ovpApp.rdvr.scheduled', ['ovpApp.components.alert', 'ovpApp.messages', 'ovpApp.rdvr.scheduledItem', 'ovpApp.directives.quiet-loading-tracker', 'ovpApp.services.rxUtils', 'ovpApp.components.confirm', 'ovpApp.services.errorCodes', 'ovpApp.dataDelegate', 'angularMoment']).component('rdvrScheduled', {
        templateUrl: '/js/ovpApp/rdvr/scheduled/scheduled.html',
        controller: (function () {
            /* @ngInject */

            RdvrScheduled.$inject = ["stbService", "rdvrService", "$rootScope", "rx", "createObservableFunction", "$q", "modal", "CONFIRM_BUTTON_TYPE", "dateUtil", "messages", "alert", "$state", "errorCodesService", "delegateFactory", "moment"];
            function RdvrScheduled(stbService, rdvrService, $rootScope, rx, createObservableFunction, $q, modal, CONFIRM_BUTTON_TYPE, dateUtil, messages, alert, $state, errorCodesService, delegateFactory, moment) {
                _classCallCheck(this, RdvrScheduled);

                angular.extend(this, { stbService: stbService, rdvrService: rdvrService, $rootScope: $rootScope, rx: rx, createObservableFunction: createObservableFunction, $q: $q,
                    modal: modal, CONFIRM_BUTTON_TYPE: CONFIRM_BUTTON_TYPE, dateUtil: dateUtil, messages: messages, alert: alert, $state: $state, errorCodesService: errorCodesService,
                    delegateFactory: delegateFactory, moment: moment });
            }

            _createClass(RdvrScheduled, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.teardown = this.createObservableFunction();

                    this.stbService.currentStbSource.filter(function (stb) {
                        return stb.dvr;
                    })['do'](function (stb) {
                        return _this.stb = stb;
                    }).flatMap(function (stb) {
                        return _this.getScheduledRecordings(stb);
                    }).takeUntil(this.teardown).subscribe(function (result) {
                        _this.processRecordings(result);

                        _this.updateLoadingIndicators(result);

                        _this.handleError(result);
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.teardown();
                }
            }, {
                key: 'getScheduledRecordings',
                value: function getScheduledRecordings(stb) {
                    var stbChanged = this.stbService.currentStbSource.skip(1);

                    return this.rdvrService.getScheduledRecordings(stb).takeUntil(stbChanged);
                }
            }, {
                key: 'processRecordings',
                value: function processRecordings(_ref) {
                    var _this2 = this;

                    var data = _ref.data;

                    if (data && data.length > 0) {
                        this.recordings = data.map(this.delegateFactory.createInstance).reduce(function (rec, obj) {
                            var today = _this2.moment().hours(0).minutes(0).seconds(0).unix();
                            if (obj && obj.startTime) {
                                var day = _this2.moment(parseInt(obj.startTime * 1000));
                                var date = day.format('MMMM Do');
                                if (!rec[date]) {
                                    rec[date] = {
                                        label: day.format('dddd'),
                                        date: date,
                                        startTime: day.hours(0).minutes(0).seconds(0).unix(),
                                        recordings: []
                                    };
                                    if (day.unix() < today + 86400) {
                                        rec[date].label = 'Today';
                                    } else if (day.unix() < today + 172800) {
                                        rec[date].label = 'Tomorrow';
                                    }
                                }
                                if (obj.cancelScheduledSelection === undefined) {
                                    obj.cancelScheduledSelection = false;
                                }
                                // obj.day = rec[date];
                                rec[date].recordings.push(obj);
                            }
                            return rec;
                        }, {});
                        this.recordings = Object.keys(this.recordings).map(function (key) {
                            return _this2.recordings[key];
                        }).sort(function (a, b) {
                            return a.startTime - b.startTime;
                        });
                    } else {
                        this.recordings = [];
                    }
                }
            }, {
                key: 'updateLoadingIndicators',
                value: function updateLoadingIndicators(_ref2) {
                    var data = _ref2.data;
                    var isComplete = _ref2.isComplete;
                    var error = _ref2.error;

                    if (error) {
                        if (this.loadingFirstBatch) {
                            this.loadingFirstBatch.reject();
                            this.loadingFirstBatch = undefined;
                        }

                        if (this.loadingRemainingBatches) {
                            this.loadingRemainingBatches.reject();
                            this.loadingRemainingBatches = undefined;
                        }
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    } else if (data.length === 0 && !isComplete) {
                        // Start of fetch; show full loading indicator
                        if (this.loadingFirstBatch) {
                            this.loadingFirstBatch.reject();
                        }
                        if (this.loadingRemainingBatches) {
                            this.loadingRemainingBatches.reject();
                            this.loadingRemainingBatches = undefined;
                        }
                        this.loadingFirstBatch = this.$q.defer();
                        this.$rootScope.$broadcast('message:loading', this.loadingFirstBatch.promise, undefined, 'DVR Scheduled');
                    } else if (data.length > 0 && !isComplete) {
                        // Data is partially loaded. Show partial loading indicator
                        if (this.loadingFirstBatch) {
                            this.loadingFirstBatch.resolve();
                            this.loadingFirstBatch = undefined;
                        }

                        if (!this.loadingRemainingBatches) {
                            this.loadingRemainingBatches = this.$q.defer();
                        }
                    } else {
                        // Data is fully loaded.
                        if (this.loadingFirstBatch) {
                            this.loadingFirstBatch.resolve();
                            this.loadingFirstBatch = undefined;
                        }

                        if (this.loadingRemainingBatches) {
                            this.loadingRemainingBatches.resolve();
                            this.loadingRemainingBatches = undefined;
                        }
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    }
                }
            }, {
                key: 'handleError',
                value: function handleError(_ref3) {
                    var data = _ref3.data;
                    var error = _ref3.error;

                    this.error = error;
                    if (this.error) {
                        if (!data || data.length === 0) {
                            // Failed to get first chunk
                            this.alert.open({
                                message: this.errorCodesService.getMessageForCode('WCM-9000'),
                                title: this.errorCodesService.getHeaderForCode('WCM-1009'),
                                buttonText: 'OK'
                            });
                        }
                        // else, partial failure
                    }
                }
            }, {
                key: 'dayLabel',
                value: function dayLabel(recording) {
                    if (recording && recording.startTime) {
                        return this.stbService.getDayLabel(new Date(recording.startTime * 1000));
                    }
                }
            }, {
                key: 'dayDisplay',
                value: function dayDisplay(recording) {
                    if (recording && recording.startTime) {
                        return this.stbService.formatUnix(recording.startTime, 'mmmm dx');
                    }
                }
            }, {
                key: 'onCheckboxStateChanged',
                value: function onCheckboxStateChanged(recording, state) {
                    recording.cancelScheduledSelection = state;
                }
            }, {
                key: 'unselectAll',
                value: function unselectAll() {
                    this.recordings.forEach(function (r) {
                        return r.cancelScheduledSelection = false;
                    });
                }
            }, {
                key: 'cancelRecordings',
                value: function cancelRecordings() {
                    var _this3 = this;

                    var recordingsArray = [];
                    this.recordings.filter(function (day) {
                        day.recordings.filter(function (recording) {
                            if (recording.cancelScheduledSelection === true) {
                                recordingsArray.push(recording);
                            }
                        });
                    });
                    var count = recordingsArray.length;
                    var plural = count > 1 ? 's' : '';
                    var message = 'Are you sure you want to cancel ' + count + ' recording' + plural + '?';

                    var options = {
                        okLabel: this.CONFIRM_BUTTON_TYPE.YES,
                        cancelLabel: this.CONFIRM_BUTTON_TYPE.NO,
                        preOkMessage: message,
                        inProgressMessage: 'Cancelling ' + count + ' recording' + plural,
                        okAction: function okAction() {
                            var promises = recordingsArray.forEach(function (r) {
                                return _this3.rdvrService.cancelScheduled(_this3.stb, r, true);
                            });

                            return _this3.$q.all(promises).then(function () {}, function () {
                                _this3.alert.open(_this3.errorCodesService.getAlertForCode('WCM-2405'));
                            });
                        }
                    };

                    this.modal.open({
                        component: 'confirm',
                        resolve: {
                            options: options
                        }
                    });
                }
            }]);

            return RdvrScheduled;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/scheduled/scheduled.js.map
