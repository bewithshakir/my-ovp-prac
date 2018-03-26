'use strict';

(function () {
    'use strict';

    componentsearchViewModelDefinition.$inject = ["DataDelegate", "delegateFactory", "delegateUtils"];
    registerDelegate.$inject = ["componentsearchViewModelDefinition", "delegateFactory"];
    angular.module('ovpApp.dataDelegate').factory('componentsearchViewModelDefinition', componentsearchViewModelDefinition).run(registerDelegate);

    /* @ngInject */
    function componentsearchViewModelDefinition(DataDelegate, delegateFactory, delegateUtils) {
        var cached = delegateUtils.cached;

        return new DataDelegate({
            queryString: 'name',
            categories: cached(function (data) {
                return data.results.map(delegateFactory.createInstance).filter(exists);
            }),
            numCategories: 'num_results',
            queryId: cached(function (data) {
                return data.queryId;
            }),
            numResults: cached(function () {
                return this.categories.reduce(function (a, b) {
                    return a + b.numResults;
                }, 0);
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
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/componentsearch.js.map
