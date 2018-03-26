'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.search.results', ['ovpApp.directives.gridList', 'ovpApp.search.resultListItem', 'ovpApp.config']).component('searchResults', {
        templateUrl: '/js/ovpApp/search/result-pages/search-results.html',
        bindings: {
            results: '<',
            query: '<'
        },
        controller: (function () {
            /* @ngInject */

            SearchResultsController.$inject = ["$scope", "$stateParams", "searchFocusIndex", "config", "$rootScope", "$state"];
            function SearchResultsController($scope, $stateParams, searchFocusIndex, config, $rootScope, $state) {
                _classCallCheck(this, SearchResultsController);

                angular.extend(this, {
                    $scope: $scope,
                    $stateParams: $stateParams,
                    searchFocusIndex: searchFocusIndex,
                    config: config,
                    $rootScope: $rootScope,
                    $state: $state
                });
            }

            _createClass(SearchResultsController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.limit = this.config.search.fullResultsPerCategory;
                    this.layout = {};
                    this.resultCount = 0;
                    this.filters = [];
                    this.filterIndex = undefined;
                    this.focusFilter = false;
                    this.searchResultsTitle = '';

                    this.initFilters();
                    this.updateResultsTitle();

                    this.focusOnLoad = this.$stateParams.focusOnLoad ? JSON.parse(this.$stateParams.focusOnLoad) : false;
                    this.focusIndex = this.searchFocusIndex.get();

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: 'updateResultsTitle',
                value: function updateResultsTitle() {
                    if (this.resultCount > 0) {
                        this.searchResultsTitle = 'Search for: "' + this.query + '" (' + this.resultCount + ' results)';
                    } else {
                        this.searchResultsTitle = 'No results matching "' + this.query + '". Please try another search.';
                    }
                    this.$scope.$emit('search-results-title', this.searchResultsTitle);
                }
            }, {
                key: 'initFilters',
                value: function initFilters() {
                    var _this = this;

                    var desiredFilters = [{
                        resultDisplay: 'Movie',
                        text: 'Movies'
                    }, {
                        resultDisplay: 'Series',
                        text: 'Tv Shows'
                    }];

                    this.filters = [];

                    desiredFilters.forEach(function (desired) {
                        var existsInResults = _this.results.categories.some(function (cat) {
                            return cat.results.some(function (asset) {
                                return asset.resultDisplay === desired.resultDisplay;
                            });
                        });

                        if (existsInResults) {
                            desired.filterFxn = function (element) {
                                return element.resultDisplay === desired.resultDisplay;
                            };
                            desired.clickCallback = function () {
                                _this.setFilter(desired.filterFxn);
                                // Focus filter on reload
                                _this.focusFilter = true;
                            };
                            _this.filters.push(desired);
                        }
                    });

                    var filterAll = function filterAll() {
                        return true;
                    };
                    if (this.filters.length > 0) {
                        this.filters.unshift({
                            text: 'All',
                            filterFxn: filterAll,
                            clickCallback: function clickCallback() {
                                return _this.setFilter(filterAll);
                            }
                        });
                    }

                    this.setFilter(filterAll);
                }
            }, {
                key: 'getCategoryTitle',
                value: function getCategoryTitle(category) {
                    return category.title + ' (' + Math.min(this.limit, category.numResults) + ' results)';
                }
            }, {
                key: 'setFilter',
                value: function setFilter(filterFxn) {
                    var _this2 = this;

                    var index = this.filters.findIndex(function (f) {
                        return f.filterFxn === filterFxn;
                    });
                    if (this.filterIndex !== index) {
                        this.filterIndex = index;
                        this.layout = {
                            categories: []
                        };

                        if (this.results && this.results.categories) {
                            this.results.categories.forEach(function (category) {
                                var programs = category.results.filter(filterFxn);
                                if (programs.length > 0) {
                                    _this2.layout.categories.push({
                                        title: category.title,
                                        results: programs,
                                        numResults: programs.length
                                    });
                                }
                            });
                        }

                        this.resultCount = this.countResults();
                    }
                }
            }, {
                key: 'countResults',
                value: function countResults() {
                    var _this3 = this;

                    if (!this.layout || !this.layout.categories) {
                        return 0;
                    }

                    return this.layout.categories.reduce(function (a, b) {
                        return b.numResults ? a + Math.min(_this3.limit, b.numResults) : a;
                    }, 0);
                }
            }]);

            return SearchResultsController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/search/result-pages/search-results.js.map
