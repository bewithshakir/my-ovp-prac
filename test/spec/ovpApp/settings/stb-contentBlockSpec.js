/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.settings.stb.parentalControls', function () {
    'use strict';
    var $q, $rootScope, StbSettingsServiceMock, $componentController, controller;

    beforeEach(module('ovpApp.settings.stb.parentalControls.contentBlock'));
    beforeEach(inject(function (_$q_, _$rootScope_, _StbSettingsService_, _$componentController_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $componentController = _$componentController_;
        StbSettingsServiceMock =  _StbSettingsService_; //This should be the mock;
        controller = $componentController('stbContentBlock', {}, {
            'contentBlock' : [
                'Mild Violence',
                'Violence',
                'Graphic Violence',
                'Adult Situations',
                'Brief Nudity',
                'Nudity',
                'Sexual Situations'
            ]
        });
        controller.$onInit();
    }));

    it('stbContentBlock component', function () {
        StbSettingsServiceMock.updateBlockedContent = () => {
            return $q.resolve();
        };

        controller.contentClicked('Mild Violence');
        expect(controller.blockedContent).toEqual(['Mild Violence']);
        controller.contentClicked('Violence');
        expect(controller.blockedContent).toEqual(['Mild Violence', 'Violence']);
        controller.contentClicked('Graphic Violence');
        expect(controller.blockedContent).toEqual(['Mild Violence', 'Violence', 'Graphic Violence']);
        controller.contentClicked('Graphic Violence');
        expect(controller.blockedContent).toEqual(['Mild Violence', 'Violence']);
        controller.contentClicked('Violence');
        expect(controller.blockedContent).toEqual(['Mild Violence']);
        controller.contentClicked('Mild Violence');
        expect(controller.blockedContent).toEqual([]);
    });

    it('stbContentBlock component - error condition', function (doneFn) {
        StbSettingsServiceMock.updateBlockedContent = () => {
            return $q.reject();
        };

        controller.contentClicked('Mild Violence').then(doneFn, () => {
            expect(controller.blockedContent).toEqual([]);
            doneFn();
        });

        $rootScope.$apply();
    });
});
