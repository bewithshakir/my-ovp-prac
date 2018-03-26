'use strict';

(function () {
    'use strict';

    /**
     * Used to resolve conflicting rules about where to place the focus
     */

    focusMediator.$inject = ["$timeout", "platform", "$q"];
    angular.module('ovpApp.services.focusMediator', ['lib.platform']).factory('focusMediator', focusMediator);

    /* @ngInject */
    function focusMediator($timeout, platform, $q) {
        var candidates = [];
        var timer = undefined;

        var service = {
            requestFocus: requestFocus,
            lowPriority: 0,
            highPriority: 100
        };
        return service;

        ////////////////

        function requestFocus(priority) {
            var defer = $q.defer();

            candidates.push({ priority: priority, defer: defer });

            if (!timer) {
                timer = $timeout(function () {
                    candidates.sort(function (a, b) {
                        return b.priority - a.priority;
                    });
                    candidates.forEach(function (candidate, index) {
                        if (index === 0) {
                            candidate.defer.resolve();
                        } else {
                            candidate.defer.reject();
                        }
                    });

                    candidates = [];
                    timer = undefined;
                }, 0);
            }

            return defer.promise;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/focus-mediator.js.map
