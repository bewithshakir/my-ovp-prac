'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.ondemand.networkCategoryList', ['ovpApp.ondemand.data', 'ovpApp.config', 'ovpApp.services.ovpStorage']).component('networkCategoryList', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-category-list.html',
        bindings: {
            categoryList: '<',
            page: '<'
        },
        controller: (function () {
            /* @ngInject */

            networkCategoryListController.$inject = ["onDemandData", "storageKeys", "$state", "config", "ondemandSubheaderService", "$rootScope"];
            function networkCategoryListController(onDemandData, storageKeys, $state, config, ondemandSubheaderService, $rootScope) {
                _classCallCheck(this, networkCategoryListController);

                angular.extend(this, { onDemandData: onDemandData, storageKeys: storageKeys, $state: $state, config: config,
                    ondemandSubheaderService: ondemandSubheaderService, $rootScope: $rootScope });
            }

            _createClass(networkCategoryListController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.selectedCategory = undefined;
                    var subheaderOptions = {
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
            }, {
                key: 'backToNetworks',
                value: function backToNetworks() {
                    this.$state.go('ovp.ondemand.networks', { catUrl: null });
                }
            }, {
                key: 'networkLogoUrl',
                value: function networkLogoUrl() {
                    return this.categoryList.imageUri({ height: 80 });
                }
            }, {
                key: 'showCategory',
                value: function showCategory(category) {
                    var _this = this;

                    this.onDemandData.getByUri(category.uri).then(function (cat) {
                        _this.selectedCategory = cat;
                        _this.pageSize = _this.config.vodAssetsPerPage;
                        _this.gridListConfig = {
                            title: _this.selectedCategory.name,
                            totalItems: _this.selectedCategory.totalResults,
                            showTotal: true,
                            showToggle: false,
                            id: _this.storageKeys.vodMinorCategoryViewMode,
                            useLocalStorage: true
                        };

                        // Notify the subheader of the change
                        var subheaderOptions = {
                            showBack: true,
                            backString: _this.categoryList.name,
                            onBackClick: _this.$onInit.bind(_this),
                            showToggle: true,
                            showNetworkLogo: true,
                            networkLogoUrl: _this.networkLogoUrl.bind(_this),
                            pageTitle: 'On Demand - ' + _this.categoryList.name + ' Networks ' + category.name
                        };

                        _this.ondemandSubheaderService.setState(subheaderOptions);
                    });
                }
            }]);

            return networkCategoryListController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/networks/network-category-list.js.map
