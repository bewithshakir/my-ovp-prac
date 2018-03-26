(function () {
    'use strict';

    angular.module('ovpApp.product.cast', [])
    .component('productCast', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/product/info/product-cast.html',
        controller: class ProductCast {
            $onInit() {
                this.carouselConfig = {
                    showReturnArrow: false,
                    useArrows: false
                };
            }
        }
    });
})();
