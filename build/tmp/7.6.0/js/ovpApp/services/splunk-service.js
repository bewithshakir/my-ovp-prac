/* global console */
'use strict';

(function () {
    'use strict';
    SplunkService.$inject = ["config", "platform", "ovpStorage", "storageKeys", "$interval", "version", "capabilitiesService", "CAPABILITIES", "stbService", "deviceid", "$q", "OauthService", "$log", "$window", "adBlockerDetection", "splunk", "profileService"];
    $exceptionHandler.$inject = ["$log", "$injector"];
    subscribe.$inject = ["$injector", "SplunkService", "$rootScope", "$transitions", "config", "splunk"];
    angular.module('ovpApp.services.splunk', ['ovpApp.config', 'lib.platform', 'lib.splunk', 'ovpApp.services.ovpStorage', 'ovpApp.services.capabilitiesService', 'ovpApp.services.profileService', 'ovpApp.oauth', 'ovpApp.services.stbService', 'ovpApp.version', 'ovpApp.legacy.deviceid', 'ovpApp.adBlockerDetection']).factory('SplunkService', SplunkService).factory('$exceptionHandler', $exceptionHandler).run(subscribe);

    /**
     * create an individual Splunk message payload, which consists of a standard OVP message header and an event
     * specific message body.
     *
     */

    /* @ngInject */
    function SplunkService(config, platform, ovpStorage, storageKeys, $interval, version, capabilitiesService, CAPABILITIES, stbService, deviceid, $q, OauthService, $log, $window, adBlockerDetection, splunk, profileService) {

        var loggingEnabled = config.getBool(config.splunkControlParameters.splunkLoggingEnabled),
            heartbeatEnabled = config.getBool(config.splunkControlParameters.splunkHeartbeatEnabled),
            osVersion = platform.os.family + ' ' + platform.os.version,
            browserVersion = platform.name + ' ' + platform.version,

        //oohDrmEnabled = false, // not used as of June 2016
        sessionGuid = config.randomGuid();

        var service = {
            sendPlayerStatus: sendPlayerStatus,
            sendPlayerError: sendPlayerError,
            sendServiceError: sendServiceError,
            sendError: sendError,
            sendCustomMessage: sendCustomMessage,
            updateCapabilities: updateCapabilities,
            flush: flush,
            toggleNetworkConnectivity: toggleNetworkConnectivity
        };

        activate();

        return service;

        ///////////////////////////////

        function activate() {
            updateCapabilities();
            updateFlashPlayerVersion();
            updateStbInfo();
            updateAdBlockerStatus();

            splunk.init(config);

            splunk.updateConfiguration(config);
            splunk.setUserSessionId(sessionGuid);
            splunk.setAppVersion(version.appVersion);
            splunk.setEnvironment(config.environmentKey);
            splunk.setOSVersion(osVersion);
            splunk.setBrowserVersion(browserVersion);
            splunk.setDeviceId(deviceid.get());

            if (loggingEnabled && heartbeatEnabled) {
                splunk.sendHeartbeat(); // send the initial heartbeat, the rest will follow on the timer
            }
        }

        function updateAdBlockerStatus() {
            adBlockerDetection.adsBlocked().then(function () {
                // ads not blocked
                splunk.setAdBlocker(false);
            }, function () {
                // ads blocked
                splunk.setAdBlocker(true);
            });
        }

        function updateStbInfo() {
            OauthService.isAuthenticated().then(function (authenticated) {
                if (authenticated) {
                    stbService.getCurrentStb().then(function (stb) {
                        if (stb) {
                            splunk.setStbInfo(stb.macAddress);
                        }
                    });
                }
            });
        }

        function flush() {
            splunk.flush();
        }

        // capabilities are returned via a call to IPVS following user login
        function updateCapabilities() {
            OauthService.isAuthenticated().then(function (authenticated) {
                if (authenticated) {
                    $q.all([capabilitiesService.hasCapability(CAPABILITIES.RDVR), capabilitiesService.hasCapability(CAPABILITIES.GUIDE), capabilitiesService.hasCapability(CAPABILITIES.LIVE), capabilitiesService.hasCapability(CAPABILITIES.ONDEMAND), capabilitiesService.hasCapability(CAPABILITIES.TUNETOCHANNEL), capabilitiesService.hasCapability(CAPABILITIES.CDVR), profileService.isTVODRentEnabled(), profileService.isTVODWatchEnabled()]).then(function (values) {
                        splunk.updateCapabilities(values);
                    });
                }
            });
        }

        function updateFlashPlayerVersion() {
            var version = $window.swfobject.getFlashPlayerVersion();
            var flashVersion = version.major + '.' + version.minor + '.' + version.release + '.' + version.build;
            splunk.updateFlashPlayerVersion(flashVersion);
        }

        function toggleNetworkConnectivity(isOnline) {
            config.splunkControlParameters.splunkLoggingEnabled = isOnline;
            config.splunkControlParameters.splunkHeartbeatEnabled = isOnline;
            config.splunkControlParameters.splunkPlayerStatusEnabled = isOnline;
            splunk.updateConfiguration(config);
        }

        function sendError(exception, source, cause) {
            splunk.sendError(exception, source, cause, config);
        }

        /**
        * build and queue a Splunk service error message
        *
        * @param {String} errorDetails - error properties as specified in the Common Splunk Logging Standards
        * http://mystropedia.corp.mystrotv.com/display/NGC/Common+Splunk+Logging+Standards
        */
        function sendServiceError(errorDetails) {
            splunk.sendServiceError(errorDetails);
        }

        /**
        * build and queue a Splunk player error message
        *
        * @param {String} errorDetails - error properties as specified in the Common Splunk Logging Standards
        * http://mystropedia.corp.mystrotv.com/display/NGC/Common+Splunk+Logging+Standards
        */
        function sendPlayerError(errorDetails) {
            splunk.sendPlayerError(errorDetails);
        }

        /**
        * build and queue a Splunk player status message. For actual errors with the player itself, please
        * use the sendPlayerError() API.
        *
        * @param {String} statusDetails - error properties as specified in the Common Splunk Logging Standards
        * http://mystropedia.corp.mystrotv.com/display/NGC/Common+Splunk+Logging+Standards
        */
        function sendPlayerStatus(statusDetails) {
            splunk.sendPlayerStatus(statusDetails);
        }

        /**
         * Send a message which doesn't fit into any of the other categories
         * @param {object} payload data to send
         * @param {string} logLevel log level of the message. Defaults to ERROR
         */
        function sendCustomMessage(payload, logLevel) {
            splunk.sendCustomMessage(payload, logLevel);
        }
    }

    /* @ngInject */
    function $exceptionHandler($log, $injector) {
        return function ovpExceptionHandler(exception, cause) {
            var SplunkService = $injector.get('SplunkService');
            SplunkService.sendError(exception, cause, 'exceptionHandler');
            //SplunkService.sendError(exception, cause, 'exceptionHandler');
            //Not sending to $log.error - otherwise it might be double logged
            console.error('Exception Logged ->', exception);
        };
    }

    /* @ngInject */
    function subscribe($injector, SplunkService, $rootScope, $transitions, config, splunk) {
        $rootScope.$on('EntryService:masDefined', function (event, data) {
            splunk.setDivision(data.market);
            splunk.setLineup(data.lineupId);
        });

        $rootScope.$on('LocationService:locationChanged', function (event, data) {
            splunk.setInHome(data.behindOwnModem);
        });

        $rootScope.$on('Session:setCapabilities', function () {
            SplunkService.updateCapabilities();
        });

        $rootScope.$on('set-top-box-selected', function (event, stb) {
            splunk.setStbInfo(stb.macAddress);
        });

        $transitions.onStart({}, function (transition) {
            splunk.startTimer(transition.to().name);
        });

        $transitions.onSuccess({}, function (transition) {
            splunk.setAppState(transition.to().name);
        });

        $rootScope.$on('pageChangeComplete', function (event, toState) {
            splunk.endTimer(toState.name);
        });

        $rootScope.$on('connectivityService:statusChanged', function (event, data) {
            SplunkService.toggleNetworkConnectivity(data);
        });

        /**
         *  The default values for feature flippers in config/config.js may be overwritten from TDCS/Cyclops.
         *
         *  With Cyclops this overriding occurs prior to this service being instantiated, so this event will be
         *  missed which is expected behavior.
         *
         *  With TDCS, this overriding won't happen until after this service in instantiated, the user logs in,
         *  and the configuration file is downloaded and processed. This event will then kick off the necessary
         *  updates to the default parameters returned to splunk.
        */
        $rootScope.$on('Session:setConfigOverrides', function () {
            splunk.updateConfiguration(config);
        });
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/splunk-service.js.map
