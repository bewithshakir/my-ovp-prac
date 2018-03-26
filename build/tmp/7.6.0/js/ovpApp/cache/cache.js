'use strict';

(function () {
    'use strict';

    ovpSrc.$inject = ["OvpSrcService"];
    angular.module('ovpApp.cache', ['ovpApp.src-service']).directive('ovpSrc', ovpSrc);

    /* @ngInject */
    function ovpSrc(OvpSrcService) {
        return {
            restrict: 'A',
            link: function link($scope, $elements) {
                $elements.each(function (i, $element) {
                    var url = $element.attributes['ovp-src'].value;
                    if (url) {
                        $element.src = OvpSrcService.versionPath(url);
                    }
                });
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/cache/cache.js.map
