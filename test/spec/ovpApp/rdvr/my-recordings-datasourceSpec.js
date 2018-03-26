/* globals inject */
/* jshint jasmine: true */

describe('My Recordings Datasource', function () {
    'use strict';

    let MyRecordingsDatasource, rx, $httpBackend, $rootScope, mockCache, stb, datasource;

    function createMockDataDelegate(data) {
        return {
            _context: {
                data: data,
            },
            isInADataDelegate: true,
            mystroServiceId: data.mystroServiceId,
            tmsProgramId: data.tmsProgramId,
            startTime: data.startUnixTimestampSeconds,
            recordSeries: data.recordSeries
        }
    }

    function createMockRecording(id) {
        return {
            tmsProgramId: id,
            startTime: 'starttime',
            mystroServiceId: 'mystro',
            programMetadata: {},
        }
    }

    function resultsEqual(a, b) {
        expect(a.data).toEqual(b.data, 'data should have matched');
        expect(a.isComplete).toEqual(b.isComplete, 'isComplete should have matched');
        expect(a.error).toEqual(b.error, 'error should have matched');
        expect(a.lastUpdated).toEqual(b.lastUpdated, 'lastUpdated should have matched');
        expect(a.busyUntil).toEqual(b.busyUntil, 'busyUntil should have matched');
    }

    beforeEach(module('ovpApp.rdvr.datasource'));
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(module(function ($provide) {
        mockCache = {
            getCache: jasmine.createSpy(),
            createNewCache: jasmine.createSpy(),
            updateCache: jasmine.createSpy(),
            clearCache: jasmine.createSpy()
        };
        $provide.value('rdvrCacheService', mockCache);

        $provide.value('recordingViewModelDefinition', {
            createInstance: createMockDataDelegate
        });
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    beforeEach(inject(function (_MyRecordingsDatasource_, _rx_, _$httpBackend_, _$rootScope_) {
        MyRecordingsDatasource = _MyRecordingsDatasource_;
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
        datasource = new MyRecordingsDatasource(stb);
    });

    describe('source', function () {
        const mockResult = {
            data: [
                createMockDataDelegate(createMockRecording('a')),
            ],
            isComplete: true
        }

        it('should do nothing if no stb supplied', function () {
            let noStbDatasource = new MyRecordingsDatasource(undefined);
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
            let nonDvrDatasource = new MyRecordingsDatasource({
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
            datasource.fetchAndCombineWithLocalChanges = jasmine.createSpy()
                .and.returnValue(rx.Observable.just(mockResult));

            expect(datasource.source).toBeDefined();
            expect(datasource.fetchAndCombineWithLocalChanges).not.toHaveBeenCalled();
        });

        it('should fetch with cache on first time', function () {
            datasource.fetchAndCombineWithLocalChanges = jasmine.createSpy()
                .and.returnValue(rx.Observable.just(mockResult));

            expect(datasource.source).toBeDefined();

            const results = [];

            datasource.source.subscribe(
                result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, datasource.initialValue);
                    } else if (results.length === 2) {
                        resultsEqual(result, mockResult)
                    }
                });

            expect(datasource.fetchAndCombineWithLocalChanges).toHaveBeenCalledWith(false);
        });

        it('should fetch without cache when reset', function () {
            datasource.fetchAndCombineWithLocalChanges = jasmine.createSpy()
                .and.returnValue(rx.Observable.just(mockResult));
            expect(datasource.source).toBeDefined();

            const results = [];

            datasource.source.subscribe(
                result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, datasource.initialValue);
                    } else if (results.length === 2) {
                        resultsEqual(result, mockResult);
                        datasource.reset();
                    } else if (results.length === 3) {
                        resultsEqual(result, datasource.initialValue);
                    } else if (results.length === 4) {
                        resultsEqual(result, mockResult);
                    }
                });

            expect(datasource.fetchAndCombineWithLocalChanges).toHaveBeenCalledWith(false);
            expect(datasource.fetchAndCombineWithLocalChanges).toHaveBeenCalledWith(true);
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

            datasource.fetchAndCombineWithLocalChanges = jasmine.createSpy().and.callFake(function () {
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

            expect(datasource.fetchAndCombineWithLocalChanges).toHaveBeenCalledWith(false);
            expect(results.length).toEqual(1);
            resultsEqual(results[0], datasource.initialValue)

            scheduler.advanceTo(99);
            expect(results.length).toEqual(1);
            datasource.reset();
            expect(results.length).toEqual(2);
            resultsEqual(results[1], datasource.initialValue)

            scheduler.advanceTo(100);
            expect(wentOff).toEqual(false, 'should have unsubscribed from the first observable upon reset')

            scheduler.advanceTo(149);
            expect(results.length).toEqual(3);
            resultsEqual(results[2], mockResult);

            scheduler.advanceTo(10000);
            expect(results.length).toEqual(3);
        });
    });

    describe('fetchAndCombineWithLocalChanges', function () {
        it('should clear locallyDeleted', function () {
            datasource.locallyDeleted.onNext('this better not be here when i get back...');

            datasource.fetch = jasmine.createSpy();
            datasource.fetchAndCombineWithLocalChanges();
            expect(datasource.locallyDeleted.getValue()).toEqual([])
        });

        it('should use the force parameter when fetching completed recordings', function () {
            datasource.fetchCompleted = jasmine.createSpy();
            datasource.fetchAndCombineWithLocalChanges(true);
            expect(datasource.fetchCompleted).toHaveBeenCalledWith(true);

            datasource.fetchCompleted = jasmine.createSpy();
            datasource.fetchAndCombineWithLocalChanges(false);
            expect(datasource.fetchCompleted).toHaveBeenCalledWith(false);
        });

        it('should work when there are absolutely no recordings (complete)', function () {
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    resultsEqual(result, {
                        data: [],
                        isComplete: true
                    });
                });
        });

        it('should work when there are absolutely no recordings (incomplete)', function () {
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: {}
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    resultsEqual(result, {
                        data: [],
                        isComplete: false
                    });
                });
        });

        it('should work when there are only completed recordings', function () {
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        createMockRecording('a')
                    ],
                    nextParams: undefined
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    resultsEqual(result, {
                        data: [
                            createMockDataDelegate(createMockRecording('a'))
                        ],
                        isComplete: true
                    });
                });

            expect(mockCache.createNewCache).toHaveBeenCalledWith(
                'COMPLETED',
                stb,
                {
                    data: [
                        createMockRecording('a')
                    ],
                    nextParams: undefined
                });

            expect(mockCache.updateCache).not.toHaveBeenCalled();
        });

        it('should work when there are only in progress recordings', function () {
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        createMockRecording('a')
                    ],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    resultsEqual(result, {
                        data: [
                            createMockDataDelegate(createMockRecording('a'))
                        ],
                        isComplete: true
                    });
                });
        });

        it('should work when there are only completed and in progress recordings', function () {
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        createMockRecording('a'),
                        createMockRecording('b')
                    ],
                    nextParams: undefined
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        createMockRecording('c'),
                        createMockRecording('d')
                    ],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    resultsEqual(result, {
                        data: [
                            createMockDataDelegate(createMockRecording('c')),
                            createMockDataDelegate(createMockRecording('d')),
                            createMockDataDelegate(createMockRecording('a')),
                            createMockDataDelegate(createMockRecording('b'))
                        ],
                        isComplete: true
                    });
                });

            expect(mockCache.createNewCache).toHaveBeenCalledWith(
                'COMPLETED',
                stb,
                {
                    data: [
                        createMockRecording('a'),
                        createMockRecording('b')
                    ],
                    nextParams: undefined
                });

            expect(mockCache.updateCache).not.toHaveBeenCalled();
        });

        it('should work when there are only completed recordings and locally deleted recordings', function () {
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');
            const recording3 = createMockRecording('c');
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording1,
                        recording2,
                        recording3
                    ],
                    nextParams: undefined
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording2),
                                createMockDataDelegate(recording3)

                            ],
                            isComplete: true
                        });
                    } else if (results.length === 2) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording3)
                            ],
                            isComplete: true
                        });
                    }
                });

            datasource.locallyDeleted.onNext([recording2]);

            expect(mockCache.updateCache).toHaveBeenCalledWith(
                'COMPLETED',
                stb,
                {
                    data: [
                        recording1,
                        recording3
                    ],
                    nextParams: undefined
                });
        });

        it('should work when there are only in progress recordings and locally deleted recordings', function () {
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');
            const recording3 = createMockRecording('c');
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording1,
                        recording2,
                        recording3
                    ],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording2),
                                createMockDataDelegate(recording3)

                            ],
                            isComplete: true
                        });
                    } else if (results.length === 2) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording3)
                            ],
                            isComplete: true
                        });
                    }
                });

            datasource.locallyDeleted.onNext([recording2]);
        });

        it('should work when there is some of everything', function () {
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');
            const recording3 = createMockRecording('c');
            const recording4 = createMockRecording('d');
            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording1,
                        recording2
                    ],
                    nextParams: undefined
                }));

            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording3,
                        recording4
                    ],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    if (results.length === 1) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording3),
                                createMockDataDelegate(recording4),
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording2)
                            ],
                            isComplete: true
                        });
                    } else if (results.length === 2) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording3),
                                createMockDataDelegate(recording4),
                                createMockDataDelegate(recording2)
                            ],
                            isComplete: true
                        });
                    }
                });

            datasource.locallyDeleted.onNext([recording1]);

            expect(mockCache.updateCache).toHaveBeenCalledWith(
                'COMPLETED',
                stb,
                {
                    data: [
                        recording2
                    ],
                    nextParams: undefined
                });
        });

        it('should provide continuity of the data delegates', function () {
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');

            const fakeBatches = rx.Observable.fromArray([
                {
                    data: [recording1],
                    nextParams: 'blah'
                },
                {
                    data: [recording1, recording2]
                }
            ]);

            datasource.fetchCompleted = jasmine.createSpy()
                .and.returnValue(fakeBatches);


            datasource.fetchInProgress = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: undefined
                }));

            const results = [];

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    results.push(result);
                    if (results.length === 1) {
                        expect(result.data.length).toEqual(1);
                    } else if (results.length === 2) {
                        expect(result.data.length).toEqual(2);
                        expect(results[0].data[0]).toBe(results[1].data[0],
                            'should have returned literally the same data delegate object');
                    }
                });
        });
    });

    describe('fetchCompleted', function () {
        it('should clear cache if force = true', function () {
            datasource.batchGetWithCache = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            datasource.clearCache = jasmine.createSpy();
            datasource.fetchCompleted(true);
            expect(datasource.clearCache).toHaveBeenCalled();
            expect(datasource.batchGetWithCache).toHaveBeenCalledWith({
                getter: jasmine.any(Function),
                initialParams: 0
            });
        });

        it('should not reset cache if force = false', function () {
            datasource.batchGetWithCache = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            datasource.clearCache = jasmine.createSpy();
            datasource.fetchCompleted(false);
            expect(datasource.clearCache).not.toHaveBeenCalled();
            expect(datasource.batchGetWithCache).toHaveBeenCalledWith({
                getter: jasmine.any(Function),
                initialParams: 0
            });
        });

        it('should catch errors', function () {
            datasource.batchGetWithCache = jasmine.createSpy()
                .and.returnValue(rx.Observable.throw('fail'));

            datasource.fetchCompleted(false)
                .subscribe(
                    result => {
                        expect(result.data).toEqual([]);
                        expect(result.error).toEqual('fail');
                    },
                    error => {
                        expect(false).toEqual(true, 'should have caught and transformed error')
                    })
        });

        it('should merge batches', function () {
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');
            const recording3 = createMockRecording('c');

            datasource.batchGetWithCache = jasmine.createSpy()
                .and.returnValue(rx.Observable.fromArray([{
                    data: [recording1, recording2],
                    nextParams: 3
                }, {
                    data: [recording3]
                }]));

            const results = [];

            datasource.fetchCompleted(false)
                .subscribe(result => {
                    results.push(results);
                    if (results.length === 1) {
                        expect(result.data).toEqual([recording1, recording2]);
                    } else if (results.length === 2) {
                        expect(result.data).toEqual([recording1, recording2, recording3]);
                    }
                });
        });
    });

    describe('fetchInProgress', function () {
        it('should handle success', function () {
            const recordings = [
                createMockRecording('a'),
                createMockRecording('b')
            ]
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recording')
                .respond(200, {recordings});

            datasource.fetchInProgress()
                .subscribe(result => {
                    expect(result.data).toEqual(recordings);
                    expect(result.nextParams).toEqual(undefined);
                });

            $httpBackend.flush();
        });

        it('should add missing programMetadata', function () {
            const recording1 = createMockRecording('a');
            delete recording1.programMetadata;
            const recording2 = createMockRecording('b');
            delete recording2.programMetadata;
            const recordings = [
                recording1,
                recording2,
            ];

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recording')
                .respond(200, {recordings});

            datasource.fetchInProgress()
                .subscribe(result => {
                    expect(result.data.length).toEqual(2);
                    expect(result.data[0].programMetadata).toBeDefined();
                    expect(result.data[1].programMetadata).toBeDefined();
                    expect(result.nextParams).toEqual(undefined);
                });

            $httpBackend.flush();
        });

        it('should retry one failure', function () {
            const recordings = [
                createMockRecording('a'),
                createMockRecording('b')
            ]

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recording')
                .respond(500, 'fail');
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recording')
                .respond(200, {recordings});

            datasource.fetchInProgress()
                .subscribe(result => {
                    expect(result.data).toEqual(recordings);
                    expect(result.nextParams).toEqual(undefined);
                });

            $httpBackend.flush();
        });

        it('should catch second failure', function () {
            const recordings = [
                createMockRecording('a'),
                createMockRecording('b')
            ]

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recording')
                .respond(500, 'fail1');
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recording')
                .respond(500, 'fail2');

            datasource.fetchInProgress()
                .subscribe(result => {
                    expect(result.data).toEqual([]);
                    expect(result.error).toBeDefined();
                    expect(result.error.status).toEqual(500);
                    expect(result.error.data).toEqual('fail2');
                }, error => {
                    expect(false).toEqual(true, 'should have caught the error')
                });

            $httpBackend.flush();
        });
    });

    describe('getOneCompletedRecordingBatch', function () {
        it('should handle success', function () {
            const recordings = [
                createMockRecording('a'),
                createMockRecording('b')
            ]
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recorded')
                .respond(200, {recordings});

            datasource.getOneCompletedRecordingBatch()
                .subscribe(result => {
                    expect(result.data).toEqual(recordings);
                    expect(result.nextParams).toEqual(undefined);
                });

            $httpBackend.flush();
        });

        it('should add missing programMetadata', function () {
            const recording1 = createMockRecording('a');
            delete recording1.programMetadata;
            const recording2 = createMockRecording('b');
            delete recording2.programMetadata;
            const recordings = [
                recording1,
                recording2,
            ];

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recorded')
                .respond(200, {recordings});

            datasource.getOneCompletedRecordingBatch()
                .subscribe(result => {
                    expect(result.data.length).toEqual(2);
                    expect(result.data[0].programMetadata).toBeDefined();
                    expect(result.data[1].programMetadata).toBeDefined();
                    expect(result.nextParams).toEqual(undefined);
                });

            $httpBackend.flush();
        });

        it('should retry one failure', function () {
            const recordings = [
                createMockRecording('a'),
                createMockRecording('b')
            ]

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recorded')
                .respond(500, 'fail');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recorded')
                .respond(200, {recordings});

            datasource.getOneCompletedRecordingBatch()
                .subscribe(result => {
                    expect(result.data).toEqual(recordings);
                    expect(result.nextParams).toEqual(undefined);
                });

            $httpBackend.flush();
        });

        it('should not retry second failure', function () {
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recorded')
                .respond(500, 'fail1');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/recorded')
                .respond(500, 'fail2');

            datasource.getOneCompletedRecordingBatch()
                .subscribe(result => {
                    expect(false).toEqual(true, 'should not have caught the error')
                }, error => {
                    expect(error.status).toEqual(500);
                    expect(error.data).toEqual('fail2');
                });

            $httpBackend.flush();
        });
    });

    describe('delete recordings', function () {
        it('should emit to locallyDeleted observable', function () {
            $httpBackend.expectPUT('/nrs/api/rdvr2/dvr/fakeMac/recorded/delete')
                .respond(200, {
                    failedDeletions: []
                });

            const someOldRecording = createMockRecording('old');
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');
            const wrappedRecording1 = createMockDataDelegate(recording1);
            const wrappedRecording2 = createMockDataDelegate(recording2);

            datasource.locallyDeleted.onNext([someOldRecording]);

            const val = datasource.deleteRecordings([wrappedRecording1, wrappedRecording2]);
            expect(val).toBeDefined();
            expect(val.then).toBeDefined();

            val.then(
                result => {
                    expect(result.data).toEqual({
                        failedDeletions: []
                    });
                },
                error => {
                    expect(false).toEqual(true, 'should not have errored');
                });

            $httpBackend.flush();

            expect(datasource.locallyDeleted.getValue()).toEqual([someOldRecording, recording1, recording2]);
        });

        it('should handle partial failure', function () {
            const someOldRecording = createMockRecording('old');
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');
            const wrappedRecording1 = createMockDataDelegate(recording1);
            const wrappedRecording2 = createMockDataDelegate(recording2);

            $httpBackend.expectPUT('/nrs/api/rdvr2/dvr/fakeMac/recorded/delete')
                .respond(200, {
                    failedDeletions: [
                        recording1
                    ]
                });

            datasource.locallyDeleted.onNext([someOldRecording]);

            const val = datasource.deleteRecordings([wrappedRecording1, wrappedRecording2]);
            expect(val).toBeDefined();
            expect(val.then).toBeDefined();

            val.then(
                result => {
                    expect(result.data).toEqual({
                        failedDeletions: [recording1]
                    });
                },
                error => {
                    expect(false).toEqual(true, 'should not have errored');
                });

            $httpBackend.flush();

            expect(datasource.locallyDeleted.getValue()).toEqual([someOldRecording, recording2]);
        });
    });
});
