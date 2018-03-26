(() => {
    'use strict';
    angular.module('ovpApp.search.recentSearches', [
        'ovpApp.search.searchService',
        'ovpApp.filters.titleCase',
        'ui.router'
        ])
        .component('recentSearches', {
            templateUrl: '/js/ovpApp/search/result-pages/recent-searches.html',
            bindings: {},
            controller: class RecentSearchesController {
                /* @ngInject */
                constructor(searchService, $state, $rootScope) {
                    this.$state = $state;
                    this.$rootScope = $rootScope;
                    this.searchService = searchService;
                }

                $onInit() {
                    this.activeIndex = -1;
                    this.recentSearches = [...this.searchService.getRecentSearches()];

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }

                onKey(event) {
                    event.preventDefault();
                    if (event.keyCode == 38) {
                        // up
                        if (this.activeIndex === -1) {
                            this.selectRecent(this.recentSearches.length - 1);
                        } else {
                            this.selectRecent(Math.max(0, this.activeIndex - 1));
                        }

                    } else if (event.keyCode == 40) {
                        // down
                        if (this.activeIndex + 1 >= this.recentSearches.length) {
                            this.activeIndex = -1;
                            angular.element('.search-clear').focus();
                        } else if (this.activeIndex === -1) {
                            angular.noop();
                        } else {
                            this.selectRecent(Math.min(this.recentSearches.length - 1, this.activeIndex + 1));
                        }

                    } else if (event.keyCode == 13) {
                        // enter
                        if (this.activeIndex >= 0) {
                            this.click(this.recentSearches[this.activeIndex]);
                        } else if (this.activeIndex === -1) {
                            this.clear();
                        }
                    } else if (event.keyCode == 9) {
                        // tab
                        this.activeIndex = -1;
                    }
                }

                isActiveElement(index) {
                    return index === this.activeIndex;
                }

                selectRecent(index) {
                    this.activeIndex = index;
                }

                click(recent) {
                    let promise = this.$state.go('search.results', {query: recent,
                        focusOnLoad: true, isRecentSearch: true});
                    this.showLoading(promise);
                    this.searchService.saveRecentSearch(recent); // to move it to the top of the list
                }

                clear() {
                    this.recentSearches = [];
                    this.searchService.clearRecentSearches();
                    angular.element('input#query').focus();
                }

                showLoading(promise) {
                    this.recentSearches = [];
                    this.$rootScope.$broadcast(
                        'message:loading',
                        promise,
                        'Recent Searches'
                    );
                }
            }
        });
})();
