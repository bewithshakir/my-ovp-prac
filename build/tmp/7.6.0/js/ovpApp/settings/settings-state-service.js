'use strict';

(function () {
    'use strict';
    settingsStateService.$inject = ["stbService", "CAPABILITIES", "config", "$q", "profileService"];
    angular.module('ovpApp.settings.settingsStateService', ['ovpApp.services.profileService', 'ovpApp.services.stbService', 'ovpApp.config']).factory('settingsStateService', settingsStateService);

    /* @ngInject */
    function settingsStateService(stbService, CAPABILITIES, config, $q, profileService) {
        var hasGuide = true,
            hasStbs = true,
            hasAccessibility = true,
            isAccessibilityEnabled = false,
            stbSettingsEnabled = false,
            isTVODEnabled = false,
            statePromise = undefined;

        var states = [{
            title: 'Favorites',
            description: 'Update your favorite channels',
            'class': 'settingsFavorites',
            state: 'ovp.settings.favorites',
            enabled: function enabled() {
                return hasGuide;
            },
            displayType: 'grid',
            type: config.globalSettings
        }, {
            title: 'Devices',
            description: 'Update your device settings',
            'class': 'settingsDevices',
            state: 'ovp.settings.devices',
            enabled: function enabled() {
                return hasStbs && !isAccessibilityEnabled;
            },
            displayType: 'list',
            type: config.globalSettings
        }, {
            title: 'Parental Controls',
            description: 'Update your parental controls',
            'class': 'settingsParental',
            state: 'ovp.settings.parentalControls',
            enabled: function enabled() {
                return !profileService.isSpecUOrBulkMDU();
            },
            displayType: 'plain',
            type: config.websiteSettings
        }, {
            title: 'Purchase PIN',
            description: 'Update your purchase pin',
            'class': 'settingsParental',
            state: 'ovp.settings.purchasePin',
            enabled: function enabled() {
                return isTVODEnabled;
            },
            displayType: 'plain',
            type: config.websiteSettings
        }, {
            title: 'Accessibility',
            description: 'Update your accessibility settings',
            'class': 'settingsAccessibility',
            state: 'ovp.settings.accessibility',
            displayType: 'plain',
            enabled: function enabled() {
                return hasAccessibility;
            },
            type: config.websiteSettings
        }, {
            title: 'Parental Controls',
            description: 'Update your parental controls',
            'class': 'settingsParental',
            state: 'ovp.settings.stb.parentalControls',
            enabled: function enabled() {
                return !isAccessibilityEnabled && stbSettingsEnabled && hasStbs || false;
            },
            displayType: 'plain',
            type: config.stbSettings
        }, {
            title: 'Purchase PIN',
            description: 'Update your purchase pin',
            'class': 'settingsParental',
            state: 'ovp.settings.stb.purchasePin',
            enabled: function enabled() {
                return !isAccessibilityEnabled && stbSettingsEnabled && hasStbs || false;
            },
            displayType: 'plain',
            type: config.stbSettings
        }];

        statePromise = $q.all({
            guideRes: profileService.hasCapability(CAPABILITIES.GUIDE),
            stbsRes: stbService.getSTBs(),
            tvodRes: profileService.isTVODRentEnabled(),
            accessibilityRes: profileService.hasCapability(CAPABILITIES.ACCESSIBILITY),
            accessibilityEnabledRes: profileService.isAccessibilityEnabled()
        }).then(function (result) {
            hasGuide = result.guideRes;
            hasStbs = result.stbsRes && result.stbsRes.length > 0;
            isTVODEnabled = result.tvodRes;
            hasAccessibility = result.accessibilityRes;
            isAccessibilityEnabled = result.accessibilityEnabledRes;
            if (hasStbs && result.stbsRes.some(function (stb) {
                return stb.clientType === 'ODN';
            })) {
                stbSettingsEnabled = config.getBool(config.stbSettingsEnabled);
            }
        }, function () {
            hasGuide = false;
            hasStbs = false;
            isTVODEnabled = false;
        });

        return {
            states: states,
            getStates: function getStates() {
                return $q.when(statePromise).then(function () {
                    return states;
                });
            },
            getState: function getState(state) {
                return $q.when(statePromise).then(function () {
                    return states.find(function (s) {
                        return s.state == state;
                    });
                });
            },
            getFallbackState: function getFallbackState() {
                var firstState = states.find(function (state) {
                    return state.enabled();
                });
                return firstState || { state: 'ovp.livetv' };
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/settings/settings-state-service.js.map
