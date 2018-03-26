(function () {
    'use strict';

    angular
        .module('ovpApp.components.channelCard', [
            'ovpApp.directives.lazySrc',
            'ovpApp.ondemand.data',
            'ovpApp.services.errorCodes',
            'ovpApp.config'
        ])
        .component('channelCard', {
            bindings: {
                channel: '<',
                options: '<'
            },
            templateUrl: '/js/ovpApp/components/channel-card/channel-card.html',
            controller: class ChannelCard {
                /* @ngInject */
                constructor($state, messages, profileService, CAPABILITIES, alert, onDemandData, $rootScope,
                    errorCodesService, config) {
                    angular.extend(this, {$state, messages, profileService, CAPABILITIES, alert,
                        onDemandData, $rootScope, errorCodesService, config});
                }

                $onChanges(changes) {
                    if (changes.options) {
                        this.applyDefaultOptions(changes.options.currentValue);
                    }
                }

                // On Click either go to the VOD boxart grid or display an unentitled network message.
                click() {

                    this.$rootScope.$broadcast('Analytics:select-channel-card');

                    if (this.channel.isEntitled) {
                        const name = this.onDemandData.formatCategoryNameForRoute(this.channel.name);
                        this.$state.go(`ovp.ondemand.networks.network`, {name, index: null, page: null});
                    } else {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WEN-1000', {
                                IVR_NUMBER: this.config.ivrNumber
                            }),
                            buttonText: 'OK'
                        });
                    }
                }

                //////////

                applyDefaultOptions(newOptions) {
                    const defaults = {
                        showChannelName: false
                    };

                    this.options = angular.extend({}, defaults, newOptions);
                }
            }
        });
})();
