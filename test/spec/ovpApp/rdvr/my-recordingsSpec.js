/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.rdvr.myRecordings', function () {
    'use strict';

    let rdvrService, stbService, rx, controller, onNext, $q, $rootScope;

    beforeEach(module('ovpApp.rdvr.myRecordings'));
    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function ($componentController, _stbService_, _rdvrService_, _rx_, _$q_, _$rootScope_) {
        stbService = _stbService_;
        rdvrService = _rdvrService_;
        rx = _rx_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        onNext = rx.ReactiveTest.onNext;

        controller = $componentController('myRecordings');
    }));

    describe('source', function () {
        beforeEach(function () {
            controller.processRecordings = jasmine.createSpy();
            controller.updateLoadingIndicator = jasmine.createSpy();
            controller.updateSubheader = jasmine.createSpy();
            controller.handleError = jasmine.createSpy();
        });

        it('should work in success case', function () {
            stbService.currentStbSource = rx.Observable.just({
                dvr: true,
                rdvrVersion: 2
            });

            const result = {
                data: [],
                isComplete: true
            }

            controller.getMyRecordingGroups = jasmine.createSpy().and
                .returnValue(rx.Observable.just(result))

            controller.$onInit();

            expect(controller.processRecordings).toHaveBeenCalledWith(result);
            expect(controller.updateLoadingIndicator).toHaveBeenCalledWith(result);
            expect(controller.updateSubheader).toHaveBeenCalledWith(result);
            expect(controller.handleError).toHaveBeenCalledWith(result);
        });

        it('should update when stb changes', function () {
            const stbs = [{
                macAddressNormalized: '12345',
                dvr: true,
                rdvrVersion: 2
            }, {
                macAddressNormalized: '67890',
                dvr: true,
                rdvrVersion: 2
            }];
            stbService.currentStbSource = rx.Observable.from(stbs);

            controller.getMyRecordingGroups = jasmine.createSpy().and.returnValue(rx.Observable.empty());

            controller.$onInit();

            expect(controller.getMyRecordingGroups).toHaveBeenCalledWith(stbs[0]);
            expect(controller.getMyRecordingGroups).toHaveBeenCalledWith(stbs[1]);
        });

        it('should ignore nondvrs and rdvrVersion < 2', function () {
            const stbs = [{
                macAddressNormalized: '12345',
                dvr: true,
                rdvrVersion: 2
            }, {
                macAddressNormalized: '67890',
                dvr: false
            }, {
                macAddressNormalized: '13579',
                dvr: true,
                rdvrVersion: 1
            }];
            stbService.currentStbSource = rx.Observable.from(stbs);

            controller.getMyRecordingGroups = jasmine.createSpy().and.returnValue(rx.Observable.empty());

            controller.$onInit();

            expect(controller.getMyRecordingGroups).toHaveBeenCalledWith(stbs[0]);
            expect(controller.getMyRecordingGroups).not.toHaveBeenCalledWith(stbs[1]);
            expect(controller.getMyRecordingGroups).not.toHaveBeenCalledWith(stbs[2]);
        });

        it('should stop when destroyed', function () {
            const scheduler = new rx.TestScheduler();

            stbService.currentStbSource = rx.Observable.just({
                dvr: true,
                rdvrVersion: 2
            });

            const result = {
                data: [],
                isComplete: true
            }


            controller.getMyRecordingGroups = jasmine.createSpy().and.returnValue(
                rx.Observable.timer(500, scheduler)
                    .map(() => result)
            );

            controller.$onInit();

            scheduler.advanceTo(499);

            controller.$onDestroy();

            scheduler.advanceTo(500);

            expect(controller.processRecordings).not.toHaveBeenCalledWith(result);
            expect(controller.updateLoadingIndicator).not.toHaveBeenCalledWith(result);
            expect(controller.updateSubheader).not.toHaveBeenCalledWith(result);
            expect(controller.handleError).not.toHaveBeenCalledWith(result);
        });
    });

    describe('getMyRecordingGroups', function () {
        it('should get from rdvrService', function () {
            stbService.currentStbSource = rx.Observable.never();

            const result = {
                data: [],
                isComplete: true
            }

            rdvrService.getMyRecordingGroups = jasmine.createSpy().and
                .returnValue(rx.Observable.just(result));

            const stb = {
                dvr: true,
                rdvrVersion: 2
            }

            controller.getMyRecordingGroups(stb)
                .subscribe(
                    result => {
                        expect(result).toEqual(result);
                    },
                    error => {
                        expect(false).toEqual(true, 'should not have errored');
                    });

            expect(rdvrService.getMyRecordingGroups).toHaveBeenCalledWith(stb);
        });

        it('should cancel when stb changes', function () {
            const scheduler = new rx.TestScheduler();
            stbService.currentStbSource = scheduler.createHotObservable(
                onNext(0, {
                    macAddressNormalized: '1234',
                    dvr: true,
                    rdvrVersion: 2
                }),
                onNext(200, {
                    macAddressNormalized: '5678',
                    dvr: true,
                    rdvrVersion: 2
                })
            )

            const result = {
                data: [],
                isComplete: true
            }


            rdvrService.getMyRecordingGroups = jasmine.createSpy().and.returnValue(
                scheduler.createHotObservable(
                    onNext(300, result)
                )
            );

            const results = [];

            controller.getMyRecordingGroups()
                .subscribe(
                    result => {
                        results.push(result);
                    },
                    error => {
                        expect(false).toEqual(true, 'should not have errored');
                    });

            expect(results.length).toEqual(0);
            expect(rdvrService.getMyRecordingGroups.calls.count()).toEqual(1);
            scheduler.advanceTo(300);
            expect(results.length).toEqual(0, 'should have cancelled and not emitted the value');
        });
    });

    describe('updateLoadingIndicator', function () {
        it('should handle error', function () {
            controller.updateLoadingIndicator({error: 'fail'});
            expect(controller.loading).not.toBeDefined();
        });

        it('should handle error (with this.loading)', function () {
            controller.loading = $q.defer();
            let rejected = false;
            controller.loading.promise.then(
                resolve => {},
                reject => {
                    rejected = true;
                });

            controller.updateLoadingIndicator({error: 'fail'});

            $rootScope.$apply();

            expect(controller.loading).not.toBeDefined();
            expect(rejected).toEqual(true);
        });

        it('should handle start of fetch', function () {
            let firedEvent = false;
            $rootScope.$on('message:loading', (event, data) => firedEvent = data)

            controller.updateLoadingIndicator({
                error: undefined,
                data: [],
                isComplete: false
            });

            expect(controller.loading).toBeDefined();
            expect(firedEvent).not.toEqual(false);
            expect(firedEvent).toBe(controller.loading.promise);
        });

        it('should handle fully loaded', function () {
            controller.loading = $q.defer();
            let resolved = false;
            controller.loading.promise.then(
                resolve => {
                    resolved = true;
                },
                reject => {});

            controller.updateLoadingIndicator({
                data: [],
                isComplete: true
            });

            $rootScope.$apply();

            expect(controller.loading).not.toBeDefined();
            expect(resolved).toEqual(true);
        });
    });

    xdescribe('updateSubheader', function () {

    });

    xdescribe('handleError', function () {

    });

    xdescribe('bulkDelete', function () {

    });

    xdescribe('singleDelete', function () {

    });

    xdescribe('doDelete', function () {

    });
});
