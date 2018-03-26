(function () {
    'use strict';
    angular.module('ovpApp.interceptors.oauth', ['ovpApp.config'])
        .config(oauthInterceptor);

    /**
     * Since http interceptors in angular are done before services initialize,
     * the config must be injected at runtime.
     *
     * This is also implemented in the nns-service for jquery http calls.
     * @param $httpProvider
     */

    /* @ngInject */
    function oauthInterceptor($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
            var MAX_RETRY_COUNT = 3;
            return {
                request: function (config) {
                    var OauthService = $injector.get('OauthService'),
                        appConfig = $injector.get('config');

                    if (config.url.indexOf(appConfig.oAuth.tokenExchange) === -1 &&
                        (config.url.indexOf(appConfig.piHost) === 0 ||
                        config.url.indexOf(appConfig.authNeededTrackingDomain) >= 0)) {
                        if (!config.bypassRefresh) {
                            //Most requests will pass through this block if they dont have anything to do
                            //with authentication.
                            return OauthService.updateToken().then(() => {
                                return appendHeaders(config, OauthService);
                            }, (err) => {
                                return $q.reject('User is not logged in, retry after login ' +
                                    config.url + '[' + err + ']');
                            });
                        } else {
                            return appendHeaders(config, OauthService);
                        }

                    } else {
                        //No need for any authentication or other data
                        return $q.resolve(config);
                    }

                },
                responseError: processResponseError

            };

            function appendHeaders(config, OauthService) {
                var header = OauthService.getOAuthHeader(config);
                if (!config.headers) {
                    config.headers = header;
                } else {
                    Object.assign(config.headers, header);
                }
                return config;
            }

            /**
             * This will attempt to recover the session in the event that the oauth keys are invalidated. This can
             * happen in a variety of circumstances (dormant browser tab doesn't auto refresh), other tab exchanges
             * token without updating the current tab
             *
             * @param  {Object} response A failed response object
             * @return {Promise}
             */
            function processResponseError(response) {
                if (response.config &&
                    response.status === 401 &&
                    !response.config.bypassRefresh && //Do not attempt to refresh if a 400+ response might be expected
                    (response.config.retryCount === undefined || response.config.retryCount < MAX_RETRY_COUNT)) {

                    let OauthService = $injector.get('OauthService');
                    return OauthService.updateToken(true).then(() => {
                        let $http = $injector.get('$http');
                        if (!response.config.retryCount) {
                            response.config.retryCount = 0;
                        }
                        response.config.retryCount++;
                        return $http(response.config);
                    });
                } else {
                    return $q.reject(response);
                }
            }
        }]);
    }
}());
