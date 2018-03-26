(function () {
    'use strict';

    angular.module('ovpApp.service.lineup', [
        'ovpApp.config'
    ])
    .service('lineupService', lineupService);

    /* @ngInject */
    function lineupService($http, $q, config, $rootScope) {
        let defer,
            service = {
                activate,
                getLineup
            };

        activate();
        return service;

        ///////////

        function activate() {

        }

        function getLineup() {
            if (!defer) {
                defer = $q.defer();
                $http({
                    method: 'GET',
                    url: `${config.piHost}/ipvs/api/smarttv/lineup/v1`,
                    withCredentials: true
                })
                .then(response => {
                    $rootScope.$emit('Session:lineup', response.data);
                    defer.resolve(response.data);
                }, () => {
                    defer.reject();
                    defer = null;
                });
            }

            return defer.promise;
        }
    }
}());
