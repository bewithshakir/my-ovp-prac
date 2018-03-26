'use strict';

(function () {
    'use strict';

    NNSService.$inject = ["rxhttp", "rx", "$q", "$log", "$timeout", "$cacheFactory", "config", "entryService"];
    angular.module('ovpApp.services.nns', ['ovpApp.config', 'ovpApp.services.entry', 'ovpApp.services.rxUtils', 'rx']).factory('NNSService', NNSService);

    /* @ngInject */
    function NNSService(rxhttp, rx, $q, $log, $timeout, $cacheFactory, config, entryService) {
        var nnsCache = $cacheFactory.get('nnsCache'); //This is a very primitive cache
        var transformQueue = undefined;

        var service = {
            fetchBatch: fetchBatch,
            fetchAssetData: function fetchAssetData(asset) {
                return _fetchAssetData2(asset).toPromise($q);
            },
            getEpisodesSince: getEpisodesSince,
            getEpisodesFromSeasonSince: getEpisodesFromSeasonSince,
            getVersion: getVersion
        };

        activate();

        return service;

        //////////////////

        function activate() {
            //Catch malformed JSON, for example, a 404 response from nns returns an error string
            transformQueue = [function (val) {
                try {
                    angular.fromJson(val);
                } catch (e) {
                    val = '{}';
                    $log.error('Unable to parse json from server response');
                }
                return val;
            }];
            transformQueue = transformQueue.concat(rxhttp.defaults.transformResponse);
        }

        /**
         * Accepts a list of assets (a result from the bookmarks api) and fetches
         * them as if it where a single request.
         * @param  {array} assets list of bookmark response objects
         * @return {promise}      promise that will result in an array of results
         */
        function fetchBatch(assets) {
            if (!assets || assets.length === 0) {
                return rx.Observable.just([]).toPromise($q);
            }

            return rx.Observable.from(assets).concatMap(function (asset) {
                return _fetchAssetData2(asset).retry(2)['catch'](function () {
                    return rx.Observable.just(undefined);
                });
            }).bufferWithCount(assets.length).first().timeout(60000, rx.Observable['throw']('Timeout fetching all assets').doOnError(function () {
                return $log.error('Unable to fetch all data within 60 seconds');
            })).toPromise($q);
        }

        /*
            Get asset data, must make sure that we can retrieve the url first,
            this requires a possible wait on the entryManager initialize task
            and then again on the actual data
         */
        function _fetchAssetData2(asset) {
            return rx.Observable.fromPromise(_fetchAssetDataUrl(asset)).flatMap(function (url) {
                return _fetchAssetData(asset, url);
            }).doOnError(function (error) {
                return $log.error('Unable to fetch the asset data url ' + error);
            });
        }

        /**
         * Inspect all episodes in a season and determine what is new
         * @param  {number} sinceDate milliseconds since Jan 1, 1970
         * @param  {object} season   Season to inspect
         * @return {array}           List of episodes found since sinceDate
         */
        function getEpisodesFromSeasonSince(sinceDate, season) {
            var foundEpisodes = [];
            if (season.episodes && season.name !== 'Other') {
                for (var i = 0; i < season.episodes.length; i++) {
                    var episode = season.episodes[i];
                    if (episode.details.original_air_date) {
                        var episodeTimestamp = Date.parse(episode.details.original_air_date);
                        if (episodeTimestamp > sinceDate) {
                            foundEpisodes.push(episode);
                        }
                    }
                }
            }

            return foundEpisodes;
        }

        function getEpisodesSince(sinceDate, series) {
            var foundEpisodes = [],
                seasons = series.seasons;
            for (var i in seasons) {
                if (seasons.hasOwnProperty(i)) {
                    var currentSeasonEpisodes = getEpisodesFromSeasonSince(sinceDate, seasons[i]);
                    foundEpisodes = foundEpisodes.concat(currentSeasonEpisodes);
                }
            }
            return foundEpisodes;
        }

        function _fetchAssetData(asset, url) {
            return rxhttp({
                url: config.piHost + url,
                withCredentials: true,
                cache: nnsCache,
                transformResponse: transformQueue
            }).map(function (response) {
                return response.data;
            });
        }

        /**
         * Sets the NNS version to local storage for info on login page in test
         * API can only be used with credentials.
         * @returns {*}
         */
        function getVersion() {
            return rxhttp({
                url: config.piHost + config.nnsVersion + '?short=true',
                withCredentials: true
            }).map(function (res) {
                return res.data;
            }).toPromise($q);
        }

        /**
         * Get the data url for an asset based on what data is available
         * @param  {asset}
         * @return {promise}       promise
         */
        function _fetchAssetDataUrl(asset) {

            return entryService.forDefaultProfile().then(function (service) {
                var uri = null;
                if (asset.isSeries && asset.tmsSeriesId) {
                    uri = service.series.tmsSeriesID(asset.tmsSeriesId);
                } else if (asset.providerAssetId) {
                    uri = service.event.providerAssetID(asset.providerAssetId);
                } else {
                    throw new Error('Unable to determine the correct entry url for asset');
                }
                return uri;
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/nns-service.js.map
