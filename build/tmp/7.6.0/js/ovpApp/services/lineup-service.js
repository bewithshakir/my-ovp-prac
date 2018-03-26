'use strict';

(function () {
    'use strict';

    lineupService.$inject = ["$http", "$q", "config", "$rootScope"];
    angular.module('ovpApp.service.lineup', ['ovpApp.config']).service('lineupService', lineupService);

    /* @ngInject */
    function lineupService($http, $q, config, $rootScope) {
        var defer = undefined,
            service = {
            activate: activate,
            getLineup: getLineup
        };

        activate();
        return service;

        ///////////

        function activate() {}

        function getLineup() {
            if (!defer) {
                defer = $q.defer();
                $http({
                    method: 'GET',
                    url: config.piHost + '/ipvs/api/smarttv/lineup/v1',
                    withCredentials: true
                }).then(function (response) {
                    $rootScope.$emit('Session:lineup', response.data);
                    defer.resolve(response.data);
                }, function () {
                    defer.reject();
                    defer = null;
                });
            }

            return defer.promise;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/lineup-service.js.map
