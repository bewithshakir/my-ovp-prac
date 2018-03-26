(function () {
    'use strict';

    /**
     * rdvrRecordingListItem
     *
     * Example Usage:
     * <component-name recording="someInputValue" on-selected="outputCallback(param)"></component-name>
     *
     * Bindings:
     *    recording: ([type]) [description]
     *    onStateChanged: (function) callback when the selection state changes
     */
    angular.module('ovpApp.rdvr.recordingItem', [
        'ovpApp.components.alert',
        'ovpApp.messages',
        'ovpApp.rdvr.rdvrService',
        'ovpApp.services.stbService',
        'ovpApp.services.errorCodes'
        ])
        .component('rdvrRecordingListItem', {
            bindings: {
                recording: '<',
                state: '<',
                onStateChanged: '&'
            },
            templateUrl: '/js/ovpApp/rdvr/my-recordings/recording-item.html',
            controller: class ComponentName {
                /* @ngInject */
                constructor($state, stbService, rdvrService, $rootScope, messages, alert, errorCodesService) {
                    angular.extend(this, {$state, stbService, rdvrService, $rootScope, messages, alert,
                        errorCodesService});
                }

                $onChanges(changes) {
                    if (changes.state && typeof this.state !== 'boolean') {
                        this.state = false;
                    }
                }

                episodeTitleDescription() {
                    if (!this.recording || this.recording.episodes[0].isMovie) {
                        return '';
                    } else {
                        const episodeCount = this.recording.episodes.length;
                        if (episodeCount === 1) {
                            return this.recording.episodes[0].episodeTitle;
                        } else {
                            return `${episodeCount} Episodes`;
                        }
                    }
                }

                click() {
                    let isSeries = angular.isDefined(this.recording.episodes[0].tmsSeriesId);
                    let episode = this.recording.episodes[0];
                    if (isSeries) {
                        this.$state.go('product.series', {
                            tmsSeriesId: episode.tmsSeriesId,
                            airtime: episode.startTime,
                            serviceId: episode.mystroServiceId
                        });
                    } else {
                        this.$state.go('product.event', {
                            tmsId: episode.tmsProgramId,
                            airtime: episode.startTime,
                            serviceId: episode.mystroServiceId
                        });
                    }

                    // eventGatewayProductPageService.viewShown('contentDetails', 'modalPopup', 'plain', {
                    //     category: 'My Recordings',
                    //     contentType: 'linear'
                    // });
                }

                stateToggled($event) {
                    $event.stopPropagation();
                    this.onStateChanged({recording: this.recording, state: this.state});
                }

                watchRecording() {
                    // $rootScope.$emit('EG:sendSwitchScreen', {
                    //     playerType: 'dvr',
                    //     assetMetadata: {
                    //         airingTime: episode.startUnixTimestampSeconds * 1000,
                    //         channelNumber: episode.displayChannel.toString(),
                    //         tmsGuideId: episode.mystroServiceId.toString()
                    //     },
                    //     direction: 'to',
                    //     otherDevice: 'stb'
                    // });


                    let promise = this.stbService.getCurrentStb()
                        .then(stb => {
                            return this.rdvrService.resumeCompletedRecording(stb, this.recording.episodes[0]);
                        })
                        .then(
                            () => {},
                            () => {
                                this.alert.open(this.errorCodesService.getAlertForCode('WCM-1603'));
                            }
                        );

                    this.$rootScope.$broadcast(
                        'message:loading',
                        promise,
                        undefined,
                        this.recording.episodes[0].title
                    );
                }
            }
        });
})();
