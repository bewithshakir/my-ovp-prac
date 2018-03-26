/* jshint jasmine: true */

describe('ovpApp.services.bookmark', function () {
    'use strict';
    let BookmarkService, rx, scheduler, onNext;

    beforeEach(module('ovpApp.services.bookmark'));

    beforeEach(module('ovpApp.services.splunk', function ($provide) {
        const mockSplunkService = {
            sendCustomMessage: jasmine.createSpy()
        }

        $provide.value('SplunkService', mockSplunkService);
    }));

    beforeEach(inject(function (_BookmarkService_, _rx_) {
        BookmarkService = _BookmarkService_;
        rx = _rx_;

        scheduler = new rx.TestScheduler();
        onNext = rx.ReactiveTest.onNext;
    }));

    it('should be defined', function () {
        expect(BookmarkService).toBeDefined();
    });

    describe('throttlePostingBookmarks', function () {
        describe('immediate', function () {
            it('leisurly pace', function () {
                const source = scheduler.createHotObservable(
                    onNext(100, true),
                    onNext(5100, true),
                    onNext(10100, true),
                );

                const throttled = BookmarkService._private
                    .throttlePostingBookmarks({stream: source, shortThrottle: 5000, longThrottle: 60000, scheduler}).postBookmark$;
                
                expect(throttled).toBeDefined();
                expect(throttled.subscribe).toBeDefined();

                const results = [];
                throttled.subscribe(result => results.push(result));

                expect(results.length).toEqual(0);
                scheduler.advanceTo(100);
                expect(results.length).toEqual(1, 'should have emitted first one immediately');
                expect(results[0]).toEqual(true);
                scheduler.advanceTo(5100);
                expect(results.length).toEqual(2, 'should have emitted second one immediately (enough time had elapsed)');
                expect(results[1]).toEqual(true);
                scheduler.advanceTo(10100);
                expect(results.length).toEqual(3, 'should have emitted third one immediately (enough time had elapsed)');
                expect(results[2]).toEqual(true);
            });

            it('fast pace', function () {
                const source = scheduler.createHotObservable(
                    onNext(100, true),
                    onNext(200, true),
                    onNext(300, true),
                    onNext(400, true),
                    onNext(5100, true)
                );

                const throttled = BookmarkService._private
                    .throttlePostingBookmarks({stream: source, shortThrottle: 5000, longThrottle: 60000, scheduler}).postBookmark$;
                
                expect(throttled).toBeDefined();
                expect(throttled.subscribe).toBeDefined();

                const results = [];
                throttled.subscribe(result => results.push(result));

                expect(results.length).toEqual(0);
                scheduler.advanceTo(100);
                expect(results.length).toEqual(1, 'should have emitted first one immediately');
                expect(results[0]).toEqual(true);
                scheduler.advanceTo(200);
                expect(results.length).toEqual(1, 'should not have emitted second one immediately (not enough time elapsed)');
                scheduler.advanceTo(5099);
                expect(results.length).toEqual(1, 'still should not have emitted a second one');
                scheduler.advanceTo(5100);
                expect(results.length).toEqual(2, 'should have eventually emitted a second one');
            });
        });

        describe('not immediate', function () {
            it('standard pace', function () {
                const source = scheduler.createHotObservable(
                    onNext(250, false),
                    onNext(500, false),
                    onNext(750, false),
                    onNext(1000, false),
                    onNext(60000, false),
                    onNext(60250, false),
                    onNext(60500, false),
                );

                const throttled = BookmarkService._private
                    .throttlePostingBookmarks({stream: source, shortThrottle: 5000, longThrottle: 60000, scheduler}).postBookmark$;
                
                expect(throttled).toBeDefined();
                expect(throttled.subscribe).toBeDefined();

                const results = [];
                throttled.subscribe(result => results.push(result));

                expect(results.length).toEqual(0);
                scheduler.advanceTo(250);
                expect(results.length).toEqual(1, 'should have emitted first immediately');
                scheduler.advanceTo(60249);
                expect(results.length).toEqual(1, 'should not have emitted second yet');
                scheduler.advanceTo(60250);
                expect(results.length).toEqual(2);
                scheduler.advanceTo(60500);
                expect(results.length).toEqual(2);
            });
        });

        describe('combination', function () {
            it('should not interfere with eachother', function () {
                const source = scheduler.createHotObservable(
                    onNext(250, false),
                    onNext(500, false),
                    onNext(750, false),
                    onNext(800, true),
                    onNext(1000, false),
                    onNext(2000, true),
                    onNext(5800, true),
                    onNext(60000, false),
                    onNext(60250, false),
                    onNext(60500, false),
                );

                const throttled = BookmarkService._private
                    .throttlePostingBookmarks({stream: source, shortThrottle: 5000, longThrottle: 60000, scheduler}).postBookmark$;
                
                expect(throttled).toBeDefined();
                expect(throttled.subscribe).toBeDefined();

                const results = [];
                throttled.subscribe(result => results.push(result));

                expect(results.filter(a => !a).length).toEqual(0);
                expect(results.filter(a => a).length).toEqual(0);
                scheduler.advanceTo(250);
                expect(results.filter(a => !a).length).toEqual(1, 'should have emitted first immediately');
                expect(results.filter(a => a).length).toEqual(0);
                scheduler.advanceTo(800)
                expect(results.filter(a => !a).length).toEqual(1);
                expect(results.filter(a => a).length).toEqual(1);
                scheduler.advanceTo(5799)
                expect(results.filter(a => !a).length).toEqual(1);
                expect(results.filter(a => a).length).toEqual(1, 'truthy should be throttled at this point');
                scheduler.advanceTo(5800)
                expect(results.filter(a => !a).length).toEqual(1);
                expect(results.filter(a => a).length).toEqual(2, 'truthy should not be throttled at this point');
                scheduler.advanceTo(60249);
                expect(results.filter(a => !a).length).toEqual(1, 'falsy should be throttled at this point');
                expect(results.filter(a => a).length).toEqual(2);
                scheduler.advanceTo(60250);
                expect(results.filter(a => !a).length).toEqual(2, 'falsy should not be throttled at this point');
                expect(results.filter(a => a).length).toEqual(2);
            });
        });

        describe('excessive', function () {
            it('should ignore throttling of immediate bookmarks below the threshold', function () {
                    const source = scheduler.createHotObservable(
                    onNext(100, 'one'),
                    onNext(200, 'two'),
                    onNext(300, 'three'),
                    onNext(5100, 'four')
                );

                const excessive = BookmarkService._private
                    .throttlePostingBookmarks({
                        stream: source,
                        shortThrottle: 5000,
                        longThrottle: 60000,
                        excessiveThreshold: 3,
                        scheduler
                    }).excessive$;
                
                expect(excessive).toBeDefined();
                expect(excessive.subscribe).toBeDefined();

                const results = [];
                excessive.subscribe(result => results.push(result));

                expect(results.length).toEqual(0);
                scheduler.advanceTo(5099)
                expect(results.length).toEqual(0);
                scheduler.advanceTo(5100)
                expect(results.length).toEqual(0);
            });

            it('should detect throttling of immediate bookmarks above the threshold', function () {
                const source = scheduler.createHotObservable(
                    onNext(100, 'one'),
                    onNext(200, 'two'),
                    onNext(300, 'three'),
                    onNext(400, 'four'),
                    onNext(5100, 'five')
                );

                const excessive = BookmarkService._private
                    .throttlePostingBookmarks({
                        stream: source,
                        shortThrottle: 5000,
                        longThrottle: 60000,
                        excessiveThreshold: 3,
                        scheduler
                    }).excessive$;
                
                expect(excessive).toBeDefined();
                expect(excessive.subscribe).toBeDefined();

                const results = [];
                excessive.subscribe(result => results.push(result));

                expect(results.length).toEqual(0);
                scheduler.advanceTo(5099)
                expect(results.length).toEqual(0);
                scheduler.advanceTo(5100)
                expect(results.length).toEqual(1);
                expect(results[0].length).toEqual(3);
                expect(results[0][0].value).toEqual('two');
                expect(results[0][1].value).toEqual('three');
                expect(results[0][2].value).toEqual('four');
            });
        });
    });
});
