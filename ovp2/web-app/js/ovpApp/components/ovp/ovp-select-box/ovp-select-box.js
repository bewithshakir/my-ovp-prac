(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.selectBox', [])
    .directive('ovpSelectBox', ovpSelectBox);

    /* @ngInject */
    function ovpSelectBox() {
        return {
            restrict: 'A',
            require: ['select'],
            link: function ($scope, $element) {
                $scope.$watch('$render', function () {
                    $element.dropDown({
                        css: 'ovp_selectBox',
                        width: 364,
                        defaultheight: 130
                    });
                });
            }
        };
    }
}());
