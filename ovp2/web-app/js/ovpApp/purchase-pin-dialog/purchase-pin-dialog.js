(function () {
    'use strict';

    angular.module('ovpApp.purchasePinDialog', [
        'ovpApp.components.pinEntry',
        'ovpApp.services.purchasePinService',
        'ovpApp.components.authForm',
        'ovpApp.components.modal',
        'ajoslin.promise-tracker',
        'ovpApp.services.errorCodes',
        'ovpApp.messages'
    ])
    .factory('purchasePinPopUpConfig', purchasePinPopUpConfig)
    .controller('PurchasePinDialogController', PurchasePinDialogController);

    /* @ngInject */
    function purchasePinPopUpConfig(PIN_ENTRY_TYPE, purchasePinService, errorCodesService, messages) {
        let config = {};
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
    function PurchasePinDialogController($scope, $rootScope, $q, $log, modal, PIN_ENTRY_TYPE,
        purchasePinService, purchasePinPopUpConfig, promiseTracker, errorCodesService) {
        let forgotPin = false,
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

            return purchasePinService.isPINSet()
                .then(pinIsSet => {
                    if (pinIsSet) {
                        const options = purchasePinPopUpConfig[PIN_ENTRY_TYPE.TOGGLE];
                        return showPinValidationDialog(options);
                    } else {
                        return purchasePinService.isPrimaryAccount()
                            .then(isPrimaryAccount => {
                                if (isPrimaryAccount) {
                                    return undefined;
                                } else {
                                    return authenticateMasterPassword();
                                }
                            })
                            .then(password => showPinResetDialog(password));
                    }
                }, error => {
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
                resolve: {options}
            }).result.then(
                result => {
                    if (result === 'pinValidated') {
                        pinValidated = true;
                    }

                    $rootScope.$emit('Analytics:closePinDialog', {
                        pinValidated: true
                    });
                },
                dismissReason => {
                    $rootScope.$emit('Analytics:closePinDialog', {
                        pinValidated: false
                    });

                    if (dismissReason === 'forgotPIN') {
                        forgotPin = true;
                        return authenticateMasterPassword()
                            .then(password => showPinResetDialog(password));
                    } else {
                        return $q.reject(dismissReason);
                    }
                }
            );
        }

        function showPinResetDialog(password) {
            const options = angular.extend(
                {},
                purchasePinPopUpConfig[PIN_ENTRY_TYPE.SAVE],
                {password}
            );

            return modal.open({
                component: 'pinReset',
                resolve: {options}
            }).result.then(
                result => {
                    if (result === 'pinReset') {
                        pinReset = true;
                    }
                }
            );
        }
    }
}());
