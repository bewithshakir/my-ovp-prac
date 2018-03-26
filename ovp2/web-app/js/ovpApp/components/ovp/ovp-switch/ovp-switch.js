(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.ovpSwitch', ['lib.platform'])
        .directive('ovpSwitch', ovpSwitch);

    /* @ngInject */
    function ovpSwitch(platform) {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                toggleId: '@id',
                buttonEnabled: '@buttonEnabled'
            },
            templateUrl: '/js/ovpApp/components/ovp/ovp-switch/ovp-switch.html',
            link: function ($scope) {
                $scope.isSafari = platform.name === 'Safari';
            }
        };
    }
}());
