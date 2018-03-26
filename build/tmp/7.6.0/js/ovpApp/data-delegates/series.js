'use strict';

(function () {
    'use strict';

    seriesViewModelDefinition.$inject = ["DataDelegate", "delegateFactory", "delegateUtils"];
    registerDelegate.$inject = ["seriesViewModelDefinition", "delegateFactory"];
    angular.module('ovpApp.dataDelegate').factory('seriesViewModelDefinition', seriesViewModelDefinition).run(registerDelegate);

    /**
     * "Series" objects are used in search to represent a series. Not to be confused
     * with "Episode-list" objects, which also represent a series but are mostly
     * used in a non-search context.
     */

    /* @ngInject */
    function seriesViewModelDefinition(DataDelegate, delegateFactory, delegateUtils) {
        var cached = delegateUtils.cached;

        return new DataDelegate(angular.extend({}, delegateUtils.standardSearchParams, {
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

                return ['product.series', {
                    tmsSeriesId: data.tmsSeriesId,
                    uri: data.uri
                }];
            }),
            playable: 'availableOndemand',
            imageUri: cached(delegateUtils.createProductImageFunction())
        }));
    }

    /* @ngInject */
    function registerDelegate(seriesViewModelDefinition, delegateFactory) {
        function isSeries(asset) {
            return asset.resultType === 'series';
        }

        delegateFactory.registerDelegateDefinition(seriesViewModelDefinition, isSeries);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/data-delegates/series.js.map
