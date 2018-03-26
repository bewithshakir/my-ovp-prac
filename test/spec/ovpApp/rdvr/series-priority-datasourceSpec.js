/* globals inject */
/* jshint jasmine: true */

describe('Series Priority Datasource', function () {
    'use strict';

    let SeriesPriorityDatasource, rx, $httpBackend, $rootScope, mockCache, stb;

    beforeEach(module('ovpApp.rdvr.datasource'));

    beforeEach(module(function ($provide) {
        $provide.value('profileService', mockProfileService);
        mockCache = {
            getCache: jasmine.createSpy(),
            createNewCache: jasmine.createSpy(),
            updateCache: jasmine.createSpy(),
            clearCache: jasmine.createSpy()
        };
        $provide.value('rdvrCacheService', mockCache);
        $provide.value('errorCodesService', mockErrorCodesService);
    }));


    beforeEach(inject(function (_SeriesPriorityDatasource_, _rx_, _$httpBackend_, _$rootScope_) {
        SeriesPriorityDatasource = _SeriesPriorityDatasource_;
        rx = _rx_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    let datasource;

    beforeEach(function () {
        stb = {
            dvr: true,
            macAddressNormalized: 'fakeMac',
            rdvrVersion: 2
        }
        datasource = new SeriesPriorityDatasource(stb);
    });

    describe('fetch', function () {
        it('should return an observable', function () {
            const val = datasource.fetch();
            expect(val).toBeDefined();
            expect(val instanceof rx.Observable).toEqual(true);
        });

        it('should do nothing if no stb supplied', function () {

        });

        it('should do nothing if stb is not a dvr', function () {

        });

        it('should use the results of batchGetWithCache', function () {
            // const recordings = [
            //     createMockRecording('a'),
            //     createMockRecording('b')
            // ]

            // datasource.batchGetWithCache = jasmine.createSpy()
            //     .and.returnValue(rx.Observable.just({
            //         data: recordings
            //     }));

            // const results = [];

            // datasource.subject
            //     .subscribe(
            //         result => {
            //             results.push(result);
            //             if (results.length === 1) {
            //                 checkResult(result, [], false);
            //             } else if (results.length == 2) {
            //                 checkResult(result, ['a', 'b'], true);

            //                 expect(mockCache.createNewCache).toHaveBeenCalledWith(
            //                     'SCHEDULED',
            //                     stb,
            //                     {
            //                         data: recordings,
            //                         nextParams: undefined
            //                     }
            //                 );
            //             }
            //         });

            // datasource.fetch();
        });

        xit('should provide continuity of the resulting array', function () {
            // const recordings = [
            //     createMockRecording('a'),
            //     createMockRecording('b')
            // ];

            // const extraRecording = createMockRecording('c');

            // const fakeBatches = rx.Observable.fromArray([
            //     {
            //         data: recordings,
            //         nextParams: 'blah'
            //     },
            //     {
            //         data: recordings
            //     }
            // ]);

            // datasource.batchGetWithCache = jasmine.createSpy()
            //     .and.returnValue(fakeBatches);

            // const results = [];

            // datasource.subject
            //     .subscribe(
            //         result => {
            //             results.push(result);
            //             if (results.length === 1) {
            //                 checkResult(result, [], false);
            //             } else if (results.length == 2) {
            //                 checkResult(result, ['a', 'b'], false);
            //                 recordings.push(extraRecording);
            //             } else if (results.length === 3) {
            //                 checkResult(result, ['a', 'b', 'c'], true);

            //                 expect(result.data[0]).toBe(results[1].data[0]);
            //                 expect(result.data[1]).toBe(results[1].data[1]);
            //             }
            //         });

            // datasource.fetch();
        });
    });

    describe('getOneSeriesPriorityBatch', function () {
        it('should handle success', function () {
            const response = {
                series: [{}, {}, {}],
                totalCount: 3
            }
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/series/priorities?maxEventCount=100&startIndex=0')
                .respond(200, response);

            let source = datasource.getOneSeriesPriorityBatch(0);

            source.subscribe(result => {
                expect(result.data).toEqual(response.series);
                expect(result.nextParams).toEqual(undefined);
            });

            $httpBackend.flush();
        });

        it('should retry a single failure', function () {
            const response = {
                series: [{}, {}, {}],
                totalCount: 3
            }
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/series/priorities?maxEventCount=100&startIndex=0')
                .respond(500, 'fail');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/series/priorities?maxEventCount=100&startIndex=0')
                .respond(200, response);

            let source = datasource.getOneSeriesPriorityBatch(0);

            source.subscribe(result => {
                expect(result.data).toEqual(response.series);
                expect(result.nextParams).toEqual(undefined);
            });

            $httpBackend.flush();
        });

        it('should not retry second failure', function () {
            const response = {
                series: [{}, {}, {}],
                totalCount: 3
            }
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/series/priorities?maxEventCount=100&startIndex=0')
                .respond(500, 'fail1');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/series/priorities?maxEventCount=100&startIndex=0')
                .respond(500, 'fail2');

            let source = datasource.getOneSeriesPriorityBatch(0);

            source.subscribe(result => {
                expect(false).toEqual(true, 'should not have succeeded');
            }, error => {
                expect(error.data).toEqual('fail2');
                expect(error.status).toEqual(500);
            });

            $httpBackend.flush();
        });

        it('should create nextParams if there are more series', function () {
            const response = {
                series: [{}, {}, {}],
                totalCount: 4
            }
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/series/priorities?maxEventCount=100&startIndex=0')
                .respond(200, response);

            let source = datasource.getOneSeriesPriorityBatch(0);

            source.subscribe(result => {
                expect(result.data).toEqual(response.series);
                expect(result.nextParams).toEqual(3);
            });

            $httpBackend.flush();
        });

        it('should create nextParams if there are more series (on a later batch)', function () {
            const response = {
                series: [{}, {}, {}],
                totalCount: 104
            }
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/series/priorities?maxEventCount=100&startIndex=100')
                .respond(200, response);

            let source = datasource.getOneSeriesPriorityBatch(100);

            source.subscribe(result => {
                expect(result.data).toEqual(response.series);
                expect(result.nextParams).toEqual(103);
            });

            $httpBackend.flush();
        });
    });

    describe('setSeriesPriorities', function () {
        it('should return a promise', function () {

        });
    });
});
