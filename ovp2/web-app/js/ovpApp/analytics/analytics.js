/* jshint unused: vars */
(function () {
    'use strict';

    angular.module('ovpApp.analytics', [
        'ovpApp.config',
        'ovpApp.legacy.httpUtil',
        'ovpApp.legacy.stringUtil',
        'ovpApp.service.version',
        'ovpApp.legacy.deviceid',
        'ovpApp.analytics.events.playback',
        'ovpApp.analytics.events.login',
        'ovpApp.analytics.events.error',
        'ovpApp.analytics.events.apiCall',
        'ovpApp.analytics.events.navigation',
        'ovpApp.analytics.events.navigationTimer',
        'ovpApp.analytics.events.search',
        'ovpApp.analytics.events.sessionAnalytics',
        'ovpApp.analytics.events.productActionAnalytics',
        'ovpApp.analytics.events.windowAnalytics',
        'ovpApp.analytics.events.dvr',
        'ovpApp.analytics.analyticsService',
        'ovpApp.analytics.analyticsEnums',
        'ovpApp.analytics.analyticsAssetHelper',
        'rx'
    ])
    .factory('Analytics', Analytics)
    .run(loadAnalytics);

    /* @ngInject */
    function Analytics(
        config,
        httpUtil,
        version,
        deviceid,
        $window,
        analyticsService,
        playback,
        login,
        error,
        apiCall,
        analyticsDvr,
        analyticsAssetHelper,
        navigation,
        navigationTimer,
        analyticsEnums,
        search,
        sessionAnalytics,
        productActionAnalytics,
        windowAnalytics,
        $log,
        stringUtil,
        rx
    ) {
        let queryPairs = httpUtil.getPairsFromQueryString();
        let previousVisitId = null;

        initialize();

        return {};

        /////////////////////
        function initialize() {
            // try-catch so initialization errors don't affect rest of app.
            try {
                // Let query string override app default for venona collection.
                if (angular.isDefined(queryPairs.venonaEnabled)) {
                    config.analytics.venona.enabled = queryPairs.venonaEnabled;
                }

                if (config.analytics.venona.enabled) {
                    let fields = setSessionFields();
                    let options = { timestamp: Date.now() };

                    analyticsService.initialize(fields, options);

                    // Set our initial network status to 'unknown'
                    analyticsService.getSDK().setNetworkStatus({
                        networkStatus: 'unknown'
                    });

                    // Set experiment configurations, if any.
                    if (config.dePayload) {
                        analyticsService.getSDK().setExperimentConfigurations({
                            experimentUuids: analyticsAssetHelper.objToArray(config.dePayload.experimentUuids),
                            variantUuids: analyticsAssetHelper.objToArray(config.dePayload.variantUuids)
                        });
                    }
                }
            }
            catch (ex) {
                $log.error('Analytics initialization error', ex);
            }
        }

        function setSessionFields() {

            analyticsService.state.setDeviceId(deviceid.get());

            var fields = {
                // Required Fields
                domain: config.analytics.domain,
                customer: config.analytics.customer,
                appVersion: queryPairs.analyticsVersion || version.appVersion,
                applicationName: config.analytics.applicationName,
                applicationType: config.analytics.applicationType,
                visitId: generateVisitId(), // This needs to be saved in storage and pulled to populate previousVisitId.
                vendorId: {vendorId: $window.navigator.vendor},
                deviceType: 'webBrowser',
                deviceModel: $window.navigator.platform,
                operatingSystem: $window.navigator.userAgent,
                deviceUUID: analyticsService.state.getDeviceId(),
                formFactor: getFormFactor(),
                connectionType: 'unknown', // Cannot reliably determine for OVP.
                environment: {environmentName: config.environmentKey},
                previousVisitId: previousVisitId || '', //[previous visit id you read from disk],
                screenResolution: $window.innerWidth + 'x' + $window.innerHeight,
                userAgent: $window.navigator.userAgent,
                referrerLink: $window.document.referrer,
                // drmEnabled must always be true in production.
                drmEnabled: (config.playDrmOnlyStreams || config.vodDrmEnabled || config.liveTvDrmEnabled)
            };

            return fields;
        }

        function generateVisitId() {
            let visitId = queryPairs.analyticsVisitId || stringUtil.guid();
            let previousId = null;

            try {
                previousId = $window.localStorage.getItem('analyticsPreviousVisitId');
            } catch (ex) {
                // Ignorable error if local storage is not supported.
                $log.debug('Failed to access local storage', ex);
            }

            if (previousId) {
                previousVisitId = previousId;
            }

            try {
                previousId = $window.localStorage.setItem('analyticsPreviousVisitId', visitId);
            } catch (ex) {
                // Ignorable error if local storage is not supported.
                $log.debug('Failed to access local storage', ex);
            }

            return visitId;
        }

        function getFormFactor() {
            /* jshint ignore:start */
            var combinedSysInfo = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;


            var isMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i).test(combinedSysInfo) || (/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(combinedSysInfo.substr(0, 4));

            var isTablet = /android|ipad|playbook|silk/.test(combinedSysInfo);

            if (isTablet) {
                return 'tablet';
            }
            if (isMobile) {
                return 'phone';
            }
            return 'pc';
            /* jshint ignore:end */
        }
    }

    function loadAnalytics(Analytics) {
        return Analytics;
    }


})();
