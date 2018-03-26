(function () {
    'use strict';

    angular
        .module('ovpApp.player.whatsOnDelegate', [
            'dataDelegate',
            'ovpApp.dataDelegate',
            'ovpApp.config'
        ])
        .factory('whatsOnViewModelDefinition', whatsOnViewModelDefinition);

    /* @ngInject */
    function whatsOnViewModelDefinition(DataDelegate, delegateUtils, $q, config, parentalControlsService) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            title: 'title',
            tmsProgramIds: (data) => [data.tmsProgramId],
            tmsGuideId: 'tmsGuideId',
            isSeries: () => false,
            isEpisode: (data) => data.tmsProgramId.startsWith('EP'),
            isMovie: (data) => data.tmsProgramId.startsWith('MV'),
            allRatings: (data) => data.allRatings || [data.rating],
            rating: 'rating',
            isBlocked: (data) => {
                let ratings = [data.rating];
                let guideIds = data.channel ? [data.channel.tmsId] : undefined;
                return parentalControlsService.isBlocked(ratings, guideIds)
                    .then(result => result.isBlocked);
            },
            channel: 'channel',
            isBlockedByParentalControls: delegateUtils.promiseCached(function () {
                return this.isBlocked;
            }, 'ParentalControls:updated'),
            longDescription: 'shortDesc', // Only have a short description
            shortDescription: 'shortDesc',
            year: 'metadata.year',
            scheduledStartTimeSec: 'startTimeSec',
            scheduledEndTimeSec: (data) => {
                return data.startTimeSec + (data.durationMinutes * 60);
            },
            durationSec: (data) => {
                return data.durationMinutes * 60;
            },
            runtimeDisplay: (data) => {
                let hours = Math.floor(data.durationMinutes / 60);
                let minutes = Math.floor(data.durationMinutes % 60);

                let formattedRuntime = [];

                if (hours > 0) {
                    formattedRuntime.push(hours + ' hr');
                }

                if (minutes > 0) {
                    formattedRuntime.push(minutes + ' min');
                }

                return formattedRuntime.join(' ') || 'N/A';
            },
            isOnNow: (data) => {
                let now = Date.now() / 1000;
                return now >= data.startTimeSec &&
                    now < data.startTimeSec + (data.durationMinutes * 60);
            },
            episodeNumber: 'metadata.episode',
            seasonNumber: 'metadata.season',
            episodeTitle: 'metadata.title',
            networkImage: cached(data => {
                return function (options = {}) {
                    let uri = data.channel && data.channel.logoUrl;
                    if (!uri) {
                        return '';
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
                    return uri.replace('http://', 'https://');
                };
            }),
            imageUri: cached(delegateUtils.createProductImageFunction()),
            vodProviderAssetId: 'vodProviderAssetId',
            vodTmsSeriesId: 'vodTmsSeriesId'
        });

        /////////

        function appendQueryString(uri, queryString) {
            if (uri) {
                let hasQuery = uri.includes('?');
                return uri + (hasQuery ? '&' : '?') + queryString;
            } else {
                return '';
            }
        }
    }
})();
