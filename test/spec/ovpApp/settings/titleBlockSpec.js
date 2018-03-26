/* globals inject */
/* jshint jasmine: true */
describe('ovpApp.settings.stb.parentalControls.titleBlock', function () {
    'use strict';

    let scope, element, controller, $componentController, $q, $httpBackend, mockstbSettingsService, $rootScope;

    beforeEach(module('test.templates'));
    beforeEach(module('ovpApp.settings.stb.parentalControls.titleBlock'));

    beforeEach(module(function ($provide) {
        mockstbSettingsService = {};
        $provide.value('StbSettingsService', mockstbSettingsService);
    }));

    beforeEach(inject(function(_$rootScope_, $compile, _$componentController_, _$q_, _$httpBackend_) {
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        mockstbSettingsService.titleBlockingEnabled = function () {
            return {
                then: angular.bind(this, function (cb) {
                    cb(true);
                })
        }};
        mockstbSettingsService.setTitleBlockForClient = jasmine.createSpy().and.callFake((stb, setting) => $q.resolve(setting));

        scope = $rootScope.$new();
        scope.stb = {macAddress: '0011223344'};
        element = angular.element("<stb-title-block stb='{macAddress: 0011223344}'></stb-title-block >");
        element = $compile(element)(scope);

        scope.$apply();
    }));

    afterEach(function () {
        element = null;
        scope = null;
    });

    it('should set titleBlockingEnabledForClient', function () {
        controller = $componentController('stbTitleBlock', {
            StbSettingsService: mockstbSettingsService,
            stb: scope.stb
        });
        controller.$onInit();
        expect(controller.titleBlockingEnabledForClient).toEqual(true);
    });

    it('should toggle the value for titleBlocking', function () {
        controller = $componentController('stbTitleBlock', {
            StbSettingsService: mockstbSettingsService,
            stb: scope.stb
        });
        controller.$onInit();
        controller.toggleTitleBlocking();
        scope.$apply();
        expect(controller.titleBlockingEnabledForClient).toEqual(true);
    });

});
