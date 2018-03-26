'use strict';

(function () {
    'use strict';
    angular.module('ovpApp.product.actionMenu', ['ovpApp.services.bookmark', 'ovpApp.product.button', 'ovpApp.product.productActionService']).directive('actionMenu', ActionMenu);

    /* @ngInject */
    function ActionMenu() {
        ActionMenuController.$inject = ["$scope", "productActionService"];
        var directive = {
            restrict: 'E',
            scope: {
                actions: '=',
                asset: '='
            },
            templateUrl: '/js/ovpApp/product/actions/action-menu.html',
            controller: ActionMenuController,
            link: function link($scope, $element) {
                $element.on('focus', '.hoverwatch', updateHoverText('blur'));
                $element.on('mouseenter', '.hoverwatch', updateHoverText('mouseleave'));

                function updateHoverText(endEvent) {
                    return function (e) {
                        if (e.currentTarget) {
                            var target = angular.element(e.currentTarget);
                            var buttonScope = target.scope();
                            if (buttonScope.item) {
                                $scope.hoveredItem = buttonScope.item;
                                $scope.$applyAsync();
                                target.off(endEvent, endEventHandler);
                                target.on(endEvent, { buttonScope: buttonScope }, endEventHandler);
                            }
                        }
                    };
                }

                function endEventHandler(ev) {
                    if ($scope.hoveredItem === ev.data.buttonScope.item) {
                        $scope.hoveredItem = undefined;
                        $scope.$applyAsync();
                    }
                }
            }
        };

        return directive;

        /* @ngInject */
        function ActionMenuController($scope, productActionService) {
            $scope.carouselConfig = {
                showReturnArrow: false,
                useArrows: false
            };

            $scope.hoveredItem = undefined;

            $scope.getHoverText = function () {
                var text = $scope.hoveredItem && productActionService.getActionHoverText($scope.asset, $scope.hoveredItem);
                return text || '';
            };
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/actions/action-menu.js.map
