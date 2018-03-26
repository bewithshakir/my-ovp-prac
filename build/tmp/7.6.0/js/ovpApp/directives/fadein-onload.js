'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.directives.fadeinOnload', []).directive('fadeinOnload', fadeinOnload);

    /* @ngInject */
    function fadeinOnload() {
        // Usage: <imgs src="blah" fadein-onload></div>
        //
        // Creates: when the image loads, its opacity will be set to 1
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            element.addClass('fade-in');
            element.on('load', function () {
                return element[0].style.opacity = '1';
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/fadein-onload.js.map
