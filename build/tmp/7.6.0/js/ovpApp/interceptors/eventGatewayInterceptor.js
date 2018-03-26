'use strict';

(function () {
    'use strict';
    eventGatewayInterceptor.$inject = ["$httpProvider"];
    angular.module('ovpApp.interceptors.eventGateway', ['ovpApp.config']).config(eventGatewayInterceptor);

    /**
     * Since http interceptors in angular are done before services initialize,
     * the config must be injected at runtime.
     *
     * This is also implemented in the nns-service for jquery http calls.
     * @param $httpProvider
     */

    /* @ngInject */
    function eventGatewayInterceptor($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
            var config = $injector.get('config');
            var $location = $injector.get('$location');

            var queryPairs = $location.search(),
                ajaxAnalyticsEnabled = config.getBool(config.eventgatewayV4.logServiceCalls),
                ajaxAnalyticsEnabledErrorsOnly = config.getBool(config.eventgatewayV4.logServiceCallErrorsOnly);

            // Override reporting level by query param egErrorReportingLevel
            switch (queryPairs.egErrorReportingLevel) {
                case 'all':
                    ajaxAnalyticsEnabled = true;
                    ajaxAnalyticsEnabledErrorsOnly = false;
                    break;
                case 'errors':
                    ajaxAnalyticsEnabled = true;
                    ajaxAnalyticsEnabledErrorsOnly = true;
                    break;
                case 'none':
                    ajaxAnalyticsEnabled = false;
                    break;
            }

            return {
                request: function request(config) {
                    var eventGatewayService = $injector.get('eventGatewayService');
                    if (ajaxAnalyticsEnabled && config && config.url.indexOf('http') === 0) {
                        config.startTime = new Date().getTime();
                        eventGatewayService.setServiceCallStartTime();
                    }
                    return config;
                },
                responseError: function responseError(response) {
                    if (ajaxAnalyticsEnabled && response && response.config && response.config.url.indexOf('http') === 0) {
                        remoteCallReturned(true, response);
                    }

                    return $q.reject(response);
                },
                response: function response(_response) {
                    if (ajaxAnalyticsEnabled && !ajaxAnalyticsEnabledErrorsOnly && _response.config.url.indexOf('http') === 0) {
                        remoteCallReturned(false, _response);
                    }
                    return _response;
                }
            };

            function remoteCallReturned(err, config) {
                var eventGatewayService = $injector.get('eventGatewayService');
                var timedOut = config.status === 408,
                    result;

                if (err) {

                    if (config.status === -1) {
                        return null;
                    }

                    if (timedOut) {
                        result = 'timeout';
                    } else {
                        result = 'failure';
                    }
                } else {
                    result = 'success';
                }

                eventGatewayService.sendEvent('serviceCallResult', {
                    httpStatusCode: config.status,
                    httpUrl: config.config.url,
                    httpVerb: config.config.method,
                    result: result
                });
            }
        }]);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/interceptors/eventGatewayInterceptor.js.map
