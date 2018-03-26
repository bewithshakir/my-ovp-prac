'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls').component('toggleCc', {
        templateUrl: '/js/ovpApp/components/player/toggle-cc.html',
        bindings: {
            player: '<'
        },
        controller: (function () {
            /* @ngInject */

            ToggleCCController.$inject = ["$rootScope", "version", "ovpStorage", "storageKeys"];
            function ToggleCCController($rootScope, version, ovpStorage, storageKeys) {
                _classCallCheck(this, ToggleCCController);

                angular.extend(this, {
                    $rootScope: $rootScope,
                    version: version,
                    ovpStorage: ovpStorage,
                    storageKeys: storageKeys
                });
            }

            _createClass(ToggleCCController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.hovered = false;
                    this.isCCEnabled = this.ovpStorage.getItem(this.storageKeys.ccEnabled);

                    this.playerSubscriptions = {
                        'cc-enabled-toggled': function ccEnabledToggled(val) {
                            return _this.onCCToggled(val);
                        }
                    };
                    this.registerPlayerEvents();
                }
            }, {
                key: 'registerPlayerEvents',
                value: function registerPlayerEvents() {
                    for (var key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.on(key, this.playerSubscriptions[key]);
                        }
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    for (var key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.off(key, this.playerSubscriptions[key]);
                        }
                    }
                }
            }, {
                key: 'onCCToggled',
                value: function onCCToggled(val) {
                    this.isCCEnabled = val;
                }
            }, {
                key: 'ccToggle',
                value: function ccToggle() {
                    this.player.setCCEnabled(!this.isCCEnabled);

                    // Analytics:
                    this.$rootScope.$emit('Analytics:select', {
                        operationType: 'closedCaptionToggle',
                        toggleState: !this.isCCEnabled,
                        elementStandardizedName: 'closedCaptionToggle',
                        pageSectionName: 'DeriveFromOpType'
                    });
                }
            }, {
                key: 'ccToggleImage',
                value: function ccToggleImage() {
                    if (this.hovered) {
                        return this.version.appVersion + '/images/cc-active.svg';
                    } else {
                        return this.isCCEnabled ? this.version.appVersion + '/images/cc-active.svg' : this.version.appVersion + '/images/cc.svg';
                    }
                }
            }]);

            return ToggleCCController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/toggle-cc.js.map
