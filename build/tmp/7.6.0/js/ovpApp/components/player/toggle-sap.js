'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls').component('toggleSap', {
        templateUrl: '/js/ovpApp/components/player/toggle-sap.html',
        bindings: {
            player: '<'
        },
        controller: (function () {
            /* @ngInject */

            ToggleSAPController.$inject = ["$rootScope", "version", "sapService"];
            function ToggleSAPController($rootScope, version, sapService) {
                _classCallCheck(this, ToggleSAPController);

                angular.extend(this, { $rootScope: $rootScope, version: version, sapService: sapService });
            }

            _createClass(ToggleSAPController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    var _sapService$withPlayer = this.sapService.withPlayer(this.player);

                    var stream = _sapService$withPlayer.stream;
                    var toggle = _sapService$withPlayer.toggle;

                    this.subscription = stream.subscribe(function (state) {
                        _this.isSapEnabled = state.enabled;
                        _this.isSAPAvailable = state.available;
                    });
                    this.sapToggle = toggle;

                    this.sapIconHovered = false;
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    if (this.subscription) {
                        this.subscription.dispose();
                    }
                }
            }, {
                key: 'sapToggleImage',
                value: function sapToggleImage() {
                    if (this.sapIconHovered) {
                        return this.version.appVersion + '/images/sap-dvs-active.svg';
                    } else {
                        return this.isSapEnabled ? this.version.appVersion + '/images/sap-dvs-active.svg' : this.version.appVersion + '/images/sap-dvs.svg';
                    }
                }
            }]);

            return ToggleSAPController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/toggle-sap.js.map
