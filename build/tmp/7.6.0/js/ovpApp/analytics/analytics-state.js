'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.analytics.state', []).factory('AnalyticsState', AnalyticsState);

    /* @ngInject */
    function AnalyticsState() /*$log*/{

        var State = (function () {
            function State() {
                _classCallCheck(this, State);

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

            _createClass(State, [{
                key: 'getSearchStartedTimestamp',
                value: function getSearchStartedTimestamp() {
                    return this.searchStartedTimestamp;
                }
            }, {
                key: 'setSearchStartedTimestamp',
                value: function setSearchStartedTimestamp(searchStartedTimestamp) {
                    this.searchStartedTimestamp = searchStartedTimestamp;
                }
            }, {
                key: 'getLastSearchStartedEvent',
                value: function getLastSearchStartedEvent() {
                    return this.lastSearchStartedEvent;
                }
            }, {
                key: 'setLastSearchStartedEvent',
                value: function setLastSearchStartedEvent(lastSearchStartedEvent) {
                    this.lastSearchStartedEvent = angular.copy(lastSearchStartedEvent);
                }
            }, {
                key: 'getLastSearchedEvent',
                value: function getLastSearchedEvent() {
                    return this.lastSearchedEvent;
                }
            }, {
                key: 'setLastSearchedEvent',
                value: function setLastSearchedEvent(lastSearchedEvent) {
                    this.lastSearchedEvent = angular.copy(lastSearchedEvent);
                }
            }, {
                key: 'isNavigationPaused',
                value: function isNavigationPaused() {
                    return this.navigationPaused;
                }
            }, {
                key: 'pauseNavigation',
                value: function pauseNavigation() {
                    this.navigationPaused = true;
                }
            }, {
                key: 'unpauseNavigation',
                value: function unpauseNavigation() {
                    this.navigationPaused = false;
                }
            }, {
                key: 'getActualRuntimeMs',
                value: function getActualRuntimeMs() {
                    return this.actualRuntimeMs;
                }
            }, {
                key: 'setActualRuntimeMs',
                value: function setActualRuntimeMs(actualRuntimeMs) {
                    this.actualRuntimeMs = actualRuntimeMs;
                }
            }, {
                key: 'getLastSelectEvent',
                value: function getLastSelectEvent() {
                    return this.lastSelectEvent;
                }
            }, {
                key: 'getLastPlaybackType',
                value: function getLastPlaybackType() {
                    return this.lastPlaybackType;
                }
            }, {
                key: 'resetContent',
                value: function resetContent() {
                    this.lastSelectEvent = null;
                    this.setLastStreamUriEvent(null);
                    this.setLastPlaybackStartedEvent(null);
                    this.actualRuntimeMs = 0;
                    this.setSelectedContent(null);
                }
            }, {
                key: 'setLastSelectEvent',
                value: function setLastSelectEvent(selectEvent) {
                    this.lastSelectEvent = selectEvent;
                }
            }, {
                key: 'setLastPlaybackType',
                value: function setLastPlaybackType(playbackType) {
                    this.lastPlaybackType = playbackType;
                }
            }, {
                key: 'setSelectedContent',
                value: function setSelectedContent(selectedContent) {
                    this.selectedContent = selectedContent;
                }
            }, {
                key: 'getSelectedContent',
                value: function getSelectedContent() {
                    return this.selectedContent;
                }
            }, {
                key: 'getLastStreamUriEvent',
                value: function getLastStreamUriEvent() {
                    return this.lastStreamUriEvent;
                }
            }, {
                key: 'setLastStreamUriEvent',
                value: function setLastStreamUriEvent(streamUriEvent) {
                    this.lastStreamUriEvent = streamUriEvent;
                }
            }, {
                key: 'getLastPlaybackStartedEvent',
                value: function getLastPlaybackStartedEvent() {
                    return this.lastPlaybackStartedEvent;
                }
            }, {
                key: 'setLastPlaybackStartedEvent',
                value: function setLastPlaybackStartedEvent(playbackStartedEvent) {
                    this.lastPlaybackStartedEvent = playbackStartedEvent;
                }
            }, {
                key: 'getElapsedMs',
                value: function getElapsedMs() {
                    return this.contentElapsedMs;
                }
            }, {
                key: 'setElapsedMs',
                value: function setElapsedMs(position) {
                    // Try-catch needed here to prevent propagation to non-analytics
                    // code.
                    try {
                        this.previousContentElapsedMs = this.contentElapsedMs;
                        this.contentElapsedMs = Math.round(position);
                    } catch (ex) {}
                }
            }, {
                key: 'setBitrate',
                value: function setBitrate(currentBitrate) {
                    this.previousBitrate = this.currentBitrate || 0;
                    this.currentBitrate = Number(currentBitrate);
                }
            }, {
                key: 'getBitrate',
                value: function getBitrate() {
                    return this.currentBitrate;
                }
            }, {
                key: 'startAdBreak',
                value: function startAdBreak() {
                    this.adBreakStarted = Date.now();
                }
            }, {
                key: 'startAd',
                value: function startAd(data) {
                    this.adPlaying = true;
                    this.adTimer = Date.now();
                    this.adData = data;
                }
            }, {
                key: 'stopAd',
                value: function stopAd() {
                    try {
                        this.adPlaying = false;
                        this.adElapsedMs = Date.now() - this.adTimer;
                    } catch (ex) {}
                }
            }, {
                key: 'startBufferingTimer',
                value: function startBufferingTimer() {
                    this.playbackBufferingTimer = Date.now();
                }
            }, {
                key: 'stopBufferingTimer',
                value: function stopBufferingTimer() {
                    this.playbackBufferingElapsedMs = Date.now() - this.playbackBufferingTimer;
                }
            }, {
                key: 'startSearchTimer',
                value: function startSearchTimer() {
                    this.searchTimer = Date.now();
                }
            }, {
                key: 'stopSearchTimer',
                value: function stopSearchTimer(data) {
                    try {
                        this.searchData = data;
                        this.searchResultMs = Date.now() - this.searchTimer;
                        this.indexResults(data.searchResult);
                    } catch (ex) {}
                }
            }, {
                key: 'indexResults',
                value: function indexResults(data) {
                    var _this = this;

                    try {
                        (function () {
                            var title = undefined;
                            var resultIndex = 0;
                            _this.searchData.searchResults = {};
                            data.forEach(function (category) {
                                title = category.title.toLowerCase();
                                _this.searchData.searchResults[title] = [];
                                resultIndex = 0;
                                category.results.forEach(function (item) {
                                    item.index = resultIndex;
                                    _this.searchData.searchResults[title].push(item);
                                    resultIndex++;
                                });
                            });
                        })();
                    } catch (ex) {}
                }
            }, {
                key: 'getSearchIndex',
                value: function getSearchIndex(data) {
                    try {
                        var facet = undefined,
                            result = undefined;

                        if (data && typeof data.facet === 'string') {
                            facet = data.facet.toLowerCase();
                        }

                        if (['other', 'series', 'product', 'movie'].indexOf(facet) > -1) {
                            result = this.searchData.searchResults.title.filter(function (item) {
                                return item.tmsProgramId === data.tmsProgramId;
                            });
                        } else if (facet === 'person') {
                            result = this.searchData.searchResults.person.filter(function (item) {
                                return item.searchStringMatch === data.searchStringMatch;
                            });
                        } else if (facet === 'sports') {
                            result = this.searchData.searchResults.sports.filter(function (item) {
                                return item.tmsProgramId === data.tmsProgramId;
                            });
                        } else if (facet === 'team') {
                            result = this.searchData.searchResults.team.filter(function (item) {
                                return item.title === data.searchStringMatch;
                            });
                        }

                        return result.length > 0 ? result[0].index : result;
                    } catch (ex) {
                        return null;
                    }
                }
            }, {
                key: 'omitBufferingEvents',
                value: function omitBufferingEvents(bool, name) {
                    this.bufferingEventsOmitted = bool;
                    if (bool) {
                        this.bufferingEventsOmittedBy = name;
                    }
                }
            }, {
                key: 'setServiceCallStartTime',
                value: function setServiceCallStartTime() {
                    this.serviceCallStart = Date.now();
                }
            }, {
                key: 'getContentElapsedMs',
                value: function getContentElapsedMs() {
                    return this.contentElapsedMs;
                }
            }, {
                key: 'setPlayerState',
                value: function setPlayerState(newState) {
                    this.playerState = newState;
                }
            }, {
                key: 'setLocation',
                value: function setLocation(location) {
                    this.previousLocation = this.currentLocation;
                    this.currentLocation = location;
                }
            }, {
                key: 'setPurchaseId',
                value: function setPurchaseId(newId) {
                    this.purchaseId = newId;
                }
            }, {
                key: 'setPurchaseDetails',
                value: function setPurchaseDetails(data) {
                    this.purchaseDetails = data;
                }
            }, {
                key: 'stopPlayback',
                value: function stopPlayback() {
                    this.playbackStartDeferred = false;
                }
            }, {
                key: 'setPreviousEventName',
                value: function setPreviousEventName(name) {
                    this.previousEventName = name;
                }
            }, {
                key: 'setDeferredEvent',
                value: function setDeferredEvent(name, data) {
                    this.deferredQueue.push({
                        name: name,
                        data: data,
                        timestamp: Date.now()
                    });
                }
            }, {
                key: 'hasDeferredEvent',
                value: function hasDeferredEvent(name) {
                    try {
                        var events = this.deferredQueue.filter(function (v) {
                            return v.name === name;
                        });

                        return events.length > 0 ? true : false;
                    } catch (ex) {
                        return false;
                    }
                }
            }, {
                key: 'getDeferredEvent',
                value: function getDeferredEvent(name) {
                    try {
                        if (this.deferredQueue.length === 0) {
                            return undefined;
                        }

                        var eventIndex = this.deferredQueue.findIndex(function (val) {
                            return val.name === name;
                        });

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
            }, {
                key: 'setIsLoggedIn',
                value: function setIsLoggedIn(isLoggedIn) {
                    this.isLoggedIn = isLoggedIn;
                }
            }, {
                key: 'getIsLoggedIn',
                value: function getIsLoggedIn() {
                    return this.isLoggedIn;
                }
            }, {
                key: 'setPINEntryContext',
                value: function setPINEntryContext(pinEntryContext) {
                    this.pinEntryContext = pinEntryContext;
                }
            }, {
                key: 'getPINEntryContext',
                value: function getPINEntryContext() {
                    return this.pinEntryContext;
                }
            }, {
                key: 'getCurrentPageName',
                value: function getCurrentPageName() {
                    return this.currentPageName;
                }
            }, {
                key: 'setCurrentPageName',
                value: function setCurrentPageName(pageName) {
                    this.currentPageName = pageName;
                }
            }, {
                key: 'getCurrentAppSection',
                value: function getCurrentAppSection() {
                    return this.currentAppSection;
                }
            }, {
                key: 'setCurrentAppSection',
                value: function setCurrentAppSection(appSection) {
                    this.currentAppSection = appSection;
                }
            }, {
                key: 'getLatestPurchase',
                value: function getLatestPurchase() {
                    return this.latestPurchase;
                }
            }, {
                key: 'setLatestPurchase',
                value: function setLatestPurchase(purchase) {
                    this.latestPurchase = purchase;
                }
            }, {
                key: 'getTvodFlowState',
                value: function getTvodFlowState() {
                    return this.tvodFlowState;
                }
            }, {
                key: 'setTvodFlowState',
                value: function setTvodFlowState(tvodFlowState) {
                    this.tvodFlowState = tvodFlowState;
                }
            }, {
                key: 'getAuthAttemptId',
                value: function getAuthAttemptId() {
                    return this.authAttemptId;
                }
            }, {
                key: 'setAuthAttemptId',
                value: function setAuthAttemptId(authAttemptId) {
                    this.authAttemptId = authAttemptId;
                }
            }, {
                key: 'getCurrentAuthType',
                value: function getCurrentAuthType() {
                    return this.currentAuthType;
                }
            }, {
                key: 'setCurrentAuthType',
                value: function setCurrentAuthType(currentAuthType) {
                    this.currentAuthType = currentAuthType;
                }
            }, {
                key: 'getStream2BuyFlowPreviousStep',
                value: function getStream2BuyFlowPreviousStep() {
                    if (!this.stream2BuyFlowPreviousStep) {
                        this.stream2BuyFlowPreviousStep = 0;
                    }
                    return this.stream2BuyFlowPreviousStep;
                }
            }, {
                key: 'setStream2BuyFlowPreviousStep',
                value: function setStream2BuyFlowPreviousStep(stream2BuyFlowPreviousStep) {
                    this.stream2BuyFlowPreviousStep = stream2BuyFlowPreviousStep;
                }
            }, {
                key: 'getPlayer',
                value: function getPlayer() {
                    return this.player;
                }
            }, {
                key: 'setPlayer',
                value: function setPlayer(player) {
                    this.player = player;
                }
            }, {
                key: 'getFlashUnavailable',
                value: function getFlashUnavailable() {
                    return this.flashUnavailable;
                }
            }, {
                key: 'setFlashUnavailable',
                value: function setFlashUnavailable(flashUnavailable) {
                    this.flashUnavailable = flashUnavailable;
                }
            }, {
                key: 'getExpectedStream',
                value: function getExpectedStream() {
                    return this.expectedStream;
                }
            }, {
                key: 'setExpectedStream',
                value: function setExpectedStream(expectedStream) {
                    this.expectedStream = expectedStream;
                }
            }, {
                key: 'getCurrentGuideFilter',
                value: function getCurrentGuideFilter() {
                    return this.currentGuideFilter;
                }
            }, {
                key: 'setCurrentGuideFilter',
                value: function setCurrentGuideFilter(currentGuideFilter) {
                    this.currentGuideFilter = currentGuideFilter;
                }
            }, {
                key: 'getCurrentMiniGuideFilter',
                value: function getCurrentMiniGuideFilter() {
                    return this.currentMiniGuideFilter;
                }
            }, {
                key: 'setCurrentMiniGuideFilter',
                value: function setCurrentMiniGuideFilter(currentMiniGuideFilter) {
                    this.currentMiniGuideFilter = currentMiniGuideFilter;
                }
            }, {
                key: 'getDeviceId',
                value: function getDeviceId() {
                    return this.deviceId;
                }
            }, {
                key: 'setDeviceId',
                value: function setDeviceId(deviceId) {
                    this.deviceId = deviceId;
                }
            }]);

            return State;
        })();

        return State;
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/analytics/analytics-state.js.map
