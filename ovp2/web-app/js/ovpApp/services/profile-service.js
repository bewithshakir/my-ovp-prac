(function () {
    'use strict';

    angular.module('ovpApp.services.profileService', [
        'ovpApp.config',
        'ovpApp.services.capabilitiesService',
        'ovpApp.services.accessibility',
        'ovpApp.oauth',
        'ovpApp.services.locationService'
    ])
    .factory('profileService', ProfileService);
    /* @ngInject */
    function ProfileService(config, capabilitiesService, CAPABILITIES, CAPABILITIES_STATE_MAP,
        AccessibilityService, $q, $rootScope, OauthDataManager, locationService) {

        let _postAuthUpdatePromise = null,
            _profileRefreshed = false;

        return {
            postAuth,
            isProfileRefreshed,
            refreshProfile,
            isAccessibilityEnabled,
            isCdvrEnabled,
            isRdvrEnabled,
            hasCapability,
            isHidden,
            isTVODEnabled,
            isTVODRentEnabled,
            isTVODWatchEnabled,
            isIpOnlyEnabled,
            isRdvrHidden,
            canUseTwctv,
            canWatchLive,
            canUseGuide,
            isIptvPackage,
            getCapabilities,
            getCode,
            getFirstAvailableState,
            isAutoAuthEnabled,
            isSpecU,
            isBulkMDU,
            isSpecUOrBulkMDU
        };

        /**
         * Post Login functions are
         * - get authenticated configuration
         * - force refresh of capabilities
         * - Make sure that no capabilities checks succeed until this has been run at least once
         */
        function postAuth() {
            if (_postAuthUpdatePromise === null) {
                _postAuthUpdatePromise = refreshProfile(true).then(() => _postAuthUpdatePromise = null);
            }
            return _postAuthUpdatePromise;
        }

        function isProfileRefreshed() {
            return _profileRefreshed;
        }

        function refreshProfile(bypass) {
            return $q.all([capabilitiesService.refreshCapabilities(bypass),
                config.fetchAuthenticatedConfig()])
                .then((/* [capabilities, config] */) => {
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
            return $q.all([hasCapability(CAPABILITIES.ACCESSIBILITY), AccessibilityService.isEnabled()])
                .then(result => {
                    let [isAccessible, isEnabled] = result;
                    return isAccessible && isEnabled;
                });
        }

        function isCdvrEnabled() {
            return $q.all([isAccessibilityEnabled(), hasCapability(CAPABILITIES.CDVR)])
                .then(result => {
                    let [isAccessible, hasCDVR] = result;
                    // Disable CDVR if accessibility is not enabled
                    return hasCDVR && config.getBool(config.cdvrEnabled) && isAccessible;
                });
        }

        function isRdvrEnabled() {
            return $q.all([isIpOnlyEnabled(), hasCapability(CAPABILITIES.RDVR)])
                .then(result => {
                    let [isIpOnly, hasRDVR] = result;
                    return !isIpOnly && hasRDVR;
                });
        }

        function isRdvrHidden() {
            return isHidden(CAPABILITIES.RDVR);
        }

        function isTVODEnabled() {
            return $q.all([
                hasCapability(CAPABILITIES.TVOD),
                isTVODRentEnabled(),
                isTVODWatchEnabled()
            ])
            .then(result => {
                let [
                    hasTvodCapability,
                    rentEnabled,
                    watchEnabled
                ] = result;

                let tvodEnabled = rentEnabled || watchEnabled;

                // TVOD might be disabled for all
                if (!hasTvodCapability) {
                    return false;
                }

                return tvodEnabled;
            });
        }

        function isTVODRentEnabled() {
            return hasCapability(CAPABILITIES.TVOD).then(hasTvodCapability => {
                return hasTvodCapability && config.getBool(config.tvodRent);
            });
        }

        function isTVODWatchEnabled() {
            return hasCapability(CAPABILITIES.TVOD).then(hasTvodCapability => {
                return hasTvodCapability && config.getBool(config.tvodWatch);
            });
        }

        function isIpOnlyEnabled() {
            return $q.all([
                isCdvrEnabled(),
                isAccessibilityEnabled(),
                isSpecUOrBulkMDU(),
                isIptvPackage()
            ]).then(results => results.some(result => result));
        }

        function isAutoAuthEnabled() {
            return (config.streamPlus.enabled || config.specU.enabled || config.bulkMDU.enabled);
        }

        /**
         * SpecU is our service for universities
         */
        function isSpecU() {
            return config.specU.enabled &&
                OauthDataManager.get().accountType === 'SPECU';
        }

        /**
         * Bulk MDU (where 'MDU' = 'multi-dwelling unit') is our service for
         * things like apartment complexes
         */
        function isBulkMDU() {
            let oauthParam = OauthDataManager.get();
            return config.bulkMDU.enabled &&
                oauthParam.accountType === 'BULK' &&
                oauthParam.classification === 'MDU_BULK_MASTER';
        }

        function isSpecUOrBulkMDU() {
            return isSpecU() || isBulkMDU();
        }

        function isIptvPackage() {
            return hasCapability(CAPABILITIES.IPTVPACKAGE);
        }

        function canUseTwctv() {
            return $q.all([hasCapability(CAPABILITIES.ONDEMAND),
                      hasCapability(CAPABILITIES.RDVR),
                      hasCapability(CAPABILITIES.GUIDE),
                      hasCapability(CAPABILITIES.LIVE)
                ])
                .then(values => {
                    // If any of the value is true then return true else reject promise
                    return (values.some(v => v)) ? true : $q.reject();
                });
        }

        function getFirstAvailableState() {
            return capabilitiesService.getCapabilities().then((capabilities) => {
                let state = null;
                angular.forEach(capabilities, (value, key) => {
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
                } else if (capabilityId !== CAPABILITIES.RDVR) { // If the capability is not RDVR process normally
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
            return locationService.getLocation()
                .then(location => {
                    return location.behindOwnModem ?
                        capabilitiesService.hasCapability(CAPABILITIES.TVOD) : false;
                }).catch(() => {
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
            return isCdvrEnabled().then(cdvrEnabled => {
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
            if (capabilityId === CAPABILITIES.CDVR || capabilityId === CAPABILITIES.RDVR ||
                ((capabilityId === CAPABILITIES.ONDEMAND || capabilityId === CAPABILITIES.SEARCH) && isSpecU())) {
                return capabilitiesService.hasCapability(capabilityId).then(enabled => !enabled);
            } else if (capabilityId === CAPABILITIES.TVOD) {
                // STVWEB-1605: Disable Video Store when OOH
                // Hide Video Store it not available
                return locationService.getLocation().then(location => {
                    return capabilitiesService.hasCapability(capabilityId).then(enabled => {
                        return (!location.behindOwnModem && enabled) ? false : !enabled;
                    });
                }).catch(() => {
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
}());
