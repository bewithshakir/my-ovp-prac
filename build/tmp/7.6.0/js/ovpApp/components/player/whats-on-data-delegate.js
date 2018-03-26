'use strict';

(function () {
    'use strict';

    whatsOnViewModelDefinition.$inject = ["DataDelegate", "delegateUtils", "$q", "config", "parentalControlsService"];
    angular.module('ovpApp.player.whatsOnDelegate', ['dataDelegate', 'ovpApp.dataDelegate', 'ovpApp.config']).factory('whatsOnViewModelDefinition', whatsOnViewModelDefinition);

    /* @ngInject */
    function whatsOnViewModelDefinition(DataDelegate, delegateUtils, $q, config, parentalControlsService) {
        var cached = delegateUtils.cached;

        return new DataDelegate({
            title: 'title',
            tmsProgramIds: function tmsProgramIds(data) {
                return [data.tmsProgramId];
            },
            tmsGuideId: 'tmsGuideId',
            isSeries: function isSeries() {
                return false;
            },
            isEpisode: function isEpisode(data) {
                return data.tmsProgramId.startsWith('EP');
            },
            isMovie: function isMovie(data) {
                return data.tmsProgramId.startsWith('MV');
            },
            allRatings: function allRatings(data) {
                return data.allRatings || [data.rating];
            },
            rating: 'rating',
            isBlocked: function isBlocked(data) {
                var ratings = [data.rating];
                var guideIds = data.channel ? [data.channel.tmsId] : undefined;
                return parentalControlsService.isBlocked(ratings, guideIds).then(function (result) {
                    return result.isBlocked;
                });
            },
            channel: 'channel',
            isBlockedByParentalControls: delegateUtils.promiseCached(function () {
                return this.isBlocked;
            }, 'ParentalControls:updated'),
            longDescription: 'shortDesc', // Only have a short description
            shortDescription: 'shortDesc',
            year: 'metadata.year',
            scheduledStartTimeSec: 'startTimeSec',
            scheduledEndTimeSec: function scheduledEndTimeSec(data) {
                return data.startTimeSec + data.durationMinutes * 60;
            },
            durationSec: function durationSec(data) {
                return data.durationMinutes * 60;
            },
            runtimeDisplay: function runtimeDisplay(data) {
                var hours = Math.floor(data.durationMinutes / 60);
                var minutes = Math.floor(data.durationMinutes % 60);

                var formattedRuntime = [];

                if (hours > 0) {
                    formattedRuntime.push(hours + ' hr');
                }

                if (minutes > 0) {
                    formattedRuntime.push(minutes + ' min');
                }

                return formattedRuntime.join(' ') || 'N/A';
            },
            isOnNow: function isOnNow(data) {
                var now = Date.now() / 1000;
                return now >= data.startTimeSec && now < data.startTimeSec + data.durationMinutes * 60;
            },
            episodeNumber: 'metadata.episode',
            seasonNumber: 'metadata.season',
            episodeTitle: 'metadata.title',
            networkImage: cached(function (data) {
                return function () {
                    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                    var uri = data.channel && data.channel.logoUrl;
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

                    if (angular.isDefined(options['default'])) {
                        uri = appendQueryString(uri, 'default=' + options['default']);
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
                var hasQuery = uri.includes('?');
                return uri + (hasQuery ? '&' : '?') + queryString;
            } else {
                return '';
            }
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/whats-on-data-delegate.js.map
