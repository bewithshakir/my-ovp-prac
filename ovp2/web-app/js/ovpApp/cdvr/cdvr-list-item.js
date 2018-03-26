(function () {
    'use strict';

    angular.module('ovpApp.cdvr')
        .component('cdvrListItem', {
            bindings: {
                asset: '<'
            },
            templateUrl: '/js/ovpApp/cdvr/cdvr-list-item.html',
            controller: class CdvrListItem {
                /* @ngInject */
                constructor($state, cdvrService) {
                    this.$state = $state;
                    this.cdvrService = cdvrService;
                }

                $onInit() {
                    this.cdvrService.getChannelNumber(this.asset)
                        .then(channelNumber => this.channelNumber = channelNumber);
                }

                click() {
                    let route = this.asset.clickRoute;
                    if (route) {
                        this.$state.go(...route);
                    }
                }

                getTitlePrefix() {
                    let prefix = '';
                    if (this.asset.isBlockedByParentalControls) {
                        prefix = 'Blocked';
                    }
                    return prefix;
                }
            }
        });
}());
