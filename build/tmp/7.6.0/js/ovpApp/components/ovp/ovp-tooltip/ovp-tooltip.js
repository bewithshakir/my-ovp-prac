'use strict';

(function () {
    'use strict';

    ovpTooltip.$inject = ["$timeout", "DEFAULT_SHOW_TIMEOUT", "DEFAULT_HIDE_TIMEOUT"];
    angular.module('ovpApp.components.ovp.tooltip', []).constant('DEFAULT_SHOW_TIMEOUT', 2000).constant('DEFAULT_HIDE_TIMEOUT', 1000).constant('ORIENTATIONS', {
        HORIZONTAL: 'horizontal', // Attempt to display on left or right of trigger
        VERTICAL: 'vertical', // Attempt to display above or below trigger
        LEFT: 'left', // Always display to the left of trigger
        RIGHT: 'right', // Always display to the right of trigger
        BOTTOM: 'bottom', // Always display below trigger
        TOP: 'top', // Always display above trigger
        AUTO: 'auto' // Display in whichever area has more viewport room.
    }).constant('POSITIONS', {
        TOP: 'top',
        BOTTOM: 'bottom',
        LEFT: 'left',
        RIGHT: 'right'
    }).constant('ARROW_WIDTH', 23).directive('ovpTooltip', ovpTooltip);

    /* @ngInject */
    function ovpTooltip($timeout, DEFAULT_SHOW_TIMEOUT, DEFAULT_HIDE_TIMEOUT) {

        var tooltipTimeout, currentScope;

        function enteredTrigger(scope) {
            currentScope = scope;
            $timeout.cancel(tooltipTimeout);
            tooltipTimeout = $timeout(function () {
                scope.show();
            }, DEFAULT_SHOW_TIMEOUT);
        }

        function leftTrigger(scope) {
            $timeout.cancel(tooltipTimeout);
            tooltipTimeout = $timeout(function () {
                scope.hide();
            }, DEFAULT_HIDE_TIMEOUT);
            tooltipTimeout.then(null, function () {
                if (currentScope !== scope) {
                    scope.hide();
                }
            });
        }

        function getNonNgParent($element) {
            while ($element.length > 0 && $element[0].tagName.toUpperCase().indexOf('NG-') === 0) {
                $element = $element.parent();
            }
            return $element;
        }

        return {
            restrict: 'E',
            controller: ['$scope', '$element', '$attrs', '$document', 'ORIENTATIONS', 'POSITIONS', 'ARROW_WIDTH', '$parse', function ($scope, $element, $attrs, $document, ORIENTATIONS, POSITIONS, ARROW_WIDTH, $parse) {

                $scope.orientation = $attrs.orientation || ORIENTATIONS.AUTO;

                $scope.positions = POSITIONS;

                // TODO - This should default to first parent
                // that is not ngInclude for when utilized within
                // views. Could potentially pass this in as an attrs somehow.
                $scope.trigger = getNonNgParent($element.parent());

                var enterTrigger = angular.bind(this, enteredTrigger, $scope),
                    leaveTrigger = angular.bind(this, leftTrigger, $scope);

                $scope.trigger.bind('mouseover', enterTrigger);
                $scope.trigger.bind('mouseout', leaveTrigger);

                $element.bind('mouseover', enterTrigger);
                $element.bind('mouseout', leaveTrigger);

                $scope.$on('$destroy', function () {
                    $timeout.cancel(tooltipTimeout);
                    $scope.trigger.unbind('mouseover', enterTrigger);
                    $scope.trigger.unbind('mouseout', leaveTrigger);
                    $element.unbind('mouseover', enterTrigger);
                    $element.unbind('mouseout', leaveTrigger);
                    $element.remove();
                });

                $scope.showTooltip = false;

                $scope.getRightPosition = function () {
                    return $scope.trigger.offset().left + $scope.trigger.outerWidth() + ARROW_WIDTH;
                };

                $scope.getLeftPosition = function () {
                    return $scope.trigger.offset().left - $element.outerWidth() - ARROW_WIDTH;
                };

                $scope.getHorizontalOrientation = function () {

                    var spaceLeft = $scope.trigger.offset().left - $document.scrollLeft(),
                        spaceRight = $document.outerWidth() + $document.scrollLeft() - ($scope.trigger.offset().left + $scope.trigger.outerWidth()),
                        leftPos;

                    if (spaceRight > spaceLeft) {
                        leftPos = $scope.getRightPosition();
                        $scope.position = POSITIONS.RIGHT;
                    } else {
                        leftPos = $scope.getLeftPosition();
                        $scope.position = POSITIONS.LEFT;
                    }

                    return {
                        top: $scope.trigger.offset().top + $scope.trigger.outerHeight() / 2 - $element.outerHeight() / 2 + 'px',
                        left: leftPos + 'px'
                    };
                };

                $scope.getPositioning = function () {

                    var position;

                    if ($scope.orientation === ORIENTATIONS.HORIZONTAL) {
                        position = $scope.getHorizontalOrientation();
                    } else {
                        throw 'Not implemented';
                    }

                    // If onPositionUpdate is provided call with
                    // current scope.
                    if ($attrs.onPositionUpdate) {
                        $parse($attrs.onPositionUpdate)($scope, {
                            position: position
                        });
                    }

                    return position;
                };

                $scope.show = function () {
                    if (!$scope.showTooltip) {
                        $scope.showTooltip = true;
                        $element.addClass('ovp-tooltip');

                        if ($attrs['class']) {
                            $element.addClass($attrs['class']);
                        }

                        $element.appendTo($document.context.body);
                        $element.css($scope.getPositioning());

                        $scope.$emit('tooltipShown');
                    }
                };

                $scope.hide = function () {
                    if ($scope.showTooltip) {
                        $scope.showTooltip = false;
                        $element.removeClass('ovp-tooltip');

                        if ($attrs['class']) {
                            $element.removeClass($attrs['class']);
                        }

                        $element.appendTo($scope.trigger);

                        $scope.$emit('tooltipClosed');
                    }
                };
            }],
            transclude: true,
            scope: false,
            templateUrl: '/js/ovpApp/components/ovp/ovp-tooltip/ovp-tooltip.html'
        };
    }
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-tooltip/ovp-tooltip.js.map
