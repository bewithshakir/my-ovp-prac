'use strict';

(function () {
    'use strict';

    categoryListViewModelDefinition.$inject = ["DataDelegate", "delegateFactory", "delegateUtils", "EntitlementsService"];
    registerDelegate.$inject = ["categoryListViewModelDefinition", "delegateFactory"];
    angular.module('ovpApp.dataDelegate').factory('categoryListViewModelDefinition', categoryListViewModelDefinition).run(registerDelegate);

    /* @ngInject */
    function categoryListViewModelDefinition(DataDelegate, delegateFactory, delegateUtils, EntitlementsService) {
        var cached = delegateUtils.cached;

        return new DataDelegate({
            type: 'type',
            availableOutOfHome: 'availableOutOfHome',
            context: 'context',
            media: cached(function (data) {
                if (data.media) {
                    return data.media.map(delegateFactory.createInstance);
                } else if (data.results) {
                    return data.results.map(delegateFactory.createInstance);
                } else {
                    return [];
                }
            }),
            categories: cached(function (data) {
                if (data.categories && data.categories.results) {
                    return data.categories.results.map(delegateFactory.createInstance);
                } else {
                    return [];
                }
            }),
            name: 'name',
            twcTvNetworkDisplayMode: 'twcTvNetworkDisplayMode',
            uiHint: 'uiHint',
            uri: 'uri',
            totalResults: 'total_results',
            imageUri: cached(delegateUtils.createProductImageFunction()),
            isEntitled: delegateUtils.promiseCached(function (data) {
                if (data.entitled !== undefined || data.details && data.details.entitled !== undefined) {
                    return data.entitled || data.details.entitled;
                } else if (angular.isDefined(data.product_providers)) {
                    return EntitlementsService.isVodNetworkEntitled(data.product_providers);
                } else {
                    return true;
                }
            })
        });
    }

    /* @ngInject */
    function registerDelegate(categoryListViewModelDefinition, delegateFactory) {
        function isCategoryList(asset) {
            return asset.type === 'category_list';
        }

        delegateFactory.registerDelegateDefinition(categoryListViewModelDefinition, isCategoryList);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/category-list.js.map
