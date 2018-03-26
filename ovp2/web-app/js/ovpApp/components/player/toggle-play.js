(() => {
    'use strict';

    angular
        .module('ovpApp.playerControls')
        .component('togglePlay', {
            templateUrl: '/js/ovpApp/components/player/toggle-play.html',
            bindings: {
                options: '<',
                player: '<',
                enlargeIcon: '='
            },
            controller: class TooglePlayController {
                /* @ngInject */
                constructor($rootScope, version, globalKeydown, keyMap, playerService) {
                    angular.extend(this, {
                        $rootScope,
                        version,
                        globalKeydown,
                        keyMap,
                        playerService
                    });
                }

                $onInit() {
                    this.statusText = '';
                    this.playing = this.player.isPlaying();
                    this.playerSubscriptions = {
                        'playback-started': () => this.onPlaybackStarted(),
                        'playback-stopped': () => this.onPlaybackStopped(),
                        'error': () => this.onPlayerError()
                    };
                    this.registerPlayerEvents();
                    this.togglePlaybackListener = this.$rootScope.$on('toggle-playback',
                        () => this.toggle());
                    this.resumePlaybackListener = this.$rootScope.$on('playback-resumed',
                        () => this.onPlaybackResumed());

                    this.keydownHandler = this.globalKeydown.observable
                        // Ignore key events if not playing video
                        .filter(event => this.playerService.isValidPlayRoute() && this.keyMap[event.keyCode] === 'k' &&
                            !(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey))
                        .subscribe(() => this.toggle());
                }

                registerPlayerEvents() {
                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.on(key, this.playerSubscriptions[key]);
                        }
                    }
                }

                $onDestroy() {
                    this.togglePlaybackListener();
                    this.resumePlaybackListener();
                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.off(key, this.playerSubscriptions[key]);
                        }
                    }
                    this.keydownHandler.dispose();
                }

                onPlaybackStarted() {
                    this.playing = true;
                }

                onPlaybackResumed() {
                    if (!this.playing) {
                        this.playing = true;
                    }
                }

                onPlaybackStopped() {
                    this.playing = false;
                }

                onPlayerError() {
                    this.playing = false;
                }

                toggle() {
                    var playbackTime, duration;
                    if (this.options) {
                        playbackTime = this.options.playbackTime;
                        duration = this.options.duration;
                    }

                    if (playbackTime) {
                        this.statusText = (this.playing ? 'paused' : 'playing') + ' at ' +
                            Math.floor(playbackTime / 60) + ' minutes, ' + Math.floor(playbackTime % 60) + ' seconds';
                    }

                    if (this.player.isPaused()) {
                        this.player.play();
                        this.playing = true;
                    } else {
                        this.player.pause();
                        this.playing = false;
                        let event = {
                            PlaybackTimestamp: playbackTime * 1000,
                            Runtime: duration * 1000
                        };

                        if (angular.isFunction(this.options.setBookmarkCallback)) {
                            this.options.setBookmarkCallback(event, 'pause button');
                        }
                    }
                    // Trigger to send the EG event.
                    this.player.trigger('playback-pause-toggled', !this.playing);
                }

                image() {
                    let fileName = (this.playing ? 'pause' : 'play') +
                        (this.enlargeIcon ? '-enlarge' : '') +
                        (this.playHover ? '-active.svg' : '.svg');
                    return `/${this.version.appVersion}/images/${fileName}`;
                }
            }
        });
})();
