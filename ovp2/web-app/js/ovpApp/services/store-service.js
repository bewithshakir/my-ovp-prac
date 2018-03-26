(function () {
    'use strict';

    /**
     * RecentlyWatched service
     * Fetch recently watched assets from the bookmark service and then pull in the
     * reset of the required data to display the assets.
     */
    angular.module('ovpApp.services.store', [
        'ovpApp.config',
        'ovpApp.services.nns',
        'ovpApp.services.entry',
        'ovpApp.dataDelegate',
        'ovpApp.services.parentalControlsService'
    ])
    .service('StoreService', StoreService);


    /* @ngInject */
    function StoreService($http, $log, entryService, config, NNSService, delegateFactory) {
        let vm = this;
        vm.getFrontdoor = getFrontdoor;
        vm.getCategory = getCategory;

        ///////////

        function getFrontdoor() {
            return entryService.forDefaultProfile().then((service) => {
                let tvodUrl = config.piHost + service.vodStore();
                return $http({
                    url: tvodUrl,
                    withCredentials: true
                }).then((storeResults) => {
                    let categories = storeResults.data.results;
                    return categories.map(delegateFactory.createInstance);
                }, () => {
                    throw 'Request Failed' + tvodUrl;
                });
            });
        }

        function getCategory(uri, startIndex, limit) {
            if (angular.isDefined(startIndex) && angular.isDefined(limit)) {
                uri += uri.indexOf('?') === -1 ? '?' : '&';
                uri = `${uri}start-index=${startIndex}&limit=${limit}`;
            }
            return $http({
                url: config.piHost + uri,
                withCredentials: true
            }).then((result) => {
                let data = result.data;
                data.results = data.results.map(partial => {
                    return delegateFactory.createInstance(partial);
                });
                return data;
            }, (err) => {
                throw 'Failed subcategory request ' + err ;
            });
        }
    }

}());
