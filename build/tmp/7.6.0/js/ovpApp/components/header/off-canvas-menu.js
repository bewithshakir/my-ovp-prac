'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.offCanvasMenu', ['ovpApp.config', 'ovpApp.directives.focus', 'ovpApp.legacy.httpUtil']).component('offCanvasMenu', {
        bindings: {
            modalInstance: '<',
            resolve: '<'
        },
        templateUrl: '/js/ovpApp/components/header/off-canvas-menu.html',
        controller: (function () {
            /* @ngInject */

            OffCanvasMenu.$inject = ["config", "httpUtil", "$scope", "$window", "version"];
            function OffCanvasMenu(config, httpUtil, $scope, $window, version) {
                _classCallCheck(this, OffCanvasMenu);

                angular.extend(this, { config: config, httpUtil: httpUtil, $scope: $scope, $window: $window, version: version });
            }

            _createClass(OffCanvasMenu, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.userName = this.resolve.userName;
                    this.loggedIn = this.resolve.loggedIn;
                    this.$scope.$on('modal.closing', function () {
                        var body = angular.element(_this.$window.document).find('body');
                        body.removeClass('off-canvas-scrollbar');
                    });
                }
            }, {
                key: 'signOut',
                value: function signOut() {
                    this.httpUtil.logout();
                }
            }, {
                key: 'closeIcon',
                value: function closeIcon() {
                    return this.version.appVersion + '/images/close-x-22-x-22' + (this.activeCloseIcon ? '-active' : '') + '.svg';
                }
            }]);

            return OffCanvasMenu;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/header/off-canvas-menu.js.map
