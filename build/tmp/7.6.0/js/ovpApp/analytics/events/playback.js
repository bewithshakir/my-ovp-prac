'use strict';

(function () {
    'use strict';

    playbackEvents.$inject = ["$rootScope", "analyticsService", "$log", "config", "$transitions", "analyticsAssetHelper", "$state", "playerService"];
    angular.module('ovpApp.analytics.events.playback', ['ovpApp.analytics.analyticsService', 'ovpApp.analytics.analyticsAssetHelper']).factory('playback', playbackEvents).run(["playback", function loadHandler(playback) {
        return playback;
    }]);

    /* @ngInject */
    function playbackEvents($rootScope, analyticsService, $log, config, $transitions, analyticsAssetHelper, $state, playerService) {

        var state = analyticsService.state;

        // Flag for tracking that we were in a 'paused' state when buffering began.
        // We track this because we'll need to resume buffering after unpausing.
        var resumeBufferingAfterUnpause = false;

        $rootScope.$on('Analytics:playerInitialized', function (e, player) {
            attachEventListeners(player);
            state.setPlayer(player);
        });

        // Attach to root scope during init time so listeners are ready before
        // player is initialized.
        $rootScope.$on('playback-resumed', resumeStream);
        $rootScope.$on('Analytics:initiateNewStream', initiateNewStream);

        // On logout, stop any ongoing playbacks.
        $rootScope.$on('Analytics:haltPlaybackFromLogout', haltPlaybackFromLogout);

        /**
         * Event handler for capturing when the player's end time (media duration)
         * has changed.
         * @param e event with new media duration.
         */
        function endPositionChanged(e) {
            // Update the 'selectedContent' object that tracks the media about to
            // be played.
            state.setActualRuntimeMs(e.endPosition);
        }

        /**
         * Player is resuming a stream that is already loaded. It will not generate
         * any select or uri-acquired events, so we'll have to replay the last
         * ones that we captured to put the SDK into the correct state.
         */
        function resumeStream() /* e */{
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: Resuming previous stream');
            }

            // Hold on to the stream start events now, since the 'select' will
            // delete our existing selectedContent object.
            var selectEvent = state.getLastSelectEvent();
            var streamUriEvent = state.getLastStreamUriEvent();
            var startEvent = { bitrate: state.getBitrate() };
            var playbackType = state.getLastPlaybackType();

            // Safety check: Cannot resume stream if we don't have the setup events.
            if (null === selectEvent || null === streamUriEvent || null === playbackType) {
                $log.error('Analytics: Cannot resume stream due to missing events or playbackType', selectEvent, streamUriEvent, playbackType);
                return;
            }

            // Replay the stream setup events.
            if ('linear' === playbackType) {
                channelChanged(selectEvent);
            } else if ('vod' === playbackType) {
                vodContentSelected(selectEvent);
            } else if ('dvr' === playbackType) {
                cdvrContentSelected(selectEvent);
            } else {
                $log.error('Analytics: unrecognized playbackType:' + playbackType);
            }
            streamUriObtained(streamUriEvent);
            playbackStarted(startEvent);
        }

        return {
            channelChanged: channelChanged,
            endPositionChanged: endPositionChanged,
            resumeStream: resumeStream,
            initiateNewStream: initiateNewStream,
            vodContentSelected: vodContentSelected,
            cdvrContentSelected: cdvrContentSelected,
            streamUriObtained: streamUriObtained,
            playbackStarted: playbackStarted,
            playerPositionChanged: playerPositionChanged,
            pauseToggled: pauseToggled,
            bufferingStarted: bufferingStarted,
            bufferingStopped: bufferingStopped,
            scrubJump: scrubJump,
            bitrateChanged: bitrateChanged,
            playbackStopped: playbackStopped,
            adBreakStopped: adBreakStopped,
            adBreakStarted: adBreakStarted,
            adStarted: adStarted,
            adStopped: adStopped,
            adTracking: adTracking,
            isPlaying: isPlaying
        };

        function playerPositionChanged(e) {
            try {
                analyticsService.setPlayerPosition(Math.floor(e.PlaybackTimestamp));
            } catch (ex) {
                $log.error(ex);
            }
        }

        function haltPlaybackFromLogout() {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: haltPlaybackFromLogout');
                }
                playbackStopped();
            } catch (ex) {
                $log.error(ex);
            }
        }

        function pauseToggled(enabled) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: pauseToggled enabled=' + enabled + ', resumeBufferingAfterUnpause=' + resumeBufferingAfterUnpause);
                }
                var _event = undefined;
                if (enabled) {
                    _event = 'playbackPause';
                } else {
                    _event = 'playbackUnpause';
                }

                // If we are buffering when pause begins, we need to end the buffering
                // in order to transition to the 'paused' state.
                if (_event === 'playbackPause' && 'buffering' === analyticsService.getCurrentLibraryState()) {
                    bufferingStopped();
                    resumeBufferingAfterUnpause = true;
                } else if (_event === 'playbackUnpause' && 'buffering' === analyticsService.getCurrentLibraryState()) {
                    // Do what...
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Discarding unpause due to ongoing buffering');
                    }
                    resumeBufferingAfterUnpause = false;
                    return;
                }

                analyticsService.event(_event, { triggeredBy: 'user' });

                // Resume buffering if we were buffering before unpausing.
                if (_event === 'playbackUnpause' && resumeBufferingAfterUnpause) {
                    resumeBufferingAfterUnpause = false;
                    bufferingStarted();
                }
            } catch (ex) {
                $log.error(ex);
            }
        }

        /**
         * React to a request to play the given stream.
         * @param e event
         * @param data Event data, including the stream requested for playback.
         */
        function initiateNewStream(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: initiateNewStream', data);
                }

                // Capture the requested stream for use in later event processing.
                state.setExpectedStream(data.stream);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function channelChanged(e) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: channelChanged (select). Playing=' + isPlaying(), e);
                }

                if (isPlaying()) {
                    playbackStopped({ TriggeredBy: 'channelChange' });
                }

                // Is this a dupe for a previous select that we aren't yet playing?
                else if (state.getLastSelectEvent() && state.getSelectedContent() && (!state.getLastStreamUriEvent() || !state.getLastPlaybackStartedEvent()) && 'linear' === state.getLastPlaybackType() && state.getSelectedContent().tmsProgramId === analyticsAssetHelper.getTmsProgramId(e.channel.asset)) {

                        $log.debug('Analytics: Dropping duplicate linear select event', e);
                        return;
                    }

                // Send a playbackExitBeforeStart event if we've selected content previously,
                // but never began playing it. (i.e. no playbackStart event yet)
                var exitBeforeStart = state.getLastSelectEvent() && !state.getLastPlaybackStartedEvent();
                if (exitBeforeStart && 'failed' !== analyticsService.getCurrentLibraryState()) {
                    analyticsService.event('playbackExitBeforeStart', {});
                }

                // Track the most recently selected content, and retain it in case
                // we need to replay it later as the result of a playback-resumed event.
                state.setLastPlaybackType('linear');
                state.setLastSelectEvent(e);
                state.setLastStreamUriEvent(null);
                state.setLastPlaybackStartedEvent(null);

                // Capture details of the currently selected content.
                state.setSelectedContent({
                    type: 'linear',
                    channelId: e.channel.channelId,
                    tmsGuideId: e.channel.tmsId,
                    tmsProgramIds: e.channel.asset.tmsProgramIds,
                    tmsProgramId: analyticsAssetHelper.getTmsProgramId(e.channel.asset)
                });

                // Suppress this event if we're not on a playback page, but keep the
                // source event in case we need to resume the stream.
                if (!playerService.isValidPlayRoute()) {
                    return;
                }

                var data = {
                    contentClass: 'linear',
                    playbackType: 'linear',
                    elementStandardizedName: 'liveTvWatch',
                    pageSectionName: 'conversionArea',
                    // CAUTION: The incoming event has a 'triggeredBy' field, but it's
                    // from the player domain, not analytics, and so is not usable here.
                    triggeredBy: 'user',
                    drmType: 'adobePrimeTime',
                    scrubbingCapability: 'none',
                    closedCaptioningCapable: true,
                    sapCapable: false,
                    entitled: true,
                    operationType: 'playbackPlaySelected'
                };

                analyticsAssetHelper.populateChannelData(data, e.channel);
                analyticsAssetHelper.populateAssetData(data, e.channel.asset);
                analyticsAssetHelper.populateStreamData(data, e.channel.streams[0]);
                analyticsAssetHelper.populateEventData(data, e);

                analyticsService.event('playbackSelect', data);

                // Any playbackSelect event clears the search state.
                $rootScope.$broadcast('Analytics:search-reset');

                // Clear out the expected stream
                state.setExpectedStream(null);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function vodContentSelected(e) {

            if (analyticsService.isDebug()) {
                $log.debug('Analytics: vodContentSelected (select)', e);
            }

            try {
                var asset = e.asset;

                // Track the most recently selected content, and retain it in case
                // we need to replay it later as the result of a playback-resumed event.
                state.setLastPlaybackType('vod');
                state.setLastSelectEvent(e);
                state.setLastStreamUriEvent(null);
                state.setLastPlaybackStartedEvent(null);

                // Capture details of the currently selected content.
                // Suppress this event if we're not on a playback page, but keep the
                // source event in case we need to resume the stream.
                if (!playerService.isValidPlayRoute()) {
                    return;
                }

                // let data = analyticsAssetHelper.populateVodData({}, e.channel.asset, asset.defaultStream, e);
                var data = {
                    playbackType: 'vod',
                    triggeredBy: 'user',
                    elementStandardizedName: e.elementStandardizedName,
                    pageSectionName: 'conversionArea',
                    drmType: 'adobePrimeTime',
                    scrubbingCapability: 'all',
                    sapCapable: false
                };

                analyticsAssetHelper.populateAssetData(data, asset);

                // Attempt to use the requested stream for playback to populate event.
                var expectedStream = state.getExpectedStream();
                if (expectedStream) {
                    analyticsAssetHelper.populateStreamData(data, expectedStream);
                } else {
                    analyticsAssetHelper.populateStreamData(data, asset.defaultStream);
                }
                analyticsAssetHelper.populateTvodData(data, asset);
                analyticsAssetHelper.populateEventData(data, e);

                // Capture all tmsProgramIds, since there could be more than one,
                // and we don't always know which one will be used by the stream.
                state.setSelectedContent({
                    type: 'vod',
                    tmsProgramId: data.tmsProgramId,
                    tmsProgramIds: asset.tmsProgramIds
                });

                // If this is tvod content, add the featureStepName
                if ('rent' === data.purchaseType) {
                    data.featureStepName = 'playbackSelect';
                }

                // Override contentClass for TVOD trailers, if needed.
                var isTrailer = $state.params && $state.params.trailer && $state.params.trailer === 'true' || false;
                if (isTrailer) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Overriding contentClass to trailer', isTrailer);
                    }
                    data.contentClass = 'trailer';
                }

                // Capture TVOD stream details.
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: isTvod? isTvodEntitled=' + asset.isTvodEntitled);
                }

                if (analyticsAssetHelper.isTvodAsset(asset)) {

                    // If we just purchased this, connect this to the rest of the
                    // tvod flow.
                    var purchaseInfo = state.getLatestPurchase();
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: (tvod) comparing purchaseInfo to asset', purchaseInfo, e.asset);
                    }

                    // We only count this as part of the TVOD flow if this is
                    // happening immediately after purchase.
                    if (purchaseInfo && purchaseInfo.tmsProgramId === data.tmsProgramId) {
                        if (analyticsService.isDebug()) {
                            $log.debug('Analytics: (tvod) Applying TVOD properties to playbackSelect event');
                        }

                        var tvodFlow = state.getTvodFlowState();
                        if (tvodFlow) {
                            tvodFlow.featureCurrentStep = tvodFlow.featureNumberOfSteps;
                            angular.extend(data, tvodFlow);
                        }
                        data.purchaseId = purchaseInfo.purchaseId;
                    }

                    // Always clear the purchase info at this point, since we're
                    // either done with this part of the TVOD flow, or else not
                    // in the TVOD flow at all.
                    if (purchaseInfo) {
                        state.setLatestPurchase(null);
                    }
                }

                analyticsService.event('playbackSelect', data);

                // Any playbackSelect event clears the search state.
                $rootScope.$broadcast('Analytics:search-reset');

                // Clear out the expected stream
                state.setExpectedStream(null);

                // Clear any potential tvodFlow state
                state.setTvodFlowState(null);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function cdvrContentSelected(e) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: cdvrContentSelected (select)', e);
                }

                // Track the most recently selected content, and retain it in case
                // we need to replay it later as the result of a playback-resumed event.
                state.setLastPlaybackType('dvr');
                state.setLastSelectEvent(e);
                state.setLastStreamUriEvent(null);
                state.setLastPlaybackStartedEvent(null);

                // Capture details of the currently selected content.
                state.setSelectedContent({
                    type: 'cdvr',
                    tmsProgramId: e.asset.cdvrRecording.tmsProgramId,
                    recordingId: e.asset.cdvrRecording.recordingId
                });

                // Suppress this event if we're not on a playback page, but keep the
                // source event in case we need to resume the stream.
                if (!playerService.isValidPlayRoute()) {
                    return;
                }

                var data = {
                    contentClass: 'cdvr',
                    playbackType: 'dvr',
                    triggeredBy: 'user',
                    elementStandardizedName: 'asset',
                    pageSectionName: 'conversionArea',
                    drmType: 'adobePrimeTime',
                    scrubbingCapability: 'all',
                    sapCapable: false
                };

                analyticsAssetHelper.populateAssetData(data, e.asset);

                // Attempt to use the requested stream for playback to populate event.
                var expectedStream = state.getExpectedStream();
                if (expectedStream) {
                    analyticsAssetHelper.populateStreamData(data, expectedStream);
                } else {
                    analyticsAssetHelper.populateStreamData(data, e.stream);
                }

                analyticsAssetHelper.populateEventData(data, e);

                analyticsService.event('playbackSelect', data);

                // Any playbackSelect event clears the search state.
                $rootScope.$broadcast('Analytics:search-reset');

                // Clear out the expected stream
                state.setExpectedStream(null);
            } catch (error) {
                $log.error(error);
            }
        }

        function streamUriObtained(e) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: streamUriObtained, page=' + state.getCurrentPageName(), state.getSelectedContent(), e);
                }

                var selectedContent = state.getSelectedContent();

                // But, is this the most recently selected content? Or something old?
                // Discard this URI obtained event if it doesn't match the most recent
                // playback selection.
                if (selectedContent.type === 'linear' && selectedContent.channelId !== e.contentMetadata.channelId) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Discarding linear URI event due to mismatch');
                    }

                    // Sometmies the streamUriObtained event lists one of the alternate
                    // tmsProgramIds for the same asset. This logic allows us to catch
                    // the switch and continue playback instead of just discarding this
                    // event as a mismatch.
                    if (selectedContent.tmsProgramIds && selectedContent.tmsProgramIds.indexOf(e.contentMetadata.tmsProgramId) >= 0) {

                        selectedContent.tmsProgramId = e.contentMetadata.tmsProgramId;
                    } else {
                        return;
                    }
                    return;
                } else if (selectedContent.type === 'vod' && selectedContent.tmsProgramId !== e.contentMetadata.tmsProgramId) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Discarding VOD URI event due to tmsProgramId mismatch:' + selectedContent.tmsProgramId + ' vs ' + e.contentMetadata.tmsProgramId);
                    }

                    // Sometmies the streamUriObtained event lists one of the alternate
                    // tmsProgramIds for the same asset. This logic allows us to catch
                    // the switch and continue playback instead of just discarding this
                    // event as a mismatch.
                    if (selectedContent.tmsProgramIds && selectedContent.tmsProgramIds.indexOf(e.contentMetadata.tmsProgramId) >= 0) {

                        selectedContent.tmsProgramId = e.contentMetadata.tmsProgramId;
                    } else {
                        return;
                    }
                } else if (selectedContent.type === 'cdvr' && (selectedContent.tmsProgramId !== e.contentMetadata.cdvrRecording.tmsProgramId || selectedContent.recordingId !== e.contentMetadata.cdvrRecording.recordingId)) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Discarding CDVR URI event due to mismatch');
                    }
                    return;
                }

                // Is this a duplicate for a streamUriObtained event we have already received?
                if (state.getLastStreamUriEvent()) {
                    $log.debug('Analytics: Dropping duplicate streamUriObtained event', e);
                    return;
                }

                // Record the fact that we've received our URI event.
                selectedContent.receivedUri = true;

                // Record the incoming event, in case we need to replay it later
                // due to a playback-resumed event.
                state.setLastStreamUriEvent(e);

                // Suppress this event if we're not on a playback page, but keep the
                // source event in case we need to resume the stream.
                if (!playerService.isValidPlayRoute()) {
                    return;
                }

                var data = {
                    contentUri: e.stream.stream_url || undefined,
                    success: true
                };

                analyticsService.event('playbackStreamUriAcquired', data);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function playbackStarted(e) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: playbackStarted', e);
                }
                var deferred = undefined;

                var selectedContent = state.getSelectedContent();

                // If we're still waiting for the URI from our most recent
                // playbackSelect event, then discard this playback event.
                // This usually happens when the user is rapidly changing
                // channels in live tv.
                if (!selectedContent.receivedUri) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Discarding play event; have not ' + 'yet received URI event', e);
                    }
                    return;
                }

                // If we've already received this event, igore it as a duplicate.
                if (state.getLastPlaybackStartedEvent()) {
                    $log.debug('Analytics: Discarding duplicate playbackStarted event');
                    return;
                }

                state.setBitrate(e.bitrate);
                var data = {
                    triggeredBy: 'application',
                    playPointTimestamp: Date.now(),
                    currentBitRateBps: e.bitrate,
                    numberOfAudioSources: e.audioTracks ? e.audioTracks.length : -1,
                    actualRuntime: state.getActualRuntimeMs()
                };

                if (state.hasDeferredEvent('adBreakStart')) {
                    deferred = 'adBreakStart';
                }

                selectedContent.playbackStartedEvent = e;

                // Record the incoming event, in case we need to replay it later
                // due to a playback-resumed event.
                state.setLastPlaybackStartedEvent(e);

                // Suppress this event if we're not on a playback page, but keep the
                // source event in case we need to resume the stream.
                if (!playerService.isValidPlayRoute()) {
                    return;
                }

                analyticsService.event('playbackStart', data, deferred);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function bufferingStarted() {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: bufferingStarted, resumeBufferingAfterUnpause=' + resumeBufferingAfterUnpause);
                }

                // If we're in a paused state, defer the buffering until
                // after we're unpaused.
                if (analyticsService.getCurrentLibraryState() === 'paused') {
                    resumeBufferingAfterUnpause = true;
                    return;
                }
                analyticsService.event('bufferingStart', {});
            } catch (ex) {
                $log.error(ex);
            }
        }

        function bufferingStopped() {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: bufferingStopped, resumeBufferingAfterUnpause=' + resumeBufferingAfterUnpause);
                }

                // Discard bufferingStop event if we're paused.
                if (resumeBufferingAfterUnpause) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Discarding bufferingStopped due to ongoing pause');
                    }
                    return;
                }
                analyticsService.event('bufferingStop', {});
            } catch (ex) {
                $log.error(ex);
            }
        }

        function scrubJump(e) {
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: scrubJump, contentElapsed=' + state.contentElapsedMs, e);
            }
            try {

                var startTimestamp = state.contentElapsedMs;

                var startPositionSec = Math.floor(parseInt(startTimestamp) / 1000);
                var endPositionSec = Math.floor(parseInt(e.PlaybackTimestamp) / 1000);

                if (startPositionSec === endPositionSec) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Ignoring scrub event to original position,' + ' after rounding to nearest second');
                    }
                    return;
                }

                var scrubType = null;
                if (e.sourceElement === 'skipButton') {
                    scrubType = endPositionSec > startPositionSec ? 'jumpForward' : 'jumpBack';
                } else {
                    scrubType = endPositionSec > startPositionSec ? 'fastForward' : 'rewind';
                }

                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: scrubJump, from=' + startPositionSec + ' to=' + endPositionSec + ' type=' + scrubType, e);
                }

                // If we're buffering right now, we'll have to halt the
                // buffering during trickplay, and resume right after.
                var resumeBufferingAfterTrickPlay = false;
                if ('buffering' === analyticsService.getCurrentLibraryState()) {
                    bufferingStopped();
                    resumeBufferingAfterTrickPlay = true;
                }

                analyticsService.event('playbackTrickPlayStart', {
                    scrubSpeed: '1',
                    scrubType: scrubType,
                    startPositionSec: Math.floor(parseInt(startTimestamp) / 1000)
                });

                analyticsService.event('playbackTrickPlayStop', {
                    endPositionSec: Math.floor(parseInt(e.PlaybackTimestamp) / 1000)
                });

                // If needed, resume the buffering from before the trickplay.
                if (resumeBufferingAfterTrickPlay) {
                    bufferingStarted();
                }
            } catch (ex) {
                $log.error(ex);
            }
        }

        function bitrateChanged(e) {
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: bitrateChanged', e);
            }
            var event = undefined,
                bitrate = undefined;
            try {
                if (!isPlaying() && 'undefined' === typeof deferredPlaybackStartEvent) {
                    return;
                }

                if (e.NewBitRate) {
                    bitrate = e.NewBitRate;
                } else if (e.event && e.event.profile) {
                    bitrate = e.event.profile;
                }

                if (!bitrate || bitrate === state.getBitrate()) {
                    return;
                }

                state.setBitrate(bitrate);

                if (state.getBitrate() > state.previousBitrate) {
                    event = 'playbackBitRateUpshift';
                } else {
                    event = 'playbackBitRateDownshift';
                }

                var data = {
                    currentBitRateBps: state.getBitrate()
                };
                analyticsService.event(event, data);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function playbackStopped() {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            if (analyticsService.isDebug()) {
                $log.debug('Analytics: playbackStopped, isPlaying=' + isPlaying() + ', state=' + analyticsService.getCurrentLibraryState(), e);
            }
            try {

                // Send a playbackExitBeforeStart event if we've selected content previously,
                // but never began playing it. (i.e. no playbackStart event yet)
                if ('initiating' === analyticsService.getCurrentLibraryState()) {
                    state.stopPlayback();
                    state.setLastPlaybackType(null);
                    state.setLastSelectEvent(null);
                    state.setLastStreamUriEvent(null);
                    state.setLastPlaybackStartedEvent(null);
                    analyticsService.event('playbackExitBeforeStart', {});
                    return;
                }

                if (!isPlaying()) {
                    return;
                }

                var data = {};
                if (e.TriggeredBy === 'exitPlayer') {
                    data.triggeredBy = 'user';
                } else {
                    data.triggeredBy = 'application';
                }

                state.stopPlayback();

                analyticsService.event('playbackStop', data);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function playbackFailure(e) {
            var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: playbackFailure, state=' + analyticsService.getCurrentLibraryState(), e, data);
                }

                // Capture client error code string, if one is defined.
                if (angular.isDefined(data.cause)) {
                    if ('string' === typeof data.cause) {
                        data.clientErrorCode = data.cause;
                    } else if (angular.isDefined(data.cause.errorID)) {
                        data.clientErrorCode = data.cause.errorID.toString();
                    } else if (angular.isDefined(data.cause.mediaPlayerErrorCode)) {
                        data.clientErrorCode = data.cause.mediaPlayerErrorCode.toString();
                    }
                }

                // Assumption: data.errorCode is already normalized.
                data.errorMessage = data.errorMessage;
                data.errorType = 'playback';

                // Is this for the asset we currently believe to be playing?
                if (data.asset && state.getSelectedContent().tmsProgramId !== analyticsAssetHelper.getTmsProgramId(data.asset)) {

                    // No. programId exists, but is not a match!
                    $log.warn('Analytics: 1047: Discarding this failure event, since it is for a different asset');
                    return;
                }
                delete data.asset;

                // If we're paused, we need to end the pause in order for the
                // SDK to transition to the failure state.
                if ('paused' === analyticsService.getCurrentLibraryState()) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Unpausing to allow playbackFailure event');
                    }
                    pauseToggled(false);
                }

                state.stopPlayback();

                analyticsService.event('playbackFailure', data);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function adBreakStarted(adBreak) {
            try {
                var data = {
                    adBreakNumber: adBreak.index
                };

                if (!isPlaying()) {
                    state.setDeferredEvent('adBreakStart', data);
                    return;
                }

                analyticsService.event('adBreakStart', data);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function adBreakStopped(adBreak) {
            try {
                if (state.adPlaying) {
                    state.setDeferredEvent('adBreakStop', adBreak);
                    return;
                }

                // If we're buffering at the moment, interrupt it to allow this
                // event to go through.
                var resumeBufferingAfterEvent = false;
                if ('buffering' === analyticsService.getCurrentLibraryState()) {
                    bufferingStopped();
                    resumeBufferingAfterEvent = true;
                }

                if (state.previousEventName === 'adBreakStop') {
                    return;
                }

                analyticsService.event('adBreakStop', adBreak);

                // Resume buffering after allowing this event to go through.
                if (resumeBufferingAfterEvent) {
                    bufferingStarted();
                }
            } catch (ex) {
                $log.error(ex);
            }
        }

        function adStarted(ad) {
            try {
                var data = {
                    adId: ad.adId,
                    adNumber: ad.index,
                    adTitle: ad.caid,
                    deviceAdId: state.getDeviceId()
                };

                state.startAd(ad);

                analyticsService.event('adStart', data);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function adStopped(ad) {
            try {
                var deferred = undefined;
                var data = {
                    adDurationSec: parseInt(ad.duration / 1000),
                    adStoppedReason: 'completion'
                };

                if (state.hasDeferredEvent('adBreakStop')) {
                    deferred = 'adBreakStop';
                }

                state.stopAd();

                analyticsService.event('adStop', data, deferred);
            } catch (ex) {
                $log.error(ex);
            }
        }

        function adTracking(request) {
            try {
                if (request.type === 'adStartTracking') {
                    adStarted(request.adInstance);
                } else if (request.type === 'adEndTracking') {
                    adStopped(request.adInstance);
                }
            } catch (ex) {
                $log.error(ex);
            }
        }

        /**
         * Return true if the SDK is in a state consistent with stream playback.
         *
         * @return True if the SDK is in a state consistent with stream playback.
         */
        function isPlaying() {
            var currentState = analyticsService.getCurrentLibraryState();
            return ['playing', 'buffering', 'scrubbing', 'paused'].indexOf(currentState) > -1;
        }

        function attachEventListeners(player) {
            player.on('player-position-changed', playerPositionChanged);
            player.on('channel-changed', channelChanged);
            player.on('vod-content-selected', vodContentSelected);
            player.on('cdvr-content-selected', cdvrContentSelected);
            player.on('buffering-began', bufferingStarted);
            player.on('stream-uri-obtained', streamUriObtained);
            player.on('stream-scrubbed', scrubJump);
            player.on('ad-break-started', adBreakStarted);
            player.on('ad-break-stopped', adBreakStopped);
            player.on('buffering-ended', bufferingStopped);
            player.on('bitrate-changed', bitrateChanged);
            player.on('playback-started', playbackStarted);
            player.on('playback-pause-toggled', pauseToggled);
            player.on('playback-stopped', playbackStopped);
            player.on('ad-twc-tracking-request', adTracking);
            player.on('player-end-position-changed', endPositionChanged);

            // On player errors.
            $rootScope.$on('Analytics:playbackFailure', playbackFailure);

            $rootScope.$on('Analytics:playback-stopped', function (e, data) {
                playbackStopped(data);
            });
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/playback.js.map
