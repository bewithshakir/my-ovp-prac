'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.changeBlockingPin', ['ovpApp.directives.dropdownList', 'ovpApp.services.stbSettingsService']).component('stbChangeBlockingPin', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-changeBlockingPin.html',
        bindings: {
            'stb': '<'
        },
        controller: (function () {
            /* @ngInject */

            StbChangeBlockingPin.$inject = ["parentalControlsDialog", "parentalControlsContext", "$rootScope", "alert"];
            function StbChangeBlockingPin(parentalControlsDialog, parentalControlsContext, $rootScope, alert) {
                _classCallCheck(this, StbChangeBlockingPin);

                angular.extend(this, { parentalControlsDialog: parentalControlsDialog, parentalControlsContext: parentalControlsContext, $rootScope: $rootScope,
                    alert: alert });
            }

            _createClass(StbChangeBlockingPin, [{
                key: 'changePin',
                value: function changePin() {
                    var _this = this;

                    this.parentalControlsDialog.withContext(this.parentalControlsContext.STB_SETTINGS, this.stb).changePIN().then(function () {
                        return _this.$rootScope.$broadcast('message:growl', 'PIN successfully changed');
                    });
                }
            }]);

            return StbChangeBlockingPin;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-changeBlockingPin.js.map
