'use strict';

(function () {
    'use strict';
    ErrorCodesService.$inject = ["config", "$http", "$q", "ERROR_CODES_DEFAULTS", "ERROR_CODES_OVERRIDES", "$rootScope", "$log", "$interval"];
    angular.module('ovpApp.services.errorCodes', ['ovpApp.config', 'ovpApp.config.errorCodes.defaults', 'ovpApp.config.errorCodes.overrides']).factory('errorCodesService', ErrorCodesService);

    /* @ngInject */
    function ErrorCodesService(config, $http, $q, ERROR_CODES_DEFAULTS, ERROR_CODES_OVERRIDES, $rootScope, $log, $interval) {
        //json structure
        var errorCodes = {}; //
        var endpoint = config.piHost + '/tdcs/public/errors';

        var service = {
            getMessageForCode: getMessageForCode,
            getHeaderForCode: getHeaderForCode,
            getAlertForCode: getAlertForCode,
            getAltForCode: getAltForCode,
            getErrorCodes: getErrorCodes,
            subscribe: subscribe
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
            errorCodes = errorCodes.reduce(function (memo, ecode) {
                if (ecode.full_error_code) {
                    memo[ecode.full_error_code] = ecode;
                }
                return memo;
            }, {});
        }

        function subscribe(scope, callback) {
            var handler = $rootScope.$on('errorCodesService:ready', callback);
            scope.$on('$destroy', handler);
        }

        function notify() {
            $rootScope.$emit('errorCodesService:ready');
        }

        function getErrorCodes() {
            //retrieve error codes from server
            var data = { clientType: 'ONEAPP-OVP', apiKey: config.oAuth.consumerKey };

            //TODO:  if-modified-since header

            $http({
                method: 'GET',
                url: endpoint,
                params: data,
                bypassRefresh: true
            }).then(function (data) {
                if (data && data.data && data.data.errorCodes) {
                    data.data.errorCodes.forEach(function (error) {
                        if (error.full_error_code) {
                            var code = normalizeErrorCode(error.full_error_code);
                            errorCodes[code] = error;
                        }
                    });
                    return errorCodes;
                } else {
                    return $q.reject('No data returned');
                }
            })['catch'](function (e) {
                $log.error('Unable to fetch error codes from ECDB', e);
            })['finally'](function () {
                notify();
            });
        }

        function setupUpdateTimer() {
            $interval(function () {
                getErrorCodes();
            }, config.errorCodesService.checkIntervalMs);
        }

        function getMessageForCode(code) {
            var replaceVars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var message = '';
            var errorCode = getCode(code);
            if (errorCode) {
                message = errorCode.full_customer_message;
                replaceVars.CODE = code;
                message = subVars(message, replaceVars);
            }
            return message;
        }

        function getHeaderForCode(code) {
            var replaceVars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var header = '';
            var errorCode = getCode(code);
            if (errorCode) {
                header = errorCode.header;
                replaceVars.CODE = code;
                header = subVars(header, replaceVars);
            }
            return header;
        }

        function getAlertForCode(code) {
            var replaceVars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var errorCode = getCode(code);
            replaceVars.CODE = code;
            return {
                message: subVars(errorCode.message, replaceVars),
                title: errorCode.header ? subVars(errorCode.header, replaceVars) : null,
                buttonText: 'OK'
            };
        }

        function getAltForCode(code) {
            var replaceVars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var errorCode = getCode(code);
            var alt = '';
            replaceVars.CODE = code;
            if (errorCode) {
                alt = errorCode.altText;
                alt = subVars(alt, replaceVars);
            }
            return alt;
        }

        function getCode(code) {
            var errorCode = errorCodes[normalizeErrorCode(code)];
            // fallback onto 9000 if a specific error code does not exist
            if (!errorCode) {
                errorCode = errorCodes['WLI-9000'];
            }
            return errorCode;
        }

        function subVars(message, replaceVars) {
            if (replaceVars) {
                message = Object.keys(replaceVars).reduce(function (memo, key) {
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
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/error-codes.js.map
