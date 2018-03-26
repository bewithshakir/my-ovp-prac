'use strict';

(function () {
    'use strict';

    /**
     * RecentlyWatched service
     * Fetch recently watched assets from the bookmark service and then pull in the
     * reset of the required data to display the assets.
     */
    StoreService.$inject = ["$http", "$log", "entryService", "config", "NNSService", "delegateFactory"];
    angular.module('ovpApp.services.store', ['ovpApp.config', 'ovpApp.services.nns', 'ovpApp.services.entry', 'ovpApp.dataDelegate', 'ovpApp.services.parentalControlsService']).service('StoreService', StoreService);

    /* @ngInject */
    function StoreService($http, $log, entryService, config, NNSService, delegateFactory) {
        var vm = this;
        vm.getFrontdoor = getFrontdoor;
        vm.getCategory = getCategory;

        ///////////

        function getFrontdoor() {
            return entryService.forDefaultProfile().then(function (service) {
                var tvodUrl = config.piHost + service.vodStore();
                return $http({
                    url: tvodUrl,
                    withCredentials: true
                }).then(function (storeResults) {
                    var categories = storeResults.data.results;
                    return categories.map(delegateFactory.createInstance);
                }, function () {
                    throw 'Request Failed' + tvodUrl;
                });
            });
        }

        function getCategory(uri, startIndex, limit) {
            if (angular.isDefined(startIndex) && angular.isDefined(limit)) {
                uri += uri.indexOf('?') === -1 ? '?' : '&';
                uri = uri + 'start-index=' + startIndex + '&limit=' + limit;
            }
            return $http({
                url: config.piHost + uri,
                withCredentials: true
            }).then(function (result) {
                var data = result.data;
                data.results = data.results.map(function (partial) {
                    return delegateFactory.createInstance(partial);
                });
                return data;
            }, function (err) {
                throw 'Failed subcategory request ' + err;
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/store-service.js.map
