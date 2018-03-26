/* globals inject */
/* jshint jasmine: true */

describe('Scheduled Recordings Datasource', function () {
    'use strict';

    let ScheduledRecordingsDatasource, rx, $httpBackend, $rootScope, mockCache, stb, onNext, onError;

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
            startUnixTimestampSeconds: 'starttime',
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

    beforeEach(module(function ($provide) {
        $provide.value('profileService', mockProfileService);
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


    beforeEach(inject(function (_ScheduledRecordingsDatasource_, _rx_, _$httpBackend_, _$rootScope_) {
        ScheduledRecordingsDatasource = _ScheduledRecordingsDatasource_;
        rx = _rx_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        onNext = rx.ReactiveTest.onNext;
        onError = rx.ReactiveTest.onError;
    }));


    let datasource;

    beforeEach(function () {
        stb = {
            dvr: true,
            macAddressNormalized: 'fakeMac',
            rdvrVersion: 2
        }
        datasource = new ScheduledRecordingsDatasource(stb);
    });

    describe('source', function () {
        const mockResult = {
            data: [
                createMockDataDelegate(createMockRecording('a')),
            ],
            isComplete: true
        }

        it('should do nothing if no stb supplied', function () {
            let noStbDatasource = new ScheduledRecordingsDatasource(undefined);
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
            let nonDvrDatasource = new ScheduledRecordingsDatasource({
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
        it('should clear locallyScheduled and locallyCancelled', function () {
            datasource.locallyScheduled.onNext('this better not be here when i get back...');
            datasource.locallyCancelled.onNext('this better not be here when i get back...');

            datasource.fetch = jasmine.createSpy();
            datasource.fetchAndCombineWithLocalChanges();
            expect(datasource.locallyScheduled.getValue()).toEqual([])
            expect(datasource.locallyCancelled.getValue()).toEqual([])
        });

        it('should use the force parameter when calling fetch', function () {
            datasource.fetch = jasmine.createSpy();
            datasource.fetchAndCombineWithLocalChanges(true);
            expect(datasource.fetch).toHaveBeenCalledWith(true);

            datasource.fetch = jasmine.createSpy();
            datasource.fetchAndCombineWithLocalChanges(false);
            expect(datasource.fetch).toHaveBeenCalledWith(false);
        });

        it('should work with no recordings, no scheduled, no cancelled (complete)', function () {
            datasource.fetch = jasmine.createSpy()
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

        it('should work with no recordings, no scheduled, no cancelled (incomplete)', function () {
            datasource.fetch = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [],
                    nextParams: {}
                }));

            datasource.fetchAndCombineWithLocalChanges()
                .subscribe(result => {
                    resultsEqual(result, {
                        data: [],
                        isComplete: false
                    });
                });
        });

        it('should work with recordings, no scheduled, no cancelled', function () {
            datasource.fetch = jasmine.createSpy()
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

            expect(mockCache.createNewCache).toHaveBeenCalledWith(
                'SCHEDULED',
                stb,
                {
                    data: [
                        createMockRecording('a')
                    ],
                    nextParams: undefined
                });

            expect(mockCache.updateCache).not.toHaveBeenCalled();
        });

        it('should add in locally scheduled (sort to end of list)', function () {
            const recording1 = createMockRecording('a');
            recording1.startTime = 1;

            const recording2 = createMockRecording('b');
            recording2.startTime = 2;

            datasource.fetch = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording1
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
                                createMockDataDelegate(recording1)
                            ],
                            isComplete: true
                        });
                    } else if (results.length === 2) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording2)
                            ],
                            isComplete: true
                        });
                    }
                });

            datasource.locallyScheduled.onNext([recording2]);

            expect(mockCache.updateCache).toHaveBeenCalledWith(
                'SCHEDULED',
                stb,
                {
                    data: [
                        recording1,
                        recording2
                    ],
                    nextParams: undefined
                });
        });

        it('should add in locally scheduled (sort to front of list)', function () {
            const recording1 = createMockRecording('a');
            recording1.startTime = 2;

            const recording2 = createMockRecording('b');
            recording2.startTime = 1;

            datasource.fetch = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording1
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
                                createMockDataDelegate(recording1)
                            ],
                            isComplete: true
                        });
                    } else if (results.length === 2) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording2),
                                createMockDataDelegate(recording1)
                            ],
                            isComplete: true
                        });
                    }
                });

            datasource.locallyScheduled.onNext([recording2])

            expect(mockCache.updateCache).toHaveBeenCalledWith(
                'SCHEDULED',
                stb,
                {
                    data: [
                        recording2,
                        recording1
                    ],
                    nextParams: undefined
                });
        });

        it('should add in multiple locally scheduled', function () {
            const recording1 = createMockRecording('a');
            recording1.startTime = 1;

            const recording2 = createMockRecording('b');
            recording2.startTime = 2;

            const recording3 = createMockRecording('c');
            recording3.startTime = 3;

            datasource.fetch = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording1
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
                                createMockDataDelegate(recording1)
                            ],
                            isComplete: true
                        });
                    } else if (results.length === 2) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording2)
                            ],
                            isComplete: true
                        });
                    }  else if (results.length === 3) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording2),
                                createMockDataDelegate(recording3)
                            ],
                            isComplete: true
                        });
                    }
                });

            datasource.locallyScheduled.onNext([recording2]);
            datasource.locallyScheduled.onNext([recording2, recording3]);

            expect(mockCache.updateCache).toHaveBeenCalledWith(
                'SCHEDULED',
                stb,
                {
                    data: [
                        recording1,
                        recording2,
                        recording3
                    ],
                    nextParams: undefined
                });
        });

        it('should remove locally cancelled', function () {
            const recording1 = createMockRecording('a');
            recording1.startTime = 1;

            const recording2 = createMockRecording('b');
            recording2.startTime = 2;

            const recording3 = createMockRecording('c');
            recording3.startTime = 3;

            datasource.fetch = jasmine.createSpy()
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

            datasource.locallyCancelled.onNext([recording2]);

            expect(mockCache.updateCache).toHaveBeenCalledWith(
                'SCHEDULED',
                stb,
                {
                    data: [
                        recording1,
                        recording3
                    ],
                    nextParams: undefined
                });
        });

        it('should work when both adding and removing', function () {
            const recording1 = createMockRecording('a');
            recording1.startTime = 1;

            const recording2 = createMockRecording('b');
            recording2.startTime = 2;

            const recording3 = createMockRecording('c');
            recording3.startTime = 3;

            datasource.fetch = jasmine.createSpy()
                .and.returnValue(rx.Observable.just({
                    data: [
                        recording1
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
                                createMockDataDelegate(recording1)
                            ],
                            isComplete: true
                        });
                    } else if (results.length === 2) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording1),
                                createMockDataDelegate(recording2)
                            ],
                            isComplete: true
                        });
                    }  else if (results.length === 3) {
                        resultsEqual(result, {
                            data: [
                                createMockDataDelegate(recording2)
                            ],
                            isComplete: true
                        });
                    }
                });

            datasource.locallyScheduled.onNext([recording2]);
            datasource.locallyCancelled.onNext([recording1]);

            expect(mockCache.updateCache).toHaveBeenCalledWith(
                'SCHEDULED',
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

            datasource.fetch = jasmine.createSpy()
                .and.returnValue(fakeBatches);

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

    describe('fetch', function () {
        it('should clear cache if force = true', function () {
            datasource.batchGetWithCache = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            datasource.clearCache = jasmine.createSpy();
            datasource.fetch(true);
            expect(datasource.clearCache).toHaveBeenCalled();
            expect(datasource.batchGetWithCache).toHaveBeenCalledWith({
                getter: jasmine.any(Function),
                initialParams: {startTime: 0, includeCurrent: true}
            });
        });

        it('should not reset cache if force = false', function () {
            datasource.batchGetWithCache = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            datasource.clearCache = jasmine.createSpy();
            datasource.fetch(false);
            expect(datasource.clearCache).not.toHaveBeenCalled();
            expect(datasource.batchGetWithCache).toHaveBeenCalledWith({
                getter: jasmine.any(Function),
                initialParams: {startTime: 0, includeCurrent: true}
            });
        });

        it('should catch errors', function () {
            datasource.batchGetWithCache = jasmine.createSpy()
                .and.returnValue(rx.Observable.throw('fail'));

            datasource.fetch(false)
                .subscribe(
                    result => {
                        expect(result.data).toEqual([]);
                        expect(result.error).toEqual('fail');
                    },
                    error => {
                        expect(false).toEqual(true, 'should have caught and transformed error')
                    })
        });

        it('should merge batches and remove duplicates', function () {
            const recording1 = createMockRecording('a');
            const recording2 = createMockRecording('b');
            const recording3 = createMockRecording('c');

            datasource.batchGetWithCache = jasmine.createSpy()
                .and.returnValue(rx.Observable.fromArray([{
                    data: [recording1, recording2],
                    nextParams: 2
                }, {
                    data: [recording2, recording3]
                }]));

            const results = [];

            datasource.fetch(false)
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

    describe('getOneScheduledRecordingBatch', function () {
        it('should concatenate current + recordings', function () {
            const current = [
                createMockRecording('a'),
                createMockRecording('b')
            ];
            const recordings = [
                createMockRecording('c'),
            ]
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(200, {current, recordings});

            let source = datasource.getOneScheduledRecordingBatch({
                startTime: 1234,
                includeCurrent: true
            });

            source.subscribe(result => {
                expect(result.data).toEqual(current.concat(recordings));
                expect(result.nextParams).toEqual(undefined);
            });

            $httpBackend.flush();
        });

        it('should work if there are no current recordings', function () {
            const recordings = [
                createMockRecording('c'),
            ]
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(200, {recordings});

            let source = datasource.getOneScheduledRecordingBatch({
                startTime: 1234,
                includeCurrent: false
            });

            source.subscribe(result => {
                expect(result.data).toEqual(recordings);
                expect(result.nextParams).toEqual(undefined);
            });

            $httpBackend.flush();
        });

        it('should add empty metadata if necessary', function () {
            const recordings = [
                createMockRecording('c'),
            ];
            delete recordings[0].programMetadata;

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(200, {recordings});

            let source = datasource.getOneScheduledRecordingBatch({
                startTime: 1234,
                includeCurrent: false
            });

            source.subscribe(result => {
                expect(result.data[0].programMetadata).toBeDefined();
                expect(result.nextParams).toEqual(undefined);
            });

            $httpBackend.flush();
        });

        it('should retry a single failure', function () {
            const recordings = [
                createMockRecording('c'),
            ]
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(500, 'fail1');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(200, {recordings});

            let source = datasource.getOneScheduledRecordingBatch({
                startTime: 1234,
                includeCurrent: false
            });

            source.subscribe(result => {
                expect(result.data).toEqual(recordings);
                expect(result.nextParams).toEqual(undefined);
            });

            $httpBackend.flush();
        });

        it('should not retry second failure', function () {
            const recordings = [
                createMockRecording('c'),
            ]
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(500, 'fail1');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(500, 'fail2');

            let source = datasource.getOneScheduledRecordingBatch({
                startTime: 1234,
                includeCurrent: false
            });

            source.subscribe(result => {
                expect(false).toEqual(true, 'should not have succeeded');
            }, error => {
                expect(error.data).toEqual('fail2');
                expect(error.status).toEqual(500);
            });

            $httpBackend.flush();
        });

        it('should create nextParams if response is 206', function () {
            const recordings = [
                createMockRecording('c'),
            ]
            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/fakeMac/scheduled?startUnixTimestampSeconds=1234')
                .respond(206, {recordings, lastStartTime: 987});

            let source = datasource.getOneScheduledRecordingBatch({
                startTime: 1234,
                includeCurrent: false
            });

            source.subscribe(result => {
                expect(result.data).toEqual(recordings);
                expect(result.nextParams).toEqual({
                    startTime: 987,
                    includeCurrent: false
                });
            });

            $httpBackend.flush();
        });
    });

    describe('schedule recording', function () {
        it('should emit to locallyScheduled observable, if not a series recording', function () {
            $httpBackend.expectPUT('/nrs/api/rdvr2/dvr/fakeMac/schedule/mystro/a/starttime/single')
                .respond(200, {});

            const someOldRecording = createMockRecording('old');
            const recording = createMockRecording('a');
            const wrappedRecording = createMockDataDelegate(recording);
            recording.recordSeries = false;

            datasource.locallyScheduled.onNext([someOldRecording]);

            const val = datasource.scheduleRecording(wrappedRecording);
            expect(val).toBeDefined();
            expect(val.then).toBeDefined();

            val.then(
                resolve => {},
                error => {
                    expect(false).toEqual(true, 'should not have errored');
                });

            $httpBackend.flush();

            //Note: the values emitted are not wrapped in data delegates. This is intentional
            expect(datasource.locallyScheduled.getValue()).toEqual([someOldRecording, recording]);
        });

        it('series recording', function () {
            $httpBackend.expectPUT('/nrs/api/rdvr2/dvr/fakeMac/schedule/mystro/a/starttime/series')
                .respond(200, {});

            const someOldRecording = createMockRecording('old');
            const recording = createMockRecording('a');
            recording.recordSeries = true;
            const wrappedRecording = createMockDataDelegate(recording);

            datasource.locallyScheduled.onNext([someOldRecording]);

            const val = datasource.scheduleRecording(wrappedRecording);
            expect(val).toBeDefined();
            expect(val.then).toBeDefined();

            val.then(
                result => {},
                error => {
                    expect(false).toEqual(true, 'should not have errored');
                });

            $httpBackend.flush();

            //Note: the values emitted are not wrapped in data delegates. This is intentional
            expect(datasource.locallyScheduled.getValue()).toEqual([someOldRecording, recording]);
        });

        it('should handle 500 followed by 439 as success', function () {
            //500 is a server error, which can occur if there's a timeout
            //439 indicates it's already scheduled.
            //So the combination basically means that we were successful, it just
            //took a while to notice it.

            $httpBackend.expectPUT('/nrs/api/rdvr2/dvr/fakeMac/schedule/mystro/a/starttime/series')
                .respond(200, {});

            datasource.expectErrors = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            const recording = createMockRecording('a');
            datasource.scheduleRecording(recording);

            expect(datasource.expectErrors).toHaveBeenCalledWith(jasmine.any(rx.Observable), [500, 439]);
        });
    });

    describe('cancel scheduled', function () {
        it('should emit to locallyCancelled observable', function () {
            $httpBackend.expectDELETE('/nrs/api/rdvr2/dvr/fakeMac/scheduled/mystro/a/starttime/single')
                .respond(200, {});

            const someOldRecording = createMockRecording('a');
            const recording = createMockRecording('a');
            const wrappedRecording = createMockDataDelegate(recording);
            recording.recordSeries = false;

            datasource.locallyCancelled.onNext([someOldRecording]);

            const val = datasource.cancelScheduled(wrappedRecording);
            expect(val).toBeDefined();
            expect(val.then).toBeDefined();

            val.then(
                resolve => {},
                error => {
                    expect(false).toEqual(true, 'should not have errored');
                });

            $httpBackend.flush();

            expect(datasource.locallyCancelled.getValue()).toEqual([someOldRecording, recording]);
        });


        it('should handle 500 followed by 404 as success', function () {
            //500 is a server error, which can occur if there's a timeout
            //439 indicates it's already scheduled.
            //So the combination basically means that we were successful, it just
            //took a while to notice it.

            $httpBackend.expectDELETE('/nrs/api/rdvr2/dvr/fakeMac/scheduled/mystro/a/starttime/single')
                .respond(200, {});

            datasource.expectErrors = jasmine.createSpy().and.returnValue(rx.Observable.empty());
            const recording = createMockRecording('a');
            const wrappedRecording = createMockDataDelegate(recording);
            datasource.cancelScheduled(wrappedRecording);

            expect(datasource.expectErrors).toHaveBeenCalledWith(jasmine.any(rx.Observable), [500, 404]);
        });
    });

    describe('expectErrors', function () {
        it('should treat success as success', function () {
            let scheduler = new rx.TestScheduler();

            const recordingSource = scheduler.createHotObservable(
                onNext(100, 'success'),
            );

            datasource.expectErrors(recordingSource, [500, 439], undefined, scheduler)
                .subscribe(
                    result => {
                        expect(result).toEqual('success');
                    },
                    error => {
                        expect(false).toEqual(true, 'should not have emitted an error');
                    });

            scheduler.advanceTo(100);
        });

        it('should treat expected sequence as success', function () {
            let scheduler = new rx.TestScheduler();

            const recordingSource = scheduler.createHotObservable(
                onError(100, {status: 500}),
                onError(650, {status: 439})
            );

            const results = []

            datasource.expectErrors(recordingSource, [500, 439], undefined, scheduler)
                .subscribe(
                    result => {
                        results.push(result);
                    },
                    error => {
                        expect(false).toEqual(true, 'should not have emitted an error');
                    });

            scheduler.advanceTo(100);
            expect(results.length).toEqual(0);
            scheduler.advanceTo(649);
            expect(results.length).toEqual(0);
            scheduler.advanceTo(650);
            expect(results.length).toEqual(1);
            expect(results[0]).toEqual({status: 439});
        });

        it('should treat partial match as error', function () {
            let scheduler = new rx.TestScheduler();

            const recordingSource = scheduler.createHotObservable(
                onError(100, {status: 500}),
                onError(650, {status: 500})
            );

            const results = []

            datasource.expectErrors(recordingSource, [500, 439], undefined, scheduler)
                .subscribe(
                    result => {
                        expect(false).toEqual(true, 'should not have succeeded');
                    },
                    error => {
                        expect(error).toEqual({status: 500});
                    });

            scheduler.advanceTo(650);
        });

        it('should treat no match as error', function () {
            let scheduler = new rx.TestScheduler();

            const recordingSource = scheduler.createHotObservable(
                onError(100, {status: 404}),
                onError(650, {status: 404})
            );

            const results = []

            datasource.expectErrors(recordingSource, [500, 439], undefined, scheduler)
                .subscribe(
                    result => {
                        expect(false).toEqual(true, 'should not have succeeded');
                    },
                    error => {
                        expect(error).toEqual({status: 404});
                    });

            scheduler.advanceTo(100);
        });
    });
});
