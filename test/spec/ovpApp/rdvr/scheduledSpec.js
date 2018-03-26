/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.rdvr.scheduled', function () {
    'use strict';

    let $scope, $rootScope, $httpBackend, $componentController, controller;
    let mockStbService, mockRdvrService;

    // beforeEach(module('test.templates'));
    beforeEach(module('ovpApp.rdvr.scheduled'));

    /* jscs: disable */
    beforeEach(inject(function (_$componentController_, _$rootScope_, rx) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $componentController = _$componentController_;

        mockStbService = {
            currentStbSource: new rx.BehaviorSubject()
        };

        mockRdvrService = {
            getScheduledRecordings: jasmine.createSpy()
        }

        controller = $componentController('rdvrScheduled', {
            $scope: $scope,
            rdvrService: mockRdvrService,
            stbService: mockStbService,
            $state: {current:{}}
        });
    }));
    /* jscs: enable */

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('scheduled controller', function () {
        it('should listen for stb change and get scheduled recordings', function () {

        });

        it('should abort getting scheduled recordings if stb changes', function () {

        });

        it('should display loading spinner when stb changes', function () {

        });

        it('should hide loading spinner on error', function () {

        });

        it('should hide main loading spinner when partially loaded', function () {

        });

        it('should hide secondary loading spinner when fully loaded', function () {

        });
    });
});
