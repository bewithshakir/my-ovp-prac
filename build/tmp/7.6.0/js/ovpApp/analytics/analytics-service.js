/* globals window */
'use strict';

(function () {
    'use strict';

    analyticsService.$inject = ["config", "AnalyticsState", "httpUtil", "$log", "$rootScope", "$window", "analyticsStorage"];
    angular.module('ovpApp.analytics.analyticsService', ['ovpApp.config', 'ovpApp.analytics.state', 'ovpApp.legacy.httpUtil']).factory('analyticsStorage', function analyticsSessionStorage() {
        var service = {
            get: get,
            set: set,
            reset: reset
        };

        var prefix = 'ven-';

        function get(key) {
            return window.sessionStorage.getItem(prefix + key);
        }
        function set(key, value) {
            return window.sessionStorage.setItem(prefix + key, value);
        }
        function reset(key) {
            return window.sessionStorage.removeItem(prefix + key);
        }

        return service;
    }).factory('analyticsService', analyticsService);

    /* @ngInject */
    function analyticsService(config, AnalyticsState, httpUtil, $log, $rootScope, $window, analyticsStorage) {

        var analytics = require('analytics');
        var queryPairs = httpUtil.getPairsFromQueryString();
        var state = new AnalyticsState();
        var debug = config.analytics.debug || queryPairs.analyticsDebug === 'true' || false;
        var enabled = config.analytics.venona.enabled;
        var endpoint = config.analytics.endpoint;

        // ignored events
        var ignored = {
            initiating: ['adStart', 'adStop', 'bufferingStart', 'bufferingStop', 'adBreakStart', 'adBreakStop'],
            navigating: ['adStart', 'adStop', 'adBreakStart', 'adBreakStop', 'bufferingStart', 'bufferingStop', 'playbackFailure', 'playbackStart', 'playbackPause', 'playbackUnpause'],
            failed: ['adStop', 'adBreakStop', 'bufferingStart', 'bufferingStop', 'playbackFailure', 'playbackStreamUriAcquired'],
            playing: ['playbackUnpause', 'playbackStart', 'bufferingStop'],
            paused: ['playbackPause'],
            buffering: ['bufferingStart']
        };

        var service = {
            initialize: function initialize(fields, options) {
                return _initialize(fields, options);
            },
            event: function event(name, data, deferredEvent) {
                return _event(name, data, deferredEvent);
            },
            setPlayerPosition: function setPlayerPosition(position) {
                return state.setElapsedMs(position);
            },
            analytics: analytics,
            state: state,
            getCurrentLibraryState: getCurrentLibraryState,
            flush: flush,
            getSDK: getSDK,
            getTriggeredBy: getTriggeredBy,
            isDebug: isDebug
        };

        return service;

        /////////////////////
        function _event(name, data, deferredEvent, extraData) {
            try {

                var currentState = null;
                var deferredEventData;

                if (debug && !isIgnored(name) && config.analytics.debugIgnored.indexOf(name) < 0) {
                    $log.debug('Analytics: processing event: ' + name, data);
                }

                if (enabled) {
                    // Don't process disabled events.
                    try {
                        var suppressThisEvent = config && config.analytics && config.analytics.venona && config.analytics.venona.events && angular.isDefined(config.analytics.venona.events[name]) && !config.analytics.venona.events[name];

                        if (suppressThisEvent) {
                            if (debug) {
                                $log.debug('Analytics: event suppressed', name, data);
                            }
                            return;
                        }

                        state.setPreviousEventName(name);

                        // Only query the current library state if we're in debug mode.
                        if (debug) {
                            currentState = getCurrentLibraryState();
                        }

                        // send the event
                        analytics[name](data, extraData || {});

                        if (deferredEvent) {
                            deferredEventData = state.getDeferredEvent(deferredEvent);
                            if (deferredEventData) {
                                _event(deferredEventData.name, deferredEventData.data, undefined, {});
                            }
                        }
                    } catch (e) {
                        $log.error('Analytics Error: ', e);
                    }
                }

                // Additional logging to clarify when and why the SDK's internal state changes,
                // especially to a disabled state.
                if (debug) {
                    var newState = getCurrentLibraryState();
                    if (newState !== currentState) {
                        $log.debug('Analytics: SDK State: ' + currentState + ' -> ' + newState + ', event:' + name);
                        if ('DISABLED' === newState) {
                            $log.error('SDK disabled!');
                        }
                    }
                }

                return;
            } catch (ex) {}
        }

        function isIgnored(name) {
            var currentState = analytics.getCurrentLibraryState();
            if (ignored[currentState] && ignored[currentState].indexOf(name) > -1) {
                return true;
            }

            return false;
        }

        function _initialize(fields, options) {
            // Don't run if venona disabled.
            if (!enabled) {
                return;
            }

            analytics.addIgnoredEvents(ignored);
            analytics.set('endpoint', endpoint);
            analytics.set('validation', false);

            // SDK can suppress irrelevant fields when filterFields=true. This
            // can be set in the config and overridden by Cyclops. Defaults to
            // false to retain prior behavior.
            analytics.set('filterFields', config.analytics.filterFields || false);

            // Point analytics library to session storage so we can continue visits
            // after a logout.
            if (isSessionStorageSupported()) {
                analytics.setStorage(analyticsStorage);
            }

            analytics.init(fields, options);

            // Inform analytics library we are now online.
            analytics.set('isOnline', true);

            // Inform client analytics library when we're offline so it can store
            // events until we return online.
            $rootScope.$on('connectivityService:statusChanged', function (e, isOnline) {
                analytics.set('isOnline', isOnline);
            });

            // Try to send any batched events on browser close or reload
            // this might not always work, but it's the best option
            window.onbeforeunload = function () {
                analytics.flush();
                return;
            };

            if (debug) {
                $log.debug('Analytics: Initialization complete. visitId=' + analytics.getVisitId(), config.analytics);
            }
        }

        function getCurrentLibraryState() {
            return analytics.getCurrentLibraryState();
        }

        function flush() {
            analytics.flush();
        }

        /**
         * Expose the underlying analytics SDK.
         * @return Analytics SDK instance.
         */
        function getSDK() {
            return analytics;
        }

        /**
         * Determine if the keyboard or a pointing device was most recently used.
         * @return 'keyboard' if user last activated a control via keyboard, otherwise 'mouse'.
         */
        function getTriggeredBy() {
            return 'focus-outline-none' === $rootScope.focusClass ? 'mouse' : 'keyboard';
        }
        /**
         * Accessor for debug flag.
         * @return True if debug flag is on, otherwise false.
         */
        function isDebug() {
            return debug;
        }

        function isSessionStorageSupported() {
            if ($window.sessionStorage) {
                try {
                    // Check for private mode (Safari - localStorage not supported in private mode)
                    $window.sessionStorage.setItem('storageCheck', 'test');
                    if ('test' !== $window.sessionStorage.getItem('storageCheck')) {
                        throw new Error('sessionStorage not supported');
                    }
                    $window.sessionStorage.removeItem('storageCheck');
                } catch (e) {
                    return false;
                }
            }
            return true;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/analytics/analytics-service.js.map
