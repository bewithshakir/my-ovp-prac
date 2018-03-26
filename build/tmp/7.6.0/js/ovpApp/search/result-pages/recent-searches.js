'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.search.recentSearches', ['ovpApp.search.searchService', 'ovpApp.filters.titleCase', 'ui.router']).component('recentSearches', {
        templateUrl: '/js/ovpApp/search/result-pages/recent-searches.html',
        bindings: {},
        controller: (function () {
            /* @ngInject */

            RecentSearchesController.$inject = ["searchService", "$state", "$rootScope"];
            function RecentSearchesController(searchService, $state, $rootScope) {
                _classCallCheck(this, RecentSearchesController);

                this.$state = $state;
                this.$rootScope = $rootScope;
                this.searchService = searchService;
            }

            _createClass(RecentSearchesController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.activeIndex = -1;
                    this.recentSearches = [].concat(_toConsumableArray(this.searchService.getRecentSearches()));

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: 'onKey',
                value: function onKey(event) {
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
            }, {
                key: 'isActiveElement',
                value: function isActiveElement(index) {
                    return index === this.activeIndex;
                }
            }, {
                key: 'selectRecent',
                value: function selectRecent(index) {
                    this.activeIndex = index;
                }
            }, {
                key: 'click',
                value: function click(recent) {
                    var promise = this.$state.go('search.results', { query: recent,
                        focusOnLoad: true, isRecentSearch: true });
                    this.showLoading(promise);
                    this.searchService.saveRecentSearch(recent); // to move it to the top of the list
                }
            }, {
                key: 'clear',
                value: function clear() {
                    this.recentSearches = [];
                    this.searchService.clearRecentSearches();
                    angular.element('input#query').focus();
                }
            }, {
                key: 'showLoading',
                value: function showLoading(promise) {
                    this.recentSearches = [];
                    this.$rootScope.$broadcast('message:loading', promise, 'Recent Searches');
                }
            }]);

            return RecentSearchesController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/search/result-pages/recent-searches.js.map
