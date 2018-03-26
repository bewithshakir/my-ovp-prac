(function () {
    'use strict';

    angular
        .module('ovpApp.services.homePage', [
            'ovpApp.services.entry',
            'ovpApp.services.rxUtils',
            'ovpApp.services.profileService',
            'ovpApp.messages'
        ])
        .factory('homePage', homePage);

    /* @ngInject */
    function homePage(rxhttp, entryService, profileService, $q, config) {
        let promise;

        return getHomePage;

        ////////////////

        function getHomePage() {
            if (!promise) {
                promise = $q.all([entryService.forDefaultProfile(), profileService.isCdvrEnabled()])
                    .then(([services, isCdvrEnabled]) => {
                        return rxhttp.get(config.piHost + services.homePage(),
                            {
                                withCredentials: true,
                                ignoreNNSParams: true,
                                // Added these default parameters to get all possible menu items
                                // Use capability to show / hide menu items
                                // This api is used to get the menu item names and it's sequence
                                params: {
                                    cdvrEnabled: isCdvrEnabled ? true : false,
                                    dvr: isCdvrEnabled ? false : true,
                                    dvrManager: true,
                                    tuneToChannel: true,
                                    watchOnDemand: true,
                                    watchLive: true,
                                    tvodRent: true,
                                    tvodWatch: true
                                }
                            })
                            .retry(3)
                            .map(response => response.data.results)
                            .toPromise($q);
                    }, (err) => {
                        promise = null;
                        $q.reject(err);
                    });
            }
            return promise;
        }
    }
})();
