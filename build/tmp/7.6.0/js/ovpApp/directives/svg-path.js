'use strict';

(function () {
    'use strict';

    svgPath.$inject = ["$location", "$timeout"];
    angular.module('ovpApp.directives.svgPath', []).directive('svgPath', svgPath);

    /* @ngInject */
    function svgPath($location, $timeout) {
        return {
            link: function link($rootScope, $element, $attributes) {
                var link = $element.attr('xlink:href');
                var updateXlinkHref = function updateXlinkHref() {
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
//# sourceMappingURL=../../maps-babel/ovpApp/directives/svg-path.js.map
