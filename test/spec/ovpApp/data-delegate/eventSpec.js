/*globals mockData*/
describe('eventViewModelDefinition', function () {
    'use strict';

    var eventViewModelDefinition, parentalControlsService, $q, $rootScope, delegateUtils, BookmarkService, EntitlementsService, CDVR_STATE, $state;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function (_eventViewModelDefinition_, _parentalControlsService_, _$q_, _$rootScope_, _delegateUtils_, _BookmarkService_, _EntitlementsService_, _CDVR_STATE_, _$state_) {
        eventViewModelDefinition = _eventViewModelDefinition_;
        parentalControlsService = _parentalControlsService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        delegateUtils = _delegateUtils_;
        BookmarkService = _BookmarkService_;
        EntitlementsService = _EntitlementsService_;
        CDVR_STATE = _CDVR_STATE_;
        $state = _$state_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(eventViewModelDefinition).toBeDefined();
        let ins = eventViewModelDefinition.createInstance({
            title: 'mock title'
        });
        expect(ins.title).toBe('mock title');
    });

    it('should have relevant information - part 1', function() {
        let data = mockData.nnsMovieDataMV006133690000.media.results[0],
            eventView = eventViewModelDefinition.createInstance(data);
        expect(eventView.title).toBe(data.title);
        expect(eventView.tmsProgramIds).toBe(data.tmsProgramIds);
        expect(eventView.tmsSeriesId).toBe(data.tmsSeriesId);
        expect(eventView.providerAssetIds).toBe(data.providerAssetIds);
        expect(eventView.actions).toBe(data.actionGroups.defaultGroup.actionObjects);
        expect(eventView.otherWaysToWatch).toBe(data.actionGroups.othersGroup);
        expect(eventView.allRatings).toBe(data.details.allRatings);
        expect(eventView.rating).toBe(data.details.allRatings[0]);
        expect(eventView.isBlockedReason).toBe(data.blockedReason);
        expect(eventView.longDescription).toBe(data.details.long_desc);
        expect(eventView.shortDescription).toBe(data.details.short_desc);
        expect(eventView.year).toBe(data.details.year);
        expect(eventView.network).toBe(data.network);
        expect(eventView.availableOutOfHome).toBe(data.availableOutOfHome);
        expect(eventView.linearAvailableOutOfHome).toBe(data.linearAvailableOutOfHome);
        expect(eventView.vodAvailableOutOfHome).toBe(data.vodAvailableOutOfHome);
        expect(eventView.tvodAvailableOutOfHome).toBe(data.tvodAvailableOutOfHome);
        expect(eventView.commonSenseMedia).toBe(data.details.commonSenseMediaV2.rating);
        expect(eventView.programMetadata).toBe(data.details.programMetadata);
        expect(eventView.metaCritic).toBe(data.details.metacritic.rating);
        expect(eventView.sportsCategory).toBe(data.details.sportsResultsCategory);
        expect(eventView.isLive).toBe(data.details.isLive);
        expect(eventView.isReplay).toBe(data.details.isReplay);
        expect(eventView.scheduledStartTimeSec).toBe(data.details.schedStartTimeSec);
        expect(eventView.scheduledEndTimeSec).toBe(data.details.schedEndTimeSec);
        expect(eventView.isOutOfWindow).toBe(data.vodOutOfWindow);
        expect(eventView.seasonNumber).toBe(data.details.season_number);
        expect(eventView.episodeNumber).toBe(data.details.episode_number);
        expect(eventView.originalAirDate).toBe(data.details.original_air_date);
        expect(eventView.staleDvrCache).toBe(data.details.staleDvrCache);
        expect(eventView.episode).toBe(data.details.episode_number);
        expect(eventView.season).toBe(data.details.season_number);
        expect(eventView.resultDisplay).toBe('Movie');
        expect(eventView.programType).toBe('FeatureFilm');
        expect(eventView.price).toBe('Free');
    });

    it('should have relevant information - part 2', function() {
        let data = mockData.nnsSeriesData184481.details.latest_episode,
            eventView = eventViewModelDefinition.createInstance(data);
        expect(eventView.title).toBe(data.title);
        expect(eventView.tmsProgramIds).toBe(data.tmsProgramIds);
        expect(eventView.tmsSeriesId).toBe(data.tmsSeriesId);
        expect(eventView.providerAssetIds).toBe(data.providerAssetIds);
        expect(eventView.actions).toBe(data.actionGroups.defaultGroup.actionObjects);
        expect(eventView.otherWaysToWatch).toBe(data.actionGroups.othersGroup);
        expect(eventView.allRatings).toBe(data.details.allRatings);
        expect(eventView.rating).toBe(data.details.allRatings[0]);
        expect(eventView.isBlockedReason).toBe(data.blockedReason);
        expect(eventView.longDescription).toBe(data.details.long_desc);
        expect(eventView.shortDescription).toBe(data.details.short_desc);
        expect(eventView.year).toBe(data.details.year);
        expect(eventView.network).toBe(data.network);
        expect(eventView.availableOutOfHome).toBe(data.availableOutOfHome);
        expect(eventView.linearAvailableOutOfHome).toBe(data.linearAvailableOutOfHome);
        expect(eventView.vodAvailableOutOfHome).toBe(data.vodAvailableOutOfHome);
        expect(eventView.tvodAvailableOutOfHome).toBe(data.tvodAvailableOutOfHome);
        expect(eventView.programMetadata).toBe(data.details.programMetadata);
        expect(eventView.sportsCategory).toBe(data.details.sportsResultsCategory);
        expect(eventView.isLive).toBe(data.details.isLive);
        expect(eventView.isReplay).toBe(data.details.isReplay);
        expect(eventView.scheduledStartTimeSec).toBe(data.details.schedStartTimeSec);
        expect(eventView.scheduledEndTimeSec).toBe(data.details.schedEndTimeSec);
        expect(eventView.isOutOfWindow).toBe(data.vodOutOfWindow);
        expect(eventView.seasonNumber).toBe(data.details.season_number);
        expect(eventView.episodeNumber).toBe(data.details.episode_number);
        expect(eventView.originalAirDate).toBe(data.details.original_air_date);
        expect(eventView.staleDvrCache).toBe(data.details.staleDvrCache);
        expect(eventView.episode).toBe(data.details.episode_number);
        expect(eventView.season).toBe(data.details.season_number);
        expect(eventView.resultDisplay).toBe('Episode');
        expect(eventView.programType).toBe('Series');
    });

    it('should have valid seriesTitle value', function () {
        let eventView1 = eventViewModelDefinition.createInstance({
            details: {programType: 'Movie'},
            seriesTitle: 'mock series title'
        }),
        eventView2 = eventViewModelDefinition.createInstance({
            details: {programType: 'Series'},
            seriesTitle: 'mock series title'
        }),
        eventView3 = eventViewModelDefinition.createInstance({
            seriesTitle: 'mock series title'
        });

        expect(eventView1.seriesTitle).toBe(undefined);
        expect(eventView3.seriesTitle).toBe('mock series title');
        expect(eventView2.seriesTitle).toBe('mock series title');
    });

    it('should have valid isEpisode value', function () {
        let eventView1 = eventViewModelDefinition.createInstance({
            details: {programType: 'Movie'},
            seriesTitle: 'mock series title'
        }),
        eventView2 = eventViewModelDefinition.createInstance({
            details: {programType: 'Series'},
            seriesTitle: 'mock series title'
        }),
        eventView3 = eventViewModelDefinition.createInstance({
            seriesTitle: 'mock series title'
        });
        expect(eventView1.isEpisode).toBe(false);
        expect(eventView3.isEpisode).toBe(undefined);
        expect(eventView2.isEpisode).toBe(true);
        expect(eventView1.resultDisplay).toBe('Movie');
        expect(eventView2.resultDisplay).toBe('Episode');
        expect(eventView3.resultDisplay).toBe('Movie');
    })

    it('should have valid hasOtherWaysToWatch value', function () {
        let eventView1 = eventViewModelDefinition.createInstance({
            actionGroups: {
                othersGroup: [{
                    title: 'Watch On TV',
                    'actionObjects': [{
						'actionType': 'scheduleRecording',
						'streamIndex': 1
					}]
                }, {
                    title: 'Watch Here',
                    'actionObjects': [{
						'actionType': 'cdvrCancelRecording',
						'streamIndex': 0
					}, {
						'actionType': 'cdvrScheduleRecording',
						'streamIndex': 1
					}]
                }]
            }
        }), eventView2 = eventViewModelDefinition.createInstance({
            actionGroups: {
                othersGroup: [{
                    title: 'Watch On TV',
                    'actionObjects': [{
						'actionType': 'scheduleRecording',
						'streamIndex': 1
					}]
                }, {
                    title: 'Watch Here',
                    'actionObjects': []
                }]
            }
        }), eventView3 = eventViewModelDefinition.createInstance({
            actionGroups: {
                othersGroup: [{
                    title: 'Watch On TV',
                    'actionObjects': []
                }, {
                    title: 'Watch Here',
                    'actionObjects': [{
						'actionType': 'cdvrCancelRecording',
						'streamIndex': 0
					}, {
						'actionType': 'cdvrScheduleRecording',
						'streamIndex': 1
					}]
                }]
            }
        });

        expect(eventView1.hasOtherWaysToWatch).toBe(true);
        expect(eventView2.hasOtherWaysToWatch).toBe(true);
        expect(eventView3.hasOtherWaysToWatch).toBe(true);

        expect(eventView1.hasWatchOnTvActions).toBe(true);
        expect(eventView2.hasWatchOnTvActions).toBe(true);
        expect(eventView3.hasWatchOnTvActions).toBe(false);

        expect(eventView1.hasWatchHereActions).toBe(true);
        expect(eventView2.hasWatchHereActions).toBe(false);
        expect(eventView3.hasWatchHereActions).toBe(true);

        expect(eventView1.watchOnTvActions).toEqual([{
            'actionType': 'scheduleRecording',
            'streamIndex': 1
        }]);
        expect(eventView2.watchOnTvActions).toEqual([{
            'actionType': 'scheduleRecording',
            'streamIndex': 1
        }]);
        expect(eventView3.watchOnTvActions).toEqual([]);

        expect(eventView1.watchHereActions).toEqual([{
            'actionType': 'cdvrCancelRecording',
            'streamIndex': 0
        }, {
            'actionType': 'cdvrScheduleRecording',
            'streamIndex': 1
        }]);
        expect(eventView2.watchHereActions).toEqual([]);
        expect(eventView3.watchHereActions).toEqual([{
            'actionType': 'cdvrCancelRecording',
            'streamIndex': 0
        }, {
            'actionType': 'cdvrScheduleRecording',
            'streamIndex': 1
        }]);
    });

    it('should have valid isBlocked', function(done) {
        let data = mockData.nnsMovieDataMV006133690000.media.results[0],
            eventView = eventViewModelDefinition.createInstance(data),
            deferred = $q.defer();
        parentalControlsService.isBlocked = () => $q.resolve({ isBlocked: true, reason: 'isBlocked' });
        expect(data.blockedReason).toBe(undefined);
        eventView.isBlocked.then(result => {
            expect(result).toBe(true);
            expect(data.blockedReason).toBe('isBlocked');
            done();
        });
        $rootScope.$apply();
    });

    it('should have valid crew value', function () {
        let data = mockData.nnsMovieDataMV006133690000.media.results[0],
            eventView = eventViewModelDefinition.createInstance(data);
        expect(eventView.crew.length).toBe(data.details.crew.length);
        for (let i = 0; i < data.details.crew.length; i++) {
            expect(eventView.crew[i].name).toBe(data.details.crew[i].name);
            expect(eventView.crew[i].role).toBe(data.details.crew[i].role);
        }
    });

    it('should have valid genres value', function () {
        let eventView = eventViewModelDefinition.createInstance({
            details: {
                genres: [
                    {name: 'genre 1'},
                    {name: 'genre 2'}
                ]
            }
        });

        expect(eventView.genres).toEqual(['genre 1', 'genre 2']);
        expect(eventView.genreString).toBe('genre 1, genre 2');
    });

    it('should have valid streamProps value', function () {
        let data = mockData.nnsMovieDataMV006133690000.media.results[0],
            eventView = eventViewModelDefinition.createInstance(data);
        expect(eventView.streamProps).toEqual({"formats":["HD"],"attributes":['Stereo', "CC"]});
    });

    it('should have valid contentClass value', function () {
        delegateUtils.getDefaultStream = () => {
            return {
                type: 'ONLINE_ONDEMAND',
                streamProperties: {
                    ondemandStreamType: 'ondemandStreamType'
                }
            }
        };
        let eventView1 = eventViewModelDefinition.createInstance({
            details: {programType: 'Movie'}
        }),eventView2 = eventViewModelDefinition.createInstance({
            details: {programType: 'Preview'}
        });

        expect(eventView1.contentClass).toBe('ondemandStreamType');
        expect(eventView2.contentClass).toBe('extra');

        delegateUtils.getDefaultStream = () => {
            return {
                type: 'LINEAR',
                streamProperties: {
                    title: 'mock title'
                }
            }
        },
        eventView1 = eventViewModelDefinition.createInstance({
            details: {programType: 'Movie'}
        }),eventView2 = eventViewModelDefinition.createInstance({
            details: {programType: 'Preview'}
        });

        expect(eventView1.contentClass).toBe('linear');
        expect(eventView2.contentClass).toBe('linear');
    });

    it('should have valid clickRoute value', function () {
        let data = mockData.nnsMovieDataMV006133690000.media.results[0],
            eventView = eventViewModelDefinition.createInstance(data);
        expect(eventView.clickRoute).toEqual(['product.event', {
            tmsId: data.details.tmsProviderProgramID,
            uri: data.uri
        }]);
    });

    it('should display a bookmark if there is a bookmark set on any stream', function () {
        delegateUtils.getBookmark = function () {return null;};
        BookmarkService.getBookmarkByTmsProgramId = function() {
            return {
                playMarkerSeconds: 10,
                runtimeSeconds: 100
            };
        };
        let eventView = eventViewModelDefinition.createInstance({tmsProgramIds: [1, 2]});

        expect(eventView.bookmark).toEqual({
            playMarkerSeconds: 10,
            runtimeSeconds: 100
        });
        expect(eventView.playedPct).toBe(10);

        eventView = eventViewModelDefinition.createInstance({tmsProgramIds: [1, 2],
                        streamList: [{streamProperties: {bookmark: {
                            playMarkerSeconds: 40,
                            runtimeSeconds: 200
                        }}}]
                    });

        expect(eventView.bookmark).toEqual({
            playMarkerSeconds: 40,
            runtimeSeconds: 200
        });
        expect(eventView.playedPct).toBe(20);
    });

    it('should have valid entitlement', function () {
        let eventView1 = eventViewModelDefinition.createInstance({details: {entitled: true}}),
            eventView2 = eventViewModelDefinition.createInstance({details: {entitled: false}});
        expect(eventView1.isEntitled).toBe(true);
        expect(eventView2.isEntitled).toBe(false);
    });

    it('should have valid viewStatus value', function () {
        BookmarkService.getBookmarkByTmsProgramId = () => null;
        let eventView1 = eventViewModelDefinition.createInstance({details: {isOnNow: true}}),
            eventView2 = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'CDVR'}]}),
            eventView3 = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'DVR'}]}),
            eventView4 = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'ONLINE_ONDEMAND', streamProperties: {tvodEntitlement: 'abc'}}]}),
            startTime = (Date.now() + 1000),
            eventView5 = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'LINEAR', streamProperties: {startTime: startTime, cdvrRecording: true}}]});

        expect(eventView1.viewStatus).toBe('On Now');
        expect(eventView2.viewStatus).toBe('DVR');
        expect(eventView3.viewStatus).toBe('DVR');
        expect(eventView4.viewStatus).toBe('On Demand');
        expect(eventView5.viewStatus).toBe('Yesterday');

        let eventView6 = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2],
                            streamList: [{streamProperties: {bookmark: {
                                playMarkerSeconds: 40,
                                runtimeSeconds: 200
                            }}}]
                    });
        expect(eventView6.viewStatus).toBe(20);
    });

    it('should have valid cdvrStartTime value', function () {
        let startTime = (Date.now() + 1000),
            eventView = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'LINEAR', streamProperties: {startTime: startTime, cdvrRecording: {cdvrState: CDVR_STATE.SCHEDULED}}}]});
        expect(eventView.cdvrStartTime).toBe(startTime);
    });

    it('should have valid cdvrHasNotCompleted value', function () {
        let startTime = (Date.now() + 1000),
            eventView = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'LINEAR', cdvrNotCompleted: true, streamProperties: {startTime: startTime, cdvrRecording: {cdvrState: CDVR_STATE.SCHEDULED}}}]});
        expect(eventView.cdvrHasNotCompleted).toBe(true);
    });

    it('should have valid rentalExpiration value', function () {
        $state.go = jasmine.createSpy('dummy');
        let rentalExpiration = (Date.now() * 1000 + 10000),
            eventView = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'ONLINE_ONDEMAND', streamProperties: {tvodEntitlement: {rentalEndTimeUtcSeconds: rentalExpiration}, price: 5}},
                    {title: 'mock title2', type: 'ONLINE_ONDEMAND', streamProperties: {tvodEntitlement: {rentalEndTimeUtcSeconds: rentalExpiration}, price: 10}}]}),
            eventView1 = eventViewModelDefinition.createInstance({details: {}, tmsProgramIds: [1, 2], streamList: [{title: 'mock title', type: 'ONLINE_ONDEMAND', streamProperties: {price: 5}},
                    {title: 'mock title2', type: 'ONLINE_ONDEMAND', streamProperties: {price: 10}}]});
        expect(eventView.rentalExpiration).not.toBe(null);
        expect(eventView.playable).toBe(true);
        expect(eventView.isComplexOffering).toBe(false);
        expect(eventView1.isComplexOffering).toBe(true);
        eventView.playAction();
        expect($state.go).toHaveBeenCalledWith('ovp.ondemand.playProduct', { productID : 1, rented : true });
    });
});
