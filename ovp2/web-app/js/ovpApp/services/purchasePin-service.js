/* globals md5 */
(function () {
    'use strict';

    angular.module('ovpApp.services.purchasePinService', [
        'ovpApp.config',
        'ovpApp.services.parentalControlsService',
        'ovpApp.services.ovpStorage'
    ])
    .factory('purchasePinService', purchasePinService);

    /* @ngInject */
    function purchasePinService($http, $q, $rootScope, $timeout, config,
        parentalControlsService, ovpStorage, storageKeys) {

        var DISABLE_TRUE = '1234ABcDMnPXyz$#!@&*', // true alias to disable pin.
            pinSetDefer,
            service = {
                isPINSet: function () {
                    if (!pinSetDefer) {
                        pinSetDefer = $q.defer();
                        $http({
                            method: 'GET',
                            url: config.purchasePin.purchasePINUrl(),
                            withCredentials: true
                        }).then(function (response) {
                            if (response.status !== 200) {
                                pinSetDefer.reject(response);
                                return;
                            }
                            pinSetDefer.resolve(true);
                            pinSetDefer = null;
                        }, function (error) {
                            if (error.status !== 404) {
                                pinSetDefer.reject(error);
                                return;
                            }
                            pinSetDefer.resolve(false);
                            pinSetDefer = null;
                        });
                    }
                    return pinSetDefer.promise;
                },
                isPurchasePINDisabledForClient: function () {
                    var disabled = ovpStorage.getItem(storageKeys.purchasePinDisabled, true);

                    if (disabled === null || disabled === undefined) {
                        // If 'ovpApp.purchasePin.' + username + '.disabled'
                        // is not found in localStorage,
                        // do not enable purchase Pin for the user
                        $q.resolve(false);
                    }

                    return $q.resolve(md5(DISABLE_TRUE) === disabled);
                },
                validatePIN: function (pin) {
                    var pinJson = {purchasePIN: md5(pin)};
                    return $http({
                        method: 'POST',
                        url: config.purchasePin.validatePurchasePINUrl(),
                        data: JSON.stringify(pinJson),
                        withCredentials: true,
                        bypassRefresh: true //Do not attempt to refresh credentials on a 401 or 403
                    }).then(function () {
                        service.savePINLocally(pin);
                    });
                },
                setPIN: function (pin, password) {
                    let postData = {purchasePIN: pin};
                    if (password !== undefined && password !== '') {
                        postData.adminPassword = password;
                    }
                    return $http({
                        method: 'POST',
                        url: config.purchasePin.purchasePINUrl(),
                        data: JSON.stringify(postData),
                        withCredentials: true
                    }).then(() => {
                        //needs a delay for pinSet
                        $timeout(function () {
                            service.savePINLocally(pin);
                        }, 1000);
                    });
                },
                isPrimaryAccount: function () {
                    return parentalControlsService.isPrimaryAccount();
                },
                shouldSetDefaults: function () {
                    // this is just a promise wrapper to make
                    // consistent interface across purchase pin and PC APIs,
                    // so that pin-entry.js can be reused
                    // and require minimum changes to support both services.
                    var defer = $q.defer();
                    defer.resolve(false);
                    return defer.promise;
                },
                disablePurchasePINForClient: function () {
                    ovpStorage.setItem(storageKeys.purchasePinDisabled, DISABLE_TRUE, {key: true,
                        value: true
                    });
                    $rootScope.$emit('PurchasePin:updated');
                },
                enablePurchasePINForClient: function () {
                    ovpStorage.setItem(storageKeys.purchasePinDisabled, 'false', {key: true,
                        value: true
                    });
                    $rootScope.$emit('PurchasePin:updated');
                },
                savePINLocally: function (pin) {
                    ovpStorage.setItem(storageKeys.purchasePinLocal, md5(pin));
                },
                getLocalPin: function () {
                    return ovpStorage.getItem(storageKeys.purchasePinLocal);
                }
            };

        return service;
    }
}());
