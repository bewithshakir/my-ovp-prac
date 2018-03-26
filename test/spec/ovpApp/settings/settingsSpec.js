/*jshint undef: false */
/*jshint nomen: true */
describe('ovpApp.settings', function () {
    'use strict';

    var $state,
        $scope,
        $rootScope,
        $controller,
        $q,
        settingsStateService,
        SettingsController;

    beforeEach(function () {
        angular.mock.module('ovpApp.settings');
    });

    beforeEach(module(function ($stateProvider) {
        $stateProvider.state('ovp', { url: '/' });
    }));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$state_, _settingsStateService_, _$q_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $state = _$state_;
        $q = _$q_;
        settingsStateService = _settingsStateService_;

        spyOn($state, 'go');

        SettingsController = _$controller_('SettingsController', {
            $scope: $scope,
            $rootScope: $rootScope,
            settingsStateService: settingsStateService,
            stbService: {
                currentStbSource: {
                    subscribe: () => {
                        return {
                            dispose: angular.noop
                        };
                    },
                    do: () => {
                        return {
                            skip: () => {
                                return {
                                    subscribe: () => {
                                        return {
                                            dispose: angular.noop
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
        });
    }));

    xdescribe('settings state', function () {
        beforeEach(
            inject([
                '$rootScope',
                '$state',
                '$injector',
                '$q',
                'settings.stateNames',
                'settingsStateService',
                'capabilitiesService',
                'stbService',
                'CAPABILITIES',
                function (
                    _$rootScope_,
                    _$state_,
                    _$injector_,
                    _$q_,
                    _stateNames_,
                    _settingsState_,
                    _capabilitiesService_,
                    _stbService_,
                    _CAPABILITIES_
                ) {
                    $scope = _$rootScope_.$new();
                    $state = _$state_;
                    $injector = _$injector_;
                    $q = _$q_;
                    stateNames = _stateNames_;
                    settingsState = _settingsState_;
                    capabilitiesService = _capabilitiesService_;
                    stbService = _stbService_;
                    CAPABILITIES = _CAPABILITIES_;
                }
            ])
        );

        afterEach(function () {
            $scope.$destroy();
        });

        describe('ctrl', function () {
            beforeEach(inject(function (_$controller_) {
                $controller = _$controller_;
            }));

            it('should enable favorites and default there if guide is enabled', function () {
                spyOn($state, 'go');

                $state.current.name = 'ovp.settings';
                runStateController({
                    hasGuide: true,
                    hasStbs: false
                });

                expect(settingsState.getState(stateNames.FAVORITES).enabled).toBe(true);
                expect($state.go).toHaveBeenCalledWith(
                    stateNames.FAVORITES,
                    {},
                    { location: 'replace' });
            });

            it('should disable favorites if guide is disabled', function () {
                runStateController({
                    hasGuide: false,
                    hasStbs: true
                });

                expect(settingsState.getState(stateNames.FAVORITES).enabled).toBe(false);
            });

            it('should default to parentalControls if favorites disabled', function () {
                spyOn($state, 'go');

                $state.current.name = 'ovp.settings';
                runStateController({
                    hasGuide: false,
                    hasStbs: true
                });

                expect($state.go).toHaveBeenCalledWith(
                    stateNames.PARENTAL_CONTROLS,
                    {},
                    { location: 'replace' });
            });

            it('should disable devices if there are no devices', function () {
                runStateController({
                    hasGuide: true,
                    hasStbs: false
                });

                expect(settingsState.getState(stateNames.DEVICES).enabled).toBe(false);
            });
        });

        xdescribe('resolve', function () {
            var $rootScope,
                $templateCache;

            beforeEach(inject(function (_$rootScope_, _$templateCache_) {
                $rootScope = _$rootScope_;
                $templateCache = _$templateCache_;
            }));

            it('should resolve true when has guide', function () {
                var mock = mockHasGuide(true);
                mockHasStbs(false);

                $templateCache.put('/js/ovpApp/settings/settings.html', '');

                $state.go('ovp.settings');
                $rootScope.$apply();

                expect(capabilitiesService.hasCapability).toHaveBeenCalledWith(CAPABILITIES.GUIDE);
                expect(mock.spy).toHaveBeenCalledWith(capabilitiesService);
                expect(mock.returnValue()).toBe(true);
            });

            it('should resolve false when no guide', function () {
                var mock = mockHasGuide(false);
                mockHasStbs(true);

                $templateCache.put('/js/ovpApp/settings/settings.html', '');

                $state.go('ovp.settings');
                $rootScope.$apply();

                expect(capabilitiesService.hasCapability).toHaveBeenCalledWith(CAPABILITIES.GUIDE);
                expect(mock.spy).toHaveBeenCalledWith(capabilitiesService);
                expect(mock.returnValue()).toBe(false);
            });

            it('should resolve false when hasCapability fails', function () {
                var mock = mockHasGuide(null, true);
                mockHasStbs(true);

                $templateCache.put('/js/ovpApp/settings/settings.html', '');

                $state.go('ovp.settings');
                $rootScope.$apply();

                expect(capabilitiesService.hasCapability).toHaveBeenCalledWith(CAPABILITIES.GUIDE);
                expect(mock.spy).toHaveBeenCalledWith(capabilitiesService);
                expect(mock.returnValue()).toBe(false);
            });

            it('should resolve true when there are stbs', function () {
                var mock = mockHasStbs([{}]);
                mockHasGuide(false);

                $templateCache.put('/js/ovpApp/settings/settings.html', '');

                $state.go('ovp.settings');
                $rootScope.$apply();

                expect(stbService.getSTBs).toHaveBeenCalled();
                expect(mock.spy).toHaveBeenCalledWith(stbService);
                expect(mock.returnValue()).toBe(true);
            });

            it('should resolve false when there are no stbs', function () {
                var mock = mockHasStbs([]);
                mockHasGuide(false);

                $templateCache.put('/js/ovpApp/settings/settings.html', '');

                $state.go('ovp.settings');
                $rootScope.$apply();

                expect(stbService.getSTBs).toHaveBeenCalled();
                expect(mock.spy).toHaveBeenCalledWith(stbService);
                expect(mock.returnValue()).toBe(false);
            });

            it('should resolve false when fetching stbs fails', function () {
                var mock = mockHasStbs(null, true);
                mockHasGuide(false);

                $templateCache.put('/js/ovpApp/settings/settings.html', '');

                $state.go('ovp.settings');
                $rootScope.$apply();

                expect(stbService.getSTBs).toHaveBeenCalled();
                expect(mock.spy).toHaveBeenCalledWith(stbService);
                expect(mock.returnValue()).toBe(false);
            });
        });
    });

    /*
     * run the default state controller
     *
     * @param {Object} ex: { hasGuide: true, hasStbs: true }
     */
    function runStateController(options) {
        $controller('SettingsStateCtrl', {
            $scope: $scope,
            $state: $state,
            'settings.stateNames': stateNames,
            'settingsStateServer': settingsState,
            hasGuide: options.hasGuide,
            hasStbs: options.hasStbs
        });
    }

    function mockHasGuide(hasGuide, shouldFail) {
        var settingsState = $state.get('ovp.settings'),
            spyObj = {
                hasGuide: settingsState.resolve.hasGuide[1]
            },
            returnValue;

        spyOn(spyObj, 'hasGuide').and.callThrough();

        settingsState.resolve.hasGuide[1] = function () {
            var promise = spyObj.hasGuide(capabilitiesService);

            promise.then(function (value) {
                returnValue = value;
            });

            return promise;
        };

        spyOn(capabilitiesService, 'hasCapability').and.callFake(function (featureName) {
            var defer = $q.defer();

            if (shouldFail) {
                defer.reject();
            } else if (featureName === CAPABILITIES.GUIDE) {
                defer.resolve(hasGuide);
            } else {
                defer.resolve(false);
            }

            return defer.promise;
        });

        return {
            spy: spyObj.hasGuide,
            returnValue: function () {
                return returnValue;
            }
        };
    }

    function mockHasStbs(stbs, shouldFail) {
        var settingsState = $state.get('ovp.settings'),
            spyObj = {
                hasStbs: settingsState.resolve.hasStbs[1]
            },
            returnValue;

        spyOn(spyObj, 'hasStbs').and.callThrough();

        settingsState.resolve.hasStbs[1] = function () {
            var promise = spyObj.hasStbs(stbService);

            promise.then(function (value) {
                returnValue = value;
            });

            return promise;
        };

        spyOn(stbService, 'getSTBs').and.callFake(function () {
            var defer = $q.defer();

            if (shouldFail) {
                defer.reject();
            } else {
                defer.resolve(stbs);
            }

            return defer.promise;
        });

        return {
            spy: spyObj.hasStbs,
            returnValue: function () {
                return returnValue;
            }
        };
    }
});
