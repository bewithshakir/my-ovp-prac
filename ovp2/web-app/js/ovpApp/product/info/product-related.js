(function () {
    'use strict';

    angular.module('ovpApp.product.related', [

    ])
    .component('productRelated', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/product/info/product-related.html',
        controller: class ProductRelated {
            constructor(productFocusRestore, $state, delegateFactory, searchService) {
                angular.extend(this, {productFocusRestore, $state, delegateFactory, searchService});
            }

            $onChanges(changes) {
                if (changes.asset) {
                    this.getRelatedShows();
                    this.relatedCarouselConfig = {
                        title: 'Related to ' + this.asset.title,
                        showTitle: false,
                        showReturnArrow: false,
                        initialFocus: this.productFocusRestore.getIndex(),
                        itemConfig: {
                            enableRemove: false,
                            showRentalInfo: 'auto',
                            clickCallback: (item, index) => {
                                let route = item.clickRoute;
                                if (route) {
                                    this.productFocusRestore.setIndex(index);
                                    this.$state.go(...route);
                                }
                            }
                        }
                    };
                }
            }

            getRelatedShows() {
                this.related = [];
                let source;
                if (this.asset.isSeries) {
                    source = this.searchService.getRelatedByTmsSeriesId(this.asset.tmsSeriesId);
                } else {
                    source = this.searchService.getRelatedByTmsProgramId(this.asset.tmsProgramIds[0]);
                }
                source
                    .retry(3)
                    .map(data => data.results.map(this.delegateFactory.createInstance))
                    .subscribe(related => this.related = related);
            }
        }
    });
})();
