(function () {
    'use strict';

    angular.module('ovpApp.services.locationService', [
        'ovpApp.config',
        'ovpApp.services.profileService',
        'ovpApp.oauth',
        'ovpApp.services.rxUtils'])
    .factory('locationService', locationService);

    /* @ngInject */
    function locationService(rxhttp, config, $q, $timeout, $interval, $rootScope, OauthDataManager, $window, rx) {
        const timeout = 1000 * 60 * 5;
        let currentLocation, promise;

        let service =  {
            resetCache: () => {
                fetch();
            },
            getLocation: () => {
                if (!currentLocation) {
                    return fetch().then(result => result.data)
                    .catch(() => {
                        return $q.reject({
                            errorCode: 'WLC-1001'
                        });
                    });
                } else {
                    return $q.resolve(currentLocation);
                }
            }
        };

        activate();

        return service;

        //////////////

        function activate() {
            // Fetch location and publish location changed event
            var interval = $interval(fetch, timeout);

            $rootScope.$on('connectivityService:statusChanged', (event, isOnline) => {
                if (isOnline) {
                    fetch();
                    interval = $interval(fetch, timeout);
                } else {
                    $interval.cancel(interval);
                    interval = undefined;
                }
            });


        }

        function fetch() {
            if (!promise) {
                promise = rxhttp.get(config.locationUrl(), {withCredentials: true})
                    .retryWhen(errors => errors.delay(1000).take(3).concat(rx.Observable.throw()))
                    .toPromise($q);
                promise.then(result => {
                    $rootScope.$broadcast('Analytics:locationRetrieved', result.data);
                    if (!angular.equals(currentLocation, result.data)) {
                        if (config.specU.enabled && OauthDataManager.get().accountType === 'SPECU') {
                            if (currentLocation) { // If we are switching from known network
                                $window.location.reload(true); // Reload page
                            }
                        } else {
                            $rootScope.$broadcast('LocationService:locationChanged', result.data);
                        }
                    }
                    currentLocation = result.data;
                }).finally(() => promise = null);
            }
            return promise;
        }
    }
}());
