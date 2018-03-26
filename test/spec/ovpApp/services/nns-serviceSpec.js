/* globals inject, mockData */
/* jshint jasmine: true */

describe('ovpApp.services.nns', function () {
    'use strict';

    var $rootScope,
        service,
        $httpBackend,
        mockLineupResponse = {
          market: 'CLT',
          lineupId: '168'
      };


    beforeEach(module('ovpApp.services.bookmark'));
    
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    /* jscs:disable */
    beforeEach(inject(function (_$injector_, _$rootScope_, _NNSService_) {
        $rootScope = _$rootScope_;
        service = _NNSService_;
        $httpBackend = _$injector_.get('$httpBackend');
    }));
    /* jscs:enable */

    it('should instantiate the NNS service', function () {
        expect(service).toBeDefined();
    });

    it('should find 0 episodes in a season named other', function () {
        var ts = Date.parse('2015-09-30'),
            sinceDate = ts - (86400000 * 20), //9-10
            otherSeason = mockData.nnsSeriesData10520907.seasons[1],
            newEpisodes;

        newEpisodes = service.getEpisodesFromSeasonSince(sinceDate, otherSeason);
        expect(newEpisodes).toBeDefined();
        expect(newEpisodes.length).toBe(0);

    });

    it('should find all episodes for a season that aired after a specific date', function () {
        var ts = Date.parse('2015-10-20'),
            sinceDate = ts - (86400000 * 10), //ts - 10 days
            season2 = mockData.nnsSeriesData10520907.seasons[0],
            newEpisodes;

        newEpisodes = service.getEpisodesFromSeasonSince(sinceDate, season2);
        expect(newEpisodes).toBeDefined();
        expect(newEpisodes.length).toBe(2);
        expect(newEpisodes[0]).toBe(season2.episodes[0]);

    });

    it('should find all episodes for a series that aired after a specific date', function () {
        var ts = Date.parse('2015-10-26'),
            sinceDate = ts - (86400000 * 352),
            seasons = mockData.nnsSeriesData10520907,
            newEpisodes;

        newEpisodes = service.getEpisodesSince(sinceDate, seasons);
        expect(newEpisodes.length).toBe(3);
    });

    it('should return episodes that are in the future', function () {
        var ts = Date.parse('2015-10-15'),
            sinceDate = ts - (86400000 * 7),
            seasons = mockData.nnsSeriesData10520907,
            newEpisodes;

        newEpisodes = service.getEpisodesSince(sinceDate, seasons);
        expect(newEpisodes.length).toBe(2);
    });

    it('should retry failed requests to nns, then gracefully fail', function () {
        var watchListMockAssets = [
            {
                //Not found show
                inWindow: false,
                providerAssetId: 'telemundo.com::NBCU2015102200001252',
                isSeries: false
            },
            {
                tmsSeriesId: 10520907,
                assetIdStr: '10520907',
                inWindow: true,
                isSeries: true
            },
            {
                //Movie 1941
                assetId: 409048131768,
                assetIdStr: '409048131768',
                inWindow: true,
                providerAssetId: 'starzencore.com::MOVE0450000001246353',
                isSeries: false,
                tmsProgramId: 'MV000000130000'
            }
        ];

        service.fetchBatch(watchListMockAssets).then(function (result) {
            expect(result.length).toBe(3);
            expect(result[0]).toBeUndefined();
            expect(result[1].tmsSeriesId).toBe(10520907);
            expect(result[2].media.results[0].tmsProgramIds[0]).toBe('MV000000130000');
        }, function (err) {
            fail(err);
        });

        $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
            .respond(200, mockLineupResponse);

        $httpBackend.expectGET('/nationalnavigation/V1/symphoni/entrypoint?division=CLT&lineup=168&profile=ovp_v6')
            .respond(200, mockData.nnsEntryPoint);

        for (var i = 0; i < 2; i++) {
            // expecting 2 because it will be retried
            $httpBackend.expectGET('/ipvs/api/nationalnavigation/V1/symphoni/event/' +
                'providerassetid/telemundo.com::NBCU2015102200001252?division=Online&' +
                'lineup=0&profile=ovp&cacheID=6')
                .respond(404, 'Not Found');
        }

        //Hold the reqeuest to simulate an out of order response
        let hold = $httpBackend.expectGET('/ipvs/api/nationalnavigation/V1/symphoni/series/' +
            'tmsproviderseriesid/10520907?division=Online&lineup=0&' +
            'profile=ovp&cacheID=6');


        //Return out of order and make sure the response is in order
        $httpBackend.expectGET('/ipvs/api/nationalnavigation/V1/symphoni/event/' +
            'providerassetid/starzencore.com::MOVE0450000001246353?division=Online&lineup=0&profile=' +
            'ovp&cacheID=6')
            .respond(200, JSON.stringify(mockData.nnsMovieDataMOVE0450000001246353));


        hold.respond(200, JSON.stringify(mockData.nnsSeriesData10520907));


        $httpBackend.flush();


    });
});
