(function () {
    'use strict';

    angular.module('ovpApp.components.pinEntry', ['rx', 'ovpApp.services.errorCodes'])
    .constant('PIN_ENTRY_TYPE', {
        TOGGLE: 'toggle',
        VALIDATE: 'validate',
        SAVE: 'save',
        RESET: 'reset'
    })
    .constant('DEFAULT_DEBOUNCE_DELAY', 100)
    .factory('Debouncer', function (rx, DEFAULT_DEBOUNCE_DELAY) {
        return class Debouncer {
            constructor(scope, delay) {
                delay = angular.isNumber(delay) ? delay : DEFAULT_DEBOUNCE_DELAY;
                this.subject = new rx.Subject();
                this.subject.debounce(delay)
                    .takeUntil(scope.$eventToObservable('$destroy'))
                    .subscribe(handler => {
                        if (angular.isFunction(handler)) {
                            scope.$applyAsync(handler);
                        }
                    });
            }
            debounce(handler) {
                this.subject.onNext(handler);
            }
        };
    });
}());
