(() => {
    'use strict';

    angular.module('ovpApp.playerControls')
        .component('toggleDebug', {
            templateUrl: '/js/ovpApp/components/player/toggle-debug.html',
            bindings: {
                player: '<'
            },
            controller: class ToggleDebugController {
                /* @ngInject */
                constructor(dateFormat) {
                    angular.extend(this, {
                        dateFormat
                    });
                }

                $onInit() {
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
                        'status-changed': (event) => this.onStatusChanged(event),
                        'player-position-changed': (event) => this.onPlayerPositionChanged(event),
                        'ad-break-started': () => this.onAdBreakStarted(),
                        'ad-break-stopped': () => this.onAdBreakStopped(),
                        'ad-started': () => this.onAdStarted(),
                        'ad-stopped': () => this.onAdStopped()
                    };
                    this.registerPlayerEvents();
                }

                registerPlayerEvents() {
                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.on(key, this.playerSubscriptions[key]);
                        }
                    }
                }

                $onDestroy() {
                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.off(key, this.playerSubscriptions[key]);
                        }
                    }
                }

                onStatusChanged(event) {
                    this.status.playbackStatus = event.status;
                }
                onPlayerPositionChanged(event) {
                    this.status.playbackPosition = this.dateFormat.hhmmss(event.PlaybackTimestamp / 1000);
                    this.status.bufferLength = event.BufferLength;
                    this.status.bufferStatus = event.BufferStatus;
                    this.status.bufferTime = this.dateFormat.hhmmss(event.BufferTime / 1000);
                    this.status.droppedFramesCount = event.DroppedFramesCount || 0;
                    this.status.bitRateStatus = event.BitRateStatus;
                    this.status.adInfo = event.AdInfo;
                    this.status.eptBookmark = this.dateFormat.hhmmss(event.EPTBookmark / 1000);
                }
                onAdBreakStarted() {
                    this.status.adPlaying = true;
                }
                onAdBreakStopped() {
                    this.status.adPlaying = false;
                }
                onAdStarted() {
                    this.status.adPlaying = true;
                }
                onAdStopped() {
                    this.status.adPlaying = false;
                }
            }
        });
})();
