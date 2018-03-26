(function () {
    'use strict';
    angular.module('ovpApp.services.errorCodes', [
        'ovpApp.config',
        'ovpApp.config.errorCodes.defaults',
        'ovpApp.config.errorCodes.overrides'
    ])
    .factory('errorCodesService', ErrorCodesService);

    /* @ngInject */
    function ErrorCodesService(config, $http, $q, ERROR_CODES_DEFAULTS,
        ERROR_CODES_OVERRIDES, $rootScope, $log, $interval) {
        //json structure
        let errorCodes = {}; //
        const endpoint = config.piHost + '/tdcs/public/errors';

        let service = {
            getMessageForCode,
            getHeaderForCode,
            getAlertForCode,
            getAltForCode,
            getErrorCodes,
            subscribe
        };

        activate();
        return service;


        function activate() {
            importLocalCodes();
            getErrorCodes();
            setupUpdateTimer();
        }

        function importLocalCodes() {
            errorCodes = angular.merge(ERROR_CODES_DEFAULTS.errorCodes, ERROR_CODES_OVERRIDES.errorCodes);
            errorCodes = errorCodes.reduce((memo, ecode) => {
                if (ecode.full_error_code) {
                    memo[ecode.full_error_code] = ecode;
                }
                return memo;
            }, {});
        }

        function subscribe(scope, callback) {
            let handler = $rootScope.$on('errorCodesService:ready', callback);
            scope.$on('$destroy', handler);
        }

        function notify() {
            $rootScope.$emit('errorCodesService:ready');
        }

        function getErrorCodes() {
            //retrieve error codes from server
            let data = {clientType: 'ONEAPP-OVP', apiKey: config.oAuth.consumerKey};

            //TODO:  if-modified-since header

            $http({
                method: 'GET',
                url: endpoint,
                params: data,
                bypassRefresh: true
            }).then((data) => {
                if (data && data.data && data.data.errorCodes) {
                    data.data.errorCodes.forEach(error => {
                        if (error.full_error_code) {
                            let code = normalizeErrorCode(error.full_error_code);
                            errorCodes[code] = error;
                        }
                    });
                    return errorCodes;
                } else {
                    return $q.reject('No data returned');
                }
            }).catch((e) => {
                $log.error('Unable to fetch error codes from ECDB', e);
            }).finally(() => {
                notify();
            });
        }

        function setupUpdateTimer() {
            $interval(() => {
                getErrorCodes();
            }, config.errorCodesService.checkIntervalMs);
        }

        function getMessageForCode(code, replaceVars = {}) {
            let message = '';
            let errorCode = getCode(code);
            if (errorCode) {
                message = errorCode.full_customer_message;
                replaceVars.CODE = code;
                message = subVars(message, replaceVars);
            }
            return message;
        }

        function getHeaderForCode(code, replaceVars = {}) {
            let header = '';
            let errorCode = getCode(code);
            if (errorCode) {
                header = errorCode.header;
                replaceVars.CODE = code;
                header = subVars(header, replaceVars);
            }
            return header;
        }

        function getAlertForCode(code, replaceVars = {}) {
            let errorCode = getCode(code);
            replaceVars.CODE = code;
            return {
                message: subVars(errorCode.message, replaceVars),
                title: (errorCode.header) ? subVars(errorCode.header, replaceVars) : null,
                buttonText: 'OK'
            };
        }

        function getAltForCode(code, replaceVars = {}) {
            let errorCode = getCode(code);
            let alt = '';
            replaceVars.CODE = code;
            if (errorCode) {
                alt = errorCode.altText;
                alt = subVars(alt, replaceVars);
            }
            return alt;
        }

        function getCode(code) {
            let errorCode = errorCodes[normalizeErrorCode(code)];
            // fallback onto 9000 if a specific error code does not exist
            if (!errorCode) {
                errorCode = errorCodes['WLI-9000'];
            }
            return errorCode;
        }

        function subVars(message, replaceVars) {
            if (replaceVars) {
                message = Object.keys(replaceVars).reduce((memo, key) => {
                    if (memo) {
                        return memo.replace('{{' + key + '}}', replaceVars[key]);
                    }
                    return '';
                }, message);
            }
            return message;
        }

        /*
         Ensure that the error codes all follow the same format
         */
        function normalizeErrorCode(code) {
            return (code + '').toUpperCase();
        }
    }
}());
