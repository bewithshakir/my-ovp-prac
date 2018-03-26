'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';
    config.$inject = ["$stateProvider"];
    angular.module('ovpApp.settings.router', ['ui.router', 'ovpApp.settings.settingsStateService', 'ovpApp.services.purchasePinService', 'ovpApp.services.errorCodes', 'ovpApp.messages', 'ovpApp.settings.devices', 'ovpApp.settings.parentalControls', 'ovpApp.settings.stb.parentalControls', 'ovpApp.settings.stb.parentalControls.titleBlock', 'ovpApp.settings.stb.parentalControls.timeBlock', 'ovpApp.settings.stb.parentalControls.shareInProgressList', 'ovpApp.settings.stb.parentalControls.contentBlock', 'ovpApp.settings.parentalControls.channelBlock', 'ovpApp.settings.stb.receiverUnavailable', 'ovpApp.settings.favorites', 'ovpApp.settings.purchasePin', 'ovpApp.settings.stbPurchasePin', 'ovpApp.settings.accessibility', 'ovpApp.services.stbService', 'ovpApp.config']).config(config);

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
                stb: ["stbService", function stb(stbService) {
                    return stbService.getCurrentStb();
                }]
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
                channels: ["epgsService", "favoritesService", "$q", "$rootScope", function channels(epgsService, favoritesService, $q, $rootScope) {
                    var promise = $q.all([epgsService.getChannels(), favoritesService.syncFavoriteChannels()]).then(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 1);

                        var channels = _ref2[0];
                        return channels;
                    });

                    $rootScope.$broadcast('message:loading', promise);
                    return promise;
                }]
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
                purchaseSwitchFlag: ["purchasePinService", "$log", "$rootScope", "$state", "messages", "errorCodesService", function purchaseSwitchFlag(purchasePinService, $log, $rootScope, $state, messages, errorCodesService) {
                    return purchasePinService.isPINSet().then(function (pinIsSet) {
                        var hasPin = pinIsSet;
                        if (!hasPin) {
                            return false;
                        } else {
                            return purchasePinService.isPurchasePINDisabledForClient().then(function (result) {
                                return !result;
                            });
                        }
                    }, function (error) {
                        $log.error(error);
                        $rootScope.$broadcast('message:growl', errorCodesService.getMessageForCode('WGE-1001'));
                        $rootScope.$broadcast('pageChangeComplete', $state.current);
                    });
                }]
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
                currentStb: ["stbService", "$q", "$state", function currentStb(stbService, $q, $state) {
                    return stbService.getCurrentStb().then(function (stb) {
                        if (!stb) {
                            $state.go('ovp.livetv');
                            return $q.reject('No available STB in this account (tried to route to stb settings)');
                        } else {
                            return stb;
                        }
                    });
                }],
                /* @ngInject */
                preferences: ["StbSettingsService", "currentStb", function preferences(StbSettingsService, currentStb) {
                    return StbSettingsService.getPreferences(currentStb, true)['catch'](function () {
                        return null;
                    });
                }],
                properties: ["StbSettingsService", "currentStb", function properties(StbSettingsService, currentStb) {
                    return StbSettingsService.getSTBProperties(currentStb)['catch'](function () {
                        return null;
                    });
                }],
                channelList: ["epgsService", "$q", function channelList(epgsService, $q) {
                    var promise = $q.all([epgsService.getChannels()]).then(function (_ref3) {
                        var _ref32 = _slicedToArray(_ref3, 1);

                        var channels = _ref32[0];
                        return channels;
                    });
                    return promise;
                }]
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
                isPrimaryAccount: ["parentalControlsService", function isPrimaryAccount(parentalControlsService) {
                    return parentalControlsService.isPrimaryAccount();
                }]
            },
            component: 'stbParentalControls'
        });

        function redirect(transition) {
            var settingsStateService = transition.injector().get('settingsStateService');
            var $q = transition.injector().get('$q');
            var name = transition.to().name;
            var needsRedirect = undefined;
            if (name === 'ovp.settings') {
                needsRedirect = $q.resolve(true);
            } else {
                needsRedirect = settingsStateService.getState(name).then(function (state) {
                    return state && !state.enabled();
                });
            }

            return needsRedirect.then(function (redirect) {
                if (redirect) {
                    return settingsStateService.getFallbackState().state;
                }
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/settings/settings-ui-router.js.map
