(function () {
    'use strict';

    angular
        .module('ovpApp.settings.parentalControls.data', [
            'ovpApp.services.parentalControlsService'
        ])
        .factory('parentalControlsData', parentalControlsData);

    /* @ngInject */
    function parentalControlsData(parentalControlsService, $q) {
        const service = {
            getChannelCards,
            getRatingBlocks
        };
        return service;

        ////////////////

        function getChannelCards() {
            return parentalControlsService.parentalControlsByChannel()
                .then(channels => {
                    let channelCards = [];

                    channels.forEach(channel => {
                        if (channel.linearCount == 1 && channel.vodCount == 1) {
                            channelCards.push(channel);
                        } else {
                            channel.services.forEach(service =>
                                channelCards.push(service)
                            );
                        }
                    });
                    return {channels, channelCards};
                });
        }

        function getRatingBlocks() {
            return $q.all([
                parentalControlsService.getUnblockedTvRating(),
                parentalControlsService.getUnblockedMovieRating()
            ])
            .then(([tvRating, movieRating]) => {
                return {tvRating, movieRating};
            });
        }
    }
})();
