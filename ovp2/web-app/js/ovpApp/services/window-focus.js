(function () {
    'use strict';

    angular
        .module('ovpApp.services.windowFocus', [])
        .factory('windowFocus', windowFocus);

    /* @ngInject */
    function windowFocus($window, $timeout) {
        let state = false;

        const service = {
            windowJustGotFocus
        };

        activate();

        return service;

        ////////////////

        function activate() {
            angular.element($window).on('focus', function () {
                state = true;
                $timeout(function () {
                    // Clear the flag once the current event loop is complete
                    state = false;
                }, 0, false);
            });
        }

        /**
         * Returns true if the window just received a focus event a moment ago.
         *
         * This can be used to distinguish between focus events that occur due to a
         * browser tab becoming active, and ones that occur due to other user activity
         */
        function windowJustGotFocus() {
            return state;
        }
    }
})();
