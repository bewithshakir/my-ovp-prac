(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('componentsearchViewModelDefinition', componentsearchViewModelDefinition)
        .run(registerDelegate);

    /* @ngInject */
    function componentsearchViewModelDefinition(DataDelegate, delegateFactory, delegateUtils) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            queryString: 'name',
            categories: cached(function (data) {
                return data.results.map(delegateFactory.createInstance)
                    .filter(exists);
            }),
            numCategories: 'num_results',
            queryId: cached(function (data) {
                return data.queryId;
            }),
            numResults: cached(function () {
                return this.categories.reduce((a, b) => a + b.numResults, 0);
            })
        });
    }

    function exists(a) {
        return angular.isDefined(a) && a !== null;
    }

    /* @ngInject */
    function registerDelegate(componentsearchViewModelDefinition, delegateFactory) {
        function isComponentsearch(asset) {
            return asset.type === 'componentsearch';
        }

        delegateFactory.registerDelegateDefinition(componentsearchViewModelDefinition, isComponentsearch);
    }
})();
