'use strict';

(function () {
    'use strict';

    favoritesService.$inject = ["$http", "$q", "ServiceError", "config", "$rootScope", "GuideService", "profileService"];
    angular.module('ovpApp.services.favoritesService', ['ovpApp.config', 'ovpApp.guide', 'ovpApp.services.profileService', 'ovpApp.components.error.ServiceError']).factory('favoritesService', favoritesService);

    /* @ngInject */
    function favoritesService($http, $q, ServiceError, config, $rootScope, GuideService, profileService) {
        var favorites = [];
        var isSpecU = profileService.isSpecU();
        var piHost = config.piHost,
            smartTv = config.smartTvApi,
            favorite = config.favoritesService;

        var service = {
            syncFavoriteChannels: syncFavoriteChannels,
            getFavorites: getFavorites,
            isFavorite: isFavorite,
            toggleFavorite: toggleFavorite
        };

        return service;

        /////////////////

        function syncFavoriteChannels() {
            return $http.get(piHost + smartTv + favorite.get, {
                withCredentials: true
            }).then(function (response) {
                favorites = response.data;
                // This is to fix the server issue where we are getting
                // the favorites channels (ipvs/api/smarttv/favorites/channels/v1)
                // that do not exist in the channel list of particular account. So we
                // are removing the channels from the favorites that are not in our channel list.
                return GuideService.fetchChannelList().then(function (channels) {
                    var channelFavorites = [];
                    favorites.forEach(function (channel) {
                        for (var i = 0; i < channels.length; i++) {
                            if (compareChannels(channel, channels[i])) {
                                // Remove duplicate
                                var index = channelFavorites.findIndex(function (chan) {
                                    return compareChannels(channel, chan);
                                });
                                if (index === -1) {
                                    channelFavorites.push(channels[i]);
                                }
                                return;
                            }
                        }
                    });
                    favorites = channelFavorites;
                    return favorites;
                });
            });
        }

        /**
         * Private method
         * @return {boolean} - ture if same channel number / ncsServiceId
         */
        function compareChannels(chnl1, chnl2) {
            return isSpecU ? chnl1.ncsServiceId === chnl2.ncsServiceId : chnl1.channelNumber === chnl2.channelNumber;
        }

        function getFavorites() {
            return favorites;
        }

        function isFavorite(channel) {
            return favorites.some(function (chan) {
                return compareChannels(channel, chan);
            });
        }

        function indexOfFavorite(channel) {
            return favorites.findIndex(function (chan) {
                return compareChannels(channel, chan);
            });
        }

        function addFavorite(channel) {
            var data = {};
            favorites.push(channel); // Immediately update list
            if (!isSpecU) {
                data.channelNumber = channel.channelNumber;
            }
            data.ncsServiceId = channel.ncsServiceId;
            return $http({
                method: 'POST',
                url: piHost + smartTv + favorite.add,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                withCredentials: true
            })['catch'](function (error) {
                // Revert the changes on failure
                var index = indexOfFavorite(channel);
                if (index > -1) {
                    favorites.splice(index, 1);
                }
                return $q.reject(error);
            });
        }

        function removeFavorite(channel) {
            var data = {};
            var index = indexOfFavorite(channel);
            if (!isSpecU) {
                data.channelNumber = channel.channelNumber;
            }
            data.ncsServiceId = channel.ncsServiceId;
            if (index > -1) {
                favorites.splice(index, 1); // Immediately update list
                return $http({
                    method: 'POST',
                    url: piHost + smartTv + favorite.remove,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data),
                    withCredentials: true
                })['catch'](function (error) {
                    // Revert the changes on failure
                    favorites.push(channel);
                    return $q.reject(error);
                });
            } else {
                return $q.reject();
            }
        }

        function toggleFavorite(channel) {
            var promise = undefined;
            var isCurrentlyFavorite = isFavorite(channel);
            if (isCurrentlyFavorite) {
                promise = removeFavorite(channel);
            } else {
                promise = addFavorite(channel);
            }

            // Analytics: Toggle favorite
            $rootScope.$emit('Analytics:select', {
                operationType: 'favoriteToggle',
                toggleState: !isCurrentlyFavorite
            });
            return promise;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/favorites-service.js.map
