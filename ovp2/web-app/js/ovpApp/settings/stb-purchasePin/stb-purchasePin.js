(function () {
    'use strict';
    angular.module('ovpApp.settings.stbPurchasePin', [
        'ovpApp.purchasePinDialog',
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.purchasePinService',
        'ovpApp.services.stbSettingsService',
        'ovpApp.services.stbPurchasePin',
        'ovpApp.services.errorCodes',
        'ovpApp.messages'
    ])
    .factory('stbPurchasePinPopUpConfig', stbPurchasePinPopUpConfig)
    .controller('STBPurchasePinController', STBPurchasePinController);

    /* @ngInject */
    function stbPurchasePinPopUpConfig(PIN_ENTRY_TYPE, errorCodesService, messages) {
        return function (pinService) {
            let purchasePinPopUpConfig = {};
            purchasePinPopUpConfig[PIN_ENTRY_TYPE.TOGGLE] = {
                pinInstructions: messages.getMessageForCode('MSG-9053'),
                pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                pinService: pinService,
                enableForgotPin: false
            };
            purchasePinPopUpConfig[PIN_ENTRY_TYPE.VALIDATE] = {
                pinInstructions: messages.getMessageForCode('MSG-9054'),
                pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                pinService: pinService,
                enableForgotPin: false
            };
            purchasePinPopUpConfig[PIN_ENTRY_TYPE.SAVE] = {
                headerMessage: messages.getMessageForCode('MSG-9056'),
                secondaryMessage: errorCodesService.getMessageForCode('TMP-9059'),
                pinInstructions: messages.getMessageForCode('MSG-9058'),
                pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                pinService: pinService,
                enableForgotPin: false
            };
            purchasePinPopUpConfig[PIN_ENTRY_TYPE.RESET] = {
                headerMessage: messages.getMessageForCode('MSG-9056'),
                secondaryMessage: errorCodesService.getMessageForCode('TMP-9059'),
                pinInstructions: messages.getMessageForCode('MSG-9057'),
                pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                pinService: pinService,
                enableForgotPin: false
            };
            return purchasePinPopUpConfig;
        };
    }

    /* @ngInject */
    function STBPurchasePinController($scope, $rootScope, $controller, $log, StbSettingsService, StbPurchasePinFactory,
        stbPurchasePinPopUpConfig, currentStb, $state, errorCodesService) {
        var pinService = StbPurchasePinFactory.create(currentStb);
        $controller('PurchasePinDialogController', {
            $scope: $scope,
            purchasePinService: pinService,
            purchasePinPopUpConfig: stbPurchasePinPopUpConfig(pinService)
        });
        $scope.stbUnavailable = false;
        $scope.purchasePinEnabledForStb = false;
        $scope.hasPin = false;
        $scope.unlocked = false;
        $scope.currentStb = currentStb;


        $scope.togglePinEnabled = function () {
            if (!$scope.hasPin || !$scope.unlocked) {
                $scope.handlePurchasePINValidation().then(() => {
                    $scope.togglePurchasePinForStb();
                    $scope.hasPin = true;
                    $scope.unlocked = true;
                });
            } else if ($scope.purchasePinEnabledForStb) {
                $scope.handlePurchasePINValidation().then(() => {
                    $scope.togglePurchasePinForStb();
                });
            } else if (!$scope.purchasePinEnabledForStb) {
                $scope.togglePurchasePinForStb();
            }
        };

        $scope.togglePurchasePinForStb = function () {
            $scope.purchasePinEnabledForStb = !$scope.purchasePinEnabledForStb;
            StbSettingsService.setEnablePurchasePINForClient(currentStb, $scope.purchasePinEnabledForStb)
                .then($scope.setPin, $scope.setPin);
        };

        $scope.setPin = function () {
            StbSettingsService.purchasePinEnabled(currentStb).then(enabled => {
                $scope.purchasePinEnabledForStb = enabled;
            }, function (error) {
                $log.error(error);
                $scope.stbUnavailable = true;
            });
            if ($scope.purchasePinEnabledForStb === undefined) {
                $scope.purchasePinEnabledForStb = false;
            }
        };

        $scope.init = function () {
            pinService.isPINSet().then(pinIsSet => {
                $scope.hasPin = pinIsSet;
                $rootScope.$broadcast('pageChangeComplete', $state.current);
            }, function (error) {
                $log.error(error);
                $rootScope.$broadcast('message:growl', errorCodesService.getMessageForCode('WGE-1001'));
            });
            $scope.setPin();
        };

        $scope.init();
    }
}());
