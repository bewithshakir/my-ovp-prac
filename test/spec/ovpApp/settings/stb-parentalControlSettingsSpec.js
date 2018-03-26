/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.settings.stb.parentalControls', function () {
    'use strict';
    var $q, $rootScope, StbSettingsServiceMock, $componentController, controller;

    beforeEach(module('ovpApp.settings.stb.parentalControls.allowedRatings'));
    beforeEach(inject(function (_$q_, _$rootScope_, _StbSettingsService_, _$componentController_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $componentController = _$componentController_;
        StbSettingsServiceMock =  _StbSettingsService_; //This should be the mock;
        controller = $componentController('stbAllowedRatings', {}, {
            ratings: [
                    'Not Rated',
                    'TV-Y',
                    'TV-Y7',
                    'TV-G',
                    'TV-PG',
                    'TV-14',
                    'TV-MA',
                    'G',
                    'PG',
                    'PG-13',
                    'R',
                    'NC-17',
                    'ADULT'
            ]
        });
        controller.$onInit();
    }));

    it('stbAllowedRatings component', function () {
        StbSettingsServiceMock.updateBlockedRatings = () => {
            return $q.resolve();
        };

        controller.ratingClicked('TV-PG');
        expect(controller.blockedRatings).toEqual(['TV-PG']);
        controller.ratingClicked('TV-14');
        expect(controller.blockedRatings).toEqual(['TV-PG', 'TV-14']);
        controller.ratingClicked('TV-G');
        expect(controller.blockedRatings).toEqual(['TV-PG', 'TV-14', 'TV-G']);
        controller.ratingClicked('TV-14');
        expect(controller.blockedRatings).toEqual(['TV-PG', 'TV-G']);
        controller.ratingClicked('TV-PG');
        expect(controller.blockedRatings).toEqual(['TV-G']);
        controller.ratingClicked('TV-G');
        expect(controller.blockedRatings).toEqual([]);
    });

    it('stbAllowedRatings component - error condition', function (doneFn) {
        StbSettingsServiceMock.updateBlockedRatings = () => {
            return $q.reject();
        };

        controller.ratingClicked('TV-PG').then(doneFn, () => {
            expect(controller.blockedRatings).toEqual([]);
            doneFn();
        });

        $rootScope.$apply();
    });
});
