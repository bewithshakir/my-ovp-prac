(function () {
    'use strict';

    angular.module('ovpApp.product.episodes')
    .component('productEpisode', {
        bindings: {
            episode: '<',
            description: '<',
            selected: '<',
            onSelected: '&'
        },
        /* @ngInject */
        templateUrl: function ($attrs) {
            if (angular.isDefined($attrs.elevated)) {
                return '/js/ovpApp/product/episode-list/product-episode-elevated.html';
            } else {
                return '/js/ovpApp/product/episode-list/product-episode.html';
            }
        },
        controller: class ProductEpisode {
            /* @ngInject */
            constructor($rootScope, $filter) {
                angular.extend(this, {$rootScope, $filter});
            }

            isPercent(num) {
                return typeof num === 'number';
            }

            episodeStatus() {
                let status = '';

                if (this.episode.isBlockedByParentalControls) {
                    status = 'blocked';
                } else if (this.episode.isEntitled === false) {
                    status = 'unentitled';
                } else if (this.$rootScope.location && this.$rootScope.location.behindOwnModem === false &&
                    this.episode.availableOutOfHome) {
                    status = 'availableOutOfHome';
                }

                return status;
            }
        }
    });
}());
