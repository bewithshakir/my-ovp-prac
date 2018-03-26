(function () {
    'use strict';

    angular.module('ovpApp.playerControls', [
        'ovpApp.player.blockingScreen',
        'ovpApp.product.service',
        'ovpApp.components.ovp.rating',
        'ovpApp.config',
        'ovpApp.playerControls.miniGuide',
        'ovpApp.playerControls.miniGuideData',
        'ovpApp.playerControls.skipButton',
        'ovpApp.player.streamService',
        'ovpApp.services.locationService',
        'ovpApp.services.parentalControlsService',
        'ovpApp.directives.draggable',
        'ovpApp.messages',
        'ovpApp.dataDelegate',
        'cfp.hotkeys',
        'dibari.angular-ellipsis',
        'ovpApp.directives.focus',
        'ovpApp.services.dateFormat',
        'rx',
        'ovpApp.services.rxUtils',
        'selectn',
        'ovpApp.directives.ovp-fullscreen',
        'ovpApp.playerControls.ovpScrubber',
        'ovpApp.player',
        'ovpApp.product.productActionService',
        'ovpApp.services.profileService',
        'ovpApp.components.modal',
        'ovpApp.components.ovp.ccSettings',
        'ovpApp.services.errorCodes',
        'ovpApp.services.stbService',
        'ovpApp.services.flickTo',
        'ovpApp.services.windowFocus',
        'ovpApp.components.ovp.remotePlayerCCSettings',
        'ajoslin.promise-tracker',
        'ovpApp.player.sapService',
        'ovpApp.directives.keydown',
        'ovpApp.ondemand.goback'])
        .directive('playerControls', PlayerControls)
        .directive('preventDefault', preventDefault)
        .factory('playerControlTimer', playerControlTimer);

    function PlayerControls() {
        return {
            bindToController: true,
            controllerAs: 'vm',
            controller: PlayerControlsController,
            templateUrl: '/js/ovpApp/components/player/playerControls.html',
            scope: {
                player: '='
            }
        };
    }

    /* @ngInject */
    function preventDefault() {
        return {
            link: function (scope, element) {
                element.bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        };
    }

    /* @ngInject */
    function playerControlTimer($timeout, $rootScope, config) {
        let timer, service = {
            scheduleHide,
            cancelHide
        },
        PLAYER_CONTROLS_TIMEOUT = parseInt(config.playerParameters.playerControlsTimeoutMS);

        return service;

        ////////////////

        function scheduleHide() {
            cancelHide();
            timer = $timeout(() => {
                $rootScope.$broadcast('player-control:hide');
                timer = undefined;
            }, PLAYER_CONTROLS_TIMEOUT);
        }

        function cancelHide() {
            if (timer) {
                $timeout.cancel(timer);
            }
            timer = undefined;
        }
    }

    /* @ngInject */
    function PlayerControlsController($rootScope, $scope, version, $timeout, alert,
        TWCVideoJS, playerStreamService, profileService,
        messages, $state, $window, ondemandGoBack, globalKeydown, keyMap,
        BookmarkService, dummyEANAsset, config, CDVR_STATE, ovpFullscreen,
        playerControlTimer, playerService, playerErrors,
        locationService, $q, blockingScreenService, errorCodesService) {
        const vm = this;
        vm.seekToPosition = seekToPosition;
        vm.restart = restart;
        vm.loadingMessage = loadingMessage;
        vm.ariaLoadingMessage = ariaLoadingMessage;
        vm.appVersion = version.appVersion;
        vm.skip = skip;
        vm.skipSeconds = parseInt(config.playerParameters.skipSeconds);
        vm.remoteSessionControlEnabled = config.remoteSessionControlEnabled;
        vm.prepareToSetBookmark = prepareToSetBookmark;
        vm.onKeyDown = onKeyDown;
        vm.onFullScreenToggled = onFullScreenToggled;
        vm.onMouseLeave = onMouseLeave;
        vm.onMouseOver = onMouseOver;
        vm.isVodMode = isVodMode;
        vm.isLiveMode = isLiveMode;
        vm.CONTROLS_MODE = TWCVideoJS.FlashVideoPlayer.streamTypes;
        vm.playerElement = angular.element('#playerWrapper')[0];

        const goBack = () => ondemandGoBack(vm.asset, vm.isTrailer);

        let playerEvents = {
            'player-initialized': onPlayerInitialized,
            'source-set': onSourceSet,
            'playback-started': onPlaybackStarted,
            'playback-stopped': onPlaybackStopped,
            'player-position-changed': onPlayerPositionChanged,
            'stream-scrubbed': onStreamScrubbed,
            'buffering-began': bufferingBegan,
            'buffering-ended': bufferingEnd,
            'error': onPlayerError,
            'ad-breaks-created': onAdBreaksCreated,
            'player-end-position-changed': onPlayerEndPositionChanged,
            'player-mouse-down': onPlayerMouseDown
        };

        let scrubberReadyDefer = $q.defer();

        activate();
        ////////////////

        function setDefaults() {
            vm.bufferLenMsec = 0;
            vm.options = {};
            vm.pcBlockedScreen = false;
            vm.controls = '';
            vm.asset = undefined;
            vm.scrubberBarVisible = false;
            vm.menuVisible = false;
            vm.playbackTime = 0;
            vm.seeking = false;
            vm.stopped = true;
            vm.loading = false;
            vm.buffering = false;
            vm.duration = 0;
            vm.adBreakDuration = 0;
            vm.scrubbingDisabled = true;
            vm.adBreaks = [];
            vm.liveTmsId = '';
            vm.eanUrl = '';
            vm.enlarge = false;
        }

        function playVodAsset(options) {
            // This is to handle the case when we do not get the
            // streamList from NNS for the particular VOD asset, we show the
            // message to the user and take them back to the On Demand page.
            if (angular.isUndefined(options.stream)) {
                alert.open({
                    message: errorCodesService.getMessageForCode('WGU-1002'),
                    buttonText: 'OK'
                }).result.then(goBack);
                return;
            }

            vm.asset = options.asset;
            vm.isTrailer = options.isTrailer;
            vm.stream = options.stream;
            vm.isCdvr = options.isCdvr;

            initPlaybackTime(vm.stream);

            vm.asset = options.asset;
            vm.isTrailer = options.isTrailer;
            vm.stream = options.stream;
            vm.isCdvr = options.isCdvr;
            vm.slider.options.isAdPlaying = false;

            if (vm.asset && vm.stream.cdvrState === CDVR_STATE.IN_PROGRESS) {
                vm.slider.options.showBuffer = true;
            }

            if (vm.stream.isCDVRRecorded) {
                BookmarkService.setCdvrToBookmark(vm.stream.streamProperties.cdvrRecording.recordingId);
            } else {
                BookmarkService.setAssetToBookmark(vm.stream.streamProperties.providerAssetID);
            }

            playerStreamService.playVodAsset({
                player: vm.player,
                asset: vm.asset,
                stream: vm.stream,
                isTrailer: vm.isTrailer,
                isCdvr: vm.isCdvr,
                eptTime: getEptTime(),
                startTime: getStartTime()
            }).catch(onPlayVodError);
        }

        function updateControls(options) {
            vm.asset = options.asset;
            vm.loading = false;
            vm.liveTmsId = options.liveTmsId;
            vm.eanUrl = options.eanUrl;
            vm.controls = options.mode;
            registerCallbacks();
            registerBlockingListeners();

            if (isVodMode()) {
                playVodAsset(options);
            }
        }

        function registerBlockingListeners() {
            let blockingScreenSubscription;

            blockingScreenSubscription = blockingScreenService.getSource()
                .subscribe(({visible}) => {
                    vm.pcBlockedScreen = visible;
                    vm.loading = false;
                    vm.buffering = false;
                    vm.seeking = false;
                });

            $scope.$on('player:parentalControlsUnblocked', () => {
                vm.pcBlockedMessage = '';
            });

            $scope.$on('player:showBlockingScreen', () => {
                vm.pcBlockedMessage = 'This show is blocked by parental controls.' +
                    ' Press unblock button to play the video';
            });

            $scope.$on('$destroy', function () {
                blockingScreenSubscription.dispose();
            });
        }

        // Privat function
        function globalKeydownHandler(event) {
            // STVWEB-1699: k - play/pause, j - Go back, l (lowercase L) - Go forward and m - Mute/Unmute video
            switch (keyMap[event.keyCode]) {
                case 'j':
                    vm.skip(-1);
                    break;
                case 'l':
                    if (!vm.slider.options.ffDisabled) {
                        vm.skip(1);
                    }
                    break;
            }
        }

        function activate() {
            setDefaults();

            $scope.$on('seek-to-position', (event, data) => {
                vm.seekToPosition(data.positionSec, data.sourceElement);
            });

            $scope.$on('player-control:hide', () => {
                if (ovpFullscreen.isEnabled()) {
                    vm.controllerBarVisible = false; // hide if in full screen mode
                }
            });

            $scope.$on('player-control:guide-toggled', (evt, data) => {
                if (ovpFullscreen.isEnabled()) {
                    vm.controllerBarVisible = data.isVisible;
                }
            });

            $scope.$on('player-control:click', () => onPlayerMouseDown());

            let unsubscribe = playerService.assetLoadedSource.subscribe(options => {
                deregisterCallbacks(playerEvents);
                $scope.$evalAsync(() => {
                    updateControls(options);
                });
            });

            let keydownHandler = globalKeydown.observable
                // Ignore key events if not playing video and vod mode
                .filter((event) => vm.isValidPlayRoute() && vm.isVodMode() && !vm.slider.options.isAdPlaying &&
                    !(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey))
                .subscribe(globalKeydownHandler);

            $scope.$on('$destroy', () => {
                unsubscribe.dispose();
                keydownHandler.dispose();
            });

            /****** VOD Scrubber *******/
            vm.scrubbingDisabled = true;
            vm.slider = {
                options: {
                    max: 0,
                    step: 0,
                    value: 0,
                    ffDisabled: false,
                    adBreaks: []
                }
            };
        }

        function getEptTime() {
            if (vm.isTrailer || vm.isStartOver) {
                return 0;
            } else {
                let bookmark = vm.asset.bookmark;
                if (bookmark) {
                    if (bookmark.complete || bookmark.playMarkerSeconds >= bookmark.runtimeSeconds) {
                        return 0;
                    } else {
                        return bookmark.entertainmentPlayMarkerSeconds;
                    }
                }
            }
        }

        function getStartTime() {
            if (vm.isTrailer || vm.isStartOver) {
                return 0;
            } else {
                let bookmark = vm.asset.bookmark;
                if (!bookmark || bookmark.complete ||
                    (bookmark.playMarkerSeconds >= bookmark.runtimeSeconds)) {
                    return 0;
                } else {
                    return bookmark.playMarkerSeconds;
                }
            }
        }

        function skip(multiplier) {
            $rootScope.$broadcast('playerControls: skip', {multiplier: multiplier});
        }

        function updatePlaybackTimeMarkerPosition() {
            if (vm.stream && vm.stream.cdvrState === CDVR_STATE.IN_PROGRESS) {
                // Max is scheduled record time. But it is possible for
                // recording to go longer, so use the max of the length and the
                // schduled time.
                vm.slider.options.max = Math.ceil(Math.max(vm.bufferLenMsec / 1000, vm.duration));
            } else {
                vm.slider.options.max = Math.ceil(vm.bufferLenMsec / 1000);
            }
            if (vm.slider.options.max > 0) {
                scrubberReadyDefer.resolve();
            }
            vm.slider.options.value = vm.playbackTime;
            vm.slider.options.ffDisabled = vm.scrubbingDisabled;
            vm.scrubberBarVisible = vm.duration > 0; // Show scrubber when duration is available
        }

        function initPlaybackTime(stream) {
            vm.playbackTime = getStartTime();
            vm.duration = parseInt(stream.duration);
            setScrubbingDisabled();
            updatePlaybackTimeMarkerPosition();
        }

        function setScrubbingDisabled() {
            vm.scrubbingDisabled = vm.stream && vm.stream.streamProperties.tricks_mode &&
                vm.stream.streamProperties.tricks_mode.FASTFORWARD !== undefined &&
                !(vm.adBreaks && vm.adBreaks.length);
        }

        function onPlayerInitialized() {
            $timeout(function () {
                vm.loading = false;
            }, 0);
        }

        // This will calculate the EPT i.e entertainmentPlayTime which is the actual play time
        // minus advertisement. i.e EPT = (playbackTimestamp - adsTime)
        function calculateEpt(playbackTimestamp) {
            var adBreaksTime = 0;
            vm.adBreaks.find((adBreak) => {
                // This will handle the case when the adBreak has already passed. So we need the entire duration of
                // the adBreak.
                if (playbackTimestamp > adBreak.endTime) {
                    adBreaksTime =  adBreaksTime +  adBreak.duration;
                }
                // This will handle the case when the adBreak is currently going on. So we need that particular
                // playing duration only.
                else if (playbackTimestamp > adBreak.startTime && playbackTimestamp < adBreak.endTime) {
                    // As all the adBreak are in the ascending order of their occurences so if the
                    // above condition fails for the current adBreak then there is no need
                    // to check for the other adBreak.
                    adBreaksTime = adBreaksTime + (playbackTimestamp - adBreak.startTime);
                    return true;
                } else {
                    // If all the above conditions do not match for the current adBreak then do not need
                    // to go for the rest of the loop as adBreaks are in ascending order of their occurences.
                    return true;
                }
            });
            return (playbackTimestamp - adBreaksTime);
        }

        function onAdBreaksCreated(event) {
            if (isVodMode()) {
                vm.slider.options.adBreaks = [];
                vm.adBreaks = [];
                if (event && event.source) {
                    event.source.forEach((adBreak) => {
                        // Save all the adBreaks for a particular asset for further use.
                        vm.adBreaks.push(adBreak);
                        vm.slider.options.adBreaks.push({
                            startTime: adBreak.startTime,
                            duration: adBreak.duration
                        });
                        // Update duration
                        vm.adBreakDuration += parseInt(adBreak.duration / 1000);
                    });
                }
                // Ad breaks affect scrubbing disablement
                setScrubbingDisabled();
            }
        }

        function onSourceSet() {
            vm.loading = true;
        }

        function onPlaybackStarted() {
            vm.loading = false;
            vm.stopped = false;

            if (!vm.isVodMode()) {
                vm.controllerBarVisible = true;
            } else {
                scrubberReadyDefer.promise
                    .then(() => vm.controllerBarVisible = true);
            }
        }

        function onPlayerEndPositionChanged(event) {
            vm.bufferLenMsec = event.endPosition;
            $scope.$broadcast('player:endPositionChanged', event);
        }

        function onPlaybackPlaying() {
            vm.buffering = false;
            vm.loading = false;
        }

        function onSeekBegin() {
            vm.seeking = true;
        }

        function onSeekEnd() {
            vm.seeking = false;
            //player is not emitting buffer end when seek ends
            vm.buffering = false;
        }

        function onPlayerPositionChanged(event) {
            // Ignore if player is stopped. We seem to get these events after
            // stopped with a timestamp that is less than the end of the asset.
            // We don't want to update the bookmark again to be different from
            // what onPlaybackStopped() set.
            if (vm.stopped) {
                return;
            }

            let newPos = parseInt(event.PlaybackTimestamp / 1000);
            if (newPos != vm.playbackTime) {
                vm.playbackTime = newPos;
                updatePlaybackTimeMarkerPosition();
            }
            prepareToSetBookmark(event, vm.seeking ? 'seeking' : false);
        }

        function onStreamScrubbed(event) {
            prepareToSetBookmark(event, 'scrubbed');
        }

        function onPlayerMouseDown() {
            playerControlTimer.scheduleHide();
            if (ovpFullscreen.isEnabled() && !isLiveMode()) {
                vm.controllerBarVisible = !vm.controllerBarVisible;
            }
        }

        function seekToPosition(positionSec, sourceElement) {
            // New position should not go past the duration lest the player error out.
            let newPosSec = Math.max(0, Math.min(positionSec, (vm.bufferLenMsec / 1000) - 5));

            if (!vm.scrubbingDisabled || (newPosSec < vm.playbackTime)) {
                vm.player.seekToPosition(newPosSec * 1000, sourceElement);

                // Trigger the event to send it to the EG.
                vm.player.trigger('stream-scrubbed', {
                    PlaybackTimestamp: newPosSec * 1000,
                    Runtime: vm.duration * 1000,
                    sourceElement: sourceElement
                });

                // Update the playback marker so the UI reflects the seek point.
                vm.playbackTime = newPosSec;
                updatePlaybackTimeMarkerPosition();
            }
        }

        /**
         * @params (event) : Object that has PlaybackTimestamp and Runtime.
         * @params (postRightAway) : Boolean : Decides whether we need to send the bookmark now or later.
         *
         */
        function prepareToSetBookmark(event, postRightAway) {
            if (isVodMode() &&
                !event.Blocked && !vm.isTrailer) {
                BookmarkService.setBookmark(
                    postRightAway,
                    Math.floor(event.PlaybackTimestamp / 1000),
                    Math.floor(calculateEpt(event.PlaybackTimestamp) / 1000),
                    Math.floor(event.Runtime / 1000)
                );
            }
        }

        function onPlaybackStopped(event) {
            vm.stopped = true;

            if (isVodMode()) {
                if (event.TriggeredBy === 'streamEnd') {
                    event = {
                        PlaybackTimestamp: vm.duration * 1000, // As this is the end of the stream.
                        Runtime: vm.duration * 1000
                    };
                    vm.playbackTime = vm.duration;
                    $timeout(goBack, 200);
                } else if (event.TriggeredBy === 'exitPlayer') {
                    event = {
                        PlaybackTimestamp: vm.playbackTime * 1000,
                        Runtime: vm.duration * 1000
                    };
                }
                prepareToSetBookmark(event, 'stopped');
            }
            // Removed the corresponding subscribe event in the BookmarkService (the same results happen)
            // dispatcher.publish('PlayerView:playback-stopped',
            //     this.asset,
            //     BookmarkService.getBookmark(),
            //     event.TriggeredBy);
        }

        function bufferingBegan() {
            vm.buffering = true;
        }

        function bufferingEnd() {
            vm.buffering = false;
        }

        function onPlayerError(error) {
            if (isVodMode()) {
                // Live errors are handled by mini-guide.js
                let codes = TWCVideoJS.FlashVideoPlayer.playerErrorCodes;
                let keys = Object.keys(codes);
                if (keys.find(k => codes[k] === error.errorID)) {
                    playerService.showErrorAlert(error, vm.asset).then(goBack);
                }
            }
            vm.buffering = false;
            vm.loading = false;
        }

        function deregisterCallbacks(playerEvents) {
            for (let eventName in playerEvents) {
                if (playerEvents.hasOwnProperty(eventName)) {
                    vm.player.off(eventName, playerEvents[eventName]);
                }
            }
        }

        function registerCallbacks() {
            $scope.$on('player:assetSelected', onAssetSelected);

            let playerEvents = {
                'player-initialized': onPlayerInitialized,
                'source-set': onSourceSet,
                'playback-playing' : onPlaybackPlaying,
                'playback-started': onPlaybackStarted,
                'playback-stopped': onPlaybackStopped,
                'seekBegin': onSeekBegin,
                'seekEnd' : onSeekEnd,
                'player-position-changed': onPlayerPositionChanged,
                'stream-scrubbed': onStreamScrubbed,
                'buffering-began': bufferingBegan,
                'buffering-ended': bufferingEnd,
                'error': onPlayerError,
                'ad-breaks-created': onAdBreaksCreated,
                'player-end-position-changed': onPlayerEndPositionChanged,
                'player-mouse-down': onPlayerMouseDown,
                'ad-break-started': onAdBreakStarted,
                'ad-break-stopped': onAdBreakStopped
            };

            for (let eventName in playerEvents) {
                if (playerEvents.hasOwnProperty(eventName)) {
                    let rawFunction = playerEvents[eventName];
                    playerEvents[eventName] = (...params) => {
                        rawFunction(...params);
                        $scope.$evalAsync();
                    };

                    vm.player.on(eventName, playerEvents[eventName]);
                }
            }

            let stopVodListener = $rootScope.$on('stop-vod', () => {
                deregisterCallbacks(playerEvents);
            });

            $scope.$on('$destroy', () => {
                deregisterCallbacks(playerEvents);
                stopVodListener();
            });
        }

        function onAdBreakStarted() {
            vm.slider.options.isAdPlaying = true;
        }

        function onAdBreakStopped() {
            vm.slider.options.isAdPlaying = false;
        }

        function onAssetSelected(event, asset) {
            vm.asset = asset;
            vm.isSAPAvailable = false;
            vm.isSAPEnabled = false;
        }

        function restart() {
            vm.player.pause();
            vm.player.seekToPosition(0, 'restart');
        }

        function ariaLoadingMessage() {
            let message = loadingMessage(),
                ariaMessage = '';
            if (vm.asset != dummyEANAsset && isLiveMode()) {
                let preface = message ? message : '';
                let episodeTitle = vm.asset.episodeTitle ? vm.asset.episodeTitle : '';
                let title = vm.asset.title ? vm.asset.title : '';
                ariaMessage += preface + ' ' + title + ' ' + episodeTitle;
                if (vm.asset.channel.hasLinkedVODAsset) {
                    ariaMessage += ' Press Enter to Restart Show';
                }
            } else {
                ariaMessage = message;
            }
            return ariaMessage;
        }

        function loadingMessage() {
            if (vm.loading && vm.asset) {
                if (vm.asset === dummyEANAsset) {
                    return 'Please wait for important emergency alert message...';
                } else {
                    if (isVodMode()) {
                        return `Loading ${vm.asset.title}`;
                    } else if (isLiveMode()) {
                        return `Loading ${vm.asset.channel ? vm.asset.channel.networkName : vm.asset.title}`;
                    }
                }
            } else if (vm.buffering) {
                return 'Buffering';
            } else if (vm.seeking) {
                return 'Seeking';
            }
        }

        function onPlayVodError(error) {
            if (error == playerErrors.tunedAway || error == playerErrors.oohFraudDetection) {
                return;
            } else if (error == playerErrors.outOfHome) {
                locationService.resetCache();
                alert.open(errorCodesService.getAlertForCode('WLC-1012')).result.then(goBack);
            } else if (error == playerErrors.unentitled) {
                alert.open({
                    message: errorCodesService.getMessageForCode('WEN-1004', {
                        IVR_NUMBER: config.ivrNumber
                    }),
                    buttonText: 'OK'
                }).result.then(goBack);
            } else if (error == playerErrors.notFound) {
                alert.open({
                    message: errorCodesService.getMessageForCode('WGU-1002'),
                    buttonText: 'OK'
                }).result.then(goBack);
            } else {
                alert.open({
                    message: errorCodesService.getMessageForCode('WGE-1001'),
                    buttonText: 'OK'
                }).result.then(goBack);
            }
        }

        function onFullScreenToggled(isEnabled) {
            $scope.$broadcast('player:fullscreen-toggled', {isEnabled: isEnabled});
            if (isEnabled) {
                vm.controllerBarVisible = false;
            } else {
                vm.controllerBarVisible = true;
            }
        }

        function onKeyDown() {
            if (!vm.controllerBarVisible) {
                $scope.$broadcast('player-control:click'); // show mini guide while showing controller bar
            }
            playerControlTimer.scheduleHide();
        }

        function onMouseOver() {
            playerControlTimer.cancelHide();
        }

        function onMouseLeave() {
            playerControlTimer.scheduleHide();
        }

        function isVodMode() {
            return vm.controls === vm.CONTROLS_MODE.VOD ||
                vm.controls === vm.CONTROLS_MODE.CDVR;
        }

        function isLiveMode() {
            return vm.controls === vm.CONTROLS_MODE.LIVE;
        }

        vm.isValidPlayRoute = function () {
            return playerService.isValidPlayRoute();
        };
    }
})();
