(function () {
    'use strict';
    angular.module('ovpApp.components.ovpFooter', [
     'ovpApp.config',
     'ovpApp.messages',
     'ovpApp.components.modal'
    ])
    .component('siteFooter', {
        templateUrl: '/js/ovpApp/components/footer/site-footer.html',

        controller: class SiteFooter {
            /* @ngInject */
            constructor(config, messages, environmentConstants, modal, profileService,
                OauthService, $state, $transitions) {
                this.config = config;
                this.messages = messages;
                this.environmentConstants = environmentConstants;
                this.modal = modal;
                this.profileService = profileService;
                this.OauthService = OauthService;
                this.$state = $state;
                this.$transitions = $transitions;
            }

            $onInit() {
                this.privacyRightsLink = this.config.timewarner_cable + '/Corporate/privacy_ca.html';
                this.privacyPolicyLink = 'https://www.spectrum.com/policies/spectrum-customer-privacy-policy.html';
                this.termsAndConditionsLink = 'https://www.spectrum.com/policies/residential-terms.html';
                this.thisYear = new Date().getFullYear();
                this.showDev = false;

                if (this.config.environmentKey !== this.environmentConstants.ENVIRONMENT_PRODUCTION  &&
                    !this.config.hideDevTools) {
                    this.showDev = true;
                }
            }

            isSpecUOrBulkMDU() {
                return (this.$state.current.name.indexOf('ovp.specu') === 0) ||
                    this.profileService.isSpecUOrBulkMDU();
            }

            showDevTools() {
                this.modal.open({
                    component: 'environmentDropdown',
                    ariaLabelledBy: 'environment-controls-title',
                    ariaDescribedBy: 'environment-controls-description'
                });
            }
        }
    });
}());
