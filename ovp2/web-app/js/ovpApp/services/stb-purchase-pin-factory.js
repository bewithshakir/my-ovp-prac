(function () {
    'use strict';

    angular.module('ovpApp.services.stbPurchasePin', [
        'ovpApp.config',
        'ovpApp.services.stbService',
        'ovpApp.services.stbSettingsService',
        'ovpApp.services.parentalControlsService'
    ])
    .factory('StbPurchasePinFactory', StbPurchasePinFactory);

    /* ngInject */
    function StbPurchasePinFactory(StbSettingsService, $q, parentalControlsService) {

        /**
         * Captures the stb and allowing the pin-dialogs to use the set top box defined at navigation.
         */
        class StbPurchasePin {
            constructor(stb) {
                this.stb = stb;
            }

            /* used as pinService */
            isPINSet() {
                return StbSettingsService.getDevice(this.stb).then(device => {
                    return (device.purchasePIN) ? true : false;
                });
            }

            /* pinService interface */
            isPrimaryAccount() {
                return parentalControlsService.isPrimaryAccount();
            }

            /**
             * pinService interface - used by pin-entry.js
             *
             * The should always return false since it has no meaning in this context
             */
            shouldSetDefaults() {
                return $q.resolve(false);
            }

            /* pinService interface */
            setPINForFirstTimeWithDefaultRatings() {
                throw new Error('setPINForFirstTimeWithDefaultRatings should never be called in StbSettingsService');
            }

            /* pinService interface */
            setPIN(pin /*, password */) {
                //TODO Use password if this is not the primary account
                return StbSettingsService.getDevice(this.stb).then(device => {
                    var devData = {
                        purchasePIN: pin,
                        strTimestamp: device.strTimestamp
                    };
                    device.purchasePIN = pin;
                    return StbSettingsService.setDevice(this.stb, devData);
                });
            }

            /* pinService interface */
            validatePIN(pin) {

                return StbSettingsService.getDevice(this.stb).then(device => {
                    if (device.purchasePIN === pin) {
                        return true;
                    } else {
                        return $q.reject('Invalid pin');
                    }
                });
            }
        }

        return {
            create: function (stb) {
                return new StbPurchasePin(stb);
            }
        };
    }
}());
