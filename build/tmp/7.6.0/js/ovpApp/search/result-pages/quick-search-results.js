'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.search.quickResults', ['ovpApp.search.searchService', 'ovpApp.config', 'ovpApp.filters.titleCase', 'ovpApp.filters.toTrusted', 'ui.router']).constant('columns', 4) // unit tests override this
    .component('quickSearchResults', {
        templateUrl: '/js/ovpApp/search/result-pages/quick-search-results.html',
        bindings: {
            results: '<',
            query: '<'
        },
        controller: (function () {
            /* @ngInject */

            QuickSearchResultsController.$inject = ["searchService", "columns", "$state", "config", "$controller", "$scope", "$element", "$rootScope"];
            function QuickSearchResultsController(searchService, columns, $state, config, $controller, $scope, $element, $rootScope) {
                _classCallCheck(this, QuickSearchResultsController);

                angular.extend(this, {
                    searchService: searchService,
                    columns: columns,
                    $state: $state,
                    config: config,
                    $controller: $controller,
                    $scope: $scope,
                    $element: $element,
                    $rootScope: $rootScope
                });
            }

            _createClass(QuickSearchResultsController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.limit = this.config.search.quickResultsPerColumn;

                    this.layout = {
                        categories: []
                    };

                    this.priorities = ['title'];

                    this.calculateLayout();

                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }
            }, {
                key: 'calculateLayout',
                value: function calculateLayout() {
                    this.layout = {
                        categories: []
                    };
                    if (!this.results || !this.results.categories) {
                        return;
                    }

                    // Every category gets at least one column, but if we aren't filling up
                    // the width, we can allocate additional columns to some categories
                    var categories = this.results.categories,
                        target = Math.ceil(categories.length / this.columns) * this.columns,
                        shortfall = target - categories.length,
                        recipient;

                    categories.forEach((function (category) {
                        category.columns = 1;
                        this.layout.categories.push(category);
                    }).bind(this));

                    while (shortfall > 0) {
                        recipient = this.getColumnRecipient(categories);
                        if (!recipient) {
                            // Everything has as many columns as it can use
                            break;
                        } else {
                            recipient.columns++;
                            shortfall--;
                        }
                    }

                    categories.forEach((function (category) {
                        category['class'] = 'search-results-group col-' + category.columns;
                        category.resultsToshow = Math.min(category.numResults, this.limit * category.columns);
                    }).bind(this));
                }
            }, {
                key: 'getColumnRecipient',
                value: function getColumnRecipient(categories) {
                    return this.byPriority(categories) || this.byNeed(categories);
                }
            }, {
                key: 'byPriority',
                value: function byPriority(categories) {
                    var i,
                        p,
                        bestp = Number.MAX_VALUE,
                        recipient;
                    for (i = 0; i < categories.length; i++) {
                        p = this.priorities.indexOf(categories[i].title.toLowerCase());
                        if (p > -1 && p < bestp && this.canExpand(categories[i])) {
                            recipient = categories[i];
                            bestp = p;
                        }
                    }
                    return recipient;
                }
            }, {
                key: 'byNeed',
                value: function byNeed(categories) {
                    var i,
                        score,
                        highscore = 0,
                        recipient;
                    for (i = 0; i < categories.length; i++) {
                        if (this.canExpand(categories[i])) {
                            score = this.need(categories[i]);
                        } else {
                            score = 0; // don't expand a category that is at the max
                        }

                        if (score > highscore) {
                            highscore = score;
                            recipient = categories[i];
                        }
                    }

                    return recipient;
                }
            }, {
                key: 'need',
                value: function need(category) {
                    return category.numResults - category.columns * this.limit;
                }
            }, {
                key: 'canExpand',
                value: function canExpand(category) {
                    return this.need(category) > 0 && category.columns < this.columns;
                }
            }, {
                key: 'click',
                value: function click(item) {
                    this.$rootScope.$emit('Analytics:search-select-item', {
                        asset: item,
                        generateSelectContent: true
                    });
                    var route = item.clickRoute;
                    if (route) {
                        var _$state;

                        if (route[0] && route[0].startsWith('search.results')) {
                            route[1] = route[1] || {};
                            route[1].focusOnLoad = true;
                        }
                        (_$state = this.$state).go.apply(_$state, _toConsumableArray(route));
                    }
                }

                //isCategory {boolean} indicates that the key down was on the category
            }, {
                key: 'onKeydown',
                value: function onKeydown(event, category, index, isCategory) {

                    var categories = this.layout.categories,
                        searchCategoryElements = this.$element.find('.' + category['class'].split(' ')[0]),
                        keys = { left: 37, up: 38, right: 39, down: 40, tab: 9 },
                        currentCategoryIndex = categories.map(function (e) {
                        return e.title;
                    }).indexOf(category.title),
                        elementToFocus = undefined;

                    if (event.keyCode === keys.tab) {
                        searchCategoryElements[currentCategoryIndex].focus();
                        // Deliberately let the key event bubble up so that it can move to the next category
                    }

                    if (!isCategory) {
                        //key down happened on the item
                        if (event.keyCode === keys.down || event.keyCode === keys.right) {
                            if (index + 1 !== this.limit * category.columns) {
                                elementToFocus = angular.element(searchCategoryElements[currentCategoryIndex]).find('.search-result')[index + 1];
                            } else {
                                elementToFocus = angular.element(searchCategoryElements[currentCategoryIndex]).find('.search-result')[0];
                            }
                        } else if (event.keyCode === keys.up || event.keyCode === keys.left) {
                            if (index !== 0) {
                                elementToFocus = angular.element(searchCategoryElements[currentCategoryIndex]).find('.search-result')[index - 1];
                            }
                        }
                    } else if (isCategory) {
                        //From the category we need to move to the first element.
                        if (event.keyCode === keys.down || event.keyCode === keys.right) {
                            elementToFocus = angular.element(searchCategoryElements[currentCategoryIndex]).find('.search-result')[0];
                        }
                    }
                    if (elementToFocus) {
                        event.preventDefault();
                        elementToFocus.focus();
                        //We found something and set focus. Let us not propagate this key
                        event.stopPropagation();
                    }
                }
            }]);

            return QuickSearchResultsController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/search/result-pages/quick-search-results.js.map
