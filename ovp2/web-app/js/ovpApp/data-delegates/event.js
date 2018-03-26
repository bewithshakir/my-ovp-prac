(function () {
    'use strict';
    angular.module('ovpApp.dataDelegate')
        .factory('eventViewModelDefinition', eventViewModelDefinition)
        .run(registerDelegate);

    /**
     * "Event" objects are used to represent a movie or episode, usually in a non
     * search context. Not to be confused with "Product" objects, which are also
     * used to represent a movie, but only come up inside search.
     */

    /* @ngInject */
    function eventViewModelDefinition(DataDelegate, BookmarkService, $q,
        delegateUtils, $filter, parentalControlsService, dateFormat, delegateFactory,
        EntitlementsService, config, $state, messages, streamViewModelDefinition, CDVR_STATE,
        personViewModelDefinition) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            _mutator: function (data) {
                return data && data.media && data.media.results && data.media.results[0] || data;
            },
            resultDisplay: function () {
                return this.isEpisode ? 'Episode' : 'Movie';
            },
            title: 'title',
            seriesTitle: cached(function (data) {
                if (data.details && data.details.programType) {
                    if (data.details.programType === 'Series') {
                        return data.seriesTitle;
                    } else {
                        //This is not a series, return undefined
                        return undefined;
                    }
                } else {
                    //We don't know what this is so just blindly return seriesTitle
                    return data.seriesTitle;
                }
            }),
            tmsProgramIds: 'tmsProgramIds',
            tmsSeriesId: 'tmsSeriesId',
            dsQueryId: 'dsQueryId', // Analytics
            searchResultIndex: 'searchResultIndex', // Analytics
            searchFacet: 'searchFacet', // Analytics
            providerAssetIds: 'providerAssetIds',
            isSeries: () => false,
            isEpisode: function (data) {
                return data.details &&
                    data.details.programType &&
                    data.details.programType == 'Series';
            },
            actions: 'actionGroups.defaultGroup.actionObjects',
            hasOtherWaysToWatch: function () {
                return this.hasWatchHereActions || this.hasWatchOnTvActions;
            },
            hasWatchOnTvActions: function () {
                return this.watchOnTvActions.length > 0;
            },
            watchOnTvActions: cached(function (data) {
                let watchOnTvGroup = (data.actionGroups.othersGroup || [])
                    .find(action => action.title === 'Watch On TV');
                return (watchOnTvGroup && watchOnTvGroup.actionObjects) || [];
            }),
            hasWatchHereActions: function () {
                return this.watchHereActions.length > 0;
            },
            watchHereActions: cached(function (data) {
                let watchGroup = (data.actionGroups.othersGroup || [])
                    .find(action => action.title === 'Watch Here');
                return (watchGroup && watchGroup.actionObjects) || [];
            }),
            otherWaysToWatch: 'actionGroups.othersGroup',
            allRatings: 'details.allRatings',
            rating: 'details.allRatings[0]',
            isBlocked: function (data) {
                if (data.details.allRatings && data.details.allRatings.length > 0) {
                    return parentalControlsService.isBlocked(data.details.allRatings,
                        data.ipTmsGuideServiceIds,
                        data.details.allIpVPPs)
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
            longDescription: 'details.long_desc',
            shortDescription: 'details.short_desc',
            year: 'details.year',
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
            watchListProviderAssetId: 'details.watchListProviderAssetID',
            streamList: cached(function (data) {
                return data.streamList ? data.streamList.map(s => streamViewModelDefinition.createInstance(s)) : [];
            }),
            network: 'network',
            networkImage: cached(delegateUtils.createNetworkImageFunction()),
            availableOutOfHome: 'availableOutOfHome',
            linearAvailableOutOfHome: 'linearAvailableOutOfHome',
            vodAvailableOutOfHome: 'vodAvailableOutOfHome',
            tvodAvailableOutOfHome: 'tvodAvailableOutOfHome',
            imageUri: cached(delegateUtils.createProductImageFunction()),
            defaultStream: cached(function () {
                return delegateUtils.getDefaultStream(this);
            }),
            runtimeDisplay: cached(function () {
                let stream = this.defaultStream;
                return stream && dateFormat.runtime(stream.streamProperties.runtimeInSeconds);
            }),
            genres: cached(function (data) {
                if (data && data.details && data.details.genres) {
                    return data.details.genres.map(g => g.name);
                } else {
                    return [];
                }
            }),
            genreString: function () {
                return this.genres.join(', ');
            },
            //Compile the format and details list for display on the product page
            streamProps: cached(function () {
                return delegateUtils.getStreamProps(this.streamList);
            }),
            programType: cached(function (data) {
                return data.details.programType;
            }),
            contentClass: cached(function (data) {
                var stream = this.defaultStream;
                var programType = data.details.programType;
                var streamProps;

                if (!stream) {
                    return undefined;
                }

                streamProps = stream.streamProperties;

                if (stream.type === 'LINEAR') {
                    return 'linear';
                } else if (stream.type === 'ONLINE_ONDEMAND') {
                    if (programType === 'Preview') {
                        return 'extra';
                    } else {
                        return streamProps.ondemandStreamType;
                    }
                } else {
                    return undefined;
                }
            }),
            expires: cached(function () {
                var stream = this.defaultStream;
                if (stream &&
                    stream.streamProperties &&
                    stream.streamProperties.endTime) {

                    return dateFormat.relative(parseInt(stream.streamProperties.endTime));
                }
            }),
            commonSenseMedia: 'details.commonSenseMediaV2.rating',
            programMetadata: 'details.programMetadata',
            metaCritic: 'details.metacritic.rating',
            clickRoute: cached(function (data) {
                if (data.details &&
                    data.details.sportsResultsCategory &&
                    data.details.isLive &&
                    (data.details.isOnNow ||
                        (data.details.schedStartTimeSec < (Date.now() / 1000) &&
                            data.details.schedEndTimeSec > (Date.now() / 1000)))) {
                    let id = (data.details && data.details.onNowGuideServiceId) || data.tmsGuideServiceIds[0];
                    return ['ovp.livetv', {tmsid: id}];
                } else {
                    return ['product.event', {
                        tmsId: data.tmsProgramIds[0],
                        uri: data.uri
                    }];
                }
            }),
            bookmark: function (data) {
                let bookmark, stream = this.defaultStream;
                if (stream && stream.streamProperties) {
                    bookmark = stream.streamProperties.bookmark;
                }
                if (!bookmark) {
                    bookmark = BookmarkService.getBookmarkByTmsProgramId(data.tmsProgramIds[0]);
                }
                // NGC-4273: Because of ODN bug we are getting invalid playMarkerSeconds value
                // when we play an asset till end on ODN STB.
                if (bookmark) {
                    bookmark.playMarkerSeconds = Math.min(bookmark.playMarkerSeconds, bookmark.runtimeSeconds);
                }
                return bookmark;
            },
            playedPct: function () {
                if (this.bookmark) {
                    return (this.bookmark.playMarkerSeconds / this.bookmark.runtimeSeconds) * 100;
                }
            },
            sportsCategory: 'details.sportsResultsCategory',
            isLive: 'details.isLive',
            isOnNow: function (data) {
                return data.details.isLive ||
                    data.details.isOnNow ||
                    this.streamList.some(stream => stream.isLinearStream && stream.isOnNow);
            },
            isReplay: 'details.isReplay',
            isPreview: function (data) {
                return data.details && data.details.programType == 'Preview';
            },
            scheduledStartTimeSec: 'details.schedStartTimeSec',
            scheduledEndTimeSec: 'details.schedEndTimeSec',
            isEntitled: function (data) {
                if (this.tvodStream) {
                    // Tvod assets arent technically entitled until they are purchased
                    //  but we don't want to scare the user away with key icons
                    return true;
                } else {
                    return data.details.entitled;
                }
            },
            isLinearEntitledIp: 'details.linearEntitledIp',
            isLinearEntitledQam: 'details.linearEntitledQam',
            isTvodEntitled: 'details.tvodEntitled',
            isOutOfWindow: 'vodOutOfWindow',
            viewStatus: function () {
                if (this.isOnNow) {
                    return 'On Now';
                } else if (this.playedPct > 0) {
                    return this.playedPct;
                } else if (this.cdvrRecordedStream) {
                    return 'DVR';  // UNISTR - DVR
                } else if (this.dvrStream) {
                    return 'DVR';
                } else if (this.entitledOnDemandStream) {
                    return 'On Demand';
                } else if (this.nextLinearStream) {
                    return dateFormat.relative.short(parseInt(this.nextLinearStream.streamProperties.startTime));
                } else {
                    return '----';
                }
            },
            cdvrStartTime: function () {
                let stream = this.streamList.find(stream => {
                    if (stream.streamProperties.cdvrRecording) {
                        return stream.streamProperties.cdvrRecording.cdvrState === CDVR_STATE.SCHEDULED ||
                            stream.streamProperties.cdvrRecording.cdvrState === CDVR_STATE.IN_PROGRESS;
                    } else {
                        return false;
                    }
                });
                if (stream) {
                    return stream.streamProperties.startTime;
                }
            },
            cdvrRecordedStream: function () {
                // Only recorded streams have a stream type of CDVR

                return this.streamList.find(stream => stream.type === 'CDVR');
            },
            cdvrRecordingGuideId: 'details.latest_episode.streamList[0].streamProperties.cdvrRecording.tmsGuideId',

            // Returns true if there are CDVR recordings and none are in the completed state
            cdvrHasNotCompleted: function () {
                let hasCdvr = false;
                let hasNotCompleted = this.streamList.some(stream => {
                    let cdvrRecording = stream.streamProperties && stream.streamProperties.cdvrRecording;
                    if (cdvrRecording) {
                        hasCdvr = true;
                    }
                    return cdvrRecording && stream.cdvrNotCompleted;
                });

                return hasCdvr && hasNotCompleted;
            },
            cdvrRecording: cached(function () {
                if (this.defaultStream) {
                    let stream = this.defaultStream;
                    if (stream &&
                        stream.streamProperties &&
                        stream.streamProperties.cdvrRecording) {
                        return stream.streamProperties.cdvrRecording;
                    }
                }
            }),
            dvrStream: function () {
                return this.streamList.find(stream => stream.type === 'DVR');
            },
            entitledOnDemandStream: function () {
                return this.streamList.find(stream => stream.isOnDemandStream && stream.isEntitled);
            },
            tvodStream: function () {
                return this.streamList.find(stream => {
                    //Price is available in the mini list
                    return (stream.type === 'ONLINE_ONDEMAND' &&
                        stream.streamProperties.price > 0);
                });
            },
            entitledTvodStream: function () {
                return this.streamList.find(str => str.streamProperties.tvodEntitlement);
            },
            freeODStream: function () {
                return this.streamList.find(stream => {
                    //Price is 0 in the mini list
                    return (stream.type === 'ONLINE_ONDEMAND' &&
                        Math.round(stream.streamProperties.price) === 0);
                });
            },
            linearStream: function () {
                return this.streamList.find(stream => stream.type === 'LINEAR');
            },
            // Selects the linear stream that is in the future but closest to the current time.
            //    Won't select a stream that is currently airing.
            nextLinearStream: function () {
                let now = Date.now();
                return this.streamList
                    .filter(stream => stream.type == 'LINEAR')
                    .filter(stream => parseInt(stream.streamProperties.startTime) > now)
                    .sort((a, b) => parseInt(a.streamProperties.startTime) - parseInt(b.streamProperties.startTime))
                    [0];

            },
            seasonNumber: 'details.season_number',
            episodeNumber: 'details.episode_number',
            originalAirDate: 'details.original_air_date',
            isBlockedByRating: function () {
                throw 'Depreciated, isBlockedByRating should no longer be used';
            },
            otherWaysAction: function () {
                if (this.actions) {
                    return this.actions.find((action) => {
                        return (action.actionType === 'otherWaysToWatch');
                    });
                } else {
                    return false;
                }
            },
            staleDvrCache: 'details.staleDvrCache',
            price: delegateUtils.promiseCached(function (data) {
                let price;
                let rent = data && data.actionGroups &&
                    data.actionGroups.defaultGroup &&
                    data.actionGroups.defaultGroup.actionObjects &&
                    data.actionGroups.defaultGroup.actionObjects.find(
                         action => action.actionType === 'rentOnDemand');

                if (rent) {
                    price = this.streamList[rent.streamIndex].streamProperties.price;
                } else if (this.tvodStream) {
                    price = this.tvodStream.streamProperties.price;
                } else if (this.freeODStream) {
                    price = messages.getMessageForCode('MSG-9069');
                }

                return price;
            }),
            rentalExpiration: cached(function () {
                if (this.streamList) {
                    let entitledStream = this.entitledTvodStream;
                    if (entitledStream) {
                        let entitled = entitledStream.streamProperties.tvodEntitlement;
                        let date = new Date(entitled.rentalEndTimeUtcSeconds * 1000);
                        return 'Expires ' + dateFormat.absolute.tiny.atTime(date);
                    }
                }
                return null;
            }),
            playable: function () {
                if (this.rentalExpiration !== null || this.isEntitled) {
                    return true;
                } else {
                    return false;
                }
            },
            playAction: function (data) {
                return () => {
                    if (this.playable) {
                        $state.go('ovp.ondemand.playProduct', {
                            productID: data.tmsProgramIds[0],
                            rented: (this.rentalExpiration) ? true : false
                        });
                    }
                };
            },
            isComplexOffering: cached(function () {
                return this.streamList.filter(strm =>
                    strm.type === 'ONLINE_ONDEMAND' &&
                        strm.streamProperties.price > 0 &&
                        !strm.streamProperties.tvodEntitlement
                ).length > 1;
            }),
            episode: 'details.episode_number',
            season: 'details.season_number'

        });
    }

    /* @ngInject */
    function registerDelegate(eventViewModelDefinition, delegateFactory) {
        function isEvent(asset) {
            let type = asset.type ||
                (asset.media &&
                    asset.media.results &&
                    asset.media.results[0] &&
                    asset.media.results[0].type);

            return type === 'event';
        }

        delegateFactory.registerDelegateDefinition(eventViewModelDefinition, isEvent);
    }
}());
