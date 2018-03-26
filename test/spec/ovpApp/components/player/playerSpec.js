/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.player', function () {
    'use strict';

    let PlayerController, $rootScope, $scope, mockOvpStorage, mockPlayer, mockTWCVideoJS,
        rx, onNext, storageKeys, mockHost, $httpBackend, mockOauthModule, mockInsecureService, config;

    mockOauthModule = {
        updateToken: () => {
                return {
                    then: (fn) => fn()
                };
            },
        getOAuthHeader: () => 'Authorize: header-variables',
        isAuthenticated: () => {
            return {
                then: (cb) => {
                    cb(true);
                }
            };
        }
    };

    mockInsecureService = {
        get: (url) => {
            return {then: (fn) => fn(url)};
        }
    };

    beforeEach(module('rx'));
    beforeEach(module('ovpApp.player'));
    beforeEach(module(function ($provide) {
        $provide.constant('OauthService', mockOauthModule);
        $provide.constant('InsecureService', mockInsecureService);
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));
    beforeEach(module('ovpApp.interceptors.oauth'));

    beforeEach(inject(function ($componentController, _$rootScope_, _rx_, _storageKeys_, _$httpBackend_, _config_) {
        config = _config_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        rx = _rx_;
        storageKeys = _storageKeys_;
        onNext = rx.ReactiveTest.onNext;
        mockHost = 'https://watch.localtesthost.cxm';
        $httpBackend = _$httpBackend_;
        mockOvpStorage = {
            getItem: jasmine.createSpy(),
            setItem: jasmine.createSpy()
        };

        mockPlayer = {
            setVolume: jasmine.createSpy(),
            setSAPEnabled: jasmine.createSpy(),
            setCCEnabled: jasmine.createSpy(),
            setCCSettings: jasmine.createSpy(),
            on: jasmine.createSpy(),
            off: jasmine.createSpy(),
            unload: jasmine.createSpy()
        };

        PlayerController = $componentController('player',
            {
                $scope: $scope,
                $rootScope: $rootScope,
                ovpStorage: mockOvpStorage,
                $element: {find: () => []},
                OndemandMode: () => {},
                LiveMode: () => {},
                TWCVideoJS: mockTWCVideoJS,
                $state: {go: () => {}},
                $location: { host: () => mockHost, search: () => mockHost }
            });

        PlayerController.$onInit();

        PlayerController.player = mockPlayer;
    }));

    describe('applyVolume', function () {

        it('should set from storage if able', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue(0.8);
            PlayerController.applyVolume();
            expect(mockPlayer.setVolume).toHaveBeenCalledWith(0.8);
        });

        it('should set to 0.4 if null', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue(null);
            PlayerController.applyVolume();
            expect(mockPlayer.setVolume).toHaveBeenCalledWith(0.4);
        });

        it('should set to 0.4 if undefined', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue(undefined);
            PlayerController.applyVolume();
            expect(mockPlayer.setVolume).toHaveBeenCalledWith(0.4);
        });

        it('should register for volume changes', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue(0.8);
            PlayerController.applyVolume();
            expect(mockPlayer.on).toHaveBeenCalledWith('volume-level-changed', jasmine.any(Function));
        });

        it('should debounce and save to storage', function () {
            let scheduler = new rx.TestScheduler();
            let handler;
            let mockSource = scheduler.createHotObservable(
                onNext(100, '0.1'),
                onNext(200, '0.2'),
                onNext(1199, '0.3'),
                onNext(1299, '0.4')
            ).subscribe(val => handler(val));

            mockPlayer.on = jasmine.createSpy().and.callFake((event, h) => handler = h);

            PlayerController.applyVolume(scheduler);
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            scheduler.advanceTo(200);
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            scheduler.advanceTo(1199);
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            scheduler.advanceTo(1200);
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            scheduler.advanceTo(1299);
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            scheduler.advanceTo(2298);
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            scheduler.advanceTo(2299);
            expect(mockOvpStorage.setItem).toHaveBeenCalledWith(storageKeys.volumeLevel, '0.4');
        });
    });

    describe('applySap', function () {
        it('should set from storage if able', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue(true);
            PlayerController.applySap();
            expect(mockPlayer.setSAPEnabled).toHaveBeenCalledWith(true);
        });

        it('should register for changes', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue(true);
            PlayerController.applySap();
            expect(mockPlayer.on).toHaveBeenCalledWith('sap-toggled', jasmine.any(Function));
        });

        it('should save to storage', function () {
            let handler;

            mockPlayer.on = jasmine.createSpy().and.callFake((event, h) => handler = h);

            PlayerController.applySap();
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            handler(false);
            expect(mockOvpStorage.setItem).toHaveBeenCalledWith(storageKeys.sapEnabled, false);
        });
    });

    describe('applyCCEnabled', function () {
        it('should set from storage if able', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue(true);
            PlayerController.applyCCEnabled();
            expect(mockPlayer.setCCEnabled).toHaveBeenCalledWith(true);
        });

        it('should register for changes', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue('true');
            PlayerController.applyCCEnabled();
            expect(mockPlayer.on).toHaveBeenCalledWith('cc-enabled-toggled', jasmine.any(Function));
        });

        it('should save to storage', function () {
            let handler;
            mockPlayer.on = jasmine.createSpy().and.callFake((event, h) => handler = h);

            PlayerController.applyCCEnabled();
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            handler(false);
            expect(mockOvpStorage.setItem).toHaveBeenCalledWith(storageKeys.ccEnabled, false);
        });
    });

    describe('applyCCSettings', function () {
        it('should set from storage if able', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue({hello:'world'});
            PlayerController.applyCCSettings();
            expect(mockPlayer.setCCSettings).toHaveBeenCalledWith({hello:'world'});
        });

        it('should register for changes', function () {
            mockOvpStorage.getItem = jasmine.createSpy().and.returnValue('true');
            PlayerController.applyCCSettings();
            expect(mockPlayer.on).toHaveBeenCalledWith('cc-settings-changed', jasmine.any(Function));
        });

        it('should save to storage', function () {
            let handler;
            mockPlayer.on = jasmine.createSpy().and.callFake((event, h) => handler = h);

            PlayerController.applyCCSettings();
            expect(mockOvpStorage.setItem).not.toHaveBeenCalled();
            handler({goodbye:'cruel world'});
            expect(mockOvpStorage.setItem).toHaveBeenCalledWith(storageKeys.ccSettings,
                {goodbye:'cruel world'});
        });
    });

    describe('sendTrackingRequest', function () {
        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should send xhr request if tracking url matches the configured domain', function () {
            mockHost = 'https://watch.localtesthost.cxm';
            config.authNeededTrackingDomain = 'test.copy.cxm';
            $httpBackend.expectGET('https://test.copy.cxm/?test=def').respond(200, '');
            PlayerController.sendTrackingRequest('https://test.copy.cxm/?test=def');
            $httpBackend.flush();
        });

        it('should use the InsecureService for all other urls', function () {
            var inSecSpy = spyOn(mockInsecureService, 'get').and.returnValue('NOTHING!');
            mockHost = 'https://something.localtesthost.cxm';
            config.authNeededTrackingDomain = 'test.copy.cxm';
            PlayerController.sendTrackingRequest('http://doesntmatter');
            expect(inSecSpy).toHaveBeenCalled();
           expect(inSecSpy).toHaveBeenCalledWith('http://doesntmatter');
        });
    });

    describe('registerPlayerEvents', function () {
        function doEventTest(expectedEventName, expectedCallbackName) {
            let scheduler = new rx.TestScheduler();
            const data = {hello: 'world'};
            let mockSource = scheduler.createHotObservable(
                onNext(100, data)
            );


            PlayerController[expectedCallbackName] = jasmine.createSpy();
            PlayerController.observableFromPlayerEvent = jasmine.createSpy().and.callFake(
                eventName => {
                    if (eventName === expectedEventName) {
                        return mockSource;
                    } else {
                        return rx.Observable.never();
                    }
                });

            PlayerController.registerPlayerEvents();

            scheduler.advanceTo(99);
            expect(PlayerController[expectedCallbackName]).not.toHaveBeenCalledWith(data);
            scheduler.advanceTo(100);
            expect(PlayerController[expectedCallbackName]).toHaveBeenCalledWith(data);

        }

        it('should store the most recent bitrate', function () {
            PlayerController.onBitRateChanged({
                event: {
                    profile: 100
                }
            });
            expect(PlayerController.lastBitrate).toBe(100);
        })

        it('should subscribe to tracking request', function () {
            doEventTest('ad-twc-tracking-request', 'onTrackingRequest');
        });

        it('should subscribe to unblock request', function () {
            doEventTest('unblock-stream-request', 'onUnblockStreamRequest');
        });

        it('should subscribe to metadata event', function () {
            doEventTest('ad-metadata-event-received', 'onAdMetadataEventReceived');
        });

        xit('should subscribe to player position changed', function () {
            doEventTest('player-position-changed', 'onPlayerPositionChanged');
        });
    });

    describe('Player stream', function () {
        it('should set the initial bitrate when a new stream-uri-obtained event happens', function () {
            var streamInfo = {
                stream: {
                    stream_url: 'http://playdomain?varone=one&vartwo=2'
                }
            };
            PlayerController.onBitRateChanged({
                event: {
                    profile: 100
                }
            });
            let setBitrateSpy = mockPlayer.setBitrateControlParameters = jasmine.createSpy().and.returnValue(null);
            $rootScope.$broadcast('stream-uri-obtained', 'type', streamInfo);
            expect(setBitrateSpy).toHaveBeenCalled();
            expect(streamInfo.parts.varone).toBe('one');
        });
    });
});
