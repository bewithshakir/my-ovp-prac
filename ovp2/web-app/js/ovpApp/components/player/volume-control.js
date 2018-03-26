(function () {
    'use strict';

    angular
    .module('ovpApp.playerControls')
    .component('volumeControl', {
        bindings: {
            player: '<',
            enlargeIcon: '='
        },
        templateUrl: '/js/ovpApp/components/player/volume-control.html',
        controller: class VolumeControl {
            constructor(version, ovpStorage, createObservableFunction, $rootScope,
                windowFocus, globalKeydown, keyMap, playerService) {
                angular.extend(this, {version, ovpStorage, createObservableFunction, $rootScope,
                    windowFocus, globalKeydown, keyMap, playerService});
            }

            $onInit() {
                this.onFocus = this.createObservableFunction();
                this.onBlur = this.createObservableFunction();
                this.onMouseOver = this.createObservableFunction();
                this.onMouseLeave = this.createObservableFunction();
                this.sliderVisible = false;
                this.sliderFocussed = false;
                this.imagePath = '/' + this.version.appVersion;
                this.isMouseOver = false;
                this.isMuted = this.player.isMuted();
                this.volume = this.isMuted ? 0 : this.getVolume();

                this.onMouseOver.subscribe(() => this.isMouseOver = true);
                this.onMouseLeave.subscribe(() => this.isMouseOver = false);

                let enterSource = this.onFocus
                    .filter(() => !this.windowFocus.windowJustGotFocus())
                    .merge(this.onMouseOver);
                let exitSource = this.onBlur.merge(this.onMouseLeave);

                enterSource.subscribe(() => {
                    this.sliderVisible = true;
                    exitSource.delay(500)
                        .takeUntil(enterSource)
                        .subscribe(() => {
                            this.sliderVisible = false;
                            this.$rootScope.$apply();
                        });
                });

                let focusSlider = this.onFocus.filter(([val]) => val === 'slider').map(() => true);
                let blurSlider = this.onBlur.filter(([val]) => val === 'slider').map(() => false);
                focusSlider.merge(blurSlider)
                    .subscribe(val => this.sliderFocussed = val);

                this.keydownHandler = this.globalKeydown.observable
                    // Ignore key events if not playing video
                    .filter(event => this.playerService.isValidPlayRoute() && this.keyMap[event.keyCode] === 'm' &&
                        !(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey))
                    .subscribe(() => this.toggleMute());
            }

            $onDestroy() {
                this.keydownHandler.dispose();
            }

            onVolumeChange() {
                this.adjustVolume(this.volume);
            }

            toggleMute() {
                if (this.player.isMuted()) {
                    this.player.setMuted(false);
                    // Reset volume
                    this.volume = this.getVolume() || 40; // default volume
                    this.adjustVolume(this.volume, false);
                } else {
                    this.player.setMuted(true);
                    this.volume = 0;
                }
                this.isMuted = this.player.isMuted();
            }

            onPlaybackStarted() {
                this.volume = this.isMuted ? 0 : this.getVolume();
            }

            image() {
                let volumeImage;
                if (this.isMuted || this.volume === 0) {
                    volumeImage = '/images/volume-mute';
                } else {
                    volumeImage = '/images/volume';
                }

                volumeImage = volumeImage + (this.enlargeIcon ? '-enlarge' : '');

                return this.imagePath + volumeImage + (this.isMouseOver ? '-active.svg' : '.svg');
            }

            adjustVolume(volume, toggleMute=true) {
                volume = parseInt(volume);
                this.player.setVolume(volume / 100);
                // Toggle mute
                if (toggleMute && (this.isMuted && volume > 0) || (!this.isMuted && volume === 0)) {
                    this.toggleMute();
                }
            }

            getVolume() {
                let volumeLevel = this.player.getVolume();
                if (volumeLevel !== undefined && !isNaN(volumeLevel)) {
                    volumeLevel = 1 * volumeLevel;
                } else {
                    volumeLevel = 0.4;
                }

                return parseFloat(volumeLevel * 100);
            }
        }
    });
})();
