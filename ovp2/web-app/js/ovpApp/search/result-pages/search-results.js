(() => {
    'use strict';

    angular
        .module('ovpApp.search.results', [
            'ovpApp.directives.gridList',
            'ovpApp.search.resultListItem',
            'ovpApp.config'
        ])
        .component('searchResults', {
            templateUrl: '/js/ovpApp/search/result-pages/search-results.html',
            bindings: {
                results: '<',
                query: '<'
            },
            controller: class SearchResultsController {
                /* @ngInject */
                constructor($scope, $stateParams, searchFocusIndex, config, $rootScope, $state) {
                    angular.extend(this, {
                        $scope,
                        $stateParams,
                        searchFocusIndex,
                        config,
                        $rootScope,
                        $state
                    });
                }

                $onInit() {
                    this.limit = this.config.search.fullResultsPerCategory;
                    this.layout = {};
                    this.resultCount = 0;
                    this.filters = [];
                    this.filterIndex = undefined;
                    this.focusFilter = false;
                    this.searchResultsTitle = '';

                    this.initFilters();
                    this.updateResultsTitle();

                    this.focusOnLoad = this.$stateParams.focusOnLoad ?
                        JSON.parse(this.$stateParams.focusOnLoad) : false;
                    this.focusIndex = this.searchFocusIndex.get();

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }

                updateResultsTitle() {
                    if (this.resultCount > 0) {
                        this.searchResultsTitle = `Search for: "${this.query}" (${this.resultCount} results)`;
                    } else {
                        this.searchResultsTitle = `No results matching "${this.query}". Please try another search.`;
                    }
                    this.$scope.$emit('search-results-title', this.searchResultsTitle);
                }

                initFilters() {
                    let desiredFilters = [{
                            resultDisplay: 'Movie',
                            text: 'Movies'
                        }, {
                            resultDisplay: 'Series',
                            text: 'Tv Shows'
                        }
                    ];

                    this.filters = [];

                    desiredFilters.forEach(desired => {
                        let existsInResults = this.results.categories.some(cat =>
                            cat.results.some(asset => asset.resultDisplay === desired.resultDisplay));

                        if (existsInResults) {
                            desired.filterFxn = element => element.resultDisplay === desired.resultDisplay;
                            desired.clickCallback = () => {
                                this.setFilter(desired.filterFxn);
                                // Focus filter on reload
                                this.focusFilter = true;
                            };
                            this.filters.push(desired);
                        }
                    });

                    let filterAll = () => true;
                    if (this.filters.length > 0) {
                        this.filters.unshift({
                            text: 'All',
                            filterFxn: filterAll,
                            clickCallback: () => this.setFilter(filterAll)
                        });
                    }

                    this.setFilter(filterAll);
                }

                getCategoryTitle(category) {
                    return category.title + ' (' + Math.min(this.limit, category.numResults) + ' results)';
                }

                setFilter(filterFxn) {
                    let index = this.filters.findIndex(f => f.filterFxn === filterFxn);
                    if (this.filterIndex !== index) {
                        this.filterIndex = index;
                        this.layout = {
                            categories: []
                        };

                        if (this.results && this.results.categories) {
                            this.results.categories.forEach(category => {
                                let programs = category.results.filter(filterFxn);
                                if (programs.length > 0) {
                                    this.layout.categories.push({
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

                countResults() {
                    if (!this.layout || !this.layout.categories) {
                        return 0;
                    }

                    return this.layout.categories.reduce((a, b) => {
                        return b.numResults ? a + Math.min(this.limit, b.numResults) : a;
                    }, 0);
                }
            }
        });
})();
