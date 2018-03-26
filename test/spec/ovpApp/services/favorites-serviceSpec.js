describe('ovpApp.services.favoritesService', function () {
    'use strict';

    var favoritesService, $httpBackend, $rootScope;

    beforeEach(module('ovpApp.services.favoritesService'));
    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function (_favoritesService_, _$rootScope_, _$httpBackend_) {
        favoritesService = _favoritesService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

    }));

    describe('toggleFavorite', function () {
        it('should return a promise', function () {
            let result = favoritesService.toggleFavorite({channelNumber: 1});
            expect(result).toBeDefined();
            expect(result.then).toBeDefined();

            $httpBackend.expectPOST('/ipvs/api/smarttv/favorites/channels/v1/add', {channelNumber: 1}).respond();
            $httpBackend.flush();
        });


        // it('should publish event', function (done) {
        //     $rootScope.$on('EG:favoriteToggled', (event, data) => {
        //         expect(data).toEqual({
        //             playerType: 'linear',
        //             streamType: 'linear',
        //             assetMetadata: {
        //                 channelID: 2,
        //                 channelNumber: 1
        //             },
        //             favorite: true
        //         })
        //         done();
        //     });
        //
        //     favoritesService.toggleFavorite(1, 2);
        // });


        it('should toggle locally and send message', function (done) {
            $httpBackend.expectPOST('/ipvs/api/smarttv/favorites/channels/v1/add', {channelNumber:1})
                .respond(200, '');

            expect(favoritesService.isFavorite({channelNumber:1})).toEqual(false);
            favoritesService.toggleFavorite({channelNumber:1})
                .then(() => {
                    $httpBackend.expectPOST('/ipvs/api/smarttv/favorites/channels/v1/remove', {channelNumber:1})
                .respond(200, '');
                    expect(favoritesService.isFavorite({channelNumber:1})).toEqual(true);
                    return favoritesService.toggleFavorite({channelNumber:1});
                })
                .then(() => {
                    expect(favoritesService.isFavorite({channelNumber:1})).toEqual(false);
                    done();
                });

            $httpBackend.flush();
        });
    });
});
