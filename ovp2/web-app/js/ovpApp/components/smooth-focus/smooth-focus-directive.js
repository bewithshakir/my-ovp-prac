(function () {
    'use strict';
    angular.module('ovpApp.directives.smooth-focus', ['rx'])
    .directive('smoothFocus', smoothFocus);

    /* @ngInject */
    function smoothFocus($window, rx) {
        var minimumTopMargin = 187;
        return {
            link: function ($scope, $element) {
                let source = rx.Observable.fromEvent($element, 'focusin');
                source.debounce(50).subscribe(fixPosition);
            }
        };

        function fixPosition(event) {
            let focusedElement = angular.element(event.target);
            let currentScrollPosition = angular.element($window).scrollTop();
            let focusPosition = focusedElement.offset().top - currentScrollPosition;
            let focussedElementBottom = focusedElement.offset().top + focusedElement.outerHeight(true);

            if (focusPosition < minimumTopMargin && currentScrollPosition > 0) {
                let scrollAdd = minimumTopMargin - focusPosition;
                let scrollTo = currentScrollPosition - scrollAdd;
                if (scrollTo < 0) {
                    scrollTo = 0;
                }
                angular.element('html, body').animate({
                    scrollTop: scrollTo
                }, 100, 'swing');
            }

            // Check if the focussed element extends outside the viewport
            if (focussedElementBottom > (currentScrollPosition + $window.innerHeight) &&
                focusedElement.outerHeight(true) <= $window.innerHeight - minimumTopMargin) {
                // calculate the value by which element
                // should scroll such that it shows up on the viewport completely.
                let scrollTo = focussedElementBottom - $window.innerHeight;
                angular.element('html, body').animate({
                    scrollTop: scrollTo
                }, 100, 'swing');
            }
        }
    }
}());
