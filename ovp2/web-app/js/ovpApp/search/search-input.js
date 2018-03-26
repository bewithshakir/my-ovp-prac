(() => {
    'use strict';
    angular.module('ovpApp.search.input', [
            'ovpApp.search.searchService',
            'rx',
            'ovpApp.components.header.toggler',
            'ovpApp.services.focusMediator'
        ])
        .constant('scheduler', undefined) // unit tests override this
        .component('searchInput', {
            templateUrl: '/js/ovpApp/search/search-input.html',
            controller: class SearchInput {
                /* @ngInject */
                constructor($scope, $rootScope, $state, searchService, config, rx,
                    $q, scheduler, headerToggler, focusMediator, $timeout, searchFocusIndex) {
                    angular.extend(this, {
                        $scope, $rootScope, $state, searchService, config, rx,
                        $q, scheduler, headerToggler, focusMediator, $timeout, searchFocusIndex
                    });
                }

                $onInit() {
                    this.activeIndex = -1;
                    this.placeholder = 'Search for movies, TV shows, and people';
                    this.resetInputAria();
                    this.query = '';
                    this.headerToggler.source.subscribe(isSearchState => {
                        if (!isSearchState) {
                            this.query = '';
                        }
                        if (isSearchState) {
                            if (this.$state.previous && this.$state.previous.name.indexOf('search') !== 0) {
                                this.previousState = this.$state.previous;
                            }
                            this.focusMediator.requestFocus(this.focusMediator.lowPriority)
                                .then(() => this.shouldFocusInput = true);
                        } else {
                            this.shouldFocusInput = false;
                        }
                    });

                    this.queries = this.createQueryObservable();
                    let results = this.resultObservable = this.createResultObservable(this.queries);
                    results.subscribe(result => {
                        this.searchResultsTitle = '';
                        this.clearInputAria();
                        this.searchFocusIndex.reset();
                        if (result.isError) {
                            let params = { error: result.data };
                            this.$state.go('search.error', params);
                        } else {
                            let params = { query: result.rawQuery, results: result.data, focusOnLoad: false};
                            let isQuickSearch = result.stateName.startsWith('search.quickresults');
                            let options = isQuickSearch ? { location: 'replace' } : {};

                            this.$rootScope.$emit('Analytics:searched', {
                                isQuickSearch: isQuickSearch,
                                params: params,
                                queryId: result.data ? result.data.queryId : null,
                                results: result.data ? result.data.results : null
                            });

                            //processSearchResults(result, isQuickSearch);
                            this.$state.go(result.stateName, params, options);
                        }
                    });
                    this.searchResultsTitleListener = this.$rootScope.$on('search-results-title', (event, title) => {
                        // Timeout for screen reader
                        this.$timeout(() => {
                            this.searchResultsTitle = title;
                        }, 1000);
                    });

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }

                $onDestroy() {
                    this.searchResultsTitleListener(); // Remove listner
                }

                resetInputAria() {
                    this.inputLabel = 'Tab for auto complete results, or press ENTER for full search results';
                }

                clearInputAria() {
                    this.inputLabel = '';
                }

                createQueryObservable() {
                    let quickQueries = this.$scope.$toObservable(() => this.query)
                        .map(({ newValue: query }) => this.decorate(query, 'search.quickresults'));
                    let fullQueries = this.rx.createObservableFunction(this, 'search')
                        .map(query => this.decorate(query, 'search.results'));

                    return this.rx.Observable.merge(quickQueries, fullQueries);
                }

                createResultObservable(queries) {
                    return queries
                        .debounce(150, this.scheduler)
                        .filter(this.isQuickSearch) // only the quick searches get debounced
                        .merge(queries.filter(this.isFullSearch)) // full search gets merged in without debouncing
                        .filter(this.isValidSearch.bind(this))
                        .distinctUntilChanged()
                        .flatMapLatest(search => this.doSearch(search));
                }

                decorate(query, stateName) {
                    return {
                        query: this.searchService.stripInvalidCharacters(query),
                        rawQuery: query,
                        stateName: stateName
                    };
                }

                isValidSearch(search) {
                    return !!search.query && search.query.length >= this.config.search.minimumCharacters;
                }

                isQuickSearch(search) {
                    return search.stateName == 'search.quickresults';
                }

                isFullSearch(search) {
                    return search.stateName == 'search.results';
                }

                showLoading(query, observable) {
                    this.$rootScope.$broadcast(
                        'message:loading',
                        this.toPromise(observable),
                        undefined,
                        'Search'
                    );
                }

                toPromise(observable) {
                    // rx has a built in toPromise function, but if the observable
                    //    completes without emitting a value (as happens with our
                    //    .takeUntil() calls), the promise never gets resolved.
                    // This function mimics the built in behavior, but will resolve
                    //    even if no value has been emitted

                    return this.$q(function (resolve, reject) {
                        let value;
                        observable.subscribe(
                            v => value = v,
                            reject,
                            () => resolve(value)
                        );
                    });
                }

                doSearch(search) {
                    this.$rootScope.$emit('Analytics:issue-search');
                    let resultObservable = this.searchService.getComponentResults(search.query)
                        .retry(3)
                        .takeUntil(this.queries)
                        .map(result => angular.extend(search, { isError: false, data: result }))
                        .catch(e => this.rx.Observable.just(angular.extend(search, { isError: true, data: e })))
                        .shareReplay(); // Don't want to kick off an extra request when we show loading spinner

                    if (this.isFullSearch(search)) {
                        this.searchService.saveRecentSearch(search.rawQuery);
                    }

                    this.showLoading(search.rawQuery, resultObservable);

                    return resultObservable;
                }

                onKey(event) {
                    this.$rootScope.$emit('searchInput:key', event);
                    if (event.keyCode === 27) {
                        this.exitSearch();
                    }
                }

                exitSearch() {
                    this.$rootScope.$emit('Analytics:search-exit');
                    this.shouldFocusInput = false;
                    this.searchResultsTitle = '';

                    if (this.previousState && this.previousState.name) {
                        this.$state.go(this.previousState.name, this.previousState.fromParams);
                    } else {
                        this.$state.go('ovp.livetv');
                    }
                    this.$timeout(function () {
                        angular.element('#search-link').focus();
                    }, 0, false);
                }
            }
        });
})();
