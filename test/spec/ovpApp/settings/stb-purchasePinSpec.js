/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.settings.stbPurchasePin', function () {
    'use strict';
    var $scope, STBPurchasePinController, StbSettingsServiceMock, currentStb;

    beforeEach(module('ovpApp.settings.stbPurchasePin'));

    beforeEach(module(function ($provide) {
        /* @ngInject */

        $provide.factory('StbSettingsService', function ($q) {
            return {
                setPreferences: function (prefs) {
                    return $q.resolve(prefs);
                },
                setDevice: function (dev) {
                    return $q.resolve(dev);
                },
                getDevice: function (stb) {
                    return $q.resolve({'test': '111222333444', 'strTimestamp': 'mockstamp', stb});
                },
                getPreferences: function (stb) {
                    return $q.resolve({'testPrefs': '111222333444', stb});
                },
                purchasePinEnabled: function () {
                    return $q.resolve(false);
                },
                setEnablePurchasePINForClient: function (stb) {
                    return $q.resolve(stb);
                }
            };
        });
    }));

    beforeEach(inject(function (_$controller_, _$rootScope_, _StbSettingsService_) {
        $scope = _$rootScope_;
        currentStb = {
            macAddress: '0011223344aaa'
        };

        STBPurchasePinController = _$controller_('STBPurchasePinController', {
            $scope,
            currentStb,
            $state: { current: {}}
        });
        StbSettingsServiceMock =  _StbSettingsService_; //This should be the mock;
    }));

    it('should be defined and attache scope functions', function () {
        expect(STBPurchasePinController).toBeDefined();
        expect($scope.togglePinEnabled).toBeDefined();
        expect($scope.togglePurchasePinForStb).toBeDefined();
    });

    it('should set the purchase pin when the scope function is toggled', function () {
        spyOn(StbSettingsServiceMock, 'setEnablePurchasePINForClient').and.callThrough();
        $scope.togglePurchasePinForStb();
        expect(StbSettingsServiceMock.setEnablePurchasePINForClient).toHaveBeenCalled();
    });
});
