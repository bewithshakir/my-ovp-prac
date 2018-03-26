(function () {
    'use strict';

    angular.module('ovpApp.watchlater.router', [
        'ui.router'])
    .config(config);

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider.state('ovp.watchLater', {
            data: {
                pageTitle: 'Watch Later'
            },
            views: {
                appView: {
                    component: 'myLibrary'
                }
            },
            url: '/watchlater'
        });
    }
}());
