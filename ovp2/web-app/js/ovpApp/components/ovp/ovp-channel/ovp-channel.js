(() => {
    'use strict';
    angular.module('ovpApp.components.ovp.channel', [
            'ovpApp.config',
            'ovpApp.services.epgsService'
        ])
        .component('ovpChannel', {
            templateUrl: '/js/ovpApp/components/ovp/ovp-channel/ovp-channel.html',
            bindings: {
                mystroServiceId: '<',
                channelId: '<',
                tmsGuideId: '<',
                callSign: '<',
                displayType: '@'
            },
            controller: class ChannelController {
                /* @ngInject */
                constructor(epgsService, ChannelService, config) {
                    angular.extend(this, {
                        epgsService,
                        ChannelService,
                        config
                    });
                }

                $onInit() {
                    this.imageQueryParams = '?sourceType=colorhybrid&apikey=' +
                        this.config.oAuth.consumerKey + '&width=35';
                }

                isList() {
                    return this.displayType === 'list';
                }

                $onChanges() {
                    this.updateChannels();
                }

                updateChannels() {
                    if (this.channelId && this.mystroServiceId) {
                        this.updateByMystroServiceId();
                    } else if (this.tmsGuideId) {
                        this.updateByTmsGuideId();
                    }
                }

                updateByMystroServiceId() {
                    this.epgsService.getChannelByMystroSvcId(this.mystroServiceId, this.channelId)
                        .then((channel) => {
                            if (channel) {
                                this.networkLogoUrl = this.config.image_api + '/guide/' +
                                    channel.callSign + this.imageQueryParams;
                                this.callSign = channel.callSign;
                            }
                        });
                }

                updateByTmsGuideId() {
                    this.ChannelService.getChannelByTmsId(this.tmsGuideId)
                        .then((channel) => {
                            if (channel) {
                                this.networkLogoUrl = this.config.image_api + '/guide/' +
                                    channel.callsign + this.imageQueryParams;
                                this.callSign = channel.callsign;
                            }
                        });
                }
            }
        });
})();
