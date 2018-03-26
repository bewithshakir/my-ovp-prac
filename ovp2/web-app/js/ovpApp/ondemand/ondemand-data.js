(function () {
    'use strict';

    angular
        .module('ovpApp.ondemand.data', [
            'ovpApp.dataDelegate',
            'ovpApp.services.rxUtils',
            'ovpApp.services.entry'
        ])
        .factory('onDemandData', onDemandData);

    /* @ngInject */
    function onDemandData(entryService, rxhttp, config, delegateFactory, $q) {
        let categories;

        var service = {
            formatCategoryNameForRoute,
            defaultCategory,
            getFrontDoor,
            getByUri,
            clearCache
        };
        return service;

        ////////////////

        function formatCategoryNameForRoute(name) {
            return name.toLowerCase().replace(/ /g, '_');
        }

        function defaultCategory() {
            return getFrontDoor()
                .then(categories => formatCategoryNameForRoute(categories[0].name));
        }

        function getFrontDoor() {
            if (categories) {
                return $q.resolve(categories);
            } else {
                return entryService.forDefaultProfile()
                    .then(services =>
                        rxhttp.get(config.piHost + services.vodPortal(),
                            {withCredentials: true})
                            .retry(3)
                            .map(response => response.data.results.map(delegateFactory.createInstance))
                            .do(cat => categories = cat)
                            .toPromise($q)
                    );
            }
        }

        function clearCache() {
            categories = undefined;
        }

        function getByUri(uri, page) {
            if (angular.isDefined(page) && page >= 1) {
                const startIndex = (page - 1) * config.vodAssetsPerPage;
                uri = `${uri}&start-index=${startIndex}&limit=${config.vodAssetsPerPage}`;
            }

            return rxhttp.get(config.piHost + uri, {withCredentials: true})
                .retry(3)
                .map(response => delegateFactory.createInstance(response.data))
                .toPromise($q);
        }
    }
})();
