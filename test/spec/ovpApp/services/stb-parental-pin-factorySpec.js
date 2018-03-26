/* globals inject, getJSONFixture */
/* jshint jasmine: true */

describe('ovpApp.services.stbSettingsService', function () {
    'use strict';
    var StbSettingsServiceMock, StbPCPinFactory;

    beforeEach(module('ovpApp.services.stbPCPin'));
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

    beforeEach(inject(function (_StbPCPinFactory_) {
        StbPCPinFactory = _StbPCPinFactory_;
    }));

    it('should be defined', function () {
        expect(StbPCPinFactory).toBeDefined();
    });

    it('should return a constructor', function () {
        var sppf = StbPCPinFactory.create({macAddress: '00112233'});
        expect(sppf.isPINSet).toBeDefined();
    });

    it('should update the service when the setting parental pin is toggled', function () {
        var stb = {
            macAddress: '0011223344'
        };
        var stbPin = StbPCPinFactory.create(stb);
        //Verify the promise is completed
        stbPin.setPIN('abracadabra');
        expect(StbSettingsServiceMock.setDevice)
            .toHaveBeenCalledWith(stb, {parentalControlPIN: 'abracadabra', strTimestamp: 'mockstamp'});
    });
});
