(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('productViewModelDefinition', productViewModelDefinition)
        .run(registerDelegate);

    /**
     * "Product" objects are used in search to represent a movie. Not to be confused
     * with "Event" objects, which also represent a movie (or episode) but are mostly
     * used in a non-search context.
     */

    /* @ngInject */
    function productViewModelDefinition(DataDelegate, delegateFactory, delegateUtils,
        productService, $state, BookmarkService/*, $rootScope*/) {
        let cached = delegateUtils.cached;

        return new DataDelegate(
            angular.extend({}, delegateUtils.standardSearchParams, {
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

                    return ['product.event', {
                        tmsId: data.tmsProgramId,
                        uri: data.uri
                    }];
                }),
                playable: 'availableOndemand',
                imageUri: cached(delegateUtils.createProductImageFunction()),
                bookmark: function (data) {
                    let bookmark = BookmarkService.getBookmarkByTmsProgramId(data.tmsProgramId);
                    if (bookmark) {
                        // NGC-4273: Because of ODN bug we are getting invalid playMarkerSeconds value
                        // when we play an asset till end on ODN STB.
                        bookmark.playMarkerSeconds = Math.min(bookmark.playMarkerSeconds, bookmark.runtimeSeconds);
                    }
                    return bookmark;
                },
                playedPct: function () {
                    if (this.bookmark) {
                        return (this.bookmark.playMarkerSeconds / this.bookmark.runtimeSeconds) * 100;
                    }
                }
            }));
    }

    /* @ngInject */
    function registerDelegate(productViewModelDefinition, delegateFactory) {
        function isProduct(asset) {
            return asset.resultType === 'product';
        }

        delegateFactory.registerDelegateDefinition(productViewModelDefinition, isProduct);
    }
})();
