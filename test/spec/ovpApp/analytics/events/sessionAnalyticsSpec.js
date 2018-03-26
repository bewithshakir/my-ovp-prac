var subject, $log, mockAnalyticsService, mockCapabilitiesService, mockLineupService,
    mockStbService, $q;

describe('ovpApp.analytics.events.sessionAnalytics', function () {
    'use strict';

    beforeEach(function () {
        module('ovpApp.analytics.events.sessionAnalytics');
        module('ovpApp.analytics');
    });

    beforeEach(module(function($provide) {
        mockCapabilitiesService = {};
        $provide.value('capabilitiesService', mockCapabilitiesService);

        mockLineupService = {};
        $provide.value('lineupService', mockLineupService);

        mockStbService = {};
        $provide.value('stbService', mockStbService);
    }));

    beforeEach(inject(function(_sessionAnalytics_, _analyticsService_, _$log_, _$q_){
        $log = _$log_;
        subject = _sessionAnalytics_;
        mockAnalyticsService = _analyticsService_;
        $q = _$q_;
    }));

    it('should not be null', function() {
        expect(subject).not.toBeNull();
    });

    it('should correctly determine available channels from available fields', function() {

        expect(subject.isChannelAvailable({
            twcTvParentallyBlocked: false,
            twcTvEntitled: true
        })).toBe(true);

        expect(subject.isChannelAvailable({
            twcTvParentallyBlocked: false,
            twcTvEntitled: false
        })).toBe(false);

        expect(subject.isChannelAvailable({
            twcTvParentallyBlocked: true,
            twcTvEntitled: true
        })).toBe(false);

        expect(subject.isChannelAvailable({
            twcTvParentallyBlocked: true,
            twcTvEntitled: false
        })).toBe(false);
    });

    it('should correctly determine available channels despite missing fields', function() {

        expect(subject.isChannelAvailable({
            twcTvEntitled: true
        })).toBe(false);

        expect(subject.isChannelAvailable({
            twcTvParentallyBlocked: false
        })).toBe(false);

        expect(subject.isChannelAvailable({
        })).toBe(false);

        expect(subject.isChannelAvailable(null)).toBe(false);
    });

    it('should correctly count channels', function() {

        // Verify no events yet.
        expect(mockAnalyticsService.events.length).toEqual(0);

        subject.channelInfo(null, {
            channels:[
                {
                    tmsGuideId: '1', // available
                    twcTvParentallyBlocked: false,
                    twcTvEntitled: true
                },
                {
                    tmsGuideId: '2', // unavailable
                    twcTvParentallyBlocked: false,
                    twcTvEntitled: false
                },
                {
                    tmsGuideId: '3', // unavailable
                    twcTvParentallyBlocked: true,
                    twcTvEntitled: false
                },
                {
                    tmsGuideId: '4', // available
                    twcTvParentallyBlocked: false,
                    twcTvEntitled: true
                },
                {
                    tmsGuideId: '5', // available
                    twcTvParentallyBlocked: false,
                    twcTvEntitled: true
                }
            ]});

            // Verify checkAvailableChannels event.
            expect(mockAnalyticsService.events.length).toEqual(1);
            expect(mockAnalyticsService.events[0].numberAvailableChannels).toEqual(3);
            expect(mockAnalyticsService.events[0].numberUnavailableChannels).toEqual(2);
            expect(mockAnalyticsService.events[0].availableChannels).not.toBe(null);
            expect(mockAnalyticsService.events[0].availableChannels.length).toEqual(3);
            expect(mockAnalyticsService.events[0].availableChannels[0]).toEqual('1');
            expect(mockAnalyticsService.events[0].availableChannels[1]).toEqual('4');
            expect(mockAnalyticsService.events[0].availableChannels[2]).toEqual('5');

    });




});
