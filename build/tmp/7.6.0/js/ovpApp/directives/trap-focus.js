/**
 * trap focus
 *
 * Catches tab and shift-tab keys and loops them around the navigable items inside the element, rather than letting
 * it move on to other elements.
 *
 * Typically this directive should be used in conjunction with some way of dismissing the element, such as an exit
 * button or a listener for the escape key. Such exit behavior is not built in to the trapFocus directive.
 *
 * usage:
 * <div trap-focus>
 *    <a href="#">first link</a>
 *    <a href="#">second link</a>
 * </div>
 *
 * In the above example, tab and shift tab will bounce between the first and second link.
 */

'use strict';

(function () {
    'use strict';

    trapFocus.$inject = ["$document"];
    angular.module('ovpApp.directives.trapFocus', []).directive('trapFocus', trapFocus);

    /* @ngInject */
    function trapFocus($document) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            var tabKey = 9;
            var tabbableSelector = 'a[href], area[href], input:not([disabled]):not([tabindex=\'-1\']), ' + 'button:not([disabled]):not([tabindex=\'-1\']),select:not([disabled]):not([tabindex=\'-1\']), ' + 'textarea:not([disabled]):not([tabindex=\'-1\']), ' + 'iframe, object, embed, *[tabindex]:not([tabindex=\'-1\']), *[contenteditable=true]';

            element.on('keydown', keyDownListener);

            scope.$on('$destroy', function () {
                return element.off('keydown', keyDownListener);
            });

            function keyDownListener(event) {
                if (event.isDefaultPrevented()) {
                    return event;
                }

                var focusChanged = false;
                if (event.which === tabKey) {
                    var list = getFocusList();
                    if (event.shiftKey && isFocussed(list[0])) {
                        focusChanged = setFocus(list[list.length - 1]);
                    } else if (!event.shiftKey && isFocussed(list[list.length - 1])) {
                        focusChanged = setFocus(list[0]);
                    }

                    if (focusChanged) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }

            function getFocusList() {
                var elements = element.find(tabbableSelector);
                return elements ? Array.prototype.filter.call(elements, function (el) {
                    return isVisible(el);
                }) : elements;
            }

            function isVisible(element) {
                return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
            }

            function isFocussed(element) {
                return element === $document[0].activeElement;
            }

            function setFocus(element) {
                if (element) {
                    element.focus();
                    return true;
                }
                return false;
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/trap-focus.js.map
