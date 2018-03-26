(function () {
    'use strict';

    angular
        .module('ovpApp.player', [
            'ovpApp.player.streamService',
            'ovpApp.player.flashWarning',
            'ovpApp.parentalControlsDialog',
            'ovpApp.components.ovp.ccSettings',
            'ovpApp.components.vast',
            'ovpApp.components.insecure',
            'ovpApp.directives.ovp-fullscreen',
            'ovpApp.product.service',
            'ovpApp.legacy.PlayerSplunkService',
            'ovpApp.services.splunk',
            'ovpApp.video',
            'ovpApp.config',
            'ovpApp.messages',
            'ovpApp.services.ovpStorage',
            'ovpApp.services.rxUtils',
            'ovpApp.services.connectivityService',
            'ovpApp.services.errorCodes',
            'ovpApp.player.streamService',
            'ovpApp.src-service',
            'lib.platform',
            'rx',
            'ovpApp.player.flashAvailability',
            'ovpApp.player.sapService'
            ])
    .constant('playerErrors', {
        unentitled: 'unentitled',
        blocked: 'blocked',
        adBlocker: 'adBlocker',
        outOfHome: 'outOfHome',
        notFound: 'notFound',
        notRented: 'notRented',
        tunedAway: 'tunedAway',
        unknown: 'unknown',
        oohFraudDetection: 'oohFraudDetection'
    })
    .factory('playerService', playerService)
    .component('player', {
        templateUrl: '/js/ovpApp/components/player/player.html',
        controller: class Player {
            /* @ngInject */
            /*jshint -W072*/ // Suppress 'too many parameters' warning.
            constructor($scope, $rootScope, $q, TWCVideoJS, config, ovpStorage, storageKeys, $controller,
                rx, PlayerSplunkService, createObservableFunction, playerService, $timeout, VastParser,
                LegacyAdParser, $http, $log, InsecureService, $location, ovpFullscreen, parentalControlsDialog,
                parentalControlsContext, connectivityService, playerStreamService, $state, flashAvailabilityService,
                errorCodesService) {

                angular.extend(this, {$scope, $rootScope, $q, TWCVideoJS, config, ovpStorage, storageKeys,
                    $controller, rx, PlayerSplunkService, createObservableFunction, playerService, $timeout,
                    VastParser, LegacyAdParser, $http, $log, InsecureService, $location, ovpFullscreen,
                    parentalControlsDialog, parentalControlsContext, connectivityService, playerStreamService, $state,
                    flashAvailabilityService, errorCodesService});
            }

            $onInit() {
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

                this.initPlayer()
                    .then(() => this.preloading = false)
                    .then(() => this.applyInitialSettings())
                    .then(() => this.initAnalyticsAndSplunk())
                    .then(() => this.playerInitialized = true)
                    .catch((error) => {
                        this.preloading = false;
                        this.playerStateKnown = (error === 'needsFlashUpdate');

                        this.needsFlashUpdate = this.flashAvailabilityService.needsFlashUpdate();
                        this.hasFlashInstalled = this.flashAvailabilityService.hasFlashInstalled();

                        // Analytics
                        let pageName = 'adobeFlashNotAvailableWarning'; // Default
                        if (this.hasFlashInstalled && this.needsFlashUpdate) {
                            pageName = 'adobeFlashUpgradeWarning';
                        } else if (this.hasFlashInstalled && !this.needsFlashUpdate && this.playerStateKnown) {
                            pageName = 'adobeFlashInstalledButUnavailable';
                        }
                        this.$rootScope.$emit('Analytics:flash-warning', {
                            pageName: pageName,
                            toState: this.$state.current
                        });
                    });

                this.$scope.$on('stream-uri-obtained', (event, type, streamInfo) => {
                    this.applyInitialBitrate();
                    this.segmentErrors = [];
                    let streamUrl = '';
                    if (!streamInfo) {
                        streamInfo = {};
                    }
                    if (streamInfo.stream) {
                        streamUrl = streamInfo.stream.streamUrlWithDAIScheme || streamInfo.stream.stream_url;
                    }
                    streamInfo.type = type;
                    if (streamUrl.indexOf('?') > 0) {
                        streamInfo.parts = streamUrl
                            .split('?')[1]
                            .split('&')
                            .map(pairs => pairs.split('='))
                            .reduce((memo, part) => {
                                memo[part[0]] = part[1];
                                return memo;
                            }, {});
                    } else {
                        streamInfo.parts = {};
                    }
                    this.streamInfo = streamInfo;
                    this.debug = this.$location.search().debug === 'true';
                });

                this.$rootScope.$on('player:detachControls', () => {
                    this.playbackStop();
                    this.debug = false;
                    this.preloading = true;
                    this.$timeout(() => {
                        this.preloading = false;
                    }, 0);
                });

                this.$scope.$on('connectivityService:statusChanged', this.onConnectionChange.bind(this));
            }

            $onDestroy() {
                this.teardown();
            }

            /////////////////

            initPlayer() {
                return this.playerService.getInstance().then(playerInstance => {
                    this.player = playerInstance;
                    this.registerPlayerEvents();
                    this.teardown.subscribe(() => this.player.stop());
                });
            }

            initAnalyticsAndSplunk() {
                this.$rootScope.$emit('Analytics:playerInitialized', this.player);

                if (this.config.getBool(this.config.splunkControlParameters.splunkLoggingEnabled)) {
                    this.playerSplunkService = new this.PlayerSplunkService(this.player);
                }
            }

            registerPlayerEvents() {
                this.observableFromPlayerEvent('ad-twc-tracking-request')
                    .subscribe(event => this.onTrackingRequest(event));
                this.observableFromPlayerEvent('unblock-stream-request')
                    .subscribe(event => this.onUnblockStreamRequest(event));
                this.observableFromPlayerEvent('ad-metadata-received')
                    .subscribe(event => this.onAdMetadataReceived(event));
                this.observableFromPlayerEvent('ad-metadata-event-received')
                    .subscribe(event => this.onAdMetadataEventReceived(event));
                this.observableFromPlayerEvent('player-position-changed')
                    .subscribe(event => this.onPlayerPositionChanged(event));
                this.observableFromPlayerEvent('bitrate-changed')
                    .subscribe(event => this.onBitRateChanged(event));
                this.observableFromPlayerEvent('channel-changed')
                    .subscribe(event => this.onChannelChanged(event));
                this.observableFromPlayerEvent('error')
                    .subscribe(event => this.onVideoPlayerError(event));
                this.observableFromPlayerEvent('sap-init')
                    .subscribe(event => this.onSapInit(event));

                let started = this.observableFromPlayerEvent('playback-started');
                let playbackStopped = this.teardown.merge(this.playbackStop);
                playbackStopped.skipUntil(started)
                    .subscribe(() => {
                        this.player.trigger('playback-stopped', {
                            TriggeredBy: 'exitPlayer'
                        });
                        started = false;
                    });
            }

            applyInitialSettings() {
                this.applyControlParameters();
                this.applyVolume();
                this.applyMute();
                this.applyCCEnabled();
                this.applyCCSettings();
                this.applySap();

                this.$rootScope.$eventToObservable('EAS:start')
                    .takeUntil(this.teardown)
                    .subscribe(() => this.onEAS());

                this.$rootScope.$eventToObservable('player:minimize')
                    .takeUntil(this.teardown)
                    .subscribe(() => this.onMinimize());
            }

            applyControlParameters() {
                try {
                    let bitRateConfig = this.config.playerBitrateControlParameters;
                    if (bitRateConfig.overrideDefaults) {
                        this.player.setBitrateControlParameters(bitRateConfig);
                    }
                } catch (e) {
                    this.$log.error('Error parsing playerBitrateControlParameters', e);
                }
            }

            applyInitialBitrate () {
                if (this.lastBitrate) {
                    this.player.setBitrateControlParameters({
                        initialBitrateInBitsPerSec: this.lastBitrate
                    });
                }
            }

            applyVolume(scheduler) {
                const key = this.storageKeys.volumeLevel;
                let volume = this.ovpStorage.getItem(key);
                if (volume === null || volume === undefined) {
                    volume = 0.4;
                }
                this.player.setVolume(parseFloat(volume));

                this.observableFromPlayerEvent('volume-level-changed')
                    .debounce(1000, scheduler)
                    .subscribe(volume => this.ovpStorage.setItem(key, volume));
            }

            applyMute() {
                const key = this.storageKeys.muted;
                if (this.forceUnmute) {
                    this.player.setMuted(false);
                    this.forceUnmute = false;
                } else {
                    this.player.setMuted(!!this.ovpStorage.getItem(key));
                }

                this.observableFromPlayerEvent('mute-toggled')
                    .subscribe(muted => {
                        if (!this.forceUnmute) {
                            this.ovpStorage.setItem(key, muted);
                        }
                    });
            }

            applyCCEnabled() {
                const key = this.storageKeys.ccEnabled;
                let ccEnabled = this.ovpStorage.getItem(key);
                if (ccEnabled !== undefined) {
                    this.player.setCCEnabled(ccEnabled);
                }

                this.observableFromPlayerEvent('cc-enabled-toggled')
                    .subscribe(cc => this.ovpStorage.setItem(key, cc));
            }

            applyCCSettings() {
                const key = this.storageKeys.ccSettings;
                let ccSettings = this.ovpStorage.getItem(key);
                if (ccSettings !== undefined) {
                    this.player.setCCSettings(ccSettings);
                }

                this.observableFromPlayerEvent('cc-settings-changed')
                    .subscribe(settings => this.ovpStorage.setItem(key, settings));
            }

            applySap() {
                const key = this.storageKeys.sapEnabled;
                let sapEnabled = this.ovpStorage.getItem(key);
                if (sapEnabled !== undefined /* TBD check what nonset values return */) {
                    this.player.setSAPEnabled(sapEnabled);
                }
                this.observableFromPlayerEvent('sap-toggled')
                    .subscribe(sap => this.ovpStorage.setItem(key, sap));
            }

            onMinimize() {
                this.ovpFullscreen.exitFullscreen();
            }

            onEAS() {
                let wasMuted = this.ovpStorage.getItem(this.storageKeys.muted);
                this.player.setMuted(true);

                this.$rootScope.$eventToObservable('EAS:end')
                    .first()
                    .takeUntil(this.teardown)
                    .subscribe(() => this.player.setMuted(wasMuted));
            }

            onConnectionChange(event, isOnline, timeout) {
                if (isOnline && this.resumePlay) {
                    this.resumePlay();
                } else {
                    if (this.player.isPlaying()) {
                        this.$timeout(() => {
                            if (this.$state.current.name === 'ovp.livetv') {
                                this.player.stop();
                                this.player.trigger('playback-stopped', {
                                    TriggeredBy: 'connectivityLost'
                                });
                                this.resumePlay = () => {
                                    this.playerStreamService.playChannel({
                                        player: this.player,
                                        channel: this.channel,
                                        triggeredBy: 'connectionRestore'
                                    });
                                    this.$rootScope.$broadcast('playback-resumed');
                                    this.resumePlay = null;
                                };
                            } else {
                                this.player.trigger('playback-pause-toggled', true);
                                this.player.pause();
                                this.resumePlay = () => {
                                    this.player.trigger('playback-pause-toggled', false);
                                    this.player.play();
                                    this.resumePlay = null;
                                };
                            }
                        }, timeout);
                    }
                }

            }

            onVideoPlayerError(error) {
                if (error.errorID ===  1000005 /* SEGMENT_ERROR */ && this.config.enableSegmentErrorRestart) {
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

                            let errorUri = error.mediaPlayerErrorDescription;
                            if (!this.segmentErrors[errorUri]) {
                                this.segmentErrors[errorUri] = 0;
                            }
                            this.segmentErrors[errorUri]++;

                            if (this.segmentErrors[errorUri] >= this.config.maxPlayerSegmentError) {
                                this.$log.error('Segment Error - Restarting Stream');

                                // Analytics: Report playback failure.
                                this.$rootScope.$emit('Analytics:playbackFailure', {
                                    // We seemingly only reach this point with linear assets.
                                    asset: (this.channel ? this.channel.asset : undefined),
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

            onSapInit(event) {
                if (event.audio && event.audio.length > 1) {
                    this.playerSplunkService.onError({
                        errorID: 106601,
                        errorMessage: 'Missing audio stream',
                        mediaPlayerErrorCode: 106601,
                        mediaPlayerErrorDescription: 'Zero audio streams available for content'
                    });
                }
            }

            onAdMetadataReceived(event)  {
                try {
                    if (event.name) {
                        event = [event];
                    }
                    let adBreaks = [];
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

            onAdMetadataEventReceived(event) {
                try {
                    let adInstance = null;
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

            onTrackingRequest(trackingEvent) {
                this.VastParser.getTrackingUrls(trackingEvent)
                    .forEach((url) => this.sendTrackingRequest(url));
            }

            sendTrackingRequest(trackingUrl) {
                if ((trackingUrl.indexOf('https://') === 0) &&
                    (trackingUrl.indexOf(this.config.authNeededTrackingDomain)) >= 0) {
                    this.$http({
                        method: 'GET',
                        url: trackingUrl,
                        withCredentials: true
                    });
                } else {
                    this.InsecureService.get(trackingUrl);
                }
            }

            onPlayerPositionChanged(event) {
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

            onBitRateChanged(event) {
                if (event && event.event) {
                    this.lastBitrate = event.event.profile;
                }
            }

            onChannelChanged(event) {
                if (event.channel) {
                    this.channel = event.channel;
                }
            }

            observableFromPlayerEvent(eventName) {
                return this.rx.Observable.fromEventPattern(
                    h => this.player.on(eventName, h),
                    h => this.player.off(eventName, h)
                ).takeUntil(this.teardown);
            }

            onUnblockStreamRequest() {
                this.parentalControlsDialog
                    .withContext(this.parentalControlsContext.PLAYBACK)
                    .unlock()
                    .then(() => this.$rootScope.$broadcast('player:parentalControlsUnblocked'));
            }

            isValidPlayRoute() {
                return this.playerService.isValidPlayRoute();
            }

            resetChannel() {
                this.player.stop();
                this.playerStreamService.playChannel({
                    player: this.player,
                    channel: this.channel,
                    triggeredBy: 'sessionTimeout'
                });

            }
        }
    });

    /**
     * Service singleton that keeps one instance of player around.
     */

    /* @ngInject */
    function playerService($window, $document, OvpSrcService, messages,
                           alert, platform, TWCVideoJS, $q, rx,
                           $state, $timeout, $rootScope, errorCodesService, sapService) {
        let playerInstance,
            initDeferred = $q.defer();

        let subject = new rx.ReplaySubject(1);

        let service = {
            getInstance,
            playStream,
            assetLoadedSource: subject.filter(options => !!options),
            stop,
            isValidPlayRoute,
            showErrorAlert
        };

        return service;

        ///////////////

        function isValidPlayRoute() {
            const state = $state.transition ? $state.transition.to() : $state.current;

            return state &&
                (state.name.indexOf('ovp.ondemand.play') > -1 ||
                state.name.indexOf('ovp.livetv') > -1);
        }

        function getInstance() {
            if (flashElementDefined() && !playerInstance) {
                init();
            }
            return initDeferred.promise;
        }

        function flashElementDefined() {
            let flashDomElement = $document[0].getElementById('flash-content');
            return flashDomElement !== null;
        }

        function stop() {
            getInstance().then(() => {
                playerInstance.stop();
                subject.onNext(undefined);
                $rootScope.$broadcast('player:detachControls');
            });
        }

        function playStream(options) {
            // Analytics: inform start of new stream
            $rootScope.$emit('Analytics:initiateNewStream', options);

            getInstance().then(() => {
                // Analytics: inform start of new stream
                $rootScope.$emit('Analytics:initiateNewStream', options);
                subject.onNext(options);
            });
        }

        function showErrorAlert(error, asset) {
            // default generic error message
            let errorCode = 'WLI-9000';

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
            let isWindow = platform.os.family.indexOf('Windows') > -1,
                isFForIE = platform.name === 'Firefox' || platform.name === 'IE',
                wmode = (isWindow && isFForIE) ? 'opaque' : 'direct',
                flashDomElement = $document[0].getElementById('flash-content');

            if (flashDomElement) {
                playerInstance = new TWCVideoJS.FlashVideoPlayer(
                    flashDomElement,
                    $window.swfobject,
                    OvpSrcService.versionPath('js/libs/ovp-video-player/'),
                    null, //This is ignored, should delete
                    function (e) {
                        if (!e.success) {
                            initDeferred.reject('needsFlashUpdate');
                        }
                    },
                    wmode
                );

                playerInstance.on('player-initialized', () => {
                    // Make flash-conent non-focusable
                    let flashObject = $document[0].getElementsByClassName('twctv-flash-video-player')[0];
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
