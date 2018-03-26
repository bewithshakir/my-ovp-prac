/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.settings.stb.parentalControls', function () {
    'use strict';
    var $q, $rootScope, STBPCPinController, StbSettingsServiceMock, stbParentalControlsDialog, mockReturn;

    beforeEach(module('ovpApp.settings.stb.parentalControls.toggle'));
    beforeEach(inject(function (_$q_, _$rootScope_, _$componentController_, _StbSettingsService_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        mockReturn = function () {
            return $q.resolve(true);
        };
        StbSettingsServiceMock =  _StbSettingsService_; //This should be the mock;
        StbSettingsServiceMock.togglePCBlocking = function () {
            return mockReturn();
        };
        STBPCPinController = _$componentController_('stbParentalControlsToggle', {
            parentalControlsDialog: {
                withContext: function () {
                    return {
                        unlock: () => mockReturn(),
                        resetPIN: () => mockReturn()
                    }
                }
            }
        }, {
            stb: {
                macAddress: 'abcdef'
            },
            blockingEnabled: false
        });
        STBPCPinController.$onInit();
    }));

    it('should be defined and attache controller functions', function () {
        expect(STBPCPinController).toBeDefined();
        expect(STBPCPinController.togglePCBlocking).toBeDefined();
    });

    it('should toggle PC blocking false -> true', function (done) {
        STBPCPinController.pcBlockingEnabledForClient = false;
        STBPCPinController.togglePCBlocking().finally(() => {
            expect(STBPCPinController.pcBlockingEnabledForClient).toBe(true);
            done();
        });
        expect(STBPCPinController.pcBlockingEnabledForClient).toBe(true);
        $rootScope.$apply();
    });
    it('should toggle PC blocking true -> false', function (done) {
        STBPCPinController.pcBlockingEnabledForClient = true;
        STBPCPinController.togglePCBlocking().finally(() => {
            expect(STBPCPinController.pcBlockingEnabledForClient).toBe(false);
            done();
        });
        $rootScope.$apply();
    });

    it('should not toggle PC blocking false -> true', function (done) {
        mockReturn = function () {
            return $q.reject(false);
        };
        STBPCPinController.pcBlockingEnabledForClient = false;
        STBPCPinController.togglePCBlocking().finally(() => {
            expect(STBPCPinController.pcBlockingEnabledForClient).toBe(false);
            done();
        });
        expect(STBPCPinController.pcBlockingEnabledForClient).toBe(true);
        $rootScope.$apply();
    });
    it('should not toggle PC blocking true -> false', function (done) {
        mockReturn = function () {
            return $q.reject(false);
        };
        STBPCPinController.pcBlockingEnabledForClient = true;
        STBPCPinController.togglePCBlocking().finally(() => {
            expect(STBPCPinController.pcBlockingEnabledForClient).toBe(true);
            done();
        });
        $rootScope.$apply();
    });
});
