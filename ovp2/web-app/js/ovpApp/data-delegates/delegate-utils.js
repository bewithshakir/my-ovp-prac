(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('delegateUtils', delegateUtils);

    /* @ngInject */
    function delegateUtils($rootScope, parentalControlsService, $q, config) {
        const service = {
            cached,
            promiseCached,
            getEpisodesSince,
            getEpisodesFromSeasonSince,
            getDefaultStream,
            getStreamProps,
            createProductImageFunction,
            getPersonImageUri,
            createNetworkImageFunction,
            networkImageFromTmsId: createNetworkImageFunction(
                tmsId => `${config.image_api}/guide/${tmsId}`,
                angular.noop
            ),
            appendQueryString,
            formats: {
                'HIGH_DEF': 'HD',
                'THREED': '3D',
                'STANDARD_DEF': 'SD'
            },
            details: {
                'DOLBY_5_1':    '5.1',
                'STEREO':       'Stereo',
                'CLOSED_CAPTIONING': 'CC',
                'SAP':          'SAP'
            },
            descriptionTypes: {
                _mutator: 'details',
                long: 'long_desc',
                short: 'short_desc'
            },
            standardSearchParams: {
                title: 'searchStringMatch',
                titleWithHighlightTags: 'searchStringMatchWithHighlightTags',
                tmsProgramId: 'tmsProgramId',
                tmsSeriesId: 'tmsSeriesId',
                dsQueryId: 'dsQueryId', // Analytics
                searchResultIndex: 'searchResultIndex', // Analytics
                searchFacet: 'searchFacet', // Analytics
                availableLinear: 'availableLinear',
                availableOnDemand: 'availableOnDemand',
                ratings: 'allRatings',
                isBlocked: function (data) {
                    if (data.allRatings && data.allRatings.length > 0) {
                        return parentalControlsService.isBlockedByRating(data.allRatings);
                    } else {
                        return $q.resolve(false);
                    }
                },
                isBlockedByParentalControls: promiseCached(function () {
                    //This returns a value always, not a promise - the 'isBlocked' getter
                    //provides access to the promise directly.
                    return this.isBlocked;
                }, 'ParentalControls:updated'),
                isEntitled: function () {
                    // Search results don't currently include enough information to determine if it is entitled.
                    return true;
                }
            }
        };

        let uniqueId = 0;

        return service;

        ///////////////////


        function appendQueryString(uri, queryString) {
            if (uri) {
                let hasQuery = uri.includes('?');
                return uri + (hasQuery ? '&' : '?') + queryString;
            } else {
                return '';
            }
        }

        function getEpisodesSince(data, sinceDate) {
            var result = [], seasons = data.seasons;
            if (seasons) {
                seasons.forEach(function (season) {
                    result.push(...getEpisodesFromSeasonSince(season, sinceDate));
                });
            }
            return result;
        }

        function getEpisodesFromSeasonSince(season, sinceDate) {
            if (season.episodes && season.name !== 'Other') {
                return season.episodes.filter(function (episode) {
                    if (episode.originalAirDate) {
                        let episodeTimestamp = Date.parse(episode.originalAirDate);
                        return episodeTimestamp > sinceDate;
                    }
                    return false;
                });
            } else {
                return [];
            }
        }

        function getDefaultStream(data) {
            return byWhatTheServerSays(data) ||
                byFirstOnDemandStream(data) ||
                byIndex(data);
        }

        function byWhatTheServerSays(data) {
            return data.streamList && data.streamList.find(stream => stream.defaultStream);
        }

        function byFirstOnDemandStream(data) {
            return data.streamList && data.streamList.find(stream => stream.type == 'ONLINE_ONDEMAND');
        }

        function byIndex(data) {
            return data.streamList && data.streamList[0];
        }

        /**
         * Creates a function to be used by data delegates for creating image uris
         * @param  {function} getUri           a function for how to find the image uri in the data
         * @param  {function} getNetworkParams a function for how to find the network params in the data
         * @return {function}                  a function to be installed on a data delegate
         */
        function createProductImageFunction(getUri = defaultGetUri, getNetworkParams = defaultGetNetworkParams) {
            // This next function gets installed on the data delegate
            return function (data) {
                // This next function is the one that gets called by the template or controller
                // e.g. myMovieObject.imageUri({width: 50}) will call into this function
                return function imageUri(options = {}) {
                    let uri = getUri(data);

                    // Size
                    if (options.width) {
                        uri = appendQueryString(uri, 'width=' + options.width);
                    }
                    if (options.height) {
                        uri = appendQueryString(uri, 'height=' + options.height);
                    }

                    // Aspect ratio
                    if (options.orientation == 'landscape') {
                        uri = appendQueryString(uri, 'twccategory=Showcard');
                    } else {
                        uri = appendQueryString(uri, 'twccategory=Poster');
                    }

                    // If image unavailable, fallback to network
                    uri = appendQueryString(uri, 'sourceType=colorHybrid');

                    const networkParams = getNetworkParams(data);
                    if (networkParams) {
                        uri = appendQueryString(uri, networkParams);
                    }

                    // If network unavailable, fallback to default, or if default=false return a 404
                    if (angular.isDefined(options.default)) {
                        uri = appendQueryString(uri, 'default=' + options.default);
                    } else {
                        uri = appendQueryString(uri, 'default=true');
                    }

                    return prependHostIfNeeded(uri);
                };
            };
        }

        function defaultGetUri(data) {
            return data.image_uri || data.imageUrl;
        }

        function defaultGetNetworkParams(data) {
            return data.network && data.network.networkImageQueryParams;
        }


        function getPersonImageUri(data) {
            return function (options = {}) {
                let uri = data.image_uri || `${config.image_api}/person/${data.tmsPersonId}`;
                // Size
                if (options.width) {
                    uri = appendQueryString(uri, 'width=' + options.width);
                }
                if (options.height) {
                    uri = appendQueryString(uri, 'height=' + options.height);
                }

                // If network unavailable, fallback to default, or if default=false return a 404
                if (angular.isDefined(options.default)) {
                    uri = appendQueryString(uri, 'default=' + options.default);
                } else {
                    uri = appendQueryString(uri, 'default=true');
                }

                return prependHostIfNeeded(uri);
            };
        }

        /**
         * Creates a function to be used by data delegates for creating image uris
         * @param  {function} getUri           a function for how to find the image uri in the data
         * @param  {function} getNetworkParams a function for how to find the network params in the data
         * @return {function}                  a function to be installed on a data delegate
         */
        function createNetworkImageFunction(getUri = defaultGetNetworkUri, getParams = defaultGetNetworkParams) {
            // This next function gets installed on the data delegate
            return function (data) {
                // This next function is the one that gets called by the template or controller
                // e.g. Network.imageUri({width: 50}) will call into this function
                return function imageUri(options = {}) {
                    let uri = getUri(data);

                    if (!uri) {
                        return '';
                    }

                    let queryParams = getParams(data);

                    if (queryParams) {
                        uri += `?${queryParams}`;
                    }


                    uri = appendQueryString(uri, 'sourceType=colorhybrid');
                    uri = appendQueryString(uri, 'apikey=' + config.oAuth.consumerKey);

                    if (options.width) {
                        uri = appendQueryString(uri, 'width=' + options.width);
                    }
                    if (options.height) {
                        uri = appendQueryString(uri, 'height=' + options.height);
                    }

                    if (angular.isDefined(options.default)) {
                        uri = appendQueryString(uri, 'default=' + options.default);
                    } else {
                        uri = appendQueryString(uri, 'default=true');
                    }

                    return uri;
                };
            };
        }

        function defaultGetNetworkUri(data) {
            return data.network && data.network.image_uri;
        }

        // Returns compiled attributes and formats for a streamList.
        function getStreamProps(streamList) {
            if (streamList && !(streamList instanceof Array)) {
                streamList = [streamList];
            }

            return streamList
                    .map(stream => stream.streamProperties.attributes)
                    .reduce((list, current) => {
                        if (current) {
                            current.forEach(attr => {
                                if (service.formats[attr]) {
                                    if (list.formats.indexOf(service.formats[attr]) < 0) {
                                        list.formats.push(service.formats[attr]);
                                    }
                                } else if (service.details[attr]) {
                                    if (list.attributes.indexOf(service.details[attr]) < 0) {
                                        list.attributes.push(service.details[attr]);
                                    }
                                }
                            });
                        }
                        return list;
                    }, {formats: [], attributes: []});
        }

        function prependHostIfNeeded(uri = '') {
            return (uri.charAt(0) == '/') ? config.piHost + uri : uri;
        }

        /**
         * Wraps a datadelegate accesor function so that it will be called only once, and the value
         *    cached from then on. Use to improve the performance of immutable data.
         * @param  {function} f the function to wrap
         * @return {function}   the wrapped function
         */
        function cached(f) {
            let id = uniqueId++;
            return function (data) {
                if (!data._cached) {
                    data._cached = {};
                }
                data._cached[id] = data._cached[id] || f.call(this, data);
                return data._cached[id];
            };
        }

        /**
         * Wraps a promise and returns undefined until the promise returns and then
         * it returns the same value until the cacheTime completes.
         * @param  {function} f the function to wrap
         * @param  {int} cacheTime [Optional] amount of time to store the value before refetching
         * @return {function}   the wrapped function
         */

        function promiseCached(fn, event) {
            let id = uniqueId++;
            let eventUnsubscribe = null;
            let cacheVersionId = 0;

            if (event && !eventUnsubscribe) {
                eventUnsubscribe = $rootScope.$on(event, function () {
                    cacheVersionId++;
                });
            }

            return function (data) {
                if (!data._cached) {
                    data._cached = {};
                }

                if (!data._cached[id]) {
                    data._cached[id] = {
                        cacheVersion: -1,
                        promise: null,
                        val: undefined
                    };
                }

                let c = data._cached[id];

                if ((c.promise === null && c.val === undefined) || c.cacheVersion < cacheVersionId) {
                    c.promise = fn.call(this, data);
                    c.cacheVersion = cacheVersionId;
                    if (c.promise && c.promise.then) {
                        c.promise.then((res) => {
                            c.val = res;
                            return c.val;
                        });
                    } else {
                        c.val = c.promise;
                        c.promise = {};//Make sure it is not null
                    }
                }
                return c.val;
            };
        }
    }
})();
