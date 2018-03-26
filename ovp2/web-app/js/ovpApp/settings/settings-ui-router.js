(function () {
    'use strict';
    angular.module('ovpApp.settings.router', [
        'ui.router',
        'ovpApp.settings.settingsStateService',
        'ovpApp.services.purchasePinService',
        'ovpApp.services.errorCodes',
        'ovpApp.messages',
        'ovpApp.settings.devices',
        'ovpApp.settings.parentalControls',
        'ovpApp.settings.stb.parentalControls',
        'ovpApp.settings.stb.parentalControls.titleBlock',
        'ovpApp.settings.stb.parentalControls.timeBlock',
        'ovpApp.settings.stb.parentalControls.shareInProgressList',
        'ovpApp.settings.stb.parentalControls.contentBlock',
        'ovpApp.settings.parentalControls.channelBlock',
        'ovpApp.settings.stb.receiverUnavailable',
        'ovpApp.settings.favorites',
        'ovpApp.settings.purchasePin',
        'ovpApp.settings.stbPurchasePin',
        'ovpApp.settings.accessibility',
        'ovpApp.services.stbService',
        'ovpApp.config'
    ])
    .config(config);

    /* @ngInject */
    function config($stateProvider) {
        // abstract parent state, should redirect to default settings
        // page, currently favorites
        $stateProvider.state('ovp.settings', {
            redirectTo: redirect,
            url: '/settings',
            data: {
                subheaderLabel: 'settings'
            },
            resolve: {
                /* @ngInject */
                stb: function (stbService) {
                    return stbService.getCurrentStb();
                }
            },
            views: {
                appView: {
                    component: 'settingsMainPage'
                },
                'tablist@ovp.settings': {
                    templateUrl: '/js/ovpApp/settings/setting-tablist/setting-tablist.html'
                }
            }
        });

        $stateProvider.state('ovp.settings.favorites', {
            redirectTo: redirect,
            data: {
                pageTitle: 'Settings - Favorites'
            },
            component: 'favorites',
            url: '/favorites',
            resolve: {
                /* @ngInject */
                channels: (epgsService, favoritesService, $q, $rootScope) => {
                    const promise = $q.all([
                        epgsService.getChannels(),
                        favoritesService.syncFavoriteChannels()
                    ])
                    .then(([channels]) => channels);

                    $rootScope.$broadcast('message:loading', promise);
                    return promise;
                }
            }
        });

        $stateProvider.state('ovp.settings.accessibility', {
            redirectTo: redirect,
            data: {
                pageTitle: 'Settings - Accessibility'
            },
            component: 'accessibility',
            url: '/accessibility'
        });

        $stateProvider.state('ovp.settings.parentalControls', {
            redirectTo: redirect,
            data: {
                pageTitle: 'Settings - Parental Controls'
            },
            url: '/parentalControls',
            templateUrl: '/js/ovpApp/settings/parentalControls/parentalControls.html'
        });

        $stateProvider.state('ovp.settings.devices', {
            redirectTo: redirect,
            data: {
                pageTitle: 'Settings - Devices'
            },
            url: '/devices',
            templateUrl: '/js/ovpApp/settings/devices/devices.html'
        });

        $stateProvider.state('ovp.settings.purchasePin', {
            redirectTo: redirect,
            data: {
                pageTitle: 'Settings - Purchase Pin'
            },
            controller: 'PurchasePinController',
            url: '/purchasePin',
            templateUrl: '/js/ovpApp/settings/purchasePin/purchasePin.html',
            resolve: {
                /* @ngInject */
                purchaseSwitchFlag: function (purchasePinService, $log, $rootScope, $state, messages,
                    errorCodesService) {
                    return purchasePinService.isPINSet().then(pinIsSet => {
                        var hasPin = pinIsSet;
                        if (!hasPin) {
                            return false;
                        } else {
                            return purchasePinService.isPurchasePINDisabledForClient().then(result => {
                                return !result;
                            });
                        }
                    }, function (error) {
                        $log.error(error);
                        $rootScope.$broadcast('message:growl', errorCodesService.getMessageForCode('WGE-1001'));
                        $rootScope.$broadcast('pageChangeComplete', $state.current);
                    });
                }
            }
        });

        $stateProvider.state('ovp.settings.stb', {
            redirectTo: redirect,
            abstract: true,
            data: {
                pageTitle: 'Set Top Settings'
            },
            resolve: {
                /* @ngInject */
                currentStb: function (stbService, $q, $state) {
                    return stbService.getCurrentStb().then(stb => {
                        if (!stb) {
                            $state.go('ovp.livetv');
                            return $q.reject('No available STB in this account (tried to route to stb settings)');
                        } else {
                            return stb;
                        }
                    });
                },
                /* @ngInject */
                preferences: function (StbSettingsService, currentStb) {
                    return StbSettingsService.getPreferences(currentStb, true)
                        .catch(() => null);
                },
                properties: function (StbSettingsService, currentStb) {
                    return StbSettingsService.getSTBProperties(currentStb)
                        .catch(() => null);
                },
                channelList: (epgsService, $q) => {
                    const promise = $q.all([
                        epgsService.getChannels()
                    ])
                    .then(([channels]) => channels);
                    return promise;
                }
            },
            url: '/stb',
            template: '<ui-view/>'
        });

        $stateProvider.state('ovp.settings.stb.purchasePin', {
            redirectTo: redirect,
            data: {
                pageTitle: 'Set Top Settings - Purchase Pin'
            },
            url: '/purchasePin',
            controller: 'STBPurchasePinController',
            templateUrl: '/js/ovpApp/settings/stb-purchasePin/stb-purchasePin.html'
        });

        $stateProvider.state('ovp.settings.stb.parentalControls', {
            redirectTo: redirect,
            data: {
                pageTitle: 'Settings - STB Parental Controls'
            },
            url: '/parentalControls',
            resolve: {
                /* @ngInject */
                isPrimaryAccount: function (parentalControlsService) {
                    return parentalControlsService.isPrimaryAccount();
                }
            },
            component: 'stbParentalControls'
        });

        function redirect(transition) {
            const settingsStateService = transition.injector().get('settingsStateService');
            const $q = transition.injector().get('$q');
            const name = transition.to().name;
            let needsRedirect;
            if (name === 'ovp.settings') {
                needsRedirect = $q.resolve(true);
            } else {
                needsRedirect = settingsStateService.getState(name)
                    .then(state => (state && !state.enabled()));
            }

            return needsRedirect.then(redirect => {
                if (redirect) {
                    return settingsStateService.getFallbackState().state;
                }
            });
        }
    }
}());
