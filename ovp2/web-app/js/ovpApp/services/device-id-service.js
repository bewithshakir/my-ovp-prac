(function () {
    'use strict';
    angular
        .module('ovpApp.legacy.deviceid', [
            'ovpApp.services.ovpStorage',
            'ovpApp.config'
        ])
        .factory('deviceid', deviceIdService);

    /* @ngInject */
    function deviceIdService(ovpStorage, storageKeys, config) {
        var deviceId;

        initialize();

        return {
            get: function () {
                return deviceId;
            }
        };

        /////////

        function initialize() {
            deviceId = ovpStorage.getItem(storageKeys.deviceId) || createDeviceId();
        }

        function createDeviceId() {
            let newDeviceId = config.randomGuid();
            ovpStorage.setItem(storageKeys.deviceId, newDeviceId);
            return newDeviceId;
        }
    }
})();
