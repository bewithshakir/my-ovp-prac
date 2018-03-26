(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('resultsViewModelDefinition', resultsViewModelDefinition)
        .run(registerDelegate);

    /**
     * "Series" objects are used in search to represent a series. Not to be confused
     * with "Episode-list" objects, which also represent a series but are mostly
     * used in a non-search context.
     */

    /* @ngInject */
    function resultsViewModelDefinition(DataDelegate, delegateFactory, delegateUtils) {
        let cached = delegateUtils.cached;

        return new DataDelegate(
            angular.extend({}, delegateUtils.standardSearchParams, {
                name: cached(function (data) {
                    if (data.resultDisplay == 'Person') {
                        return data.searchStringMatch;
                    }
                }),
                resultDisplay: 'resultDisplay',
                clickRoute: cached(function (data) {
                    // TODO: Analytics Event
                    // $rootScope.$emit('EG:searchResultSelected', {
                    //     type: data.resultType,
                    //     facet: data.resultEnum,
                    //     title: data.searchStringMatch,
                    //     searchStringMatch: data.searchStringMatch,
                    //     tmsProgramId: data.tmsProgramId
                    // });

                    if (['Person', 'Team', 'Sports'].includes(data.resultDisplay)) {
                        let toState = `search.${data.resultDisplay.toLowerCase()}`;
                        let toParams = {query: data.searchStringMatch, uri: data.uri};
                        return [toState, toParams];
                    }
                }),
                imageUri: cached(function (data) {
                    if (data.resultDisplay !== 'Person') {
                        return delegateUtils.createProductImageFunction()(data);
                    } else {
                        return delegateUtils.getPersonImageUri(data);
                    }
                })
            }));
    }


    /* @ngInject */
    function registerDelegate(resultsViewModelDefinition, delegateFactory) {
        function isResults(asset) {
            return asset.resultType === 'results';
        }

        delegateFactory.registerDelegateDefinition(resultsViewModelDefinition, isResults);
    }
})();
