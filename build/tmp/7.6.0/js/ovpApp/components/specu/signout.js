'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.specu.signout', ['ovpApp.config', 'ovpApp.services.ovpStorage', 'ovpApp.legacy.httpUtil']).component('specuSignout', {
        bindings: {
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/specu/signout.html',
        controller: (function () {
            /* @ngInject */

            SpecuSignout.$inject = ["$rootScope", "$state", "httpUtil", "profileService", "ovpStorage", "storageKeys", "version"];
            function SpecuSignout($rootScope, $state, httpUtil, profileService, ovpStorage, storageKeys, version) {
                _classCallCheck(this, SpecuSignout);

                angular.extend(this, { $rootScope: $rootScope, $state: $state, httpUtil: httpUtil, profileService: profileService,
                    ovpStorage: ovpStorage, storageKeys: storageKeys, version: version });
            }

            _createClass(SpecuSignout, [{
                key: 'closeIcon',
                value: function closeIcon() {
                    return this.version.appVersion + '/images/close-x-22-x-22' + (this.activeCloseIcon ? '-active' : '') + '.svg';
                }
            }, {
                key: 'signOut',
                value: function signOut() {
                    this.httpUtil.logout();
                }
            }]);

            return SpecuSignout;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/specu/signout.js.map
