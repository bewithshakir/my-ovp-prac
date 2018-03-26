'use strict';

(function () {
    'use strict';

    recordingViewModelDefinition.$inject = ["DataDelegate", "delegateUtils", "BookmarkService", "$q", "parentalControlsService"];
    angular.module('ovpApp.dataDelegate').factory('recordingViewModelDefinition', recordingViewModelDefinition);

    /* @ngInject */
    function recordingViewModelDefinition(DataDelegate, delegateUtils, BookmarkService, $q, parentalControlsService) {
        var cached = delegateUtils.cached;

        return new DataDelegate({
            title: 'programMetadata.title',
            episodeTitle: 'programMetadata.episodeTitle',
            tmsProgramIds: function tmsProgramIds() {
                return [this.tmsProgramId];
            },
            tmsProgramId: function tmsProgramId(data) {
                return data.tmsProgramId || data.programMetadata && data.programMetadata.tmsProgramId;
            },
            tmsSeriesId: 'programMetadata.tmsSeriesId',
            isEpisode: function isEpisode() {
                return !!this.tmsSeriesId;
            },
            isMovie: function isMovie() {
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
            directors: function directors() {
                return [];
            },
            writers: function writers() {
                return [];
            },
            genres: function genres(data) {
                return data && data.programMetadata && data.programMetadata.genres || [];
            },
            genreString: function genreString() {
                return this.genres.join(', ');
            },
            allRatings: function allRatings() {
                return [this.rating];
            },
            rating: 'programMetadata.rating',
            isBlocked: function isBlocked(data) {
                if (this.allRatings && this.allRatings.length > 0) {
                    return parentalControlsService.isBlocked(this.allRatings).then(function (result) {
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
            imageUri: cached(delegateUtils.createProductImageFunction(function getUri(data) {
                return data.programMetadata && data.programMetadata.imageUrl;
            })),
            releaseInformation: cached(function (data) {
                if (this.isMovie) {
                    return data.programMetadata.releaseYear;
                } else {
                    if (this.seasonNumber) {
                        return 'Season ' + this.seasonNumber + ' Episode ' + this.episodeNumber;
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
            bookmark: function bookmark() {
                return BookmarkService.getBookmarkByTmsProgramId(this.tmsProgramIds[0]);
            },
            playedPct: function playedPct() {
                if (this.bookmark) {
                    return this.bookmark.playMarkerSeconds / this.bookmark.runtimeSeconds * 100;
                }
            }
        });
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/recording.js.map
