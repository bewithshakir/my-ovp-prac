/*globals mockData*/
describe('episodeListViewModelDefinition', function () {
    'use strict';

    var episodeListViewModelDefinition, testEpisode, delegateUtils,
        parentalControlsService, _bookmarkService, $q, $rootScope,
        EntitlementsService,
        selectn = (obj, prop) => {
            try {
                return eval('obj.' + prop);
            } catch (err) {
                return undefined;
            }
        },
        newEpisodes = [1, 2];

    beforeEach(function () {
        _bookmarkService = {
            getBookmarkByTmsProgramId: function (id) {
                return false;
            }
        };

        //BookmarkService.getBookmarkByTmsProgramId(data.tmsProgramIds[0]);
        module('ovpApp.dataDelegate');
        module(function ($provide) {
            $provide.value('BookmarkService', _bookmarkService);
            $provide.value('errorCodesService', mockErrorCodesService);
            $provide.value('profileService', mockProfileService);
        });
            
    });

    beforeEach(inject(function (_$q_, _$rootScope_, _parentalControlsService_, _episodeListViewModelDefinition_, _delegateUtils_, _EntitlementsService_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        delegateUtils = _delegateUtils_;
        parentalControlsService = _parentalControlsService_;
        episodeListViewModelDefinition = _episodeListViewModelDefinition_;
        EntitlementsService = _EntitlementsService_;

        delegateUtils.getEpisodesSince = function () {
            return newEpisodes;
        };
    }));

    /* jscs: disable */
    it('can create a series instance', function () {
        expect(episodeListViewModelDefinition).toBeDefined();
        let ins = episodeListViewModelDefinition.createInstance({
            title: 'mock title'
        });
        expect(ins.title).toBe('mock title');
    });

    it('can instantiate a full series', function() {
        expect(episodeListViewModelDefinition).toBeDefined();
        let theAffair = episodeListViewModelDefinition.createInstance(
            JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907))
        );
        expect(theAffair.title).toBe('The Affair');
        let seasons = theAffair.seasons;
        expect(seasons.length).toBe(2);
        expect(seasons[0].name).toBe('Season 2');
        expect(seasons[0].episodes).toBeDefined();
        expect(seasons[0].episodes.length).toBe(3);
        testEpisode = seasons[0].episodes[0];
    });


    //expect(episodeListViewModelDefinition).toBeDefined();

    it('should have relevant information', function() {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        expect(episodeList.resultDisplay).toBe('Series');
        expect(episodeList.title).toBe(seriesData.title);
        expect(episodeList.tmsSeriesId).toBe(seriesData.tmsSeriesId);
        expect(episodeList.isSeries).toBe(true);
        expect(episodeList.isEpisode).toBe(false);
        expect(episodeList.actions).toBe(selectn(seriesData, 'actionGroups.defaultGroup.actionObjects'));
        expect(episodeList.cdvrChannelPickerTmsGuideIds).toBe(seriesData.cdvrChannelPickerTmsGuideIds);
        expect(episodeList.availableOutOfHome).toBe(seriesData.availableOutOfHome);
        expect(episodeList.linearAvailableOutOfHome).toBe(seriesData.linearAvailableOutOfHome);
        expect(episodeList.vodAvailableOutOfHome).toBe(seriesData.vodAvailableOutOfHome);
        expect(episodeList.tvodAvailableOutOfHome).toBe(seriesData.tvodAvailableOutOfHome);
        expect(episodeList.allRatings).toBe(selectn(seriesData, 'details.allRatings'));
        expect(episodeList.rating).toBe(selectn(seriesData, 'details.allRatings[0]'));
        expect(episodeList.isBlockedReason).toBe(seriesData.blockedReason);
        expect(episodeList.isOutOfWindow).toBe(seriesData.vodOutOfWindow);
        expect(episodeList.watchListProviderAssetId).toBe(selectn(seriesData, 'details.latest_episode.details.watchListProviderAssetID'));
        expect(episodeList.network).toBe(seriesData.network);
        expect(episodeList.totalEpisodes).toBe(selectn(seriesData, 'details.totalEpisodes'));
        expect(episodeList.isSeriesRecording).toBe(selectn(seriesData, 'details.seriesRecording'));
        expect(episodeList.commonSenseMedia).toBe(selectn(seriesData, 'details.commonSenseMediaV2.rating'));
        expect(episodeList.metaCritic).toBe(selectn(seriesData, 'details.metacritic.rating'));
        expect(episodeList.sportsCategory).toBe(selectn(seriesData, 'details.sportsResultsCategory'));
        expect(episodeList.isLive).toBe(selectn(seriesData, 'details.isLive'));
        expect(episodeList.isOnNow).toBe(selectn(seriesData, 'details.isOnNow'));
        expect(episodeList.isReplay).toBe(selectn(seriesData, 'details.isReplay'));
        expect(episodeList.scheduledStartTimeSec).toBe(selectn(seriesData, 'details.schedStartTimeSec'));
        expect(episodeList.scheduledEndTimeSec).toBe(selectn(seriesData, 'details.schedEndTimeSec'));
        expect(episodeList.aleDvrCache).toBe(selectn(seriesData, 'details.staleDvrCache'));
        expect(episodeList.price).toBe(undefined);
        expect(episodeList.rentalExpiration).toBe(undefined);
        expect(episodeList.latestEpisode).toBeDefined();
    });

    it('should have valid episodesAvailable', function() {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
            // total episodes => 3 + 5, total preview => 1
        expect(episodeList.episodesAvailable).toBe(7);
    });

    it('should have valid newEpisodes', function() {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        expect(episodeList.newEpisodes).toBe(newEpisodes);
    });

    it('should have valid isBlocked', function(done) {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData),
            deferred = $q.defer();
        parentalControlsService.isBlocked = () => $q.resolve({ isBlocked: true, reason: 'isBlocked' });
        expect(seriesData.blockedReason).toBe(undefined);
        episodeList.isBlocked.then(result => {
            expect(result).toBe(true);
            expect(seriesData.blockedReason).toBe('isBlocked');
            done();
        });
        $rootScope.$apply();
    });

    it('should have valid entitlement', function () {
        let episodeList1 = episodeListViewModelDefinition.createInstance({details: {entitled: true}}),
            episodeList2 = episodeListViewModelDefinition.createInstance({details: {entitled: false}});
        expect(episodeList1.isEntitled).toBe(true);
        expect(episodeList2.isEntitled).toBe(false);
    });

    it('should have valid crew value', function () {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        expect(episodeList.crew.length).toBe(seriesData.details.crew.length);
        for (let i = 0; i < seriesData.details.crew.length; i++) {
            expect(episodeList.crew[i].name).toBe(seriesData.details.crew[i].name);
            expect(episodeList.crew[i].role).toBe(seriesData.details.crew[i].role);
        }
    });

    it('should have valid actors, directors and writers values', function () {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        for (let i = 0; i < episodeList.actors.length; i++) {
            expect(episodeList.actors[i].role).toBe('actor');
        }
        for (let i = 0; i < episodeList.actorsAndDirectors.length; i++) {
            expect(episodeList.actors[i].role).toMatch(/actor|director/);
        }
        for (let i = 0; i < episodeList.directors.length; i++) {
            expect(episodeList.actors[i].role).toBe('director');
        }
        for (let i = 0; i < episodeList.writers.length; i++) {
            expect(episodeList.actors[i].role).toBe('writer');
        }
    });

    it('should have valid actors string value', function () {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        expect(episodeList.actorsString).toBe(episodeList.actors.map(actor => actor.name).slice(0, 3).join(', '));
    });

    it('should have valid tmsProgramIds value', function () {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        expect(episodeList.tmsProgramIds).toBe(seriesData.details.latest_episode.tmsProgramIds);
        expect(episodeList.tmsProgramId).toBe(seriesData.details.latest_episode.tmsProgramIds[0]);
    });

    it('should have valid streamProps value', function () {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        expect(episodeList.streamProps).toEqual({"formats":["HD"],"attributes":["CC"]});
    });

    it('should have valid seasons value', function () {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        for (let i = 0; i < seriesData.seasons.length; i++) {
            expect(episodeList.seasons[i].name).toBe(seriesData.seasons[i].name);
        }
    });

    it('should have valid clickRoute value', function () {
        let seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907)),
            episodeList = episodeListViewModelDefinition.createInstance(seriesData);
        expect(episodeList.clickRoute).toEqual(['product.series', {
            tmsSeriesId: seriesData.tmsSeriesId,
            uri: seriesData.uri
        }]);
    });

    it('should have valid genres value', function () {
        let episodeList1 = episodeListViewModelDefinition.createInstance({
            details: {
                latest_episode: {
                    details: {
                        genres: [
                            {name: 'genre 1'},
                            {name: 'genre 2'}
                        ]
                    }
                }
            }
        }), episodeList2 = episodeListViewModelDefinition.createInstance({
            details: {
                genres: [
                    {name: 'genre 1'},
                    {name: 'genre 2'}
                ]
            }
        });

        expect(episodeList1.genres).toEqual(['genre 1', 'genre 2']);
        expect(episodeList1.genreString).toBe('genre 1, genre 2');
        expect(episodeList2.genres).toEqual(['genre 1', 'genre 2']);
        expect(episodeList2.genreString).toBe('genre 1, genre 2');
    });

    it('should display the correct status when a linear stream is on now', function () {
        var series = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907));
        series.seasons[0].episodes[0].details.isOnNow = true;
        let episode = getEpisode(series);
        expect(episode.viewStatus).toBe('On Now');
    });

    it('should display On Demand if it is only available on demand', function () {
        let episode = getEpisode();
        expect(episode.viewStatus).toBe('On Demand');
    });

    it('should display ---- if it is only available on demand but no entitled', function () {
        let episode = getEpisode();
        episode.streamList[0].streamProperties.entitled = false;
        expect(episode.viewStatus).toBe('----');
    });

    // TODO: moment.js isn't working correctly with unit tests, so this test is broken
    xit('should display the original air date if it is not available on demand', function() {
        var series = JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907));
        series.seasons[0].episodes[0].streamList = [{
            type: 'LINEAR',
            entitled: true,
            streamProperties: {
                startTime: 1766017185000
            }
        }];
        series.seasons[0].episodes[0].details.original_air_date = '2025-10-18';

        let episode = getEpisode(series);
        expect(episode.viewStatus).toBe('Oct 18, 2025');
    });

    it('should display blocked if it is not blocked by parental controls', function(done) {
        spyOn(parentalControlsService, "isBlocked").and.returnValue($q.resolve({isBlocked: true, blockedReason: 'rating'}));
        let episode = getEpisode();
        episode.isBlocked.then((result) => {
            expect(result).toBe(true);
            done();
        });
        $rootScope.$apply();
    });

    it('should display a bookmark if there is a bookmark set on any stream', function () {
        _bookmarkService.getBookmarkByTmsProgramId = function() {
            return {
                playMarkerSeconds: 10,
                runtimeSeconds: 100
            };
        };
        let episode = getEpisode();
        expect(episode.viewStatus).toBe(10);
    });

    //
    // CDVR Tests
    //
    it('CDVR should display a bookmark if there is a bookmark set on any stream', function () {
        var seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData184481));
        let thePJs = episodeListViewModelDefinition.createInstance(seriesData);
        let episode = thePJs.seasons[0].episodes[1];
        expect(episode.viewStatus).toEqual(jasmine.any(Number));
    });

    it('CDVR should be DVR if there is a recorded stream without a bookmark', function () {
        var seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData184481));
        let thePJs = episodeListViewModelDefinition.createInstance(seriesData);
        let episode = thePJs.seasons[1].episodes[1];
        expect(episode.viewStatus).toEqual('DVR');
    });

    it('CDVR should be future date if there a scheduled stream', function () {
        var seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData184481));
        var tomorrow = (Date.now() + (24 * 3600 * 1000)); //Subtract a day
        seriesData.seasons[0].episodes[2].streamList[0].streamProperties.startTime = tomorrow;
        let thePJs = episodeListViewModelDefinition.createInstance(seriesData);
        let episode = thePJs.seasons[0].episodes[2];
        // "Yesterday' happens to be what the moment mock will cause to be
        // returned. The test is really to verify the day/date is here instead
        // of something else like 'DVR'
        expect(episode.viewStatus).not.toEqual('DVR');
    });

    it('CDVR not be completed if no recordings are in completed state', function () {
        var seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData184481));
        let thePJs = episodeListViewModelDefinition.createInstance(seriesData);
        let episode = thePJs.seasons[0].episodes[2];
        expect(episode.cdvrHasNotCompleted).toEqual(true);
    });

    it('CDVR should be completed if recordings are in completed state', function () {
        var seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData184481));
        let thePJs = episodeListViewModelDefinition.createInstance(seriesData);
        let episode = thePJs.seasons[1].episodes[1];
        expect(episode.cdvrHasNotCompleted).toEqual(false);
    });

    it('CDVR not have completed if no recordings in streams array', function () {
        var seriesData = JSON.parse(JSON.stringify(mockData.nnsSeriesData184481));
        let thePJs = episodeListViewModelDefinition.createInstance(seriesData);
        let episode = thePJs.seasons[1].episodes[0];
        expect(episode.cdvrHasNotCompleted).toEqual(false);
    });

    //////

    function getEpisode(series) {
        let theAffair = episodeListViewModelDefinition.createInstance(
            (series)? series:JSON.parse(JSON.stringify(mockData.nnsSeriesData10520907))
        );
        let episode = theAffair.seasons[0].episodes[0];
        return episode;
    }

});
