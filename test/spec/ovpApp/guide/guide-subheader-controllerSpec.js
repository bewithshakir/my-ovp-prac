/* globals localStorage, window, spyOn */
describe('GuideSubheaderController', function () {
    'use strict';
    var scope, rootScope, ctrl, $q, mockFn, $httpBackend;

    window.spyFn = function () {};

    var testFilter = {
        id: 1,
        title: 'test',
        label: 'TEST',
        filter: function () {}
    };

    beforeEach(module('ovpApp.guide'));
    beforeEach(module(function ($provide) {
        /*
            Mock functions with embeded spys, to ensure the popups get created
            and shown
         */
        mockFn = {
            ConfirmPopup: function (options) {
                spyFn(options);
                this.show = function () {};
            }
        };
        $provide.value('ConfirmPopup', mockFn.ConfirmPopup);
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function ($controller, $injector, $rootScope, _$q_, _$httpBackend_) {
        localStorage.clear();
        rootScope = $rootScope;
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        ctrl = $controller('GuideSubheaderController', {
            $scope: scope,
            loadingDefer: $q.defer()
        });
    }));

    afterEach(function () {
        rootScope = null;
        scope = null;
        ctrl = null;
    });

    it('should return first filter preset', function () {
        scope.$apply();
        expect(ctrl.presets.length).not.toEqual(0);
    });

    it('should respond to the `guide:timeScroll` event', function () {
        ctrl.times = [0, 1, 2, 3, 4];
        rootScope.$broadcast('guide:timeScroll', 2);
        expect(ctrl.timeIndex).toEqual(4);
        expect(ctrl.guideTime).toEqual(4);
    });

    it('jumpToDay should brodcast guide:timejump', function () {
        spyOn(rootScope, '$broadcast');
        ctrl.jumpToDay();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('guide:timejump', undefined);
    });

    it('goToNow should brodcast guide:timejump', function () {
        ctrl.times = [1];
        spyOn(rootScope, '$broadcast');
        ctrl.goToNow();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('guide:timejump', 1);
    });

    it('onDateToggle should toggle showDate', function () {
        ctrl.onDateToggle(true);
        expect(ctrl.showDate).toEqual(true);
        ctrl.onDateToggle(false);
        expect(ctrl.showDate).toEqual(false);
    });

    it('setPresetFilter should set the current filter and broadcast guide:updateFilter', function () {
        spyOn(rootScope, '$broadcast');
        ctrl.setPresetFilter(testFilter);
        expect(ctrl.filters.preset).toEqual(testFilter);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('guide:updateFilter', ctrl.filters);
    });
});
