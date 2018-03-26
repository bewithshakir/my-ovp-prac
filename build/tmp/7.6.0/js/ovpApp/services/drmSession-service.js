'use strict';

(function () {
    'use strict';

    drmSessionService.$inject = ["$http", "$q", "config", "ovpStorage", "storageKeys"];
    angular.module('ovpApp.services.drmSessionService', ['ovpApp.config', 'ovpApp.services.ovpStorage']).factory('drmSessionService', drmSessionService);

    /* @ngInject */
    function drmSessionService($http, $q, config, ovpStorage, storageKeys) {
        return {
            getDRMSession: function getDRMSession() {
                var drmSession = ovpStorage.getItem(storageKeys.drmSessionKey);
                var getDRMDeferred = $q.defer();
                var delta = 60 * 60 * 1000; // Retry 1 hour before the expiration time
                if (!drmSession || drmSession && drmSession.expirationTimeSeconds && drmSession.expirationTimeSeconds * 1000 - delta < new Date().getTime()) {
                    $http({
                        method: 'GET',
                        url: config.piHost + config.smartTvApi + config.smartTv.adobeSession,
                        withCredentials: true
                    }).then(function (httpResponse) {
                        var response = httpResponse.data;
                        ovpStorage.setItem(storageKeys.drmSessionKey, response);
                        getDRMDeferred.resolve(response);
                    }, function (error) {
                        getDRMDeferred.reject(error);
                    });
                } else {
                    getDRMDeferred.resolve(drmSession);
                }
                return getDRMDeferred.promise;
            },
            reset: function reset() {
                ovpStorage.removeItem(storageKeys.drmSessionKey);
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/drmSession-service.js.map
