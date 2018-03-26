'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.playerControls').component('toggleDebug', {
        templateUrl: '/js/ovpApp/components/player/toggle-debug.html',
        bindings: {
            player: '<'
        },
        controller: (function () {
            /* @ngInject */

            ToggleDebugController.$inject = ["dateFormat"];
            function ToggleDebugController(dateFormat) {
                _classCallCheck(this, ToggleDebugController);

                angular.extend(this, {
                    dateFormat: dateFormat
                });
            }

            _createClass(ToggleDebugController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.status = {
                        playbackPosition: '',
                        playbackStatus: '',
                        adPlaying: false,
                        adInfo: '',
                        eptBookmark: '',
                        bufferStatus: '',
                        bitRateStatus: '',
                        droppedFrameCount: 0,
                        bufferLength: 0,
                        bufferTime: 0,
                        hidden: false
                    };

                    this.playerSubscriptions = {
                        'status-changed': function statusChanged(event) {
                            return _this.onStatusChanged(event);
                        },
                        'player-position-changed': function playerPositionChanged(event) {
                            return _this.onPlayerPositionChanged(event);
                        },
                        'ad-break-started': function adBreakStarted() {
                            return _this.onAdBreakStarted();
                        },
                        'ad-break-stopped': function adBreakStopped() {
                            return _this.onAdBreakStopped();
                        },
                        'ad-started': function adStarted() {
                            return _this.onAdStarted();
                        },
                        'ad-stopped': function adStopped() {
                            return _this.onAdStopped();
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
                key: 'onStatusChanged',
                value: function onStatusChanged(event) {
                    this.status.playbackStatus = event.status;
                }
            }, {
                key: 'onPlayerPositionChanged',
                value: function onPlayerPositionChanged(event) {
                    this.status.playbackPosition = this.dateFormat.hhmmss(event.PlaybackTimestamp / 1000);
                    this.status.bufferLength = event.BufferLength;
                    this.status.bufferStatus = event.BufferStatus;
                    this.status.bufferTime = this.dateFormat.hhmmss(event.BufferTime / 1000);
                    this.status.droppedFramesCount = event.DroppedFramesCount || 0;
                    this.status.bitRateStatus = event.BitRateStatus;
                    this.status.adInfo = event.AdInfo;
                    this.status.eptBookmark = this.dateFormat.hhmmss(event.EPTBookmark / 1000);
                }
            }, {
                key: 'onAdBreakStarted',
                value: function onAdBreakStarted() {
                    this.status.adPlaying = true;
                }
            }, {
                key: 'onAdBreakStopped',
                value: function onAdBreakStopped() {
                    this.status.adPlaying = false;
                }
            }, {
                key: 'onAdStarted',
                value: function onAdStarted() {
                    this.status.adPlaying = true;
                }
            }, {
                key: 'onAdStopped',
                value: function onAdStopped() {
                    this.status.adPlaying = false;
                }
            }]);

            return ToggleDebugController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/toggle-debug.js.map
