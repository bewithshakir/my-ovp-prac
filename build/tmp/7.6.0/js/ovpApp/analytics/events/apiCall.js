'use strict';

(function () {
    'use strict';

    apiCallEvents.$inject = ["$rootScope", "analyticsService", "$log"];
    angular.module('ovpApp.analytics.events.apiCall', ['ovpApp.analytics.analyticsService']).factory('apiCall', apiCallEvents).run(["apiCall", function loadHandler(apiCall) {
        return apiCall;
    }]);

    /* @ngInject */
    function apiCallEvents($rootScope, analyticsService, $log) {
        $rootScope.$on('Analytics:apiCall', function (event, data) {
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
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/apiCall.js.map
