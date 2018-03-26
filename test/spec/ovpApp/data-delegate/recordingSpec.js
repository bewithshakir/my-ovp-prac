/*globals mockData*/
describe('recordingViewModelDefinition', function () {
    'use strict';

    var recordingViewModelDefinition, parentalControlsService, $q, $rootScope, BookmarkService;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function (_recordingViewModelDefinition_, _parentalControlsService_, _$q_, _$rootScope_, _BookmarkService_) {
        recordingViewModelDefinition = _recordingViewModelDefinition_;
        parentalControlsService = _parentalControlsService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        BookmarkService = _BookmarkService_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(recordingViewModelDefinition).toBeDefined();
        let ins = recordingViewModelDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins).toBeDefined();
    });

    it('should have relevant information', function() {
        let data = {
            programMetadata: {
                title: 'mock title',
                episodeTitle: 'mock episode title',
                tmsSeriesId: 'mockTmsSeriesId',
                tmsProgramId: 'MVmockTmsProgramId',
                episodeNumber: 2,
                seasonNumber: 2,
                shortDescription: 'mock short desc',
                longDescription: 'mock long desc',
                actors: ['actor1', 'actor2'],
                rating: 'PG',
                genres: ['g1', 'g2'],
                releaseYear: 1992
            },
            recordSeries: true,
            isNew: true,
            conflicted: false,
            startUnixTimestampSeconds: (Date.now() - 10000),
            settings: {id: 'mock id'},
            displayChannel: 23,
            mystroServiceId: '1234567'
        }, recording = recordingViewModelDefinition.createInstance(data);

        expect(recording.title).toBe(data.programMetadata.title);
        expect(recording.episodeTitle).toBe(data.programMetadata.episodeTitle);
        expect(recording.tmsSeriesId).toBe(data.programMetadata.tmsSeriesId);
        expect(recording.recordSeries).toBe(data.recordSeries);
        expect(recording.isNew).toBe(data.isNew);
        expect(recording.conflicted).toBe(data.conflicted);
        expect(recording.startTime).toBe(data.startUnixTimestampSeconds);
        expect(recording.settings).toEqual(data.settings);
        expect(recording.displayChannel).toBe(data.displayChannel);
        expect(recording.mystroServiceId).toBe(data.mystroServiceId);
        expect(recording.episodeNumber).toBe(data.programMetadata.episodeNumber);
        expect(recording.seasonNumber).toBe(data.programMetadata.seasonNumber);
        expect(recording.longDescription).toBe(data.programMetadata.shortDescription);
        expect(recording.shortDescription).toBe(data.programMetadata.longDescription);
        expect(recording.crew).toBe(data.programMetadata.actors);
        expect(recording.actors).toBe(data.programMetadata.actors);
        expect(recording.actorsAndDirectors).toBe(data.programMetadata.actors);
        expect(recording.rating).toBe(data.programMetadata.rating);
        expect(recording.tmsProgramId).toBe(data.programMetadata.tmsProgramId);
        expect(recording.tmsProgramIds).toEqual([data.programMetadata.tmsProgramId]);
        expect(recording.isEpisode).toBe(!!data.programMetadata.tmsSeriesId);
        expect(recording.isMovie).toBe(true);
        expect(recording.directors).toEqual([]);
        expect(recording.writers).toEqual([]);
        expect(recording.genres).toEqual(data.programMetadata.genres);
        expect(recording.genreString).toBe(data.programMetadata.genres.join(', '));
        expect(recording.allRatings).toEqual([data.programMetadata.rating]);
        expect(recording.releaseInformation).toBe(data.programMetadata.releaseYear);
    });

    it('should have valid isBlocked', function(done) {
        let data = {},
            recording = recordingViewModelDefinition.createInstance(data),
            deferred = $q.defer();
        parentalControlsService.isBlocked = () => $q.resolve({ isBlocked: true, reason: 'isBlocked' });
        expect(data.blockedReason).toBe(undefined);
        recording.isBlocked.then(result => {
            expect(result).toBe(true);
            expect(data.blockedReason).toBe('isBlocked');
            done();
        });
        $rootScope.$apply();
    });

    it('should have valid clickRoute value', function () {
        let startTime = (Date.now() - 10000),
        recording1 = recordingViewModelDefinition.createInstance({
            programMetadata: {
                tmsSeriesId: 'mockTmsSeriesId',
                tmsProgramId: 'mockTmsProgramId'
            },
            mystroServiceId: 'mockMystroServiceId',
            startUnixTimestampSeconds: startTime
        }), recording2 = recordingViewModelDefinition.createInstance({
            programMetadata: {
                tmsProgramId: 'mockTmsProgramId'
            },
            mystroServiceId: 'mockMystroServiceId',
            startUnixTimestampSeconds: startTime
        });

        expect(recording1.clickRoute).toEqual(['product.series', {
            tmsSeriesId: 'mockTmsSeriesId',
            serviceId: 'mockMystroServiceId',
            airtime: startTime,
            tmsProgramId: 'mockTmsProgramId'
        }]);
        expect(recording2.clickRoute).toEqual(['product.event', {
            tmsId: 'mockTmsProgramId',
            serviceId: 'mockMystroServiceId',
            airtime: startTime
        }]);
    });

    it('should have valid bookmark value', function () {
        BookmarkService.getBookmarkByTmsProgramId = function() {
            return {
                playMarkerSeconds: 10,
                runtimeSeconds: 100
            };
        };
        let recording = recordingViewModelDefinition.createInstance({
            programMetadata: {
                tmsProgramId: 'mockTmsProgramId'
            }
        });
        expect(recording.bookmark).toEqual({
            playMarkerSeconds: 10,
            runtimeSeconds: 100
        });
        expect(recording.playedPct).toBe(10);
    })
});
