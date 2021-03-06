'use strict';

(function () {
    'use strict';

    mediaListViewModelDefinition.$inject = ["DataDelegate", "delegateFactory", "delegateUtils", "EntitlementsService"];
    registerDelegate.$inject = ["mediaListViewModelDefinition", "delegateFactory"];
    angular.module('ovpApp.dataDelegate').factory('mediaListViewModelDefinition', mediaListViewModelDefinition).run(registerDelegate);

    /* @ngInject */
    function mediaListViewModelDefinition(DataDelegate, delegateFactory, delegateUtils, EntitlementsService) {
        var cached = delegateUtils.cached;

        return new DataDelegate({
            type: 'type',
            availableOutOfHome: 'availableOutOfHome',
            context: 'context',
            media: cached(function (data) {
                var media = [];
                if (data.media && data.media.results) {
                    media = data.media.results;
                } else if (data.media) {
                    media = data.media;
                } else if (data.results) {
                    media = data.results;
                }

                return media.map(delegateFactory.createInstance);
            }),
            name: 'name',
            twcTvNetworkDisplayMode: 'twcTvNetworkDisplayMode',
            uiHint: 'uiHint',
            uri: 'uri',
            totalResults: function totalResults(data) {
                return data.total_results || this.media.length;
            },
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
    function registerDelegate(mediaListViewModelDefinition, delegateFactory) {
        function isMediaList(asset) {
            return asset.type === 'media_list';
        }

        delegateFactory.registerDelegateDefinition(mediaListViewModelDefinition, isMediaList);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/media-list.js.map
