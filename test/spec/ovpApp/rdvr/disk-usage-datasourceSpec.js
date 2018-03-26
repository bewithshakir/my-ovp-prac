/* globals inject */
/* jshint jasmine: true */

describe('DiskUsage Datasource', function () {
    'use strict';

    let DiskUsageDatasource, rx, $httpBackend, $rootScope, mockCache, stb, datasource;

    beforeEach(module('ovpApp.rdvr.datasource'));
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(module(function ($provide) {
        mockCache = {
            getCache: jasmine.createSpy(),
            createNewCache: jasmine.createSpy(),
            clearCache: jasmine.createSpy()
        };
        $provide.value('rdvrCacheService', mockCache);
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    beforeEach(inject(function (_DiskUsageDatasource_, _rx_, _$httpBackend_, _$rootScope_) {
        DiskUsageDatasource = _DiskUsageDatasource_;
        rx = _rx_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    const mockResult = {
        data: {
            "freeSpaceGigabytes": 14.8524544,
            "usedSpaceGigabytes": 428.231739392,
            "totalSpaceGigabytes": 443.084193792,
            "hdStorageGigabytes": 414.814258176,
            "sdStorageGigabytes": 13.417481216,
            "hdDurationMinutes": 5153,
            "sdDurationMinutes": 546,
            "usedPercentage": 0.966479480266571,
            "freePercentage": 0.033520616590976715
        },
        isComplete: true
    }

    const initialValue = {
         data: {usedPercentage: 0, freePercentage: 100},
         isComplete: false
    };

    function resultsEqual(a, b) {
        expect(a.data).toEqual(b.data, 'data should have matched');
        expect(a.isComplete).toEqual(b.isComplete, 'isComplete should have matched');
        expect(a.error).toEqual(b.error, 'error should have matched');
        expect(a.lastUpdated).toEqual(b.lastUpdated, 'lastUpdated should have matched');
        expect(a.busyUntil).toEqual(b.busyUntil, 'busyUntil should have matched');
    }

    beforeEach(function () {
        stb = {
            dvr: true,
            macAddressNormalized: 'fakeMac',
            rdvrVersion: 2
        }
        datasource = new DiskUsageDatasource(stb);
    });

    describe('source', function () {
        it('should do nothing if no stb is supplied', function () {
            let noStbDatasource = new DiskUsageDatasource(undefined);
            noStbDatasource.fetch = jasmine.createSpy();

            expect(noStbDatasource.source).toBeDefined();

            noStbDatasource.source.subscribe(
                result => expect(false).toEqual(true, 'should not have emitted anything'),
                error => expect(false).toEqual(true, 'should not have errored'),
                () => expect(false).toEqual(true, 'should not have completed')
            );

            expect(noStbDatasource.fetch).not.toHaveBeenCalled();
        });

        it('should do nothing if stb is not a dvr', function () {
            let nonDvrDatasource = new DiskUsageDatasource({
                dvr: false,
                macAddressNormalized: 'fakeMac'
            });
            nonDvrDatasource.fetch = jasmine.createSpy();

            expect(nonDvrDatasource.source).toBeDefined();

            nonDvrDatasource.source.subscribe(
                result => expect(false).toEqual(true, 'should not have emitted anything'),
                error => expect(false).toEqual(true, 'should not have errored'),
                () => expect(false).toEqual(true, 'should not have completed')
            );

            expect(nonDvrDatasource.fetch).not.toHaveBeenCalled();
        });

        it('should not fetch if no one subscribes', function () {
            datasource.fetch = jasmine.createSpy();

            expect(datasource.source).toBeDefined();
            expect(datasource.fetch).not.toHaveBeenCalled();
        });

        it('should fetch with cache on first time', function () {
            datasource.fetch = jasmine.createSpy().and.returnValue(rx.Observable.just(mockResult));
            expect(datasource.source).toBeDefined();

            const results = [];

            datasource.source.subscribe(
                result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, initialValue);
                    } else if (results.length === 2) {
                        resultsEqual(result, mockResult)
                    }
                });

            expect(datasource.fetch).toHaveBeenCalledWith(false);
        });

        it('should fetch without cache when reset', function () {
            datasource.fetch = jasmine.createSpy().and.returnValue(rx.Observable.just(mockResult));
            expect(datasource.source).toBeDefined();

            const results = [];

            datasource.source.subscribe(
                result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, initialValue);
                    } else if (results.length === 2) {
                        resultsEqual(result, mockResult);
                        datasource.reset();
                    } else if (results.length === 3) {
                        resultsEqual(result, initialValue);
                    } else if (results.length === 4) {
                        resultsEqual(result, mockResult);
                    }
                });

            expect(datasource.fetch).toHaveBeenCalledWith(false);
            expect(datasource.fetch).toHaveBeenCalledWith(true);
        });

        it('should abort previous fetch when reset', function () {
            let scheduler = new rx.TestScheduler();
            let count = 0;
            let wentOff = false;
            let firstObservable = rx.Observable.timer(100, scheduler)
                .do(() => wentOff = true)
                .map(() => mockResult);
            let secondObserable = rx.Observable.timer(50, scheduler)
                .map(() => mockResult);

            datasource.fetch = jasmine.createSpy().and.callFake(function () {
                if (count == 0) {
                    count++;
                    return firstObservable;
                } else {
                    return secondObserable;
                }
            });

            const results = [];

            datasource.source.subscribe(
                result => results.push(result)
            );

            expect(datasource.fetch).toHaveBeenCalledWith(false);
            expect(results.length).toEqual(1);
            resultsEqual(results[0], initialValue)

            scheduler.advanceTo(99);
            expect(results.length).toEqual(1);
            datasource.reset();
            expect(results.length).toEqual(2);
            resultsEqual(results[1], initialValue)

            scheduler.advanceTo(100);
            expect(wentOff).toEqual(false, 'should have unsubscribed from the first observable upon reset')

            scheduler.advanceTo(149);
            expect(results.length).toEqual(3);
            resultsEqual(results[2], mockResult);

            scheduler.advanceTo(10000);
            expect(results.length).toEqual(3);
        });

        it('should save results to cache', function () {
            datasource.fetch = jasmine.createSpy().and.returnValue(rx.Observable.just(mockResult));
            datasource.saveToCache = jasmine.createSpy();
            expect(datasource.source).toBeDefined();

            const results = [];

            datasource.source.subscribe(
                result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, initialValue);
                    } else if (results.length === 2) {
                        resultsEqual(result, mockResult)
                    }
                });

            expect(datasource.saveToCache).toHaveBeenCalledWith(mockResult);
        });

        it('should only fetch once even with multiple subscriptions', function () {
            datasource.fetch = jasmine.createSpy().and.returnValue(rx.Observable.just(mockResult));
            expect(datasource.source).toBeDefined();

            for (let i = 0; i < 10; i++) {
                datasource.source.subscribe();
            }

            expect(datasource.fetch.calls.count()).toEqual(1);
        });
    });

    describe('fetch', function () {
        it('should reset cache if force = true', function () {
            datasource.batchGetWithCache = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            datasource.clearCache = jasmine.createSpy();
            datasource.fetch(true);
            expect(datasource.clearCache).toHaveBeenCalled();
            expect(datasource.batchGetWithCache).toHaveBeenCalledWith({
                getter: jasmine.any(Function)
            });
        });

        it('should not reset cache if force = false', function () {
            datasource.batchGetWithCache = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            datasource.clearCache = jasmine.createSpy();
            datasource.fetch(false);
            expect(datasource.clearCache).not.toHaveBeenCalled();
            expect(datasource.batchGetWithCache).toHaveBeenCalledWith({
                getter: jasmine.any(Function)
            });
        });


        it('should catch and transform errors', function () {
            datasource.batchGetWithCache = jasmine.createSpy().and.returnValue(rx.Observable.throw('i can has error?'));
            expect(datasource.source).toBeDefined();

            const results = [];

            datasource.source.subscribe(
                result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, initialValue);
                    } else if (results.length === 2) {
                        expect(result.data).toEqual(initialValue.data);
                        expect(result.error).toEqual('i can has error?')
                    }
                });
        });
    });

    describe('getOneDiskUsageBatch', function () {
        it('should handle success', function () {
            let mockData = {hello: 'world'};
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/usage')
                .respond(200, mockData);

            datasource.getOneDiskUsageBatch()
                .subscribe(result => expect(result.data).toEqual(mockData));

            $httpBackend.flush();
        });

        it('should retry one failure', function () {
            let mockData = {hello: 'world'};
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/usage')
                .respond(500, 'fail1');
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/usage')
                .respond(200, mockData);

            datasource.getOneDiskUsageBatch()
                .subscribe(result => expect(result.data).toEqual(mockData));

            $httpBackend.flush();
        });

        it('should not retry a second failure', function () {
            let mockData = {hello: 'world'};
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/usage')
                .respond(500, 'fail1');
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/usage')
                .respond(500, 'fail2');

            datasource.getOneDiskUsageBatch()
                .subscribe(
                    result => expect(false).toEqual(true, 'should not have succeeded'),
                    error => {
                        expect(error.status).toEqual(500);
                        expect(error.data).toEqual('fail2');
                    }
                );

            $httpBackend.flush();
        });
    });

    describe('saveToCache', function () {
        it('should do nothing if result is the initial value', function () {
            datasource.saveToCache(datasource.initialValue);
            expect(mockCache.createNewCache).not.toHaveBeenCalled();
        });

        it('should save to cache otherwise', function () {
            datasource.saveToCache({data: 'hello world', nextParams: {}});
            expect(mockCache.createNewCache).toHaveBeenCalledWith('DISK_USAGE', stb, {data: 'hello world', nextParams: {}});
        });
    });

});
