(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('networkListViewModelDefinition', networkListViewModelDefinition)
        .run(registerDelegate);

    /* @ngInject */
    function networkListViewModelDefinition(DataDelegate, delegateFactory, delegateUtils) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            type: 'type',
            availableOutOfHome: 'availableOutOfHome',
            context: 'context',
            networks: cached(function (data) {
                if (data.media) {
                    return data.media.map(delegateFactory.createInstance);
                } else if (data.results) {
                    return data.results.map(delegateFactory.createInstance);
                } else {
                    return [];
                }
            }),
            name: 'name',
            twcTvNetworkDisplayMode: 'twcTvNetworkDisplayMode',
            uiHint: 'uiHint',
            uri: 'uri'
        });
    }

    /* @ngInject */
    function registerDelegate(networkListViewModelDefinition, delegateFactory) {
        function isNetworkList(asset) {
            return asset.type === 'network_list';
        }

        delegateFactory.registerDelegateDefinition(networkListViewModelDefinition, isNetworkList);
    }
})();
