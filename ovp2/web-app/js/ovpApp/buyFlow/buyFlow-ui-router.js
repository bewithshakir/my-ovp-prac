(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.router', [
        'ui.router',
        'ovpApp.config',
        'ovpApp.services.streamPlusService'
    ]).config(buyFlowUiRouter);

    /* @ngInject */
    function buyFlowUiRouter($stateProvider) {
        $stateProvider
        .state('buyFlow', {
            abstract: true,
            url: '/streamPlus',
            ignoreRedirects: true,
            template: '<div ui-view autoscroll="true" />',

            resolve: {
                enabled: ($location, $q, config, streamPlusService) => {
                    return streamPlusService.isStreamPlusEligible().catch(() => {
                        $location.url('/');
                        return $q.reject({silent: true});
                    }).then(() => true);
                }
            }
        })
        .state('buyFlow.welcome', {
            data: {
                bodyClass: 'stream-plus-page',
                hideMenu: true
            },
            url: '/welcome',
            ignoreRedirects: true,
            component: 'buyFlowWelcome'
        })
        .state('buyFlow.offers', {
            data: {
                bodyClass: 'stream-plus-page',
                hideMenu: true
            },
            url: '/offers',
            ignoreRedirects: true,
            component: 'buyFlow'
        })
        .state('buyFlow.confirmation', {
            data: {
                bodyClass: 'stream-plus-page',
                hideMenu: true
            },
            url: '/confirmation',
            ignoreRedirects: true,
            component: 'buyFlowConfirmation'
        });
    }
}());
