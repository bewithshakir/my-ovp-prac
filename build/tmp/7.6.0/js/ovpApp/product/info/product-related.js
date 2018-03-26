'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.product.related', []).component('productRelated', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/product/info/product-related.html',
        controller: (function () {
            ProductRelated.$inject = ["productFocusRestore", "$state", "delegateFactory", "searchService"];
            function ProductRelated(productFocusRestore, $state, delegateFactory, searchService) {
                _classCallCheck(this, ProductRelated);

                angular.extend(this, { productFocusRestore: productFocusRestore, $state: $state, delegateFactory: delegateFactory, searchService: searchService });
            }

            _createClass(ProductRelated, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    var _this = this;

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
                                clickCallback: function clickCallback(item, index) {
                                    var route = item.clickRoute;
                                    if (route) {
                                        var _$state;

                                        _this.productFocusRestore.setIndex(index);
                                        (_$state = _this.$state).go.apply(_$state, _toConsumableArray(route));
                                    }
                                }
                            }
                        };
                    }
                }
            }, {
                key: 'getRelatedShows',
                value: function getRelatedShows() {
                    var _this2 = this;

                    this.related = [];
                    var source = undefined;
                    if (this.asset.isSeries) {
                        source = this.searchService.getRelatedByTmsSeriesId(this.asset.tmsSeriesId);
                    } else {
                        source = this.searchService.getRelatedByTmsProgramId(this.asset.tmsProgramIds[0]);
                    }
                    source.retry(3).map(function (data) {
                        return data.results.map(_this2.delegateFactory.createInstance);
                    }).subscribe(function (related) {
                        return _this2.related = related;
                    });
                }
            }]);

            return ProductRelated;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/info/product-related.js.map
