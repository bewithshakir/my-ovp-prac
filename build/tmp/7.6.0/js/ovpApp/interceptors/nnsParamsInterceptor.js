'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';
    nnsParamsInterceptor.$inject = ["$httpProvider"];
    angular.module('ovpApp.interceptors.nns', ['ovpApp.config']).config(nnsParamsInterceptor);

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
                request: function request(config) {
                    var profileService = $injector.get('profileService'),
                        stbService = $injector.get('stbService'),
                        locationService = $injector.get('locationService'),
                        appConfig = $injector.get('config');

                    if (!config.ignoreNNSParams && (config.url.indexOf(appConfig.nnsApi) > -1 || config.url.indexOf(appConfig.vod.globalBookmarks) > -1 || config.url.indexOf(appConfig.watchlist) > -1)) {

                        return $q.all([profileService.isTVODRentEnabled(), profileService.isTVODWatchEnabled(), profileService.isCdvrEnabled(), stbService.getCurrentStbPromise(), profileService.getCapabilities(), locationService.getLocation(), profileService.isRdvrHidden()]).then(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 7);

                            var tvodRentEnabled = _ref2[0];
                            var tvodWatchEnabled = _ref2[1];
                            var cdvrEnabled = _ref2[2];
                            var currentStb = _ref2[3];
                            var capabilities = _ref2[4];
                            var location = _ref2[5];
                            var rdvrHidden = _ref2[6];

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
                                    angular.extend(config.params, { rdvrVersion: currentStb.rdvrVersion });
                                }

                                if (currentStb.tuneLinear) {
                                    angular.extend(config.params, { tuneToChannel: true });
                                }
                            }

                            angular.extend(config.params, {
                                displayOutOfHomeOnly: !location.behindOwnModem,
                                deviceOutOfHome: !location.behindOwnModem
                            });

                            if (capabilities.watchondemand && capabilities.watchondemand.authorized) {
                                angular.extend(config.params, { watchOnDemand: true });
                            }
                            if (capabilities.tunetochannel && capabilities.tunetochannel.authorized) {
                                angular.extend(config.params, { tuneToChannel: true });
                            }
                            if (capabilities.watchlive && capabilities.watchlive.authorized) {
                                angular.extend(config.params, { watchLive: true });
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
})();
//# sourceMappingURL=../../maps-babel/ovpApp/interceptors/nnsParamsInterceptor.js.map
