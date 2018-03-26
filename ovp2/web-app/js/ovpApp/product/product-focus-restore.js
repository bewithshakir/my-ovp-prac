(function () {
    'use strict';

    angular
        .module('ovpApp.product.focusRestore', [])
        .factory('productFocusRestore', productFocusRestore);

    /* @ngInject */
    function productFocusRestore($document, $state, $stateParams) {
        const service = {
            getIndex,
            setIndex
        };

        let focusHistory = [];
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
            let last = focusHistory[focusHistory.length - 1];
            return last && last.state === $state.current.name && angular.equals(last.params, $stateParams);
        }
    }
})();
