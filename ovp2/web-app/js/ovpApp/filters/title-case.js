(function () {
    'use strict';

    angular
        .module('ovpApp.filters.titleCase', [])
        .filter('titleCase', titleCase);

    function titleCase() {
        return titleCaseFilter;

        ////////////////

        function titleCaseFilter(input = '') {
            return input.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    }
})();
