/* globals inject */
/* jshint jasmine: true */

xdescribe('ovpApp.player.liveMode', function () {
    'use strict';

    let LiveMode, config, rx, onNext, onCompleted, $q, $rootScope,
        mockLocationService, mockStorage, mockWhatsOn, mockPlayerStreamService;

    const IH = {behindOwnModem: true};
    const OOH = {behindOwnModem: false};

    beforeEach(module('rx'));
    beforeEach(module('ovpApp.player.liveMode'));
    beforeEach(module(function($provide) {
        mockLocationService = {
            values: [IH, IH, OOH],
            getLocation: function () {
                return $q.resolve(this.values.shift());
            }
        }
        mockStorage = {
            setItem: jasmine.createSpy(),
            getItem: jasmine.createSpy()
        }
        mockWhatsOn = {
            now: jasmine.createSpy().and.callFake(() => $q.resolve('onNowAsset')),
            nowOrImminent: jasmine.createSpy().and.callFake(() => $q.resolve('onNowOrImminentAsset'))
        }
        mockPlayerStreamService = {
            getLinearStream: jasmine.createSpy().and.callFake(uri => {
                return {
                    drm: 'drm',
                    stream: {
                        streamUrlWithDAIScheme: 'url'
                    }
                }
            })
        }
        $provide.value('locationService', mockLocationService);
        $provide.value('ovpStorage', mockStorage);
        $provide.value('whatsOn', mockWhatsOn);
        $provide.value('playerStreamService', mockPlayerStreamService);
    }));

    beforeEach(inject(function (_LiveMode_, _config_, _rx_, _$q_, _$rootScope_) {
        LiveMode = _LiveMode_;
        config = _config_;
        rx = _rx_;
        onNext = rx.ReactiveTest.onNext;
        onCompleted = rx.ReactiveTest.onCompleted;
        $q = _$q_;
        $rootScope = _$rootScope_
    }));

    describe('augmentChannelData', function () {
        describe('availability', function () {
            it('behind own modem and available out of home', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: true
                    },
                    getNetworkLogo: () => {}
                }

                let mockChannel = {
                    availableOutOfHome: true,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.available).toEqual(true);
            });

            it('not behind own modem, but available out of home', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: false
                    },
                    getNetworkLogo: () => {}
                }

                let mockChannel = {
                    availableOutOfHome: true,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.available).toEqual(true);
            });

            it('behind own modem, not available out of home', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: true
                    },
                    getNetworkLogo: () => {}
                }

                let mockChannel = {
                    availableOutOfHome: false,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.available).toEqual(true);
            });

            it('not behind own modem, and not available out of home', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: false
                    },
                    getNetworkLogo: () => {}
                }

                let mockChannel = {
                    availableOutOfHome: false,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.available).toEqual(false);
            });

            it('should null the network logo for ean channel', function () {
                const eanChannelNumber = 9999;
                let mockThis = {
                    location: {
                        behindOwnModem: true
                    },
                    getNetworkLogo: () => 'a'
                }

                let mockChannel = {
                    availableOutOfHome: true,
                    channels: [eanChannelNumber]
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.networkLogoUri).toEqual(null);
            });
        });

        describe('isParentallyBlocked', function () {
            it('parental controls disabled for client, channel not blocked', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: true
                    },
                    isPCDisabledForClient: true
                }

                let mockChannel = {
                    parentallyBlocked: false,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.isParentallyBlocked).toEqual(false);
            });

            it('parental controls disabled for client, channel blocked', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: true
                    },
                    isPCDisabledForClient: true
                }

                let mockChannel = {
                    parentallyBlocked: true,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.isParentallyBlocked).toEqual(false);
            });

            it('parental controls enabled for client, channel not blocked', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: true
                    },
                    isPCDisabledForClient: false
                }

                let mockChannel = {
                    parentallyBlocked: false,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.isParentallyBlocked).toEqual(false);
            });

            it('parental controls enabled for client, channel blocked', function () {
                let mockThis = {
                    location: {
                        behindOwnModem: true
                    },
                    isPCDisabledForClient: false
                }

                let mockChannel = {
                    parentallyBlocked: true,
                    channels: []
                }

                let result = LiveMode.prototype.augmentChannelData.call(mockThis, mockChannel);
                expect(result.isParentallyBlocked).toEqual(true);
            });
        });
    });

    describe('registerEvents', function () {
        let mockThis;
        beforeEach(function () {
            mockThis = {
                observableFromPlayerEvent: jasmine.createSpy().and
                    .returnValue(rx.Observable.never()),
                onChannelChanged: jasmine.createSpy(),
                onSortChanged: jasmine.createSpy(),
                onFilterChanged: jasmine.createSpy(),
                onLinkToVodSelected: jasmine.createSpy(),
                onUnavailableChannelSelected: jasmine.createSpy(),
                onVideoPlayerError: jasmine.createSpy(),
                updateLineup: jasmine.createSpy(),
                onDestroy: rx.Observable.never(),
                onEAN: jasmine.createSpy()
            }
        });

        describe('channelChangeSource', function () {
            it('should register for channel-change events', function () {
                LiveMode.prototype.registerEvents.call(mockThis);
                expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('channel-changed');
            });

            it('should immediately process first channel change', function () {
                let scheduler = new rx.TestScheduler();
                let mockSource = scheduler.createHotObservable(
                    onNext(200, 'abcd')
                )
                mockThis.observableFromPlayerEvent = jasmine.createSpy().and.callFake(function (event) {
                    if (event === 'channel-changed') {
                        return mockSource;
                    } else {
                        return rx.Observable.never();
                    }
                });

                LiveMode.prototype.registerEvents.call(mockThis, scheduler);
                expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('channel-changed');

                scheduler.advanceTo(199);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(0);
                scheduler.advanceTo(200);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
            });

            it('should throttle subsequent channel changes under 1 second', function () {
                let scheduler = new rx.TestScheduler();
                let mockSource = scheduler.createHotObservable(
                    onNext(200, 'a'),
                    onNext(600, 'b'),
                    onNext(1000, 'c'),
                    onNext(1400, 'd'),
                    onNext(1800, 'c')
                )
                mockThis.observableFromPlayerEvent = jasmine.createSpy().and.callFake(function (event) {
                    if (event === 'channel-changed') {
                        return mockSource;
                    } else {
                        return rx.Observable.never();
                    }
                });

                LiveMode.prototype.registerEvents.call(mockThis, scheduler);
                expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('channel-changed');

                scheduler.advanceTo(200);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
                scheduler.advanceTo(600);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
                scheduler.advanceTo(1000);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
                scheduler.advanceTo(1400);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(2);
                scheduler.advanceTo(1800);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(2);
            });

            it('should not throttle changes over 1 second', function () {
            let scheduler = new rx.TestScheduler();
                let mockSource = scheduler.createHotObservable(
                    onNext(200, 'a'),
                    onNext(1200, 'b'),
                    onNext(2200, 'c'),
                    onNext(3200, 'd')
                )
                mockThis.observableFromPlayerEvent = jasmine.createSpy().and.callFake(function (event) {
                    if (event === 'channel-changed') {
                        return mockSource;
                    } else {
                        return rx.Observable.never();
                    }
                });

                LiveMode.prototype.registerEvents.call(mockThis, scheduler);
                expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('channel-changed');

                scheduler.advanceTo(200);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
                scheduler.advanceTo(1200);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(2);
                scheduler.advanceTo(2200);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(3);
                scheduler.advanceTo(3200);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(4);
            });

            it('should eventually process last channel in a sequence of sub-second changes', function () {
                let scheduler = new rx.TestScheduler();
                let mockSource = scheduler.createHotObservable(
                    onNext(200, 'a'),
                    onNext(600, 'b'),
                    onNext(1000, 'c'),
                    onNext(1400, 'd'),
                    onNext(1800, 'c')
                )
                mockThis.observableFromPlayerEvent = jasmine.createSpy().and.callFake(function (event) {
                    if (event === 'channel-changed') {
                        return mockSource;
                    } else {
                        return rx.Observable.never();
                    }
                });

                LiveMode.prototype.registerEvents.call(mockThis, scheduler);
                expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('channel-changed');

                scheduler.advanceTo(200);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
                scheduler.advanceTo(600);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
                scheduler.advanceTo(1000);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(1);
                scheduler.advanceTo(1400);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(2);
                scheduler.advanceTo(1800);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(2);
                scheduler.advanceTo(2799);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(2);
                scheduler.advanceTo(2800);
                expect(mockThis.onChannelChanged.calls.count()).toEqual(3);
            });
        });

        it('channel-sortby-changed', function () {
            LiveMode.prototype.registerEvents.call(mockThis);
            expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('channel-sortby-changed');
        });

        it('channel-filter-changed', function () {
            LiveMode.prototype.registerEvents.call(mockThis);
            expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('channel-filter-changed');
        });

        it('link-to-vod-selected', function () {
            LiveMode.prototype.registerEvents.call(mockThis);
            expect(mockThis.observableFromPlayerEvent).toHaveBeenCalledWith('link-to-vod-selected');
        });

        describe('channel display interval', function () {
            it('should refresh every 2 minutes', function () {
                let scheduler = new rx.TestScheduler();
                LiveMode.prototype.registerEvents.call(mockThis, scheduler);
                scheduler.advanceTo(111119);
                expect(mockThis.updateLineup).not.toHaveBeenCalled();
                scheduler.advanceTo(120000);
                expect(mockThis.updateLineup).toHaveBeenCalled();
                scheduler.advanceTo(240000);
                expect(mockThis.updateLineup.calls.count()).toEqual(2);
            });

            it('should unregister on destroy', function () {
                let scheduler = new rx.TestScheduler();
                mockThis.onDestroy = scheduler.createHotObservable(
                  onNext(5000, 1)
                );
                scheduler.advanceTo(120000);
                expect(mockThis.updateLineup).not.toHaveBeenCalled();

            });
        });
    });

    describe('observableFromPlayerEvent', function () {
        let mockThis;
        beforeEach(function () {
            mockThis = {
                player: {
                    on: jasmine.createSpy(),
                    off: jasmine.createSpy(),
                },
                onDestroy: rx.Observable.never()
            }
        });

        it('should register', function () {
            LiveMode.prototype.observableFromPlayerEvent.call(mockThis, 'a')
                .subscribe(() => {});
            expect(mockThis.player.on).toHaveBeenCalledWith('a', jasmine.any(Function))
        });

        it('should unregister on destroy', function () {
            let scheduler = new rx.TestScheduler();
            mockThis.onDestroy = scheduler.createHotObservable(
              onNext(2000, 1)
            );
            LiveMode.prototype.observableFromPlayerEvent.call(mockThis, 'a')
                .subscribe(() => {});
            expect(mockThis.player.on).toHaveBeenCalledWith('a', jasmine.any(Function));
            scheduler.advanceTo(2000);
            expect(mockThis.player.off).toHaveBeenCalledWith('a', jasmine.any(Function));
        });
    });

    describe('registerForLocationChanges', function () {
        it('should initialize', function () {
            mockLocationService.values = [IH];

            let promiseResolved = false;

            let mockThis = {
                onDestroy: rx.Observable.never(),
                playerInitPromise: $q.resolve()
            };

            let promise = LiveMode.prototype.registerForLocationChanges.call(mockThis);
            promise.then((val) => {
                promiseResolved = val;
            });

            expect(mockThis.location).toEqual(undefined);
            $rootScope.$broadcast('LocationService:locationChanged', IH);
            $rootScope.$apply();
            expect(mockThis.location).toEqual(IH, 'didn\'t initialize correctly');
            expect(promiseResolved).toEqual(IH, 'didn\'t resolve promise');
        });

        it('should ignore unchanged values', function () {
            let promiseResolved = false;

            let mockThis = {
                onDestroy: rx.Observable.never(),
                playerInitPromise: $q.resolve(),
                showMessageCallback: jasmine.createSpy()
            };

            let promise = LiveMode.prototype.registerForLocationChanges.call(mockThis);
            promise.then((val) => {
                promiseResolved = val;
            });

            $rootScope.$broadcast('LocationService:locationChanged', IH);
            $rootScope.$apply();
            expect(mockThis.showMessageCallback).not.toHaveBeenCalled();
            $rootScope.$broadcast('LocationService:locationChanged', IH);
            $rootScope.$apply();
            expect(mockThis.showMessageCallback).not.toHaveBeenCalled();
        });

        it('should update when transitioning IH to OOH', function () {
            mockLocationService.values = [IH, OOH];

            let promiseResolved = false;

            let mockThis = {
                onDestroy: rx.Observable.never(),
                playerInitPromise: $q.resolve(),
                showMessageCallback: jasmine.createSpy(),
                player: {
                    showCategoryFilters: jasmine.createSpy()
                },
                onFilterChanged: jasmine.createSpy(),
                channels: [],
                getDefaultFilter: jasmine.createSpy(),
                selectedChannel: {available: true}
            };

            let promise = LiveMode.prototype.registerForLocationChanges.call(mockThis);
            promise.then((val) => {
                promiseResolved = val;
            });

            $rootScope.$broadcast('LocationService:locationChanged', IH);
            $rootScope.$apply();
            expect(mockThis.showMessageCallback).not.toHaveBeenCalled();
            $rootScope.$broadcast('LocationService:locationChanged', OOH);
            $rootScope.$apply();
            expect(mockThis.showMessageCallback).toHaveBeenCalled();
        });

        it('should change channels if channel is not available out of home', function () {
            let promiseResolved = false;

            let mockThis = {
                onDestroy: rx.Observable.never(),
                playerInitPromise: $q.resolve(),
                showMessageCallback: jasmine.createSpy(),
                player: {
                    showCategoryFilters: jasmine.createSpy()
                },
                onFilterChanged: jasmine.createSpy(),
                channels: [],
                getDefaultFilter: jasmine.createSpy(),
                selectedChannel: {available: false},
                goToDefaultChannel: jasmine.createSpy()
            };

            let promise = LiveMode.prototype.registerForLocationChanges.call(mockThis);
            promise.then((val) => {
                promiseResolved = val;
            });

            $rootScope.$broadcast('LocationService:locationChanged', IH);
            $rootScope.$apply();
            $rootScope.$broadcast('LocationService:locationChanged', OOH);
            $rootScope.$apply();
            expect(mockThis.location).toEqual(OOH);
            expect(mockThis.onFilterChanged).toHaveBeenCalled();
            expect(mockThis.showMessageCallback).toHaveBeenCalled();
            expect(mockThis.goToDefaultChannel).toHaveBeenCalled();
        });

        it('should update when transitioning OOH to IH', function () {
            let promiseResolved = false;

            let mockThis = {
                onDestroy: rx.Observable.never(),
                playerInitPromise: $q.resolve(),
                showMessageCallback: jasmine.createSpy(),
                player: {
                    showCategoryFilters: jasmine.createSpy()
                },
                onFilterChanged: jasmine.createSpy(),
                channels: [],
                getDefaultFilter: jasmine.createSpy()
            };

            let promise = LiveMode.prototype.registerForLocationChanges.call(mockThis);
            promise.then((val) => {
                promiseResolved = val;
            });

            $rootScope.$broadcast('LocationService:locationChanged', OOH);
            $rootScope.$apply();
            $rootScope.$broadcast('LocationService:locationChanged', IH);
            $rootScope.$apply();

            expect(mockThis.location).toEqual(IH);
            expect(mockThis.onFilterChanged).toHaveBeenCalled();
            expect(mockThis.showMessageCallback).toHaveBeenCalled();
        });
    });

    describe('onChannelChanged', function () {
        it('should find the channel and tune to it if not already there', function () {
            let mockThis = {
                getChannelByChannelNumber: jasmine.createSpy().and.returnValue(1),
                playSelectedChannel: jasmine.createSpy()
            }

            let mockChannel = {
                localChannelNumber: 1
            }

            LiveMode.prototype.onChannelChanged.call(mockThis, {channel: mockChannel, userSelected: true});
            expect(mockThis.getChannelByChannelNumber).toHaveBeenCalledWith(1);
            expect(mockThis.playSelectedChannel).toHaveBeenCalled();
        });

        it('should not tune if already there', function () {
            let mockThis = {
                getChannelByChannelNumber: jasmine.createSpy().and.returnValue(1),
                playSelectedChannel: jasmine.createSpy(),
                selectedChannel: 1
            }

            let mockChannel = {
                localChannelNumber: 1
            }

            LiveMode.prototype.onChannelChanged.call(mockThis, {channel: mockChannel, userSelected: true});
            expect(mockThis.getChannelByChannelNumber).toHaveBeenCalledWith(1);
            expect(mockThis.playSelectedChannel).not.toHaveBeenCalled();
        });
    });

    describe('onSortChanged', function () {
        it('should save the selected sort', function () {
            let mockThis = {
                player: {
                    setChannels: jasmine.createSpy()
                },
                sortAndFilter: jasmine.createSpy()
            }

            LiveMode.prototype.onSortChanged.call(mockThis, 'newsort');
            expect(mockThis.selectedSort).toEqual('newsort');
        });

        it('should save to local storage', function () {
            let mockThis = {
                player: {
                    setChannels: jasmine.createSpy()
                },
                sortAndFilter: jasmine.createSpy()
            }

            LiveMode.prototype.onSortChanged.call(mockThis, 'newsort');
            expect(mockStorage.setItem).toHaveBeenCalledWith('twctv:channels-sortby-type', 'newsort');
        });

         it('should resort channels', function () {
            let mockThis = {
                player: {
                    setChannels: jasmine.createSpy()
                },
                channels: ['a'],
                sortAndFilter: jasmine.createSpy().and.returnValue('filtered'),
                selectedFilter: 'selectedFilter'
            }

            LiveMode.prototype.onSortChanged.call(mockThis, 'newsort');
            expect(mockThis.sortAndFilter).toHaveBeenCalledWith({
                channels: mockThis.channels,
                sort: 'newsort',
                filter: 'selectedFilter'
            });
            expect(mockThis.filteredChannels).toEqual('filtered');
        });
    });

    describe('getDefaultChannelNumber', function () {
        it('should use this.liveTmsId if able', function () {
            let mockThis = {
                getChannelById: jasmine.createSpy().and.returnValue({localChannelNumber: 'numa'})
            }

            let result = LiveMode.prototype.getDefaultChannelNumber.call(mockThis);
            expect(mockThis.getChannelById).toHaveBeenCalledWith(mockThis.liveTmsId);
            expect(result).toEqual('numa');
        });

        it('should use most recent channel if available', function () {
            let mockThis = {
                getChannelById: jasmine.createSpy().and.returnValue(undefined),
                getRecentHistory: jasmine.createSpy().and.returnValue([1, 2]),
                channels: [{
                    available: true,
                    localChannelNumber: 1
                }, {
                    available: true,
                    localChannelNumber: 2
                }]
            }

            let result = LiveMode.prototype.getDefaultChannelNumber.call(mockThis);
            expect(mockThis.getRecentHistory).toHaveBeenCalled();
            expect(result).toEqual(1);
        });

        it('should use next most recent if most recent isn\'t available', function () {
            let mockThis = {
                getChannelById: jasmine.createSpy().and.returnValue(undefined),
                getRecentHistory: jasmine.createSpy().and.returnValue([1, 2]),
                channels: [{
                    available: false,
                    localChannelNumber: 1
                }, {
                    available: true,
                    localChannelNumber: 2
                }]
            }

            let result = LiveMode.prototype.getDefaultChannelNumber.call(mockThis);
            expect(mockThis.getRecentHistory).toHaveBeenCalled();
            expect(result).toEqual(2);
        });

        it('should use first available channel if none of the recents are available', function () {
            let mockThis = {
                getChannelById: jasmine.createSpy().and.returnValue(undefined),
                getRecentHistory: jasmine.createSpy().and.returnValue([1, 2]),
                channels: [{
                    available: false,
                    localChannelNumber: 1
                }, {
                    available: false,
                    localChannelNumber: 2
                }, {
                    available: true,
                    localChannelNumber: 3
                }]
            }

            let result = LiveMode.prototype.getDefaultChannelNumber.call(mockThis);
            expect(mockThis.getRecentHistory).toHaveBeenCalled();
            expect(result).toEqual(3);
        });

        it('should use first available channel if there are no recents', function () {
            let mockThis = {
                getChannelById: jasmine.createSpy().and.returnValue(undefined),
                getRecentHistory: jasmine.createSpy().and.returnValue([]),
                channels: [{
                    available: false,
                    localChannelNumber: 1
                }, {
                    available: false,
                    localChannelNumber: 2
                }, {
                    available: true,
                    localChannelNumber: 3
                }]
            }

            let result = LiveMode.prototype.getDefaultChannelNumber.call(mockThis);
            expect(mockThis.getRecentHistory).toHaveBeenCalled();
            expect(result).toEqual(3);
        });

        it('should return undefined if literally nothing is available', function () {
            let mockThis = {
                getChannelById: jasmine.createSpy().and.returnValue(undefined),
                getRecentHistory: jasmine.createSpy().and.returnValue([]),
                channels: [{
                    available: false,
                    localChannelNumber: 1
                }, {
                    available: false,
                    localChannelNumber: 2
                }, {
                    available: false,
                    localChannelNumber: 3
                }]
            }

            let result = LiveMode.prototype.getDefaultChannelNumber.call(mockThis);
            expect(mockThis.getRecentHistory).toHaveBeenCalled();
            expect(result).toEqual(undefined);
        });
    });

    it('playSelectedChannel', function () {
        let mockThis = {
            selectedChannel: 'a',
            playChannel: jasmine.createSpy()
        }

        LiveMode.prototype.playSelectedChannel.call(mockThis);
        expect(mockThis.playChannel).toHaveBeenCalledWith('a');
    });

    describe('playChannel', function () {
        let mockThis;
        beforeEach(function () {
            mockThis = {
                player: {
                    hideBlockedStreamBanner: jasmine.createSpy()
                },
                pushToRecentHistory: jasmine.createSpy(),
                triggerStreamUriObtained: jasmine.createSpy().and.callFake(a => a),
                onPlayChannelError: jasmine.createSpy(),
                refreshOnNowAssetInfo: jasmine.createSpy(),
                playStreamCallback: jasmine.createSpy(),
                removeDummyEANChannel: jasmine.createSpy(),
                onDestroy: rx.Observable.never()
            }
        });

        xit('should load ean channel', function () {
            throw 'not implemented';
        });

        it('should update recent history', function () {
            LiveMode.prototype.playChannel.call(mockThis, {networkName: 'a'});
            expect(mockThis.pushToRecentHistory).toHaveBeenCalledWith({networkName: 'a'})
        });

        it('should get current asset', function () {
            LiveMode.prototype.playChannel.call(mockThis, {networkName: 'a'});
            expect(mockWhatsOn.now).toHaveBeenCalledWith({networkName: 'a'});
        });

        it('should refresh asset info', function (done) {
            LiveMode.prototype.playChannel.call(mockThis, {networkName: 'a'})
                .then(function () {
                    expect(mockWhatsOn.now).toHaveBeenCalledWith({networkName: 'a'});
                    expect(mockThis.refreshOnNowAssetInfo).toHaveBeenCalledWith('onNowAsset');
                    done();
                });

            $rootScope.$apply();
        });

        it('should check parental controls (pass)', function (done) {
            mockThis.parentalControlsCallback = jasmine.createSpy().and.returnValue($q.resolve());
            mockThis.playStreamCallback = jasmine.createSpy();
            LiveMode.prototype.playChannel.call(mockThis, {networkName: 'a', streamUri: 'uri'})
                .then(function () {
                    expect(mockThis.parentalControlsCallback).toHaveBeenCalledWith('onNowAsset');
                    expect(mockThis.onPlayChannelError).not.toHaveBeenCalled();
                    expect(mockPlayerStreamService.getLinearStream).toHaveBeenCalledWith('uri');
                    expect(mockThis.triggerStreamUriObtained).toHaveBeenCalledWith({
                        drm: 'drm',
                        stream: {
                            streamUrlWithDAIScheme: 'url'
                        }
                    });
                    expect(mockThis.playStreamCallback).toHaveBeenCalledWith('url', 'drm');
                    done();
                }, function () {
                    expect(false).toEqual(true, 'should not have generated an uncaught error');
                    done();
                });

            $rootScope.$apply();
        });

        it('should check parental controls (fail)', function (done) {
            mockThis.parentalControlsCallback = jasmine.createSpy().and.returnValue($q.reject('blocked'));
            mockThis.playStreamCallback = jasmine.createSpy();
            LiveMode.prototype.playChannel.call(mockThis, {networkName: 'a'})
                .then(function () {
                    expect(mockThis.parentalControlsCallback).toHaveBeenCalledWith('onNowAsset');
                    expect(mockThis.onPlayChannelError).toHaveBeenCalledWith('blocked');
                    expect(mockThis.playStreamCallback).not.toHaveBeenCalled();
                    expect(mockThis.player.hideBlockedStreamBanner).not.toHaveBeenCalled();
                    expect(mockPlayerStreamService.getLinearStream).not.toHaveBeenCalled();
                    expect(mockThis.triggerStreamUriObtained).not.toHaveBeenCalled();
                    expect(mockThis.playStreamCallback).not.toHaveBeenCalled();
                    done();
                }, function () {
                    expect(false).toEqual(true, 'should not have generated an uncaught error');
                    done();
                });

            $rootScope.$apply();
        });
    });

    describe('playEan', function () {
        xit('should add dummy ean channel', function () {
            throw 'not implemented';
        });

        xit('should unmute', function () {
            throw 'not implemented';
        });

        xit('should show loading indicator', function () {
            throw 'not implemented';
        });

        xit('should refresh asset info', function () {
            throw 'not implemented';
        });

        xit('should play ean url', function () {
            throw 'not implemented';
        });

        xit('should go back and restore mute setting when playback ends', function () {
            throw 'not implemented';
        });

        xit('should restore mute setting when use manually tunes away', function () {
            throw 'not implemented';
        });
    });

    describe('loadChannelData', function () {

    });

    describe('onChannelDataSuccess', function () {
        let mockThis;
        beforeEach(function () {
            mockThis = {
                player: {
                    setChannels: jasmine.createSpy(),
                    showCategoryFilters: jasmine.createSpy(),
                    setChannelFilters: jasmine.createSpy(),
                    setChannelSortByType: jasmine.createSpy(),
                    setSelectedChannel: jasmine.createSpy(),
                    setSelectedChannelFilter: jasmine.createSpy()
                },
                augmentChannelData: jasmine.createSpy().and.callFake(a => 'augmented' + a),
                sortAndFilter: jasmine.createSpy().and.returnValue(['sortedandfiltered']),
                goToDefaultChannel: jasmine.createSpy(),
                getDefaultSort: jasmine.createSpy().and.returnValue('sortbytype'),
                updateLineup: jasmine.createSpy(),
                getChannelFilters: jasmine.createSpy().and.returnValue($q.resolve('channelfilters')),
                onEAN: jasmine.createSpy(),
                location: {
                    behindOwnModem: 'foo'
                },
                selectedChannel: {
                    localChannelNumber: 1
                },
                selectedSort: 'sortbytype'
            }
        });

        it('should set channels on the player', function () {
            LiveMode.prototype.onChannelDataSuccess.call(mockThis, {filteredChannels: ['a']});
            expect(mockThis.player.setChannels).toHaveBeenCalledWith(['a']);
        });

        it('should call showCategoryFilters on the player', function () {
            LiveMode.prototype.onChannelDataSuccess.call(mockThis, {});
            expect(mockThis.player.showCategoryFilters).toHaveBeenCalledWith('foo');
        });

        it('should call setChannelFilters on the player', function () {
            LiveMode.prototype.onChannelDataSuccess.call(mockThis, {filters: ['f']});
            expect(mockThis.player.setChannelFilters).toHaveBeenCalledWith(['f']);
        })

        it('should set channel sort by type on the player', function () {
            LiveMode.prototype.onChannelDataSuccess.call(mockThis, {});
            expect(mockThis.player.setChannelSortByType).toHaveBeenCalledWith('sortbytype');
        });

        it('should set the selected channel on the player if no ean url', function () {
            mockThis.eanUrl = undefined;
            LiveMode.prototype.onChannelDataSuccess.call(mockThis, ['a', 'b']);
            expect(mockThis.goToDefaultChannel).toHaveBeenCalled();
        });

        it('should call onEAN if there is an eanUrl', function () {
            mockThis.eanUrl = 'abc';
            LiveMode.prototype.onChannelDataSuccess.call(mockThis, ['a', 'b']);
            expect(mockThis.player.setSelectedChannel).not.toHaveBeenCalledWith();
            expect(mockThis.updateLineup).not.toHaveBeenCalled();
            expect(mockThis.onEAN).toHaveBeenCalledWith({eanUrl: 'abc'});
        });
    });

    describe('pushToRecentHistory', function () {
        let mockThis;
        beforeEach(function () {
            mockThis = {
                getRecentHistory: jasmine.createSpy().and.returnValue([]),
                getFilters: jasmine.createSpy().and.returnValue('getfilters'),
                user: 'username',
                player: {
                    setChannelFilters: jasmine.createSpy(),
                    setSelectedChannelFilter: jasmine.createSpy()
                }
            }
        });

        it('should not insert ean channel', function () {
            LiveMode.prototype.pushToRecentHistory.call(mockThis, {localChannelNumber: 9999});
            expect(mockStorage.setItem).not.toHaveBeenCalled();
        });

        it('should move existing channel to the front', function () {
            mockThis.getRecentHistory = jasmine.createSpy().and.returnValue([1, 2]);

            LiveMode.prototype.pushToRecentHistory.call(mockThis, {localChannelNumber: 2});
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'twctv:recent-history-v2.username',
                '[2,1]')
        });

        it('should add nonexisting channel to the front', function () {
            mockThis.getRecentHistory = jasmine.createSpy().and.returnValue([1]);

            LiveMode.prototype.pushToRecentHistory.call(mockThis, {localChannelNumber: 2});
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'twctv:recent-history-v2.username',
                '[2,1]')
        });

        it('should add to empty array', function () {
            LiveMode.prototype.pushToRecentHistory.call(mockThis, {localChannelNumber: 1});
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'twctv:recent-history-v2.username',
                '[1]')
        });

        it('should cap list at 10', function () {
            mockThis.getRecentHistory = jasmine.createSpy().and
                .returnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

            LiveMode.prototype.pushToRecentHistory.call(mockThis, {localChannelNumber: 11});
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'twctv:recent-history-v2.username',
                '[11,1,2,3,4,5,6,7,8,9]')
        });

        it('should update channel filters if this is the first recent channel', function () {
            mockThis.selectedFilter = 'selectedfilter';
            LiveMode.prototype.pushToRecentHistory.call(mockThis, {localChannelNumber: 1});
            expect(mockThis.player.setChannelFilters).toHaveBeenCalledWith('getfilters');
            expect(mockThis.player.setSelectedChannelFilter).toHaveBeenCalledWith('selectedfilter');
        });
    });

    describe('refreshOnNowAssetInfo', function () {
        let mockThis = {
            player: {
                setAssetInfo: jasmine.createSpy()
            },
            formatRuntime: jasmine.createSpy().and.returnValue('runtime'),
            startUpdateTimer: jasmine.createSpy(),
            setEANAssetInfo: jasmine.createSpy(),
            selectedChannel: {
                logoUrl: 'logourl'
            }
        }

        let mockAsset = {
            title: 'title',
            shortDescription: 'desc',
            allRatings: ['a', 'b'],
            durationSec: 123,
            episodeTitle: 'eptit',
            seasonNumber: 'snum',
            episodeNumber: 'epnum',
            isEpisode: true,
            imageUri: () => 'imguri',
            networkImage: () => 'logouri',
            runtimeDisplay: 'runtime'
        }

        it('should fill out asset info', function () {
            LiveMode.prototype.refreshOnNowAssetInfo.call(mockThis, mockAsset);
            expect(mockThis.player.setAssetInfo).toHaveBeenCalledWith({
                title: 'title',
                description: 'desc',
                rating: 'a',
                seriesTitle: 'title',
                duration: 'runtime',
                episodeName: 'eptit',
                seasonNumber: 'snum',
                episodeNumber: 'epnum',
                isEpisodic: true,
                networkLogoUri: 'logouri',
                imageUri: 'imguri'
            });
        });

        it('should start timer to update on program boundary', function () {
            LiveMode.prototype.refreshOnNowAssetInfo.call(mockThis, mockAsset);
            expect(mockThis.startUpdateTimer).toHaveBeenCalledWith(mockAsset);
        });

        it('should set ean asset info if on ean channel', function () {
            mockThis.selectedChannel.localChannelNumber = 9999;
            LiveMode.prototype.refreshOnNowAssetInfo.call(mockThis, undefined);
            expect(mockThis.player.setAssetInfo).toHaveBeenCalledWith({
                title: 'Emergency Alert',
                isEpisodic: false
            });
        });
    });

    describe('startUpdateTimer', function () {
        let mockThis, mockAsset;
        beforeEach(function () {
            mockThis = {
                channelChangeSource: rx.Observable.never(),
                onDestroy: rx.Observable.never(),
                refreshOnNowAssetInfo: jasmine.createSpy(),
                updateLineup: jasmine.createSpy().and.returnValue($q.resolve()),
                selectedChannel: {
                    asset: {
                        title: 'hi'
                    },
                    localChannelNumber: 1
                }
            }
            mockAsset = {
                scheduledEndTimeSec: 5
            }
        });

        it('should refresh when current program ends', function () {
            spyOn(Date, 'now').and.returnValue(1000);
            let scheduler = new rx.TestScheduler();

            LiveMode.prototype.startUpdateTimer.call(mockThis, mockAsset, scheduler);

            scheduler.advanceTo(3999);
            expect(mockThis.updateLineup).not.toHaveBeenCalled();

            scheduler.advanceTo(4000);
            expect(mockThis.updateLineup).toHaveBeenCalledWith();

            expect(mockThis.refreshOnNowAssetInfo).not.toHaveBeenCalled();
            $rootScope.$apply();
            expect(mockThis.refreshOnNowAssetInfo).toHaveBeenCalledWith(mockThis.selectedChannel.asset);
        });

        it('should not repeatedly fire', function () {
            spyOn(Date, 'now').and.returnValue(1000);
            let scheduler = new rx.TestScheduler();

            LiveMode.prototype.startUpdateTimer.call(mockThis, mockAsset, scheduler);

            scheduler.advanceTo(4000);
            expect(mockThis.updateLineup).toHaveBeenCalledWith();

            scheduler.advanceTo(100000);
            expect(mockThis.updateLineup.calls.count()).toEqual(1);
        });

        it('should cancel if the channel changes', function () {
            spyOn(Date, 'now').and.returnValue(1000);
            let scheduler = new rx.TestScheduler();
            mockThis.channelChangeSource = scheduler.createHotObservable(
              onNext(2000, 1)
            );

            LiveMode.prototype.startUpdateTimer.call(mockThis, mockAsset, scheduler);

            scheduler.advanceTo(4000);
            expect(mockWhatsOn.nowOrImminent).not.toHaveBeenCalled();
        });

        it('should cancel if the player tears down', function () {
            spyOn(Date, 'now').and.returnValue(1000);
            let scheduler = new rx.TestScheduler();
            mockThis.onDestroy = scheduler.createHotObservable(
              onNext(2000, 1)
            );

            LiveMode.prototype.startUpdateTimer.call(mockThis, mockAsset, scheduler);

            scheduler.advanceTo(4000);
            expect(mockWhatsOn.nowOrImminent).not.toHaveBeenCalled();
        });
    });

    describe('updateLineup', function () {
        let mockThis, mockAsset;

        it('should do nothing and return a promise if there are no filtered channels', function () {
            mockThis = {
                filteredChannels: undefined
            };
            let result = LiveMode.prototype.updateLineup.call(mockThis);
            expect(result).toBeDefined();
            expect(result.then).toBeDefined();
            expect(mockWhatsOn.nowOrImminent).not.toHaveBeenCalled();
        });

        it('should get lineup, and apply it', function () {
            mockThis = {
                setCurrentAsset: jasmine.createSpy().and.callFake((channel, asset) => {
                    return $q.resolve(channel === '1'); // pretend that only channel 1 changed
                }),
                getFilters: jasmine.createSpy(),
                filteredChannels: [
                    '1',
                    '2'
                ],
                player: {
                    updateChannels: jasmine.createSpy(),
                    setChannelFilters: jasmine.createSpy(),
                    setSelectedChannelFilter: jasmine.createSpy()
                }
            }

            mockWhatsOn.nowOrImminent = jasmine.createSpy().and.returnValue($q.resolve([
                'asset1',
                'asset2'
            ]));

            let result = LiveMode.prototype.updateLineup.call(mockThis);
            expect(result).toBeDefined();
            expect(result.then).toBeDefined();
            $rootScope.$apply();
            expect(mockWhatsOn.nowOrImminent).toHaveBeenCalledWith(mockThis.filteredChannels);
            expect(mockThis.setCurrentAsset).toHaveBeenCalledWith('1', 'asset1');
            expect(mockThis.setCurrentAsset).toHaveBeenCalledWith('2', 'asset2');
            expect(mockThis.player.updateChannels).toHaveBeenCalledWith([mockThis.filteredChannels[0]]);
            expect(mockThis.getFilters).toHaveBeenCalled();
            expect(mockThis.player.setChannelFilters).toHaveBeenCalled();
            expect(mockThis.player.setSelectedChannelFilter).toHaveBeenCalled();
        });
    });

    describe('sortAndfilter', function () {
        it('should sort by channel number', function () {
            let mockChannels = [{
                localChannelNumber: 5,
                localChannelNumbers: [5]
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2]
            }];

            let mockThis = {};

            let sorted = LiveMode.prototype.sortAndFilter.call(mockThis, {channels: mockChannels, filter: {filter: 'All Channels'}, sort: 'channelNumber'});
            expect(sorted[0]).toEqual(mockChannels[1]);
            expect(sorted[1]).toEqual(mockChannels[0]);
        });

        it('should duplicate when sorting by channel number', function () {
            let mockChannels = [{
                localChannelNumber: 5,
                localChannelNumbers: [5, 1],
                somethingToIdentityWith: 'a',
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2],
                somethingToIdentityWith: 'b',
            }];

            let mockThis = {};

            let sorted = LiveMode.prototype.sortAndFilter.call(mockThis, {channels: mockChannels, filter: {filter: 'All Channels'}, sort: 'channelNumber'});
            expect(sorted.length).toEqual(3);
            expect(sorted[0]).not.toEqual(mockChannels[0]);
            expect(sorted[0].localChannelNumber).toEqual(1);
            expect(sorted[0].localChannelNumbers).toEqual([5, 1]);
            expect(sorted[0].somethingToIdentityWith).toEqual('a');
            expect(sorted[1]).toEqual(mockChannels[1]);
            expect(sorted[2]).toEqual(mockChannels[0]);
        });

        it('should sort by network', function () {
            let mockChannels = [{
                localChannelNumber: 1,
                localChannelNumbers: [1],
                networkName: 'beta'
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2],
                networkName: 'alpha'
            }];

            let mockThis = {};

            let sorted = LiveMode.prototype.sortAndFilter.call(mockThis, {channels: mockChannels, filter: {filter: 'All Channels'}, sort: 'networkAToZ'});
            expect(sorted[0]).toEqual(mockChannels[1]);
            expect(sorted[1]).toEqual(mockChannels[0]);
        });

        it ('should not duplicate when sorting by network', function () {
            let mockChannels = [{
                localChannelNumber: 5,
                localChannelNumbers: [5, 1],
                somethingToIdentityWith: 'a',
                networkName: 'beta'
            }, {
                localChannelNumber: 2,
                localChannelNumbers: [2],
                somethingToIdentityWith: 'b',
                networkName: 'alpha'
            }];

            let mockThis = {};

            let sorted = LiveMode.prototype.sortAndFilter.call(mockThis, {channels: mockChannels, filter: {filter: 'All Channels'}, sort: 'networkAToZ'});
            expect(sorted.length).toEqual(2);
            expect(sorted[0]).toEqual(mockChannels[1]);
            expect(sorted[1]).toEqual(mockChannels[0]);
        });
    });
});
