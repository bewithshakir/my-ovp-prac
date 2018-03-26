(function () {
    'use strict';

    angular
        .module('ovpApp.cdvr')
        .component('cdvrScheduleListItem', {
            bindings: {
                asset: '<'
            },
            templateUrl: '/js/ovpApp/cdvr/cdvr-schedule-list-item.html',
            controller: class CdvrScheduleListItem {
                /* @ngInject */
                constructor($state, cdvrService) {
                    this.$state = $state;
                    this.cdvrService = cdvrService;
                }

                $onInit() {
                    this.channelNumber = '--';

                    this.cdvrService.getChannelNumber(this.asset)
                        .then(channelNumber => this.channelNumber = channelNumber);
                }

                click() {
                    let route = this.asset.clickRoute;
                    if (route) {
                        let recording = this.asset.cdvrRecording;
                        if (recording) {
                            //Attempt to pass in the correct time and day
                            if (recording.tmsSeriesId) {
                                this.$state.go('product.series', {
                                    tmsSeriesId: recording.tmsSeriesId,
                                    tmsProgramId: recording.tmsProgramId,
                                    airtime: recording.startTimeSec,
                                    tmsGuideId: recording.tmsGuideId
                                });
                            } else {
                                //Maybe this should be the default if we can get airtime and serviceId
                                this.$state.go('product.event', {
                                    tmsId: recording.tmsProgramId,
                                    airtime: recording.startTimeSec,
                                    tmsGuideId: recording.tmsGuideId
                                });
                            }
                        } else {
                            this.$state.go(...route);
                        }
                    }
                }

                getTitlePrefix() {
                    let prefix = '';
                    if (this.asset.isEntitled === false) {
                        prefix = 'Not Entitled';
                    }
                    return prefix;
                }
            }
        });
}());
