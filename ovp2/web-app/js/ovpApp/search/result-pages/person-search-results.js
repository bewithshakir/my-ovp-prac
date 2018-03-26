(function () {
    'use strict';

    angular
        .module('ovpApp.search.personResults', [
            'ovpApp.directives.gridList',
            'ovpApp.search.resultListItem'
            ])
        .controller('PersonResultsController', PersonResultsController);

    /* @ngInject */
    function PersonResultsController($state, query, results, $rootScope) {
        var vm = this;
        vm.query = query;
        vm.results = results;
        vm.$rootScope = $rootScope;
        vm.focusOnLoad = $state.current.name.startsWith('search') &&
            $state.previous && $state.previous.name.startsWith('search');

        activate();

        ////////////////

        function activate() {
            vm.$rootScope.$broadcast('pageChangeComplete', $state.current);
        }
    }
})();
