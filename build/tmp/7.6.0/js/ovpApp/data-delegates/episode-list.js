'use strict';

(function () {
    'use strict';
    episodeListViewModelDefinition.$inject = ["DataDelegate", "config", "$q", "delegateUtils", "parentalControlsService", "delegateFactory", "EntitlementsService", "personViewModelDefinition"];
    registerDelegate.$inject = ["episodeListViewModelDefinition", "delegateFactory"];
    angular.module('ovpApp.dataDelegate').factory('episodeListViewModelDefinition', episodeListViewModelDefinition).run(registerDelegate);

    /**
     * "Episode-list" objects are used to represent a series, usually in a non
     * search context. Not to be confused with "Series" objects, which are also
     * used to represent a series, but only come up inside search.
     */

    /* @ngInject */
    function episodeListViewModelDefinition(DataDelegate, config, $q, delegateUtils, parentalControlsService, delegateFactory, EntitlementsService, personViewModelDefinition) {
        var cached = delegateUtils.cached;

        return new DataDelegate({
            resultDisplay: function resultDisplay() {
                return 'Series';
            },
            title: 'title',
            tmsSeriesId: 'tmsSeriesId',
            dsQueryId: 'dsQueryId', // Analytics
            searchResultIndex: 'searchResultIndex', // Analytics
            searchFacet: 'searchFacet', // Analytics
            isSeries: function isSeries() {
                return true;
            },
            isEpisode: function isEpisode() {
                return false;
            },
            actions: 'actionGroups.defaultGroup.actionObjects',
            cdvrChannelPickerTmsGuideIds: 'cdvrChannelPickerTmsGuideIds',
            availableOutOfHome: 'availableOutOfHome',
            linearAvailableOutOfHome: 'linearAvailableOutOfHome',
            vodAvailableOutOfHome: 'vodAvailableOutOfHome',
            tvodAvailableOutOfHome: 'tvodAvailableOutOfHome',
            episodesAvailable: cached(function (data) {
                return data.seasons.map(function (season) {
                    return season.episodes.reduce(function (total, episode) {
                        if (!episode.isPreview) {
                            return total + 1;
                        } else {
                            return total;
                        }
                    }, 0);
                }).reduce(function (total, count) {
                    return total += count;
                }, 0);
            }),

            newEpisodes: function newEpisodes(data) {
                //TODO: this is dependant on time, so the current caching won't work.
                //  But millisecond accuracy is far from necessary (heck, hours would
                //  probably be ok), so adding a timeout to the caching would be nice.
                var thresholdMsec = 3600000 * 24 * config.newEpisodeThreshold;
                return delegateUtils.getEpisodesSince(data, Date.now() - thresholdMsec);
            },
            allRatings: 'details.allRatings',
            rating: 'details.allRatings[0]',
            isBlocked: function isBlocked(data) {
                return parentalControlsService.isBlocked(data.details.allRatings, data.ipTmsGuideServiceIds, data.details.allIpVPPs).then(function (result) {
                    data.blockedReason = result.reason;
                    return result.isBlocked;
                });
            },
            isBlockedByParentalControls: delegateUtils.promiseCached(function () {
                //This returns a value always, not a promise - the 'isBlocked' getter
                //provides access to the promise directly.
                return this.isBlocked;
            }, 'ParentalControls:updated'),
            isBlockedReason: 'blockedReason',
            isEntitled: 'details.entitled',
            isLinearEntitledIp: 'details.linearEntitledIp',
            isLinearEntitledQam: 'details.linearEntitledQam',
            isTvodEntitled: 'details.tvodEntitled',
            isOutOfWindow: 'vodOutOfWindow',
            description: delegateUtils.descriptionTypes,
            crew: cached(function (data) {
                var _this = this;

                if (data.details.crew) {
                    data.details.crew.forEach(function (crewMember) {
                        return crewMember.parentAsset = _this;
                    });
                    return data.details.crew.map(function (c) {
                        return personViewModelDefinition.createInstance(c);
                    });
                } else {
                    return [];
                }
            }),
            actors: cached(function () {
                return this.crew.filter(function (crewMember) {
                    return crewMember.role == 'actor';
                });
            }),
            actorsString: cached(function () {
                return this.actors.map(function (actor) {
                    return actor.name;
                }).slice(0, 3).join(', ');
            }),
            actorsAndDirectors: cached(function () {
                return this.crew.filter(function (crewMember) {
                    return crewMember.role == 'actor' || crewMember.role == 'director';
                });
            }),
            directors: cached(function () {
                return this.crew.filter(function (crewMember) {
                    return crewMember.role == 'director';
                });
            }),
            writers: cached(function () {
                return this.crew.filter(function (crewMember) {
                    return crewMember.role == 'writer';
                });
            }),
            watchListProviderAssetId: 'details.latest_episode.details.watchListProviderAssetID',
            tmsProgramIds: cached(function (data) {
                return data.details && data.details.latest_episode && data.details.latest_episode.tmsProgramIds || [];
            }),
            tmsProgramId: cached(function () {
                return this.tmsProgramIds[0];
            }),
            network: 'network',
            networkImage: cached(delegateUtils.createNetworkImageFunction()),
            //Compile the format and details list for display on the product page
            streamProps: cached(function (data) {
                return data.details && data.details.latest_episode && data.details.latest_episode.streamList.map(function (stream) {
                    return stream.streamProperties.attributes;
                }).filter(function (a) {
                    return !!a;
                }).reduce(function (list, current) {
                    current.forEach(function (attr) {
                        if (delegateUtils.formats[attr]) {
                            if (list.formats.indexOf(delegateUtils.formats[attr]) < 0) {
                                list.formats.push(delegateUtils.formats[attr]);
                            }
                        } else if (delegateUtils.details[attr]) {
                            if (list.attributes.indexOf(delegateUtils.details[attr]) < 0) {
                                list.attributes.push(delegateUtils.details[attr]);
                            }
                        }
                    });
                    return list;
                }, { formats: [], attributes: [] });
            }),
            totalEpisodes: 'details.totalEpisodes',
            isSeriesRecording: 'details.seriesRecording',
            imageUri: cached(delegateUtils.createProductImageFunction()),
            latestEpisode: cached(function (data) {
                return data.details && data.details.latest_episode && delegateFactory.createInstance(data.details.latest_episode);
            }),
            seasons: cached(function (data) {
                var _this2 = this;

                if (data.seasons) {
                    return data.seasons.map(function (season) {
                        season.episodes = season.episodes.map(function (episode) {
                            var ep = delegateFactory.createInstance(episode);
                            ep.parentSeries = _this2;
                            return ep;
                        });
                        return season;
                    });
                } else {
                    return [];
                }
            }),
            commonSenseMedia: 'details.commonSenseMediaV2.rating',
            metaCritic: 'details.metacritic.rating',
            clickRoute: cached(function (data) {
                return ['product.series', {
                    tmsSeriesId: data.tmsSeriesId,
                    uri: data.uri
                }];
            }),
            genres: cached(function (data) {
                if (data && data.details) {
                    if (data.details.genres) {
                        return data.details.genres.map(function (g) {
                            return g.name;
                        });
                    } else if (data.details.latest_episode && data.details.latest_episode.details.genres) {
                        return data.details.latest_episode.details.genres.map(function (g) {
                            return g.name;
                        });
                    }
                } else {
                    return [];
                }
            }),
            genreString: function genreString() {
                return this.genres ? this.genres.join(', ') : '';
            },
            sportsCategory: 'details.sportsResultsCategory',
            isLive: 'details.isLive',
            isOnNow: 'details.isOnNow',
            isReplay: 'details.isReplay',
            scheduledStartTimeSec: 'details.schedStartTimeSec',
            scheduledEndTimeSec: 'details.schedEndTimeSec',
            staleDvrCache: 'details.staleDvrCache',
            price: null,
            rentalExpiration: null
        });
    } // end series factory function

    /* @ngInject */
    function registerDelegate(episodeListViewModelDefinition, delegateFactory) {
        function isEpisodeList(asset) {
            return asset.type === 'episode_list';
        }

        delegateFactory.registerDelegateDefinition(episodeListViewModelDefinition, isEpisodeList);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/episode-list.js.map
