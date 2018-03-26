(function () {
    'use strict';

    angular
        .module('ovpApp.directives.gridList.toggler', [
            'ovpApp.directives.focus'
        ])
        .directive('gridListToggler', gridListToggler);

    /* @ngInject */
    function gridListToggler() {
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: '/js/ovpApp/directives/grid-list-toggler.html',
            restrict: 'E',
            scope: {
                id: '=?id',
                tabIndex: '=?tabIndex'
            }
        };
        return directive;
    }

    /* @ngInject */
    function Controller(gridListTogglerService, $scope) {
        let vm = this;
        vm.toggle = toggle;
        vm.hasPagination = hasPagination;

        activate();

        ///////////////////

        function activate() {
            let registration = gridListTogglerService.register(undefined, vm.id);
            vm.state = registration.state;
            let sub = registration.source.subscribe(toggle);

            $scope.$on('$destroy', () => sub.dispose());
        }

        function hasPagination() {
            var paginationElement = angular.element('.pagination');
            return paginationElement.length ? true : false;
        }

        function toggle(newState) {
            if (newState !== vm.state) {
                vm.state = newState;
                gridListTogglerService.setState(newState, vm.id);
            }
        }
    }
})();
