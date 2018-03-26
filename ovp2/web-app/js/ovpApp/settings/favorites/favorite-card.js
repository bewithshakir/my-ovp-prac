(function () {
    'use strict';
    angular.module('ovpApp.settings.favoriteCard', [
        'ovpApp.services.favoritesService'
        ])
    .component('favoriteCard', {
        bindings: {
            channel: '<',
            isSpecU: '<'
        },
        templateUrl: '/js/ovpApp/settings/favorites/favorite-card.html',
        controller: class FavoriteCardController {
            /* @ngInject */
            constructor(favoritesService) {
                angular.extend(this, {
                    favoritesService
                });
            }

            isFavorite(channel) {
                return this.favoritesService.isFavorite(channel);
            }

            getLogoUrl(channel) {
                return channel.fullLogoUrl;
            }

            toggleFavorite(channel, $event) {
                $event.preventDefault();
                this.favoritesService.toggleFavorite(channel);
            }
        }
    });
}());
