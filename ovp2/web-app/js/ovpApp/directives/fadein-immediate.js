(function () {
    'use strict';

    angular
        .module('ovpApp.directives.fadeinImmediate', [])
        .directive('fadeinImmediate', fadeinImmediate);

    /* @ngInject */
    function fadeinImmediate($timeout) {
        // Usage: <div fadein-immediate>hello world</div>
        //
        // Creates: immediately sets the div to opacity 1. Typically used with a css transition to animate this change
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            element.addClass('fade-in');
            $timeout(() => element[0].style.opacity = '1');
        }
    }
})();
