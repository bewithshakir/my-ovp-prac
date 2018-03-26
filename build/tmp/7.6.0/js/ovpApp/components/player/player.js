'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    playerService.$inject = ["$window", "$document", "OvpSrcService", "messages", "alert", "platform", "TWCVideoJS", "$q", "rx", "$state", "$timeout", "$rootScope", "errorCodesService", "sapService"];
    angular.module('ovpApp.player', ['ovpApp.player.streamService', 'ovpApp.player.flashWarning', 'ovpApp.parentalControlsDialog', 'ovpApp.components.ovp.ccSettings', 'ovpApp.components.vast', 'ovpApp.components.insecure', 'ovpApp.directives.ovp-fullscreen', 'ovpApp.product.service', 'ovpApp.legacy.PlayerSplunkService', 'ovpApp.services.splunk', 'ovpApp.video', 'ovpApp.config', 'ovpApp.messages', 'ovpApp.services.ovpStorage', 'ovpApp.services.rxUtils', 'ovpApp.services.connectivityService', 'ovpApp.services.errorCodes', 'ovpApp.player.streamService', 'ovpApp.src-service', 'lib.platform', 'rx', 'ovpApp.player.flashAvailability', 'ovpApp.player.sapService']).constant('playerErrors', {
        unentitled: 'unentitled',
        blocked: 'blocked',
        adBlocker: 'adBlocker',
        outOfHome: 'outOfHome',
        notFound: 'notFound',
        notRented: 'notRented',
        tunedAway: 'tunedAway',
        unknown: 'unknown',
        oohFraudDetection: 'oohFraudDetection'
    }).factory('playerService', playerService).component('player', {
        templateUrl: '/js/ovpApp/components/player/player.html',
        controller: (function () {
            /* @ngInject */
            /*jshint -W072*/ // Suppress 'too many parameters' warning.

            Player.$inject = ["$scope", "$rootScope", "$q", "TWCVideoJS", "config", "ovpStorage", "storageKeys", "$controller", "rx", "PlayerSplunkService", "createObservableFunction", "playerService", "$timeout", "VastParser", "LegacyAdParser", "$http", "$log", "InsecureService", "$location", "ovpFullscreen", "parentalControlsDialog", "parentalControlsContext", "connectivityService", "playerStreamService", "$state", "flashAvailabilityService", "errorCodesService"];
            function Player($scope, $rootScope, $q, TWCVideoJS, config, ovpStorage, storageKeys, $controller, rx, PlayerSplunkService, createObservableFunction, playerService, $timeout, VastParser, LegacyAdParser, $http, $log, InsecureService, $location, ovpFullscreen, parentalControlsDialog, parentalControlsContext, connectivityService, playerStreamService, $state, flashAvailabilityService, errorCodesService) {
                _classCallCheck(this, Player);

                angular.extend(this, { $scope: $scope, $rootScope: $rootScope, $q: $q, TWCVideoJS: TWCVideoJS, config: config, ovpStorage: ovpStorage, storageKeys: storageKeys,
                    $controller: $controller, rx: rx, PlayerSplunkService: PlayerSplunkService, createObservableFunction: createObservableFunction, playerService: playerService, $timeout: $timeout,
                    VastParser: VastParser, LegacyAdParser: LegacyAdParser, $http: $http, $log: $log, InsecureService: InsecureService, $location: $location, ovpFullscreen: ovpFullscreen,
                    parentalControlsDialog: parentalControlsDialog, parentalControlsContext: parentalControlsContext, connectivityService: connectivityService, playerStreamService: playerStreamService, $state: $state,
                    flashAvailabilityService: flashAvailabilityService, errorCodesService: errorCodesService });
            }

            _createClass(Player, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.debug = this.$location.search().debug === 'true';
                    this.bitRate = 0;
                    this.droppedFramesCount = 0;
                    this.preloading = true;
                    this.lastBitrate = null;
                    this.segmentErrors = [];
                    this.channel = null;

                    // Called when the player is torn down. Notifies observables to complete themselves
                    this.teardown = this.createObservableFunction();
                    this.playbackStop = this.createObservableFunction();

                    this.initPlayer().then(function () {
                        return _this.preloading = false;
                    }).then(function () {
                        return _this.applyInitialSettings();
                    }).then(function () {
                        return _this.initAnalyticsAndSplunk();
                    }).then(function () {
                        return _this.playerInitialized = true;
                    })['catch'](function (error) {
                        _this.preloading = false;
                        _this.playerStateKnown = error === 'needsFlashUpdate';

                        _this.needsFlashUpdate = _this.flashAvailabilityService.needsFlashUpdate();
                        _this.hasFlashInstalled = _this.flashAvailabilityService.hasFlashInstalled();

                        // Analytics
                        var pageName = 'adobeFlashNotAvailableWarning'; // Default
                        if (_this.hasFlashInstalled && _this.needsFlashUpdate) {
                            pageName = 'adobeFlashUpgradeWarning';
                        } else if (_this.hasFlashInstalled && !_this.needsFlashUpdate && _this.playerStateKnown) {
                            pageName = 'adobeFlashInstalledButUnavailable';
                        }
                        _this.$rootScope.$emit('Analytics:flash-warning', {
                            pageName: pageName,
                            toState: _this.$state.current
                        });
                    });

                    this.$scope.$on('stream-uri-obtained', function (event, type, streamInfo) {
                        _this.applyInitialBitrate();
                        _this.segmentErrors = [];
                        var streamUrl = '';
                        if (!streamInfo) {
                            streamInfo = {};
                        }
                        if (streamInfo.stream) {
                            streamUrl = streamInfo.stream.streamUrlWithDAIScheme || streamInfo.stream.stream_url;
                        }
                        streamInfo.type = type;
                        if (streamUrl.indexOf('?') > 0) {
                            streamInfo.parts = streamUrl.split('?')[1].split('&').map(function (pairs) {
                                return pairs.split('=');
                            }).reduce(function (memo, part) {
                                memo[part[0]] = part[1];
                                return memo;
                            }, {});
                        } else {
                            streamInfo.parts = {};
                        }
                        _this.streamInfo = streamInfo;
                        _this.debug = _this.$location.search().debug === 'true';
                    });

                    this.$rootScope.$on('player:detachControls', function () {
                        _this.playbackStop();
                        _this.debug = false;
                        _this.preloading = true;
                        _this.$timeout(function () {
                            _this.preloading = false;
                        }, 0);
                    });

                    this.$scope.$on('connectivityService:statusChanged', this.onConnectionChange.bind(this));
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.teardown();
                }

                /////////////////

            }, {
                key: 'initPlayer',
                value: function initPlayer() {
                    var _this2 = this;

                    return this.playerService.getInstance().then(function (playerInstance) {
                        _this2.player = playerInstance;
                        _this2.registerPlayerEvents();
                        _this2.teardown.subscribe(function () {
                            return _this2.player.stop();
                        });
                    });
                }
            }, {
                key: 'initAnalyticsAndSplunk',
                value: function initAnalyticsAndSplunk() {
                    this.$rootScope.$emit('Analytics:playerInitialized', this.player);

                    if (this.config.getBool(this.config.splunkControlParameters.splunkLoggingEnabled)) {
                        this.playerSplunkService = new this.PlayerSplunkService(this.player);
                    }
                }
            }, {
                key: 'registerPlayerEvents',
                value: function registerPlayerEvents() {
                    var _this3 = this;

                    this.observableFromPlayerEvent('ad-twc-tracking-request').subscribe(function (event) {
                        return _this3.onTrackingRequest(event);
                    });
                    this.observableFromPlayerEvent('unblock-stream-request').subscribe(function (event) {
                        return _this3.onUnblockStreamRequest(event);
                    });
                    this.observableFromPlayerEvent('ad-metadata-received').subscribe(function (event) {
                        return _this3.onAdMetadataReceived(event);
                    });
                    this.observableFromPlayerEvent('ad-metadata-event-received').subscribe(function (event) {
                        return _this3.onAdMetadataEventReceived(event);
                    });
                    this.observableFromPlayerEvent('player-position-changed').subscribe(function (event) {
                        return _this3.onPlayerPositionChanged(event);
                    });
                    this.observableFromPlayerEvent('bitrate-changed').subscribe(function (event) {
                        return _this3.onBitRateChanged(event);
                    });
                    this.observableFromPlayerEvent('channel-changed').subscribe(function (event) {
                        return _this3.onChannelChanged(event);
                    });
                    this.observableFromPlayerEvent('error').subscribe(function (event) {
                        return _this3.onVideoPlayerError(event);
                    });
                    this.observableFromPlayerEvent('sap-init').subscribe(function (event) {
                        return _this3.onSapInit(event);
                    });

                    var started = this.observableFromPlayerEvent('playback-started');
                    var playbackStopped = this.teardown.merge(this.playbackStop);
                    playbackStopped.skipUntil(started).subscribe(function () {
                        _this3.player.trigger('playback-stopped', {
                            TriggeredBy: 'exitPlayer'
                        });
                        started = false;
                    });
                }
            }, {
                key: 'applyInitialSettings',
                value: function applyInitialSettings() {
                    var _this4 = this;

                    this.applyControlParameters();
                    this.applyVolume();
                    this.applyMute();
                    this.applyCCEnabled();
                    this.applyCCSettings();
                    this.applySap();

                    this.$rootScope.$eventToObservable('EAS:start').takeUntil(this.teardown).subscribe(function () {
                        return _this4.onEAS();
                    });

                    this.$rootScope.$eventToObservable('player:minimize').takeUntil(this.teardown).subscribe(function () {
                        return _this4.onMinimize();
                    });
                }
            }, {
                key: 'applyControlParameters',
                value: function applyControlParameters() {
                    try {
                        var bitRateConfig = this.config.playerBitrateControlParameters;
                        if (bitRateConfig.overrideDefaults) {
                            this.player.setBitrateControlParameters(bitRateConfig);
                        }
                    } catch (e) {
                        this.$log.error('Error parsing playerBitrateControlParameters', e);
                    }
                }
            }, {
                key: 'applyInitialBitrate',
                value: function applyInitialBitrate() {
                    if (this.lastBitrate) {
                        this.player.setBitrateControlParameters({
                            initialBitrateInBitsPerSec: this.lastBitrate
                        });
                    }
                }
            }, {
                key: 'applyVolume',
                value: function applyVolume(scheduler) {
                    var _this5 = this;

                    var key = this.storageKeys.volumeLevel;
                    var volume = this.ovpStorage.getItem(key);
                    if (volume === null || volume === undefined) {
                        volume = 0.4;
                    }
                    this.player.setVolume(parseFloat(volume));

                    this.observableFromPlayerEvent('volume-level-changed').debounce(1000, scheduler).subscribe(function (volume) {
                        return _this5.ovpStorage.setItem(key, volume);
                    });
                }
            }, {
                key: 'applyMute',
                value: function applyMute() {
                    var _this6 = this;

                    var key = this.storageKeys.muted;
                    if (this.forceUnmute) {
                        this.player.setMuted(false);
                        this.forceUnmute = false;
                    } else {
                        this.player.setMuted(!!this.ovpStorage.getItem(key));
                    }

                    this.observableFromPlayerEvent('mute-toggled').subscribe(function (muted) {
                        if (!_this6.forceUnmute) {
                            _this6.ovpStorage.setItem(key, muted);
                        }
                    });
                }
            }, {
                key: 'applyCCEnabled',
                value: function applyCCEnabled() {
                    var _this7 = this;

                    var key = this.storageKeys.ccEnabled;
                    var ccEnabled = this.ovpStorage.getItem(key);
                    if (ccEnabled !== undefined) {
                        this.player.setCCEnabled(ccEnabled);
                    }

                    this.observableFromPlayerEvent('cc-enabled-toggled').subscribe(function (cc) {
                        return _this7.ovpStorage.setItem(key, cc);
                    });
                }
            }, {
                key: 'applyCCSettings',
                value: function applyCCSettings() {
                    var _this8 = this;

                    var key = this.storageKeys.ccSettings;
                    var ccSettings = this.ovpStorage.getItem(key);
                    if (ccSettings !== undefined) {
                        this.player.setCCSettings(ccSettings);
                    }

                    this.observableFromPlayerEvent('cc-settings-changed').subscribe(function (settings) {
                        return _this8.ovpStorage.setItem(key, settings);
                    });
                }
            }, {
                key: 'applySap',
                value: function applySap() {
                    var _this9 = this;

                    var key = this.storageKeys.sapEnabled;
                    var sapEnabled = this.ovpStorage.getItem(key);
                    if (sapEnabled !== undefined /* TBD check what nonset values return */) {
                            this.player.setSAPEnabled(sapEnabled);
                        }
                    this.observableFromPlayerEvent('sap-toggled').subscribe(function (sap) {
                        return _this9.ovpStorage.setItem(key, sap);
                    });
                }
            }, {
                key: 'onMinimize',
                value: function onMinimize() {
                    this.ovpFullscreen.exitFullscreen();
                }
            }, {
                key: 'onEAS',
                value: function onEAS() {
                    var _this10 = this;

                    var wasMuted = this.ovpStorage.getItem(this.storageKeys.muted);
                    this.player.setMuted(true);

                    this.$rootScope.$eventToObservable('EAS:end').first().takeUntil(this.teardown).subscribe(function () {
                        return _this10.player.setMuted(wasMuted);
                    });
                }
            }, {
                key: 'onConnectionChange',
                value: function onConnectionChange(event, isOnline, timeout) {
                    var _this11 = this;

                    if (isOnline && this.resumePlay) {
                        this.resumePlay();
                    } else {
                        if (this.player.isPlaying()) {
                            this.$timeout(function () {
                                if (_this11.$state.current.name === 'ovp.livetv') {
                                    _this11.player.stop();
                                    _this11.player.trigger('playback-stopped', {
                                        TriggeredBy: 'connectivityLost'
                                    });
                                    _this11.resumePlay = function () {
                                        _this11.playerStreamService.playChannel({
                                            player: _this11.player,
                                            channel: _this11.channel,
                                            triggeredBy: 'connectionRestore'
                                        });
                                        _this11.$rootScope.$broadcast('playback-resumed');
                                        _this11.resumePlay = null;
                                    };
                                } else {
                                    _this11.player.trigger('playback-pause-toggled', true);
                                    _this11.player.pause();
                                    _this11.resumePlay = function () {
                                        _this11.player.trigger('playback-pause-toggled', false);
                                        _this11.player.play();
                                        _this11.resumePlay = null;
                                    };
                                }
                            }, timeout);
                        }
                    }
                }
            }, {
                key: 'onVideoPlayerError',
                value: function onVideoPlayerError(error) {
                    if (error.errorID === 1000005 /* SEGMENT_ERROR */ && this.config.enableSegmentErrorRestart) {
                        /*
                        When a dai session expires, the MDC service will return a 404 for some of the manifest files, this
                        _may_ cause the flash player to get stuck in a loop of requesting the same file over and over again.
                        To prevent this, OVP will attempt to detect multiple failures on the same url and will reset the
                        channel to force a new session
                         */
                        if (error.mediaPlayerErrorDescription) {
                            if (this.connectivityService.isOnline()) {
                                //Force a check here if we get an error. Don't bother logging if we are offline. If we are
                                //not online, we don't want to keep track of failed files (since they all will be)
                                this.connectivityService.checkXhr();

                                var errorUri = error.mediaPlayerErrorDescription;
                                if (!this.segmentErrors[errorUri]) {
                                    this.segmentErrors[errorUri] = 0;
                                }
                                this.segmentErrors[errorUri]++;

                                if (this.segmentErrors[errorUri] >= this.config.maxPlayerSegmentError) {
                                    this.$log.error('Segment Error - Restarting Stream');

                                    // Analytics: Report playback failure.
                                    this.$rootScope.$emit('Analytics:playbackFailure', {
                                        // We seemingly only reach this point with linear assets.
                                        asset: this.channel ? this.channel.asset : undefined,
                                        cause: error.errorID,
                                        errorCode: 'WVP-3305',
                                        errorMessage: this.errorCodesService.getMessageForCode('WVP-3305')
                                    });
                                    if (this.$state.includes('ovp.livetv')) {
                                        this.resetChannel();
                                    } else {
                                        this.player.stop();
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                key: 'onSapInit',
                value: function onSapInit(event) {
                    if (event.audio && event.audio.length > 1) {
                        this.playerSplunkService.onError({
                            errorID: 106601,
                            errorMessage: 'Missing audio stream',
                            mediaPlayerErrorCode: 106601,
                            mediaPlayerErrorDescription: 'Zero audio streams available for content'
                        });
                    }
                }
            }, {
                key: 'onAdMetadataReceived',
                value: function onAdMetadataReceived(event) {
                    try {
                        if (event.name) {
                            event = [event];
                        }
                        var adBreaks = [];
                        if (this.config.vastSupport) {
                            adBreaks = this.VastParser.parseAdBreaks(event, this.streamInfo);
                            //Gets inserted in the player and ultimately sent to playerControls.onAdBreaksCreated
                        } else {
                                adBreaks = this.LegacyAdParser.parseAdEvents(event);
                            }
                        this.player.setAdBreakData(adBreaks);
                    } catch (e) {
                        this.$log.error('Error parsing ads', e);
                    }
                }
            }, {
                key: 'onAdMetadataEventReceived',
                value: function onAdMetadataEventReceived(event) {
                    try {
                        var adInstance = null;
                        if (this.config.vastSupport) {
                            adInstance = this.VastParser.parseAdEvent(event, this.streamInfo);
                        } else {
                            adInstance = this.LegacyAdParser.parseAdEvents(event);
                        }
                        this.player.setAdInstanceData(adInstance);
                    } catch (e) {
                        this.$log.error('Error parsing ad event', e);
                    }
                }
            }, {
                key: 'onTrackingRequest',
                value: function onTrackingRequest(trackingEvent) {
                    var _this12 = this;

                    this.VastParser.getTrackingUrls(trackingEvent).forEach(function (url) {
                        return _this12.sendTrackingRequest(url);
                    });
                }
            }, {
                key: 'sendTrackingRequest',
                value: function sendTrackingRequest(trackingUrl) {
                    if (trackingUrl.indexOf('https://') === 0 && trackingUrl.indexOf(this.config.authNeededTrackingDomain) >= 0) {
                        this.$http({
                            method: 'GET',
                            url: trackingUrl,
                            withCredentials: true
                        });
                    } else {
                        this.InsecureService.get(trackingUrl);
                    }
                }
            }, {
                key: 'onPlayerPositionChanged',
                value: function onPlayerPositionChanged(event) {
                    if (this.bitRate !== event.BitRate) {
                        this.bitRate = event.BitRate;
                    }

                    if (this.droppedFramesCount !== event.DroppedFramesCount) {
                        this.droppedFramesCount = event.DroppedFramesCount;
                        this.player.trigger('dropped-frame-count-changed', {
                            NewDroppedFramesCount: this.droppedFramesCount,
                            PlaybackTimestamp: event.PlaybackTimestamp
                        });
                    }
                }
            }, {
                key: 'onBitRateChanged',
                value: function onBitRateChanged(event) {
                    if (event && event.event) {
                        this.lastBitrate = event.event.profile;
                    }
                }
            }, {
                key: 'onChannelChanged',
                value: function onChannelChanged(event) {
                    if (event.channel) {
                        this.channel = event.channel;
                    }
                }
            }, {
                key: 'observableFromPlayerEvent',
                value: function observableFromPlayerEvent(eventName) {
                    var _this13 = this;

                    return this.rx.Observable.fromEventPattern(function (h) {
                        return _this13.player.on(eventName, h);
                    }, function (h) {
                        return _this13.player.off(eventName, h);
                    }).takeUntil(this.teardown);
                }
            }, {
                key: 'onUnblockStreamRequest',
                value: function onUnblockStreamRequest() {
                    var _this14 = this;

                    this.parentalControlsDialog.withContext(this.parentalControlsContext.PLAYBACK).unlock().then(function () {
                        return _this14.$rootScope.$broadcast('player:parentalControlsUnblocked');
                    });
                }
            }, {
                key: 'isValidPlayRoute',
                value: function isValidPlayRoute() {
                    return this.playerService.isValidPlayRoute();
                }
            }, {
                key: 'resetChannel',
                value: function resetChannel() {
                    this.player.stop();
                    this.playerStreamService.playChannel({
                        player: this.player,
                        channel: this.channel,
                        triggeredBy: 'sessionTimeout'
                    });
                }
            }]);

            return Player;
        })()
    });

    /**
     * Service singleton that keeps one instance of player around.
     */

    /* @ngInject */
    function playerService($window, $document, OvpSrcService, messages, alert, platform, TWCVideoJS, $q, rx, $state, $timeout, $rootScope, errorCodesService, sapService) {
        var playerInstance = undefined,
            initDeferred = $q.defer();

        var subject = new rx.ReplaySubject(1);

        var service = {
            getInstance: getInstance,
            playStream: playStream,
            assetLoadedSource: subject.filter(function (options) {
                return !!options;
            }),
            stop: stop,
            isValidPlayRoute: isValidPlayRoute,
            showErrorAlert: showErrorAlert
        };

        return service;

        ///////////////

        function isValidPlayRoute() {
            var state = $state.transition ? $state.transition.to() : $state.current;

            return state && (state.name.indexOf('ovp.ondemand.play') > -1 || state.name.indexOf('ovp.livetv') > -1);
        }

        function getInstance() {
            if (flashElementDefined() && !playerInstance) {
                init();
            }
            return initDeferred.promise;
        }

        function flashElementDefined() {
            var flashDomElement = $document[0].getElementById('flash-content');
            return flashDomElement !== null;
        }

        function stop() {
            getInstance().then(function () {
                playerInstance.stop();
                subject.onNext(undefined);
                $rootScope.$broadcast('player:detachControls');
            });
        }

        function playStream(options) {
            // Analytics: inform start of new stream
            $rootScope.$emit('Analytics:initiateNewStream', options);

            getInstance().then(function () {
                // Analytics: inform start of new stream
                $rootScope.$emit('Analytics:initiateNewStream', options);
                subject.onNext(options);
            });
        }

        function showErrorAlert(error, asset) {
            // default generic error message
            var errorCode = 'WLI-9000';

            if (error.mediaPlayerErrorRuntimeCode === 3365 && platform.name === 'Chrome') {
                // Override for incognito mode
                errorCode = 'WVP-3365';
            } else if (error.mediaPlayerErrorRuntimeCode === 3343) {
                // Flash upgraded
                errorCode = 'WFE-1114';
            } else if (error.mediaPlayerErrorRuntimeCode.toString().startsWith('33')) {
                // any other 33 error is a player DRM issue.  By adding WVP-, we can get the friendly code
                errorCode = 'WVP-' + error.mediaPlayerErrorRuntimeCode;
            }

            var alertContent = errorCodesService.getAlertForCode(errorCode);

            $rootScope.$emit('Analytics:playbackFailure', {
                asset: asset,
                cause: error,
                errorCode: errorCode,
                errorMessage: errorCodesService.getMessageForCode(errorCode)
            });

            return alert.open(alertContent);
        }

        function init() {
            var isWindow = platform.os.family.indexOf('Windows') > -1,
                isFForIE = platform.name === 'Firefox' || platform.name === 'IE',
                wmode = isWindow && isFForIE ? 'opaque' : 'direct',
                flashDomElement = $document[0].getElementById('flash-content');

            if (flashDomElement) {
                playerInstance = new TWCVideoJS.FlashVideoPlayer(flashDomElement, $window.swfobject, OvpSrcService.versionPath('js/libs/ovp-video-player/'), null, //This is ignored, should delete
                function (e) {
                    if (!e.success) {
                        initDeferred.reject('needsFlashUpdate');
                    }
                }, wmode);

                playerInstance.on('player-initialized', function () {
                    // Make flash-conent non-focusable
                    var flashObject = $document[0].getElementsByClassName('twctv-flash-video-player')[0];
                    if (flashObject) {
                        flashObject.setAttribute('tabindex', -1);
                        flashObject.setAttribute('aria-hidden', true);
                    }

                    // Initialize sap service
                    sapService.withPlayer(playerInstance);

                    initDeferred.resolve(playerInstance);
                });
            }
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/player.js.map
