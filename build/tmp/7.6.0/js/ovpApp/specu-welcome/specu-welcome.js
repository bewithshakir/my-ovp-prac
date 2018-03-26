'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.specuWelcome', ['ovpApp.directives.focus']).component('specuWelcome', {
        bindings: {},
        templateUrl: '/js/ovpApp/specu-welcome/specu-welcome.html',
        controller: (function () {
            /* @ngInject */

            SpecuWelcome.$inject = ["httpUtil", "$state", "loginService"];
            function SpecuWelcome(httpUtil, $state, loginService) {
                _classCallCheck(this, SpecuWelcome);

                angular.extend(this, { httpUtil: httpUtil, $state: $state, loginService: loginService });
            }

            _createClass(SpecuWelcome, [{
                key: '$onInit',
                value: function $onInit() {
                    this.termsHref = 'https://www.spectrum.com/policies/residential-terms.html';
                    this.privacyHref = 'https://www.spectrum.com/policies/spectrum-customer-privacy-policy.html';
                }
            }, {
                key: 'signInWithResidential',
                value: function signInWithResidential() {
                    this.httpUtil.logout();
                }
            }, {
                key: 'continue',
                value: function _continue() {
                    this.loginService.acceptSpecUTerms();
                    this.$state.go('ovp.livetv', undefined, { replace: true });
                }
            }]);

            return SpecuWelcome;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/specu-welcome/specu-welcome.js.map
