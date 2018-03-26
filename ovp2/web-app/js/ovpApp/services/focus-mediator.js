(function () {
    'use strict';

    /**
     * Used to resolve conflicting rules about where to place the focus
     */

    angular
        .module('ovpApp.services.focusMediator', [
            'lib.platform'
        ])
        .factory('focusMediator', focusMediator);

    /* @ngInject */
    function focusMediator($timeout, platform, $q) {
        let candidates = [];
        let timer;

        const service = {
            requestFocus,
            lowPriority: 0,
            highPriority: 100
        };
        return service;

        ////////////////

        function requestFocus(priority) {
            const defer = $q.defer();

            candidates.push({priority, defer});

            if (!timer) {
                timer = $timeout(() => {
                    candidates.sort((a, b) => b.priority - a.priority);
                    candidates.forEach((candidate, index) => {
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
