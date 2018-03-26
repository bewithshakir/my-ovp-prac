describe('ovpApp.player.streamService', function () {

    let playerStreamService, $q,  $rootScope, $httpBackend, $location, blockingScreenService, locationService,
        mockWhatsOn = {}, mockParentalControls = {}, mockDrmSession = {}, mockLocationService = {};

    beforeEach(module('ovpApp.player.streamService'));

    beforeEach(module(function($provide) {
        $provide.value('whatsOn', mockWhatsOn);
        $provide.value('parentalControlsService', mockParentalControls);
        $provide.value('drmSessionService', mockDrmSession);
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function (_playerStreamService_, _$q_, _$rootScope_, _$httpBackend_, _$location_,
            _blockingScreenService_, _locationService_) {
        playerStreamService = _playerStreamService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        locationService = _locationService_;
        blockingScreenService = _blockingScreenService_;

        $location.search = () => 'https://watch.localtesthost.cxm';
        mockDrmSession.getDRMSession = jasmine.createSpy().and.returnValue($q.resolve({}));
    }));

    describe('playChannel', function () {
        let mockPlayer, mockChannel, mockAsset;
        beforeEach(function () {
            mockChannel = {
                streamUri: 'fakesStreamUri',
                available: true
            };

            mockAsset = {
                isBlocked: $q.resolve(false)
            };

            mockPlayer = {
                trigger: jasmine.createSpy(),
                setMediaKeys: jasmine.createSpy(),
                setSrc: jasmine.createSpy(),
                setEptTime: jasmine.createSpy(),
                setCurrentTime: jasmine.createSpy(),
                play: jasmine.createSpy()
            };

            mockWhatsOn.now = jasmine.createSpy().and.returnValue($q.resolve(mockAsset));

            mockParentalControls.isBlockedByRating = jasmine.createSpy().and.returnValue($q.resolve(false));
            mockParentalControls.isParentalControlsDisabledForClient = jasmine.createSpy().and.returnValue($q.resolve(false));
            mockParentalControls.getLocalPin = jasmine.createSpy().and.returnValue('abcdefg');

            spyOn(locationService, 'getLocation').and.callFake(function () {
                var d = $q.defer();
                d.resolve({behindOwnModem: true});
                return d;
            });
        });

        it('should return a promise', function () {
            let result = playerStreamService.playChannel({player: mockPlayer, channel: mockChannel})
            expect(result).toBeDefined();
            expect(result.then).toBeDefined();
        });

        it('should trigger channel-changed event on player', function () {
            playerStreamService.playChannel({player: mockPlayer, channel: mockChannel});
            expect(mockPlayer.trigger).toHaveBeenCalledWith('channel-changed',
                {channel: mockChannel, triggeredBy: undefined});
        });

        it('should broadcast player:assetSelected', function () {
            $httpBackend.expectGET('fakesStreamUri?csid=stva_ovp_pc_live&dai-supported=true&drm-supported=true&encoding=hls&vast-supported=true')
                .respond(200, {drm: true})
            let result = playerStreamService.playChannel({player: mockPlayer, channel: mockChannel});
            let eventAsset;
            $rootScope.$on('player:assetSelected', (event, data) => eventAsset = data);
            result.then(() => {
                expect(eventAsset).toEqual(mockAsset);
            }, (error) => {
                expect(false).toEqual(true, 'promise unexpectedly rejected with ' + error);
            });

            $httpBackend.flush();
        });


        it('should prevent access to unavailable channels', function () {
            mockChannel.available = false;

            $rootScope.$on('player:assetSelected', () => {
                expect(false).toEqual(true, 'should not have published asset selected if not available');
            });
            let result = playerStreamService.playChannel({player: mockPlayer, channel: mockChannel});
            result.then(() => {
                expect(false).toEqual(true, 'should not have allowed promise to resolve');
            }, (error) => {
                expect(error).toEqual('outOfHome', 'should have rejected with an out of home error');
            });

            $rootScope.$apply();
        });

        it('should block based on asset', function () {
            blockingScreenService.show = jasmine.createSpy();

            mockAsset.isBlocked = $q.resolve(true);

            let result = playerStreamService.playChannel({player: mockPlayer, channel: mockChannel});
            let refrained = false;
            result.then(() => {
                expect(refrained).toEqual(true);
                expect(blockingScreenService.show).toHaveBeenCalled();
            }, (error) => {
                expect(false).toEqual(true, 'promise unexpectedly rejected with ' + error);
            });

            $rootScope.$apply();
            refrained = true;

            $httpBackend.expectGET('fakesStreamUri?csid=stva_ovp_pc_live&dai-supported=true&drm-supported=true&encoding=hls&vast-supported=true')
                .respond(200, {drm: true})
            $rootScope.$broadcast('player:parentalControlsUnblocked');

            $httpBackend.flush();

        });


        it('should assume unblocked by rating if no asset is available', function () {
            mockWhatsOn.now = jasmine.createSpy().and.returnValue($q.resolve(undefined));

            $httpBackend.expectGET('fakesStreamUri?csid=stva_ovp_pc_live&dai-supported=true&drm-supported=true&encoding=hls&vast-supported=true')
                .respond(200, {drm: true})

            let showedBlocking = false;
            $rootScope.$on('player:showBlockingScreen', () => showedBlocking = true);

            let result = playerStreamService.playChannel({player: mockPlayer, channel: mockChannel});
            result.then(() => {
                expect(showedBlocking).toEqual(false);
            }, (error) => {
                expect(false).toEqual(true, 'promise unexpectedly rejected with ' + error);
            });

            $httpBackend.flush();
        });

        it('should block based on channel', function () {
            blockingScreenService.show = jasmine.createSpy();
            mockParentalControls.isBlockedByRating = jasmine.createSpy().and.returnValue($q.resolve(true));

            let result = playerStreamService.playChannel({player: mockPlayer, channel: mockChannel});
            let refrained = false;

            result.then(() => {
                expect(refrained).toEqual(true);
                expect(blockingScreenService.show).toHaveBeenCalled();
            }, (error) => {
                expect(false).toEqual(true, 'promise unexpectedly rejected with ' + error);
            });

            $rootScope.$apply();
            refrained = true;

            $httpBackend.expectGET('fakesStreamUri?csid=stva_ovp_pc_live&dai-supported=true&drm-supported=true&encoding=hls&vast-supported=true')
                .respond(200, {drm: true})
            $rootScope.$broadcast('player:parentalControlsUnblocked');

            $httpBackend.flush();

        });
    });
});
