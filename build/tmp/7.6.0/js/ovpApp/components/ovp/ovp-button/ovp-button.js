'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.button', ['ngAria']).component('ovpButton', {
        bindings: {
            label: '@',
            disabled: '@', // TODO: this should be refactored to be a boolean, not a string
            icon: '@',
            focus: '@',
            wide: '<',
            onClick: '&',
            onClickConfirm: '&?'
        },
        templateUrl: '/js/ovpApp/components/ovp/ovp-button/ovp-button.html',
        controller: (function () {
            /* @ngInject */

            ComponentName.$inject = ["$element", "$parse"];
            function ComponentName($element, $parse) {
                _classCallCheck(this, ComponentName);

                angular.extend(this, { $element: $element, $parse: $parse });
            }

            _createClass(ComponentName, [{
                key: '$onInit',
                value: function $onInit() {
                    this.hasClickConfirm = this.onClickConfirm && this.onClickConfirm();
                }
            }, {
                key: '$postLink',
                value: function $postLink() {
                    this.$element.addClass('ovp-button');
                }
            }, {
                key: 'iconClass',
                value: function iconClass() {
                    var _this = this;

                    var classNames = {
                        icon: !!this.icon
                    };
                    var possibilities = ['watch-now', 'record-series', 'record-show', 'locked'];
                    possibilities.forEach(function (iconName) {
                        if (_this.icon == iconName) {
                            classNames[iconName] = true;
                        }
                    });
                    return classNames;
                }
            }]);

            return ComponentName;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-button/ovp-button.js.map
