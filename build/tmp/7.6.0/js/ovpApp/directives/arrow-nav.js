'use strict';

(function () {
    'use strict';

    /**
     * Adds arrow navigation to a list. Tab will land the user on the first element of the list, and then
     * arrrows can be used to move within the list.
     *
     * usage:
     * <div arrow-nav="some-class">
     *    <div ng-repeat="thing in $ctrl.things" class="some-class"></div>
     * </div>
     *
     * or, to stop shift-tabs from exiting the list
     *
     * <div arrow-nav="some-class" arrow-nav-options="{noShiftTabExit: true}">
     *    <div ng-repeat="thing in $ctrl.things" class="some-class"></div>
     * </div>
     *
     * or, if the list is prone to changing at runtime, you must supply an ng-model
     *
     * <div arrow-nav="some-class" ng-model="$ctrl.things">
     *    <div ng-repeat="thing in $ctrl.things" class="some-class"></div>
     * </div>
     *
     * options:
     *   noShiftTabExit: if true, then when the user hits shift tab from inside the list
     *      they are returned to the first element of the list, rather than exiting the list
     */
    arrowNav.$inject = ["$timeout"];
    angular.module('ovpApp.directives.arrowNav', []).directive('arrowNav', arrowNav);

    var keys = { left: 37, up: 38, right: 39, down: 40, tab: 9 };

    /* @ngInject */
    function arrowNav($timeout) {
        return {
            restrict: 'A',
            link: function link(scope, el, attrs) {
                var focusableElements = undefined;
                var options = attrs.arrowNavOptions || {};

                $timeout(registerEvents, 0, false);
                if (attrs.ngModel) {
                    scope.$watch(attrs.ngModel, function () {
                        $timeout(registerEvents, 0, false);
                    });
                }

                scope.$on('$destroy', function () {
                    if (focusableElements) {
                        focusableElements.off('keydown', eventHandler);
                    }
                });

                function registerEvents() {
                    focusableElements = angular.element(el[0]).find('.' + attrs.arrowNav);
                    for (var i = 0; i < focusableElements.length; i++) {
                        focusableElements[i].setAttribute('tabindex', i === 0 ? '0' : '-1');
                    }

                    focusableElements.off('keydown', eventHandler);
                    focusableElements.on('keydown', eventHandler);
                }

                function eventHandler(event) {
                    if (event.keyCode === keys.right || event.keyCode === keys.down) {
                        var index = findIndex(event.target);
                        if (focusableElements[index + 1]) {
                            focusableElements[index + 1].focus();
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    } else if (event.keyCode === keys.left || event.keyCode === keys.up) {
                        var index = findIndex(event.target);
                        if (focusableElements[index - 1]) {
                            focusableElements[index - 1].focus();
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    } else if (event.keyCode === keys.tab) {
                        if (options.noShiftTabExit !== false) {
                            // reset focus to first element so shift-tab can exit correctly
                            focusableElements[0].focus();
                            // Deliberately not calling preventDefault();
                        }
                    }
                }

                function findIndex(el) {
                    return Array.prototype.indexOf.call(focusableElements, el);
                }
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/arrow-nav.js.map
