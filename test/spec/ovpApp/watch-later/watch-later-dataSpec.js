/* globals inject, mockData, _ */
/* jshint jasmine: true */

describe('ovpApp.watchlater.data', function () {
    'use strict';

    var $rootScope,
        service,
        $httpBackend;



    beforeEach(module('ovpApp.watchlater.data'));
    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
    }));
    beforeEach(function () {

        module('ovpApp.watchlater.data');

        module('ovpApp.services.profileService', function($provide) {
            mockProfileService.isSpecU = function () {
                return false;
            };
            $provide.value('profileService', mockProfileService);
        });


        module('ovpApp.services.parentalControlsService', function ($provide) {
            var parentalControlsServiceMock = {
                alert: jasmine.createSpy(),
                isTvShowBlockedByRating: null,
                isMovieBlockedByRating: null
            };

            $provide.value('parentalControlsService', parentalControlsServiceMock);
        });


        inject(function (_$injector_, _$rootScope_, _watchLaterData_, parentalControlsService, $q) {
            var blockedCheck = function () {
                var def = $q.defer();
                setTimeout(function () {
                    def.resolve(true);
                }, 60);
                return def.promise;
            };

            parentalControlsService.isTvShowBlockedByRating = blockedCheck;
            parentalControlsService.isMovieBlockedByRating = blockedCheck;
            parentalControlsService.isBlockedByRating = blockedCheck;
            $rootScope = _$rootScope_;
            service = _watchLaterData_;
            $httpBackend = _$injector_.get('$httpBackend');
        });
    });

    it('should instantiate the service', function () {
        expect(service).toBeDefined();
    });

    describe('getCategories', function () {
        it('should get the categories', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            $httpBackend.expectGET(
                '/nationalnavigation/V1/symphoni/entrypoint?division=CLT&lineup=168&profile=ovp_v6')
                .respond(200, mockData.nnsEntryPoint);

            $httpBackend.expectGET('/nationalnavigation/V1/symphoni/watchlater/frontdoor' +
                '?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48')
                .respond(200, mockData.watchLaterFrontDoor);

            service.getCategories()
                .then(categories => {
                    expect(categories.length).toEqual(3);
                    expect(categories[0].context).toEqual('inProgress');
                    expect(categories[1].context).toEqual('saved');
                    expect(categories[2].context).toEqual('rented');
                    done();
                })

            $httpBackend.flush();
        });

        it('should retry first 2 failures', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            $httpBackend.expectGET(
                '/nationalnavigation/V1/symphoni/entrypoint?division=CLT&lineup=168&profile=ovp_v6')
                .respond(200, mockData.nnsEntryPoint);

            for (var i = 0; i < 2; i++) {
                $httpBackend.expectGET('/nationalnavigation/V1/symphoni/watchlater/frontdoor' +
                '?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48')
                    .respond(500, {});
            }

            $httpBackend.expectGET('/nationalnavigation/V1/symphoni/watchlater/frontdoor' +
                '?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48')
                .respond(200, mockData.watchLaterFrontDoor);

            service.getCategories()
                .then(categories => {
                    expect(categories.length).toEqual(3);
                    expect(categories[0].context).toEqual('inProgress');
                    expect(categories[1].context).toEqual('saved');
                    expect(categories[2].context).toEqual('rented');
                    done();
                })

            $httpBackend.flush();
        });

        it('should not retry 3rd failure', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            $httpBackend.expectGET(
                '/nationalnavigation/V1/symphoni/entrypoint?division=CLT&lineup=168&profile=ovp_v6')
                .respond(200, mockData.nnsEntryPoint);

            for (var i = 0; i < 3; i++) {
                $httpBackend.expectGET('/nationalnavigation/V1/symphoni/watchlater/frontdoor' +
                '?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48')
                    .respond(500, {});
            }

            service.getCategories()
                .then(categories => {
                     // should not have resulted in a success
                    expect(false).toEqual(true);
                    done();
                }, () => done())

            $httpBackend.flush();
        });
    })

    describe('onAdd', function () {
        it('should insert asset', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            $httpBackend.expectGET(
                '/nationalnavigation/V1/symphoni/entrypoint?division=CLT&lineup=168&profile=ovp_v6')
                .respond(200, mockData.nnsEntryPoint);

            $httpBackend.expectGET('/nationalnavigation/V1/symphoni/watchlater/frontdoor' +
                '?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48')
                .respond(200, mockData.watchLaterFrontDoor);

            service.getCategories()
                .then(categories => {
                    let firstCat = categories[0].context;
                    let firstCatLength = categories[0].media.length;
                    let mockAsset = {title: 'fake'};
                    service._private.onAdd(firstCat)({}, mockAsset);

                    expect(categories[0].media.length).toEqual(firstCatLength + 1);
                    expect(categories[0].media[0]).toBe(mockAsset);
                    done();
                })

            $httpBackend.flush();
        });
    });

    describe('onDelete', function () {
        it('should delete asset', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            $httpBackend.expectGET(
                '/nationalnavigation/V1/symphoni/entrypoint?division=CLT&lineup=168&profile=ovp_v6')
                .respond(200, mockData.nnsEntryPoint);

            $httpBackend.expectGET('/nationalnavigation/V1/symphoni/watchlater/frontdoor' +
                '?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48')
                .respond(200, mockData.watchLaterFrontDoor);

            service.getCategories()
                .then(categories => {
                    let firstCat = categories[0].context;
                    let firstCatLength = categories[0].media.length;
                    let firstMedia = categories[0].media[0];
                    service._private.onDelete(firstCat)({}, firstMedia);

                    expect(categories[0].media.length).toEqual(firstCatLength - 1);
                    expect(categories[0].media.indexOf(firstMedia)).toBe(-1);
                    done();
                })

            $httpBackend.flush();
        });
    });

    describe('onClear', function () {
        it('should clear list', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            $httpBackend.expectGET(
                '/nationalnavigation/V1/symphoni/entrypoint?division=CLT&lineup=168&profile=ovp_v6')
                .respond(200, mockData.nnsEntryPoint);

            $httpBackend.expectGET('/nationalnavigation/V1/symphoni/watchlater/frontdoor' +
                '?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48')
                .respond(200, mockData.watchLaterFrontDoor);

            service.getCategories()
                .then(categories => {
                    let firstCat = categories[0].context;
                    service._private.onClear(firstCat)();

                    expect(categories[0].media.length).toEqual(0);
                    done();
                })

            $httpBackend.flush();
        });
    });
});
