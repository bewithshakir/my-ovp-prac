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
    angular.module('ovpApp.playerControls')
        .component('toggleFullscreen', {
            bindings: {
                playerElement: '<',
                enlargeIcon: '='
            },
            templateUrl: '/js/ovpApp/components/player/toggle-fullscreen.html',
            controller: class ToggleFullscreen {
                /* @ngInject */
                constructor(version, ovpFullscreen, profileService) {
                    angular.extend(this, {version, ovpFullscreen, profileService});
                }

                $onInit() {
                    this.fullscreenActive = false;
                    this.hovered = false;

                    // Accessibility is deemed enabled only if user has accessibility capability
                    // and accessibility setting is turned on
                    this.profileService.isAccessibilityEnabled().then((isEnabled) => {
                        this.isAccessibilityEnabled = isEnabled;
                    });
                }

                onFullScreenToggle(isEnabled) {
                    this.fullscreenActive = isEnabled;
                }

                toggle() {
                    if (this.playerElement) {
                        this.ovpFullscreen.toggle(this.playerElement);
                    }
                }

                fullScreenIcon() {
                    return this.version.appVersion +
                        (this.fullscreenActive ? '/images/exit-full-screen' : '/images/full-screen') +
                        (this.enlargeIcon ? '-enlarge' : '') +
                        (this.hovered ? '-active.svg' : '.svg');
                }
            }
        });
})();
