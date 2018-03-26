'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.product.info', ['ovpApp.product.related', 'ovpApp.product.details', 'ovpApp.product.cast']).component('productInfo', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/product/info/product-info.html'
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/info/product-info.js.map
