(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('searchgroupViewModelDefinition', searchgroupViewModelDefinition)
        .run(registerDelegate);

    /* @ngInject */
    function searchgroupViewModelDefinition(DataDelegate, delegateFactory, delegateUtils,
        titleCaseFilter) {

        let cached = delegateUtils.cached;

        return new DataDelegate({
            title: cached(function (data) {
                return titleCaseFilter(data.title);
            }),
            results: cached(function (data) {
                return data.results.map(delegateFactory.createInstance)
                    .filter(exists);
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
