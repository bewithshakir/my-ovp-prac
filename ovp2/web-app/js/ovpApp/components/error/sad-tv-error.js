(() => {
    'use strict';
    angular.module('ovpApp.components.error.sadTv', [])
    .component('sadTvError', {
        bindings: {
            errorCode: '<'
        },
        templateUrl: '/js/ovpApp/components/error/sad-tv-error.html',
        controller: class sadTvError {
            /* @ngInject */
            constructor($window, $rootScope) {
                angular.extend(this, {$window, $rootScope});
            }

            $onInit() {
                this.focusButton = true;
                this.$rootScope.$broadcast('Analytics:pageChangeComplete');
            }

            retry() {
                // Analytics: Prepare to go offline, then capture select event.
                this.$rootScope.$emit('Analytics:prepareForRefresh');
                this.$rootScope.$broadcast('Analytics:select', {
                    elementStandardizedName: 'retry'
                });

                this.$window.location.reload();
            }
        }
    });
})();
