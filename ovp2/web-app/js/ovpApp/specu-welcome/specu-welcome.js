(function () {
    'use strict';

    angular.module('ovpApp.specuWelcome', [
        'ovpApp.directives.focus'
    ]).component('specuWelcome', {
        bindings: {},
        templateUrl: '/js/ovpApp/specu-welcome/specu-welcome.html',
        controller: class SpecuWelcome {
            /* @ngInject */
            constructor(httpUtil, $state, loginService) {
                angular.extend(this, {httpUtil, $state, loginService});
            }

            $onInit() {
                this.termsHref = 'https://www.spectrum.com/policies/residential-terms.html';
                this.privacyHref = 'https://www.spectrum.com/policies/spectrum-customer-privacy-policy.html';
            }

            signInWithResidential() {
                this.httpUtil.logout();
            }

            continue() {
                this.loginService.acceptSpecUTerms();
                this.$state.go('ovp.livetv', undefined, {replace: true});
            }
        }
    });
}());
