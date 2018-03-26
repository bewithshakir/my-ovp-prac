/* globals inject */
/* jshint jasmine: true */
describe('ovpApp.product.series', function () {
    'use strict';

    var $scope, controller, $controller, rx, $state;

    beforeEach(module('ovpApp.product.series'));
    beforeEach(module('rx'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _rx_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        rx = _rx_;
        controller = $controller('ProductSeriesController', {
            $scope: $scope,
            series: {},
            searchService: {getRelatedByTmsSeriesId: () => rx.Observable.empty()},
            delegateFactory: {createInstance: () => {return {}}},
            productService: {},
            productActionService: {},
            context: '',
            blocked: false,
            $state: {
                previous: {name: ''}, 
                go: () => {}
            },
            $stateParams: {
                tmsProgramId: 2
            },
            locationService: {getLocation: () => { return {then: () => {}}; }}
        });
    }));
});
