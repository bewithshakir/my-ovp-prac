'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls').component('toggleCcSettings', {
        templateUrl: '/js/ovpApp/components/player/toggle-cc-settings.html',
        bindings: {
            player: '<'
        },
        controller: (function () {
            /*  @ngInject */

            ToggleCCSettingsController.$inject = ["$rootScope", "version", "modal"];
            function ToggleCCSettingsController($rootScope, version, modal) {
                _classCallCheck(this, ToggleCCSettingsController);

                angular.extend(this, {
                    $rootScope: $rootScope,
                    version: version,
                    modal: modal
                });
            }

            _createClass(ToggleCCSettingsController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.hovered = false;

                    this.playerSubscriptions = {
                        'playback-started': function playbackStarted() {
                            return _this.onPlaybackStarted();
                        }
                    };
                    this.ccSettingsChangedListener = this.$rootScope.$on('cc-settings-changed', function (event, data) {
                        _this.player.setCCSettings(data);
                    });
                    this.registerPlayerEvents();
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    if (this.ccSettingsChangedListener) {
                        this.ccSettingsChangedListener();
                    }

                    for (var key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.off(key, this.playerSubscriptions[key]);
                        }
                    }
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
                key: 'onPlaybackStarted',
                value: function onPlaybackStarted() {
                    var _this2 = this;

                    this.ccSettingsChangedListener = this.$rootScope.$on('cc-settings-changed', function (event, data) {
                        _this2.player.setCCSettings(data);
                    });
                }
            }, {
                key: 'showCCSettings',
                value: function showCCSettings() {
                    this.modal.open({
                        component: 'ovp-caption-settings',
                        windowClass: 'ovp-player-caption-settings',
                        ariaDescribedBy: 'descriptionBlockText cc-text-color-button',
                        ariaLabelledBy: 'labelText',
                        showCloseIcon: false
                    });
                    // Enable CC
                    this.player.setCCEnabled(true);
                }
            }, {
                key: 'ccSettingsImage',
                value: function ccSettingsImage() {
                    if (this.hovered || this.isCCSettingsVisible) {
                        return this.version.appVersion + '/images/settings-active.svg';
                    } else {
                        return this.version.appVersion + '/images/settings.svg';
                    }
                }
            }]);

            return ToggleCCSettingsController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/toggle-cc-settings.js.map
