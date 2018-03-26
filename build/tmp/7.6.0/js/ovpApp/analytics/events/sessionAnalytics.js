'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    sessionEvents.$inject = ["$rootScope", "analyticsService", "profileService", "lineupService", "stbService", "$q", "$log", "config", "analyticsAssetHelper", "$window"];
    angular.module('ovpApp.analytics.events.sessionAnalytics', ['ovpApp.analytics.analyticsService', 'ovpApp.analytics.analyticsAssetHelper', 'ovpApp.config']).factory('sessionAnalytics', sessionEvents).run(["sessionAnalytics", function loadHandler(sessionAnalytics) {
        return sessionAnalytics;
    }]);

    /* @ngInject */
    function sessionEvents($rootScope, analyticsService, profileService, lineupService, stbService, $q, $log, config, analyticsAssetHelper, $window) {

        // Track our network location data.
        var locationData = null;

        // Track our account features.
        var accountFeatures = null;

        // Track our video zone.
        var videoZone = null;

        // Track whether or not we have called userConfigSet.
        var userConfigSetCalled = false;

        /**
         * React to a change in location.
         *
         * @param e event
         * @param data Event data for the location.
         */
        function locationChanged(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: locationChanged', data);
                }

                // If location data is new, or has changed, update
                // the SDK.
                if (locationData === null || locationData.behindOwnModem !== data.behindOwnModem) {

                    // Capture the new value
                    locationData = data;

                    // If this is a change to the user config, flush existing
                    // events so this update will apply only to new events.
                    if (userConfigSetCalled) {
                        analyticsService.flush();
                    }

                    // Update the SDK
                    analyticsService.getSDK().setNetworkStatus({
                        networkStatus: data.behindOwnModem ? 'onNet' : 'offNet'
                    });

                    // Optionally invoke userConfig method if all user config
                    // data has been collected.
                    updateUserConfigIfNeeded();
                }
            } catch (ex) {
                $log.error('Analytics: locationChanged error', ex);
            }
        }

        /**
         * React to the retrieval of capabilities.
         *
         * @param e event
         * @param data Event data for the location.
         */
        function receiveProfileData() {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: receiveProfileData');
                }

                $q.all([profileService.isAccessibilityEnabled(), profileService.isIptvPackage(), profileService.isCdvrEnabled()]).then(function (result) {

                    try {
                        var _result = _slicedToArray(result, 3);

                        var isAccessible = _result[0];
                        var hasIpTv = _result[1];
                        var hasCDVR = _result[2];

                        // If account features data is new, or has changed, update
                        // the SDK.
                        if (accountFeatures === null || accountFeatures.accessibility !== isAccessible || accountFeatures.boxless !== hasIpTv || accountFeatures.cDvr !== hasCDVR) {
                            accountFeatures = {
                                accessibility: isAccessible,
                                boxless: hasIpTv,
                                cDvr: hasCDVR
                            };

                            // If this is a change to the user config, flush existing
                            // events so this update will apply only to new events.
                            if (userConfigSetCalled) {
                                analyticsService.flush();
                            }

                            if (analyticsService.isDebug()) {
                                $log.debug('Analytics: Updating accountFeatures', accountFeatures);
                            }
                            analyticsService.getSDK().setAccountFeatures(accountFeatures);

                            updateUserConfigIfNeeded();
                        }
                    } catch (ex) {
                        $log.error('Analytics: capabilities error', ex);
                    }
                }, function (error) {
                    $log.error('Analytics: profileService error', error);
                });
            } catch (ex) {
                $log.error('Analytics: capabilities error', ex);
            }
        }

        /**
         * React to the retrieval of the lineup.
         *
         * @param e event
         * @param data Event data for the location.
         */
        function sessionLineup(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: lineup', data);
                }

                // If account features data is new, or has changed, update
                // the SDK.
                if (videoZone === null || videoZone.division !== data.market || videoZone.lineup !== data.lineupId) {
                    videoZone = {
                        division: data.market,
                        lineup: data.lineupId
                    };

                    // If this is a change to the user config, flush existing
                    // events so this update will apply only to new events.
                    if (userConfigSetCalled) {
                        analyticsService.flush();
                    }

                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Updating videoZone', videoZone);
                    }
                    analyticsService.getSDK().setVideoZone(videoZone);

                    updateUserConfigIfNeeded();
                }
            } catch (ex) {
                $log.error('Analytics: lineup error', ex);
            }
        }

        /**
         * Inform the SDK that all initial session configuration data for this session
         * has been set. This only happens once per session, at the beginning.
         * Afterwards, the individual configuration data items can continue to be
         * changed, but there's no need to re-invoke the SDK's 'userConfigSet'
         * method.
         */
        function updateUserConfigIfNeeded() {

            if (locationData !== null && accountFeatures !== null && videoZone !== null && userConfigSetCalled === false) {

                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: processing event: userConfigSet for this session', locationData, accountFeatures, videoZone);
                }

                // Update experiment and variant IDs
                if (config.dePayload) {
                    analyticsService.getSDK().setExperimentConfigurations({
                        experimentUuids: analyticsAssetHelper.objToArray(config.dePayload.experimentUuids),
                        variantUuids: analyticsAssetHelper.objToArray(config.dePayload.variantUuids)
                    });
                } else {
                    analyticsService.getSDK().setExperimentConfigurations({
                        experimentUuids: [],
                        variantUuids: []
                    });
                }

                // Change our applicationName to 'SpecU', if needed.
                if (profileService.isSpecU()) {
                    analyticsService.getSDK().setApplicationName({ applicationName: 'SpecU' });
                } else if (profileService.isBulkMDU()) {
                    analyticsService.getSDK().setApplicationName({ applicationName: 'BulkMDU' });
                }

                analyticsService.getSDK().userConfigSet();
                userConfigSetCalled = true;
            }
        }

        /**
         * Report channel availability.
         *
         * @param e event
         * @param data Event data containing channel information.
         */
        function channelInfo(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: channelInfo', data);
                }

                // Event payload includes channel counts.
                var payload = {
                    numberAvailableChannels: 0,
                    numberUnavailableChannels: 0
                };

                if (data && data.channels && Array.isArray(data.channels)) {
                    var unblockedChannelIds = [];

                    for (var i = 0; i < data.channels.length; ++i) {
                        var channel = data.channels[i];

                        // Count the available and unavailable channels.
                        if (isChannelAvailable(channel)) {
                            ++payload.numberAvailableChannels;
                            unblockedChannelIds.push(channel.tmsGuideId);
                        } else {
                            ++payload.numberUnavailableChannels;
                        }
                    }

                    // If we only have a few channels available, include their IDs.
                    if (unblockedChannelIds.length < 10) {
                        payload.availableChannels = unblockedChannelIds;
                    }
                }

                analyticsService.event('checkAvailableChannels', payload);
            } catch (ex) {
                $log.error('Analytics: channelInfo error', ex);
            }
        }

        /**
         * Determine if the given channel is available for viewing or not.
         * @param channel to evaluate
         * @return True if the channel is available.
         */
        function isChannelAvailable(channel) {
            var available = channel !== null && channel.twcTvParentallyBlocked === false && channel.twcTvEntitled === true;
            return available;
        }

        /**
         * Prepare to resume this session after the page refreshes.
        */
        function prepareForRefresh(e) {
            var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: prepareForRefresh, url=' + $window.location.href, data);
                }

                analyticsService.getSDK().set('isOnline', false);
            } catch (ex) {
                $log.error('Analytics: prepareForRefresh error', ex);
            }
        }

        /**
         * Function for attaching event listeners.
         */
        function attachEventListeners() {
            try {
                $rootScope.$on('Session:lineup', sessionLineup);
                $rootScope.$on('Session:profileRefreshed', receiveProfileData);
                $rootScope.$on('Analytics:locationRetrieved', locationChanged);
                $rootScope.$on('Analytics:channel-info', channelInfo);
                $rootScope.$on('Analytics:prepareForRefresh', prepareForRefresh);
            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        attachEventListeners();

        return {
            channelInfo: channelInfo,
            sessionLineup: sessionLineup,
            receiveProfileData: receiveProfileData,
            locationChanged: locationChanged,
            isChannelAvailable: isChannelAvailable
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/sessionAnalytics.js.map
