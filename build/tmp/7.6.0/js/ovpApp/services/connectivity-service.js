/*globals console*/
'use strict';

(function () {
    'use strict';
    connectivityService.$inject = ["rxhttp", "$window", "$rootScope", "$http", "$q", "$interval", "$timeout", "config", "httpUtil", "rx"];
    run.$inject = ["connectivityService"];
    angular.module('ovpApp.services.connectivityService', ['ovpApp.config']).factory('connectivityService', connectivityService).run(run);

    /* @ngInject */
    function connectivityService(rxhttp, $window, $rootScope, $http, $q, $interval, $timeout, config, httpUtil, rx) {

        var isConnected = true;
        var isVideoPlaying = false;
        var playbackType = undefined;
        var promise = undefined;
        var enabled = config.connectivityService.enabled;
        var xhrEnabled = config.connectivityService.checkXhrEnabled;
        var xhrPath = config.connectivityService.checkXhrPath;
        var xhrInterval = config.connectivityService.checkXhrIntervalMs;
        var subtractDelay = config.connectivityService.delayMessageWhenPlayingMs;
        var showDebug = config.connectivityService.debug;
        var debounceOnlineMs = config.connectivityService.debounceOnlineMs;
        var bufferingParams = config.playerBufferControlParameters;

        activate();

        return { isOnline: isOnline, checkXhr: checkXhr };

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
            rx.Observable.fromEvent(angular.element($window), 'online').debounce(debounceOnlineMs).subscribe(function () {
                checkXhr();
            });

            angular.element($window).on('offline', function () {
                toggleStatus(false);
            });

            //  This works in all browsers and verifies an actual internet connection.
            if (xhrEnabled) {
                $interval(function () {
                    return checkXhr();
                }, xhrInterval);
            }

            $rootScope.$on('Analytics:playerInitialized', function (e, player) {
                attachPlayerListeners(player);
            });
        }

        function attachPlayerListeners(player) {
            player.on('playback-started', function () {
                return togglePlaybackStatus(true);
            });
            player.on('playback-stopped', function () {
                return togglePlaybackStatus(false);
            });
            player.on('channel-changed', function () {
                return setPlaybackType('linear');
            });
            player.on('vod-content-selected', function () {
                return setPlaybackType('vod');
            });
            player.on('cdvr-content-selected', function () {
                return setPlaybackType('dvr');
            });
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
                promise = rxhttp.get(xhrPath).retryWhen(function (errors) {
                    return errors.take(3).flatMap(function () {
                        return rx.Observable.timer(1000);
                    }); // 1 sec delay between retries
                }).toPromise($q);

                promise.then(function () {
                    toggleStatus(true);
                }, function (resp) {
                    // a 30x, 40x, or 50x status still indicates an internet
                    // connection, a -1 means the request failed completely
                    if (resp.status === -1) {
                        toggleStatus(false);
                    } else {
                        toggleStatus(true);
                    }
                })['finally'](function () {
                    promise = null;
                });
            }
            return promise;
        }

        function toggleStatus(status) {

            var timeout = undefined;
            var currStatus = isConnected;

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

                $timeout(function () {
                    $rootScope.$broadcast('connectivityService:statusChanged', status, timeout);
                });
            }
        }

        function debug(isVideoPlaying, playbackType, bufferingTime) {
            var Table = function Table(isVideoPlaying, playbackType, buffer) {
                this.isOnline = isConnected;
                this.isVideoPlaying = isVideoPlaying;
                this.playbackType = playbackType;
                this.buffer = buffer;
            };

            var debugTable = new Table(isVideoPlaying, playbackType, bufferingTime);

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
//# sourceMappingURL=../../maps-babel/ovpApp/services/connectivity-service.js.map
