(function () {
    'use strict';

    angular.module('ovpApp.playerControls.skipButton', [])
        .component('skipButton', {
            templateUrl: '/js/ovpApp/components/player/skip-button.html',
            bindings: {
                seconds: '<',
                ovpDisabled: '<',
                direction: '<',
                player: '<',
                onSkip: '&',
                ffDisabled: '<',
                enlargeIcon: '='
            },
            controller: class SkipButton {
                /*  @ngInject */
                constructor(version) {
                    this.version = version;
                }

                getAriaLabel() {
                    if (this.ffDisabled) {
                        return 'Jump forward disabled for this program';
                    } else {
                        return 'Jump ' + this.directionText + ' ' + this.seconds + ' seconds';
                    }
                }
                $onInit() {
                    this.appVersion = this.version.appVersion;
                    this.player.on('seekBegin', () => {
                        this.seeking = true;
                    });
                    this.player.on('seekEnd', () => {
                        this.seeking = false;
                    });
                }

                $onChanges(changes) {
                    if (changes.direction) {
                        this.directionText = this.direction < 0 ? 'backward' : 'forward';
                    }
                    if (changes.ffDisabled || changes.direction || changes.seconds) {
                        this.ariaLabel = this.getAriaLabel();
                    }
                }

                $onDestroy() {
                    this.player.off('seekBegin');
                    this.player.off('seekEnd');
                }

                skip() {
                    if (!this.ovpDisabled && !this.seeking) {
                        this.onSkip({direction: this.direction});
                    }
                }

                image() {
                    return this.appVersion + '/images/skip-' + this.directionText +
                        (this.enlargeIcon ? '-enlarge' : '') +
                        (this.skipHover ? '-active.svg' : '.svg');
                }
            }
        });
})();
