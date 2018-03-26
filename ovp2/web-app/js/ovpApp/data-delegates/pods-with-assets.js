(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('podsWithAssetsDefinition', podsWithAssetsDefinition)
        .run(registerDelegate);

    /* @ngInject */
    function podsWithAssetsDefinition(DataDelegate, delegateFactory, delegateUtils, EntitlementsService) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            type: 'type',
            availableOutOfHome: 'availableOutOfHome',
            context: 'context',
            categories: cached(function (data) {
                return data.results ? data.results.map(delegateFactory.createInstance) : [];
            }),
            name: 'name',
            twcTvNetworkDisplayMode: 'twcTvNetworkDisplayMode',
            uiHint: 'uiHint',
            uri: 'uri',
            imageUri: cached(delegateUtils.createProductImageFunction()),
            isEntitled: delegateUtils.promiseCached(function (data) {
                if (data.entitled !== undefined || (data.details && data.details.entitled !== undefined)) {
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
    function registerDelegate(podsWithAssetsDefinition, delegateFactory) {
        function isPodsWithAssets(asset) {
            return asset.type === 'pods_with_assets';
        }

        delegateFactory.registerDelegateDefinition(podsWithAssetsDefinition, isPodsWithAssets);
    }
})();
