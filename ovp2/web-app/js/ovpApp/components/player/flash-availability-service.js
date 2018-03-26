(function () {
    'use strict';

    angular
        .module('ovpApp.player.flashAvailability', [
            'ovpApp.video'
        ])
        .factory('flashAvailabilityService', flashAvailabilityService);

    /* @ngInject */
    function flashAvailabilityService($window, TWCVideoJS) {
        let service = {
            needsFlashUpdate,
            hasFlashInstalled,
            isIE
        };

        return service;

        ////////////////

        /**
         * Determines if the user has flash installed but it needs to be updated
         * to meet the version requirements of the flash video player.
         */
        function needsFlashUpdate() {
            return hasFlashInstalled() &&
                parseInt(TWCVideoJS.FlashVideoPlayer.minimumVersion) >
                $window.swfobject.getFlashPlayerVersion().major;
        }

        /**
         * Determines if the user has any flash plug-in currently installed and enabled.
         */
        function hasFlashInstalled() {
            return $window.swfobject.getFlashPlayerVersion().major > 0;
        }

        function isIE() {
            let userAgent = $window.navigator.userAgent;
            return ((userAgent.indexOf('Windows NT 10.0') !== -1) ||
                    (userAgent.indexOf('Windows NT 6.2') !== -1) ||
                    (userAgent.indexOf('Windows NT 6.3') !== -1)) &&
                    ((userAgent.indexOf('rv:11.0') !== -1) || (userAgent.indexOf('Edge') !== -1));
        }
    }
})();
