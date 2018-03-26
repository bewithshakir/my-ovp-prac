'use strict';

(function () {
    'use strict';
    deviceIdService.$inject = ["ovpStorage", "storageKeys", "config"];
    angular.module('ovpApp.legacy.deviceid', ['ovpApp.services.ovpStorage', 'ovpApp.config']).factory('deviceid', deviceIdService);

    /* @ngInject */
    function deviceIdService(ovpStorage, storageKeys, config) {
        var deviceId;

        initialize();

        return {
            get: function get() {
                return deviceId;
            }
        };

        /////////

        function initialize() {
            deviceId = ovpStorage.getItem(storageKeys.deviceId) || createDeviceId();
        }

        function createDeviceId() {
            var newDeviceId = config.randomGuid();
            ovpStorage.setItem(storageKeys.deviceId, newDeviceId);
            return newDeviceId;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/device-id-service.js.map
