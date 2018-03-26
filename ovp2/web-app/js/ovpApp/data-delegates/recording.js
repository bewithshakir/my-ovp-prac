(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('recordingViewModelDefinition', recordingViewModelDefinition);

    /* @ngInject */
    function recordingViewModelDefinition(DataDelegate, delegateUtils, BookmarkService, $q, parentalControlsService) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            title: 'programMetadata.title',
            episodeTitle: 'programMetadata.episodeTitle',
            tmsProgramIds: function () {
                return [this.tmsProgramId];
            },
            tmsProgramId: function (data) {
                return data.tmsProgramId || (data.programMetadata && data.programMetadata.tmsProgramId);
            },
            tmsSeriesId: 'programMetadata.tmsSeriesId',
            isEpisode: function () {
                return !!this.tmsSeriesId;
            },
            isMovie: function () {
                return this.tmsProgramIds[0] && this.tmsProgramIds[0].substring(0, 2) === 'MV';
            },
            dsQueryId: 'dsQueryId', // Analytics
            searchResultIndex: 'searchResultIndex', // Analytics
            searchFacet: 'searchFacet', // Analytics
            recordSeries: 'recordSeries',
            isNew: 'isNew',
            conflicted: 'conflicted',
            startTime: 'startUnixTimestampSeconds',
            settings: 'settings',
            displayChannel: 'displayChannel',
            mystroServiceId: 'mystroServiceId',
            episodeNumber: 'programMetadata.episodeNumber',
            seasonNumber: 'programMetadata.seasonNumber',
            longDescription: 'programMetadata.shortDescription',
            shortDescription: 'programMetadata.longDescription',
            crew: 'programMetadata.actors',
            actors: 'programMetadata.actors',
            actorsAndDirectors: 'programMetadata.actors',
            directors: () => [],
            writers: () => [],
            genres: function (data) {
                return data && data.programMetadata && data.programMetadata.genres || [];
            },
            genreString: function () {
                return this.genres.join(', ');
            },
            allRatings: function () {
                return [this.rating];
            },
            rating: 'programMetadata.rating',
            isBlocked: function (data) {
                if (this.allRatings && this.allRatings.length > 0) {
                    return parentalControlsService.isBlocked(this.allRatings)
                        .then(result => {
                            data.blockedReason = result.reason;
                            return result.isBlocked;
                        });
                } else {
                    return $q.resolve(false);
                }
            },
            isBlockedByParentalControls: delegateUtils.promiseCached(function () {
                //This returns a value always, not a promise - the 'isBlocked' getter
                //provides access to the promise directly.
                return this.isBlocked;
            }, 'ParentalControls:updated'),
            isBlockedReason: 'blockedReason',
            imageUri: cached(delegateUtils.createProductImageFunction(
                function getUri(data) {
                    return data.programMetadata && data.programMetadata.imageUrl;
                }
            )),
            releaseInformation: cached(function (data) {
                if (this.isMovie) {
                    return data.programMetadata.releaseYear;
                } else {
                    if (this.seasonNumber) {
                        return `Season ${this.seasonNumber} Episode ${this.episodeNumber}`;
                    }
                }
            }),
            clickRoute: cached(function () {
                if (this.isEpisode) {
                    return ['product.series', {
                        tmsSeriesId: this.tmsSeriesId,
                        serviceId: this.mystroServiceId,
                        airtime: this.startTime,
                        tmsProgramId: this.tmsProgramIds[0]
                    }];
                } else {
                    return ['product.event', {
                        tmsId: this.tmsProgramIds[0],
                        serviceId: this.mystroServiceId,
                        airtime: this.startTime
                    }];
                }
            }),
            bookmark: function () {
                return BookmarkService.getBookmarkByTmsProgramId(this.tmsProgramIds[0]);
            },
            playedPct: function () {
                if (this.bookmark) {
                    return (this.bookmark.playMarkerSeconds / this.bookmark.runtimeSeconds) * 100;
                }
            }
        });
    }
})();
