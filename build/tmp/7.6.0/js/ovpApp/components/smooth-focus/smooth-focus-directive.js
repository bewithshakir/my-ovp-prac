'use strict';

(function () {
    'use strict';
    smoothFocus.$inject = ["$window", "rx"];
    angular.module('ovpApp.directives.smooth-focus', ['rx']).directive('smoothFocus', smoothFocus);

    /* @ngInject */
    function smoothFocus($window, rx) {
        var minimumTopMargin = 187;
        return {
            link: function link($scope, $element) {
                var source = rx.Observable.fromEvent($element, 'focusin');
                source.debounce(50).subscribe(fixPosition);
            }
        };

        function fixPosition(event) {
            var focusedElement = angular.element(event.target);
            var currentScrollPosition = angular.element($window).scrollTop();
            var focusPosition = focusedElement.offset().top - currentScrollPosition;
            var focussedElementBottom = focusedElement.offset().top + focusedElement.outerHeight(true);

            if (focusPosition < minimumTopMargin && currentScrollPosition > 0) {
                var scrollAdd = minimumTopMargin - focusPosition;
                var _scrollTo = currentScrollPosition - scrollAdd;
                if (_scrollTo < 0) {
                    _scrollTo = 0;
                }
                angular.element('html, body').animate({
                    scrollTop: _scrollTo
                }, 100, 'swing');
            }

            // Check if the focussed element extends outside the viewport
            if (focussedElementBottom > currentScrollPosition + $window.innerHeight && focusedElement.outerHeight(true) <= $window.innerHeight - minimumTopMargin) {
                // calculate the value by which element
                // should scroll such that it shows up on the viewport completely.
                var _scrollTo2 = focussedElementBottom - $window.innerHeight;
                angular.element('html, body').animate({
                    scrollTop: _scrollTo2
                }, 100, 'swing');
            }
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/smooth-focus/smooth-focus-directive.js.map
