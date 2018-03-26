(() => {
    'use strict';

    angular
        .module('ovpApp.components.mobileNav', [
            'ovpApp.components.header.data',
            'ovpApp.directives.focus',
            'ovpApp.legacy.httpUtil'
        ])
        .component('mobileNav', {
            templateUrl: '/js/ovpApp/components/mobile-nav/mobile-nav.html',
            controller: class MobileNavController {
                /* @ngInject */
                constructor($rootScope, menuData, httpUtil) {
                    angular.extend(this, {
                        $rootScope,
                        menuData,
                        httpUtil
                    });
                }

                $onInit() {
                    this.hidden = true;
                    this.menuItemModels = [];

                    this.menuData.getMainMenuItems()
                        .then(models => this.menuItemModels = models);

                    this.$rootScope.$on('toggleMobileNav', () => this.hidden = !this.hidden);

                    // anonymous function assigned to hide variable so that we can pass it to child elements
                    // and reference to `this` inside function will point to MobileNavController
                    this.hide = () => {
                        this.hidden = true;
                        this.$rootScope.$emit('mobileNavClosed');
                    };
                }

                signOut() {
                    this.httpUtil.logout();
                }
            }
        });
})();
