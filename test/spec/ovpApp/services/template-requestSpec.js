/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.services.templateRequest', function () {
    'use strict';

    var templateRequest, $httpBackend, $templateCache;

    beforeEach(module('ovpApp.services.templateRequest'));

    /* jscs:disable */
    beforeEach(inject(function (_templateRequest_, _$templateCache_) {
        $templateCache = _$templateCache_;
        templateRequest = _templateRequest_;
    }));
    /* jscs:enable */

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
    }));

    it('should only make one $http request for multiple instances', function () {
        $templateCache.removeAll();
        templateRequest('fakeTemplate');
        templateRequest('fakeTemplate');

        $httpBackend.expectGET('fakeTemplate')
            .respond(200);

        $httpBackend.flush();
    });

    it('should reject promise on $http error', function () {
        $templateCache.removeAll();
        templateRequest('notFoundTemplate').then(angular.noop(), function (err) {
            expect(err).toBeUndefined();
        });

        $httpBackend.expectGET('notFoundTemplate')
            .respond(404);

        $httpBackend.flush();
    });

    it('should store template in cache after retrieval', function () {
        $templateCache.removeAll();

        templateRequest('fakeTemplate').then(function () {
            templateRequest('fakeTemplate');
        });

        $httpBackend.expectGET('fakeTemplate')
            .respond('<div>Template Data</div>');

        $httpBackend.flush();
    });

});
