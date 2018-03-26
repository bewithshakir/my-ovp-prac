/*globals document */
'use strict';

(function () {
    'use strict';

    adBlockerDetection.$inject = ["$interval", "$timeout", "$log", "$q", "config"];
    angular.module('ovpApp.adBlockerDetection', ['ovpApp.config']).factory('adBlockerDetection', adBlockerDetection);

    /* @ngInject */
    function adBlockerDetection($interval, $timeout, $log, $q, config) {

        var debug = config.adBlockerDetection.debug;
        var bait = undefined;
        var baitClass = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd' + ' text_ad text_ads text-ads text-ad-links';
        var baitStyle = 'width: 1px !important; height: 1px !important;' + ' position: absolute !important; left: -10000px !important; top: -1000px !important;';

        return {
            adsBlocked: adsBlocked
        };

        ///////////////////////

        function createBaitElement() {
            bait = document.createElement('div');
            bait.innerHTML = '&nbsp;';
            bait.setAttribute('class', baitClass);
            bait.setAttribute('style', baitStyle);
            document.body.appendChild(bait);
        }

        function destroyBait() {
            bait.remove();
        }

        function check() {
            var defer = $q.defer();

            if (!config.adBlockerDetection.enabled) {
                if (debug) {
                    $log.debug('AdBlock detection disabled');
                }

                return $q.resolve();
            }

            createBaitElement();
            $timeout(function () {
                if (document.body.getAttribute('abp') !== null || bait.offsetParent === null || bait.offsetHeight === 0 || bait.offsetLeft === 0 || bait.offsetTop === 0 || bait.offsetWidth === 0 || bait.clientHeight === 0 || bait.clientWidth === 0) {
                    if (debug) {
                        $log.debug('ads blocked');
                    }
                    defer.reject(true);
                } else {
                    if (debug) {
                        $log.debug('ads NOT blocked');
                    }
                    defer.resolve(false);
                }

                destroyBait();
            }, 100);

            return defer.promise;
        }

        function adsBlocked() {
            return check();
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/adBlockerDetection/adBlockerDetection.js.map
