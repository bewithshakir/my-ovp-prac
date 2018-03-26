'use strict';

(function () {
    'use strict';

    templateRequest.$inject = ["$http", "$compile", "$q", "$templateCache"];
    angular.module('ovpApp.services.templateRequest', [])

    // This is a place holder for the $templateRequest that is to be
    // released in version 1.3 of angular.
    // TODO: we now have angular 1.4+. I assume this file is now obsolete?
    .factory('templateRequest', templateRequest);

    function templateRequest($http, $compile, $q, $templateCache) {
        var inProgressRequests = {};
        return function (templateName) {

            var defer = $q.defer();

            if (angular.isUndefined($templateCache.get(templateName))) {

                if (templateName in inProgressRequests) {
                    return inProgressRequests[templateName];
                } else {
                    inProgressRequests[templateName] = defer.promise;
                    $http({
                        method: 'GET',
                        url: templateName
                    }).then(function (response) {
                        var data = response.data;
                        $templateCache.put(templateName, data);
                        defer.resolve($compile(data));
                    }, function () {
                        defer.reject();
                    })['finally'](function () {
                        delete inProgressRequests[templateName];
                    });
                }
            } else {
                defer.resolve($compile($templateCache.get(templateName)));
            }

            return defer.promise;
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/template-request.js.map
