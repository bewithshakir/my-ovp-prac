/*global window,spyOn*/
describe('ovpApp.product.productActionService', function () {
    'use strict';

    var $rootScope,
        productActionService,
        $q,
        $state,
        $scope,
        $httpBackend,
        mockFn,
        mockBookmarkService,
        stbService,
        mockModal;

    window.spyFn = function () {};

    beforeEach(module('test.templates'));
    beforeEach(module('ovpApp.product.productActionService'));
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(function () {

        /*
            Mock functions with embeded spys, to ensure the popups get created
            and shown
         */
        mockBookmarkService = {
            addToWatchLater: function () {},
            deleteFromWatchLater: function () {}
        };

        mockModal = {
            open: jasmine.createSpy()
        }


        /*
            Mocking dependencies
         */
        module(function ($provide) {
            $provide.value('modal', mockModal);
            $provide.value('BookmarkService', mockBookmarkService);
            $provide.value('rdvrService',  {
                getSeriesRecordingSettings: function () {
                    return {
                        isNew: function () {}
                    };
                }
            });
            $provide.value('errorCodesService', mockErrorCodesService);
        });
    });

    beforeEach(inject(function (
        _$q_,
        _$rootScope_,
        _$state_,
        _$httpBackend_,
        _stbService_,
        _productActionService_) {
        $httpBackend = _$httpBackend_;
        productActionService = _productActionService_;
        $q = _$q_;
        $state = _$state_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        stbService = _stbService_;
    }));

    it('return a service with executeAction defined', function () {
        expect(productActionService.executeAction).toBeDefined();
    });

    it('should play when the watchOnDemandIP action is called', function () {
        var asset = {
                streamList: [
                    {
                        streamProperties: {
                            prodictAssetID: 'mockid'
                        }
                    }
                ]
            },
            action = {
                actionType: 'watchOnDemandIP',
                streamIndex: 0
            };

        spyOn($state, 'go').and.callFake(function (loc) {
            expect(loc).toBe('ovp.ondemand.playProduct');
        });
        productActionService.executeAction(action, asset);
        action.actionType = 'resumeOnDemandIP';
        productActionService.executeAction(action, asset);
        expect($state.go.calls.count()).toEqual(2);
    });

    it('should navigate to the correct location ', function () {
        var asset = {
                streamList: [
                    {
                        streamProperties: {
                            prodictAssetID: 'mockid'
                        }
                    }
                ]
            },
            action = {
                actionType: 'watchLiveIP',
                streamIndex: 0
            };


        spyOn($state, 'go').and.callFake(function (loc) {
            expect(loc).toBe('ovp.livetv');
        });
        productActionService.executeAction(action, asset);
    });

    it('should display the other ways to watch popup', function () {
        var asset = {
                streamList: [
                    {
                        streamProperties: {
                            prodictAssetID: 'mockid'
                        }
                    }
                ]
            },
            action = {
                actionType: 'otherWaysToWatch',
                streamIndex: 0
            };

        productActionService.executeAction(action, asset);
        expect(mockModal.open).toHaveBeenCalled();
    });

    it('should display the edit recording popup', function () {
        //editSeriesRecording
        var asset = {
                seasons: [
                    {},//Season 1
                    {
                        episodes: [
                            {
                                streamList: [
                                    {
                                        streamProperties: {
                                            providerAssetID: 'mockid'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            action = {
                actionType: 'editSeriesRecording',
                streamIndex: 0,
                seasonIndex: 1,
                episodeIndex: 0
            },
            spy = spyOn(window, 'spyFn').and.callThrough();

        spyOn(stbService, 'getCurrentStbPromise').and.returnValue($q.resolve({}));

        mockModal.open = jasmine.createSpy().and.returnValue({
            result: $q.resolve()
        });

        productActionService.executeAction(action, asset);
        $rootScope.$apply();
        expect(mockModal.open).toHaveBeenCalled();
    });

    it('should broadcast product action for listeners', function () {
        spyOn($rootScope, '$broadcast');

        var action = {
                actionType: 'addToWatchList'
            },
            asset = {};

        productActionService.executeAction(action, asset);
        expect($scope.$broadcast.calls.count()).toEqual(1);
    });

    it('should attempt to add from the bookmark service', function () {
        var action = {
                actionType: 'addToWatchList'
            },
            asset = {},
            spy = spyOn(mockBookmarkService, 'addToWatchLater').and.callThrough();
        productActionService.executeAction(action, asset);
        expect(spy).toHaveBeenCalled();
    });

    it('should attempt to remove from the bookmark service', function () {
        var action = {
                actionType: 'removeFromWatchList'
            },
            asset = {},
            spy = spyOn(mockBookmarkService, 'deleteFromWatchLater').and.callThrough();
        productActionService.executeAction(action, asset);
        expect(spy).toHaveBeenCalled();
    });

    it('should display the CDVR record confirm popup', function () {
        var testChannel = 9999;
        var testTitle = 'Test Title';
        var asset = {
            streamList: [
                {
                    streamProperties: {
                        allChannelNumbers: [testChannel]
                    }
                }
            ],
            title: testTitle,
            network: {
                callsign: 'HBO'
            }
        };
        var action = {
            actionType: 'cdvrScheduleRecording',
            streamIndex: 0,
            seasonIndex: 1,
            episodeIndex: 0
        };

        productActionService.executeAction(action, asset);
        expect(mockModal.open).toHaveBeenCalled();
        let args = mockModal.open.calls.mostRecent().args;
        expect(args.length).toEqual(1);
        expect(args[0].component).toEqual('confirm');
        expect(args[0].resolve).toBeDefined();
        expect(args[0].resolve.options).toBeDefined();

        // Message has show title in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testTitle)).not.toEqual(-1);

        // Message has channel in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testChannel)).not.toEqual(-1);
    });

    it('should display the CDVR cancel confirm popup', function () {
        var testChannel = 9999;
        var testTitle = 'Test Title';
        var asset = {
            streamList: [
                {
                    streamProperties: {
                        allChannelNumbers: [23, testChannel]
                    }
                }
            ],
            title: testTitle,
            displayChannel: testChannel,
            network: {
                callsign: 'HBO'
            }
        };
        var action = {
            actionType: 'cdvrCancelRecording',
            streamIndex: 0,
            seasonIndex: 1,
            episodeIndex: 0
        };

        productActionService.executeAction(action, asset);
        expect(mockModal.open).toHaveBeenCalled();
        let args = mockModal.open.calls.mostRecent().args;
        expect(args.length).toEqual(1);
        expect(args[0].component).toEqual('confirm');
        expect(args[0].resolve).toBeDefined();
        expect(args[0].resolve.options).toBeDefined();

        // Message has show title in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testTitle)).not.toEqual(-1);

        // Message has channel in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testChannel)).not.toEqual(-1);
    });

    it('should display the CDVR series cancel confirm popup', function () {
        var testChannel = 9999;
        var testTitle = 'Test Title';
        var asset = {
            streamList: [
                {
                    streamProperties: {
                        allChannelNumbers: [23, testChannel]
                    }
                }
            ],
            title: testTitle,
            displayChannel: testChannel
        };
        var action = {
            actionType: 'cdvrCancelSeriesRecording',
            streamIndex: 0,
            seasonIndex: 1,
            episodeIndex: 0
        };

        productActionService.executeAction(action, asset);
        expect(mockModal.open).toHaveBeenCalled();
        let args = mockModal.open.calls.mostRecent().args;
        expect(args.length).toEqual(1);
        expect(args[0].component).toEqual('confirm');
        expect(args[0].resolve).toBeDefined();
        expect(args[0].resolve.options).toBeDefined();

        // Message does not have show title in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testTitle)).toEqual(-1);

        // Message does not have channel in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testChannel)).toEqual(-1);

        // Post OK has title in it
        expect(args[0].resolve.options.postOkMessage.indexOf(testTitle)).not.toEqual(-1);
    });

    it('should display the CDVR delete confirm popup', function () {
        var testChannel = 9999;
        var testTitle = 'Test Title';
        var asset = {
            streamList: [
                {
                    streamProperties: {
                        allChannelNumbers: [23, testChannel]
                    }
                }
            ],
            title: testTitle,
            displayChannel: testChannel
        };
        var action = {
            actionType: 'cdvrDeleteRecording',
            streamIndex: 0,
            seasonIndex: 1,
            episodeIndex: 0
        };

        productActionService.executeAction(action, asset);
        productActionService.executeAction(action, asset);
        expect(mockModal.open).toHaveBeenCalled();
        let args = mockModal.open.calls.mostRecent().args;
        expect(args.length).toEqual(1);
        expect(args[0].component).toEqual('confirm');
        expect(args[0].resolve).toBeDefined();
        expect(args[0].resolve.options).toBeDefined();

        // Message has show title in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testTitle)).not.toEqual(-1);

        // Message does not have channel in it
        expect(args[0].resolve.options.preOkMessage.indexOf(testChannel)).toEqual(-1);
    });

    it('should display the CDVR schedule series popup', function () {
        var testChannel = 9999;
        var testTitle = 'Test Title';
        var asset = {
            title: testTitle,
            cdvrChannelPickerTmsGuideIds: [1],
            seasons: [{episodes: [{streamList: [{streamProperties: {tmsGuideServiceId: 1}}]}]}]
        };
        var action = {
            actionType: 'cdvrScheduleSeriesRecording',
            streamIndex: 0,
            seasonIndex: 0,
            episodeIndex: 0
        };

        productActionService.executeAction(action, asset);

        expect(mockModal.open).toHaveBeenCalled();
        let args = mockModal.open.calls.mostRecent().args;
        expect(args.length).toEqual(1);
        expect(args[0].component).toEqual('recordCdvrSeries');
        expect(args[0].resolve).toBeDefined();
        expect(args[0].resolve).toBeDefined();
        expect(args[0].resolve.asset).toEqual(asset);
        expect(args[0].resolve.action).toEqual(action);
    });

});
