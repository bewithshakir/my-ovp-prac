'use strict';

(function () {
    'use strict';

    streamPlusService.$inject = ["$http", "$q", "config"];
    angular.module('ovpApp.services.streamPlusService', ['ovpApp.config']).factory('streamPlusService', streamPlusService);

    /* @ngInject */
    function streamPlusService($http, $q, config) {
        var service = {
            isStreamPlusEligible: isStreamPlusEligible
        };

        return service;

        ///////////////////

        function isStreamPlusEligible() {
            var bypassRefresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (config.streamPlus.enabled) {
                return $http({
                    method: 'GET',
                    url: config.piHost + config.streamPlus.eligible,
                    withCredentials: true,
                    bypassRefresh: bypassRefresh,
                    cache: true
                }).then(function () {
                    return true;
                });
            } else {
                return $q.reject();
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/streamplus-service.js.map
