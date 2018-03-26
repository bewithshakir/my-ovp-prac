'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.pinEntry.message', []).component('pinEntryMessage', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/pin-entry/pin-entry-message.html',
        controller: (function () {
            function PinEntryMessageController() {
                _classCallCheck(this, PinEntryMessageController);
            }

            _createClass(PinEntryMessageController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.tagRegex = /(<[^>]+>)/g;
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.resolve) {
                        var options = this.resolve.options || {};
                        this.headerMessage = options.headerMessage;
                        this.secondaryMessage = options.secondaryMessage;
                    }
                }
            }]);

            return PinEntryMessageController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/pin-entry/pin-entry-message.js.map
