var subject, analyticsEnums, mockAnalyticsService, mockNavigationTimer, mockPlayerService,
    $log, $q, purchasePinService;

describe('ovpApp.analytics.events.navigation', function () {
    'use strict';

    beforeEach(function () {
        module('ovpApp.analytics.events.navigation');
        module('ovpApp.analytics.analyticsEnums');
        module('ovpApp.analytics');
    });

    beforeEach(module(function($provide) {
        // console.log('Doing the beforeEach - $provide', $provide);
        // Create mock navigationTimer
        mockNavigationTimer = {
            startTimer: function () {},
            cancelTimer: function () {},
            reset: function () {}
        };
        $provide.value('navigationTimer', mockNavigationTimer);

        mockPlayerService = {
            isValidPlayRoute: function() {return true;}
        };
        $provide.value('playerService', mockPlayerService);

        purchasePinService = function (){};
        $provide.value('purchasePinService', purchasePinService);
    }));

    beforeEach(inject(function(
        _analyticsEnums_, _$log_, _$injector_, _analyticsService_,
        _navigation_,
        _$q_){
        $log = _$log_;
        $q = _$q_;

        purchasePinService.isPurchasePINDisabledForClient = function() {
            let result = $q.defer();
            result.resolve(false);
            return result.promise;
        };

        analyticsEnums = _analyticsEnums_;
        mockAnalyticsService = _analyticsService_;
        subject = _navigation_;
     }));

    // Log debug messages in Karma after each test.
    afterEach(function(){
        if ($log) {
            dumpArray('Debug', $log.debug.logs);
            dumpArray('Info', $log.info.logs);
            dumpArray('Warn', $log.warn.logs);
            dumpArray('Error', $log.error.logs);
            dumpArray('Log', $log.log.logs);
        }
    });

    function dumpArray(prefix, msgArray) {
        if (msgArray && msgArray.length && msgArray.length > 0){
            for (var i=0; i<msgArray.length; ++i) {
                console.log(prefix + ': ' + msgArray[i]);
            }
        }
    }

    function buildTransition(transitionData) {
        let result = {
            transition: {}
        };

        if (transitionData.toState) {
            result.transition.to = function () {
                return transitionData.toState;
            }
        }

        result.transition.params = function (args) {
            if (args === 'to') {
                return transitionData.toParams || {};
            }
            return {};
        }

        return result;
    }

    it('should send an event on page completion, even without partial render', function() {

        // Verify starting with no api calls. Will be true at the start of all tests.
        expect(mockAnalyticsService.events.length).toEqual(0);

        // Route to a page, including the page completion event, but no partial render event.
        subject.startNavigation({}, buildTransition({
            toState: {
                name: 'ovp.store',
            },
            toParams: {
                category: '/nationalnavigation/V1/symphoni/vodstore/grid?path=750917217::' +
                    '750917217&division=SMN&lineup=204&application=VOD_STORE&profile=ovp_v6&' +
                    'cacheID=98&catName=All%20New'
            }
        }));

        // Navigation init sends an api call.
        expect(mockAnalyticsService.events.length).toEqual(1);
        expect(mockAnalyticsService.events[0].appSection).toEqual('curatedCatalog');
        expect(mockAnalyticsService.events[0].pageName).toEqual('curatedVideoStore');
        expect(mockAnalyticsService.events[0].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.NO_RENDER);

        subject.partiallyRendered({}, {});

        // So does a partially completed pageView.
        expect(mockAnalyticsService.events.length).toEqual(2);
        expect(mockAnalyticsService.events[1].appSection).toEqual('curatedCatalog');
        expect(mockAnalyticsService.events[1].pageName).toEqual('curatedVideoStore');
        expect(mockAnalyticsService.events[1].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.PARTIAL);

        subject.pageChangeComplete({}, {});

        // Verify we have the final expected pageChange api call.
        expect(mockAnalyticsService.events.length).toEqual(3);
        expect(mockAnalyticsService.events[2].appSection).toEqual('curatedCatalog');
        expect(mockAnalyticsService.events[2].pageName).toEqual('curatedVideoStore');
        expect(mockAnalyticsService.events[2].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.COMPLETE);

        // Verify timestamps.
        expect(mockAnalyticsService.events[2].renderInitTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[2].partialRenderedTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[2].fullyRenderedMs).not.toBeNull();
        expect(mockAnalyticsService.events[2].fullyRenderedTimestamp).not.toBeNull();

        // Verify the filter was retrieved.
        expect(mockAnalyticsService.events[0].appliedFilters).not.toBeNull();
        expect(mockAnalyticsService.events[0].appliedFilters.length).toEqual(1);
        expect(mockAnalyticsService.events[0].appliedFilters[0]).toEqual('All New');
    });

    it('should throttle multiple navigation events to the same page', function() {

        // Verify starting with no events. Will be true at the start of all tests.
        expect(mockAnalyticsService.events.length).toEqual(0);

        // Route to a page, including the page completion event, but no partial render api call.
        subject.startNavigation({}, buildTransition({
            toState: {
                name: 'ovp.store',
            }
        }));

        // Navigation init sends an api call.
        expect(mockAnalyticsService.events.length).toEqual(1);

        // Route again to the same page. And we haven't completed the page yet.
        subject.startNavigation({}, buildTransition({
            toState: {
                analytics: {
                    appSection: 'curatedCatalog',
                    pageName: 'curatedVideoStore'
                }
            }
        }));

        // Shouldn't send another api call.
        expect(mockAnalyticsService.events.length).toEqual(1);

        subject.partiallyRendered({}, {});

        // Partial render results in another api call.
        expect(mockAnalyticsService.events.length).toEqual(2);

        subject.pageChangeComplete({}, {});

        // Verify we have the expected pageChange api calls.
        expect(mockAnalyticsService.events.length).toEqual(3);
        expect(mockAnalyticsService.events[2].appSection).toEqual('curatedCatalog');
        expect(mockAnalyticsService.events[2].pageName).toEqual('curatedVideoStore');
        expect(mockAnalyticsService.events[2].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.COMPLETE);

        expect(mockAnalyticsService.events[2].renderInitTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[2].partialRenderedTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[2].fullyRenderedMs).not.toBeNull();
        expect(mockAnalyticsService.events[2].fullyRenderedTimestamp).not.toBeNull();
    });

    it('should send a timeout event if the page times out', function() {

        // Route to a page, including the page completion event, but no partial render event.
        subject.startNavigation({}, buildTransition({
            toState: {
                analytics: {
                    appSection: 'curatedCatalog',
                    pageName: 'curatedVideoStore'
                }
            }
        }));

        // Navigation init sends an api call.
        expect(mockAnalyticsService.events.length).toEqual(1);

        subject.partiallyRendered({}, {});

        // Partial render results in another api call.
        expect(mockAnalyticsService.events.length).toEqual(2);

        // Time out the page. Pretend it never rendered in time.
        subject.timerTimedout({}, {});

        // Verify we have the expected pageChange api calls.
        expect(mockAnalyticsService.events.length).toEqual(3);
        expect(mockAnalyticsService.events[2].appSection).toEqual('curatedCatalog');
        expect(mockAnalyticsService.events[2].pageName).toEqual('curatedVideoStore');
        expect(mockAnalyticsService.events[2].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.TIMEOUT);

        expect(mockAnalyticsService.events[2].renderInitTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[2].partialRenderedTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[2].fullyRenderedMs).toBeNull();
        expect(mockAnalyticsService.events[2].fullyRenderedTimestamp).toBeNull();

        // Now complete the page anyway, even though it timed out.
        // Make sure we don't send another api call.
        subject.pageChangeComplete({}, {});
        expect(mockAnalyticsService.events.length).toEqual(3);
    });

    it('should send events when navigation is interrupted', function() {

        // Route to a page, including the page completion event, but no partial render event.
        subject.startNavigation({}, buildTransition({
            toState: {
                analytics: {
                    appSection: 'videoStore',
                    pageName: 'videoStore'
                }
            }
        }));

        // Expect the first api call.
        expect(mockAnalyticsService.events.length).toEqual(1);
        expect(mockAnalyticsService.events[0].appSection).toEqual('videoStore');
        expect(mockAnalyticsService.events[0].pageName).toEqual('videoStore');

        subject.partiallyRendered({}, {});

        // Expect the partial render api call.
        expect(mockAnalyticsService.events.length).toEqual(2);

        // Route to a NEW page, before page completion.
        subject.startNavigation({}, buildTransition({
            toState: {
                analytics: {
                    appSection: 'liveTv',
                    pageName: 'liveTv'
                }
            }
        }));

        // Expect a partial navigation to the first page.
        expect(mockAnalyticsService.events.length).toEqual(3);

        // Verify the cancelled page.
        expect(mockAnalyticsService.events[1].appSection).toEqual('videoStore');
        expect(mockAnalyticsService.events[1].pageName).toEqual('videoStore');
        expect(mockAnalyticsService.events[1].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.PARTIAL);
        expect(mockAnalyticsService.events[1].renderInitTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[1].partialRenderedTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[1].fullyRenderedMs).toBeNull();
        expect(mockAnalyticsService.events[1].fullyRenderedTimestamp).toBeNull();

        // Verify the new page.
        expect(mockAnalyticsService.events[2].appSection).toEqual('liveTv');
        expect(mockAnalyticsService.events[2].pageName).toEqual('liveTv');

        // Complete the new page.
        subject.pageChangeComplete({}, {});

        // Verify we have the expected pageChange event.
        expect(mockAnalyticsService.events.length).toEqual(4);
        expect(mockAnalyticsService.events[3].appSection).toEqual('liveTv');
        expect(mockAnalyticsService.events[3].pageName).toEqual('liveTv');
        expect(mockAnalyticsService.events[3].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.COMPLETE);

        expect(mockAnalyticsService.events[3].renderInitTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[3].partialRenderedTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[3].fullyRenderedMs).not.toBeNull();
        expect(mockAnalyticsService.events[3].fullyRenderedTimestamp).not.toBeNull();
    });

    it('should send the flash warning pageView event', function() {

        // Verify starting with no events. Will be true at the start of all tests.
        expect(mockAnalyticsService.events.length).toEqual(0);

        // Indicate we are logged in. Flash warning pages outside of login are ignored.
        mockAnalyticsService.state.setIsLoggedIn(true);

        // Route to a page, including the page completion event, but no partial render event.
        subject.startNavigation({}, buildTransition({
            toState: {
                url: 'some.url',
                analytics: {
                    appSection: 'liveTv',
                    pageName: 'liveTv'
                }
            }
        }));

        // Expect the first api call
        expect(mockAnalyticsService.events.length).toEqual(1);
        expect(mockAnalyticsService.events[0].appSection).toEqual('liveTv');
        expect(mockAnalyticsService.events[0].pageName).toEqual('liveTv');

        subject.partiallyRendered({}, {});

        // Expect the partial render api call
        expect(mockAnalyticsService.events.length).toEqual(2);

        // Now send the flash warning
        subject.flashWarning({}, {
            pageName: 'adobeFlashNotAvailableWarning',
            toState: {
                url: 'some.url'
            }
        });

        // Verify we have the expected pageChange api calls.
        expect(mockAnalyticsService.events.length).toEqual(4);
        expect(mockAnalyticsService.events[2].appSection).toEqual('liveTv');
        expect(mockAnalyticsService.events[2].pageName).toEqual('adobeFlashNotAvailableWarning');
        expect(mockAnalyticsService.events[3].viewRenderedStatus).toEqual(analyticsEnums.ViewRenderedStatus.COMPLETE);

        expect(mockAnalyticsService.events[3].renderInitTimestamp).not.toBeNull();
        expect(mockAnalyticsService.events[3].fullyRenderedMs).not.toBeNull();
        expect(mockAnalyticsService.events[3].fullyRenderedTimestamp).not.toBeNull();
    });
});
