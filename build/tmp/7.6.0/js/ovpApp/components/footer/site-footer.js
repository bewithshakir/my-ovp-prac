'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.ovpFooter', ['ovpApp.config', 'ovpApp.messages', 'ovpApp.components.modal']).component('siteFooter', {
        templateUrl: '/js/ovpApp/components/footer/site-footer.html',

        controller: (function () {
            /* @ngInject */

            SiteFooter.$inject = ["config", "messages", "environmentConstants", "modal", "profileService", "OauthService", "$state", "$transitions"];
            function SiteFooter(config, messages, environmentConstants, modal, profileService, OauthService, $state, $transitions) {
                _classCallCheck(this, SiteFooter);

                this.config = config;
                this.messages = messages;
                this.environmentConstants = environmentConstants;
                this.modal = modal;
                this.profileService = profileService;
                this.OauthService = OauthService;
                this.$state = $state;
                this.$transitions = $transitions;
            }

            _createClass(SiteFooter, [{
                key: '$onInit',
                value: function $onInit() {
                    this.privacyRightsLink = this.config.timewarner_cable + '/Corporate/privacy_ca.html';
                    this.privacyPolicyLink = 'https://www.spectrum.com/policies/spectrum-customer-privacy-policy.html';
                    this.termsAndConditionsLink = 'https://www.spectrum.com/policies/residential-terms.html';
                    this.thisYear = new Date().getFullYear();
                    this.showDev = false;

                    if (this.config.environmentKey !== this.environmentConstants.ENVIRONMENT_PRODUCTION && !this.config.hideDevTools) {
                        this.showDev = true;
                    }
                }
            }, {
                key: 'isSpecUOrBulkMDU',
                value: function isSpecUOrBulkMDU() {
                    return this.$state.current.name.indexOf('ovp.specu') === 0 || this.profileService.isSpecUOrBulkMDU();
                }
            }, {
                key: 'showDevTools',
                value: function showDevTools() {
                    this.modal.open({
                        component: 'environmentDropdown',
                        ariaLabelledBy: 'environment-controls-title',
                        ariaDescribedBy: 'environment-controls-description'
                    });
                }
            }]);

            return SiteFooter;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/footer/site-footer.js.map
