'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.settings.favoriteCard', ['ovpApp.services.favoritesService']).component('favoriteCard', {
        bindings: {
            channel: '<',
            isSpecU: '<'
        },
        templateUrl: '/js/ovpApp/settings/favorites/favorite-card.html',
        controller: (function () {
            /* @ngInject */

            FavoriteCardController.$inject = ["favoritesService"];
            function FavoriteCardController(favoritesService) {
                _classCallCheck(this, FavoriteCardController);

                angular.extend(this, {
                    favoritesService: favoritesService
                });
            }

            _createClass(FavoriteCardController, [{
                key: 'isFavorite',
                value: function isFavorite(channel) {
                    return this.favoritesService.isFavorite(channel);
                }
            }, {
                key: 'getLogoUrl',
                value: function getLogoUrl(channel) {
                    return channel.fullLogoUrl;
                }
            }, {
                key: 'toggleFavorite',
                value: function toggleFavorite(channel, $event) {
                    $event.preventDefault();
                    this.favoritesService.toggleFavorite(channel);
                }
            }]);

            return FavoriteCardController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/favorites/favorite-card.js.map
