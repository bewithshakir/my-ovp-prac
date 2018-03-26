(() => {
    'use strict';
    angular
    .module('ovpApp.ondemand.networkCategoryList', [
        'ovpApp.ondemand.data',
        'ovpApp.config',
        'ovpApp.services.ovpStorage'
        ])
    .component('networkCategoryList', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-category-list.html',
        bindings: {
            categoryList: '<',
            page: '<'
        },
        controller: class networkCategoryListController {
            /* @ngInject */
            constructor(onDemandData, storageKeys, $state, config, ondemandSubheaderService, $rootScope) {
                angular.extend(this, {onDemandData, storageKeys,  $state, config,
                    ondemandSubheaderService, $rootScope});
            }

            $onInit() {
                this.selectedCategory = undefined;
                let subheaderOptions = {
                    showBack: true,
                    backString: 'Networks',
                    onBackClick: this.backToNetworks.bind(this),
                    showNetworkLogo: true,
                    networkLogoUrl: this.networkLogoUrl.bind(this),
                    pageTitle: 'On Demand - ' + this.categoryList.name + ' Networks'
                };

                this.ondemandSubheaderService.setState(subheaderOptions);

                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
            }

            backToNetworks() {
                this.$state.go('ovp.ondemand.networks', {catUrl: null});
            }

            networkLogoUrl() {
                return this.categoryList.imageUri({height: 80});
            }

            showCategory(category) {
                this.onDemandData.getByUri(category.uri)
                .then(cat => {
                    this.selectedCategory = cat;
                    this.pageSize = this.config.vodAssetsPerPage;
                    this.gridListConfig = {
                        title: this.selectedCategory.name,
                        totalItems: this.selectedCategory.totalResults,
                        showTotal: true,
                        showToggle: false,
                        id: this.storageKeys.vodMinorCategoryViewMode,
                        useLocalStorage: true
                    };

                    // Notify the subheader of the change
                    let subheaderOptions = {
                        showBack: true,
                        backString: this.categoryList.name,
                        onBackClick: this.$onInit.bind(this),
                        showToggle: true,
                        showNetworkLogo: true,
                        networkLogoUrl: this.networkLogoUrl.bind(this),
                        pageTitle: 'On Demand - ' + this.categoryList.name + ' Networks ' + category.name
                    };

                    this.ondemandSubheaderService.setState(subheaderOptions);
                });
            }
        }
    });
})();
