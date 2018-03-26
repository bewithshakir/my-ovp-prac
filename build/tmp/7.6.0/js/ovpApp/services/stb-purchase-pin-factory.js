'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    StbPurchasePinFactory.$inject = ["StbSettingsService", "$q", "parentalControlsService"];
    angular.module('ovpApp.services.stbPurchasePin', ['ovpApp.config', 'ovpApp.services.stbService', 'ovpApp.services.stbSettingsService', 'ovpApp.services.parentalControlsService']).factory('StbPurchasePinFactory', StbPurchasePinFactory);

    /* ngInject */
    function StbPurchasePinFactory(StbSettingsService, $q, parentalControlsService) {

        /**
         * Captures the stb and allowing the pin-dialogs to use the set top box defined at navigation.
         */

        var StbPurchasePin = (function () {
            function StbPurchasePin(stb) {
                _classCallCheck(this, StbPurchasePin);

                this.stb = stb;
            }

            /* used as pinService */

            _createClass(StbPurchasePin, [{
                key: 'isPINSet',
                value: function isPINSet() {
                    return StbSettingsService.getDevice(this.stb).then(function (device) {
                        return device.purchasePIN ? true : false;
                    });
                }

                /* pinService interface */
            }, {
                key: 'isPrimaryAccount',
                value: function isPrimaryAccount() {
                    return parentalControlsService.isPrimaryAccount();
                }

                /**
                 * pinService interface - used by pin-entry.js
                 *
                 * The should always return false since it has no meaning in this context
                 */
            }, {
                key: 'shouldSetDefaults',
                value: function shouldSetDefaults() {
                    return $q.resolve(false);
                }

                /* pinService interface */
            }, {
                key: 'setPINForFirstTimeWithDefaultRatings',
                value: function setPINForFirstTimeWithDefaultRatings() {
                    throw new Error('setPINForFirstTimeWithDefaultRatings should never be called in StbSettingsService');
                }

                /* pinService interface */
            }, {
                key: 'setPIN',
                value: function setPIN(pin /*, password */) {
                    var _this = this;

                    //TODO Use password if this is not the primary account
                    return StbSettingsService.getDevice(this.stb).then(function (device) {
                        var devData = {
                            purchasePIN: pin,
                            strTimestamp: device.strTimestamp
                        };
                        device.purchasePIN = pin;
                        return StbSettingsService.setDevice(_this.stb, devData);
                    });
                }

                /* pinService interface */
            }, {
                key: 'validatePIN',
                value: function validatePIN(pin) {

                    return StbSettingsService.getDevice(this.stb).then(function (device) {
                        if (device.purchasePIN === pin) {
                            return true;
                        } else {
                            return $q.reject('Invalid pin');
                        }
                    });
                }
            }]);

            return StbPurchasePin;
        })();

        return {
            create: function create(stb) {
                return new StbPurchasePin(stb);
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/stb-purchase-pin-factory.js.map
