(() => {
    'use strict';
    angular.module('ovpApp.components.specu.campusWifiError', [
        'ovpApp.directives.focus',
        'ovpApp.components.header',
        'ovpApp.legacy.httpUtil'
    ]).component('specuCampusWifiError', {
        bindings: {
            error: '<'
        },
        templateUrl: '/js/ovpApp/components/specu/campus-wifi-error.html',
        controller: class SpecUCampusWifiErrorController {
            /* @ngInject */
            constructor($state, $rootScope, httpUtil) {
                angular.extend(this, {$state, $rootScope, httpUtil});
            }

            signIn() {
                this.httpUtil.logout();
            }

            $onChanges(/*changes*/) {
                // Analytics
                this.$rootScope.$emit('Analytics:modal-view', {
                    modalName: 'connectToCampus',
                    modalType: 'message',
                    modalText: this.error.message
                });
            }
        }
    });
})();
