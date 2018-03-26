(function () {
    'use strict';

    angular.module('ovpApp.parentalControlsDialog', [
        'ovpApp.services.parentalControlsService',
        'ovpApp.components.authForm',
        'ovpApp.components.modal',
        'ovpApp.components.pinEntry',
        'ovpApp.components.pinEntry.message',
        'ovpApp.services.stbPCPin',
        'ovpApp.services.errorCodes',
        'ovpApp.messages'])
    .constant('parentalControlsContext', {
        PLAYBACK: 'playback',
        WEB_SETTINGS: 'websettings',
        STB_SETTINGS: 'stbsettings'
    })
    .factory('parentalControlsDialog', ParentalControlsDialog);

    /* @ngInject */
    function ParentalControlsDialog(parentalControlsService, modal, PIN_ENTRY_TYPE,
        messages, $rootScope, $q, $log, TV_RATINGS, PC_BLOCK_REASON, PC_UNBLOCK_REASON,
        StbPCPinFactory, StbSettingsService, parentalControlsContext, errorCodesService) {

        let config = initConfig();

        return {
            withContext: function (context, stb) {
                let conf;
                if (angular.isFunction(config[context])) {
                    conf = config[context](stb);
                } else {
                    conf = config[context];
                }

                return {
                    unlock: function () {
                        return unlockParentalControls(conf);
                    },
                    changePIN: function () {
                        return changePIN(conf);
                    }
                };
            }
        };

        //////////

        function initConfig() {
            return {
                [parentalControlsContext.PLAYBACK]: {
                    pinService: parentalControlsService,
                    disablePC: function () {
                        parentalControlsService.disableParentalControlsForClient();
                    },
                    [PIN_ENTRY_TYPE.TOGGLE]: {
                        pinInstructions: errorCodesService.getMessageForCode('WPC-1000'),
                        pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                        pinService: parentalControlsService
                    },
                    [PIN_ENTRY_TYPE.SAVE]: {
                        headerMessage: messages.getMessageForCode('MSG-9048'),
                        secondaryMessage: messages.getMessageForCode('MSG-9050'),
                        pinInstructions: 'Please enter new PIN',
                        pinService: parentalControlsService
                    }
                },
                [parentalControlsContext.WEB_SETTINGS]: {
                    pinService: parentalControlsService,
                    disablePC: function () {
                        parentalControlsService.disableParentalControlsForClient();
                    },
                    [PIN_ENTRY_TYPE.TOGGLE]: {
                        pinInstructions: messages.getMessageForCode('MSG-9045'),
                        pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                        pinService: parentalControlsService
                    },
                    [PIN_ENTRY_TYPE.SAVE]: {
                        headerMessage: messages.getMessageForCode('MSG-9048'),
                        secondaryMessage: messages.getMessageForCode('MSG-9050'),
                        pinInstructions: messages.getMessageForCode('MSG-9057'),
                        pinService: parentalControlsService
                    }
                },
                [parentalControlsContext.STB_SETTINGS]: function (stb) {
                    const pinService = StbPCPinFactory.create(stb);
                    const checkPrimaryAccount = pinService.isPrimaryAccount();
                    return {
                        pinService,
                        checkPrimaryAccount,
                        disablePC: function () {
                            StbSettingsService.togglePCBlocking(stb, false);
                        },
                        [PIN_ENTRY_TYPE.TOGGLE]: {
                            pinInstructions: messages.getMessageForCode('MSG-9046'),
                            pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                            pinService
                        },
                        [PIN_ENTRY_TYPE.SAVE]: {
                            headerMessage: messages.getMessageForCode('MSG-9047'),
                            pinInstructions: messages.getMessageForCode('MSG-9057'),
                            pinService
                        }
                    };
                }
            };
        }

        function authenticateMasterPassword() {
            return modal.open({
                windowClass: 'productPopup-temp',
                component: 'authForm'
            }).result;
        }

        function showMasterPasswordMessage() {
            const options = {
                headerMessage: errorCodesService.getHeaderForCode('TMP-9060'),
                secondaryMessage: errorCodesService.getMessageForCode('TMP-9060')
            };
            return modal.open({
                component: 'pinEntryMessage',
                resolve: {options}
            }).result;
        }

        function unlockParentalControls(config) {
            return config.pinService.isPINSet()
                .then(pinIsSet => {
                    if (pinIsSet) {
                        return validatePin(config);
                    } else {
                        return config.pinService.isPrimaryAccount()
                            .then(isPrimaryAccount => {
                                if (isPrimaryAccount) {
                                    return undefined;
                                } else {
                                    return authenticateMasterPassword();
                                }
                            })
                            .then(password => resetPin(config, password));
                    }
                });
        }

        function validatePin(config) {
            const options = config[PIN_ENTRY_TYPE.TOGGLE];

            // Analytics
            $rootScope.$emit('Analytics:showPinDialog', {
                context: 'parentalControlFlow'
            });

            return modal.open({
                component: 'pinValidate',
                resolve: {options}
            }).result.then(
                result => {
                    if (result === 'pinValidated') {
                        config.disablePC();
                    }
                },
                dismissReason => {
                    if (dismissReason === 'forgotPIN') {
                        let checkPrimaryAccount = angular.isDefined(config.checkPrimaryAccount) ?
                            config.checkPrimaryAccount : true;
                        return $q.when(checkPrimaryAccount).then(enabled => {
                            if (enabled) {
                                return authenticateMasterPassword()
                                    .then(password => resetPin(config, password));
                            } else {
                                return showMasterPasswordMessage();
                            }
                        });
                    } else {
                        return $q.reject(dismissReason);
                    }
                }
            );
        }

        function changePIN(config) {
            //TODO: have a configuration option for whether changing the password is restricted to the master account
            return authenticateMasterPassword(config)
                .then(password => resetPin(config, password));
        }

        function resetPin(config, password) {
            const options = angular.extend({}, config[PIN_ENTRY_TYPE.SAVE], {password});

            return modal.open({
                component: 'pinReset',
                resolve: {options}
            }).result.then(
                result => {
                    if (result === 'pinReset') {
                        config.disablePC();
                    }
                }
            );
        }
    }
}());
