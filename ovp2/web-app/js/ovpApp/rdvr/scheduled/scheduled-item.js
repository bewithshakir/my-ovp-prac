(function () {
    'use strict';

    /**
     * rdvrScheduledItem
     *
     * Example Usage:
     * <rdvr-schedule-list-item
     *    recording="someInputObject"
     *    on-state-changed="someCallback">
     * </rdvr-schedule-list-item>
     *
     * Bindings:
     *    recording: (object) the recording
     *    state: (boolean) whether it is checked or not. defaults to false
     *    onStateChanged: (function) callback when the selection state changes
     */
    angular.module('ovpApp.rdvr.scheduledItem', [
            'ovpApp.messages',
            'ovpApp.config',
            'ovpApp.components.ovp.checkBox',
            'ovpApp.components.modal',
            'ovpApp.components.editConflict',
            'ovpApp.services.errorCodes',
            'ovpApp.product.productActionService'
        ])
        .component('rdvrScheduleListItem', {
            bindings: {
                recording: '=',
                state: '<',
                onStateChanged: '&',
                day: '<',
                cancelCallBack: '&'
            },
            templateUrl: '/js/ovpApp/rdvr/scheduled/scheduled-item.html',
            controller: class RdvrScheduledItem {
                /* @ngInject */
                constructor($state, messages, rdvrCacheService, stbService, $rootScope, alert,
                    modal, rdvrService, recordingsListType, errorCodesService, productService,
                    productActionService, actionTypeMap) {
                    angular.extend(this, {$state, messages, rdvrCacheService, stbService, $rootScope, alert,
                        modal, rdvrService, recordingsListType, errorCodesService, productService,
                        productActionService, actionTypeMap});
                }

                $onChanges(changes) {
                    if (changes.recording) {
                        this.startTime = this.stbService.formatUnix(this.recording.startTime, 'h:nn a');
                    }

                    if (changes.state && typeof this.state !== 'boolean') {
                        this.state = false;
                    }
                }

                click() {
                    if (this.recording.conflicted) {
                        this.showConflictPopup();
                    } else {
                        this.showProductPage();
                    }
                }

                productActionClicked () {
                    this.recording.cancelScheduledSelection = true;
                    this.cancelCallBack();
                }

                stateToggled($event) {
                    $event.stopPropagation();
                    this.onStateChanged({recording: this.recording, state: this.state});
                }

                isMovie(recording = this.recording) {
                    return this.rdvrService.isMovie(recording.tmsProgramId);
                }

                showConflictPopup(recording = this.recording) {
                    let promise = this.stbService.getCurrentStb()
                        .then(stb => this.rdvrService.getScheduledConflicts(stb, recording));

                    this.$rootScope.$broadcast(
                        'message:loading',
                        promise,
                        'DVR Scheduled'
                    );

                    promise.then(conflicts => {
                        //its possible that another client updated the conflicts after user loaded
                        //the page with results
                        if (angular.isDefined(conflicts) && conflicts.length === 0) {
                            this.rdvrCacheService.clearCache(this.recordingsListType.SCHEDULED, this.setTopBox);

                            this.alert.open({
                                message: this.errorCodesService.getMessageForCode('WCM-9000'),
                                title: this.errorCodesService.getMessageForCode('WCM-1016'),
                                buttonText: 'OK'
                            });
                        } else {
                            this.modal.open({
                                showCloseIcon: false,
                                backdrop: 'static',
                                component: 'editConflict',
                                resolve: {
                                    model: {
                                        scheduledRecording: this.recording,
                                        conflictingRecordings: conflicts
                                    }
                                }
                            });
                        }
                    }, () => {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WCM-9000'),
                            title: this.errorCodesService.getMessageForCode('WCM-1016'),
                            buttonText: 'OK'
                        });
                    });
                }

                showProductPage(recording = this.recording) {
                    let isSeries = angular.isDefined(recording.tmsSeriesId);
                    if (isSeries) {
                        this.$state.go('product.series', {
                            tmsSeriesId: recording.tmsSeriesId,
                            serviceId: recording.mystroServiceId,
                            airtime: recording.startTime,
                            tmsProgramId: recording.tmsProgramId
                        });
                    } else {
                        this.$state.go('product.event', {
                            tmsId: recording.tmsProgramId,
                            serviceId: recording.mystroServiceId,
                            airtime: recording.startTime
                        });
                    }
                }
            }
        });
})();
