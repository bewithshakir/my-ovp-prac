'use strict';

(function () {
    'use strict';
    splunkInterceptor.$inject = ["$httpProvider"];
    angular.module('ovpApp.interceptors.splunk', ['ovpApp.config']).config(splunkInterceptor);

    /**
     * Send service error messages to splunkl
     * @param $httpProvider
     */

    /* @ngInject */
    function splunkInterceptor($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', '$log', function ($q, $injector, $log) {
            return {
                responseError: function responseError(response) {
                    var SplunkService, appConfig, requestUrl;

                    // if the client aborted this request then don't report it to Splunk
                    if (response && response.status === -1) {
                        return $q.reject(response);
                    }

                    if (response && response.config) {
                        requestUrl = response.config.url;

                        try {
                            SplunkService = $injector.get('SplunkService');
                            appConfig = $injector.get('config');

                            if (requestUrl && requestUrl.indexOf(appConfig.splunk.domain) === -1) {
                                var isTVODRent = requestUrl.indexOf('tvod\/rent') > -1;
                                var hasDetail = response.data && response.data.context && response.data.context.detailedResponseDescription;
                                var errObj = {
                                    httpUrl: requestUrl,
                                    isTVODRent: isTVODRent,
                                    httpStatusCode: response.status,
                                    errorMessage: isTVODRent && hasDetail ? response.data.context.detailedResponseDescription : response.data
                                    //errorCode: '' optional,
                                    //populate after implementing the Standardized Error Code story.
                                };

                                var traceId = response.headers && response.headers('x-trace-id');
                                if (traceId) {
                                    errObj['x-trace-id'] = traceId;
                                }

                                if (Array.isArray(response.config.ignoreStatus) && response.config.ignoreStatus.indexOf(response.status) !== -1) {
                                    SplunkService.sendCustomMessage(errObj, 'INFO');
                                } else {
                                    SplunkService.sendServiceError(errObj);
                                }
                            }
                        } catch (error) {
                            $log.error(error);
                        }
                    }

                    return $q.reject(response);
                }
            };
        }]);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/interceptors/splunkInterceptor.js.map
