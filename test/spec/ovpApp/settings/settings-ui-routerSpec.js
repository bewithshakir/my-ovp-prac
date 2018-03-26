describe('settings router', function () {
    'use strict';

    var $q,
        $state,
        settingsStateService,
        uiRouterTester,
        $httpBackend,
        $rootScope,
        mockSettingsStateService,
        mockEpgsService,
        mockFavoritesService;

    beforeEach(module('ovpApp.twctv.router'))
    beforeEach(module('ovpApp.settings.router'))
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));


    beforeEach(module(function($provide) {
        mockSettingsStateService = {
            getFallbackState: jasmine.createSpy()
                .and.returnValue({
                    state: 'ovp.settings.favorites'
                })
        };
        mockEpgsService = {
            getChannels: jasmine.createSpy()
        };
        mockFavoritesService = {
            syncFavoriteChannels: jasmine.createSpy()
        };

        $provide.value('settingsStateService', mockSettingsStateService);
        $provide.value('epgsService', mockEpgsService);
        $provide.value('favoritesService', mockFavoritesService);
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    beforeEach(inject(function ($injector, _$state_, _$httpBackend_, _$q_, _$rootScope_) {
        $q = _$q_;
        $state = _$state_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

        uiRouterTester = new UiRouterTester($injector);
    }));

    describe('redirects', function () {
        it('should redirect when going to root state', function () {
            mockSettingsStateService.getState = jasmine.createSpy()
                .and.returnValue($q.resolve({
                    enabled: () => true
                }));

            $httpBackend.expectGET('/js/ovpApp/settings/setting-tablist/setting-tablist.html')
                .respond(200);
            $httpBackend.expectGET('/js/ovpApp/settings/favorites/favorites.html')
                .respond(200);

            uiRouterTester.goToState('ovp.settings');
            expect($state.transition.to().name).toEqual('ovp.settings.favorites');
        });

        it('should redirect when going to a disabled state', function () {
            mockSettingsStateService.getState = jasmine.createSpy()
                .and.callFake(stateName => {
                    return $q.resolve({
                        enabled: () => stateName === 'ovp.settings.favorites'
                    });
                })

            $httpBackend.expectGET('/js/ovpApp/settings/setting-tablist/setting-tablist.html')
                .respond(200);
            $httpBackend.expectGET('/js/ovpApp/settings/favorites/favorites.html')
                .respond(200);

            uiRouterTester.goToState('ovp.settings.accessibility');
            expect($state.transition.to().name).toEqual('ovp.settings.favorites');
        });

        it('should not redirect when going to an enabled state', function () {
            mockSettingsStateService.getState = jasmine.createSpy()
                .and.returnValue($q.resolve({
                    enabled: () => true
                }));

            $httpBackend.expectGET('/js/ovpApp/settings/setting-tablist/setting-tablist.html')
                .respond(200);
            $httpBackend.expectGET('/js/ovpApp/settings/accessibility/accessibility.html')
                .respond(200);

            uiRouterTester.goToState('ovp.settings.accessibility');
            expect($state.transition.to().name).toEqual('ovp.settings.accessibility');
        });
    });
});
