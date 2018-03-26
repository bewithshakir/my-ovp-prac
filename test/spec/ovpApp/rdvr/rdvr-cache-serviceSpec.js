/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.rdvr.cacheService', function () {
    'use strict';

    var rdvrCacheService, $rootScope, RecordingsCache, recordingsListType, RecordingsCacheIntervals,
        mockStb = {
            macAddressNormalized: '12345678',
            rdvrVersion: 2,
            dvr: true
        }, testCache, cacheKey;

    beforeEach(module('ovpApp.rdvr.cacheService'));

    /* jscs:disable */
    beforeEach(inject(function (_rdvrCacheService_, _$injector_, _$rootScope_, _RecordingsCache_,
        _recordingsListType_, _RecordingsCacheIntervals_) {
        $rootScope = _$rootScope_;
        rdvrCacheService = _rdvrCacheService_;
        RecordingsCache = _RecordingsCache_;
        recordingsListType = _recordingsListType_;
        RecordingsCacheIntervals = _RecordingsCacheIntervals_;
    }));
    /* jscs:enable */

    it('should instantiate the service', function () {
        expect(rdvrCacheService).toBeDefined();
    });

    beforeEach(inject(function () {
        rdvrCacheService.createNewCache(recordingsListType.COMPLETED, mockStb, {stuff: 'stuff'});
        testCache = rdvrCacheService.getCache(recordingsListType.COMPLETED, mockStb);
    }));
});
