/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.remotePlayer', function () {
    'use strict';

    let $rootScope, $state, remotePlayService, productActionService, $transitions, RemotePlayerController;

    beforeEach(module('rx'));
    beforeEach(module('ovpApp.remotePlayer'));

    beforeEach(inject(function (_$rootScope_, $componentController, _$state_, _remotePlayService_, _productActionService_, _$transitions_) {
        $rootScope = _$rootScope_;
        remotePlayService = _remotePlayService_;
        productActionService = _productActionService_;
        $transitions = _$transitions_;
        $state = _$state_;

        productActionService.executeAction = jasmine.createSpy();

        RemotePlayerController = $componentController('remotePlayer', {
            $state,
            remotePlayService,
            productActionService,
            $transitions
        });
        RemotePlayerController.$onInit();
    }));

    describe('remote play', function () {
        it('should set valid values', function () {
            remotePlayService.remotePlay({
                stb: {
                    name: 'teststb'
                },
                asset: {
                    title: 'dummytitle'
                },
                ipAction: {
                    actionType: 'ipAction'
                },
                tvAction: {
                    actionType: 'tvAction'
                }
            });
            expect(RemotePlayerController.visible).toBe(false);
            expect(RemotePlayerController.selectedStb.name).toBe('teststb');
            expect(RemotePlayerController.asset.title).toBe('dummytitle');
            expect(RemotePlayerController.ipAction.actionType).toBe('ipAction');
            expect(RemotePlayerController.tvAction.actionType).toBe('tvAction');
        });

        it('stopRemotePlay should not reset options', function () {
            remotePlayService.remotePlay({
                stb: {
                    name: 'teststb1'
                },
                asset: {
                    title: 'dummytitle1'
                },
                ipAction: {
                    actionType: 'ipAction1'
                },
                tvAction: {
                    actionType: 'tvAction1'
                }
            });
            remotePlayService.stopRemotePlay();

            expect(RemotePlayerController.selectedStb.name).toBe('teststb1');
            expect(RemotePlayerController.asset.title).toBe('dummytitle1');
            expect(RemotePlayerController.ipAction.actionType).toBe('ipAction1');
            expect(RemotePlayerController.tvAction.actionType).toBe('tvAction1');
        });

        it('switchPlayBack should invoke productActionService executeAction function', function () {
            let options = {
                stb: {
                    name: 'teststb2'
                },
                asset: {
                    title: 'dummytitle2'
                },
                ipAction: {
                    actionType: 'ipAction2'
                },
                tvAction: {
                    actionType: 'tvAction2'
                }
            };
            remotePlayService.remotePlay(options);
            RemotePlayerController.switchPlayBack();
            expect(productActionService.executeAction).toHaveBeenCalledWith(options.ipAction, options.asset);
        });
    });
    
    describe('remotePlayService', function () {
        it('should clear options on stop', function () {
            let opt;
            remotePlayService.getSource().subscribe(options => {
                opt = options;
            });

            let options = {
                stb: {
                    name: 'teststb3'
                },
                asset: {
                    title: 'dummytitle3'
                },
                ipAction: {
                    actionType: 'ipAction3'
                },
                tvAction: {
                    actionType: 'tvAction3'
                }
            };
            remotePlayService.remotePlay(options);
            expect(opt).toBe(options);
            remotePlayService.stopRemotePlay();
            expect(opt).toEqual({});
        });
    });
});
