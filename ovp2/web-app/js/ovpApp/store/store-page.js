(function () {
    'use strict';
    angular.module('ovpApp.store', [
                'ovpApp.config',
                'ui.router',
                'ovpApp.services.store',
                'ovpApp.services.homePage',
                'ovpApp.services.bookmark',
                'ovpApp.legacy.stringUtil'
    ])
    .component('storePage', {
        templateUrl: '/js/ovpApp/store/store-page.html',
        bindings: {
            page: '<',
            category: '<'
        },
        controller: class Store {
            /* @ngInject */
            constructor($rootScope, StoreService, $state, homePage, BookmarkService,
                        config, stringUtil) {
                this.$rootScope = $rootScope;
                this.StoreService = StoreService;
                this.$state = $state;
                this.homePage = homePage;
                this.BookmarkService = BookmarkService;
                this.config = config;
                this.stringUtil = stringUtil;
            }

            $onInit() {
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
                    promise = this.StoreService.getCategory(this.category, startIndex, limit).then(cat => {
                        let category = cat;

                        if (category.total_results < startIndex) {
                            this.onPageChanged(1);
                            return;
                        }

                        this.results = category.results;

                        // Angular watches the object reference for changes,
                        // not the object's properties. So create a new copy to
                        // force angular to register a change on the config.
                        this.gridConfig = angular.copy(this.gridConfig);
                        this.gridConfig.title = category.name;
                        this.gridConfig.showTotal = true;
                        this.gridConfig.totalItems = category.total_results;

                        this.gridLimit = limit;
                        this.totalItems = category.total_results;
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    }, () => {
                        this.$state.go('ovp.store', {category: null, page: undefined});
                    });
                } else {
                    promise = this.StoreService.getFrontdoor().then((categories) => {
                        categories.forEach(category => {
                            category.carouselConfig = Object.assign({
                                title: category.name,
                                viewAllUri: category.uri && 'ovp.store.viewall({category:"' +
                                    this.stringUtil.addParameterToUri(category.uri, 'catName', category.name) +
                                    '", page: 1})'
                            }, this.storeCarouselConfig);
                        });
                        this.categories = categories;
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    }, () => {
                        this.errorMessage = 'Unable to retrieve store data. Reload the page to try again.';
                    });
                }

                this.$rootScope.$broadcast(
                    'message:loading',
                    promise,
                    undefined,
                    'Video Store'
                );

                // Update bookmarks
                this.BookmarkService.getBookmarks();
            }

            onCarouselLimitChanged(limit) {
                this.carouselLimit = Math.max(this.carouselLimit, limit);
            }

            onPageChanged(page) {
                this.$state.go(this.$state.current, {category: this.category, page: page});
            }

            storeTitleCallback(pages) {
                let page = pages.find(p => p.application === 'vodStore');
                if (page) {
                    this.storeTitle = page.title;
                } else {
                    this.storeTitle = null;
                }
            }
        }
    });
}());
