'use strict';

(function () {
    'use strict';

    productFocusRestore.$inject = ["$document", "$state", "$stateParams"];
    angular.module('ovpApp.product.focusRestore', []).factory('productFocusRestore', productFocusRestore);

    /* @ngInject */
    function productFocusRestore($document, $state, $stateParams) {
        var service = {
            getIndex: getIndex,
            setIndex: setIndex
        };

        var focusHistory = [];
        return service;

        ////////////////

        function getIndex() {
            if (wentBack()) {
                return focusHistory.pop().index;
            }
        }

        function setIndex(index) {
            focusHistory.push({
                state: $state.current.name,
                params: angular.copy($stateParams),
                index: index
            });
        }

        function wentBack() {
            var last = focusHistory[focusHistory.length - 1];
            return last && last.state === $state.current.name && angular.equals(last.params, $stateParams);
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/product/product-focus-restore.js.map
