/* globals inject */
/* jshint jasmine: true */

describe('search results', function () {
    'use strict';

    var $componentController, $rootScope;

    beforeEach(module('ovpApp.search.results'));

    beforeEach(module(function ($provide) {
        $provide.value('$stateParams', {});
        $provide.value('searchFocusIndex', {
            set: angular.noop,
            get: () => { return {}; },
            reset: angular.noop
        });
        $provide.value('$state', {
            current: {}
        });
    }));

    beforeEach(inject(function (_$rootScope_, _$componentController_) {
        $componentController = _$componentController_;
        $rootScope = _$rootScope_;
    }));

    describe('initFilters', function () {
        it('should have filters for all, movie, and series', function () {
            var ctrl = $componentController('searchResults', {
                $scope: $rootScope.$new()
            }, {
                results: {
                    categories: [{
                        results: [{
                            resultDisplay: 'Movie'
                        }, {
                            resultDisplay: 'Series'
                        }, {
                            resultDisplay: 'Other'
                        }]
                    }]
                },
                query: ''
            });

            ctrl.initFilters();

            expect(ctrl.filters.length).toEqual(3);
            expect(ctrl.filters[0].text).toEqual('All');
            expect(ctrl.filters[1].text).toEqual('Movies');
            expect(ctrl.filters[2].text).toEqual('Tv Shows');
        });

        it('should omit movies if there are no movies', function () {
            var ctrl = $componentController('searchResults', {
                $scope: $rootScope.$new()
            }, {
                results: {
                    categories: [{
                        results: [{
                            resultDisplay: 'Series'
                        }, {
                            resultDisplay: 'Other'
                        }]
                    }]
                },
                query: ''
            });

            ctrl.initFilters();

            expect(ctrl.filters.length).toEqual(2);
            expect(ctrl.filters[0].text).toEqual('All');
            expect(ctrl.filters[1].text).toEqual('Tv Shows');
        });

        it('should omit tv shows if there are no tv shows', function () {
            var ctrl = $componentController('searchResults', {
                $scope: $rootScope.$new()
            }, {
                results: {
                    categories: [{
                        results: [{
                            resultDisplay: 'Movie'
                        }, {
                            resultDisplay: 'Other'
                        }]
                    }]
                },
                query: ''
            });

            ctrl.initFilters();

            expect(ctrl.filters.length).toEqual(2);
            expect(ctrl.filters[0].text).toEqual('All');
            expect(ctrl.filters[1].text).toEqual('Movies');
        });

        it('should omit everything if there are no tv shows nor movies', function () {
            var ctrl = $componentController('searchResults', {
                $scope: $rootScope.$new()
            }, {
                results: {
                    categories: [{
                        results: [{
                            resultDisplay: 'Other'
                        }]
                    }]
                },
                query: ''
            });

            ctrl.initFilters();

            expect(ctrl.filters.length).toEqual(0);
        });
    });
});
