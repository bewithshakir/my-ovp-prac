/* globals inject, getJSONFixture */
/* jshint jasmine: true */

describe('ovpApp.services.stbSettingsService', function () {
    'use strict';
    var $httpBackend, $rootScope, $q, $timeout, StbSettingsService, stbService;


    beforeEach(module('ovpApp.services.stbSettingsService'));

    beforeEach(inject(function (_$injector_, _$rootScope_, _$httpBackend_, _StbSettingsService_, _$q_, _$timeout_,
        _stbService_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        StbSettingsService = _StbSettingsService_;
        $q = _$q_;
        $timeout = _$timeout_;
        stbService = _stbService_;

        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
    }));

    afterEach(function () {
        // $timeout.verifyNoPendingTasks();
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
        expect(StbSettingsService).toBeDefined();
    });

    it('should get the preferences and merge defaults', function () {
        var stbResponse = {
            macAddress: '0011223344'
        };
        StbSettingsService.getPreferences(stbResponse).then(preferences => {
            expect(preferences.purchases.blockingEnabled).toBe(true);
            expect(preferences._id).toBe('41ca100c-ffa6-4f0a-9541-10b58269700e');
        });
        $httpBackend.expectGET('/spp/v1/preferences/0011223344').respond(getJSONFixture('stb/preferences.json'));
        $httpBackend.flush();

        StbSettingsService.getPreferences(stbResponse).then(prefs => {
            expect(prefs._id).toBeDefined();
        });
    });

    it('should update the service when the setting purchase pin is toggled', function () {
        //Verify the promise is completed
        var setSpy = jasmine.createSpy('setSpy'),
            stb = {
                macAddress: "1234567"
            };

        StbSettingsService.setEnablePurchasePINForClient(stb, true).then(() => {
            setSpy();
        });

        $httpBackend.expectGET('/spp/v1/preferences/1234567')
            .respond({
                strTimestamp: 'somestringthatcantbeconverted',
                purchases: {
                    blockingEnabled: false
                }
            });


        $httpBackend.expectPUT('/spp/v1/preferences/1234567', function (data) {
            data = JSON.parse(data);
            if (data.strTimestamp && data.purchases && data.strTimestamp === 'somestringthatcantbeconverted') {
                return true;
            }
        }).respond({
            strTimestamp: 'somestringthatcantbeconverted',
            purchases: {
                blockingEnabled: true
            }
        });
        $httpBackend.flush();

        StbSettingsService.setEnablePurchasePINForClient(stb, false).then(() => {
            setSpy();
        });

        $httpBackend.expectPUT('/spp/v1/preferences/1234567')
            .respond({
                strTimestamp: 'somestringthatcantbeconverted',
                purchases: {
                    blockingEnabled: true
                }
            });
        $httpBackend.flush();
    });

    it('should get the device data related to the passed set top box', function () {
        StbSettingsService.getDevice({macAddress: '0011223344'}).then(dev => {
            expect(dev).toBeDefined();
            expect(dev.purchasePIN).toBe('0000');
        });

        $httpBackend.expectGET('/spp/v1/devices/0011223344').respond(getJSONFixture('stb/devices.json'));
        $httpBackend.flush();

        StbSettingsService.getDevice({macAddress: '0011223344'}).then(dev => {
            expect(dev).toBeDefined();
            expect(dev.purchasePIN).toBe('0000');
        });

        StbSettingsService.setDevice({macAddress: '0011223344'}, {purchasePIN: '0000'});

        $httpBackend.expectPUT('/spp/v1/devices/0011223344', function (rawData) {
            var data = JSON.parse(rawData);
            return data.strTimestamp && data.purchasePIN;
        }).respond({success: 'successmessage'});
        $httpBackend.flush();
    });

    it('should get the purchase pin setting', function () {
        StbSettingsService.purchasePinEnabled({macAddress: '0011223344'}).then(dev => {
            expect(dev).toBe(true);
        });

        $httpBackend.expectGET('/spp/v1/preferences/0011223344').respond(getJSONFixture('stb/preferences.json'));
        $httpBackend.flush();

    });

    it('should get the title Block setting', function () {
        StbSettingsService.titleBlockingEnabled({macAddress: '0011223344'}).then(dev => {
            expect(dev).toBe(true);
        });

        $httpBackend.expectGET('/spp/v1/preferences/0011223344').respond(getJSONFixture('stb/preferences.json'));
        $httpBackend.flush();

    });

    it('should get the share in progress list setting', function () {
        StbSettingsService.shareInProgressListEnabled({macAddress: '0011223344'}).then(dev => {
            expect(dev).toBe(true);
        });

        $httpBackend.expectGET('/spp/v1/preferences/0011223344').respond(getJSONFixture('stb/preferences.json'));
        $httpBackend.flush();

    });

    it('should update the service when titleBlocking is toggled', function () {
        //Verify the promise is completed
        var setSpy = jasmine.createSpy('setSpy'),
            stb = {
                macAddress: "123456"
            };

        StbSettingsService.setTitleBlockForClient(stb, false).then(() => {
            setSpy();
        });

        $httpBackend.expectGET('/spp/v1/preferences/123456')
            .respond({
                strTimestamp: 'somestringthatcantbeconverted',
                parentalControls: {
                    titleBlock: true
                }
            });

        $httpBackend.expectPUT('/spp/v1/preferences/123456', function (data) {
            data = JSON.parse(data);
            if (data.strTimestamp && data.parentalControls && data.strTimestamp === 'somestringthatcantbeconverted') {
                return true;
            }
        }).respond({
            strTimestamp: 'somestringthatcantbeconverted',
            parentalControls: {
                titleBlock: false
            }
        });

        $httpBackend.flush();

        StbSettingsService.setTitleBlockForClient(stb, true).then(() => {
            setSpy();
        });

        $httpBackend.expectPUT('/spp/v1/preferences/123456')
            .respond({
                strTimestamp: 'somestringthatcantbeconverted',
                parentalControls: {
                    titleBlock: true
                }
            });
        $httpBackend.flush();
    });

    it('should update the service when sharing in Progress list is toggled', function () {
        //Verify the promise is completed
        var setSpy = jasmine.createSpy('setSpy'),
            stb = {
                macAddress: "123456"
            };

        StbSettingsService.setShareInProgressListForClient(stb, false).then(() => {
            setSpy();
        });
        $httpBackend.expectGET('/spp/v1/preferences/123456')
            .respond({
                strTimestamp: 'somestringthatcantbeconverted',
                bookmarks: {
                    sharingEnabled: true
                }
            });

        $httpBackend.expectPUT('/spp/v1/preferences/123456', function (data) {
            data = JSON.parse(data);
            if (data.strTimestamp && data.bookmarks && data.strTimestamp === 'somestringthatcantbeconverted') {
                return true;
            }
        }).respond({
            strTimestamp: 'somestringthatcantbeconverted',
            bookmarks: {
                sharingEnabled: false
            }
        });

        $httpBackend.flush();

        StbSettingsService.setShareInProgressListForClient(stb, true).then(() => {
            setSpy();
        });

        $httpBackend.expectPUT('/spp/v1/preferences/123456')
            .respond({
                strTimestamp: 'somestringthatcantbeconverted',
                bookmarks: {
                    sharingEnabled: false
                }
            });
        $httpBackend.flush();
    });
});
