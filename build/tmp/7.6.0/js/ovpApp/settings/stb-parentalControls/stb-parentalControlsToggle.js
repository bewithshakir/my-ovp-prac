'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.toggle', ['ovpApp.components.ovp.ovpSwitch', 'ovpApp.services.stbSettingsService', 'ovpApp.parentalControlsDialog', 'ovpApp.config']).component('stbParentalControlsToggle', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-parentalControlsToggle.html',
        bindings: {
            'stb': '<',
            'blockingEnabled': '<'
        },
        controller: (function () {
            /* @ngInject */

            StbPCBlock.$inject = ["StbSettingsService", "parentalControlsDialog", "parentalControlsContext", "config", "$q"];
            function StbPCBlock(StbSettingsService, parentalControlsDialog, parentalControlsContext, config, $q) {
                _classCallCheck(this, StbPCBlock);

                angular.extend(this, { StbSettingsService: StbSettingsService, parentalControlsDialog: parentalControlsDialog, parentalControlsContext: parentalControlsContext,
                    config: config, $q: $q });
            }

            _createClass(StbPCBlock, [{
                key: '$onInit',
                value: function $onInit() {
                    this.pcBlockingEnabledForClient = this.blockingEnabled || false;
                    this.pcDialog = this.parentalControlsDialog.withContext(this.parentalControlsContext.STB_SETTINGS, this.stb);
                }
            }, {
                key: 'togglePCBlocking',
                value: function togglePCBlocking() {
                    var _this = this;

                    if (this.pcBlockingEnabledForClient) {
                        return this.pcDialog.unlock().then(function () {
                            _this.pcBlockingEnabledForClient = !_this.pcBlockingEnabledForClient;
                        });
                    } else {
                        this.pcBlockingEnabledForClient = !this.pcBlockingEnabledForClient;
                        return this._setPCBlocking(this.pcBlockingEnabledForClient)['catch'](function (err) {
                            // Reset settings
                            _this.pcBlockingEnabledForClient = !_this.pcBlockingEnabledForClient;
                            return _this.$q.reject(err);
                        });
                    }
                }

                /* Private method */
            }, {
                key: '_setPCBlocking',
                value: function _setPCBlocking(eanbled) {
                    return this.StbSettingsService.togglePCBlocking(this.stb, eanbled);
                }
            }]);

            return StbPCBlock;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-parentalControlsToggle.js.map
