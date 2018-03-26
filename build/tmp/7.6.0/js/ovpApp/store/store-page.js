'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.store', ['ovpApp.config', 'ui.router', 'ovpApp.services.store', 'ovpApp.services.homePage', 'ovpApp.services.bookmark', 'ovpApp.legacy.stringUtil']).component('storePage', {
        templateUrl: '/js/ovpApp/store/store-page.html',
        bindings: {
            page: '<',
            category: '<'
        },
        controller: (function () {
            /* @ngInject */

            Store.$inject = ["$rootScope", "StoreService", "$state", "homePage", "BookmarkService", "config", "stringUtil"];
            function Store($rootScope, StoreService, $state, homePage, BookmarkService, config, stringUtil) {
                _classCallCheck(this, Store);

                this.$rootScope = $rootScope;
                this.StoreService = StoreService;
                this.$state = $state;
                this.homePage = homePage;
                this.BookmarkService = BookmarkService;
                this.config = config;
                this.stringUtil = stringUtil;
            }

            _createClass(Store, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.page = this.page || 1;
                    this.carouselLimit = 8;
                    this.itemOptions = {
                        enableRemove: false,
                        showRentalInfo: true,
                        hideNWLogo: true
                    };
                    this.storeCarouselConfig = {
                        emptyMessage: 'Store is empty!'
                    };
                    this.gridConfig = {
                        defaultState: 'grid',
                        title: '',
                        showToggle: false,
                        id: 'vodMinorCategoryViewMode',
                        useLocalStorage: true
                    };

                    this.errorMessage = false;

                    this.homePage().then(this.storeTitleCallback.bind(this), this.storeTitleCallback.bind(this));
                    var promise,
                        limit = this.config.vodAssetsPerPage,
                        startIndex = (this.page - 1) * limit;
                    if (this.category) {
                        this.categories = null;
                        promise = this.StoreService.getCategory(this.category, startIndex, limit).then(function (cat) {
                            var category = cat;

                            if (category.total_results < startIndex) {
                                _this.onPageChanged(1);
                                return;
                            }

                            _this.results = category.results;

                            // Angular watches the object reference for changes,
                            // not the object's properties. So create a new copy to
                            // force angular to register a change on the config.
                            _this.gridConfig = angular.copy(_this.gridConfig);
                            _this.gridConfig.title = category.name;
                            _this.gridConfig.showTotal = true;
                            _this.gridConfig.totalItems = category.total_results;

                            _this.gridLimit = limit;
                            _this.totalItems = category.total_results;
                            _this.$rootScope.$broadcast('pageChangeComplete', _this.$state.current);
                        }, function () {
                            _this.$state.go('ovp.store', { category: null, page: undefined });
                        });
                    } else {
                        promise = this.StoreService.getFrontdoor().then(function (categories) {
                            categories.forEach(function (category) {
                                category.carouselConfig = Object.assign({
                                    title: category.name,
                                    viewAllUri: category.uri && 'ovp.store.viewall({category:"' + _this.stringUtil.addParameterToUri(category.uri, 'catName', category.name) + '", page: 1})'
                                }, _this.storeCarouselConfig);
                            });
                            _this.categories = categories;
                            _this.$rootScope.$broadcast('pageChangeComplete', _this.$state.current);
                        }, function () {
                            _this.errorMessage = 'Unable to retrieve store data. Reload the page to try again.';
                        });
                    }

                    this.$rootScope.$broadcast('message:loading', promise, undefined, 'Video Store');

                    // Update bookmarks
                    this.BookmarkService.getBookmarks();
                }
            }, {
                key: 'onCarouselLimitChanged',
                value: function onCarouselLimitChanged(limit) {
                    this.carouselLimit = Math.max(this.carouselLimit, limit);
                }
            }, {
                key: 'onPageChanged',
                value: function onPageChanged(page) {
                    this.$state.go(this.$state.current, { category: this.category, page: page });
                }
            }, {
                key: 'storeTitleCallback',
                value: function storeTitleCallback(pages) {
                    var page = pages.find(function (p) {
                        return p.application === 'vodStore';
                    });
                    if (page) {
                        this.storeTitle = page.title;
                    } else {
                        this.storeTitle = null;
                    }
                }
            }]);

            return Store;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/store/store-page.js.map
