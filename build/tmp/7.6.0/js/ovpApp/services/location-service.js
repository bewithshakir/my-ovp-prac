'use strict';

(function () {
    'use strict';

    locationService.$inject = ["rxhttp", "config", "$q", "$timeout", "$interval", "$rootScope", "OauthDataManager", "$window", "rx"];
    angular.module('ovpApp.services.locationService', ['ovpApp.config', 'ovpApp.services.profileService', 'ovpApp.oauth', 'ovpApp.services.rxUtils']).factory('locationService', locationService);

    /* @ngInject */
    function locationService(rxhttp, config, $q, $timeout, $interval, $rootScope, OauthDataManager, $window, rx) {
        var timeout = 1000 * 60 * 5;
        var currentLocation = undefined,
            promise = undefined;

        var service = {
            resetCache: function resetCache() {
                fetch();
            },
            getLocation: function getLocation() {
                if (!currentLocation) {
                    return fetch().then(function (result) {
                        return result.data;
                    })['catch'](function () {
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

            $rootScope.$on('connectivityService:statusChanged', function (event, isOnline) {
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
                promise = rxhttp.get(config.locationUrl(), { withCredentials: true }).retryWhen(function (errors) {
                    return errors.delay(1000).take(3).concat(rx.Observable['throw']());
                }).toPromise($q);
                promise.then(function (result) {
                    $rootScope.$broadcast('Analytics:locationRetrieved', result.data);
                    if (!angular.equals(currentLocation, result.data)) {
                        if (config.specU.enabled && OauthDataManager.get().accountType === 'SPECU') {
                            if (currentLocation) {
                                // If we are switching from known network
                                $window.location.reload(true); // Reload page
                            }
                        } else {
                                $rootScope.$broadcast('LocationService:locationChanged', result.data);
                            }
                    }
                    currentLocation = result.data;
                })['finally'](function () {
                    return promise = null;
                });
            }
            return promise;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/location-service.js.map
