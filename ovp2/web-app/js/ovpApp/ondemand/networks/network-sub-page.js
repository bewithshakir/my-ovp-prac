(function () {
    'use strict';

    angular.module('ovpApp.ondemand.networkSubPage', [
        'ovpApp.ondemand.networkThreeTier',
        'ovpApp.ondemand.data'])
    .component('networkSubPage', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-sub-page.html',
        bindings: {
            data: '<',
            page: '<',
            index: '<'
        }
    });
})();
