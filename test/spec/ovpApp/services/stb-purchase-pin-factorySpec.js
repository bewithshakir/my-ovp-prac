/* globals inject, getJSONFixture */
/* jshint jasmine: true */

describe('ovpApp.services.stbSettingsService', function () {
    'use strict';
    var $httpBackend, $rootScope, $q, $timeout, StbSettingsServiceMock, StbPurchasePinFactory;

    beforeEach(module('ovpApp.services.stbPurchasePin'));
    beforeEach(module(function ($provide) {
        StbSettingsServiceMock = {
            setPreferences: jasmine.createSpy('setPreferences'),
            setDevice: jasmine.createSpy('setDevice'),
            getDevice: function (stb) {
                return {
                    then: cb => cb({'test': '111222333444', 'strTimestamp': 'mockstamp', stb})
                };
            },
            getPreferences: function (stb) {
                return { then: cb => cb({'testPrefs': '111222333444', stb}) }
            }
        };
        $provide.value('StbSettingsService', StbSettingsServiceMock);
    }));

    beforeEach(inject(function (_$injector_, _$rootScope_, _$httpBackend_, _$q_, _$timeout_, _StbPurchasePinFactory_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $timeout = _$timeout_;
        StbPurchasePinFactory = _StbPurchasePinFactory_;

        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
    }));

    afterEach(function () {
        // $timeout.verifyNoPendingTasks();
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
        expect(StbPurchasePinFactory).toBeDefined();
    });

    it('should return a constructor', function () {
        var sppf = StbPurchasePinFactory.create({macAddress: '00112233'});
        expect(sppf.isPINSet).toBeDefined();
    });

    it('should update the service when the setting purchase pin is toggled', function () {
        var stb = {
            macAddress: '0011223344'
        };
        var stbPin = StbPurchasePinFactory.create(stb);
        //Verify the promise is completed
        stbPin.setPIN('abracadabra');
        expect(StbSettingsServiceMock.setDevice)
            .toHaveBeenCalledWith(stb, {purchasePIN: 'abracadabra', strTimestamp: 'mockstamp'});
    });

    it('should ')

});
