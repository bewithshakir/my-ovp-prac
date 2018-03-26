/* globals inject */
/* jshint jasmine: true */
describe('ovpApp.settings.stb.parentalControls.shareInProgressList', function () {
    'use strict';

    let scope, element, controller, $componentController, $q, $httpBackend, mockstbSettingsService, $rootScope;

    beforeEach(module('test.templates'));
    beforeEach(module('ovpApp.settings.stb.parentalControls.shareInProgressList'));

    beforeEach(module(function ($provide) {
        mockstbSettingsService = {};
        $provide.value('StbSettingsService', mockstbSettingsService);
    }));

    beforeEach(inject(function(_$rootScope_, $compile, _$componentController_, _$q_, _$httpBackend_) {
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        mockstbSettingsService.shareInProgressListEnabled = function () {
            return {
                then: angular.bind(this, function (cb) {
                    cb(true);
                })
        }};
        mockstbSettingsService.setShareInProgressListForClient = jasmine.createSpy()
            .and.callFake((stb, setting) => $q.resolve(setting));

        scope = $rootScope.$new();
        scope.stb = {macAddress: '0011223344'};
        element = angular.element("<stb-share-in-progress-list stb='{macAddress: 0011223344}'></stb-share-in-progress-list>");
        element = $compile(element)(scope);

        scope.$apply();
    }));

    afterEach(function () {
        element = null;
        scope = null;
    });

    it('should set shareInProgressListEnabledForClient', function () {
        controller = $componentController('stbShareInProgressList', {
            StbSettingsService: mockstbSettingsService,
            stb: scope.stb
        });
        controller.$onInit();
        expect(controller.shareInProgressListEnabledForClient).toEqual(true);
    });

    it('should toggle the value for shareInProgressList', function () {
        controller = $componentController('stbShareInProgressList', {
            StbSettingsService: mockstbSettingsService,
            stb: scope.stb
        });
        controller.$onInit();
        controller.toggleShareInProgressList();
        scope.$apply();
        expect(controller.shareInProgressListEnabledForClient).toEqual(true);
    });

});
