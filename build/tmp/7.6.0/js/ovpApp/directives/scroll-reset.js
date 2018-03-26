/**
 * scrollReset
 *
 * This attemps to reset the scroll position when an angular event occurs
 *
 * usage:
 * <div scroll-reset="someEvent"></div>
 */
'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.directives.scrollReset', []).directive('scrollReset', scrollReset);

    /* @ngInject */
    function scrollReset() {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attr) {
            var native = element[0];
            native.scrollTop = 0;
            if (attr.scrollReset) {
                scope.$on(attr.scrollReset, function () {
                    native.scrollTop = 0;
                });
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/scroll-reset.js.map
