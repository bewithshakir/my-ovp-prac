'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    StbPCPinFactory.$inject = ["StbSettingsService", "$q", "parentalControlsService"];
    angular.module('ovpApp.services.stbPCPin', ['ovpApp.services.stbSettingsService', 'ovpApp.services.parentalControlsService']).factory('StbPCPinFactory', StbPCPinFactory);

    /* ngInject */
    function StbPCPinFactory(StbSettingsService, $q, parentalControlsService) {

        /**
         * Captures the stb and allowing the pin-dialogs to use the set top box defined at navigation.
         */

        var StbPCPin = (function () {
            function StbPCPin(stb) {
                _classCallCheck(this, StbPCPin);

                this.stb = stb;
            }

            /* pinService interface */

            _createClass(StbPCPin, [{
                key: 'isPrimaryAccount',
                value: function isPrimaryAccount() {
                    return parentalControlsService.isPrimaryAccount();
                }

                /* pinService interface */
            }, {
                key: 'validatePIN',
                value: function validatePIN(pin) {
                    return StbSettingsService.getDevice(this.stb).then(function (device) {
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
            }, {
                key: 'shouldSetDefaults',
                value: function shouldSetDefaults() {
                    return $q.resolve(false);
                }

                /* pinService interface */
            }, {
                key: 'setPIN',
                value: function setPIN(pin /*, password */) {
                    var _this = this;

                    // TODO Use password if this is not the primary account
                    return StbSettingsService.getDevice(this.stb).then(function (device) {
                        var devData = {
                            parentalControlPIN: pin,
                            strTimestamp: device.strTimestamp
                        };
                        device.purchasePIN = pin;
                        StbSettingsService.setDevice(_this.stb, devData);
                    });
                }

                /* used as pinService */
            }, {
                key: 'isPINSet',
                value: function isPINSet() {
                    return StbSettingsService.getDevice(this.stb).then(function (device) {
                        return device.parentalControlPIN ? true : false;
                    });
                }
            }]);

            return StbPCPin;
        })();

        return {
            create: function create(stb) {
                return new StbPCPin(stb);
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/stb-parental-pin-factory.js.map
