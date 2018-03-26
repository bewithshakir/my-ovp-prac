(function () {
    'use strict';

    angular.module('ovpApp.ondemand.networkThreeTier', [
        'ovpApp.ondemand.data',
        'ovpApp.ondemand.subheaderService'])
    .component('networkThreeTier', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-3-tier.html',
        bindings: {
            data: '<',
            page: '<?',
            index: '<?'
        },
        controller: class NetworkThreeTier {
            /* @ngInject */
            constructor($rootScope, ondemandSubheaderService) {
                this.$rootScope = $rootScope;
                this.ondemandSubheaderService = ondemandSubheaderService;
            }

            $onInit() {
                if (angular.isUndefined(this.index) || this.index < 0) {
                    this.index = 0;
                }

                if (angular.isUndefined(this.page) || this.page < 1) {
                    this.page = 1;
                }
            }
        }
    });
})();
