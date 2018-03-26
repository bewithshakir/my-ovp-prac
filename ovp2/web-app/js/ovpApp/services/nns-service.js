(function () {
    'use strict';

    angular.module('ovpApp.services.nns', [
        'ovpApp.config',
        'ovpApp.services.entry',
        'ovpApp.services.rxUtils',
        'rx'
    ])
    .factory('NNSService', NNSService);

    /* @ngInject */
    function NNSService(rxhttp, rx, $q, $log, $timeout, $cacheFactory, config, entryService) {
        let nnsCache = $cacheFactory.get('nnsCache');//This is a very primitive cache
        let transformQueue;

        let service = {
            fetchBatch,
            fetchAssetData: (asset) => fetchAssetData(asset).toPromise($q),
            getEpisodesSince,
            getEpisodesFromSeasonSince,
            getVersion
        };

        activate();

        return service;

        //////////////////

        function activate() {
            //Catch malformed JSON, for example, a 404 response from nns returns an error string
            transformQueue = [
                function (val) {
                    try {
                        angular.fromJson(val);
                    } catch (e) {
                        val = '{}';
                        $log.error('Unable to parse json from server response');
                    }
                    return val;
                }
            ];
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

            return rx.Observable.from(assets)
                .concatMap(asset => {
                    return fetchAssetData(asset)
                        .retry(2)
                        .catch(() => rx.Observable.just(undefined));
                })
                .bufferWithCount(assets.length)
                .first()
                .timeout(60000, rx.Observable.throw('Timeout fetching all assets')
                    .doOnError(() => $log.error('Unable to fetch all data within 60 seconds')))
                .toPromise($q);
        }

        /*
            Get asset data, must make sure that we can retrieve the url first,
            this requires a possible wait on the entryManager initialize task
            and then again on the actual data
         */
        function fetchAssetData(asset) {
            return rx.Observable.fromPromise(_fetchAssetDataUrl(asset))
                .flatMap(url => _fetchAssetData(asset, url))
                .doOnError(error => $log.error('Unable to fetch the asset data url ' + error));
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
                for (let i = 0; i < season.episodes.length; i++) {
                    let episode = season.episodes[i];
                    if (episode.details.original_air_date) {
                        let episodeTimestamp = Date.parse(episode.details.original_air_date);
                        if (episodeTimestamp > sinceDate) {
                            foundEpisodes.push(episode);
                        }
                    }
                }
            }

            return foundEpisodes;
        }

        function getEpisodesSince(sinceDate, series) {
            var foundEpisodes = [], seasons = series.seasons;
            for (let i in seasons) {
                if (seasons.hasOwnProperty(i)) {
                    let currentSeasonEpisodes = getEpisodesFromSeasonSince(sinceDate, seasons[i]);
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
            }).map(response => response.data);
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
            })
            .map(res => res.data)
            .toPromise($q);
        }

        /**
         * Get the data url for an asset based on what data is available
         * @param  {asset}
         * @return {promise}       promise
         */
        function _fetchAssetDataUrl(asset) {

            return entryService.forDefaultProfile().then(service => {
                let uri = null;
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
}());
