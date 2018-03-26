(function () {
    'use strict';

    angular.module('ovpApp.components.mainMenu', [
        'ovpApp.components.header.data',
        'ovpApp.components.header.menuItem',
        'ovpApp.oauth'
    ])
    .component('mainMenu', {
        templateUrl: '/js/ovpApp/components/header/main-menu.html',
        controller: class MainMenu {
            /* @ngInject */
            constructor(menuData, OauthService) {
                angular.extend(this, {menuData, OauthService});
            }

            $onInit() {
                this.OauthService.waitUntilAuthenticated()
                    .then(() => this.menuData.getMainMenuItems())
                    .then(menuItems => {
                        this.menuItems = menuItems.filter(m => m.id !== 'search');
                        this.searchItem = menuItems.find(m => m.id === 'search');
                    });
            }
        }
    });
}());
