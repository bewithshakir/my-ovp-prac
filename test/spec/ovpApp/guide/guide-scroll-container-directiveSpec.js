describe('GuideScrollContainerController', function() {

    beforeEach(module('ovpApp.guide'));

    var scope, rootScope, ctrl;

    beforeEach(inject(function($controller, $injector, $rootScope) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        ctrl = $controller('GuideScrollContainerController', { $scope: scope });
    }));

    it('setZoneSize should emit guide:zonesize event', function() {
        spyOn(scope, '$emit');
        ctrl.setZoneSize(1, 2, 3, 4, 5, 6);
        expect(scope.$emit).toHaveBeenCalledWith('guide:zonesize', 1, 2);
    });

    it('getPixelsPerHour should return pixels per hour', function() {
        ctrl.setZoneSize(1, 2, 3, 4, 5, 6);
        expect(ctrl.getPixelsPerHour()).toEqual(4);
    });

    it('getZones should return valid zone value', function() {
        ctrl.setZoneSize(1, 2, 3, 4, 5, 6);
        expect(ctrl.getZones(10, 10)).toEqual([[1, 3], [2, 7], [2, 3], [1, 7]]);
    });

    it('calculateVelocity should return valid velocity', function() {
        expect(ctrl.calculateVelocity(1, 1, 10, 10)).toEqual(1000);
        expect(ctrl.calculateVelocity(0, 1, 10, 10)).toEqual(0);
    });
});
