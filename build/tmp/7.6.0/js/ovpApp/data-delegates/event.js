'use strict';

(function () {
    'use strict';
    eventViewModelDefinition.$inject = ["DataDelegate", "BookmarkService", "$q", "delegateUtils", "$filter", "parentalControlsService", "dateFormat", "delegateFactory", "EntitlementsService", "config", "$state", "messages", "streamViewModelDefinition", "CDVR_STATE", "personViewModelDefinition"];
    registerDelegate.$inject = ["eventViewModelDefinition", "delegateFactory"];
    angular.module('ovpApp.dataDelegate').factory('eventViewModelDefinition', eventViewModelDefinition).run(registerDelegate);

    /**
     * "Event" objects are used to represent a movie or episode, usually in a non
     * search context. Not to be confused with "Product" objects, which are also
     * used to represent a movie, but only come up inside search.
     */

    /* @ngInject */
    function eventViewModelDefinition(DataDelegate, BookmarkService, $q, delegateUtils, $filter, parentalControlsService, dateFormat, delegateFactory, EntitlementsService, config, $state, messages, streamViewModelDefinition, CDVR_STATE, personViewModelDefinition) {
        var cached = delegateUtils.cached;

        return new DataDelegate({
            _mutator: function _mutator(data) {
                return data && data.media && data.media.results && data.media.results[0] || data;
            },
            resultDisplay: function resultDisplay() {
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
            isSeries: function isSeries() {
                return false;
            },
            isEpisode: function isEpisode(data) {
                return data.details && data.details.programType && data.details.programType == 'Series';
            },
            actions: 'actionGroups.defaultGroup.actionObjects',
            hasOtherWaysToWatch: function hasOtherWaysToWatch() {
                return this.hasWatchHereActions || this.hasWatchOnTvActions;
            },
            hasWatchOnTvActions: function hasWatchOnTvActions() {
                return this.watchOnTvActions.length > 0;
            },
            watchOnTvActions: cached(function (data) {
                var watchOnTvGroup = (data.actionGroups.othersGroup || []).find(function (action) {
                    return action.title === 'Watch On TV';
                });
                return watchOnTvGroup && watchOnTvGroup.actionObjects || [];
            }),
            hasWatchHereActions: function hasWatchHereActions() {
                return this.watchHereActions.length > 0;
            },
            watchHereActions: cached(function (data) {
                var watchGroup = (data.actionGroups.othersGroup || []).find(function (action) {
                    return action.title === 'Watch Here';
                });
                return watchGroup && watchGroup.actionObjects || [];
            }),
            otherWaysToWatch: 'actionGroups.othersGroup',
            allRatings: 'details.allRatings',
            rating: 'details.allRatings[0]',
            isBlocked: function isBlocked(data) {
                if (data.details.allRatings && data.details.allRatings.length > 0) {
                    return parentalControlsService.isBlocked(data.details.allRatings, data.ipTmsGuideServiceIds, data.details.allIpVPPs).then(function (result) {
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
            watchListProviderAssetId: 'details.watchListProviderAssetID',
            streamList: cached(function (data) {
                return data.streamList ? data.streamList.map(function (s) {
                    return streamViewModelDefinition.createInstance(s);
                }) : [];
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
                var stream = this.defaultStream;
                return stream && dateFormat.runtime(stream.streamProperties.runtimeInSeconds);
            }),
            genres: cached(function (data) {
                if (data && data.details && data.details.genres) {
                    return data.details.genres.map(function (g) {
                        return g.name;
                    });
                } else {
                    return [];
                }
            }),
            genreString: function genreString() {
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
                if (stream && stream.streamProperties && stream.streamProperties.endTime) {

                    return dateFormat.relative(parseInt(stream.streamProperties.endTime));
                }
            }),
            commonSenseMedia: 'details.commonSenseMediaV2.rating',
            programMetadata: 'details.programMetadata',
            metaCritic: 'details.metacritic.rating',
            clickRoute: cached(function (data) {
                if (data.details && data.details.sportsResultsCategory && data.details.isLive && (data.details.isOnNow || data.details.schedStartTimeSec < Date.now() / 1000 && data.details.schedEndTimeSec > Date.now() / 1000)) {
                    var id = data.details && data.details.onNowGuideServiceId || data.tmsGuideServiceIds[0];
                    return ['ovp.livetv', { tmsid: id }];
                } else {
                    return ['product.event', {
                        tmsId: data.tmsProgramIds[0],
                        uri: data.uri
                    }];
                }
            }),
            bookmark: function bookmark(data) {
                var bookmark = undefined,
                    stream = this.defaultStream;
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
            playedPct: function playedPct() {
                if (this.bookmark) {
                    return this.bookmark.playMarkerSeconds / this.bookmark.runtimeSeconds * 100;
                }
            },
            sportsCategory: 'details.sportsResultsCategory',
            isLive: 'details.isLive',
            isOnNow: function isOnNow(data) {
                return data.details.isLive || data.details.isOnNow || this.streamList.some(function (stream) {
                    return stream.isLinearStream && stream.isOnNow;
                });
            },
            isReplay: 'details.isReplay',
            isPreview: function isPreview(data) {
                return data.details && data.details.programType == 'Preview';
            },
            scheduledStartTimeSec: 'details.schedStartTimeSec',
            scheduledEndTimeSec: 'details.schedEndTimeSec',
            isEntitled: function isEntitled(data) {
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
            viewStatus: function viewStatus() {
                if (this.isOnNow) {
                    return 'On Now';
                } else if (this.playedPct > 0) {
                    return this.playedPct;
                } else if (this.cdvrRecordedStream) {
                    return 'DVR'; // UNISTR - DVR
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
            cdvrStartTime: function cdvrStartTime() {
                var stream = this.streamList.find(function (stream) {
                    if (stream.streamProperties.cdvrRecording) {
                        return stream.streamProperties.cdvrRecording.cdvrState === CDVR_STATE.SCHEDULED || stream.streamProperties.cdvrRecording.cdvrState === CDVR_STATE.IN_PROGRESS;
                    } else {
                        return false;
                    }
                });
                if (stream) {
                    return stream.streamProperties.startTime;
                }
            },
            cdvrRecordedStream: function cdvrRecordedStream() {
                // Only recorded streams have a stream type of CDVR

                return this.streamList.find(function (stream) {
                    return stream.type === 'CDVR';
                });
            },
            cdvrRecordingGuideId: 'details.latest_episode.streamList[0].streamProperties.cdvrRecording.tmsGuideId',

            // Returns true if there are CDVR recordings and none are in the completed state
            cdvrHasNotCompleted: function cdvrHasNotCompleted() {
                var hasCdvr = false;
                var hasNotCompleted = this.streamList.some(function (stream) {
                    var cdvrRecording = stream.streamProperties && stream.streamProperties.cdvrRecording;
                    if (cdvrRecording) {
                        hasCdvr = true;
                    }
                    return cdvrRecording && stream.cdvrNotCompleted;
                });

                return hasCdvr && hasNotCompleted;
            },
            cdvrRecording: cached(function () {
                if (this.defaultStream) {
                    var stream = this.defaultStream;
                    if (stream && stream.streamProperties && stream.streamProperties.cdvrRecording) {
                        return stream.streamProperties.cdvrRecording;
                    }
                }
            }),
            dvrStream: function dvrStream() {
                return this.streamList.find(function (stream) {
                    return stream.type === 'DVR';
                });
            },
            entitledOnDemandStream: function entitledOnDemandStream() {
                return this.streamList.find(function (stream) {
                    return stream.isOnDemandStream && stream.isEntitled;
                });
            },
            tvodStream: function tvodStream() {
                return this.streamList.find(function (stream) {
                    //Price is available in the mini list
                    return stream.type === 'ONLINE_ONDEMAND' && stream.streamProperties.price > 0;
                });
            },
            entitledTvodStream: function entitledTvodStream() {
                return this.streamList.find(function (str) {
                    return str.streamProperties.tvodEntitlement;
                });
            },
            freeODStream: function freeODStream() {
                return this.streamList.find(function (stream) {
                    //Price is 0 in the mini list
                    return stream.type === 'ONLINE_ONDEMAND' && Math.round(stream.streamProperties.price) === 0;
                });
            },
            linearStream: function linearStream() {
                return this.streamList.find(function (stream) {
                    return stream.type === 'LINEAR';
                });
            },
            // Selects the linear stream that is in the future but closest to the current time.
            //    Won't select a stream that is currently airing.
            nextLinearStream: function nextLinearStream() {
                var now = Date.now();
                return this.streamList.filter(function (stream) {
                    return stream.type == 'LINEAR';
                }).filter(function (stream) {
                    return parseInt(stream.streamProperties.startTime) > now;
                }).sort(function (a, b) {
                    return parseInt(a.streamProperties.startTime) - parseInt(b.streamProperties.startTime);
                })[0];
            },
            seasonNumber: 'details.season_number',
            episodeNumber: 'details.episode_number',
            originalAirDate: 'details.original_air_date',
            isBlockedByRating: function isBlockedByRating() {
                throw 'Depreciated, isBlockedByRating should no longer be used';
            },
            otherWaysAction: function otherWaysAction() {
                if (this.actions) {
                    return this.actions.find(function (action) {
                        return action.actionType === 'otherWaysToWatch';
                    });
                } else {
                    return false;
                }
            },
            staleDvrCache: 'details.staleDvrCache',
            price: delegateUtils.promiseCached(function (data) {
                var price = undefined;
                var rent = data && data.actionGroups && data.actionGroups.defaultGroup && data.actionGroups.defaultGroup.actionObjects && data.actionGroups.defaultGroup.actionObjects.find(function (action) {
                    return action.actionType === 'rentOnDemand';
                });

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
                    var entitledStream = this.entitledTvodStream;
                    if (entitledStream) {
                        var entitled = entitledStream.streamProperties.tvodEntitlement;
                        var date = new Date(entitled.rentalEndTimeUtcSeconds * 1000);
                        return 'Expires ' + dateFormat.absolute.tiny.atTime(date);
                    }
                }
                return null;
            }),
            playable: function playable() {
                if (this.rentalExpiration !== null || this.isEntitled) {
                    return true;
                } else {
                    return false;
                }
            },
            playAction: function playAction(data) {
                var _this2 = this;

                return function () {
                    if (_this2.playable) {
                        $state.go('ovp.ondemand.playProduct', {
                            productID: data.tmsProgramIds[0],
                            rented: _this2.rentalExpiration ? true : false
                        });
                    }
                };
            },
            isComplexOffering: cached(function () {
                return this.streamList.filter(function (strm) {
                    return strm.type === 'ONLINE_ONDEMAND' && strm.streamProperties.price > 0 && !strm.streamProperties.tvodEntitlement;
                }).length > 1;
            }),
            episode: 'details.episode_number',
            season: 'details.season_number'

        });
    }

    /* @ngInject */
    function registerDelegate(eventViewModelDefinition, delegateFactory) {
        function isEvent(asset) {
            var type = asset.type || asset.media && asset.media.results && asset.media.results[0] && asset.media.results[0].type;

            return type === 'event';
        }

        delegateFactory.registerDelegateDefinition(eventViewModelDefinition, isEvent);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/event.js.map
