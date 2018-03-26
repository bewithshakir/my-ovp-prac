(function () {
    'use strict';
    angular.module('ovpApp.settings.settingsStateService', [
        'ovpApp.services.profileService',
        'ovpApp.services.stbService',
        'ovpApp.config'
    ])

    .factory('settingsStateService', settingsStateService);

    /* @ngInject */
    function settingsStateService(stbService, CAPABILITIES, config, $q, profileService) {
        let hasGuide = true,
            hasStbs = true,
            hasAccessibility = true,
            isAccessibilityEnabled = false,
            stbSettingsEnabled = false,
            isTVODEnabled = false,
            statePromise;

        const states = [
                {
                    title: 'Favorites',
                    description: 'Update your favorite channels',
                    class: 'settingsFavorites',
                    state: 'ovp.settings.favorites',
                    enabled: () => hasGuide,
                    displayType: 'grid',
                    type: config.globalSettings
                },
                {
                    title: 'Devices',
                    description: 'Update your device settings',
                    class: 'settingsDevices',
                    state: 'ovp.settings.devices',
                    enabled: () => hasStbs && !isAccessibilityEnabled,
                    displayType: 'list',
                    type: config.globalSettings
                },
                {
                    title: 'Parental Controls',
                    description: 'Update your parental controls',
                    class: 'settingsParental',
                    state: 'ovp.settings.parentalControls',
                    enabled: () => !profileService.isSpecUOrBulkMDU(),
                    displayType: 'plain',
                    type: config.websiteSettings
                },
                {
                    title: 'Purchase PIN',
                    description: 'Update your purchase pin',
                    class: 'settingsParental',
                    state: 'ovp.settings.purchasePin',
                    enabled: () => isTVODEnabled,
                    displayType: 'plain',
                    type: config.websiteSettings
                },
                {
                    title: 'Accessibility',
                    description: 'Update your accessibility settings',
                    class: 'settingsAccessibility',
                    state: 'ovp.settings.accessibility',
                    displayType: 'plain',
                    enabled: () => hasAccessibility,
                    type: config.websiteSettings
                },
                {
                    title: 'Parental Controls',
                    description: 'Update your parental controls',
                    class: 'settingsParental',
                    state: 'ovp.settings.stb.parentalControls',
                    enabled: () => ((!isAccessibilityEnabled && stbSettingsEnabled && hasStbs) || false),
                    displayType: 'plain',
                    type: config.stbSettings
                },
                {
                    title: 'Purchase PIN',
                    description: 'Update your purchase pin',
                    class: 'settingsParental',
                    state: 'ovp.settings.stb.purchasePin',
                    enabled: () => ((!isAccessibilityEnabled && stbSettingsEnabled && hasStbs) || false),
                    displayType: 'plain',
                    type: config.stbSettings
                }
            ];

        statePromise = $q.all({
                guideRes: profileService.hasCapability(CAPABILITIES.GUIDE),
                stbsRes: stbService.getSTBs(),
                tvodRes: profileService.isTVODRentEnabled(),
                accessibilityRes: profileService.hasCapability(CAPABILITIES.ACCESSIBILITY),
                accessibilityEnabledRes: profileService.isAccessibilityEnabled()
            }).then(result => {
                hasGuide = result.guideRes;
                hasStbs = result.stbsRes && result.stbsRes.length > 0;
                isTVODEnabled = result.tvodRes;
                hasAccessibility = result.accessibilityRes;
                isAccessibilityEnabled = result.accessibilityEnabledRes;
                if (hasStbs && result.stbsRes.some(stb => stb.clientType === 'ODN')) {
                    stbSettingsEnabled = config.getBool(config.stbSettingsEnabled);
                }
            }, () => {
                hasGuide = false;
                hasStbs = false;
                isTVODEnabled = false;
            });

        return {
            states: states,
            getStates: function () {
                return $q.when(statePromise).then(() => {
                    return states;
                });
            },
            getState: function (state) {
                return $q.when(statePromise).then(() => {
                    return states.find((s) => s.state == state);
                });
            },
            getFallbackState: function () {
                const firstState = states.find(state => state.enabled());
                return firstState || {state: 'ovp.livetv'};
            }
        };
    }

}());
