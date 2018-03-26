(() => {
    'use strict';
    angular.module('ovpApp.components.specu.signout', [
        'ovpApp.config',
        'ovpApp.services.ovpStorage',
        'ovpApp.legacy.httpUtil'
    ])
    .component('specuSignout', {
        bindings: {
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/specu/signout.html',
        controller: class SpecuSignout {
            /* @ngInject */
            constructor($rootScope, $state, httpUtil, profileService, ovpStorage, storageKeys, version) {
                angular.extend(this, {$rootScope, $state, httpUtil, profileService,
                    ovpStorage, storageKeys, version});
            }

            closeIcon() {
                return this.version.appVersion + '/images/close-x-22-x-22' +
                    (this.activeCloseIcon ? '-active' : '') + '.svg';
            }

            signOut() {
                this.httpUtil.logout();
            }

        }
    });
})();
