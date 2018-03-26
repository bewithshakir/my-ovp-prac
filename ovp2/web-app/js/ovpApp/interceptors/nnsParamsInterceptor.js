(function () {
    'use strict';
    angular.module('ovpApp.interceptors.nns', ['ovpApp.config'])
        .config(nnsParamsInterceptor);

    /**
     * All calls to nationalnavigation with TVOD need certain query parameters
     * specifying client capabilities.
     *
     * Since http interceptors in angular are done before services initialize,
     * the config must be injected at runtime.
     *
     * @param $httpProvider
     */

    /* @ngInject */
    function nnsParamsInterceptor($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', '$log', function ($q, $injector) {
            return {
                request: function (config) {
                    var profileService = $injector.get('profileService'),
                        stbService = $injector.get('stbService'),
                        locationService = $injector.get('locationService'),
                        appConfig = $injector.get('config');

                    if (!config.ignoreNNSParams && (config.url.indexOf(appConfig.nnsApi) > -1 ||
                        config.url.indexOf(appConfig.vod.globalBookmarks) > -1 ||
                        config.url.indexOf(appConfig.watchlist) > -1)) {

                        return $q.all([profileService.isTVODRentEnabled(),
                            profileService.isTVODWatchEnabled(),
                            profileService.isCdvrEnabled(),
                            stbService.getCurrentStbPromise(),
                            profileService.getCapabilities(),
                            locationService.getLocation(),
                            profileService.isRdvrHidden()]).then(([tvodRentEnabled, tvodWatchEnabled, cdvrEnabled,
                                                                 currentStb, capabilities, location, rdvrHidden]) => {
                                config.params = config.params || {};

                                angular.extend(config.params, {
                                    tvodRent: tvodRentEnabled,
                                    tvodWatch: tvodWatchEnabled
                                });
                                if (cdvrEnabled) {
                                    angular.extend(config.params, {
                                        cdvrEnabled: cdvrEnabled
                                    });
                                } else if (currentStb) {
                                    angular.extend(config.params, {
                                        flickable: currentStb.flickable,
                                        dvr: currentStb.isDvr,
                                        macaddress: currentStb.macAddressNormalized,
                                        dvrManager: !rdvrHidden // whether RDVR view is available or not
                                    });

                                    if (currentStb.isDvr) {
                                        angular.extend(config.params, {rdvrVersion: currentStb.rdvrVersion});
                                    }

                                    if (currentStb.tuneLinear) {
                                        angular.extend(config.params, {tuneToChannel: true});
                                    }
                                }

                                angular.extend(config.params, {
                                    displayOutOfHomeOnly: !location.behindOwnModem,
                                    deviceOutOfHome: !location.behindOwnModem
                                });

                                if (capabilities.watchondemand && capabilities.watchondemand.authorized) {
                                    angular.extend(config.params, {watchOnDemand: true});
                                }
                                if (capabilities.tunetochannel && capabilities.tunetochannel.authorized) {
                                    angular.extend(config.params, {tuneToChannel: true});
                                }
                                if (capabilities.watchlive && capabilities.watchlive.authorized) {
                                    angular.extend(config.params, {watchLive: true});
                                }

                                return config;
                            });
                    } else {
                        return $q.resolve(config);
                    }
                }
            };
        }]);
    }
}());
