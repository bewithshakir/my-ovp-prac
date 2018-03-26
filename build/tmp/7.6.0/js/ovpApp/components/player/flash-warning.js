'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.player.flashWarning', ['ovpApp.player.flashAvailability', 'ovpApp.services.errorCodes']).component('flashWarning', {
        template: '<ng-include src="$ctrl.getTemplateUrl()"/>',
        bindings: {
            playerStateKnown: '<'
        },
        controller: (function () {
            /* @ngInject */

            FlashWarning.$inject = ["flashAvailabilityService", "config", "messages", "$rootScope", "errorCodesService"];
            function FlashWarning(flashAvailabilityService, config, messages, $rootScope, errorCodesService) {
                _classCallCheck(this, FlashWarning);

                angular.extend(this, { flashAvailabilityService: flashAvailabilityService, config: config, messages: messages, $rootScope: $rootScope, errorCodesService: errorCodesService });
            }

            _createClass(FlashWarning, [{
                key: '$onInit',
                value: function $onInit() {
                    if (this.config.flashNotEnabledMessage.toLowerCase() === 'legacy') {
                        this.needsFlashUpdate = this.flashAvailabilityService.needsFlashUpdate();
                        this.hasFlashInstalled = this.flashAvailabilityService.hasFlashInstalled();
                        this.isIE = this.flashAvailabilityService.isIE();
                    } else {
                        var code = {
                            main: this.config.flashNotEnabledMessage === '1225' ? 'TMP-9098' : 'TMP-9100',
                            subText: this.config.flashNotEnabledMessage === '1225' ? 'TMP-9099' : 'TMP-9101'
                        };
                        this.flashNotEnabledMessage = {
                            title: this.errorCodesService.getHeaderForCode(code.main), //1225
                            subTitle: this.errorCodesService.getMessageForCode(code.subText), //1225
                            messages: this.errorCodesService.getMessageForCode(code.main).split(';'),
                            srButtonText: this.errorCodesService.getAltForCode(code.main)
                        };
                    }
                }
            }, {
                key: 'getTemplateUrl',
                value: function getTemplateUrl() {
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
            }, {
                key: 'continue',
                value: function _continue(standardizedName) {
                    this.$rootScope.$broadcast('Analytics:select', {
                        elementStandardizedName: standardizedName,
                        pageSectionName: 'conversionArea'
                    });

                    return true;
                }
            }]);

            return FlashWarning;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/flash-warning.js.map
