'use strict';

(function () {
    'use strict';

    headerToggler.$inject = ["$transitions", "rx"];
    angular.module('ovpApp.components.header.toggler', ['rx', 'ui.router']).factory('headerToggler', headerToggler);

    /* @ngInject */
    function headerToggler($transitions, rx) {
        var source = rx.Observable.create(function (observer) {
            var dispose = $transitions.onSuccess({}, function (transition) {
                observer.onNext(transition);
            });

            return dispose;
        }).map(isSearchState).distinctUntilChanged().shareReplay(1);

        var service = {
            source: source // Emits booleans indicating whether the header is in search mode
        };

        return service;

        ////////////////

        function isSearchState(transition) {
            return transition.to().name.startsWith('search');
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/header/header-toggler.js.map
