'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.pinEntry', ['rx', 'ovpApp.services.errorCodes']).constant('PIN_ENTRY_TYPE', {
        TOGGLE: 'toggle',
        VALIDATE: 'validate',
        SAVE: 'save',
        RESET: 'reset'
    }).constant('DEFAULT_DEBOUNCE_DELAY', 100).factory('Debouncer', ["rx", "DEFAULT_DEBOUNCE_DELAY", function (rx, DEFAULT_DEBOUNCE_DELAY) {
        return (function () {
            function Debouncer(scope, delay) {
                _classCallCheck(this, Debouncer);

                delay = angular.isNumber(delay) ? delay : DEFAULT_DEBOUNCE_DELAY;
                this.subject = new rx.Subject();
                this.subject.debounce(delay).takeUntil(scope.$eventToObservable('$destroy')).subscribe(function (handler) {
                    if (angular.isFunction(handler)) {
                        scope.$applyAsync(handler);
                    }
                });
            }

            _createClass(Debouncer, [{
                key: 'debounce',
                value: function debounce(handler) {
                    this.subject.onNext(handler);
                }
            }]);

            return Debouncer;
        })();
    }]);
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/pin-entry/pin-entry.js.map
