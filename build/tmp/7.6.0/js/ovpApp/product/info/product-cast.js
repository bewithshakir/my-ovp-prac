'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.product.cast', []).component('productCast', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/product/info/product-cast.html',
        controller: (function () {
            function ProductCast() {
                _classCallCheck(this, ProductCast);
            }

            _createClass(ProductCast, [{
                key: '$onInit',
                value: function $onInit() {
                    this.carouselConfig = {
                        showReturnArrow: false,
                        useArrows: false
                    };
                }
            }]);

            return ProductCast;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/info/product-cast.js.map
