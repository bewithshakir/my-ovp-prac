/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.settings.parentalControls', function () {
    'use strict';

    let $controller, $scope, $rootScope, parentalControlsService, ParentalControlsSettingsController, savedArgs,
        messages, mockAlert, $httpBackend, $q, mockParentalControlsData, getParentalControlsForUserDefer;

    beforeEach(module('ovpApp.settings.parentalControls'));
    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
    }))

    beforeEach(inject(function (_$controller_, _$rootScope_,
                               _parentalControlsService_, _$q_, _messages_, _$httpBackend_) {
        $controller = _$controller_
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        parentalControlsService = _parentalControlsService_;
        $q = _$q_;
        messages = _messages_;
        $httpBackend = _$httpBackend_;

        mockAlert = {
            open: function (args) {
                savedArgs = args;
                return {
                    result: $q.defer()
                };
            }
        };

        parentalControlsService.getParentalControlsForUser = function () {
            getParentalControlsForUserDefer = $q.defer();
            return getParentalControlsForUserDefer.promise;
        };

        parentalControlsService.getLoggedInUsername = function () {
            var defer = $q.defer();
            defer.resolve('homeboy');
            return defer.promise;
        };

        parentalControlsService.isPrimaryAccount = function () {
            var defer = $q.defer();
            defer.resolve(true);
            return defer.promise;
        };

        parentalControlsService.isPINSet = function () {
            var defer = $q.defer();
            defer.resolve(false);
            return defer.promise;
        };

        parentalControlsService.isParentalControlsDisabledForClient = function () {
            var defer = $q.defer();
            defer.resolve(true);
            return defer.promise;
        };

        parentalControlsService.hasChannelBlockingEnabled = function () {
            var defer = $q.defer();
            defer.resolve(false);
            return defer.promise;
        };

        mockParentalControlsData = {
            getChannelCards: () => $q.resolve({channels: [], channelCards: []}),
            getRatingBlocks: () => $q.resolve({movieRating: 'G', tvRating: 'TV-G'})
        };

        ParentalControlsSettingsController = _$controller_('ParentalControlsSettingsController', {
            $scope: $scope,
            $rootScope: $rootScope,
            parentalControlsService: _parentalControlsService_,
            parentalControlsData: mockParentalControlsData,
            alert: mockAlert,
            $state: {current: {}}
        });
    }));

    describe('settings parentalControls Controller', function () {

        it('pop error message when service is disabled', function () {
            spyOn(window.mockErrorCodesService, 'getMessageForCode').and.returnValue('pc-error');

            getParentalControlsForUserDefer.reject();

            $scope.$apply();

            expect(savedArgs).toEqual({message: 'pc-error'});
        });

        it('user cannot edit if pin not set, not unlocked, not enabled', function () {
            $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/ratings')
                .respond(200, {});

            getParentalControlsForUserDefer.resolve();

            $scope.$apply();
            expect(ParentalControlsSettingsController.canEdit).toEqual(false);

            ParentalControlsSettingsController.hasPin = false;
            ParentalControlsSettingsController.unlocked = true;
            ParentalControlsSettingsController.parentalControlsEnabledForClient = true;

            $scope.$apply();

            expect(ParentalControlsSettingsController.canEdit).toEqual(false);

            ParentalControlsSettingsController.hasPin = true;
            ParentalControlsSettingsController.unlocked = false;
            ParentalControlsSettingsController.parentalControlsEnabledForClient = true;

            $scope.$apply();

            expect(ParentalControlsSettingsController.canEdit).toEqual(false);


            ParentalControlsSettingsController.hasPin = false;
            ParentalControlsSettingsController.unlocked = false;
            ParentalControlsSettingsController.parentalControlsEnabledForClient = true;

            $scope.$apply();

            expect(ParentalControlsSettingsController.canEdit).toEqual(false);

            ParentalControlsSettingsController.hasPin = true;
            ParentalControlsSettingsController.unlocked = true;
            ParentalControlsSettingsController.parentalControlsEnabledForClient = true;

            $scope.$apply();

            expect(ParentalControlsSettingsController.canEdit).toEqual(true);
        });

        it('user clears all channel blocks, should have nothing blocked', function () {
            //TODO
        });

        it('should only diplay the channel number if a single one exists', function () {
            var chan = ParentalControlsSettingsController.getCardNumber({
                channels: [113]
            });

            expect(chan).toBe(113);
            chan = ParentalControlsSettingsController.getCardNumber({
                channels: [113, 110]
            });
            expect(chan).toBe(113);
            chan = ParentalControlsSettingsController.getCardNumber({
                services: [
                    {
                        name: 'noto',
                        channels: [10]
                    },
                    {
                        name: 'neto',
                        channels: [10]
                    }
                ]
            });
            expect(chan).toBe(10);
            chan = ParentalControlsSettingsController.getCardNumber({
                services: [
                    {
                        name: 'noto',
                        channels: [10]
                    },
                    {
                        name: 'neto',
                        channels: [15]
                    }
                ]
            });
            expect(chan).toBe(10);
        });
    });
});
