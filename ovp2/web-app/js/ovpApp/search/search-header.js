(function () {
    'use strict';

    /**
     * searchHeader
     *
     * Top of the search page. Contains logo and search input, and is used to cover up the normal header
     *
     * Example Usage:
     * <search-header></search-header>
     */
    angular.module('ovpApp.search.header', [
            'ovpApp.search.input'
        ])
        .component('searchHeader', {
            templateUrl: '/js/ovpApp/search/search-header.html'
        });
})();
