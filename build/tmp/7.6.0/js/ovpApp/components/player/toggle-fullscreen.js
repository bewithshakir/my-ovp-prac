'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * toggleFullscreen
     *
     * Example Usage:
     * <toggle-fullscreen player-element="someInputValue""></toggle-fullscreen>
     *
     * Bindings:
     *    playerElement: ([type]) The dom element of the player to put into full screen
     */
    angular.module('ovpApp.playerControls').component('toggleFullscreen', {
        bindings: {
            playerElement: '<',
            enlargeIcon: '='
        },
        templateUrl: '/js/ovpApp/components/player/toggle-fullscreen.html',
        controller: (function () {
            /* @ngInject */

            ToggleFullscreen.$inject = ["version", "ovpFullscreen", "profileService"];
            function ToggleFullscreen(version, ovpFullscreen, profileService) {
                _classCallCheck(this, ToggleFullscreen);

                angular.extend(this, { version: version, ovpFullscreen: ovpFullscreen, profileService: profileService });
            }

            _createClass(ToggleFullscreen, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.fullscreenActive = false;
                    this.hovered = false;

                    // Accessibility is deemed enabled only if user has accessibility capability
                    // and accessibility setting is turned on
                    this.profileService.isAccessibilityEnabled().then(function (isEnabled) {
                        _this.isAccessibilityEnabled = isEnabled;
                    });
                }
            }, {
                key: 'onFullScreenToggle',
                value: function onFullScreenToggle(isEnabled) {
                    this.fullscreenActive = isEnabled;
                }
            }, {
                key: 'toggle',
                value: function toggle() {
                    if (this.playerElement) {
                        this.ovpFullscreen.toggle(this.playerElement);
                    }
                }
            }, {
                key: 'fullScreenIcon',
                value: function fullScreenIcon() {
                    return this.version.appVersion + (this.fullscreenActive ? '/images/exit-full-screen' : '/images/full-screen') + (this.enlargeIcon ? '-enlarge' : '') + (this.hovered ? '-active.svg' : '.svg');
                }
            }]);

            return ToggleFullscreen;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/toggle-fullscreen.js.map
