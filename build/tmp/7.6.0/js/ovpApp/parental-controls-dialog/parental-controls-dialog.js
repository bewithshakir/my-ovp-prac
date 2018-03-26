'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    ParentalControlsDialog.$inject = ["parentalControlsService", "modal", "PIN_ENTRY_TYPE", "messages", "$rootScope", "$q", "$log", "TV_RATINGS", "PC_BLOCK_REASON", "PC_UNBLOCK_REASON", "StbPCPinFactory", "StbSettingsService", "parentalControlsContext", "errorCodesService"];
    angular.module('ovpApp.parentalControlsDialog', ['ovpApp.services.parentalControlsService', 'ovpApp.components.authForm', 'ovpApp.components.modal', 'ovpApp.components.pinEntry', 'ovpApp.components.pinEntry.message', 'ovpApp.services.stbPCPin', 'ovpApp.services.errorCodes', 'ovpApp.messages']).constant('parentalControlsContext', {
        PLAYBACK: 'playback',
        WEB_SETTINGS: 'websettings',
        STB_SETTINGS: 'stbsettings'
    }).factory('parentalControlsDialog', ParentalControlsDialog);

    /* @ngInject */
    function ParentalControlsDialog(parentalControlsService, modal, PIN_ENTRY_TYPE, messages, $rootScope, $q, $log, TV_RATINGS, PC_BLOCK_REASON, PC_UNBLOCK_REASON, StbPCPinFactory, StbSettingsService, parentalControlsContext, errorCodesService) {

        var config = initConfig();

        return {
            withContext: function withContext(context, stb) {
                var conf = undefined;
                if (angular.isFunction(config[context])) {
                    conf = config[context](stb);
                } else {
                    conf = config[context];
                }

                return {
                    unlock: function unlock() {
                        return unlockParentalControls(conf);
                    },
                    changePIN: function changePIN() {
                        return _changePIN(conf);
                    }
                };
            }
        };

        //////////

        function initConfig() {
            var _parentalControlsContext$PLAYBACK, _parentalControlsContext$WEB_SETTINGS, _ref2;

            return _ref2 = {}, _defineProperty(_ref2, parentalControlsContext.PLAYBACK, (_parentalControlsContext$PLAYBACK = {
                pinService: parentalControlsService,
                disablePC: function disablePC() {
                    parentalControlsService.disableParentalControlsForClient();
                }
            }, _defineProperty(_parentalControlsContext$PLAYBACK, PIN_ENTRY_TYPE.TOGGLE, {
                pinInstructions: errorCodesService.getMessageForCode('WPC-1000'),
                pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                pinService: parentalControlsService
            }), _defineProperty(_parentalControlsContext$PLAYBACK, PIN_ENTRY_TYPE.SAVE, {
                headerMessage: messages.getMessageForCode('MSG-9048'),
                secondaryMessage: messages.getMessageForCode('MSG-9050'),
                pinInstructions: 'Please enter new PIN',
                pinService: parentalControlsService
            }), _parentalControlsContext$PLAYBACK)), _defineProperty(_ref2, parentalControlsContext.WEB_SETTINGS, (_parentalControlsContext$WEB_SETTINGS = {
                pinService: parentalControlsService,
                disablePC: function disablePC() {
                    parentalControlsService.disableParentalControlsForClient();
                }
            }, _defineProperty(_parentalControlsContext$WEB_SETTINGS, PIN_ENTRY_TYPE.TOGGLE, {
                pinInstructions: messages.getMessageForCode('MSG-9045'),
                pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                pinService: parentalControlsService
            }), _defineProperty(_parentalControlsContext$WEB_SETTINGS, PIN_ENTRY_TYPE.SAVE, {
                headerMessage: messages.getMessageForCode('MSG-9048'),
                secondaryMessage: messages.getMessageForCode('MSG-9050'),
                pinInstructions: messages.getMessageForCode('MSG-9057'),
                pinService: parentalControlsService
            }), _parentalControlsContext$WEB_SETTINGS)), _defineProperty(_ref2, parentalControlsContext.STB_SETTINGS, function (stb) {
                var _ref;

                var pinService = StbPCPinFactory.create(stb);
                var checkPrimaryAccount = pinService.isPrimaryAccount();
                return _ref = {
                    pinService: pinService,
                    checkPrimaryAccount: checkPrimaryAccount,
                    disablePC: function disablePC() {
                        StbSettingsService.togglePCBlocking(stb, false);
                    }
                }, _defineProperty(_ref, PIN_ENTRY_TYPE.TOGGLE, {
                    pinInstructions: messages.getMessageForCode('MSG-9046'),
                    pleaseEnterPin: messages.getMessageForCode('MSG-9044'),
                    pinService: pinService
                }), _defineProperty(_ref, PIN_ENTRY_TYPE.SAVE, {
                    headerMessage: messages.getMessageForCode('MSG-9047'),
                    pinInstructions: messages.getMessageForCode('MSG-9057'),
                    pinService: pinService
                }), _ref;
            }), _ref2;
        }

        function authenticateMasterPassword() {
            return modal.open({
                windowClass: 'productPopup-temp',
                component: 'authForm'
            }).result;
        }

        function showMasterPasswordMessage() {
            var options = {
                headerMessage: errorCodesService.getHeaderForCode('TMP-9060'),
                secondaryMessage: errorCodesService.getMessageForCode('TMP-9060')
            };
            return modal.open({
                component: 'pinEntryMessage',
                resolve: { options: options }
            }).result;
        }

        function unlockParentalControls(config) {
            return config.pinService.isPINSet().then(function (pinIsSet) {
                if (pinIsSet) {
                    return validatePin(config);
                } else {
                    return config.pinService.isPrimaryAccount().then(function (isPrimaryAccount) {
                        if (isPrimaryAccount) {
                            return undefined;
                        } else {
                            return authenticateMasterPassword();
                        }
                    }).then(function (password) {
                        return resetPin(config, password);
                    });
                }
            });
        }

        function validatePin(config) {
            var options = config[PIN_ENTRY_TYPE.TOGGLE];

            // Analytics
            $rootScope.$emit('Analytics:showPinDialog', {
                context: 'parentalControlFlow'
            });

            return modal.open({
                component: 'pinValidate',
                resolve: { options: options }
            }).result.then(function (result) {
                if (result === 'pinValidated') {
                    config.disablePC();
                }
            }, function (dismissReason) {
                if (dismissReason === 'forgotPIN') {
                    var checkPrimaryAccount = angular.isDefined(config.checkPrimaryAccount) ? config.checkPrimaryAccount : true;
                    return $q.when(checkPrimaryAccount).then(function (enabled) {
                        if (enabled) {
                            return authenticateMasterPassword().then(function (password) {
                                return resetPin(config, password);
                            });
                        } else {
                            return showMasterPasswordMessage();
                        }
                    });
                } else {
                    return $q.reject(dismissReason);
                }
            });
        }

        function _changePIN(config) {
            //TODO: have a configuration option for whether changing the password is restricted to the master account
            return authenticateMasterPassword(config).then(function (password) {
                return resetPin(config, password);
            });
        }

        function resetPin(config, password) {
            var options = angular.extend({}, config[PIN_ENTRY_TYPE.SAVE], { password: password });

            return modal.open({
                component: 'pinReset',
                resolve: { options: options }
            }).result.then(function (result) {
                if (result === 'pinReset') {
                    config.disablePC();
                }
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/parental-controls-dialog/parental-controls-dialog.js.map
