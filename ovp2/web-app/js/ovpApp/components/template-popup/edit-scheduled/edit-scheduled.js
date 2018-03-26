(function () {
    'use strict';
    angular.module('ovpApp.components.templatePopup.editScheduled', [
        'ovpApp.components.ovp.channel',
        'ovpApp.services.stbService',
        'ovpApp.rdvr.rdvrService',
        'ovpApp.messages',
        'ovpApp.components.alert',
        'ovpApp.components.templatePopup',
        'ovpApp.components.ovp.button',
        'ovpApp.components.ovp.channel',
        'ovpApp.components.ovp.selectBox',
        'ovpApp.components.ovp.clickConfirm',
        'ovpApp.components.modal',
        'ovpApp.components.editConflict',
        'ovpApp.rdvr.cacheService',
        'ovpApp.services.dateFormat',
        'ovpApp.services.errorCodes',
        'ovpApp.directives.dropdownList',
        'ajoslin.promise-tracker'
    ])
    .component('editScheduled', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/template-popup/edit-scheduled/edit-scheduled.html',
        controller: class EditScheduled {
            constructor($rootScope, $element, stbService, rdvrService,
              $q, messages, dateFormat, promiseTracker,
              recordingViewModelDefinition, alert, modal, errorCodesService) {
                angular.extend(this, {$rootScope, $element, stbService, rdvrService,
                    $q, messages, dateFormat, promiseTracker,
                    recordingViewModelDefinition, alert, modal, errorCodesService});
            }

            $onChanges(changes) {
                if (changes.resolve) {
                    this.scheduledRecording = this.resolve.scheduledRecording;
                    this.seriesOnly = this.resolve.seriesOnly;

                    const isMovie = this.rdvrService.isMovie(this.scheduledRecording.tmsProgramId);
                    const availableTabs = {
                        SERIES: 'series',
                        EPISODE: 'episode'
                    };

                    this.dvrTracker = this.promiseTracker();
                    this.displayDate = this.dateFormat.absolute.expanded.atTime(new Date
                        (parseInt(this.scheduledRecording.startTime * 1000)));

                    this.model = {
                        availableTabs: availableTabs,
                        isSeries: false,
                        isMovie: isMovie,
                        updateDisabled: true,
                        selectedTab: this.scheduledRecording.recordSeries ?
                            availableTabs.SERIES : availableTabs.EPISODE,
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
                        deleteWhenSpaceIsNeeded: [
                            {label: 'Until Space Needed', value: true},
                            {label: 'Do Not Delete', value: false}
                        ],
                        numEpisodesToKeep: [
                            {label: '1 Episode', value: 1},
                            {label: '3 Episodes', value: 3},
                            {label: '5 Episodes', value: 5},
                            {label: '7 Episodes', value: 7},
                            {label: 'All Episodes', value: -1}
                        ],
                        recordOnlyNewEpisodes: [
                            {label: 'All Episodes', value: false},
                            {label: 'New Episodes', value: true}
                        ],
                        startAdjustMinutes: [
                            {label: 'Original Start Time', value: 0},
                            {label: '1 minute earlier', value: -1},
                            {label: '2 minutes earlier', value: -2},
                            {label: '3 minutes earlier', value: -3},
                            {label: '4 minutes earlier', value: -4},
                            {label: '5 minutes earlier', value: -5},
                            {label: '15 minutes earlier', value: -15},
                            {label: '30 minutes earlier', value: -30},
                            {label: '1 minute later', value: 1},
                            {label: '2 minutes later', value: 2},
                            {label: '3 minutes later', value: 3},
                            {label: '4 minutes later', value: 4},
                            {label: '5 minutes later', value: 5},
                            {label: '15 minutes later', value: 15}
                        ],
                        stopAdjustMinutes: [
                            {label: 'Original Stop Time', value: 0},
                            {label: '1 minute later', value: 1},
                            {label: '2 minutes later', value: 2},
                            {label: '3 minutes later', value: 3},
                            {label: '4 minutes later', value: 4},
                            {label: '5 minutes later', value: 5},
                            {label: '15 minutes later', value: 15},
                            {label: '30 minutes later', value: 30},
                            {label: '60 minutes later', value: 60},
                            {label: '120 minutes later', value: 120},
                            {label: '1 minute earlier', value: -1},
                            {label: '2 minutes earlier', value: -2},
                            {label: '3 minutes earlier', value: -3},
                            {label: '4 minutes earlier', value: -4},
                            {label: '5 minutes earlier', value: -5},
                            {label: '15 minutes earlier', value: -15}
                        ],
                        recordOnlyAtThisAirTime: [
                            {label: 'All Showings', value: false},
                            {label: 'Within Selected Time Slot', value: true}
                        ]
                    };

                    this.form = {};
                    this.settings = angular.copy(this.scheduledRecording.settings);
                    angular.forEach(this.scheduledRecording.settings, (val, key) => {
                        if (this.options[key]) {
                            this.form[key] = this.options[key].findIndex((opt) => opt.value === val);
                        }
                    });
                }
            }

            $doCheck() {
                if (this.model && this.model.selectedTab !== this.oldSelectedTab) {
                    const onEpisodeTab = this.model.selectedTab === this.model.availableTabs.EPISODE;
                    const onSeriesTab = this.model.selectedTab === this.model.availableTabs.SERIES;

                    this.model.showKeepUntil = this.model.isMovie || (this.model.showTabs && onEpisodeTab);
                    this.model.showSaveAtMost = this.model.showRecord = this.model.showAirTime = onSeriesTab;

                    if (this.model.isMovie) {
                        this.cancelLabel = 'Cancel Recording';
                    } else {
                        this.cancelLabel = 'Cancel ' + (onEpisodeTab ? 'Episode' : 'Series');
                    }

                    this.oldSelectedTab = this.model.selectedTab;
                }
            }

            isSeries() {
                return this.model.selectedTab === this.model.availableTabs.SERIES;
            }

            onSelect(key) {
                return (item) => {
                    this.form[key] = this.options[key].findIndex((opt) => opt.value === item.value);
                    angular.forEach(this.form, (val, key) => {
                        this.settings[key] = this.options[key][val].value;
                    });
                    this.model.updateDisabled = angular.equals(this.settings, this.scheduledRecording.settings) &&
                        !this.model.isNew;
                };
            }

            cancelSchedule() {
                this.stbService.getCurrentStb().then(stb => {
                    let promise = this.rdvrService.cancelScheduled(stb, this.scheduledRecording, !this.isSeries())
                        .then(
                            () => {
                                this.modalInstance.close({
                                    reason: 'cancel-schedule',
                                    recording: this.scheduledRecording
                                });
                            },
                            () => this.unknownCancelFailure()
                        );
                    this.dvrTracker.addPromise(promise);
                });
            }

            unknownCancelFailure() {
                this.alert.open(this.errorCodesService.getAlertForCode('WCM-9000'));
            }

            getCancelConfirm() {
                let message = 'Are you sure you want to cancel ';
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

            updateSchedule() {
                this.stbService.getCurrentStb().then(stb => {

                    let newRecordingData = angular.copy(this.scheduledRecording._context.data);
                    newRecordingData.settings = this.settings;
                    newRecordingData.recordSeries = this.model.selectedTab === this.model.availableTabs.SERIES;

                    const scheduleRecording = isNew => {
                        newRecordingData.isNew = isNew;

                        const recording = this.recordingViewModelDefinition.createInstance(newRecordingData);

                        let scheduleRecordingPromise = this.rdvrService.scheduleRecording(stb, recording)
                            .then(
                                () => {
                                    this.modalInstance.close({
                                        reason: 'update-schedule',
                                        recording: recording
                                    });
                                },
                                (error) => {
                                    if (error.status === 409) {
                                        let conflicts = error.data.conflictingRecordings
                                            .map(r => this.recordingViewModelDefinition.createInstance(r));

                                        schedulingConflict(conflicts);
                                    } else if (error.status === 439) {
                                        this.alreadyScheduled();
                                    } else {
                                        this.unknownUpdateFailure();
                                    }
                                }
                            );
                        this.dvrTracker.addPromise(scheduleRecordingPromise);
                    };

                    let self = this;

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
                                    onCancel: () => self.modalInstance.close('failed to resolve conflict')
                                }
                            }
                        });
                    }

                    if (!this.model.isNew) {
                        let cancelScheduledPromise = this.rdvrService.cancelScheduled(stb, this.scheduledRecording)
                            .then(
                                () => scheduleRecording(false),
                                () => this.unknownUpdateFailure()
                            );
                        this.dvrTracker.addPromise(cancelScheduledPromise);
                    } else {
                        scheduleRecording(true);
                    }
                });
            }

            alreadyScheduled() {
                this.alert.open({
                    message: this.errorCodesService.getMessageForCode('WCM-1439', {
                        'TITLE': this.scheduledRecording.title
                    }),
                    title: this.errorCodesService.getHeaderForCode('WCM-1439'),
                    buttonText: 'OK'
                });
            }

            unknownUpdateFailure() {
                this.alert.open({
                    message: this.errorCodesService.getMessageForCode('WCM-1400', {
                        'TITLE': this.scheduledRecording.title
                    }),
                    title: this.errorCodesService.getHeaderForCode('WCM-1400'),
                    buttonText: 'OK'
                });
            }
        }
    });
}());
