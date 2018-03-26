(function () {
    'use strict';
    angular.module('ovpApp.dataDelegate')
        .factory('episodeListViewModelDefinition', episodeListViewModelDefinition)
        .run(registerDelegate);

    /**
     * "Episode-list" objects are used to represent a series, usually in a non
     * search context. Not to be confused with "Series" objects, which are also
     * used to represent a series, but only come up inside search.
     */

    /* @ngInject */
    function episodeListViewModelDefinition(DataDelegate, config, $q,
        delegateUtils, parentalControlsService, delegateFactory, EntitlementsService,
        personViewModelDefinition) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            resultDisplay: () => 'Series',
            title: 'title',
            tmsSeriesId: 'tmsSeriesId',
            dsQueryId: 'dsQueryId', // Analytics
            searchResultIndex: 'searchResultIndex', // Analytics
            searchFacet: 'searchFacet', // Analytics
            isSeries: () => true,
            isEpisode: () => false,
            actions: 'actionGroups.defaultGroup.actionObjects',
            cdvrChannelPickerTmsGuideIds: 'cdvrChannelPickerTmsGuideIds',
            availableOutOfHome: 'availableOutOfHome',
            linearAvailableOutOfHome: 'linearAvailableOutOfHome',
            vodAvailableOutOfHome: 'vodAvailableOutOfHome',
            tvodAvailableOutOfHome: 'tvodAvailableOutOfHome',
            episodesAvailable: cached(function (data) {
                return data.seasons
                    .map(season => season.episodes.reduce((total, episode) => {
                        if (!episode.isPreview) {
                            return total + 1;
                        } else {
                            return total;
                        }
                    }, 0))
                    .reduce(((total, count) => total += count), 0);
            }),

            newEpisodes: function (data) {
                //TODO: this is dependant on time, so the current caching won't work.
                //  But millisecond accuracy is far from necessary (heck, hours would
                //  probably be ok), so adding a timeout to the caching would be nice.
                let thresholdMsec = 3600000 * 24 * config.newEpisodeThreshold;
                return delegateUtils.getEpisodesSince(data, Date.now() - thresholdMsec);
            },
            allRatings: 'details.allRatings',
            rating: 'details.allRatings[0]',
            isBlocked: function (data) {
                return parentalControlsService.isBlocked(
                    data.details.allRatings,
                    data.ipTmsGuideServiceIds,
                    data.details.allIpVPPs)
                    .then(result => {
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
                if (data.details.crew) {
                    data.details.crew.forEach(crewMember => crewMember.parentAsset = this);
                    return data.details.crew.map(c => personViewModelDefinition.createInstance(c));
                } else {
                    return [];
                }
            }),
            actors: cached(function () {
                return this.crew.filter(crewMember => crewMember.role == 'actor');
            }),
            actorsString: cached(function () {
                return this.actors.map(actor => actor.name).slice(0, 3).join(', ');
            }),
            actorsAndDirectors: cached(function () {
                return this.crew.filter(crewMember => crewMember.role == 'actor' || crewMember.role == 'director');
            }),
            directors: cached(function () {
                return this.crew.filter(crewMember => crewMember.role == 'director');
            }),
            writers: cached(function () {
                return this.crew.filter(crewMember => crewMember.role == 'writer');
            }),
            watchListProviderAssetId: 'details.latest_episode.details.watchListProviderAssetID',
            tmsProgramIds: cached(function (data) {
                return (data.details &&
                    data.details.latest_episode &&
                    data.details.latest_episode.tmsProgramIds) || [];
            }),
            tmsProgramId: cached(function () {
                return this.tmsProgramIds[0];
            }),
            network: 'network',
            networkImage: cached(delegateUtils.createNetworkImageFunction()),
            //Compile the format and details list for display on the product page
            streamProps: cached(function (data) {
                return data.details &&
                    data.details.latest_episode &&
                    data.details.latest_episode.streamList
                    .map(stream => stream.streamProperties.attributes)
                    .filter(a => !!a)
                    .reduce((list, current) => {
                        current.forEach(attr => {
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
                    }, {formats: [], attributes: []});
            }),
            totalEpisodes: 'details.totalEpisodes',
            isSeriesRecording: 'details.seriesRecording',
            imageUri: cached(delegateUtils.createProductImageFunction()),
            latestEpisode: cached(function (data) {
                return data.details && data.details.latest_episode &&
                    delegateFactory.createInstance(data.details.latest_episode);
            }),
            seasons: cached(function (data) {
                if (data.seasons) {
                    return data.seasons.map(season => {
                        season.episodes = season.episodes.map(episode => {
                            let ep = delegateFactory.createInstance(episode);
                            ep.parentSeries = this;
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
                        return data.details.genres.map(g => g.name);
                    } else if (data.details.latest_episode && data.details.latest_episode.details.genres) {
                        return data.details.latest_episode.details.genres.map(g => g.name);
                    }
                } else {
                    return [];
                }
            }),
            genreString: function () {
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
    }// end series factory function

    /* @ngInject */
    function registerDelegate(episodeListViewModelDefinition, delegateFactory) {
        function isEpisodeList(asset) {
            return asset.type === 'episode_list';
        }

        delegateFactory.registerDelegateDefinition(episodeListViewModelDefinition, isEpisodeList);
    }
}());
