'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.directives.dropdownList', ['ovpApp.directives.arrowNav', 'ovpApp.directives.keydown']).directive('ovpDropdownList', ovpDropdownList);

    /* @ngInject */
    function ovpDropdownList() {
        // Usage:
        // <ovp-dropdown items="someArray" config="configObj"></ovp-dropdown>
        //
        // someArray = [{
        //    text: "this will display on a row of the dropdown"
        // }]
        //
        // config = {
        //    title: (string or function) specifies what to display on the dropdown button itself. If a function
        //        the function will be called with whatever the currently selected item is as a parameter.
        //    activeIndex: (number) The index of the item that should be selected.
        //    onSelect: () => console.log("I've been clicked!")
        // }
        Controller.$inject = ["$scope", "$element", "$document", "$timeout"];
        return {
            bindToController: true,
            templateUrl: '/js/ovpApp/directives/ovp-dropdown-list.html',
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

        /* @ngInject */
        function Controller($scope, $element, $document, $timeout) {
            var vm = this;
            vm.getTitle = getTitle;
            vm.config = vm.config || {};
            vm.items = vm.items || [];
            vm.config.activeIndex = vm.config.activeIndex ? vm.config.activeIndex : 0;
            vm.getActiveItem = getActiveItem;
            vm.click = click;
            vm.onButtonKeydown = onButtonKeydown;
            vm.onDropdownListKeydown = onDropdownListKeydown;
            vm.onListItemBlur = onListItemBlur;
            vm.onButtonBlur = onListItemBlur;
            vm.onKeydown = onKeydown;
            vm.onKeyup = onKeyup;
            vm.toggleDropdown = toggleDropdown;

            activate();

            ///////////////////

            function activate() {}

            function onButtonKeydown(event) {
                if (event.keyCode === 40 || event.keyCode === 39) {
                    event.preventDefault();
                    event.stopPropagation();
                    angular.element($element[0]).find('.listitem')[0].focus();
                } else if (event.keyCode === 9) {
                    vm.showDropdown = false;
                }
            }

            function onDropdownListKeydown(event) {
                if (event.keyCode === 9) {
                    // Tab key
                    vm.showDropdown = false;
                }
            }

            // Escape key handler - START
            function onKeydown(event) {
                if (event.keyCode === 27 && vm.showDropdown) {
                    // Escape key
                    event.preventDefault();
                    event.stopPropagation();
                }
            }

            function onKeyup(event) {
                if (event.keyCode === 27 && vm.showDropdown) {
                    // Escape key
                    vm.showDropdown = false;
                    vm.focusButton = true;
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            // Escape key handler - END

            function onListItemBlur() {
                // Focus is not on a list item
                // Note: we can not check for event.relatedTarget because of
                // known IE issue - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101237/
                // Wait for element to focus and then get the active element
                $timeout(function () {
                    var activeElement = angular.element($document[0].activeElement);
                    if (!activeElement.hasClass('listitem') && // click somewhere else
                    !activeElement.hasClass('ovp-dropdown-list-container')) {
                        // click on scrollbar
                        vm.showDropdown = false;
                    }
                }, 0);
            }

            function getTitle() {
                var activeItem = getActiveItem();
                if (vm.config.title) {
                    if (angular.isFunction(vm.config.title)) {
                        return vm.config.title(activeItem);
                    } else {
                        return vm.config.title;
                    }
                } else {
                    return activeItem && (activeItem.text || activeItem.label) || '';
                }
            }

            function getActiveItem() {
                return vm.items[vm.config.activeIndex];
            }

            function click(index) {
                if (index !== vm.config.activeIndex) {
                    vm.config.activeIndex = index;
                }

                if (vm.config.onSelect) {
                    vm.config.onSelect(vm.items[index]);
                } else if (vm.items[index].clickCallback) {
                    vm.items[index].clickCallback();
                }
            }

            function toggleDropdown(event) {
                // Toggle allowed only if there are multiple items to select
                if (vm.items.length > 1) {
                    vm.showDropdown = !vm.showDropdown;
                }
                // Button does NOT focus on click (known issue safari and FF on mac)
                // https://gist.github.com/cvrebert/68659d0333a578d75372
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
                if (event.type === 'click') {
                    event.target.focus();
                }
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/ovp-dropdown-list.js.map
