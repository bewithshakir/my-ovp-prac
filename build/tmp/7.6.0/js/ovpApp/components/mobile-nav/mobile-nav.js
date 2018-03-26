'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.mobileNav', ['ovpApp.components.header.data', 'ovpApp.directives.focus', 'ovpApp.legacy.httpUtil']).component('mobileNav', {
        templateUrl: '/js/ovpApp/components/mobile-nav/mobile-nav.html',
        controller: (function () {
            /* @ngInject */

            MobileNavController.$inject = ["$rootScope", "menuData", "httpUtil"];
            function MobileNavController($rootScope, menuData, httpUtil) {
                _classCallCheck(this, MobileNavController);

                angular.extend(this, {
                    $rootScope: $rootScope,
                    menuData: menuData,
                    httpUtil: httpUtil
                });
            }

            _createClass(MobileNavController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.hidden = true;
                    this.menuItemModels = [];

                    this.menuData.getMainMenuItems().then(function (models) {
                        return _this.menuItemModels = models;
                    });

                    this.$rootScope.$on('toggleMobileNav', function () {
                        return _this.hidden = !_this.hidden;
                    });

                    // anonymous function assigned to hide variable so that we can pass it to child elements
                    // and reference to `this` inside function will point to MobileNavController
                    this.hide = function () {
                        _this.hidden = true;
                        _this.$rootScope.$emit('mobileNavClosed');
                    };
                }
            }, {
                key: 'signOut',
                value: function signOut() {
                    this.httpUtil.logout();
                }
            }]);

            return MobileNavController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/mobile-nav/mobile-nav.js.map
