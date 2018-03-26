'use strict';

(function () {
    'use strict';

    runOnce.$inject = ["$window"];
    angular.module('ovpApp.services.runOnceService', []).factory('runOnce', runOnce);

    /* @ngInject */
    function runOnce($window) {
        var calledFunctions = [];

        var service = {
            /**
             * Delegate function calling to the functionManager
             * If the function has never been called, it is cached and called
             * If the function is in the cache a noOp is called instead
             * @param func {function} The function to run once
             * @param [args] {array}
             * @returns {*} The return of the original function or undefined if noOp
             */
            delegate: function delegate(func, args) {
                return functionManager(func, args);
            },
            cached: functionIsCached
        };

        return service;

        //////////////////

        function functionIsCached(func) {
            var funcStr = func.toString();

            return calledFunctions.some(function (item) {
                return item === funcStr;
            });
        }

        function functionManager(func, args) {
            var functionToCall = func;

            if (!functionIsCached(func)) {
                // function has never been called, so cache it
                calledFunctions.push(func.toString());
            } else {
                // previously called, assign noOp
                functionToCall = function () {};
            }

            return functionToCall.apply($window, args);
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/run-once-service.js.map
