describe('GuideController', function() {
    'use strict';

    var scope, rootScope, ctrl, $q, chnlService, rdvrService, favoritesService,
        rx, onNext, stbService, $rootScope, scheduler,
        channels = [
            {channelNumber: 1, mystroServiceId: 1},
            {channelNumber: 2, mystroServiceId: 2},
            {channelNumber: 3, mystroServiceId: 3},
            {channelNumber: 4, mystroServiceId: 4},
            {channelNumber: 5, mystroServiceId: 5}
        ],
        recordings = [
            { mystroServiceId: 1},
            { mystroServiceId: 3},
            { mystroServiceId: 5}
        ];

    beforeEach(module('ovpApp.guide'));
    beforeEach(module(function ($provide) {
        $provide.value('profileService', mockProfileService);
        $provide.value('errorCodesService', mockErrorCodesService);
    }));
    beforeEach(inject(function($controller, _$rootScope_, _$q_, $timeout, _favoritesService_, _rx_) {
        rootScope = $rootScope;
        favoritesService = _favoritesService_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $q = _$q_;
        rx = _rx_;
        onNext = onNext = rx.ReactiveTest.onNext;

        chnlService = {
            getChannelByChannelNumber: (a) => {
                let defer = $q.defer();
                $timeout(() => {
                    defer.resolve({entitled: (a % 2 !== 0)});
                }, 1000);
                return defer.promise;
            }
        };

        scheduler = new rx.TestScheduler();

        const partial = [{fake: 'recording1'}];
        const full = [{fake: 'recording1'}, {fake: 'recording2'}];

        const recordingSource = scheduler.createHotObservable(
            onNext(100, {
                data: [],
                isComplete: false
            }),
            onNext(200, {
                data: partial,
                isComplete: false
            }),
            onNext(300, {
                data: full,
                isComplete: true
            })
          );

        rdvrService = {
            getScheduledRecordings: jasmine.createSpy().and.returnValue(recordingSource)
        };

        stbService = {
            getCurrentStb: jasmine.createSpy().and.returnValue($q.resolve({fake: 'stb'})),
            currentStbSource: rx.Observable.never()
        }

        spyOn(favoritesService, 'toggleFavorite');

        ctrl = $controller('GuideController', {
            $scope: scope,
            ChannelService: chnlService,
            rdvrService: rdvrService,
            favoritesService: _favoritesService_,
            stbService: stbService,
            channelList: channels,
            favorites: [1, 3, 5],
            loadingDefer: $q.defer()
        });
        $timeout.flush();
    }));

    it('subscribed channels', function() {
        ctrl.channels.forEach(chnl => {
            expect(chnl.subscribed).toEqual(chnl.channelNumber % 2 !== 0);
        });
    });

    it('recordings', function() {
        expect(ctrl.recordings).toEqual([], 'should have initialized to an empty array');
        scheduler.advanceTo(100);
        expect(ctrl.recordings).toEqual([], 'should not have changed when first fetch starts');
        scheduler.advanceTo(200);
        expect(ctrl.recordings).toEqual([{fake: 'recording1'}], 'should have updated on partial success');
        scheduler.advanceTo(300);
        expect(ctrl.recordings).toEqual([{fake: 'recording1'}, {fake: 'recording2'}],
            'should have updated on full success');
    });

    it('getShowData should update recent channels list', function() {
        ctrl.getShowData({}, 3);
        ctrl.getShowData({}, 4);
        expect(ctrl.recentChannels).toEqual([3, 4])
    });

    it('toggleFavorite should toggle favorite', function() {
        let chnl = {channelNumber: 3, favorite: true};
        ctrl.toggleFavorite(chnl);
        expect(favoritesService.toggleFavorite).toHaveBeenCalledWith(chnl);
        expect(chnl.favorite).toEqual(false);
    });
});
