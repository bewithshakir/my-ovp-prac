(function () {
    'use strict';

    angular
        .module('ovpApp.components.settingsMenu', [])
        .directive('settingsMenu', settingsMenu)
        // Controller exposed for unit testing
        .controller('SettingsMenuController', SettingsMenuController);

    /* @ngInject */
    function settingsMenu() {
        let directive = {
            bindToController: true,
            controller: SettingsMenuController,
            controllerAs: 'vm',
            templateUrl: '/js/ovpApp/components/header/tools/settings-menu.html',
            restrict: 'E',
            replace: true,
            scope: {
                onClick: '=',
                focusNextVal: '@'
            }
        };

        return directive;
    }

    /* @ngInject */
    function SettingsMenuController($rootScope) {
        let vm = this;
        vm.doAction = doAction;
        vm.$rootScope = $rootScope;


        function doAction() {
            // Is this controller even used for anything?
            vm.$rootScope.$emit('Analytics:navigation-click', {elementName: 'liveTv'});

            if (vm.onClick) {
                vm.onClick();
            }
        }
    }

})();
