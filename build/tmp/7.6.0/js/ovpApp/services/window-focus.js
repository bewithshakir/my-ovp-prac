'use strict';

(function () {
    'use strict';

    windowFocus.$inject = ["$window", "$timeout"];
    angular.module('ovpApp.services.windowFocus', []).factory('windowFocus', windowFocus);

    /* @ngInject */
    function windowFocus($window, $timeout) {
        var state = false;

        var service = {
            windowJustGotFocus: windowJustGotFocus
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
//# sourceMappingURL=../../maps-babel/ovpApp/services/window-focus.js.map
