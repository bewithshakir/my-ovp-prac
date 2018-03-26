'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.filters.titleCase', []).filter('titleCase', titleCase);

    function titleCase() {
        return titleCaseFilter;

        ////////////////

        function titleCaseFilter() {
            var input = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

            return input.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/filters/title-case.js.map
