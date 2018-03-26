'use strict';

(function () {
    'use strict';

    errorEvents.$inject = ["$rootScope", "analyticsService", "$log"];
    angular.module('ovpApp.analytics.events.error', ['ovpApp.analytics.analyticsService']).factory('error', errorEvents).run(["error", function loadHandler(error) {
        return error;
    }]);

    /* @ngInject */
    function errorEvents($rootScope, analyticsService, $log) {

        /**
         * Process and publish a venona error event, based on the given data.
         *
         * @param data Data object containing venona error information.
         */
        function processError(data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: processError', data);
                }

                // If we have an httpError object, extend the data object with
                // data extracted from the httpError.
                if (data.httpError) {
                    angular.extend(data, extractHttpError(data.httpError));
                }

                // Prevent validation warnings by replacing nulls with strings.
                data.errorCode = '' + (data.errorCode || '');
                data.errorMessage = data.errorMessage || '';
                data.errorType = data.errorType || '';

                analyticsService.event('error', data);
            } catch (ex) {
                $log.error('Analytics:', ex);
            }
        }

        /**
         * Populate an error object based on an $http error.
         *
         * @param httpError Error object returned from an $http invocation.
         * @return Object containing fields relevant to a venona error event.
         */
        function extractHttpError(httpError) {
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: extractHttpError', httpError);
            }

            var result = {};

            if (httpError && httpError.data) {
                result.errorCode = '' + httpError.data.statusCode;
                result.errorMessage = httpError.data.error;
                result.errorExtras = {};

                // Include error message, if exists.
                if (httpError.data.message) {
                    result.errorExtras.message = httpError.data.message;
                }

                // Include URL, if exists
                if (httpError.config && httpError.config.url) {
                    result.errorExtras.url = httpError.config.url;
                }
            }

            return result;
        }

        /**
         * Function for attaching event listeners.
         */
        function attachEventListeners() {
            try {
                $rootScope.$on('Analytics:error', function (event, data) {
                    processError(data);
                });

                $rootScope.$on('Analytics:sadTv', function (event, data) {
                    data.errorType = 'sadTv';
                    processError(data);
                    $rootScope.$emit('Analytics:applicationTriggeredRouting');
                });
            } catch (ex) {
                $log.error('Analytics:', ex);
            }
        }

        // Attach the event listeners.
        attachEventListeners();

        return {
            processError: processError,
            extractHttpError: extractHttpError
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/error.js.map
