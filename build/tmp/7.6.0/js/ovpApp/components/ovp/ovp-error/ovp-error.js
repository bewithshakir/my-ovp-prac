'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.error', ['ngAria']).component('ovpError', {
        bindings: {
            type: '<',
            message: '<'
        },
        templateUrl: '/js/ovpApp/components/ovp/ovp-error/ovp-error.html',
        controller: (function () {
            /* @ngInject */

            OvpError.$inject = ["version"];
            function OvpError(version) {
                _classCallCheck(this, OvpError);

                angular.extend(this, { version: version });
            }

            _createClass(OvpError, [{
                key: 'iconPath',
                value: function iconPath() {
                    var filename = 'icon-24-x-24-' + this.type + '.svg';
                    return this.version.appVersion + '/images/' + filename;
                }
            }]);

            return OvpError;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-error/ovp-error.js.map
