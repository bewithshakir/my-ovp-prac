'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.search.input', ['ovpApp.search.searchService', 'rx', 'ovpApp.components.header.toggler', 'ovpApp.services.focusMediator']).constant('scheduler', undefined) // unit tests override this
    .component('searchInput', {
        templateUrl: '/js/ovpApp/search/search-input.html',
        controller: (function () {
            /* @ngInject */

            SearchInput.$inject = ["$scope", "$rootScope", "$state", "searchService", "config", "rx", "$q", "scheduler", "headerToggler", "focusMediator", "$timeout", "searchFocusIndex"];
            function SearchInput($scope, $rootScope, $state, searchService, config, rx, $q, scheduler, headerToggler, focusMediator, $timeout, searchFocusIndex) {
                _classCallCheck(this, SearchInput);

                angular.extend(this, {
                    $scope: $scope, $rootScope: $rootScope, $state: $state, searchService: searchService, config: config, rx: rx,
                    $q: $q, scheduler: scheduler, headerToggler: headerToggler, focusMediator: focusMediator, $timeout: $timeout, searchFocusIndex: searchFocusIndex
                });
            }

            _createClass(SearchInput, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.activeIndex = -1;
                    this.placeholder = 'Search for movies, TV shows, and people';
                    this.resetInputAria();
                    this.query = '';
                    this.headerToggler.source.subscribe(function (isSearchState) {
                        if (!isSearchState) {
                            _this.query = '';
                        }
                        if (isSearchState) {
                            if (_this.$state.previous && _this.$state.previous.name.indexOf('search') !== 0) {
                                _this.previousState = _this.$state.previous;
                            }
                            _this.focusMediator.requestFocus(_this.focusMediator.lowPriority).then(function () {
                                return _this.shouldFocusInput = true;
                            });
                        } else {
                            _this.shouldFocusInput = false;
                        }
                    });

                    this.queries = this.createQueryObservable();
                    var results = this.resultObservable = this.createResultObservable(this.queries);
                    results.subscribe(function (result) {
                        _this.searchResultsTitle = '';
                        _this.clearInputAria();
                        _this.searchFocusIndex.reset();
                        if (result.isError) {
                            var params = { error: result.data };
                            _this.$state.go('search.error', params);
                        } else {
                            var params = { query: result.rawQuery, results: result.data, focusOnLoad: false };
                            var isQuickSearch = result.stateName.startsWith('search.quickresults');
                            var options = isQuickSearch ? { location: 'replace' } : {};

                            _this.$rootScope.$emit('Analytics:searched', {
                                isQuickSearch: isQuickSearch,
                                params: params,
                                queryId: result.data ? result.data.queryId : null,
                                results: result.data ? result.data.results : null
                            });

                            //processSearchResults(result, isQuickSearch);
                            _this.$state.go(result.stateName, params, options);
                        }
                    });
                    this.searchResultsTitleListener = this.$rootScope.$on('search-results-title', function (event, title) {
                        // Timeout for screen reader
                        _this.$timeout(function () {
                            _this.searchResultsTitle = title;
                        }, 1000);
                    });

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.searchResultsTitleListener(); // Remove listner
                }
            }, {
                key: 'resetInputAria',
                value: function resetInputAria() {
                    this.inputLabel = 'Tab for auto complete results, or press ENTER for full search results';
                }
            }, {
                key: 'clearInputAria',
                value: function clearInputAria() {
                    this.inputLabel = '';
                }
            }, {
                key: 'createQueryObservable',
                value: function createQueryObservable() {
                    var _this2 = this;

                    var quickQueries = this.$scope.$toObservable(function () {
                        return _this2.query;
                    }).map(function (_ref) {
                        var query = _ref.newValue;
                        return _this2.decorate(query, 'search.quickresults');
                    });
                    var fullQueries = this.rx.createObservableFunction(this, 'search').map(function (query) {
                        return _this2.decorate(query, 'search.results');
                    });

                    return this.rx.Observable.merge(quickQueries, fullQueries);
                }
            }, {
                key: 'createResultObservable',
                value: function createResultObservable(queries) {
                    var _this3 = this;

                    return queries.debounce(150, this.scheduler).filter(this.isQuickSearch) // only the quick searches get debounced
                    .merge(queries.filter(this.isFullSearch)) // full search gets merged in without debouncing
                    .filter(this.isValidSearch.bind(this)).distinctUntilChanged().flatMapLatest(function (search) {
                        return _this3.doSearch(search);
                    });
                }
            }, {
                key: 'decorate',
                value: function decorate(query, stateName) {
                    return {
                        query: this.searchService.stripInvalidCharacters(query),
                        rawQuery: query,
                        stateName: stateName
                    };
                }
            }, {
                key: 'isValidSearch',
                value: function isValidSearch(search) {
                    return !!search.query && search.query.length >= this.config.search.minimumCharacters;
                }
            }, {
                key: 'isQuickSearch',
                value: function isQuickSearch(search) {
                    return search.stateName == 'search.quickresults';
                }
            }, {
                key: 'isFullSearch',
                value: function isFullSearch(search) {
                    return search.stateName == 'search.results';
                }
            }, {
                key: 'showLoading',
                value: function showLoading(query, observable) {
                    this.$rootScope.$broadcast('message:loading', this.toPromise(observable), undefined, 'Search');
                }
            }, {
                key: 'toPromise',
                value: function toPromise(observable) {
                    // rx has a built in toPromise function, but if the observable
                    //    completes without emitting a value (as happens with our
                    //    .takeUntil() calls), the promise never gets resolved.
                    // This function mimics the built in behavior, but will resolve
                    //    even if no value has been emitted

                    return this.$q(function (resolve, reject) {
                        var value = undefined;
                        observable.subscribe(function (v) {
                            return value = v;
                        }, reject, function () {
                            return resolve(value);
                        });
                    });
                }
            }, {
                key: 'doSearch',
                value: function doSearch(search) {
                    var _this4 = this;

                    this.$rootScope.$emit('Analytics:issue-search');
                    var resultObservable = this.searchService.getComponentResults(search.query).retry(3).takeUntil(this.queries).map(function (result) {
                        return angular.extend(search, { isError: false, data: result });
                    })['catch'](function (e) {
                        return _this4.rx.Observable.just(angular.extend(search, { isError: true, data: e }));
                    }).shareReplay(); // Don't want to kick off an extra request when we show loading spinner

                    if (this.isFullSearch(search)) {
                        this.searchService.saveRecentSearch(search.rawQuery);
                    }

                    this.showLoading(search.rawQuery, resultObservable);

                    return resultObservable;
                }
            }, {
                key: 'onKey',
                value: function onKey(event) {
                    this.$rootScope.$emit('searchInput:key', event);
                    if (event.keyCode === 27) {
                        this.exitSearch();
                    }
                }
            }, {
                key: 'exitSearch',
                value: function exitSearch() {
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
            }]);

            return SearchInput;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/search/search-input.js.map
