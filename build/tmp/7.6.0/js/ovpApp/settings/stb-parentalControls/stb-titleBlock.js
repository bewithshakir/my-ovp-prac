'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.titleBlock', ['ovpApp.components.ovp.ovpSwitch', 'ovpApp.services.stbSettingsService']).component('stbTitleBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-titleBlock.html',
        bindings: {
            'stb': '<'
        },
        controller: (function () {
            /* @ngInject */

            StbTitleBlock.$inject = ["StbSettingsService"];
            function StbTitleBlock(StbSettingsService) {
                _classCallCheck(this, StbTitleBlock);

                angular.extend(this, { StbSettingsService: StbSettingsService });
            }

            _createClass(StbTitleBlock, [{
                key: '$onInit',
                value: function $onInit() {
                    this.setToggleState();
                }
            }, {
                key: 'toggleTitleBlocking',
                value: function toggleTitleBlocking() {
                    this.titleBlockingEnabledForClient = !this.titleBlockingEnabledForClient;
                    this.StbSettingsService.setTitleBlockForClient(this.stb, this.titleBlockingEnabledForClient).then(this.setToggleState.bind(this), this.setToggleState.bind(this));
                }
            }, {
                key: 'setToggleState',
                value: function setToggleState() {
                    var _this = this;

                    this.StbSettingsService.titleBlockingEnabled(this.stb).then(function (enabled) {
                        _this.titleBlockingEnabledForClient = enabled;
                    });
                    if (this.titleBlockingEnabledForClient === undefined) {
                        this.titleBlockingEnabledForClient = false;
                    }
                }
            }]);

            return StbTitleBlock;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-titleBlock.js.map
