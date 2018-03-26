(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.error', ['ngAria'])
        .component('ovpError', {
            bindings: {
                type: '<',
                message: '<'
            },
            templateUrl: '/js/ovpApp/components/ovp/ovp-error/ovp-error.html',
            controller: class OvpError {
                /* @ngInject */
                constructor(version) {
                    angular.extend(this, {version});
                }

                iconPath() {
                    let filename = 'icon-24-x-24-' + this.type + '.svg';
                    return this.version.appVersion + '/images/' + filename;
                }

            }
        });
})();
