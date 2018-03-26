(function () {
    'use strict';

    angular
        .module('ovpApp.components.header.toggler', [
            'rx',
            'ui.router'
        ])
        .factory('headerToggler', headerToggler);

    /* @ngInject */
    function headerToggler($transitions, rx) {
        const source = rx.Observable
            .create(function (observer) {
                const dispose = $transitions.onSuccess({}, function (transition) {
                    observer.onNext(transition);
                });

                return dispose;
            })
            .map(isSearchState)
            .distinctUntilChanged()
            .shareReplay(1);

        const service = {
            source: source // Emits booleans indicating whether the header is in search mode
        };

        return service;

        ////////////////

        function isSearchState(transition) {
            return transition.to().name.startsWith('search');
        }
    }
})();
