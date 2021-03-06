(function () {
    'use strict';

    angular
        .module('ovpApp.components.header.menuItem', [
            'ovpApp.components.alert',
            'ui.router'
        ])
        .directive('menuItem', menuItem)
        // Exposed for unit testing
        .controller('MenuItemController', MenuItemController);

    /* @ngInject */
    function menuItem() {
        let directive = {
            bindToController: true,
            controller: MenuItemController,
            controllerAs: 'vm',
            templateUrl: '/js/ovpApp/components/header/menu-item.html',
            restrict: 'E',
            replace: true,
            scope: {
                item: '=',
                onClick: '=',
                onMouseup: '='
            }
        };

        return directive;
    }

    /* @ngInject */
    function MenuItemController($state, $rootScope, alert) {
        let vm = this;

        vm.itemClicked = itemClicked;
        vm.itemMouseUp = itemMouseUp;

        /////////////////

        // Exposed for unit testing
        vm._private = {
            itemClicked
        };

        function itemClicked($event) {
            $event.preventDefault();
            $event.stopPropagation();

            // Analytics:
            $rootScope.$broadcast('Analytics:menu-item-click', vm.item);

            if (!vm.item.enabled) {
                let analyticsModalName = null;
                if (angular.isDefined(vm.item.analytics) &&
                    'videoStore' === vm.item.analytics.elementStandardizedName) {
                    analyticsModalName = 'videoStoreUnavailable';
                }
                displayDisabledMessage(analyticsModalName);
            } else {
                $state.go(vm.item.link, vm.item.linkParams, vm.item.linkOptions);
            }

            if (vm.onClick) {
                vm.onClick();
            }
        }

        function itemMouseUp($event) {
            if (vm.onMouseup) {
                vm.onMouseup($event);
            }
        }

        function displayDisabledMessage(analyticsModalName = '') {
            alert.open({
                showCloseIcon: true,
                message: vm.item.disabledMessage(),
                title: vm.item.disabledTitle(),
                buttonText: 'OK',
                analyticsModalName: analyticsModalName
            });
        }
    }
})();
