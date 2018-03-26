'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.product.episodes').component('productEpisode', {
        bindings: {
            episode: '<',
            description: '<',
            selected: '<',
            onSelected: '&'
        },
        /* @ngInject */
        templateUrl: ["$attrs", function templateUrl($attrs) {
            if (angular.isDefined($attrs.elevated)) {
                return '/js/ovpApp/product/episode-list/product-episode-elevated.html';
            } else {
                return '/js/ovpApp/product/episode-list/product-episode.html';
            }
        }],
        controller: (function () {
            /* @ngInject */

            ProductEpisode.$inject = ["$rootScope", "$filter"];
            function ProductEpisode($rootScope, $filter) {
                _classCallCheck(this, ProductEpisode);

                angular.extend(this, { $rootScope: $rootScope, $filter: $filter });
            }

            _createClass(ProductEpisode, [{
                key: 'isPercent',
                value: function isPercent(num) {
                    return typeof num === 'number';
                }
            }, {
                key: 'episodeStatus',
                value: function episodeStatus() {
                    var status = '';

                    if (this.episode.isBlockedByParentalControls) {
                        status = 'blocked';
                    } else if (this.episode.isEntitled === false) {
                        status = 'unentitled';
                    } else if (this.$rootScope.location && this.$rootScope.location.behindOwnModem === false && this.episode.availableOutOfHome) {
                        status = 'availableOutOfHome';
                    }

                    return status;
                }
            }]);

            return ProductEpisode;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/episode-list/product-episode.js.map
