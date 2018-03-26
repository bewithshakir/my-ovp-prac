'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls').component('togglePlay', {
        templateUrl: '/js/ovpApp/components/player/toggle-play.html',
        bindings: {
            options: '<',
            player: '<',
            enlargeIcon: '='
        },
        controller: (function () {
            /* @ngInject */

            TooglePlayController.$inject = ["$rootScope", "version", "globalKeydown", "keyMap", "playerService"];
            function TooglePlayController($rootScope, version, globalKeydown, keyMap, playerService) {
                _classCallCheck(this, TooglePlayController);

                angular.extend(this, {
                    $rootScope: $rootScope,
                    version: version,
                    globalKeydown: globalKeydown,
                    keyMap: keyMap,
                    playerService: playerService
                });
            }

            _createClass(TooglePlayController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.statusText = '';
                    this.playing = this.player.isPlaying();
                    this.playerSubscriptions = {
                        'playback-started': function playbackStarted() {
                            return _this.onPlaybackStarted();
                        },
                        'playback-stopped': function playbackStopped() {
                            return _this.onPlaybackStopped();
                        },
                        'error': function error() {
                            return _this.onPlayerError();
                        }
                    };
                    this.registerPlayerEvents();
                    this.togglePlaybackListener = this.$rootScope.$on('toggle-playback', function () {
                        return _this.toggle();
                    });
                    this.resumePlaybackListener = this.$rootScope.$on('playback-resumed', function () {
                        return _this.onPlaybackResumed();
                    });

                    this.keydownHandler = this.globalKeydown.observable
                    // Ignore key events if not playing video
                    .filter(function (event) {
                        return _this.playerService.isValidPlayRoute() && _this.keyMap[event.keyCode] === 'k' && !(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey);
                    }).subscribe(function () {
                        return _this.toggle();
                    });
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
                    this.togglePlaybackListener();
                    this.resumePlaybackListener();
                    for (var key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.off(key, this.playerSubscriptions[key]);
                        }
                    }
                    this.keydownHandler.dispose();
                }
            }, {
                key: 'onPlaybackStarted',
                value: function onPlaybackStarted() {
                    this.playing = true;
                }
            }, {
                key: 'onPlaybackResumed',
                value: function onPlaybackResumed() {
                    if (!this.playing) {
                        this.playing = true;
                    }
                }
            }, {
                key: 'onPlaybackStopped',
                value: function onPlaybackStopped() {
                    this.playing = false;
                }
            }, {
                key: 'onPlayerError',
                value: function onPlayerError() {
                    this.playing = false;
                }
            }, {
                key: 'toggle',
                value: function toggle() {
                    var playbackTime, duration;
                    if (this.options) {
                        playbackTime = this.options.playbackTime;
                        duration = this.options.duration;
                    }

                    if (playbackTime) {
                        this.statusText = (this.playing ? 'paused' : 'playing') + ' at ' + Math.floor(playbackTime / 60) + ' minutes, ' + Math.floor(playbackTime % 60) + ' seconds';
                    }

                    if (this.player.isPaused()) {
                        this.player.play();
                        this.playing = true;
                    } else {
                        this.player.pause();
                        this.playing = false;
                        var _event = {
                            PlaybackTimestamp: playbackTime * 1000,
                            Runtime: duration * 1000
                        };

                        if (angular.isFunction(this.options.setBookmarkCallback)) {
                            this.options.setBookmarkCallback(_event, 'pause button');
                        }
                    }
                    // Trigger to send the EG event.
                    this.player.trigger('playback-pause-toggled', !this.playing);
                }
            }, {
                key: 'image',
                value: function image() {
                    var fileName = (this.playing ? 'pause' : 'play') + (this.enlargeIcon ? '-enlarge' : '') + (this.playHover ? '-active.svg' : '.svg');
                    return '/' + this.version.appVersion + '/images/' + fileName;
                }
            }]);

            return TooglePlayController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/toggle-play.js.map
