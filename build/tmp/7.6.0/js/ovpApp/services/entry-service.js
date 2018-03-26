'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    entryService.$inject = ["$http", "$q", "config", "lineupService", "profileService", "$rootScope"];
    angular.module('ovpApp.services.entry', ['ovpApp.config', 'ovpApp.service.lineup', 'ovpApp.services.profileService']).factory('entryService', entryService);

    /* @ngInject */
    function entryService($http, $q, config, lineupService, profileService, $rootScope) {
        var profiles = {};

        var service = {
            forDefaultProfile: forDefaultProfile,
            forProfile: forProfile,
            clearCache: clearCache
        };

        return service;

        /////////////////

        function clearCache() {
            profiles = {};
        }

        function forDefaultProfile() {
            return $q.all([profileService.isSpecU(), profileService.isBulkMDU(), profileService.isIpOnlyEnabled()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3);

                var specU = _ref2[0];
                var bulkMDU = _ref2[1];
                var ipOnly = _ref2[2];

                var profile = specU ? config.nns.specUConfig : bulkMDU ? config.nns.bulkMDUConfig : ipOnly ? config.nns.ipOnlyConfig : config.nns.qamStbConfig;
                return forProfile(profile);
            });
        }

        /**
         * Returns a promise which resolves to an object which helps resolve API endpoints
         *
         * @param {string} profile
         * @returns {Promise}
         */
        function forProfile(profile) {
            return lineupService.getLineup().then(function (service) {
                var division = service.market;
                var lineup = service.lineupId;

                if (!(lineup || division || profile)) {
                    throw new Error('Must have a profile, lineup and division');
                }

                // To avoid unnecessary re-requests, create a key to cache all unique responses
                var key = division + ':' + lineup + ':' + profile;

                $rootScope.$broadcast('EntryService:masDefined', service);

                // If we already have this request, then return a promise which will resolve to the helper
                if (profiles[key]) {
                    return profiles[key];
                }

                // Create the new request
                var promise = $http({
                    method: 'GET',
                    url: '' + config.piHost + config.nnsApi + config.nns.entryPoint + ('?division=' + division + '&lineup=' + lineup + '&profile=' + profile),
                    withCredentials: true
                }).then(function (response) {
                    // For each entry in the entryPointList, we will return an object which will either
                    //  be a function (in the case of "bare" endpoints like homepage) or an object
                    //  of additional functions
                    return response.data.entryPointList.reduce(function (serviceMap, endpoint) {
                        serviceMap[endpoint.name] = endpoint.entryPoints.reduce(function (replaceMap, entryPoint) {

                            // Entries without a replaceType or replaceStrings field are "bare"
                            //  and have no transformations available.  These we turn into a simple
                            //  function which returns the URI
                            if (!(entryPoint.replaceType || entryPoint.replaceStrings)) {
                                return angular.extend(function () {
                                    return entryPoint.uri;
                                }, replaceMap);
                            } else if (!entryPoint.replaceType && entryPoint.replaceStrings) {
                                // Replace multiple strings
                                var _name = entryPoint.replaceStrings.map(function (r) {
                                    return r.replaceType;
                                }).join('_');
                                replaceMap[_name] = function () {
                                    var uri = entryPoint.uri;

                                    for (var _len = arguments.length, replacements = Array(_len), _key = 0; _key < _len; _key++) {
                                        replacements[_key] = arguments[_key];
                                    }

                                    replacements.forEach(function (r, i) {
                                        return uri = uri.replace(entryPoint.replaceStrings[i].replaceString, r);
                                    });
                                    return uri;
                                };
                                return replaceMap;
                            } else {
                                // Standard option-- offers to replace a single value-- e.g. series
                                //  and event calls by an ID.  Return a function which accepts an id
                                //  and returns the URI for that ID
                                replaceMap[entryPoint.replaceType] = function (id) {
                                    return entryPoint.uri.replace(entryPoint.replaceString, id);
                                };
                                return replaceMap;
                            }
                        }, {});
                        return serviceMap;
                    }, {});
                });

                // Save the promise so that we don't need to re-request the data
                return profiles[key] = promise;
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/entry-service.js.map
