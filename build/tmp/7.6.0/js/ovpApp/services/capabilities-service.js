'use strict';

(function () {
    'use strict';

    CAPABILITIES_STATE_MAP.$inject = ["CAPABILITIES", "PROTECTED_STATE"];
    capabilitiesService.$inject = ["$http", "$q", "config", "$log", "ovpStorage", "$cacheFactory", "$interval", "CAPABILITIES_STATE_MAP", "CAPABILITIES", "CAPABILITIES_ERROR_CODES", "AccessibilityService", "$rootScope", "$timeout"];
    angular.module('ovpApp.services.capabilitiesService', ['ovpApp.config', 'ovpApp.services.ovpStorage']).constant('CAPABILITIES_ERROR_CODES', {
        RDVR_DISABLED: 102,
        STB_NONE: 103,
        RDVR_NONE: 104,
        STB_UNREACHABLE: 110,
        RDVR_UNREACHABLE: 111,
        UNKNOWN: 0xDEADBEEF
    }).constant('CAPABILITIES', {
        ONDEMAND: 'watchondemand',
        LIVE: 'watchlive',
        TUNETOCHANNEL: 'tunetochannel',
        GUIDE: 'viewguide',
        RDVR: 'dvroperations',
        CDVR: 'cdvr',
        IPONLY: 'iponly',
        TVOD: 'tvod',
        ACCESSIBILITY: 'accessibility',
        IPTVPACKAGE: 'iptvpackage',
        SEARCH: 'search'
    }).constant('PROTECTED_STATE', {
        LIVE: 'ovp.livetv',
        GUIDE: 'ovp.guide',
        ONDEMAND: 'ovp.ondemand',
        RDVR: 'ovp.dvr'
    }).factory('CAPABILITIES_STATE_MAP', CAPABILITIES_STATE_MAP).factory('capabilitiesService', capabilitiesService);

    /* @ngInject */
    function CAPABILITIES_STATE_MAP(CAPABILITIES, PROTECTED_STATE) {
        var map = {};
        map[CAPABILITIES.LIVE] = PROTECTED_STATE.LIVE;
        map[CAPABILITIES.ONDEMAND] = PROTECTED_STATE.ONDEMAND;
        map[CAPABILITIES.GUIDE] = PROTECTED_STATE.GUIDE;
        map[CAPABILITIES.RDVR] = PROTECTED_STATE.RDVR;
        return map;
    }

    /* @ngInject */
    function capabilitiesService($http, $q, config, $log, ovpStorage, $cacheFactory, $interval, CAPABILITIES_STATE_MAP, CAPABILITIES, CAPABILITIES_ERROR_CODES, AccessibilityService, $rootScope, $timeout) {
        var capabilitiesUrl = config.capabilitiesUrl(),
            capabilitiesCacheTimeoutMs = parseInt(config.capabilitiesCacheTimeoutInMinutes) * 60 * 1000,
            capabilitiesRefreshOnFailureMs = parseInt(config.capabilitiesRefreshOnFailureInMinutes) * 60 * 1000,
            capabilitiesFailureRetryCount = parseInt(config.capabilitiesFailureRetryCount),
            cacheTimer = null,
            cacheData = null,
            capabilitiesPromise = null,
            capabilitiesRequestRetryTimer = null,
            capabilitiesRequestRetryCount = 0;

        var service = {
            hasCapability: hasCapability,
            refreshCapabilities: refreshCapabilities,
            getCode: getCode,
            isHidden: isHidden,
            getCapabilities: getCapabilities,
            isCached: isCached
        };

        startCapabilitiesCacheTimer();

        return service;

        ///////////////////

        function refreshCapabilities() {
            var bypassRefresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            // Reset promis
            capabilitiesPromise = null;
            return getCapabilities({ bypassRefresh: bypassRefresh });
        }

        function clearCapabilitiesCacheTimer() {
            if (cacheTimer) {
                $interval.cancel(cacheTimer);
            }
        }

        function isCached() {
            return cacheData !== null;
        }

        function startCapabilitiesCacheTimer() {
            clearCapabilitiesCacheTimer(); // Clear previous timer if any
            cacheTimer = $interval(refreshCapabilities, capabilitiesCacheTimeoutMs);
        }

        function getCapabilities(options) {
            // Return cached value if available
            if (capabilitiesPromise) {
                return capabilitiesPromise;
            }

            // Reset retry timer
            if (capabilitiesRequestRetryTimer) {
                $timeout.cancel(capabilitiesRequestRetryTimer);
            }

            capabilitiesPromise = $http({
                method: 'GET',
                url: capabilitiesUrl,
                bypassRefresh: options && options.bypassRefresh || false,
                withCredentials: true
            }).then(function (data) {
                capabilitiesRequestRetryCount = 0; // Reset counter
                // Initialize storage first as other stuff depends on it
                return ovpStorage.initUserStorage(true).then(function () {
                    $rootScope.$broadcast('Session:setCapabilities', data.data);
                    cacheData = data.data;
                    return data.data;
                });
            })['catch'](function (e) {
                capabilitiesRequestRetryCount++;
                // Retry only when you have cached data
                if (cacheData && capabilitiesRequestRetryCount < capabilitiesFailureRetryCount) {
                    //Need to invoke the refreshCapabilties again since the refresh call failed.
                    var retryMs = capabilitiesRequestRetryCount * capabilitiesRefreshOnFailureMs;
                    $log.info('Retrying capabilities request in ' + retryMs + ' Ms ...');
                    // Retry in background, Otherwise user will not be able to navigate to other page
                    $timeout(refreshCapabilities, retryMs);
                } else if (cacheData) {
                    capabilitiesRequestRetryCount = 0; // Reset counter
                    capabilitiesPromise = null; // Reset promise for next capability check
                }

                $log.error(e);

                if (cacheData) {
                    return cacheData;
                } else {
                    return $q.reject({ errorCode: e.errorCode || 'WUC-1002' });
                }
            });

            return capabilitiesPromise;
        }

        /**
         * Determines if the capability is valid.
         * @param capabilityId {String} - The capability to check
         * @returns {$q.defer.promise} - The promise to resolve
         */
        function hasCapability(capabilityId) {
            return getCapability(capabilityId);
        }

        /**
         * Determines if the capablity is enabled or disabled.
         *
         * @param capabilityId {String} - The capability to check
         * @returns {null|$q.defer.promise} - The promise to resolve
         */
        function getCapability(capabilityId) {
            return getCapabilities().then(function (capabilities) {
                var capability = capabilities[capabilityId];
                return capability ? capability.authorized : false;
            });
        }

        /**
         * Gets the error code associated with the capability
         *
         * @param capabilityId (String) - The capability to check
         * @returns {null|$q.defer.promise} - The promise to resolve
         */
        function getCode(capabilityId) {
            return getCapabilities().then(function (capabilities) {
                var capability = capabilities[capabilityId];
                return capability ? capability.code : null;
            });
        }

        /**
         * Gets the hide flag associated with the capability
         *
         * @param capabilityId (String) - The capability to check
         * @returns {null|$q.defer.promise} - The promise to resolve
         */
        function isHidden(capabilityId) {
            return getCapabilities().then(function (capabilities) {
                var capability = capabilities[capabilityId];
                return capability ? capability.hide : null;
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/capabilities-service.js.map
