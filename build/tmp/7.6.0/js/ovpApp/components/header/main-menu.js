'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.mainMenu', ['ovpApp.components.header.data', 'ovpApp.components.header.menuItem', 'ovpApp.oauth']).component('mainMenu', {
        templateUrl: '/js/ovpApp/components/header/main-menu.html',
        controller: (function () {
            /* @ngInject */

            MainMenu.$inject = ["menuData", "OauthService"];
            function MainMenu(menuData, OauthService) {
                _classCallCheck(this, MainMenu);

                angular.extend(this, { menuData: menuData, OauthService: OauthService });
            }

            _createClass(MainMenu, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.OauthService.waitUntilAuthenticated().then(function () {
                        return _this.menuData.getMainMenuItems();
                    }).then(function (menuItems) {
                        _this.menuItems = menuItems.filter(function (m) {
                            return m.id !== 'search';
                        });
                        _this.searchItem = menuItems.find(function (m) {
                            return m.id === 'search';
                        });
                    });
                }
            }]);

            return MainMenu;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/header/main-menu.js.map
