(function () {
    'use strict';
    angular.module('ovpApp.settings.purchasePin', [
        'ovpApp.purchasePinDialog',
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.purchasePinService',
        'ovpApp.messages'
    ])
    .controller('PurchasePinController', PurchasePinController);

    /* @ngInject */
    function PurchasePinController($scope, $rootScope, $controller, $log, purchasePinService,
        messages, $state, purchaseSwitchFlag) {

        $controller('PurchasePinDialogController', {$scope: $scope, dialogText: messages});
        $scope.purchasePinEnabledForClient = false;
        $scope.hasPin = false;
        $scope.unlocked = false;


        $scope.init = function () {
            $scope.purchasePinEnabledForClient = purchaseSwitchFlag;
            $rootScope.$broadcast('pageChangeComplete', $state.current);
        };

        $scope.togglePinEnabled = function () {
            if (!$scope.hasPin || !$scope.unlocked) {
                $scope.handlePurchasePINValidation().then(() => {
                    $scope.togglePurchasePinForClient();
                    $scope.hasPin = true;
                    $scope.unlocked = true;
                });
            } else if ($scope.purchasePinEnabledForClient) {
                $scope.handlePurchasePINValidation().then(() => {
                    $scope.togglePurchasePinForClient();
                });
            } else if (!$scope.purchasePinEnabledForClient) {
                $scope.togglePurchasePinForClient();
            }
        };

        $scope.togglePurchasePinForClient = function () {
            if ($scope.purchasePinEnabledForClient === false) {
                $scope.purchasePinEnabledForClient = true;
                purchasePinService.enablePurchasePINForClient();

                // TODO: Analytics Event
                // $rootScope.$emit('EG:settingPurchasePinToggled', {
                //     enabled: true
                // });
            } else {
                $scope.purchasePinEnabledForClient = false;
                purchasePinService.disablePurchasePINForClient();

                // TODO: Analytics Event
                // $rootScope.$emit('EG:settingPurchasePinToggled', {
                //     enabled: false
                // });
            }
        };

        $scope.init();
    }
}());
