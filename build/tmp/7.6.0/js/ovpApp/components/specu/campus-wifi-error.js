'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.specu.campusWifiError', ['ovpApp.directives.focus', 'ovpApp.components.header', 'ovpApp.legacy.httpUtil']).component('specuCampusWifiError', {
        bindings: {
            error: '<'
        },
        templateUrl: '/js/ovpApp/components/specu/campus-wifi-error.html',
        controller: (function () {
            /* @ngInject */

            SpecUCampusWifiErrorController.$inject = ["$state", "$rootScope", "httpUtil"];
            function SpecUCampusWifiErrorController($state, $rootScope, httpUtil) {
                _classCallCheck(this, SpecUCampusWifiErrorController);

                angular.extend(this, { $state: $state, $rootScope: $rootScope, httpUtil: httpUtil });
            }

            _createClass(SpecUCampusWifiErrorController, [{
                key: 'signIn',
                value: function signIn() {
                    this.httpUtil.logout();
                }
            }, {
                key: '$onChanges',
                value: function $onChanges() /*changes*/{
                    // Analytics
                    this.$rootScope.$emit('Analytics:modal-view', {
                        modalName: 'connectToCampus',
                        modalType: 'message',
                        modalText: this.error.message
                    });
                }
            }]);

            return SpecUCampusWifiErrorController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/specu/campus-wifi-error.js.map
