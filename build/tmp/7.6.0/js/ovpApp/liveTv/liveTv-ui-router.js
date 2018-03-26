'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    run.$inject = ["playerService", "$timeout", "$transitions", "$rootScope", "$state"];
    config.$inject = ["$stateProvider", "CAPABILITIES"];
    angular.module('ovpApp.live.router', ['ui.router', 'ovpApp.services.locationService', 'ovpApp.player']).run(run).config(config);

    /* @ngInject */
    function run(playerService, $timeout, $transitions, $rootScope, $state) {
        // This would be better in an onInactivate, but stickyState's onInactivate hooks
        //    appear to be nonfunctional in the current version
        $transitions.onSuccess({ from: 'ovp.livetv' }, function (transition) {
            var stickyStates = transition.router.getPlugin('stickystates');
            var inactives = stickyStates.inactives();
            if (inactives.find(function (state) {
                return state.name === 'ovp.livetv';
            })) {
                playerService.getInstance().then(function (player) {
                    return player.pause();
                });
            }
        });

        // And this would be better in onReactivate
        $transitions.onStart({ to: 'ovp.livetv' }, function (transition) {
            var stickyStates = transition.router.getPlugin('stickystates');
            var inactives = stickyStates.inactives();
            if (inactives.find(function (state) {
                return state.name === 'ovp.livetv';
            })) {
                playerService.getInstance().then(function (player) {
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
        var liveState = {
            redirectTo: restrictOutOfUs,
            data: {
                capability: CAPABILITIES.LIVE,
                bodyClass: 'live-page video-player-page',
                pageTitle: function pageTitle(transition) {
                    return transition.injector().get('$rootScope').$eventToObservable('player:assetSelected').map(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2);

                        var event = _ref2[0];
                        var asset = _ref2[1];
                        return asset.title + ', ' + asset.channel.callSign + ', Live TV';
                    }).startWith('Live TV');
                },
                hideHeaderGradient: true
            },
            resolve: {
                /* @ngInject */
                parentalControls: ["parentalControlsService", function parentalControls(parentalControlsService) {
                    return parentalControlsService.getParentalControlsForUser();
                }],
                /* @ngInject */
                location: ["locationService", function location(locationService) {
                    return locationService.getLocation();
                }]
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
            onEnter: ["$rootScope", "playerService", function onEnter($rootScope, playerService) {
                playerService.stop();
            }],
            /* @ngInject */
            onExit: ["$rootScope", "playerService", function onExit($rootScope, playerService) {
                playerService.stop();
            }]
        };

        $stateProvider.state('ovp.livetv', angular.extend({
            url: '/livetv?tmsid&testEanUrl'
        }, liveState));

        function restrictOutOfUs(transition) {
            var locationService = transition.injector().get('locationService');
            return locationService.getLocation().then(function (location) {
                if (!location.inUS) {
                    return 'ovp.outOfUs';
                }
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/liveTv/liveTv-ui-router.js.map
