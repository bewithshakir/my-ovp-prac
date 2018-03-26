/* globals window */

xdescribe('search router', function () {
    'use strict';

    var $q,
        $state,
        $stateParams,
        searchService,
        uiRouterTester,
        $httpBackend;

    beforeEach(module('ovpApp.search.router'));
    beforeEach(module('ovpApp.search.searchService'));

    beforeEach(inject(function ($rootScope, $injector, _$q_, _$state_,
        _$stateParams_, _searchService_, _$httpBackend_) {
        $q = _$q_;
        $state = _$state_;
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;

        uiRouterTester = new UiRouterTester($injector);
        searchService = _searchService_;
    }));

    describe('basic routes', function () {
        describe('parent', function () {
            it('should not go to abstract parent search state', function () {
                uiRouterTester.goTo('/search');
                expect($state.current.name).toEqual('');
            });

            it('should be abstract', function () {
                var route = $state.get('search');

                expect(route.abstract).toEqual(true);
            });

            it('should be able to browse backwards to the ' +
               'app running before search started', function () {
                $httpBackend.whenGET('/js/ovpApp/search/quick-search-results.html')
                    .respond(200, {});
                uiRouterTester.goTo('/search/term/something');

                window.history.back();

                expect($state.current.name).toEqual('');
            });
        });

        describe('quick results', function () {
            it('should go to quick results state', function () {
                $httpBackend.whenGET('/js/ovpApp/search/quick-search-results.html')
                    .respond(200, {});
                uiRouterTester.goTo('/search/term/somesearchterm');

                expect($state.current.name).toEqual('state.quickresults');
            });

            it('should be child of parent state', function () {
                var parent = $state.get('search.quickresults');

                expect(parent.name).toEqual('search');
            });

            it('should have term param', function () {
                uiRouterTester.goTo('/search/term/somesearchterm');

                // I'm not positive this is going to work. Not sure if $stateParams
                // will have updated
                expect($stateParams.term).toEqual('somesearchterm');
            });

            it('should clear and cancel search quick results', function () {
                jasmine.spyOn(searchService, 'abortAll');

                uiRouterTester.goTo('/search/term/somesearchterm');
                uiRouterTester.goTo('/livetv');

                expect(searchService.abortAll).toHaveBeenCalled();
            });

            it('should cancel fetch when another search is executed', function () {
                jasmine.spyOn(searchService, 'abortAll');

                uiRouterTester.goTo('/search/term/somesearchterm');
                uiRouterTester.goTo('/search/term/othersearchterm');

                expect(searchService.abortAll).toHaveBeenCalled();

                uiRouterTester.goTo('/search/result/someresulturi');

                expect(searchService.abortAll).toHaveBeenCalled();

                uiRouterTester.goTo('/search/term/othersearchterm');

                expect(searchService.abortAll).toHaveBeenCalled();
            });
        });

        describe('results', function () {
            it('should go to results state', function () {
                uiRouterTester.goTo('/search/result/someresulturi');
                expect($state.current.name).toEqual('state.results');
            });

            it('should be child of parent state', function () {
                var parent = $state.get('search.results');

                expect(parent.name).toEqual('search');
            });

            it('should have result uri param', function () {
                uiRouterTester.goTo('/search/result/http://some.nns.uri.com');

                // I'm not positive this is going to work. Not sure if $stateParams
                // will have updated
                expect($stateParams.uri).toEqual('http://some.nns.uri.com');
            });

            it('should clear and cancel search results', function () {
                jasmine.spyOn(searchService, 'abortAll');

                uiRouterTester.goTo('/search/result/http://some.nns.uri.com');
                uiRouterTester.goTo('/livetv');

                expect(searchService.abortAll).toHaveBeenCalled();
            });

            it('should have grid and list view', function () {
                var state = $state.get('search.results');

                expect(state.views.list).toBeDefined();
                expect(state.views.grid).toBeDefined();
            });
        });
    });

    describe('resolves', inject(function ($rootScope) {
        describe('states with w/o views', function () {
            it('quick results', function () {
                jasmine.spyOn(searchService, 'getQuickResults').and.callFake(function () {
                    return $q.when('something');
                });
                var onResolved = jasmine.createSpy();

                uiRouterTester.resolve('quickResults').forStateAndView('search.quickResults').then(onResolved);

                $rootScope.$apply();
                expect(onResolved).toHaveBeenCalledWith('something');
            });
        });

        describe('states w/views', function () {
            it('results list', function () {
                jasmine.spyOn(searchService, 'getResults').and.callFake(function () {
                    return $q.when('something');
                });
                var onResolved = jasmine.createSpy();

                uiRouterTester.resolve('results')
                    .forStateAndView('search.results', 'list@search.results').then(onResolved);

                $rootScope.$apply();
                expect(onResolved).toHaveBeenCalledWith('something');
            });

            it('results grid', function () {
                jasmine.spyOn(searchService, 'getResults').and.callFake(function () {
                    return $q.when('something');
                });
                var onResolved = jasmine.createSpy();

                uiRouterTester.resolve('results')
                    .forStateAndView('search.results', 'grid@search.results').then(onResolved);

                $rootScope.$apply();
                expect(onResolved).toHaveBeenCalledWith('something');
            });
        });
    }));
});
