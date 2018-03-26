'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.templatePopup.editScheduled', ['ovpApp.components.ovp.channel', 'ovpApp.services.stbService', 'ovpApp.rdvr.rdvrService', 'ovpApp.messages', 'ovpApp.components.alert', 'ovpApp.components.templatePopup', 'ovpApp.components.ovp.button', 'ovpApp.components.ovp.channel', 'ovpApp.components.ovp.selectBox', 'ovpApp.components.ovp.clickConfirm', 'ovpApp.components.modal', 'ovpApp.components.editConflict', 'ovpApp.rdvr.cacheService', 'ovpApp.services.dateFormat', 'ovpApp.services.errorCodes', 'ovpApp.directives.dropdownList', 'ajoslin.promise-tracker']).component('editScheduled', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/template-popup/edit-scheduled/edit-scheduled.html',
        controller: (function () {
            EditScheduled.$inject = ["$rootScope", "$element", "stbService", "rdvrService", "$q", "messages", "dateFormat", "promiseTracker", "recordingViewModelDefinition", "alert", "modal", "errorCodesService"];
            function EditScheduled($rootScope, $element, stbService, rdvrService, $q, messages, dateFormat, promiseTracker, recordingViewModelDefinition, alert, modal, errorCodesService) {
                _classCallCheck(this, EditScheduled);

                angular.extend(this, { $rootScope: $rootScope, $element: $element, stbService: stbService, rdvrService: rdvrService,
                    $q: $q, messages: messages, dateFormat: dateFormat, promiseTracker: promiseTracker,
                    recordingViewModelDefinition: recordingViewModelDefinition, alert: alert, modal: modal, errorCodesService: errorCodesService });
            }

            _createClass(EditScheduled, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    var _this = this;

                    if (changes.resolve) {
                        this.scheduledRecording = this.resolve.scheduledRecording;
                        this.seriesOnly = this.resolve.seriesOnly;

                        var isMovie = this.rdvrService.isMovie(this.scheduledRecording.tmsProgramId);
                        var availableTabs = {
                            SERIES: 'series',
                            EPISODE: 'episode'
                        };

                        this.dvrTracker = this.promiseTracker();
                        this.displayDate = this.dateFormat.absolute.expanded.atTime(new Date(parseInt(this.scheduledRecording.startTime * 1000)));

                        this.model = {
                            availableTabs: availableTabs,
                            isSeries: false,
                            isMovie: isMovie,
                            updateDisabled: true,
                            selectedTab: this.scheduledRecording.recordSeries ? availableTabs.SERIES : availableTabs.EPISODE,
                            showKeepUntil: false,
                            showSaveAtMost: false,
                            showRecord: false,
                            showStartTime: true,
                            showStopTime: true,
                            showAirTime: false,
                            isNew: this.scheduledRecording.isNew
                        };

                        if (this.model.isNew) {
                            this.model.updateDisabled = false;
                        }

                        this.options = {
                            deleteWhenSpaceIsNeeded: [{ label: 'Until Space Needed', value: true }, { label: 'Do Not Delete', value: false }],
                            numEpisodesToKeep: [{ label: '1 Episode', value: 1 }, { label: '3 Episodes', value: 3 }, { label: '5 Episodes', value: 5 }, { label: '7 Episodes', value: 7 }, { label: 'All Episodes', value: -1 }],
                            recordOnlyNewEpisodes: [{ label: 'All Episodes', value: false }, { label: 'New Episodes', value: true }],
                            startAdjustMinutes: [{ label: 'Original Start Time', value: 0 }, { label: '1 minute earlier', value: -1 }, { label: '2 minutes earlier', value: -2 }, { label: '3 minutes earlier', value: -3 }, { label: '4 minutes earlier', value: -4 }, { label: '5 minutes earlier', value: -5 }, { label: '15 minutes earlier', value: -15 }, { label: '30 minutes earlier', value: -30 }, { label: '1 minute later', value: 1 }, { label: '2 minutes later', value: 2 }, { label: '3 minutes later', value: 3 }, { label: '4 minutes later', value: 4 }, { label: '5 minutes later', value: 5 }, { label: '15 minutes later', value: 15 }],
                            stopAdjustMinutes: [{ label: 'Original Stop Time', value: 0 }, { label: '1 minute later', value: 1 }, { label: '2 minutes later', value: 2 }, { label: '3 minutes later', value: 3 }, { label: '4 minutes later', value: 4 }, { label: '5 minutes later', value: 5 }, { label: '15 minutes later', value: 15 }, { label: '30 minutes later', value: 30 }, { label: '60 minutes later', value: 60 }, { label: '120 minutes later', value: 120 }, { label: '1 minute earlier', value: -1 }, { label: '2 minutes earlier', value: -2 }, { label: '3 minutes earlier', value: -3 }, { label: '4 minutes earlier', value: -4 }, { label: '5 minutes earlier', value: -5 }, { label: '15 minutes earlier', value: -15 }],
                            recordOnlyAtThisAirTime: [{ label: 'All Showings', value: false }, { label: 'Within Selected Time Slot', value: true }]
                        };

                        this.form = {};
                        this.settings = angular.copy(this.scheduledRecording.settings);
                        angular.forEach(this.scheduledRecording.settings, function (val, key) {
                            if (_this.options[key]) {
                                _this.form[key] = _this.options[key].findIndex(function (opt) {
                                    return opt.value === val;
                                });
                            }
                        });
                    }
                }
            }, {
                key: '$doCheck',
                value: function $doCheck() {
                    if (this.model && this.model.selectedTab !== this.oldSelectedTab) {
                        var onEpisodeTab = this.model.selectedTab === this.model.availableTabs.EPISODE;
                        var onSeriesTab = this.model.selectedTab === this.model.availableTabs.SERIES;

                        this.model.showKeepUntil = this.model.isMovie || this.model.showTabs && onEpisodeTab;
                        this.model.showSaveAtMost = this.model.showRecord = this.model.showAirTime = onSeriesTab;

                        if (this.model.isMovie) {
                            this.cancelLabel = 'Cancel Recording';
                        } else {
                            this.cancelLabel = 'Cancel ' + (onEpisodeTab ? 'Episode' : 'Series');
                        }

                        this.oldSelectedTab = this.model.selectedTab;
                    }
                }
            }, {
                key: 'isSeries',
                value: function isSeries() {
                    return this.model.selectedTab === this.model.availableTabs.SERIES;
                }
            }, {
                key: 'onSelect',
                value: function onSelect(key) {
                    var _this2 = this;

                    return function (item) {
                        _this2.form[key] = _this2.options[key].findIndex(function (opt) {
                            return opt.value === item.value;
                        });
                        angular.forEach(_this2.form, function (val, key) {
                            _this2.settings[key] = _this2.options[key][val].value;
                        });
                        _this2.model.updateDisabled = angular.equals(_this2.settings, _this2.scheduledRecording.settings) && !_this2.model.isNew;
                    };
                }
            }, {
                key: 'cancelSchedule',
                value: function cancelSchedule() {
                    var _this3 = this;

                    this.stbService.getCurrentStb().then(function (stb) {
                        var promise = _this3.rdvrService.cancelScheduled(stb, _this3.scheduledRecording, !_this3.isSeries()).then(function () {
                            _this3.modalInstance.close({
                                reason: 'cancel-schedule',
                                recording: _this3.scheduledRecording
                            });
                        }, function () {
                            return _this3.unknownCancelFailure();
                        });
                        _this3.dvrTracker.addPromise(promise);
                    });
                }
            }, {
                key: 'unknownCancelFailure',
                value: function unknownCancelFailure() {
                    this.alert.open(this.errorCodesService.getAlertForCode('WCM-9000'));
                }
            }, {
                key: 'getCancelConfirm',
                value: function getCancelConfirm() {
                    var message = 'Are you sure you want to cancel ';
                    if (this.model.selectedTab === this.model.availableTabs.EPISODE) {
                        message += (this.model.isMovie ? 'the recording' : 'this episode') + ' of ';
                        message += this.scheduledRecording.title;
                    } else {
                        message += 'all recordings for this series';
                    }
                    message += '?';
                    return {
                        title: 'Cancel Recording',
                        message: message
                    };
                }
            }, {
                key: 'updateSchedule',
                value: function updateSchedule() {
                    var _this4 = this;

                    this.stbService.getCurrentStb().then(function (stb) {

                        var newRecordingData = angular.copy(_this4.scheduledRecording._context.data);
                        newRecordingData.settings = _this4.settings;
                        newRecordingData.recordSeries = _this4.model.selectedTab === _this4.model.availableTabs.SERIES;

                        var scheduleRecording = function scheduleRecording(isNew) {
                            newRecordingData.isNew = isNew;

                            var recording = _this4.recordingViewModelDefinition.createInstance(newRecordingData);

                            var scheduleRecordingPromise = _this4.rdvrService.scheduleRecording(stb, recording).then(function () {
                                _this4.modalInstance.close({
                                    reason: 'update-schedule',
                                    recording: recording
                                });
                            }, function (error) {
                                if (error.status === 409) {
                                    var conflicts = error.data.conflictingRecordings.map(function (r) {
                                        return _this4.recordingViewModelDefinition.createInstance(r);
                                    });

                                    schedulingConflict(conflicts);
                                } else if (error.status === 439) {
                                    _this4.alreadyScheduled();
                                } else {
                                    _this4.unknownUpdateFailure();
                                }
                            });
                            _this4.dvrTracker.addPromise(scheduleRecordingPromise);
                        };

                        var self = _this4;

                        function schedulingConflict(conflictingRecordings) {
                            self.modal.open({
                                showCloseIcon: false,
                                backdrop: 'static',
                                component: 'editConflict',
                                resolve: {
                                    model: {
                                        scheduledRecording: self.scheduledRecording,
                                        conflictingRecordings: conflictingRecordings,
                                        oneTimeOnly: true,
                                        isNotYetScheduled: true,
                                        onKeep: scheduleRecording,
                                        onCancel: function onCancel() {
                                            return self.modalInstance.close('failed to resolve conflict');
                                        }
                                    }
                                }
                            });
                        }

                        if (!_this4.model.isNew) {
                            var cancelScheduledPromise = _this4.rdvrService.cancelScheduled(stb, _this4.scheduledRecording).then(function () {
                                return scheduleRecording(false);
                            }, function () {
                                return _this4.unknownUpdateFailure();
                            });
                            _this4.dvrTracker.addPromise(cancelScheduledPromise);
                        } else {
                            scheduleRecording(true);
                        }
                    });
                }
            }, {
                key: 'alreadyScheduled',
                value: function alreadyScheduled() {
                    this.alert.open({
                        message: this.errorCodesService.getMessageForCode('WCM-1439', {
                            'TITLE': this.scheduledRecording.title
                        }),
                        title: this.errorCodesService.getHeaderForCode('WCM-1439'),
                        buttonText: 'OK'
                    });
                }
            }, {
                key: 'unknownUpdateFailure',
                value: function unknownUpdateFailure() {
                    this.alert.open({
                        message: this.errorCodesService.getMessageForCode('WCM-1400', {
                            'TITLE': this.scheduledRecording.title
                        }),
                        title: this.errorCodesService.getHeaderForCode('WCM-1400'),
                        buttonText: 'OK'
                    });
                }
            }]);

            return EditScheduled;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/template-popup/edit-scheduled/edit-scheduled.js.map
