'use strict';

(function () {
    'use strict';

    navigationTimer.$inject = ["$log", "$timeout", "$rootScope", "config"];
    angular.module('ovpApp.analytics.events.navigationTimer', ['ovpApp.analytics.analyticsService', 'ovpApp.legacy.stringUtil', 'ovpApp.config']).factory('navigationTimer', navigationTimer).run(["navigationTimer", function loadHandler(navigationTimer) {
        return navigationTimer;
    }]);

    /* @ngInject */
    function navigationTimer($log, $timeout, $rootScope, config) {

        var timeoutTimer = null;

        var description = null;

        function startTimer(appSection, pageName) {
            try {
                // $log.debug('Analytics: navigationTimer::startTimer:' + appSection + ', ' +
                //     pageName, config);

                // If we're already timing for this page, return existing timer.
                if (description && description.appSection === appSection && description.pageName === pageName) {
                    // $log.debug('Analytics navigationTimer::startTime Ignoring ' +
                    //     'request for duplicate timer.', timeoutTimer);
                    return timeoutTimer;
                }

                // If a timer is already in progress, cancel it now.
                if (timeoutTimer) {
                    // $log.warn('Analytics navigationTimer::startTime Cancelling ' +
                    //     'ongoing request for other page', description);
                    $timeout.cancel(timeoutTimer);
                    $rootScope.$emit('Analytics:nav-timer-cancelled', description);
                    return timeoutTimer;
                }

                // Create new timer and announce it.
                description = {
                    appSection: appSection,
                    pageName: pageName,
                    durationMillis: getTimeoutDurationForPage()
                };

                timeoutTimer = $timeout(function () {
                    // $log.debug('NavTimer: Timeout fired!');
                    $rootScope.$emit('Analytics:timeout', description);
                }, description.durationMillis);

                $rootScope.$emit('Analytics:nav-timer-started', description);
                return timeoutTimer;
            } catch (ex) {
                $log.error('Analytics navigationTimer:', ex);
            }
        }

        function cancelTimer() {
            try {
                if (timeoutTimer) {
                    $timeout.cancel(timeoutTimer);
                    $rootScope.$emit('Analytics:nav-timer-cancelled', description);
                    timeoutTimer = null;
                }
            } catch (ex) {
                $log.error('Analytics navigationTimer:', ex);
            }
        }

        function getTimeoutDurationForPage() {

            var durationMillis = 30000; // Default timeout in milliseconds.

            try {
                if (config && config.analytics && config.analytics.pageTimeoutMillis) {
                    durationMillis = config.analytics.pageTimeoutMillis;
                }
            } catch (ex) {
                $log.error('Analytics navigationTimer:', ex);
            }

            return durationMillis;
        }

        return {
            startTimer: startTimer,
            cancelTimer: cancelTimer
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/navigationTimer.js.map
