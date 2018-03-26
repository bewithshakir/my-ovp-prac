(() => {
    'use strict';

    angular
        .module('ovpApp.search.error', [])
        .component('searchError', {
            templateUrl: '/js/ovpApp/search/result-pages/search-error.html',
            bindings: {
                error: '<'
            }
        });
})();
