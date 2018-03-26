/* global window*/
(function () {
    'use strict';

    angular.module('ovpApp.interceptors.httpInterceptor', ['ovpApp.config'])
        .config(httpInterceptor);

    /**
     * Since http interceptors in angular are done before services initialize,
     * the config must be injected at runtime.
     *
     * This is also implemented in the nns-service for jquery http calls.
     * @param $httpProvider
     */
    /* @ngInject */
    function httpInterceptor($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', '$log', '$rootScope',
            function ($q, $injector, $log, $rootScope) {
                let config = $injector.get('config');

                return {
                    request: function (request) {
                        // Add start time to this request
                        request.started = Date.now();
                        return request;
                    },

                    requestError: function (response) {
                        processResponse(response);
                        return $q.reject(response);
                    },

                    responseError: function (response) {
                        processResponse(response);
                        return $q.reject(response);
                    },

                    response: function (response) {
                        processResponse(response);
                        return response;
                    }
                };

                // Capture given value as a string. Value could be null,
                // a string, or an object.
                function getAsString(responseText) {
                    if (responseText) {
                        if ('string' === typeof responseText) {
                            return responseText;
                        } else if ('object' === typeof responseText) {
                            return JSON.stringify(responseText);
                        }
                    }
                    return '';
                }

                function processResponse(response) {

                    // Do nothing if this event is disabled.
                    if (!config.analytics.venona.enabled || !config.analytics.venona.events.apiCall) {
                        return;
                    }

                    // Ignore responses missing required information.
                    if (!response || !response.config || !response.config.url ||
                        !response.status) {
                        return;
                    }

                    // Ignore cancelled requests
                    if (response.status === -1) {
                        return;
                    }

                    // Detect if request succeeded.
                    let isSuccess = false; // Assume failure.
                    let statusCodeInt = parseInt(response.status, 10);
                    if (!isNaN(statusCodeInt) && statusCodeInt >= 200 && statusCodeInt <= 399) {
                        isSuccess = true;
                    }

                    // Determine serviceResult, which can be: success, failure, or timeout.
                    let serviceResult = isSuccess ? 'success' : 'failure';
                    if (408 === statusCodeInt) {
                        serviceResult = 'timeout';
                    }

                    // Ignore successful relative requests, unless they failed.
                    // (Relative requests don't have the http[s]: prefix.)
                    if (isSuccess && response.config.url.indexOf('http') !== 0) {
                        return;
                    }

                    // Ignore blacklisted URLs. (Example: there's little point
                    // in telling the collector that it is unreachable...)
                    // TODO: Use underscore to process blacklist.
                    let isBlacklisted = false;
                    config.analytics.blacklist.urls.forEach(function (element) {
                        if (!isBlacklisted && response.config.url.indexOf(element) === 0) {
                            isBlacklisted = true;
                            // $log.debug('Analytics blacklisted:  ' + response.config.url);
                        }
                    });
                    if (isBlacklisted) {
                        return;
                    }

                    // Collect query parameters, if any.
                    let queryParameters = '';
                    let queryIdx = response.config.url.indexOf('?');
                    if (queryIdx > 0) {
                        queryParameters = response.config.url.substring(queryIdx + 1);
                    }

                    // Did this response come from the cache? This is unfortunately
                    // difficult to determine, because the $http doesn't provide
                    // an indicator of this. Instead, we make our own indicator.
                    //
                    // NOTE: Only 'GET' and 'JSONP' requests can be cached.
                    if (response.config.cache &&
                        ('GET' === response.config.method || 'JSONP' === response.config.method)) {

                        // Generate URL w/ parameters using same strategy as Angular $http.
                        let urlWithParams = response.config.url;
                        if (response.config.params) {
                            let serializedParams = response.config.paramSerializer(response.config.params);
                            if (serializedParams.length > 0) {
                                urlWithParams += ((urlWithParams.indexOf('?') == -1) ? '?' : '&') + serializedParams;
                            }
                        }

                        let cachedEntityArray = response.config.cache === true ||
                        response.config.cache.get(urlWithParams);

                        if (angular.isArray(cachedEntityArray) && angular.isObject(cachedEntityArray[2])) {
                            if (cachedEntityArray[2]['x-intercept-cache']) {
                                // This cache entry is already marked by us,
                                // so we know we've processed it before.
                                // $log.debug('Ignoring cached request for ' + response.config.url);
                                return;
                            }

                            // Mark the cache entry so we'll know if we see it again.
                            cachedEntityArray[2]['x-intercept-cache'] = 'true';
                        }
                    }

                    // Capture the response time in ms for this request/response.
                    let responseMs = 0;
                    if (response.config.started) {
                        responseMs = Date.now() - response.config.started;
                    }

                    // Parse the URL. The created 'a' element gets garbage collected
                    // automatically, since it isn't added to the DOM.
                    var parser = window.document.createElement('a');
                    parser.href = response.config.url;

                    // Build payload
                    let apiCallPayload = {
                        success : isSuccess,
                        serviceResult : serviceResult,
                        triggeredBy : 'application',
                        responseCode : '' + response.status,
                        responseText : (isSuccess ? '' : getAsString(response.data)),
                        responseTimeMs : responseMs,
                        host : parser.hostname,
                        path : parser.pathname,
                        httpVerb : response.config.method,
                        queryParameters: queryParameters,
                        apiCached : 304 === statusCodeInt ? true : false,
                        traceId: response.headers('x-trace-id') || ''
                    };

                    // Set error fields
                    if (!isSuccess) {
                        apiCallPayload.errorType = 'api';
                        apiCallPayload.errorCode = '' + response.status;
                        apiCallPayload.errorMessage = response.statusText + ': ' +
                            JSON.stringify(response.data);
                    }

                    // Publish error message
                    $rootScope.$emit('Analytics:apiCall', apiCallPayload);
                }
            }]);
    }
}());
