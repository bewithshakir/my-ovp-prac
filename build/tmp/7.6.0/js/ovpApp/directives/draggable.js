'use strict';

(function () {
    'use strict';

    draggable.$inject = ["$document"];
    hhmmss.$inject = ["dateFormat"];
    hhmm.$inject = ["dateFormat"];
    angular.module('ovpApp.directives.draggable', ['ovpApp.config']).filter('hhmmss', hhmmss).filter('hhmm', hhmm).directive('draggable', draggable);

    /* @ngInject */
    function draggable($document) {
        return function (scope, element, attrs) {
            var startX = 0,
                eleX = 0,
                eleWidth = 0,
                x = 0,
                dragging = false; // Discard unexpected events

            attrs.$observe('disabled', function (disabled) {
                if (disabled === 'true') {
                    //ick
                    element.off('mousedown');
                } else {
                    init();
                }
            });

            function init() {
                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.screenX;
                    eleX = element[0].offsetLeft;
                    eleWidth = element[0].offsetWidth;
                    x = eleX + eleWidth / 2 + event.screenX - startX;
                    scope.$emit('slider-handle-drag-start', { position: x });
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                    dragging = true;
                });
            }

            function mousemove(event) {
                if (!dragging) {
                    return;
                }
                x = eleX + eleWidth / 2 + event.screenX - startX;
                scope.$emit('slider-handle-position-changed', {
                    position: x
                });
            }

            function mouseup() {
                if (!dragging) {
                    return;
                }
                dragging = false;
                scope.$emit('slider-handle-drag-end', {
                    position: x
                });
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }

            init();
        };
    }

    /* @ngInject */
    function hhmmss(dateFormat) {
        return dateFormat.hhmmss;
    }

    /* @ngInject */
    function hhmm(dateFormat) {
        return dateFormat.hhmm;
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/draggable.js.map
