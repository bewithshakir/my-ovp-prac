'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.directives.fallbackImage', []).directive('fallbackImage', fallbackImage);

    /* @ngInject */
    function fallbackImage() {
        // Usage: <img src='foo.jpg' fallback-image='bar.jpg'/>
        //   or
        // <img src='foo.jpg' fallback-image='display:none'/>   //special option sets to display none on failure
        //
        // Creates: If the image fails to load, an alternate image is loaded in its place. Or, the image is set
        //     to display none.
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var hidden = false;
            if (!attrs.src && !attrs.ngSrc) {
                doFallback();
            } else {
                element.on('error', doFallback);
            }

            function doFallback() {
                //Watch ngSrc to make sure that the data doesn't get set at a later time
                attrs.$observe('ngSrc', function (src) {
                    if (src && hidden) {
                        hidden = false;
                        element[0].style.display = '';
                    }
                });

                if (attrs.fallbackImage === 'display:none') {
                    hidden = true;
                    element[0].style.display = 'none';
                } else {
                    element[0].src = attrs.fallbackImage;
                }

                element.off('error', doFallback);
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/fallback-image.js.map
