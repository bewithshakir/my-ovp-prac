(function () {
    'use strict';

    angular.module('ovpApp.cache',
        ['ovpApp.src-service'])

    .directive('ovpSrc', ovpSrc);

    /* @ngInject */
    function ovpSrc(OvpSrcService) {
        return {
            restrict: 'A',
            link: function ($scope, $elements) {
                $elements.each(function (i, $element) {
                    var url = $element.attributes['ovp-src'].value;
                    if (url) {
                        $element.src = OvpSrcService.versionPath(url);
                    }
                });
            }
        };
    }
}());
