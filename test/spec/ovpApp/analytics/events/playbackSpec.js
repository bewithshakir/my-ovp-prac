var subject, $log, mockAnalyticsService, vodChannelChangedAsset1,
    vodChannelChangedAsset2, vodStreamUriAcquiredAsset1, vodStreamUriAcquiredAsset2,
    vodPlaybackStartedAsset1, vodPlaybackStartedAsset2, mockPlayerService;


describe('ovpApp.analytics.events.playback', function () {
    'use strict';

    beforeEach(function () {
        module('ovpApp.analytics.events.playback');
        module('ovpApp.analytics');
    });

    beforeEach(module(function($provide) {
        let devId = {get: function() {return 'device';}};
        $provide.constant('ovpApp.legacy.deviceid', devId);

        vodChannelChangedAsset1 = {
            channel: {
                channelId: '61960',
                tmsId: '61960',
                hd: true,
                favorite: false,
                callSign: 'TVONEHD',
                isParentallyBlocked: false,
                tmsGuideId: '61960',
                tmsProgramId: 'EP000170730162',
                streams: [ {
                    dai: false,
                    drm: true,
                    type: 'hls',
                    uri: '/ipvs/api/smarttv/stream/live/v1/598?encoding=hls&drm-supported=true&dai-supported=false'
                }],
                asset: {
                    rating: 'TV-G',
                    scheduledEndTimeSec: 1499466600,
                    scheduledStartTimeSec: 1499464800,
                    tmsGuideId: '61960',
                    tmsProgramIds: ['EP004469430060']
                },
                triggeredBy: 'user'
            }
        };

        vodChannelChangedAsset2 = {
            channel: {
                channelId: '59296',
                tmsId: '59296',
                hd: true,
                favorite: false,
                callSign: 'WEHD',
                isParentallyBlocked: false,
                tmsGuideId: '61960',
                tmsProgramId: 'EP004461730060',
                streams: [ {
                    dai: false,
                    drm: true,
                    type: 'hls',
                    uri: '/ipvs/api/smarttv/stream/live/v1/826?encoding=hls&drm-supported=true&dai-supported=false'
                }],
                asset: {
                    rating: 'TV-14',
                    scheduledEndTimeSec: 1499706000,
                    scheduledStartTimeSec: 1499702400,
                    tmsGuideId: '63220',
                    tmsProgramIds: ['EP004461730060']
                },
                triggeredBy: 'user'
            }
        };

        vodStreamUriAcquiredAsset1 = {
            contentMetadata: {
                tmsProgramId: 'EP004469430060',
                channelId: '61960'
            },
            stream: {
                stream_url: 'http://mdc-linear-west-02.osg.cloud.twc.net/linear-scope010.timewarnercable.com/LIVE/1007/hls/ae/WEE_HD/index.m3u8?nw=376521&prof=376521:twc_hls_live&mode=live&vdur=600&caid=WE_LIVE&csid=stva_ovp_pc_live&vcid=75ea4325-1c34-34be-8e03-ce87ded1d607&z5=10010&ads=VAST_LIVE&tagset_name=VAST&_fw_lpu=http://linear-scope010.timewarnercable.com/LIVE/1007/hls/ae/WEE_HD/index.m3u8&adId=f904eb2e-873a-42ff-9dc8-e367e1edc8c9'
            }
        };

        vodStreamUriAcquiredAsset2 = {
            contentMetadata: {
                tmsProgramId: 'EP004461730060',
                channelId: '59296'
            },
            stream: {
                stream_url: 'http://mdc-linear-west-02.osg.cloud.twc.net/linear-scope010.timewarnercable.com/LIVE/1008/hls/ae/WEE_HD/index.m3u8?nw=376821&prof=376921:twc_hls_live&mode=live&vdur=600&caid=WE_LIVE&csid=stva_ovp_pc_live&vcid=75ea4325-1c34-34be-8e03-ce87ded1d607&z5=10010&ads=VAST_LIVE&tagset_name=VAST&_fw_lpu=http://linear-scope010.timewarnercable.com/LIVE/1007/hls/ae/WEE_HD/index.m3u8&adId=f904eb2e-873a-42ff-9dc8-e367e1edc8c9'
            }
        };

        vodPlaybackStartedAsset1 = {
            bitrate: 343903
        };

        vodPlaybackStartedAsset2 = {
            bitrate: 343903
        };

        mockPlayerService = {
            isValidPlayRoute: function() {return true;}
        };
        $provide.value('playerService', mockPlayerService);

    }));

    beforeEach(inject(function(_playback_, _$log_, _analyticsService_){
        $log = _$log_;
        subject = _playback_;
        mockAnalyticsService = _analyticsService_;
    }));

    it('should pass through a normal, simple adBreakStop', function() {

        // Verify starting with no events. Will be true at the start of all tests.
        expect(mockAnalyticsService.events.length).toEqual(0);

        // Inform analytics that it's in the 'playing' state
        mockAnalyticsService.getCurrentLibraryState = function() {
            return 'playing';
        };

        // Invoke adBreakStop event
        subject.adBreakStopped({}, {});

        // Verify we received the expected event
        expect(mockAnalyticsService.events.length).toEqual(1);
        expect(mockAnalyticsService.events[0].name).toEqual('adBreakStop');
    });

    it('should interrupt buffering with an adBreakStop, if needed', function() {

        // Verify starting with no events. Will be true at the start of all tests.
        expect(mockAnalyticsService.events.length).toEqual(0);

        // Inform analytics that it's in the 'buffering' state in order to trigger the
        // 'adBreakStop while buffering' behavior.
        mockAnalyticsService.getCurrentLibraryState = function() {
            return 'buffering';
        };

        // Invoke adBreakStop event
        subject.adBreakStopped({}, {});

        // Verify we received the expected event
        expect(mockAnalyticsService.events.length).toEqual(3);
        expect(mockAnalyticsService.events[0].name).toEqual('bufferingStop');
        expect(mockAnalyticsService.events[1].name).toEqual('adBreakStop');
        expect(mockAnalyticsService.events[2].name).toEqual('bufferingStart');
    });

    it('Should ignore duplicate playbackSelect events', function() {

        // No events published yet
        expect(mockAnalyticsService.events.length).toEqual(0);

        mockAnalyticsService.getCurrentLibraryState = function() {
            return 'navigating';
        };

        // send a playbackSelect event
        subject.channelChanged(vodChannelChangedAsset1);

        // Verify we received the event.
        expect(mockAnalyticsService.events.length).toEqual(1);

        // send a playbackSelect event for the same asset, etc.
        subject.channelChanged(vodChannelChangedAsset1);

        // Verify no new playbackSelect event was generated.
        expect(mockAnalyticsService.events.length).toEqual(1);

        // Send a select for a DIFFERENT asset.
        subject.channelChanged(vodChannelChangedAsset2);

        // Verify the new playbackSelect event was accepted.
        expect(mockAnalyticsService.events.length).toEqual(3);
        expect(mockAnalyticsService.events[0].name).toEqual('playbackSelect');
        expect(mockAnalyticsService.events[1].name).toEqual('playbackExitBeforeStart');
        expect(mockAnalyticsService.events[2].name).toEqual('playbackSelect');
    });

    it('Should ignore duplicate playbackStreamUriAcquired events', function() {

        // No events published yet
        expect(mockAnalyticsService.events.length).toEqual(0);

        mockAnalyticsService.getCurrentLibraryState = function() {
            return 'navigating';
        };

        // send playbackSelect & streamUriObtained events
        subject.channelChanged(vodChannelChangedAsset1);
        subject.streamUriObtained(vodStreamUriAcquiredAsset1);

        // Verify we received the events.
        expect(mockAnalyticsService.events.length).toEqual(2);
        expect(mockAnalyticsService.events[0].name).toEqual('playbackSelect');
        expect(mockAnalyticsService.events[1].name).toEqual('playbackStreamUriAcquired');

        // send playbackSelect & streamUriObtained events for the same asset
        subject.channelChanged(vodChannelChangedAsset1);
        subject.streamUriObtained(vodStreamUriAcquiredAsset1);

        // Verify both events were discarded
        expect(mockAnalyticsService.events.length).toEqual(2);

        // Set up a new asset
        subject.channelChanged(vodChannelChangedAsset2);
        subject.streamUriObtained(vodStreamUriAcquiredAsset2);

        // Verify the new events were accepted.
        expect(mockAnalyticsService.events.length).toEqual(5);
        expect(mockAnalyticsService.events[0].name).toEqual('playbackSelect');
        expect(mockAnalyticsService.events[1].name).toEqual('playbackStreamUriAcquired');
        expect(mockAnalyticsService.events[2].name).toEqual('playbackExitBeforeStart');
        expect(mockAnalyticsService.events[3].name).toEqual('playbackSelect');
        expect(mockAnalyticsService.events[4].name).toEqual('playbackStreamUriAcquired');
    });

    /**
     * Mock the analytics library by manually setting its perceived state.
     */
    function setAnalyticsLibraryState(stateName) {
        // console.log('Test: setAnalyticsLibraryState: ' + stateName);
        mockAnalyticsService.getCurrentLibraryState = function() {
            return stateName;
        };
    }

    it('Should ignore duplicate playbackStarted events', function() {

        // No events published yet
        expect(mockAnalyticsService.events.length).toEqual(0);

        setAnalyticsLibraryState('navigating');

        // send playbackSelect & streamUriObtained events
        subject.channelChanged(vodChannelChangedAsset1);
        setAnalyticsLibraryState('initiating');
        subject.streamUriObtained(vodStreamUriAcquiredAsset1);
        subject.playbackStarted(vodPlaybackStartedAsset1);

        setAnalyticsLibraryState('playing');
        expect(subject.isPlaying()).toEqual(true);

        // Verify we received the events
        expect(mockAnalyticsService.events.length).toEqual(3);
        expect(mockAnalyticsService.events[0].name).toEqual('playbackSelect');
        expect(mockAnalyticsService.events[1].name).toEqual('playbackStreamUriAcquired');
        expect(mockAnalyticsService.events[2].name).toEqual('playbackStart');

        // Send another playback event & verify it is ignored.
        subject.playbackStarted(vodPlaybackStartedAsset1);
        expect(mockAnalyticsService.events.length).toEqual(3);
        expect(subject.isPlaying()).toEqual(true);

        // Simulate page change away from player.
        subject.playbackStopped({TriggeredBy: 'exitPlayer'});
        setAnalyticsLibraryState('navigating');

        // Verify we got the playbackStop
        expect(mockAnalyticsService.events.length).toEqual(4);
        expect(mockAnalyticsService.events[3].name).toEqual('playbackStop');
        expect(subject.isPlaying()).toEqual(false);

        // Simulate return back to live tv page, resuming same asset.
        subject.channelChanged(vodChannelChangedAsset1);
        setAnalyticsLibraryState('initiating');
        subject.streamUriObtained(vodStreamUriAcquiredAsset1);
        subject.playbackStarted(vodPlaybackStartedAsset1);
        setAnalyticsLibraryState('playing');
        expect(subject.isPlaying()).toEqual(true);

        // Verify this triggered a new setup.
        expect(mockAnalyticsService.events.length).toEqual(7);
        expect(mockAnalyticsService.events[4].name).toEqual('playbackSelect');
        expect(mockAnalyticsService.events[5].name).toEqual('playbackStreamUriAcquired');
        expect(mockAnalyticsService.events[6].name).toEqual('playbackStart');

        // Set up a new asset
        subject.channelChanged(vodChannelChangedAsset2);
        setAnalyticsLibraryState('initiating');
        subject.streamUriObtained(vodStreamUriAcquiredAsset2);
        subject.playbackStarted(vodPlaybackStartedAsset2);
        setAnalyticsLibraryState('playing');

        // Verify the new events were accepted.
        expect(mockAnalyticsService.events.length).toEqual(11);
        expect(mockAnalyticsService.events[7].name).toEqual('playbackStop');
        expect(mockAnalyticsService.events[8].name).toEqual('playbackSelect');
        expect(mockAnalyticsService.events[9].name).toEqual('playbackStreamUriAcquired');
        expect(mockAnalyticsService.events[10].name).toEqual('playbackStart');

        // Send another playback event & verify it is ignored.
        subject.playbackStarted(vodPlaybackStartedAsset2);
        expect(mockAnalyticsService.events.length).toEqual(11);
    });

});
