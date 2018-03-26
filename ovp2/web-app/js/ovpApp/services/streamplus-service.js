(() => {
    'use strict';

    angular.module('ovpApp.services.streamPlusService', [
        'ovpApp.config'
    ])
    .factory('streamPlusService', streamPlusService);

    /* @ngInject */
    function streamPlusService($http, $q, config) {
        let service = {
            isStreamPlusEligible
        };

        return service;

        ///////////////////

        function isStreamPlusEligible(bypassRefresh=false) {
            if (config.streamPlus.enabled) {
                return $http({
                    method: 'GET',
                    url: config.piHost + config.streamPlus.eligible,
                    withCredentials: true,
                    bypassRefresh: bypassRefresh,
                    cache: true
                }).then(() => true);
            } else {
                return $q.reject();
            }
        }
    }
})();
