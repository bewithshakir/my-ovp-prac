/* globals getJSONFixture */
describe('ovpApp.guide.GuideService', function () {
    'use strict';

    var $httpBackend,
        $rootScope,
        stbService,
        $timeout;

    beforeEach(module('ovpApp.guide'));

    beforeEach(module('ovpApp.services.splunk', function ($provide) {
        const mockSplunkService = {
            sendCustomMessage: jasmine.createSpy()
        }
        $provide.value('SplunkService', mockSplunkService);
    }));

    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function (
        _$httpBackend_,
        _$rootScope_,
        _stbService_,
        _$timeout_,
        $q) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        stbService = _stbService_;
        $timeout = _$timeout_;

        stbService.getCurrentStbPromise = function () {
            return $q.resolve();
        };

        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
        $httpBackend.whenGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true').respond(
            getJSONFixture('login/capabilities.json')
        );

        $httpBackend.whenGET('/nrs/api/stbs').respond(
            getJSONFixture('rdvr/setTopBoxes.json')
        );

        $httpBackend.whenGET('/ipvs/api/smarttv/nmdepgs/v1/channels?headend=76_52_229_148_168').respond(
            getJSONFixture('guide/channels.json')
        );

        $httpBackend.whenGET('/ipvs/api/smarttv/nmdepgs/v1/guide/76_52_229_148_168/grid?' +
            'channelList=0.1.2.3.4&headend=76_52_229_148_168&hourBegin=0&hourEnd=3').respond(
            getJSONFixture('guide/shows_idx_62_79_80_81_82.json')
        );
    }));

    it('should be defined', inject(function (GuideService) {
        expect(GuideService).toBeDefined();
    }));

    it('fetch a channel list', inject(function (GuideService) {

        let channelSlice = [{
            index: 0,
            channelNumber: 79
        }, {
            index: 1,
            channelNumber: 82
        }, {
            index: 2,
            channelNumber: 81
        }, {
            index: 3,
            channelNumber: 62
        }, {
            index: 4,
            channelNumber: 80
        }];

        GuideService.fetchChannels(channelSlice).then(function (channels) {
            expect(channels).toBeDefined();
            expect(channels.some(c => c.loaded)).toBe(true);
            //Idx #27 is channelNumber 79
            expect(channels[27].content.length).toBe(2);
            expect(channels[27].content[0].classData).toBeDefined();
            expect(channels[27].content[0].title).toBe('UFC 192 en Español: Pena vs. Eye');
            expect(channels[27].content[0].startTimeOffset).toBeDefined();
            expect(GuideService.latest).toBe(1465441200);
            $httpBackend.flush();
        });
    }));

    it('should advance the time by an hour when the time changes', function () {
        var mockTime = 1800000, //Half hour past absolute 0
            mockDate = {
                getTime: () => mockTime,
                setMinutes: () => {},
                setSeconds: () => {},
                //Set millisectond will get evaluated when mock time is set at 30min past absolute 0,
                // and then at 30 min past 3600000 (1hour)
                setMilliseconds: () => {
                    mockTime -= 180000;
                }
            };

        spyOn(window, 'Date').and.callFake(function () {
            return mockDate;
        });
        inject(function (GuideService) {
            expect(GuideService.endTime).toBe(1211220);
            expect(GuideService.times.length).toBe(673);
            expect(GuideService.getZeroHour()).toBe(mockDate);
            mockTime = 5400000; //1.5hours past absolute 0
            $timeout.flush();
            expect(GuideService.endTime).toBe(1214820);
        });
    });
});
