(function () {
    'use strict';

    angular.module('ovpApp.login.loginService', [
        'ovpApp.config',
        'ovpApp.services.ovpStorage',
        'ovpApp.oauth',
        'ovpApp.messages',
        'ovpApp.components.alert',
        'ovpApp.services.errorCodes'
    ])
    .service('loginService', loginService);

    /* @ngInject */
    function loginService(config, ovpStorage, storageKeys, $q, OauthService,
       locationService, messages, alert, $rootScope, errorCodesService) {

        let errorCallBack, parentalControls;

        const service = {
            error,
            authenticate,
            hasAcceptedParentalControlsWarning,
            acceptParentalControlsWarning,
            hasAcceptedSpecUTerms,
            acceptSpecUTerms,
            rememberMe
        };

        return service;

        /**
         * Error function
         * @param callback
         */
        function error(callback) {
            errorCallBack = callback;
        }

        function reportError(message) {
            errorCallBack(message);
        }

        /**
         * Authenticate user
         *
         * @param {String} username Username
         * @param {String} password Password
         * @param {Boolean} rememberMeCookie true if user should be remembered next visit
         */
        function authenticate(username, password, rememberMeCookie) {
            var rememberedUser = rememberMeCookie ? username : '';

            return OauthService.userLogin(username, password)
                .then(function () {
                    rememberMe(rememberedUser);
                    $rootScope.$emit('Session:loginActionComplete', {isSuccess: true});
                }, function (error) {
                    // invalid creds
                    if (error.errorCode) {
                        error.isSuccess = false;
                        error.failureType = 'userAuthenticationError';
                        $rootScope.$emit('Session:loginActionComplete', error);
                        return $q.reject(error);
                    } else {
                        $rootScope.$emit('Session:loginActionComplete',
                            {isSuccess: false, failureType: 'serviceError'});
                        serviceError({
                            impactedFunction: 'authenticate',
                            url: error.url,
                            data: 'NA',
                            xhr: error.xhr,
                            error: error.error
                        });
                        return $q.reject();
                    }
                });
        }

        function hasAcceptedParentalControlsWarning() {
            let persistedControls = ovpStorage.getItem(storageKeys.parentalControlsAccepted);
            parentalControls = parentalControls || persistedControls;
            return $q.resolve(parentalControls !== undefined);
        }

        function hasAcceptedSpecUTerms() {
            return ovpStorage.getItem(storageKeys.specuTermsAccepted) === true;
        }

        function acceptSpecUTerms() {
            ovpStorage.setItem(storageKeys.specuTermsAccepted, true);
        }

        function acceptParentalControlsWarning() {
            ovpStorage.setItem(storageKeys.parentalControlsAccepted, true);
        }

        /**
         * sets loginRememberMe for home page in local storage
         *
         * @param {String} username username
         */
        function rememberMe(username) {
            var rememberMeJson = {
                username: username,
                cc: true,
                last_activity: '',
                last_action: '',
                last_channel: ''
            };

            ovpStorage.setItem(storageKeys.loginRememberMe, rememberMeJson);
        }

        /*
         * Report service error to event gateway
         *
         * @param {Object} AJAX options+.  Include impactedFunction for event gateway and
         * suppressMessage option to prevent message being displayed to user.
         */
        function serviceError(options) {
            var message = errorCodesService.getMessageForCode('WGE-1001');

            OauthService.reset();

            if (!options.suppressMessage) {
                alert.open({
                    message: message,
                    buttonText: 'OK'
                });
                reportError(message);
            }
        }
    }
}());
