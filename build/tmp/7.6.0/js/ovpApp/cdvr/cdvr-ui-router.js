'use strict';

(function () {
    'use strict';
    /*
     * CDVR UI Router Confiu
     */
    configCdvr.$inject = ["$stateProvider", "CAPABILITIES", "$urlRouterProvider"];
    angular.module('ovpApp.cdvr').config(configCdvr);

    /* @ngInject */
    function configCdvr($stateProvider, CAPABILITIES, $urlRouterProvider) {

        //legacy redirect
        $urlRouterProvider.when('/cdvr', ['$state', function ($state) {
            $state.go('ovp.cdvr.recorded');
        }]);
        //end legacy redirect

        $stateProvider.state('ovp.cdvr', {
            redirectTo: 'ovp.cdvr.recorded',
            url: '/cdvr',
            data: {
                bodyClass: 'cdvr',
                capability: CAPABILITIES.CDVR,
                subheader: 50,
                pageTitle: 'CDVR',
                subheaderLabel: 'dvr'
            },
            resolve: {},
            views: {
                'subMenu@ovp': {
                    component: 'cdvrSubheader'
                },
                appView: {
                    template: '<div class="cdvr" ui-view></div>'
                }
            }
        });

        $stateProvider.state('ovp.cdvr.recorded', {
            data: {
                pageTitle: 'CDVR - My Recorded'
            },
            url: '/recorded',
            component: 'cdvrRecorded'
        });

        $stateProvider.state('ovp.cdvr.scheduled', {
            data: {
                pageTitle: 'CDVR - Scheduled'
            },
            url: '/scheduled',
            component: 'cdvrScheduled'
        });
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/cdvr/cdvr-ui-router.js.map
