'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.settings.stb.receiverUnavailable', ['ovpApp.components.ovp.error', 'ovpApp.services.errorCodes']).component('stbReceiverUnavailable', {
        bindings: {
            stb: '<'
        },
        template: '<ovp-error data-type="$ctrl.type" message="$ctrl.message"></ovp-error>',
        controller: (function () {
            /* @ngInject */

            StbReceiverUnavailable.$inject = ["messages", "errorCodesService"];
            function StbReceiverUnavailable(messages, errorCodesService) {
                _classCallCheck(this, StbReceiverUnavailable);

                angular.extend(this, { messages: messages, errorCodesService: errorCodesService });
            }

            _createClass(StbReceiverUnavailable, [{
                key: '$onInit',
                value: function $onInit() {
                    var identifier = this.stb.name || this.stb.macAddress;
                    this.type = 'info';
                    this.message = this.errorCodesService.getMessageForCode('WCM-1027', {
                        STB: identifier
                    });
                }
            }]);

            return StbReceiverUnavailable;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-receiverUnavailable.js.map
