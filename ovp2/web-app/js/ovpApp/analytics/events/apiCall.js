(function () {
    'use strict';

    angular.module('ovpApp.analytics.events.apiCall', [
        'ovpApp.analytics.analyticsService'
    ])
    .factory('apiCall', apiCallEvents)
    .run(function loadHandler(apiCall) {
            return apiCall;
        });

    /* @ngInject */
    function apiCallEvents($rootScope, analyticsService, $log) {
        $rootScope.$on('Analytics:apiCall', (event, data) => {
            try {
                publishApiCall(data);
            } catch (ex) {
                $log.error('Analytics:', ex);
            }
        });

        return {};

        function publishApiCall(data) {
            analyticsService.event('apiCall', data);
        }
    }
}());
