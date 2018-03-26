(function () {
    'use strict';

    angular
        .module('ovpApp.directives.svgPath', [])
        .directive('svgPath', svgPath);

    /* @ngInject */
    function svgPath($location, $timeout) {
        return {
            link: function ($rootScope, $element, $attributes) {
                let link = $element.attr('xlink:href');
                let updateXlinkHref = function () {
                    $timeout(function () {
                        $element.attr('xlink:href', $location.url() + link);
                    });
                };
                $attributes.$observe('xlinkHref', function (linkHref) {
                    //Needed to add the timeout to make sure this gets updated correctly - when navigating to an
                    //series product page - the first selected episode's buttons would not display the icon correctly.
                    link = linkHref;
                    updateXlinkHref();
                });
                // We need to update the link on location change
                $rootScope.$on('$locationChangeSuccess', function () {
                    updateXlinkHref();
                });
            }
        };
    }
})();
