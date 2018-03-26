'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.renameStb', []).component('renameStb', {
        templateUrl: '/js/ovpApp/rdvr/rdvr-toolbar/rename-stb.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: (function () {
            /* @ngInject */

            RenameStb.$inject = ["stbService", "version"];
            function RenameStb(stbService, version) {
                _classCallCheck(this, RenameStb);

                angular.extend(this, { stbService: stbService, version: version });
            }

            _createClass(RenameStb, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.resolve) {
                        this.stb = this.resolve.stb;
                    }
                }
            }, {
                key: 'closeIcon',
                value: function closeIcon() {
                    return this.version.appVersion + '/images/close-x' + (this.activeCloseIcon ? '-active' : '') + '.svg';
                }
            }, {
                key: 'inputChanged',
                value: function inputChanged() {
                    // filter out special characters
                    this.newName = this.newName.replace(/\W/g, '');
                }
            }, {
                key: 'save',
                value: function save() {
                    if (this.newName !== this.stb.name) {
                        this.stb.name = this.newName;
                        this.stbService.postStbName(this.stb, this.newName);
                        this.modalInstance.close();
                    }
                }
            }]);

            return RenameStb;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/rdvr-toolbar/rename-stb.js.map
