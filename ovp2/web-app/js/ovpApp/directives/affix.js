/**
 * affix
 *
 * Conditionally applies the .affix class to the element, based on its position on the screen. Used for
 * switching to fixed positioning when the page scrolls far enough.
 *
 * usage:
 * <div affix="configObj"></div>
 *
 * configObj = {
 *    threshold: (number) When the element is this many pixels from the top, the .affix class will be applied.
 *    scroller: (string) selector of the element that will be scrolling. If omitted, $window will be used.
 * }
 *
 * example:
 * <div affix="{threshold: 50, scroller: '#scrollerId'}"></div>
 */

(function () {
    'use strict';

    angular
        .module('ovpApp.directives.affix', [])
        .directive('affix', affix);

    /* @ngInject */
    function affix($window, $parse) {
        const directive = {
            link,
            restrict: 'A'
        };
        return directive;

        ///////////////

        function link(scope, element, attr) {
            let config = $parse(attr.affix)(scope) || {};
            let scroller = config.scroller ? angular.element(config.scroller) : angular.element($window);
            let container = config.container ? angular.element(config.container) : angular.element($window);
            let threshold = config.threshold || 0;
            let offset = 0;

            scroller.bind('scroll', function () {
                const boundingRect = element[0].getBoundingClientRect();
                const containerRect = container[0].getBoundingClientRect();

                if (boundingRect.bottom > containerRect.bottom) {
                    // Hit the bottom of the container. Align it to the bottom of the container
                    offset -= boundingRect.bottom - containerRect.bottom;
                } else if (boundingRect.top < threshold && boundingRect.bottom < containerRect.bottom) {
                    // Hit the top of the window. Align it to the top of the window
                    offset += threshold - boundingRect.top;
                } else if (boundingRect.top > threshold) {
                    // Not aligned with anything. Align it to the top of the window, or the top of the container
                    offset -= Math.min(boundingRect.top - threshold, boundingRect.top - containerRect.top);
                }

                element.css('transform', `translateY(${offset}px)`);
            });
        }
    }
})();
