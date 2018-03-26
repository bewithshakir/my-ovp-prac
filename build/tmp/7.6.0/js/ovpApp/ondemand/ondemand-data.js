'use strict';

(function () {
    'use strict';

    onDemandData.$inject = ["entryService", "rxhttp", "config", "delegateFactory", "$q"];
    angular.module('ovpApp.ondemand.data', ['ovpApp.dataDelegate', 'ovpApp.services.rxUtils', 'ovpApp.services.entry']).factory('onDemandData', onDemandData);

    /* @ngInject */
    function onDemandData(entryService, rxhttp, config, delegateFactory, $q) {
        var categories = undefined;

        var service = {
            formatCategoryNameForRoute: formatCategoryNameForRoute,
            defaultCategory: defaultCategory,
            getFrontDoor: getFrontDoor,
            getByUri: getByUri,
            clearCache: clearCache
        };
        return service;

        ////////////////

        function formatCategoryNameForRoute(name) {
            return name.toLowerCase().replace(/ /g, '_');
        }

        function defaultCategory() {
            return getFrontDoor().then(function (categories) {
                return formatCategoryNameForRoute(categories[0].name);
            });
        }

        function getFrontDoor() {
            if (categories) {
                return $q.resolve(categories);
            } else {
                return entryService.forDefaultProfile().then(function (services) {
                    return rxhttp.get(config.piHost + services.vodPortal(), { withCredentials: true }).retry(3).map(function (response) {
                        return response.data.results.map(delegateFactory.createInstance);
                    })['do'](function (cat) {
                        return categories = cat;
                    }).toPromise($q);
                });
            }
        }

        function clearCache() {
            categories = undefined;
        }

        function getByUri(uri, page) {
            if (angular.isDefined(page) && page >= 1) {
                var startIndex = (page - 1) * config.vodAssetsPerPage;
                uri = uri + '&start-index=' + startIndex + '&limit=' + config.vodAssetsPerPage;
            }

            return rxhttp.get(config.piHost + uri, { withCredentials: true }).retry(3).map(function (response) {
                return delegateFactory.createInstance(response.data);
            }).toPromise($q);
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/ondemand/ondemand-data.js.map
