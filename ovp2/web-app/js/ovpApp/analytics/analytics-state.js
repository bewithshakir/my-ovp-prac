(function () {
    'use strict';

    angular.module('ovpApp.analytics.state', [])
    .factory('AnalyticsState', AnalyticsState);

    /* @ngInject */
    function AnalyticsState(/*$log*/) {

        const State = class {
            constructor() {
                this.playerState = '';
                this.previousEventName = null;
                this.contentElapsedMs = 0;
                this.playbackBufferingStart = 0;
                this.previousBitrate = 0;
                this.previousContentElapsedMs = 0;
                this.adBreakNumber = 0;
                this.adBreakDurationMs = 0;
                this.adPlaying = false;
                this.adData = {};
                this.adTimer = null;
                this.adElapsedMs = 0;
                this.bufferingEventsOmitted = false;
                this.bufferingEventsOmittedBy = null;
                this.playbackBufferingTimer = null;
                this.playbackBufferingElapsedMs = 0;
                this.searchTimer = null;
                this.searchResultMs = 0;
                this.searchData = {};
                this.serviceCallStart = 0;
                this.currentBitrate = 0;
                this.currentLocation = null;
                this.previousLocation = null;
                this.purchaseId = null;
                this.purchaseDetails = null;
                this.deferredQueue = [];
                this.isLoggedIn = false;

                // Array for tracking which controllers are active or not, to
                // assist with generating correct pageView events.
                this.activeControllerStates = [];

                // The last incoming select event that came in.
                this.lastSelectEvent = null;

                // The last incoming streamUriObtained event that came in.
                this.lastStreamUriEvent = null;

                // The last incoming playbackStarted event that came in.
                this.lastPlaybackStartedEvent = null;

                // The last type of playback associated to the 'lastSelectEvent' attribute.
                this.lastPlaybackType = null;

                // Aggregate info about the most recently selected content being played.
                this.selectedContent = null;

                // Last known actual run time of currently playing asset.
                this.actualRuntimeMs = 0;

                // Track the reason why a PIN is being entered.
                this.pinEntryContext = null;

                // Track when the application is being loaded in the background.
                // We should ignore navigation events when this is true, since
                // they don't really translate to user navigation.
                this.navigationPaused = false;


                /* Begin: Attributes used for search */

                // Records the time the search request was issued in order to calculate
                // the duration of the search call.
                this.searchStartedTimestamp = null;

                // Holds the last searchStarted event, in case we need to replay it.
                this.lastSearchStartedEvent = null;

                // Holds the last searched event, in case we need to replay it.
                this.lastSearchedEvent = null;

                /* End: Attributes used for search */

                /* Begin: Attributes used for navigation */

                this.currentPageName = null;

                this.currentAppSection = null;

                /* End: Attributes used for navigation */

                /* Begin: Attributes used for TVOD */
                this.latestPurchase = null;

                this.tvodFlowState = null;

                /* End: Attributes used for TVOD */

                // Login-related fields
                this.currentAuthType = null;
                this.authAttemptId = null;

                /* Stream2: Which step was user previously on? */
                this.stream2BuyFlowPreviousStep = null;

                /* The media player. */
                this.player = null;

                /* True if flash is unavailab.e. */
                this.flashUnavailable = false;

                /* The stream requested for playback. */
                this.expectedStream = null;

                this.currentGuideFilter = null;

                this.currentMiniGuideFilter = null;

                this.deviceId = null;
            }

            getSearchStartedTimestamp() {
                return this.searchStartedTimestamp;
            }

            setSearchStartedTimestamp(searchStartedTimestamp) {
                this.searchStartedTimestamp = searchStartedTimestamp;
            }

            getLastSearchStartedEvent() {
                return this.lastSearchStartedEvent;
            }

            setLastSearchStartedEvent(lastSearchStartedEvent) {
                this.lastSearchStartedEvent = angular.copy(lastSearchStartedEvent);
            }

            getLastSearchedEvent() {
                return this.lastSearchedEvent;
            }

            setLastSearchedEvent(lastSearchedEvent) {
                this.lastSearchedEvent = angular.copy(lastSearchedEvent);
            }

            isNavigationPaused() {
                return this.navigationPaused;
            }

            pauseNavigation() {
                this.navigationPaused = true;
            }

            unpauseNavigation() {
                this.navigationPaused = false;
            }

            getActualRuntimeMs() {
                return this.actualRuntimeMs;
            }

            setActualRuntimeMs(actualRuntimeMs) {
                this.actualRuntimeMs = actualRuntimeMs;
            }

            getLastSelectEvent() {
                return this.lastSelectEvent;
            }

            getLastPlaybackType() {
                return this.lastPlaybackType;
            }

            resetContent() {
                this.lastSelectEvent = null;
                this.setLastStreamUriEvent(null);
                this.setLastPlaybackStartedEvent(null);
                this.actualRuntimeMs = 0;
                this.setSelectedContent(null);
            }

            setLastSelectEvent(selectEvent) {
                this.lastSelectEvent = selectEvent;
            }

            setLastPlaybackType(playbackType) {
                this.lastPlaybackType = playbackType;
            }

            setSelectedContent(selectedContent) {
                this.selectedContent = selectedContent;
            }

            getSelectedContent() {
                return this.selectedContent;
            }

            getLastStreamUriEvent() {
                return this.lastStreamUriEvent;
            }

            setLastStreamUriEvent(streamUriEvent) {
                this.lastStreamUriEvent = streamUriEvent;
            }

            getLastPlaybackStartedEvent() {
                return this.lastPlaybackStartedEvent;
            }

            setLastPlaybackStartedEvent(playbackStartedEvent) {
                this.lastPlaybackStartedEvent = playbackStartedEvent;
            }

            getElapsedMs() {
                return this.contentElapsedMs;
            }

            setElapsedMs(position) {
                // Try-catch needed here to prevent propagation to non-analytics
                // code.
                try {
                    this.previousContentElapsedMs = this.contentElapsedMs;
                    this.contentElapsedMs = Math.round(position);
                } catch (ex) {
                }
            }

            setBitrate(currentBitrate) {
                this.previousBitrate = this.currentBitrate || 0;
                this.currentBitrate = Number(currentBitrate);
            }

            getBitrate() {
                return this.currentBitrate;
            }

            startAdBreak() {
                this.adBreakStarted = Date.now();
            }

            startAd(data) {
                this.adPlaying = true;
                this.adTimer = Date.now();
                this.adData = data;
            }

            stopAd() {
                try {
                    this.adPlaying = false;
                    this.adElapsedMs = Date.now() - this.adTimer;
                } catch (ex) {
                }
            }

            startBufferingTimer() {
                this.playbackBufferingTimer = Date.now();
            }

            stopBufferingTimer() {
                this.playbackBufferingElapsedMs = Date.now() - this.playbackBufferingTimer;
            }

            startSearchTimer() {
                this.searchTimer = Date.now();
            }

            stopSearchTimer(data) {
                try {
                    this.searchData = data;
                    this.searchResultMs = Date.now() - this.searchTimer;
                    this.indexResults(data.searchResult);
                } catch (ex) {
                }
            }

            indexResults(data) {
                try {
                    let title;
                    let resultIndex = 0;
                    this.searchData.searchResults = {};
                    data.forEach(category => {
                        title = category.title.toLowerCase();
                        this.searchData.searchResults[title] = [];
                        resultIndex = 0;
                        category.results.forEach(item => {
                            item.index = resultIndex;
                            this.searchData.searchResults[title].push(item);
                            resultIndex++;
                        });
                    });
                } catch (ex) {
                }
            }

            getSearchIndex(data) {
                try {
                    let facet, result;

                    if (data && typeof data.facet === 'string') {
                        facet = data.facet.toLowerCase();
                    }

                    if (['other', 'series', 'product', 'movie'].indexOf(facet) > -1) {
                        result = this.searchData.searchResults.title.filter(item =>
                            item.tmsProgramId === data.tmsProgramId
                        );
                    } else if (facet === 'person') {
                        result = this.searchData.searchResults.person.filter(item => {
                            return item.searchStringMatch === data.searchStringMatch;
                        });
                    } else if (facet === 'sports') {
                        result = this.searchData.searchResults.sports.filter(item =>
                            item.tmsProgramId === data.tmsProgramId
                        );
                    } else if (facet === 'team') {
                        result = this.searchData.searchResults.team.filter(item =>
                            item.title === data.searchStringMatch
                        );
                    }

                    return result.length > 0 ? result[0].index : result;
                } catch (ex) {
                    return null;
                }
            }

            omitBufferingEvents(bool, name) {
                this.bufferingEventsOmitted = bool;
                if (bool) {
                    this.bufferingEventsOmittedBy = name;
                }
            }

            setServiceCallStartTime() {
                this.serviceCallStart = Date.now();
            }

            getContentElapsedMs() {
                return this.contentElapsedMs;
            }

            setPlayerState(newState) {
                this.playerState = newState;
            }

            setLocation(location) {
                this.previousLocation = this.currentLocation;
                this.currentLocation = location;
            }

            setPurchaseId(newId) {
                this.purchaseId = newId;
            }

            setPurchaseDetails(data) {
                this.purchaseDetails = data;
            }

            stopPlayback() {
                this.playbackStartDeferred = false;
            }

            setPreviousEventName(name) {
                this.previousEventName = name;
            }

            setDeferredEvent(name, data) {
                this.deferredQueue.push({
                    name: name,
                    data: data,
                    timestamp: Date.now()
                });

            }

            hasDeferredEvent(name) {
                try {
                    var events = this.deferredQueue.filter((v) => {
                        return v.name === name;
                    });

                    return events.length > 0 ? true : false;
                } catch (ex) {
                    return false;
                }
            }

            getDeferredEvent(name) {
                try {
                    if (this.deferredQueue.length === 0) {
                        return undefined;
                    }

                    var eventIndex = this.deferredQueue.findIndex((val) => val.name === name);

                    if (eventIndex < 0) {
                        return undefined;
                    }

                    var deferredEvent = this.deferredQueue[eventIndex];

                    this.deferredQueue = this.deferredQueue.slice(eventIndex + 1, 1);

                    return deferredEvent;
                } catch (ex) {
                    return null;
                }
            }

            setIsLoggedIn(isLoggedIn) {
                this.isLoggedIn = isLoggedIn;
            }

            getIsLoggedIn() {
                return this.isLoggedIn;
            }

            setPINEntryContext(pinEntryContext) {
                this.pinEntryContext = pinEntryContext;
            }

            getPINEntryContext() {
                return this.pinEntryContext;
            }

            getCurrentPageName() {
                return this.currentPageName;
            }

            setCurrentPageName(pageName) {
                this.currentPageName = pageName;
            }

            getCurrentAppSection() {
                return this.currentAppSection;
            }

            setCurrentAppSection(appSection) {
                this.currentAppSection = appSection;
            }

            getLatestPurchase() {
                return this.latestPurchase;
            }

            setLatestPurchase(purchase) {
                this.latestPurchase = purchase;
            }

            getTvodFlowState() {
                return this.tvodFlowState;
            }

            setTvodFlowState(tvodFlowState) {
                this.tvodFlowState = tvodFlowState;
            }

            getAuthAttemptId() {
                return this.authAttemptId;
            }

            setAuthAttemptId(authAttemptId) {
                this.authAttemptId = authAttemptId;
            }

            getCurrentAuthType() {
                return this.currentAuthType;
            }

            setCurrentAuthType(currentAuthType) {
                this.currentAuthType = currentAuthType;
            }

            getStream2BuyFlowPreviousStep() {
                if (!this.stream2BuyFlowPreviousStep) {
                    this.stream2BuyFlowPreviousStep = 0;
                }
                return this.stream2BuyFlowPreviousStep;
            }

            setStream2BuyFlowPreviousStep(stream2BuyFlowPreviousStep) {
                this.stream2BuyFlowPreviousStep = stream2BuyFlowPreviousStep;
            }

            getPlayer() {
                return this.player;
            }

            setPlayer(player) {
                this.player = player;
            }

            getFlashUnavailable() {
                return this.flashUnavailable;
            }

            setFlashUnavailable(flashUnavailable) {
                this.flashUnavailable = flashUnavailable;
            }

            getExpectedStream() {
                return this.expectedStream;
            }

            setExpectedStream(expectedStream) {
                this.expectedStream = expectedStream;
            }

            getCurrentGuideFilter() {
                return this.currentGuideFilter;
            }

            setCurrentGuideFilter(currentGuideFilter) {
                this.currentGuideFilter = currentGuideFilter;
            }

            getCurrentMiniGuideFilter() {
                return this.currentMiniGuideFilter;
            }

            setCurrentMiniGuideFilter(currentMiniGuideFilter) {
                this.currentMiniGuideFilter = currentMiniGuideFilter;
            }

            getDeviceId() {
                return this.deviceId;
            }

            setDeviceId(deviceId) {
                this.deviceId = deviceId;
            }
        };

        return State;
    }
}());
