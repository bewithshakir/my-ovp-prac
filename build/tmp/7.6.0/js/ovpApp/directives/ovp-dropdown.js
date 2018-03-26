'use strict';

(function () {
    'use strict';

    Controller.$inject = ["$scope", "$controller"];
    angular.module('ovpApp.directives.dropdown', ['ovpApp.components.baseDropdown', 'ovpApp.directives.focus']).directive('ovpDropdown', ovpDropdown);

    /* @ngInject */
    function ovpDropdown() {
        // Usage:
        // <ovp-dropdown items="someArray" config="configObj"></ovp-dropdown>
        //
        // someArray = [{
        //    text: "this will display on a row of the dropdown",
        //    clickCallback: () => console.log("I've been clicked!")
        // }]
        //
        // config = {
        //    title: (string or function) specifies what to display on the dropdown button itself. If a function
        //        the function will be called with whatever the currently selected item is as a parameter.
        //    description: (string) a message that will be visible at the top of the dropdown list after the
        //        dropdown is expanded. This message cannot be clicked.
        //    startingIndex: (number) The index of the item that should be selected initially.
        // }
        return {
            bindToController: true,
            templateUrl: '/js/ovpApp/directives/ovp-dropdown.html',
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            scope: {
                'items': '=',
                'config': '='
            }
        };

        function link($scope) {
            $scope.vm.focusButton = $scope.vm.config.focusOnLoad || false;
        }
    }

    /* @ngInject */
    function Controller($scope, $controller) {
        var vm = this;
        vm.status = { isOpen: false };
        vm.getTitle = getTitle;
        vm.config = vm.config || {};
        vm.items = vm.items || [];
        vm.activeIndex = vm.config.startingIndex !== undefined ? vm.config.startingIndex : -1;
        vm.getActiveItem = getActiveItem;
        vm.click = click;

        activate();

        ///////////////////

        function activate() {}

        function getTitle() {
            var activeItem = getActiveItem();
            if (vm.config.title) {
                if (angular.isFunction(vm.config.title)) {
                    return vm.config.title(activeItem);
                } else {
                    return vm.config.title;
                }
            } else {
                return activeItem && activeItem.text || '';
            }
        }

        function getActiveItem() {
            return vm.items[vm.activeIndex];
        }

        function click(item) {
            var index = vm.items.indexOf(item);
            if (index !== vm.activeIndex) {
                vm.activeIndex = index;
                $scope.$emit('dropdown:itemclicked', item);
            }

            if (item.clickCallback) {
                item.clickCallback();
            }
            vm.focusButton = true;
        }

        angular.extend(this, $controller('BaseDropdownController', { $scope: $scope }));
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/ovp-dropdown.js.map
