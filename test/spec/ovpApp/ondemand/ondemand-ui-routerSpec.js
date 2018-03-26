describe('ovpApp.ondemand', function () {
    'use strict';

    let $state, $scope, $rootScope, $controller, $q, $httpBackend, mockOauth,
        mockOndemandData = {}, mockLocationService = {}, defaultCategory = 'featured';

    beforeEach(function () {
        angular.mock.module('ovpApp.ondemand');
    });

    beforeEach(module(function ($provide) {
        $provide.value('profileService', mockProfileService);
        $provide.factory('OauthService', function ($q) {
            mockOauth = {
                isAuthenticated: jasmine.createSpy().and.returnValue($q.resolve(true))
            };
            return mockOauth;
        });
        $provide.factory('onDemandData', function($q) {
            mockOndemandData.formatCategoryNameForRoute = jasmine.createSpy()
                .and.callFake(name => name);
            mockOndemandData.defaultCategory = jasmine.createSpy()
                .and.callFake(() => {
                    return $q.resolve(defaultCategory)
                });
            mockOndemandData.getByUri = jasmine.createSpy()
                .and.returnValue($q.resolve({}));

            return mockOndemandData;
        });
        $provide.factory('locationService', function ($q) {
            mockLocationService.getLocation = jasmine.createSpy()
                .and.returnValue($q.resolve({
                    inUS: true
                }))
            return mockLocationService
        });
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    beforeEach(module(function ($stateProvider) {
        $stateProvider.state('ovp', { url: '/' });
    }));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$state_, _$q_, _$httpBackend_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $state = _$state_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
    }));

    describe('lazyloading', function () {
        it('should start with a placeholder state', function () {
            let placeholder = $state.get('ovp.ondemand.**');
            expect(placeholder).toBeDefined();
            expect(placeholder.url).toEqual('/ondemand');
            expect(placeholder.lazyLoad).toBeDefined();
        });

        function testTopLevelCategory(categories) {
            if (!angular.isArray(categories)) {
                categories = [categories];
            }
            mockOndemandData.getFrontDoor = jasmine.createSpy()
                .and.returnValue(categories);

            defaultCategory = categories[0].name;

            $state.go('ovp.ondemand')
            $rootScope.$apply();

            categories.forEach(({name, type, component}) => {
                // Test that the basic states exist
                expect($state.get('ovp.ondemand.**')).toEqual(null);
                expect($state.get('ovp.ondemand')).toBeDefined();
                expect($state.get('ovp.ondemand.playEpisodeWithDetails')).toBeDefined();
                expect($state.get('ovp.ondemand.playProduct')).toBeDefined();
                expect($state.get('ovp.ondemand.playCdvr')).toBeDefined();

                // Test that the top level category exists, and with the correct params
                let state = $state.get(`ovp.ondemand.${name}`);
                expect(state).toBeDefined();
                expect(state.name).toEqual(`ovp.ondemand.${name}`);
                expect(state.component).toEqual(component);
                expect(state.redirectTo).toBeDefined();
                expect(state.redirectTo.name).toEqual('restrictOutOfUs');
                expect(state.url.indexOf(`/${name}`)).toEqual(0);
                expect(state.data).toBeDefined();
                expect(state.data.pageTitle).toEqual(`On Demand - ${name}`)
            })
        }

        it('should replace the placeholder (pods_with_assets, standard name)', function () {
            testTopLevelCategory({
                name: 'featured',
                type: 'pods_with_assets',
                component: 'gallerySummaryPage'
            });

            let viewall = $state.get('ovp.ondemand.featured.viewall');
            expect(viewall).toBeDefined();
            expect(viewall.name).toEqual('ovp.ondemand.featured.viewall');
            expect(viewall.url).toEqual('/:name?page');
        });

        it('should replace the placeholder (pods_with_assets, abnormal name)', function () {
            testTopLevelCategory({
                name: 'abnormal',
                type: 'pods_with_assets',
                component: 'gallerySummaryPage'
            });

            let viewall = $state.get('ovp.ondemand.abnormal.viewall');
            expect(viewall).toBeDefined();
            expect(viewall.name).toEqual('ovp.ondemand.abnormal.viewall');
            expect(viewall.url).toEqual('/:name?page');
        });

        it('should replace the placeholder (media_list, movies)', function () {
            testTopLevelCategory({
                name: 'movies',
                type: 'media_list',
                component: 'ondemandCategory'
            });
        });

        it('should replace the placeholder (media_list, kids)', function () {
            testTopLevelCategory({
                name: 'kids',
                type: 'media_list',
                component: 'ondemandCategory'
            });
        });

        it('should replace the placeholder (media_list, abnormal name)', function () {
            testTopLevelCategory({
                name: 'prestidigitation',
                type: 'media_list',
                component: 'ondemandCategory'
            });
        });

        it('should replace the placeholder (network_list, standard name)', function () {
            testTopLevelCategory({
                name: 'networks',
                type: 'network_list',
                component: 'networkMainPage'
            });

            let network = $state.get('ovp.ondemand.networks.network');
            expect(network).toBeDefined();
            expect(network.name).toEqual('ovp.ondemand.networks.network');
            expect(network.url).toEqual('/:name?index&page');
        });

        it('should replace the placeholder (network_list, abnormal name)', function () {
            testTopLevelCategory({
                name: 'abnormal',
                type: 'network_list',
                component: 'networkMainPage'
            });

            let network = $state.get('ovp.ondemand.abnormal.network');
            expect(network).toBeDefined();
            expect(network.name).toEqual('ovp.ondemand.abnormal.network');
            expect(network.url).toEqual('/:name?index&page');
        });

        it('should replace the placeholder (typical categories)', function () {
            testTopLevelCategory([{
                name: 'featured',
                type: 'pods_with_assets',
                component: 'gallerySummaryPage'
            }, {
                name: 'tv shows',
                type: 'media_list',
                component: 'ondemandCategory'
            }, {
                name: 'movies',
                type: 'media_list',
                component: 'ondemandCategory'
            }, {
                name: 'kids',
                type: 'media_list',
                component: 'ondemandCategory'
            }, {
                name: 'networks',
                type: 'network_list',
                component: 'networkMainPage'
            }]);
        });
    });
});
