'use strict';

(function () {
    'use strict';
    productButton.$inject = ["config", "$state", "$parse"];
    productButtonActions.$inject = ["config", "$state", "$parse"];
    productActionsController.$inject = ["$scope", "actionTypeMap", "productActionService", "$controller", "$rootScope", "$timeout"];
    angular.module('ovpApp.product.button', ['ovpApp.config', 'ovpApp.product.actionMenu']).directive('productButton', productButton).directive('productButtonActions', productButtonActions);

    /* @ngInject */
    function productButton(config, $state, $parse) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: '/js/ovpApp/product/actions/product-button.html',
            link: function productButtonLinkFn($scope, $element, $attr) {
                if ($attr.action) {
                    $scope.item = $parse($attr.action)($scope);
                }

                if ($attr.asset) {
                    $scope.asset = $parse($attr.asset)($scope);
                }
            },
            controller: productActionsController
        };
    }

    /* @ngInject */
    function productButtonActions(config, $state, $parse) {
        //Creates an attribute directive to append functionality to an existing element
        return {
            restrict: 'A',
            scope: true,
            link: function productButtonLinkFn($scope, $element, $attr) {
                if ($attr.action) {
                    $scope.item = $parse($attr.action)($scope);
                }

                if ($attr.asset) {
                    $scope.asset = $parse($attr.asset)($scope);
                }

                $scope.$watch('item', function (nv) {
                    if (!(nv && $scope.isValid(nv.actionType))) {
                        $element.hide();
                    } else {
                        $element.show();
                    }
                });
            },
            controller: productActionsController
        };
    }

    /* @ngInject */
    function productActionsController($scope, actionTypeMap, productActionService, $controller, $rootScope, $timeout) {

        var defaults = {
            imageWidth: 144
        };
        $scope.productLoading = false;
        $scope.itemConfig = defaults;

        $scope.$watch('containerConfig', function (newVal) {
            if (newVal && newVal.itemConfig) {
                $scope.itemConfig = angular.extend({}, defaults, newVal.itemConfig);
            }
        });

        $scope.$on('product:update-started', function (event, asset, action, promise) {
            $scope.productLoading = true;
            if (promise) {
                promise.then(function () {
                    $scope.productLoading = false;
                }, function () {
                    $scope.productLoading = false;
                });
            } else {
                $timeout(function () {
                    $scope.productLoading = false;
                }, 1000);
            }
        });

        $scope.isValid = function (actionType) {
            return angular.isDefined(actionTypeMap[actionType]) && actionTypeMap[actionType].id;
        };

        $scope.disabled = function (actionType) {
            return angular.isDefined(actionTypeMap[actionType]) && !!actionTypeMap[actionType].disabled;
        };

        $scope.actionTypeToLabel = function (action) {
            if (action) {
                return productActionService.getActionLabel($scope.asset, action);
            }
        };

        $scope.actionTypeToHoverText = function (action) {
            if (action) {
                return productActionService.getActionHoverText($scope.asset, action);
            }
        };

        $scope.actionTypeToOtherWaysToWatchSrOnlyLabel = function (action) {
            if (actionTypeMap[$scope.item.actionType].otherWaysToWatchSrOnlyLabel) {
                return productActionService.getOtherWaysToWatchSrOnlyLabel($scope.asset, action);
            } else {
                //Default - fallback to hover text
                return $scope.actionTypeToHoverText(action);
            }
        };

        // Action label to use in more ways to watch
        $scope.actionTypeToOtherWaysLabel = function (action) {
            if (action) {
                return productActionService.getOtherWaysActionLabel($scope.asset, action);
            }
        };

        $scope.actionTypeToButtonGraphic = function (action) {
            if (action && productActionService.getActionIcon($scope.asset, action)) {
                return '#' + productActionService.getActionIcon($scope.asset, action);
            }
        };

        $scope.id = function (item) {
            return item ? 'button-' + item.actionType + '-' + item.streamIndex : '';
        };

        $scope.productActionClicked = function (item, asset, evt) {
            productActionService.executeAction(item, asset, evt);
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/actions/product-button.js.map
