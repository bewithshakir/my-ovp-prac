(function () {
    'use strict';

    angular.module('ovpApp.components.offCanvasMenu', [
        'ovpApp.config',
        'ovpApp.directives.focus',
        'ovpApp.legacy.httpUtil'
    ])
    .component('offCanvasMenu', {
        bindings: {
            modalInstance: '<',
            resolve: '<'
        },
        templateUrl: '/js/ovpApp/components/header/off-canvas-menu.html',
        controller: class OffCanvasMenu {
            /* @ngInject */
            constructor(config, httpUtil, $scope, $window, version) {
                angular.extend(this, {config, httpUtil, $scope, $window, version});
            }
            $onInit() {
                this.userName = this.resolve.userName;
                this.loggedIn = this.resolve.loggedIn;
                this.$scope.$on('modal.closing', () => {
                    var body = angular.element(this.$window.document).find('body');
                    body.removeClass('off-canvas-scrollbar');
                });
            }
            signOut() {
                this.httpUtil.logout();
            }
            closeIcon() {
                return this.version.appVersion + '/images/close-x-22-x-22' +
                    (this.activeCloseIcon ? '-active' : '') + '.svg';
            }
        }
    });
}());
