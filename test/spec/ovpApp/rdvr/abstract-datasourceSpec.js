/* globals inject */
/* jshint jasmine: true */

describe('Abstract Datasource', function () {
    'use strict';

    let AbstractDatasource, rx, $httpBackend, $rootScope, mockCache, stb, datasource;

    beforeEach(module('ovpApp.rdvr.datasource'));

    beforeEach(module(function ($provide) {
        mockCache = {
            getCache: jasmine.createSpy(),
            createNewCache: jasmine.createSpy(),
            updateCache: jasmine.createSpy(),
            clearCache: jasmine.createSpy()
        };
        $provide.value('rdvrCacheService', mockCache);
    }));

    beforeEach(inject(function (_AbstractDatasource_, _rx_, _$httpBackend_, _$rootScope_) {
        AbstractDatasource = _AbstractDatasource_;
        rx = _rx_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
        stb = {
            dvr: true,
            macAddressNormalized: 'fakeMac',
            rdvrVersion: 2
        }
        datasource = new AbstractDatasource(stb, 'key', {data: []});
    });

    describe('constructor', function () {
        it('should save stb', function () {
            expect(datasource.stb).toBe(stb);
        });

        it('should save cache key', function () {
            expect(datasource.cacheKey).toEqual('key');
        });

        it('should save initial value', function () {
            expect(datasource.initialValue).toEqual({data: []});
        });

        it('should create reset function subject', function () {
            expect(datasource.reset).toBeDefined();
            expect(datasource.reset instanceof Function).toEqual(true);
            expect(datasource.reset.subscribe).toBeDefined();
            expect(datasource.reset.onNext).toBeDefined();
        });

        it('should create wrapRecording function', function () {
            expect(datasource.wrapRecording).toBeDefined();
        });
    });

    describe('clearCache', function () {
        it('should clear cache', function () {
            datasource.clearCache();
            expect(mockCache.clearCache).toHaveBeenCalledWith('key', stb);
        });
    });

    describe('save to cache', function () {
        it('should not save initial value', function () {
            datasource.saveToCache(datasource.initialValue);
            expect(mockCache.createNewCache).not.toHaveBeenCalled();
        });

        it('should save other values', function () {
            datasource.saveToCache({
                data: 'hi',
                nextParams: 5,
                dataThatWillNotBeSaved: 'i like turtles'
            });
            expect(mockCache.createNewCache).toHaveBeenCalledWith(
                'key',
                stb,
                {
                    data: 'hi',
                    nextParams: 5
                });
        });
    });

    describe('convertResultBeforeEmitting', function () {
        it('should treat initial value as incomplete', function () {
            let val = datasource.convertResultBeforeEmitting(datasource.initialValue);

            expect(val).toEqual({
                data: [],
                isComplete: false,
                error: undefined,
                lastUpdated: undefined,
                busyUntil: undefined
            });
        });

        it('should return expected values (incomplete)', function () {
            let mockData = {
                data: 'd',
                nextParams: 1,
                error: 'e',
                lastUpdated: 'l',
                busyUntil: 'b',
                statusCode: '200',
                favoriteIceCreamFlavor: 'strawberry cheesecake'
            }

            let val = datasource.convertResultBeforeEmitting(mockData);
            expect(val).toEqual({
                data: 'd',
                isComplete: false,
                error: 'e',
                lastUpdated: 'l',
                busyUntil: 'b'
            })
        });

        it('should return expected values (complete)', function () {
            let mockData = {
                data: 'd',
                nextParams: undefined,
                error: 'e',
                lastUpdated: 'l',
                busyUntil: 'b',
                statusCode: '200',
                eToTheIPi: -1
            }

            let val = datasource.convertResultBeforeEmitting(mockData);
            expect(val).toEqual({
                data: 'd',
                isComplete: true,
                error: 'e',
                lastUpdated: 'l',
                busyUntil: 'b'
            })
        }); 
    });

    describe('batchGet', function () {
        it('should return an observable', function () {
            const getter = jasmine.createSpy().and.returnValue(rx.Observable.just({}));
            const source = datasource.batchGet(getter, {});
            expect(source).toBeDefined();
            expect(source instanceof rx.Observable).toEqual(true); 
        });

        it('should call getter with params', function () {
            const getter = jasmine.createSpy().and.returnValue(rx.Observable.just({}));
            const params = {};
            datasource.batchGet(getter, params);

            expect(getter).toHaveBeenCalledWith(params);
        });

        it('should do nothing else if there are no more params', function () {
            const result = {
                data: 'hello world',
                nextParams: undefined
            }
            const getter = jasmine.createSpy().and.returnValue(rx.Observable.just(result));
            const params = {};
            const source = datasource.batchGet(getter, params);

            const results = [];
            source.subscribe(result => {
                results.push(result);
                if (results.length === 1) {
                    expect(result.data).toEqual('hello world');
                } else if (results.length > 1) {
                    expect(false).toEqual(true, 'should not have emitted multiple values');
                }
            });
        });

        it('should recurse if there are more params', function () {
            const mockResults = [{
                data: 0,
                nextParams: {startingIndex: 1}
            }, {
                data: 1, 
                nextParams: {startingIndex: 2}
            }, {
                data: 2, 
                nextParams: undefined
            }];

            const getter = jasmine.createSpy().and.callFake(params => {
                return rx.Observable.just(mockResults[params.startingIndex || 0]);
            })

            const source = datasource.batchGet(getter, {startingIndex: 0});
            const receivedResults = [];
            source.subscribe(result => {
                receivedResults.push(result);
                if (receivedResults.length <= mockResults.length) {
                    expect(result.data).toEqual(mockResults[receivedResults.length - 1].data);
                } else {
                    expect(false).toEqual(true, 'should not have emitted ' + (mockResults.length + 1) + ' values');
                }
            })
        });
    });

    describe('batchGetWithCache', function () {
        it('should restore from completed cache', function () {
            const result = {
                data: 'hi',
                nextParams: undefined
            }
            const cache = {
                getJson: () => result,
                getLastRefreshTimeUtcMsec: () => 12345,
                lastDirtiedTimeUtcMsec: 54321,
                getDirtyIntervalMsec: () => 1000,
                isDirty: () => true
            }
            mockCache.getCache = jasmine.createSpy().and.returnValue(cache);

            const getter = jasmine.createSpy();

            datasource.batchGetWithCache({getter, initialParams: {}})
                .subscribe(
                    res => {
                        expect(mockCache.getCache).toHaveBeenCalledWith('key', stb);
                        expect(res.data).toEqual('hi');
                        expect(res.lastUpdated).toEqual(12345);
                        expect(res.busyUntil).toEqual(55321);
                        expect(getter).not.toHaveBeenCalled();
                    });

        });

        it('should resume from incomplete cache', function () {
            const result = {
                data: 'hi',
                nextParams: {next: 'params'}
            }
            const cache = {
                getJson: () => result,
                getLastRefreshTimeUtcMsec: () => 12345,
                lastDirtiedTimeUtcMsec: 54321,
                getDirtyIntervalMsec: () => 1000,
                isDirty: () => true
            }
            mockCache.getCache = jasmine.createSpy().and.returnValue(cache);

            const getter = jasmine.createSpy();

            const results = [];

            datasource.batchGet = jasmine.createSpy().and
                .returnValue(rx.Observable.just({
                    data: '2nd',
                    nextParams: undefined
                }))

            datasource.batchGetWithCache({getter, initialParams: {}})
                .subscribe(
                    res => {
                        results.push(res);
                        if (results.length === 1) {
                            expect(mockCache.getCache).toHaveBeenCalledWith('key', stb);
                            expect(res.data).toEqual('hi');
                            expect(res.lastUpdated).toEqual(undefined);
                            expect(res.busyUntil).toEqual(undefined);
                            expect(datasource.batchGet).toHaveBeenCalledWith(getter, {next: 'params'});
                        } else if (results.length === 2) {
                            expect(res.data).toEqual('2nd');
                        }
                    });
        });

        it('should start from scratch if not cached at all', function () {
            mockCache.getCache = jasmine.createSpy().and.returnValue(undefined);

            const getter = jasmine.createSpy();

            const results = [];

            datasource.batchGet = jasmine.createSpy().and
                .returnValue(rx.Observable.just({
                    data: '1st',
                    nextParams: undefined
                }))

            datasource.batchGetWithCache({getter, initialParams: {initial: 'params'}})
                .subscribe(
                    res => {
                        results.push(res);
                        if (results.length === 1) {
                            expect(mockCache.getCache).toHaveBeenCalledWith('key', stb);
                            expect(res.data).toEqual('1st');
                            expect(res.lastUpdated).toEqual(undefined);
                            expect(res.busyUntil).toEqual(undefined);
                            expect(datasource.batchGet).toHaveBeenCalledWith(getter, {initial: 'params'});
                        }
                    });
        });
    });
});
