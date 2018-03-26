(function () {
    'use strict';

    angular
        .module('ovpApp.filters.toTrusted', [])
        .filter('toTrusted', toTrusted);

    /* @ngInject */
    function toTrusted($sce) {
        return toTrustedFilter;

        ////////////////

        function toTrustedFilter(text) {
            return $sce.trustAsHtml(text);
        }
    }

})();
