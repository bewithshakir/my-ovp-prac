'use strict';

(function () {
    'use strict';

    windowAnalytics.$inject = ["$rootScope", "analyticsService", "deviceid", "$window", "rx", "$log"];
    angular.module('ovpApp.analytics.events.windowAnalytics', ['ovpApp.config', 'ovpApp.analytics.analyticsService', 'rx']).factory('windowAnalytics', windowAnalytics).run(["windowAnalytics", function loadHandler(windowAnalytics) {
        return windowAnalytics;
    }]);

    /* @ngInject */
    function windowAnalytics($rootScope, analyticsService, deviceid, $window, rx, $log) {

        /**
         * Window resize handler.
         */
        function resize() {
            try {
                var eventData = {
                    screenResolution: $window.innerWidth + 'x' + $window.innerHeight
                };

                // Send event.
                analyticsService.event('displayChange', eventData);
            } catch (ex) {
                $log.error('Analytics windowAnalytics:', ex);
            }
        }

        /**
         * Function for attaching all navigation event listeners.
         */
        function attachEventListeners() {
            try {
                rx.Observable.fromEvent($window, 'resize').debounce(500).subscribe(function () {
                    // $log.debug('Analytics: OBS-winsize - dims: ',
                    //     $window.innerWidth, $window.innerHeight);
                    resize({
                        width: $window.innerWidth,
                        height: $window.innerHeight
                    });
                });
            } catch (ex) {
                $log.error('Analytics windowAnalytics:', ex);
            }
        }

        // Now attach the event listeners.
        attachEventListeners();

        return {
            resize: resize
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/windowAnalytics.js.map
