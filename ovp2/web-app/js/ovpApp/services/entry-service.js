(function () {
    'use strict';

    angular.module('ovpApp.services.entry', [
        'ovpApp.config',
        'ovpApp.service.lineup',
        'ovpApp.services.profileService'
    ])
    .factory('entryService', entryService);

    /* @ngInject */
    function entryService($http, $q, config, lineupService, profileService, $rootScope) {
        let profiles = {};

        let service = {
            forDefaultProfile,
            forProfile,
            clearCache
        };

        return service;

        /////////////////

        function clearCache() {
            profiles = {};
        }

        function forDefaultProfile() {
            return $q.all([profileService.isSpecU(), profileService.isBulkMDU(), profileService.isIpOnlyEnabled()])
                .then(([specU, bulkMDU, ipOnly]) => {
                    let profile = specU ? config.nns.specUConfig :
                        (bulkMDU ? config.nns.bulkMDUConfig :
                        (ipOnly ? config.nns.ipOnlyConfig : config.nns.qamStbConfig));
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
            return lineupService.getLineup().then(service => {
                let { market: division, lineupId: lineup } = service;

                if (!(lineup || division || profile)) {
                    throw new Error('Must have a profile, lineup and division');
                }

                // To avoid unnecessary re-requests, create a key to cache all unique responses
                let key = `${division}:${lineup}:${profile}`;

                $rootScope.$broadcast('EntryService:masDefined', service);

                // If we already have this request, then return a promise which will resolve to the helper
                if (profiles[key]) {
                    return profiles[key];
                }

                // Create the new request
                let promise = $http({
                    method: 'GET',
                    url: `${config.piHost}${config.nnsApi}${config.nns.entryPoint}` +
                        `?division=${division}&lineup=${lineup}&profile=${profile}`,
                    withCredentials: true
                })
                    .then(response => {
                        // For each entry in the entryPointList, we will return an object which will either
                        //  be a function (in the case of "bare" endpoints like homepage) or an object
                        //  of additional functions
                        return response.data.entryPointList.reduce((serviceMap, endpoint) => {
                            serviceMap[endpoint.name] = endpoint.entryPoints
                                .reduce((replaceMap, entryPoint) => {

                                    // Entries without a replaceType or replaceStrings field are "bare"
                                    //  and have no transformations available.  These we turn into a simple
                                    //  function which returns the URI
                                    if (!(entryPoint.replaceType || entryPoint.replaceStrings)) {
                                        return angular.extend(function () {
                                            return entryPoint.uri;
                                        }, replaceMap);
                                    } else if (!entryPoint.replaceType && entryPoint.replaceStrings) {
                                        // Replace multiple strings
                                        let name = entryPoint.replaceStrings
                                            .map(r => r.replaceType)
                                            .join('_');
                                        replaceMap[name] = function (...replacements) {
                                            let uri = entryPoint.uri;
                                            replacements.forEach((r, i) =>
                                                uri = uri.replace(entryPoint.replaceStrings[i].replaceString, r));
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
                return (profiles[key] = promise);
            });
        }
    }
}());
