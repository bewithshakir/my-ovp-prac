'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    ProfileService.$inject = ["config", "capabilitiesService", "CAPABILITIES", "CAPABILITIES_STATE_MAP", "AccessibilityService", "$q", "$rootScope", "OauthDataManager", "locationService"];
    angular.module('ovpApp.services.profileService', ['ovpApp.config', 'ovpApp.services.capabilitiesService', 'ovpApp.services.accessibility', 'ovpApp.oauth', 'ovpApp.services.locationService']).factory('profileService', ProfileService);
    /* @ngInject */
    function ProfileService(config, capabilitiesService, CAPABILITIES, CAPABILITIES_STATE_MAP, AccessibilityService, $q, $rootScope, OauthDataManager, locationService) {

        var _postAuthUpdatePromise = null,
            _profileRefreshed = false;

        return {
            postAuth: postAuth,
            isProfileRefreshed: isProfileRefreshed,
            refreshProfile: refreshProfile,
            isAccessibilityEnabled: isAccessibilityEnabled,
            isCdvrEnabled: isCdvrEnabled,
            isRdvrEnabled: isRdvrEnabled,
            hasCapability: hasCapability,
            isHidden: isHidden,
            isTVODEnabled: isTVODEnabled,
            isTVODRentEnabled: isTVODRentEnabled,
            isTVODWatchEnabled: isTVODWatchEnabled,
            isIpOnlyEnabled: isIpOnlyEnabled,
            isRdvrHidden: isRdvrHidden,
            canUseTwctv: canUseTwctv,
            canWatchLive: canWatchLive,
            canUseGuide: canUseGuide,
            isIptvPackage: isIptvPackage,
            getCapabilities: getCapabilities,
            getCode: getCode,
            getFirstAvailableState: getFirstAvailableState,
            isAutoAuthEnabled: isAutoAuthEnabled,
            isSpecU: isSpecU,
            isBulkMDU: isBulkMDU,
            isSpecUOrBulkMDU: isSpecUOrBulkMDU
        };

        /**
         * Post Login functions are
         * - get authenticated configuration
         * - force refresh of capabilities
         * - Make sure that no capabilities checks succeed until this has been run at least once
         */
        function postAuth() {
            if (_postAuthUpdatePromise === null) {
                _postAuthUpdatePromise = refreshProfile(true).then(function () {
                    return _postAuthUpdatePromise = null;
                });
            }
            return _postAuthUpdatePromise;
        }

        function isProfileRefreshed() {
            return _profileRefreshed;
        }

        function refreshProfile(bypass) {
            return $q.all([capabilitiesService.refreshCapabilities(bypass), config.fetchAuthenticatedConfig()]).then(function () /* [capabilities, config] */{
                //Update Config based on Capabilities
                if (isAccessibilityEnabled()) {
                    config.ivrNumber = config._accessibilityIvrNumber;
                }
                _profileRefreshed = true;
                $rootScope.$broadcast('Session:profileRefreshed');
                return true;
            });
        }

        function isAccessibilityEnabled() {
            return $q.all([hasCapability(CAPABILITIES.ACCESSIBILITY), AccessibilityService.isEnabled()]).then(function (result) {
                var _result = _slicedToArray(result, 2);

                var isAccessible = _result[0];
                var isEnabled = _result[1];

                return isAccessible && isEnabled;
            });
        }

        function isCdvrEnabled() {
            return $q.all([isAccessibilityEnabled(), hasCapability(CAPABILITIES.CDVR)]).then(function (result) {
                var _result2 = _slicedToArray(result, 2);

                var isAccessible = _result2[0];
                var hasCDVR = _result2[1];

                // Disable CDVR if accessibility is not enabled
                return hasCDVR && config.getBool(config.cdvrEnabled) && isAccessible;
            });
        }

        function isRdvrEnabled() {
            return $q.all([isIpOnlyEnabled(), hasCapability(CAPABILITIES.RDVR)]).then(function (result) {
                var _result3 = _slicedToArray(result, 2);

                var isIpOnly = _result3[0];
                var hasRDVR = _result3[1];

                return !isIpOnly && hasRDVR;
            });
        }

        function isRdvrHidden() {
            return isHidden(CAPABILITIES.RDVR);
        }

        function isTVODEnabled() {
            return $q.all([hasCapability(CAPABILITIES.TVOD), isTVODRentEnabled(), isTVODWatchEnabled()]).then(function (result) {
                var _result4 = _slicedToArray(result, 3);

                var hasTvodCapability = _result4[0];
                var rentEnabled = _result4[1];
                var watchEnabled = _result4[2];

                var tvodEnabled = rentEnabled || watchEnabled;

                // TVOD might be disabled for all
                if (!hasTvodCapability) {
                    return false;
                }

                return tvodEnabled;
            });
        }

        function isTVODRentEnabled() {
            return hasCapability(CAPABILITIES.TVOD).then(function (hasTvodCapability) {
                return hasTvodCapability && config.getBool(config.tvodRent);
            });
        }

        function isTVODWatchEnabled() {
            return hasCapability(CAPABILITIES.TVOD).then(function (hasTvodCapability) {
                return hasTvodCapability && config.getBool(config.tvodWatch);
            });
        }

        function isIpOnlyEnabled() {
            return $q.all([isCdvrEnabled(), isAccessibilityEnabled(), isSpecUOrBulkMDU(), isIptvPackage()]).then(function (results) {
                return results.some(function (result) {
                    return result;
                });
            });
        }

        function isAutoAuthEnabled() {
            return config.streamPlus.enabled || config.specU.enabled || config.bulkMDU.enabled;
        }

        /**
         * SpecU is our service for universities
         */
        function isSpecU() {
            return config.specU.enabled && OauthDataManager.get().accountType === 'SPECU';
        }

        /**
         * Bulk MDU (where 'MDU' = 'multi-dwelling unit') is our service for
         * things like apartment complexes
         */
        function isBulkMDU() {
            var oauthParam = OauthDataManager.get();
            return config.bulkMDU.enabled && oauthParam.accountType === 'BULK' && oauthParam.classification === 'MDU_BULK_MASTER';
        }

        function isSpecUOrBulkMDU() {
            return isSpecU() || isBulkMDU();
        }

        function isIptvPackage() {
            return hasCapability(CAPABILITIES.IPTVPACKAGE);
        }

        function canUseTwctv() {
            return $q.all([hasCapability(CAPABILITIES.ONDEMAND), hasCapability(CAPABILITIES.RDVR), hasCapability(CAPABILITIES.GUIDE), hasCapability(CAPABILITIES.LIVE)]).then(function (values) {
                // If any of the value is true then return true else reject promise
                return values.some(function (v) {
                    return v;
                }) ? true : $q.reject();
            });
        }

        function getFirstAvailableState() {
            return capabilitiesService.getCapabilities().then(function (capabilities) {
                var state = null;
                angular.forEach(capabilities, function (value, key) {
                    if (value.authorized && CAPABILITIES_STATE_MAP[key]) {
                        state = CAPABILITIES_STATE_MAP[key];
                    }
                });
                return state;
            });
        }

        function canWatchLive() {
            return hasCapability(CAPABILITIES.LIVE);
        }

        function canUseGuide() {
            return hasCapability(CAPABILITIES.GUIDE);
        }

        function hasCapability(capabilityId) {
            if (_profileRefreshed) {
                //Verify that the capabilities are accurate
                if (capabilityId === CAPABILITIES.TVOD) {
                    return hasTvodCapability();
                } else if (capabilityId !== CAPABILITIES.RDVR) {
                    // If the capability is not RDVR process normally
                    return capabilitiesService.hasCapability(capabilityId);
                } else {
                    return hasRdvrCapability();
                }
            } else {
                return $q.reject('Capabilities are not yet loaded');
            }
        }

        /**
         * Helper method for hasCapability
         */
        function hasTvodCapability() {
            // STVWEB-1605: Disable Video Store when OOH
            return locationService.getLocation().then(function (location) {
                return location.behindOwnModem ? capabilitiesService.hasCapability(CAPABILITIES.TVOD) : false;
            })['catch'](function () {
                // On error disable TVOD
                return false;
            });
        }

        /**
         * Helper method for hasCapability
         */
        function hasRdvrCapability() {
            // If the capability is RDVR and cDVR is enabled then we will disable the RDVR capability, currently
            // RDVR and cDVR are mutually exclusive.
            return isCdvrEnabled().then(function (cdvrEnabled) {
                if (cdvrEnabled) {
                    return false;
                } else {
                    return capabilitiesService.hasCapability(CAPABILITIES.RDVR);
                }
            });
        }

        function isHidden(capabilityId) {
            // STVWEB-844 / STVWEB-845: Hide ondemand and search if not available (only for specU)
            // Hide DVR if not available (for all)
            if (capabilityId === CAPABILITIES.CDVR || capabilityId === CAPABILITIES.RDVR || (capabilityId === CAPABILITIES.ONDEMAND || capabilityId === CAPABILITIES.SEARCH) && isSpecU()) {
                return capabilitiesService.hasCapability(capabilityId).then(function (enabled) {
                    return !enabled;
                });
            } else if (capabilityId === CAPABILITIES.TVOD) {
                // STVWEB-1605: Disable Video Store when OOH
                // Hide Video Store it not available
                return locationService.getLocation().then(function (location) {
                    return capabilitiesService.hasCapability(capabilityId).then(function (enabled) {
                        return !location.behindOwnModem && enabled ? false : !enabled;
                    });
                })['catch'](function () {
                    // On error hide TVOD
                    return true;
                });
            } else {
                return capabilitiesService.isHidden(capabilityId);
            }
        }

        function getCapabilities() {
            return capabilitiesService.getCapabilities();
        }

        function getCode(capability) {
            return capabilitiesService.getCode(capability);
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/profile-service.js.map
