'use strict';

(function () {
    'use strict';

    toTrusted.$inject = ["$sce"];
    angular.module('ovpApp.filters.toTrusted', []).filter('toTrusted', toTrusted);

    /* @ngInject */
    function toTrusted($sce) {
        return toTrustedFilter;

        ////////////////

        function toTrustedFilter(text) {
            return $sce.trustAsHtml(text);
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/filters/to-trusted.js.map
