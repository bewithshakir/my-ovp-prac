describe('ovpApp.playerControls.miniGuideData', function () {

    let el, scope, controller;

    beforeEach(module('ovpApp.playerControls.miniGuide'));

    beforeEach(module(function($provide) {

    }));

    beforeEach(inject(function ($compile, $rootScope) {
        el = angular.element('<mini-guide></miniguide>');
        $compile(el)($rootScope.$new());
        $rootScope.$digest();

        controller = el.controller('miniGuide')

        scope = el.isolateScope() || el.scope();
    }));
});
