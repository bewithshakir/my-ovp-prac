(function () {
    'use strict';

    angular.module('ovpApp.ondemand.category', [])
        .component('ondemandCategory', {
            bindings: {
                category: '<',
                page: '<',
                hideLogo: '<'
            },
            templateUrl: '/js/ovpApp/ondemand/category/ondemand-category.html',
            controller: class OndemandCategory {
                /* @ngInject */
                constructor($rootScope, storageKeys, config, onDemandData, $q, $state) {
                    angular.extend(this, {$rootScope, storageKeys, config, onDemandData, $q,
                        $state});
                }

                $onInit() {
                    this.clientSidePaging = this.category.totalResults === this.category.media.length;
                    this.pageSize = this.config.vodAssetsPerPage;
                    if (this.page === undefined || this.page < 1) {
                        this.page = 1;
                    }

                    this.gridListConfig = {
                        title: this.category.name,
                        defaultState: this.category.uiHint == 'list' ? 'list' : 'grid',
                        totalItems: this.category.totalResults,
                        showTotal: true,
                        showToggle: false,
                        id: this.storageKeys.vodMinorCategoryViewMode,
                        useLocalStorage: true
                    };
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }

                onPageChanged(page) {
                    let currentState = this.$state.current;
                    let currentParams = this.$state.params;
                    currentParams.page = page;
                    this.$state.go(currentState.name, currentParams);
                }
            }
        });
})();
