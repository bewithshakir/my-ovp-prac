'use strict';

(function () {
    'use strict';

    searchgroupViewModelDefinition.$inject = ["DataDelegate", "delegateFactory", "delegateUtils", "titleCaseFilter"];
    registerDelegate.$inject = ["searchgroupViewModelDefinition", "delegateFactory"];
    angular.module('ovpApp.dataDelegate').factory('searchgroupViewModelDefinition', searchgroupViewModelDefinition).run(registerDelegate);

    /* @ngInject */
    function searchgroupViewModelDefinition(DataDelegate, delegateFactory, delegateUtils, titleCaseFilter) {

        var cached = delegateUtils.cached;

        return new DataDelegate({
            title: cached(function (data) {
                return titleCaseFilter(data.title);
            }),
            results: cached(function (data) {
                return data.results.map(delegateFactory.createInstance).filter(exists);
            }),
            numResults: 'num_results'
        });
    }

    function exists(a) {
        return angular.isDefined(a) && a !== null;
    }

    /* @ngInject */
    function registerDelegate(searchgroupViewModelDefinition, delegateFactory) {
        function isSearchgroup(asset) {
            return asset.type === 'searchgroup';
        }

        delegateFactory.registerDelegateDefinition(searchgroupViewModelDefinition, isSearchgroup);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/searchgroup.js.map
