(function () {
    'use strict';

    angular.module('ovpApp.product.details', [
    ])
    .component('productDetails', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/product/info/product-details.html'
    });
})();
