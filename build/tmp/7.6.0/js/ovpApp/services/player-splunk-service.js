'use strict';

(function () {
    'use strict';
    PlayerSplunkServiceFactory.$inject = ["SplunkService", "$window", "TWCVideoJS", "$log", "$timeout", "config"];
    angular.module('ovpApp.legacy.PlayerSplunkService', ['ovpApp.services.splunk', 'ovpApp.config', 'ovpApp.video']).factory('PlayerSplunkService', PlayerSplunkServiceFactory);

    /**
     * A service for logging player events to splunk
     * @param {object} videoPlayer an already-initialized player
     */
    function PlayerSplunkServiceFactory(SplunkService, $window, TWCVideoJS, $log, $timeout, config) {
        var FlashVideoPlayer = TWCVideoJS.FlashVideoPlayer;

        function PlayerSplunkService(videoPlayer) {
            this.videoPlayer = videoPlayer;
            this.initialValuesSet = false;
            this.isMuted = false;
            this.playerPosition = 0;
            this.volumeLevel = 0.4;
            this.isPlaying = false;
            this.isVideoFullScreen = false;
            this.showingInfoOverlay = false;
            this.ccEnabled = false;
            this.sapEnabled = false;
            this.currentChannel = {};
            this.isBuffering = false;
            this.streamData = {};
            this.bitRate = 0;
            this.isPaused = false;
            this.inAd = false;
            this.flashPlayerVersion = '';
            this.droppedFrameCount = 0;

            this.attachEventListeners();
        }

        PlayerSplunkService.prototype.onPlayerInitialized = function () {
            this.initialValuesSet = true;
            this.updateFlashPlayerVersion();
        };

        PlayerSplunkService.prototype.updateFlashPlayerVersion = function () {
            // Get flash player version
            if ($window.swfobject) {
                var version = $window.swfobject.getFlashPlayerVersion();
                this.flashPlayerVersion = version.major + '.' + version.minor + '.' + version.release + '.' + version.build;
            }
        };

        PlayerSplunkService.prototype.onPlayerPositionChanged = function (e) {
            this.playerPosition = Math.floor(e.PlaybackTimestamp / 1000);
        };

        PlayerSplunkService.prototype.onInfoOverlayToggled = function (shown) {
            this.showingInfoOverlay = shown;
        };

        PlayerSplunkService.prototype.onCCEnabledToggled = function (cc) {
            this.ccEnabled = cc;
        };

        PlayerSplunkService.prototype.onSAPToggled = function (sap) {
            this.sapEnabled = sap;
        };

        PlayerSplunkService.prototype.onCCSettingsChanged = function () {
            // do something
        };

        PlayerSplunkService.prototype.onChannelChanged = function (args) {
            this.currentChannel = {
                channelId: args.channel.channelId,
                localChannelNumber: args.channel.localChannelNumber,
                userSelected: args.userSelected,
                callSign: args.channel.callSign
            };
        };

        PlayerSplunkService.prototype.onBufferingBegan = function () {
            this.isBuffering = true;

            this.reportPlayerStatus('bufferingStarted');
        };

        PlayerSplunkService.prototype.onMuteToggled = function (muted) {
            this.isMuted = muted;
        };

        PlayerSplunkService.prototype.onVolumeLevelChanged = function (volume) {
            this.volumeLevel = volume;
        };

        PlayerSplunkService.prototype.onStreamUriObtained = function (e) {
            this.streamData = {
                contentProtection: 'SecureMedia',
                contentFormat: 'HLS',
                contentMetadata: e.contentMetadata,
                contentBookmark: e.contentBookmark || undefined,
                playerType: e.playerType,
                streamUrl: e.stream.stream_url,
                dai: e.stream.dai,
                drm: e.stream.drm
            };

            // Create a GUID that is the same for the same channel playback or vod asset playback.
            // Use for grouping a set of events for the playback
            this.playbackSessionGUID = config.randomGuid();
        };

        PlayerSplunkService.prototype.onAdStartTrackingUrl = function () {
            // do something
        };

        PlayerSplunkService.prototype.onAdEndTrackingUrl = function () {
            // do something
        };

        PlayerSplunkService.prototype.onBufferingEnded = function () {
            this.isBuffering = false;

            this.reportPlayerStatus('bufferingStopped');
        };

        PlayerSplunkService.prototype.onBitRateChanged = function (e) {
            e = e.event;
            this.bitRate = e.profile;

            this.reportPlayerStatus('bitrateChanged', e);
        };

        PlayerSplunkService.prototype.onDroppedFrameCountChanged = function (e) {
            this.droppedFrameCount = e.NewDroppedFramesCount;

            this.reportPlayerStatus('droppedFrameCountsChanged');
        };

        PlayerSplunkService.prototype.onPlaybackStarted = function () {
            this.isPlaying = true;

            this.reportPlayerStatus('playbackStarted');
        };

        PlayerSplunkService.prototype.onPlaybackStopped = function () {
            this.isPlaying = false;

            this.reportPlayerStatus('playbackStopped');
        };

        PlayerSplunkService.prototype.assembleCommonFields = function () {
            var playerDetails = {};
            var streamType = this.streamData && this.streamData.playerType;

            if (streamType === 'linear') {
                playerDetails.playbackType = 'linear';
                playerDetails.channelNumber = this.currentChannel.localChannelNumber;
                playerDetails.networkName = this.currentChannel.callSign;
            } else if (streamType === 'onDemand') {
                playerDetails.playbackType = 'vod';
                playerDetails.contentClass = this.streamData.contentMetadata.contentClass;
                playerDetails.productProvider = this.streamData.contentMetadata.provider;
                playerDetails.providerAssetId = this.streamData.contentMetadata.providerAssetId;
            } else if (streamType === 'cdvr') {
                playerDetails.playbackType = 'cdvr';
                playerDetails.cdvrRecording = this.streamData.contentMetadata.cdvrRecording;
            }

            playerDetails.streamType = this.streamData.contentFormat;
            playerDetails.streamUri = this.streamData.streamUrl;
            playerDetails.tmsId = this.streamData.contentMetadata.tmsProgramId;
            playerDetails.id = this.playbackSessionGUID;

            // Optional if available - Same as reported to Event Gateway
            playerDetails.playbackPosition = this.playerPosition;
            playerDetails.bitrate = this.bitRate;
            playerDetails.droppedFrameCount = this.droppedFrameCount;

            playerDetails.dai = this.streamData.dai; // Does asset have DAI
            playerDetails.inAd = this.inAd; // Playback is in an ad or not
            playerDetails.flashPlayerVersion = this.flashPlayerVersion;

            return playerDetails;
        };

        PlayerSplunkService.prototype.reportPlayerStatus = function (status, additionalData) {
            try {
                var playerStatusDetails = this.assembleCommonFields();
                if (additionalData) {
                    playerStatusDetails = Object.assign(playerStatusDetails, additionalData);
                }

                // Player status should be on of these values: playbackStarted, bitrateChanged,
                // bufferingStarted, bufferingStopped, playbackStopped. Note playbackStarted and
                // playbackStopped are compulsory.
                playerStatusDetails.status = status;

                SplunkService.sendPlayerStatus(playerStatusDetails);
            } catch (e) {
                $log.warn(e);
            }
        };

        PlayerSplunkService.prototype.onError = function (err) {
            try {
                this.updateFlashPlayerVersion();
                var playerErrorDetails = this.assembleCommonFields(err);

                // the intent of errorCode is to be a platform-specific code, which as of May 2016 we have not
                // defined any. For now we'll return the error code from the response
                playerErrorDetails.errorCode = err.errorID;

                if (err.stackTrace) {
                    playerErrorDetails.stackTrace = err.stackTrace;
                }

                if (err.errorID === FlashVideoPlayer.playerErrorCodes.START_STREAM_FAILED_ERROR) {
                    playerErrorDetails.errorType = 'tuneFailed';
                } else if (err.errorID === FlashVideoPlayer.playerErrorCodes.REFRESH_AD_STATUS_FAILED) {
                    playerErrorDetails.errorType = 'uncaughtError';
                } else {
                    playerErrorDetails.errorType = 'streamFailed';
                }

                playerErrorDetails.errorMessage = err.message || err.name;
                playerErrorDetails.mediaPlayerErrorCode = err.mediaPlayerErrorCode || 0;
                playerErrorDetails.mediaPlayerErrorRuntimeCode = err.mediaPlayerErrorRuntimeCode || 0;
                playerErrorDetails.mediaPlayerErrorDescription = err.mediaPlayerErrorDescription || '';

                SplunkService.sendPlayerError(playerErrorDetails);
            } catch (e) {
                $log.warn(e);
            }
        };

        PlayerSplunkService.prototype.onFullScreenToggled = function (e) {
            this.isVideoFullScreen = e;
        };

        PlayerSplunkService.prototype.onMiniGuideShown = function () {
            // do something
        };

        PlayerSplunkService.prototype.attachEventListeners = function () {

            this.videoPlayer.on('player-initialized', this.onPlayerInitialized.bind(this));

            this.videoPlayer.on('player-position-changed', this.onPlayerPositionChanged.bind(this));

            this.videoPlayer.on('info-overlay-toggled', this.onInfoOverlayToggled.bind(this));

            this.videoPlayer.on('cc-enabled-toggled', this.onCCEnabledToggled.bind(this));

            this.videoPlayer.on('sap-toggled', this.onSAPToggled.bind(this));

            this.videoPlayer.on('cc-settings-changed', this.onCCSettingsChanged.bind(this));

            this.videoPlayer.on('channel-changed', this.onChannelChanged.bind(this));

            this.videoPlayer.on('channel-filter-changed', this.onChannelFilterChanged.bind(this));

            this.videoPlayer.on('channel-sortby-changed', this.onChannelSortByChanged.bind(this));

            this.videoPlayer.on('buffering-began', this.onBufferingBegan.bind(this));

            this.videoPlayer.on('mute-toggled', this.onMuteToggled.bind(this));

            this.videoPlayer.on('volume-level-changed', throttle(this.onVolumeLevelChanged.bind(this), 1000));

            this.videoPlayer.on('stream-uri-obtained', this.onStreamUriObtained.bind(this));

            this.videoPlayer.on('stream-scrubbed', this.onStreamScrubbed.bind(this));

            this.videoPlayer.on('ad-break-started', this.onAdBreakStarted.bind(this));

            this.videoPlayer.on('ad-break-stopped', this.onAdBreakStopped.bind(this));

            this.videoPlayer.on('ad-started', this.onAdStarted.bind(this));

            this.videoPlayer.on('ad-stopped', this.onAdStopped.bind(this));

            this.videoPlayer.on('ad-start-tracking-url', this.onAdStartTrackingUrl.bind(this));

            this.videoPlayer.on('ad-end-tracking-url', this.onAdEndTrackingUrl.bind(this));

            this.videoPlayer.on('buffering-ended', this.onBufferingEnded.bind(this));

            this.videoPlayer.on('playback-started', this.onPlaybackStarted.bind(this));

            this.videoPlayer.on('playback-pause-toggled', this.onPlaybackPauseToggled.bind(this));

            this.videoPlayer.on('playback-stopped', this.onPlaybackStopped.bind(this));

            this.videoPlayer.on('full-screen-toggled', this.onFullScreenToggled.bind(this));

            this.videoPlayer.on('mini-guide-shown', this.onMiniGuideShown.bind(this));

            this.videoPlayer.on('error', this.onError.bind(this));

            this.videoPlayer.on('dropped-frame-count-changed', this.onDroppedFrameCountChanged.bind(this));

            this.videoPlayer.on('bitrate-changed', this.onBitRateChanged.bind(this));
        };

        PlayerSplunkService.prototype.onPlaybackPauseToggled = function (isPaused) {
            this.isPaused = isPaused;
        };

        PlayerSplunkService.prototype.onAdStarted = function () {
            // do something
        };

        PlayerSplunkService.prototype.onAdStopped = function () {
            // do something
        };

        PlayerSplunkService.prototype.onAdBreakStarted = function () {
            this.inAd = true;
        };

        PlayerSplunkService.prototype.onAdBreakStopped = function () {
            this.inAd = false;
        };

        PlayerSplunkService.prototype.onStreamScrubbed = function () {
            // do something
        };

        PlayerSplunkService.prototype.onChannelFilterChanged = function () {
            // do something
        };

        PlayerSplunkService.prototype.onChannelSortByChanged = function () {
            // do something
        };

        return PlayerSplunkService;

        //Simple throttle implimentation, calls on the leading edge and trailing edge
        function throttle(callback, limit) {
            var wait = false,
                queued = false;

            return function () {
                if (!wait) {
                    callback.call();
                    wait = true;
                } else {
                    queued = true;
                }
            };
            function setupTimeout() {
                $timeout(endTimeout, limit);
            }
            function endTimeout() {
                if (queued) {
                    callback.call();
                    queued = false;
                    //Leave wait and set the timeout
                    setupTimeout();
                } else {
                    wait = false;
                }
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/player-splunk-service.js.map
