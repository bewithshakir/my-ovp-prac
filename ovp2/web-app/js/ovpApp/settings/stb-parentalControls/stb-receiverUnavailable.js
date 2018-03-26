(() => {
    'use strict';
    angular.module('ovpApp.settings.stb.receiverUnavailable', [
        'ovpApp.components.ovp.error',
        'ovpApp.services.errorCodes'
    ])
    .component('stbReceiverUnavailable', {
        bindings: {
            stb: '<'
        },
        template: '<ovp-error data-type="$ctrl.type" message="$ctrl.message"></ovp-error>',
        controller: class StbReceiverUnavailable {
            /* @ngInject */
            constructor(messages, errorCodesService) {
                angular.extend(this, {messages, errorCodesService});
            }

            $onInit() {
                let identifier = this.stb.name || this.stb.macAddress;
                this.type = 'info';
                this.message = this.errorCodesService.getMessageForCode('WCM-1027', {
                    STB: identifier
                });
            }
        }
    });
})();
