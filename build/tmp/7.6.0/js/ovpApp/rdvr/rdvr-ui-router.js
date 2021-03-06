'use strict';

(function () {
    'use strict';

    /*
     * rdvr ui-router config
     */

    run.$inject = ["$transitions", "rdvrStateService", "stbService", "$state"];
    config.$inject = ["$stateProvider", "CAPABILITIES", "$urlRouterProvider"];
    angular.module('ovpApp.rdvr.router', ['ui.router', 'ovpApp.services.stbService', 'ovpApp.rdvr.rdvrStateService']).run(run).config(config);

    /* @ngInject */
    function run($transitions, rdvrStateService, stbService, $state) {
        stbService.currentStbSource.subscribe(function () {
            var state = rdvrStateService.getState($state.current.name);
            if (state && !state.enabled()) {
                getDefaultState(stbService).then(function (state) {
                    return $state.go(state);
                });
            }
        });
    }

    /* @ngInject */
    function config($stateProvider, CAPABILITIES, $urlRouterProvider) {
        //legacy redirect
        $urlRouterProvider.when('/DVR', ['$state', function ($state) {
            $state.go('ovp.dvr');
        }]);

        $urlRouterProvider.when('/dvr', ['$state', function ($state) {
            $state.go('ovp.dvr');
        }]);

        $urlRouterProvider.when('/dvr/rdvr/my-recordings', ['$state', function ($state) {
            $state.go('ovp.dvr.my-recordings');
        }]);
        //end legacy redirect

        $stateProvider.state('ovp.dvr', {
            redirectTo: redirect,
            data: {
                capability: CAPABILITIES.RDVR,
                subheader: 50,

                // can't select non-DVR
                dvrOnly: true
            },
            url: '/rdvr',
            resolve: {
                /* @ngInject */
                setTopBoxes: ["stbService", function setTopBoxes(stbService) {
                    return stbService.getSTBs().then(function () {
                        return stbService.selectDefaultDvr();
                    });
                }]
            },
            views: {
                'subMenu@ovp': {
                    /* @ngInject */
                    controller: ["$scope", "rdvrStateService", "$state", function controller($scope, rdvrStateService, $state) {
                        $scope.menuItems = rdvrStateService.states;
                        $scope.state = $state;
                    }],
                    templateUrl: '/js/ovpApp/rdvr/sub-header/sub-header.html'
                },
                appView: {
                    component: 'rdvrPage'
                }
            }
        });

        $stateProvider.state('ovp.dvr.my-recordings', {
            redirectTo: redirect,
            data: {
                pageTitle: 'DVR - My Recordings'
            },
            url: '/my-recordings',
            component: 'myRecordings'
        });

        $stateProvider.state('ovp.dvr.scheduled', {
            redirectTo: redirect,
            data: {
                pageTitle: 'DVR - Scheduled'
            },
            url: '/scheduled',
            component: 'rdvrScheduled'
        });

        $stateProvider.state('ovp.dvr.priority', {
            redirectTo: redirect,
            data: {
                pageTitle: 'DVR - Priority'
            },
            url: '/priority',
            component: 'rdvrPriority'
        });

        function redirect(transition) {
            return transition.injector().getAsync('setTopBoxes').then(function () {
                var name = transition.to().name;
                var needsRedirect = undefined;
                if (name === 'ovp.dvr') {
                    needsRedirect = true;
                } else {
                    var rdvrStateService = transition.injector().get('rdvrStateService');
                    needsRedirect = !rdvrStateService.getState(name).enabled();
                }

                if (needsRedirect) {
                    var stbService = transition.injector().get('stbService');
                    return getDefaultState(stbService);
                }
            });
        }
    }

    function getDefaultState(stbService) {
        return stbService.selectDefaultDvr().then(function () {
            return stbService.getCurrentStb().then(function (setTopBox) {
                return stbService.defaultDvrLanding().then(function (state) {
                    var toState = 'ovp.dvr.my-recordings';

                    if (setTopBox && (setTopBox.dvr || setTopBox.isDvr)) {
                        toState = state;
                    }

                    return toState;
                });
            });
        });
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/rdvr-ui-router.js.map
