/*globals console*/
(function () {
    'use strict';
    angular.module('ovpApp.services.connectivityService', [
        'ovpApp.config'
    ])
    .factory('connectivityService', connectivityService)
    .run(run);

    /* @ngInject */
    function connectivityService(rxhttp, $window, $rootScope, $http, $q,
        $interval, $timeout, config, httpUtil, rx) {

        let isConnected = true;
        let isVideoPlaying = false;
        let playbackType;
        let promise;
        let enabled = config.connectivityService.enabled;
        let xhrEnabled = config.connectivityService.checkXhrEnabled;
        let xhrPath = config.connectivityService.checkXhrPath;
        let xhrInterval = config.connectivityService.checkXhrIntervalMs;
        let subtractDelay = config.connectivityService.delayMessageWhenPlayingMs;
        let showDebug = config.connectivityService.debug;
        let debounceOnlineMs = config.connectivityService.debounceOnlineMs;
        let bufferingParams = config.playerBufferControlParameters;

        activate();

        return {isOnline, checkXhr};

        ///////////////////////

        function activate() {
            if (!enabled) {
                return;
            }

            isConnected = $window.navigator.onLine;

            // We can listen to the browser online and offline events, but this
            // will only tell us that the computer is connected to a network, and
            // not necessarily that the computer has an internet connection.
            // Normally this will be pretty reliable.  This works in all browsers
            // but IE 10.
            rx.Observable.fromEvent(angular.element($window), 'online')
                .debounce(debounceOnlineMs).subscribe(() => {
                    checkXhr();
                });

            angular.element($window).on('offline', () => {
                toggleStatus(false);
            });

            //  This works in all browsers and verifies an actual internet connection.
            if (xhrEnabled) {
                $interval(() => checkXhr(), xhrInterval);
            }

            $rootScope.$on('Analytics:playerInitialized', (e, player) => {
                attachPlayerListeners(player);
            });
        }

        function attachPlayerListeners(player) {
            player.on('playback-started', () => togglePlaybackStatus(true));
            player.on('playback-stopped', () => togglePlaybackStatus(false));
            player.on('channel-changed', () => setPlaybackType('linear'));
            player.on('vod-content-selected', () => setPlaybackType('vod'));
            player.on('cdvr-content-selected', () => setPlaybackType('dvr'));
        }

        function togglePlaybackStatus(isPlaying) {
            isVideoPlaying = isPlaying;
        }

        function setPlaybackType(type) {
            playbackType = type;
        }


        function checkXhr() {
            if (!promise) {
                xhrPath = httpUtil.updateQueryStringParameter(xhrPath, 'cacheBust', Date.now());
                promise = rxhttp.get(xhrPath).retryWhen(errors => {
                    return errors.take(3).flatMap(() => rx.Observable.timer(1000)); // 1 sec delay between retries
                }).toPromise($q);

                promise.then(() => {
                    toggleStatus(true);
                }, (resp) => {
                    // a 30x, 40x, or 50x status still indicates an internet
                    // connection, a -1 means the request failed completely
                    if (resp.status === -1) {
                        toggleStatus(false);
                    } else {
                        toggleStatus(true);
                    }
                }).finally(() => {
                    promise = null;
                });
            }
            return promise;
        }

        function toggleStatus(status) {

            let timeout;
            let currStatus = isConnected;

            if (currStatus !== status) {
                isConnected = status;

                if (isVideoPlaying && !status) {
                    if (playbackType === 'vod' || playbackType === 'dvr') {
                        timeout = bufferingParams.vodPlaybackBufferLengthInMilliSec;
                    } else {
                        timeout = bufferingParams.defaultPlaybackBufferLengthInMilliSec;
                    }
                } else {
                    timeout = 0;
                }

                if (timeout > subtractDelay) {
                    timeout = timeout - subtractDelay;
                }

                if (showDebug) {
                    debug(isVideoPlaying, playbackType, timeout);
                }

                $timeout(() => {
                    $rootScope.$broadcast('connectivityService:statusChanged', status, timeout);
                });
            }
        }

        function debug(isVideoPlaying, playbackType, bufferingTime) {
            let Table = function (isVideoPlaying, playbackType, buffer) {
                this.isOnline = isConnected;
                this.isVideoPlaying = isVideoPlaying;
                this.playbackType = playbackType;
                this.buffer = buffer;
            };

            let debugTable = new Table(isVideoPlaying, playbackType, bufferingTime);

            console.table([debugTable]);
        }

        function isOnline() {
            return isConnected;
        }
    }

    function run(connectivityService) {
        return connectivityService;
    }
})();
