(function () {
    'use strict';

    angular
    .module('ovpApp.player.flashWarning', [
        'ovpApp.player.flashAvailability',
        'ovpApp.services.errorCodes'
    ])
    .component('flashWarning', {
        template: '<ng-include src="$ctrl.getTemplateUrl()"/>',
        bindings: {
            playerStateKnown: '<'
        },
        controller: class FlashWarning {
            /* @ngInject */
            constructor(flashAvailabilityService, config, messages, $rootScope, errorCodesService) {
                angular.extend(this, {flashAvailabilityService, config, messages, $rootScope, errorCodesService});
            }
            $onInit() {
                if (this.config.flashNotEnabledMessage.toLowerCase() === 'legacy') {
                    this.needsFlashUpdate = this.flashAvailabilityService.needsFlashUpdate();
                    this.hasFlashInstalled = this.flashAvailabilityService.hasFlashInstalled();
                    this.isIE = this.flashAvailabilityService.isIE();
                } else {
                    let code = {
                        main: (this.config.flashNotEnabledMessage === '1225') ? 'TMP-9098' : 'TMP-9100',
                        subText: (this.config.flashNotEnabledMessage === '1225') ? 'TMP-9099' : 'TMP-9101'
                    };
                    this.flashNotEnabledMessage = {
                        title: this.errorCodesService.getHeaderForCode(code.main), //1225
                        subTitle: this.errorCodesService.getMessageForCode(code.subText), //1225
                        messages: this.errorCodesService.getMessageForCode(code.main).split(';'),
                        srButtonText: this.errorCodesService.getAltForCode(code.main)
                    };
                }
            }
            getTemplateUrl() {
                if (this.config.flashNotEnabledMessage.toLowerCase() === 'legacy') {
                    return '/js/ovpApp/components/player/flash-warning-legacy.html';
                } else {
                    return '/js/ovpApp/components/player/flash-warning.html';
                }
            }

            /**
             * Click handler for the 'continue' buttons on the Flash warning pages.
             * @param standardizedName The standardized name for this button, in venona terms.
             */
            continue(standardizedName) {
                this.$rootScope.$broadcast('Analytics:select', {
                    elementStandardizedName: standardizedName,
                    pageSectionName: 'conversionArea'
                });

                return true;
            }
        }
    });
})();
