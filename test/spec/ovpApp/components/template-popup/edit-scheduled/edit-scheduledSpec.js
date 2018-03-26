/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.components.templatePopup.editScheduled', function () {
    'use strict';

    var $scope,
        $rootScope,
        $httpBackend,
        $element,
        $q,
        messages,
        EditScheduledController,
        mockAlert,
        savedArgs,
        epgsService;

    beforeEach(module('ovpApp.components.templatePopup.editScheduled'));

    /* jscs: disable */
    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _stbService_, _messages_, _epgsService_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        savedArgs = [];
        epgsService = _epgsService_;

        $scope.scheduledRecording = {
            tmsProgramId: 'EP12345',
            mystroServiceId: '54321',
            startUnixTimestampSeconds: 100000007,
            programMetadata: {
                title: 'foo'
            }
        };

        _stbService_.getCurrentStb = function () {
            return $q.when({
                macAddressNormalized: '00000011',
                rdvrVersion: 2,
                dvr: true
            });
        };

        spyOn(_stbService_, 'getHeadend').and.returnValue($q.defer());

        mockAlert = function (config) {
            savedArgs = config;
            this.show = function () {
                return $q.defer();
            }
        };

        $element = angular.element('<div></div>');
        messages = _messages_;
        $q = _$q_;

        EditScheduledController = _$controller_('EditScheduledController', {
            $scope: $scope,
            $rootScope: $rootScope,
            $element: angular.element('<div></div>'),
            stbService: _stbService_,
            Alert: mockAlert
        });
    }));
    /* jscs: enable */

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
    }));

    xdescribe('editScheduled controller', function () {

        var cancelUrl = '/nrs/api/rdvr2/dvr/00000011/scheduled/54321/EP12345/100000007/single',
            updateUrl = '/nrs/api/rdvr2/dvr/00000011/schedule/54321/EP12345/100000007/single';

        it('should only send one request for multiple cancel schedule calls', function () {

            spyOn($scope, '$emit');

            for (var i = 0; i < 5; i++) {
                $httpBackend.expectDELETE(cancelUrl)
                    .respond(200, '');
                $scope.cancelSchedule();
            }

            $httpBackend.flush();

            expect($scope.$emit).toHaveBeenCalledWith('cancel-schedule', $scope.scheduledRecording);
            expect($scope.$emit.calls.count()).toEqual(1);
        });

        it('should only send one request for multiple update schedule calls', function () {

            spyOn($scope, '$emit');

            for (var i = 0; i < 5; i++) {
                $httpBackend.whenDELETE(cancelUrl)
                    .respond(200, '');
                $httpBackend.whenPUT(updateUrl)
                    .respond(200, '');

                $scope.updateSchedule();
            }

            $httpBackend.flush();

            expect($scope.$emit).toHaveBeenCalledWith('update-schedule', jasmine.any(Object));
            expect($scope.$emit.calls.count()).toEqual(1);
        });

        it('should handle cancel schedule failure properly', function () {

            messages.dvr.genericFailure = 'fake';

            $httpBackend.whenDELETE(cancelUrl)
                .respond(400, '');

            $scope.cancelSchedule();

            $httpBackend.flush();

            expect(savedArgs).toEqual({
                    message: messages.dvr.genericFailure,
                    buttonText: 'OK',
                    title: messages.dvr.schedule.failureHeader
                });
        });

        it('should handle update schedule failure properly for response 400', function () {

            messages.dvr.genericFailure = 'fake';

            $httpBackend.whenDELETE(cancelUrl)
                .respond(200, '');

            $httpBackend.whenPUT(updateUrl)
                .respond(400, '');

            $scope.updateSchedule();

            $httpBackend.flush();

            expect(savedArgs).toEqual({
                    message: messages.dvr.genericFailure,
                    buttonText: 'OK',
                    title: messages.dvr.schedule.failureHeader
                });
        });

        it('should handle update schedule failure properly for response 439', function () {

            messages.dvr.schedule.alreadyScheduled = 'fake';

            $httpBackend.whenDELETE(cancelUrl)
                .respond(200, '');

            $httpBackend.whenPUT(updateUrl)
                .respond(439, '');

            $scope.updateSchedule();

            $httpBackend.flush();

            expect(savedArgs).toEqual({
                    message: messages.dvr.schedule.alreadyScheduled,
                    buttonText: 'OK',
                    title: messages.dvr.schedule.alreadyScheduledHeader
                });
        });

    });
});
