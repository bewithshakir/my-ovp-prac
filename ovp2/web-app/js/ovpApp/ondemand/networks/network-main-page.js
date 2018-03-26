(function () {
    'use strict';

    angular.module('ovpApp.ondemand.networks', [
        'ovpApp.ondemand.networkThreeTier',
        'ovpApp.ondemand.data',
        'ovpApp.components.channelCard'])
    .component('networkMainPage', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-main-page.html',
        bindings: {
            networks: '<'
        },
        controller: class NetworkMainPage {
            constructor($rootScope, $state) {
                angular.extend(this, {$rootScope, $state});
            }

            $onInit() {
                this.gridListConfig = {
                    minimumGridItemSeparation: 35,
                    gridOnly: true,
                    showHeader: false,
                    showPagination: false
                };
                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
            }
        }
    });
})();
