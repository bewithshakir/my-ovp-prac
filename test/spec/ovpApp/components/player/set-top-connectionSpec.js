/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.remotePlayer.setTopConnection', function () {
    'use strict';

    let $rootScope, remotePlayService, $state, SetTopConnectionController;

    beforeEach(module('rx'));
    beforeEach(module('ovpApp.remotePlayer.setTopConnection'));

    beforeEach(inject(function (_$rootScope_, $componentController, _$state_, _remotePlayService_) {
        $rootScope = _$rootScope_;
        remotePlayService = _remotePlayService_;
        $state = _$state_;

        $state.go = jasmine.createSpy();

        SetTopConnectionController = $componentController('setTopConnection', {
            remotePlayService, $state
        });
        SetTopConnectionController.$onInit();
    }));

    describe('remote play', function () {
        it('should set valid values', function () {
            let opt = {
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
            };

            remotePlayService.remotePlay(opt);
            expect(SetTopConnectionController.stbTitle).toBe('teststb');
            expect(SetTopConnectionController.programTitle).toBe('dummytitle');
            expect(SetTopConnectionController.asset).toBe(opt.asset);
            expect(SetTopConnectionController.stb).toBe(opt.stb);
            expect(SetTopConnectionController.options).toBe(opt);

            remotePlayService.stopRemotePlay();
            expect(SetTopConnectionController.stbTitle).toBe(undefined);
            expect(SetTopConnectionController.programTitle).toBe(undefined);
            expect(SetTopConnectionController.asset).toBe(undefined);
            expect(SetTopConnectionController.stb).toBe(undefined);
            expect(SetTopConnectionController.options).toEqual({});
        });

        it('reconnect should navigate to remotePlay state', function () {
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
            SetTopConnectionController.reconnect();
            expect($state.go).toHaveBeenCalledWith('ovp.playRemote', options);
        });
    });
});
