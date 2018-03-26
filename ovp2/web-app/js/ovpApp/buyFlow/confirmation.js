(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.confirmation', [
        'ovpApp.config'
    ])
    .component('buyFlowConfirmation', {
        bindings: {

        },
        templateUrl: '/js/ovpApp/buyFlow/confirmation.html',
        controller: class Confirmation {
            /* @ngInject */
            constructor($state, $rootScope) {
                angular.extend(this, {$state, $rootScope});

                // Page change is complete.
                this.$rootScope.$emit('Analytics:pageChangeComplete');
            }

            watchTV() {

                // Analytics: selectEvent
                this.$rootScope.$broadcast('Analytics:select', {
                    context: 'stream2',
                    elementUiName: 'Start Watching TV',
                    elementStandardizedName: 'start',
                    featureCurrentStep: 6
                });

                this.$state.go('ovp.livetv');
            }
        }
    });
})();
