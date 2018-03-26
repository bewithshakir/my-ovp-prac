(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.clickConfirm', ['ovpApp.components.popup'])
        .controller('OvpClickConfirmController', OvpClickConfirmController)
        .factory('clickOverride', clickOverride)
        .directive('ovpClickConfirm', ovpClickConfirm);

    /* @ngInject */
    function OvpClickConfirmController($scope) {
        $scope.confirm = function () {
            $scope.popup.close();
            $scope.ngClick.call();
        };

        $scope.cancel = function () {
            $scope.popup.close();
        };
    }

    /* @ngInject */
    function clickOverride($timeout, $q, $templateRequest, popUpService, $parse) {
        return function (parentScope, $element, $attrs, $event) {

            // Create a new scope for the popup
            var popupScope = parentScope.$new(false),
                popupDefer = $q.defer(),
                clickConfirm =  $parse($attrs.ovpClickConfirm)(popupScope),
                templateDefer = $templateRequest(
                                    '/js/ovpApp/components/ovp/ovp-click-confirm/ovp-click-confirm.html'
                                );

            popupScope.clickConfirm = clickConfirm;

            templateDefer.then(function (template) {

                popupScope.ngClick = function () {
                    $parse($attrs.ngClick)(popupScope, { $event: $event });
                };

                // This dialog is never shown on the player page,
                // so we always return the jQLite wrapped body element
                popupScope.parentContainer = function () {
                    return angular.element('body');
                };

                popupScope.popup = popUpService.show({
                    template: template,
                    showCloseIcon: false,
                    overlayClickClosesPopup: false,
                    deferred: popupDefer
                }, popupScope);

            }, function () {
                throw 'Error pulling template';
            });

            popupDefer.promise.then(function () {
                popupScope.$destroy();
            });
        };
    }


    /* @ngInject */
    function ovpClickConfirm(clickOverride) {
        return {
            restrict: 'A',
            scope: false,
            // Has to run prior to ngClick and after
            // ovp-button for disabled buttons.
            priority: -1,
            link: function (scope, element, attrs) {

                if (!attrs.ngClick) {
                    throw 'ngClick directive must be provided as an attribute for use with ovp-click-confirm.';
                }

                // Add our new click handler with confirm
                element.on('click', function (e) {
                    // Handle click ourselves if ngClick was provided.
                    clickOverride(scope, element, attrs, e);
                    e.stopImmediatePropagation();
                });

                scope.$on('$destroy', function () {
                    element.off();
                });
            }
        };
    }
}());
