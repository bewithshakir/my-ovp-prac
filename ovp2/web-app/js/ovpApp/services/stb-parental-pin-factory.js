(function () {
    'use strict';

    angular.module('ovpApp.services.stbPCPin', [
        'ovpApp.services.stbSettingsService',
        'ovpApp.services.parentalControlsService'
    ])
    .factory('StbPCPinFactory', StbPCPinFactory);

    /* ngInject */
    function StbPCPinFactory(StbSettingsService, $q, parentalControlsService) {

        /**
         * Captures the stb and allowing the pin-dialogs to use the set top box defined at navigation.
         */
        class StbPCPin {
            constructor(stb) {
                this.stb = stb;
            }

            /* pinService interface */
            isPrimaryAccount() {
                return parentalControlsService.isPrimaryAccount();
            }

            /* pinService interface */
            validatePIN(pin) {
                return StbSettingsService.getDevice(this.stb).then(device => {
                    if (device.parentalControlPIN === pin) {
                        return true;
                    } else {
                        return $q.reject('Invalid pin');
                    }
                });
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
            setPIN(pin /*, password */) {
                // TODO Use password if this is not the primary account
                return StbSettingsService.getDevice(this.stb).then(device => {
                    var devData = {
                        parentalControlPIN: pin,
                        strTimestamp: device.strTimestamp
                    };
                    device.purchasePIN = pin;
                    StbSettingsService.setDevice(this.stb, devData);
                });
            }

            /* used as pinService */
            isPINSet() {
                return StbSettingsService.getDevice(this.stb).then(device => {
                    return (device.parentalControlPIN) ? true : false;
                });
            }
        }

        return {
            create: function (stb) {
                return new StbPCPin(stb);
            }
        };
    }
}());
