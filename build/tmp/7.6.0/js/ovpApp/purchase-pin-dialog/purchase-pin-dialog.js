'use strict';

(function () {
    'use strict';

    purchasePinPopUpConfig.$inject = ["PIN_ENTRY_TYPE", "purchasePinService", "errorCodesService", "messages"];
    PurchasePinDialogController.$inject = ["$scope", "$rootScope", "$q", "$log", "modal", "PIN_ENTRY_TYPE", "purchasePinService", "purchasePinPopUpConfig", "promiseTracker", "errorCodesService"];
    angular.module('ovpApp.purchasePinDialog', ['ovpApp.components.pinEntry', 'ovpApp.services.purchasePinService', 'ovpApp.components.authForm', 'ovpApp.components.modal', 'ajoslin.promise-tracker', 'ovpApp.services.errorCodes', 'ovpApp.messages']).factory('purchasePinPopUpConfig', purchasePinPopUpConfig).controller('PurchasePinDialogController', PurchasePinDialogController);

    /* @ngInject */
    function purchasePinPopUpConfig(PIN_ENTRY_TYPE, purchasePinService, errorCodesService, messages) {
        var config = {};
        config[PIN_ENTRY_TYPE.TOGGLE] = {
            pinInstructions: messages.getMessageForCode('MSG-9053'),
            pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
            pinService: purchasePinService
        };
        config[PIN_ENTRY_TYPE.VALIDATE] = {
            pinInstructions: messages.getMessageForCode('MSG-9054'),
            pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
            pinService: purchasePinService
        };
        config[PIN_ENTRY_TYPE.SAVE] = {
            headerMessage: messages.getMessageForCode('MSG-9056'),
            secondaryMessage: messages.getMessageForCode('MSG-9050'),
            pinInstructions: messages.getMessageForCode('MSG-9058'),
            pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
            pinService: purchasePinService
        };
        config[PIN_ENTRY_TYPE.RESET] = {
            headerMessage: messages.getMessageForCode('MSG-9056'),
            secondaryMessage: messages.getMessageForCode('MSG-9050'),
            pinInstructions: messages.getMessageForCode('MSG-9057'),
            pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
            pinService: purchasePinService
        };
        return config;
    }

    /* @ngInject */
    function PurchasePinDialogController($scope, $rootScope, $q, $log, modal, PIN_ENTRY_TYPE, purchasePinService, purchasePinPopUpConfig, promiseTracker, errorCodesService) {
        var forgotPin = false,
            pinValidated = false,
            pinReset = false;

        $scope.handlePurchasePINValidation = handlePurchasePINValidation;
        $scope.showPinValidationDialog = showPinValidationDialog;

        activate();

        return;

        ////////////

        function activate() {
            $scope.loadingTracker = promiseTracker();
        }

        function authenticateMasterPassword() {
            return modal.open({
                windowClass: 'productPopup-temp',
                component: 'authForm'
            }).result;
        }

        function handlePurchasePINValidation() {
            forgotPin = false;
            pinValidated = false;
            pinReset = false;

            return purchasePinService.isPINSet().then(function (pinIsSet) {
                if (pinIsSet) {
                    var options = purchasePinPopUpConfig[PIN_ENTRY_TYPE.TOGGLE];
                    return showPinValidationDialog(options);
                } else {
                    return purchasePinService.isPrimaryAccount().then(function (isPrimaryAccount) {
                        if (isPrimaryAccount) {
                            return undefined;
                        } else {
                            return authenticateMasterPassword();
                        }
                    }).then(function (password) {
                        return showPinResetDialog(password);
                    });
                }
            }, function (error) {
                $log.error(error);
                $rootScope.$broadcast('message:growl', errorCodesService.getMessageForCode('WGE-1001'));
                return $q.reject(error);
            });
        }

        function showPinValidationDialog(options) {
            $rootScope.$emit('Analytics:showPinDialog', {
                context: 'tvodFlow'
            });

            return modal.open({
                component: 'pinValidate',
                resolve: { options: options }
            }).result.then(function (result) {
                if (result === 'pinValidated') {
                    pinValidated = true;
                }

                $rootScope.$emit('Analytics:closePinDialog', {
                    pinValidated: true
                });
            }, function (dismissReason) {
                $rootScope.$emit('Analytics:closePinDialog', {
                    pinValidated: false
                });

                if (dismissReason === 'forgotPIN') {
                    forgotPin = true;
                    return authenticateMasterPassword().then(function (password) {
                        return showPinResetDialog(password);
                    });
                } else {
                    return $q.reject(dismissReason);
                }
            });
        }

        function showPinResetDialog(password) {
            var options = angular.extend({}, purchasePinPopUpConfig[PIN_ENTRY_TYPE.SAVE], { password: password });

            return modal.open({
                component: 'pinReset',
                resolve: { options: options }
            }).result.then(function (result) {
                if (result === 'pinReset') {
                    pinReset = true;
                }
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/purchase-pin-dialog/purchase-pin-dialog.js.map
