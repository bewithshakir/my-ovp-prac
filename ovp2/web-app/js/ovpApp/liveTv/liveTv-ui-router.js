(function () {
    'use strict';

    angular.module('ovpApp.live.router', [
        'ui.router',
        'ovpApp.services.locationService',
        'ovpApp.player'
        ])
    .run(run)
    .config(config);

    /* @ngInject */
    function run(playerService, $timeout, $transitions, $rootScope, $state) {
        // This would be better in an onInactivate, but stickyState's onInactivate hooks
        //    appear to be nonfunctional in the current version
        $transitions.onSuccess({from: 'ovp.livetv'}, function (transition) {
            const stickyStates = transition.router.getPlugin('stickystates');
            const inactives = stickyStates.inactives();
            if (inactives.find(state => state.name === 'ovp.livetv')) {
                playerService.getInstance()
                    .then(player => player.pause());
            }
        });

        // And this would be better in onReactivate
        $transitions.onStart({to: 'ovp.livetv'}, function (transition) {
            const stickyStates = transition.router.getPlugin('stickystates');
            const inactives = stickyStates.inactives();
            if (inactives.find(state => state.name === 'ovp.livetv')) {
                playerService.getInstance()
                    .then(player => {
                        player.play();
                        // Player resuming, so complete pageView and acknowledge resumed playback.
                        $rootScope.$broadcast('pageChangeComplete', $state.current);
                        $rootScope.$broadcast('playback-resumed');
                    });
            }
        });
    }

    /* @ngInject */
    function config($stateProvider, CAPABILITIES) {
        const liveState = {
            redirectTo: restrictOutOfUs,
            data: {
                capability: CAPABILITIES.LIVE,
                bodyClass: 'live-page video-player-page',
                pageTitle: function (transition) {
                    return transition.injector().get('$rootScope')
                        .$eventToObservable('player:assetSelected')
                        .map(([event, asset]) => `${asset.title}, ${asset.channel.callSign}, Live TV`)
                        .startWith('Live TV');
                },
                hideHeaderGradient: true
            },
            resolve: {
                /* @ngInject */
                parentalControls: function (parentalControlsService) {
                    return parentalControlsService.getParentalControlsForUser();
                },
                /* @ngInject */
                location: function (locationService) {
                    return locationService.getLocation();
                }
            },
            params: {
                eanUrl: null
            },
            views: {
                appView: {
                    /* @ngInject */
                    controller: 'LiveController as vm'
                }
            },
            /* @ngInject */
            onEnter: function ($rootScope, playerService) {
                playerService.stop();
            },
            /* @ngInject */
            onExit: function ($rootScope, playerService) {
                playerService.stop();
            }
        };

        $stateProvider.state('ovp.livetv',
            angular.extend({
                url: '/livetv?tmsid&testEanUrl'
            }, liveState));

        function restrictOutOfUs(transition) {
            const locationService = transition.injector().get('locationService');
            return locationService.getLocation()
                .then(location => {
                    if (!location.inUS) {
                        return 'ovp.outOfUs';
                    }
                });
        }
    }
}());
