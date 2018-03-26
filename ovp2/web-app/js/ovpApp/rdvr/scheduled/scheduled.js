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
    angular.module('ovpApp.rdvr.scheduled', [
            'ovpApp.components.alert',
            'ovpApp.messages',
            'ovpApp.rdvr.scheduledItem',
            'ovpApp.directives.quiet-loading-tracker',
            'ovpApp.services.rxUtils',
            'ovpApp.components.confirm',
            'ovpApp.services.errorCodes',
            'ovpApp.dataDelegate',
            'angularMoment'
        ])
        .component('rdvrScheduled', {
            templateUrl: '/js/ovpApp/rdvr/scheduled/scheduled.html',
            controller: class RdvrScheduled {
                /* @ngInject */
                constructor(stbService, rdvrService, $rootScope, rx, createObservableFunction, $q,
                    modal, CONFIRM_BUTTON_TYPE, dateUtil, messages, alert, $state, errorCodesService,
                    delegateFactory, moment) {
                    angular.extend(this, {stbService, rdvrService, $rootScope, rx, createObservableFunction, $q,
                        modal, CONFIRM_BUTTON_TYPE, dateUtil, messages, alert, $state, errorCodesService,
                        delegateFactory, moment});
                }

                $onInit() {
                    this.teardown = this.createObservableFunction();

                    this.stbService.currentStbSource
                        .filter(stb => stb.dvr)
                        .do(stb => this.stb = stb)
                        .flatMap(stb => this.getScheduledRecordings(stb))
                        .takeUntil(this.teardown)
                        .subscribe(
                            result => {
                                this.processRecordings(result);

                                this.updateLoadingIndicators(result);

                                this.handleError(result);
                            }
                        );
                }

                $onDestroy() {
                    this.teardown();
                }

                getScheduledRecordings(stb) {
                    const stbChanged = this.stbService.currentStbSource.skip(1);

                    return this.rdvrService.getScheduledRecordings(stb)
                        .takeUntil(stbChanged);
                }

                processRecordings({data}) {
                    if (data && data.length > 0) {
                        this.recordings = data
                        .map(this.delegateFactory.createInstance)
                        .reduce((rec, obj) => {
                            let today = this.moment().hours(0).minutes(0).seconds(0).unix();
                            if (obj && obj.startTime) {
                                let day = this.moment(parseInt(obj.startTime * 1000));
                                let date = day.format('MMMM Do');
                                if (!rec[date]) {
                                    rec[date] = {
                                        label: day.format('dddd'),
                                        date: date,
                                        startTime: day.hours(0).minutes(0).seconds(0).unix(),
                                        recordings: []
                                    };
                                    if (day.unix() < (today + 86400)) {
                                        rec[date].label = 'Today';
                                    } else if (day.unix() < (today + 172800)) {
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
                        this.recordings = Object.keys(this.recordings)
                        .map(key => this.recordings[key])
                        .sort((a,b) => a.startTime - b.startTime);
                    } else {
                        this.recordings = [];
                    }
                }

                updateLoadingIndicators({data, isComplete, error}) {
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
                        this.$rootScope.$broadcast(
                            'message:loading',
                            this.loadingFirstBatch.promise,
                            undefined,
                            'DVR Scheduled'
                        );
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

                handleError({data, error}) {
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

                dayLabel(recording) {
                    if (recording && recording.startTime) {
                        return this.stbService.getDayLabel(new Date(recording.startTime * 1000));
                    }
                }

                dayDisplay(recording) {
                    if (recording && recording.startTime) {
                        return this.stbService.formatUnix(recording.startTime, 'mmmm dx');
                    }
                }

                onCheckboxStateChanged(recording, state) {
                    recording.cancelScheduledSelection = state;
                }

                unselectAll() {
                    this.recordings.forEach(r => r.cancelScheduledSelection = false);
                }

                cancelRecordings() {
                    let recordingsArray = [];
                    this.recordings.filter((day) => {
                        day.recordings.filter(recording => {
                            if (recording.cancelScheduledSelection === true) {
                                recordingsArray.push(recording);
                            }
                        });
                    });
                    const count = recordingsArray.length;
                    const plural = (count > 1 ? 's' : '');
                    const message = `Are you sure you want to cancel ${count} recording${plural}?`;

                    const options = {
                        okLabel: this.CONFIRM_BUTTON_TYPE.YES,
                        cancelLabel: this.CONFIRM_BUTTON_TYPE.NO,
                        preOkMessage: message,
                        inProgressMessage: `Cancelling ${count} recording${plural}`,
                        okAction: () => {
                            let promises = recordingsArray.forEach(r => 
                                this.rdvrService.cancelScheduled(this.stb, r, true));

                            return this.$q.all(promises)
                                .then(
                                    () => {},
                                    () => {
                                        this.alert.open(this.errorCodesService.getAlertForCode('WCM-2405'));
                                    }
                                );
                        }
                    };

                    this.modal.open({
                        component: 'confirm',
                        resolve: {
                            options
                        }
                    });
                }
            }
        });
})();
