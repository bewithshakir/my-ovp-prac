'use strict';

(function () {
    'use strict';

    whatsOn.$inject = ["config", "rxhttp", "whatsOnViewModelDefinition", "$timeout", "$q"];
    angular.module('ovpApp.player.whatsOn', ['ovpApp.config', 'ovpApp.player.whatsOnDelegate', 'ovpApp.services.rxUtils']).factory('whatsOn', whatsOn);

    /* @ngInject */
    function whatsOn(config, rxhttp, whatsOnViewModelDefinition, $timeout, $q) {
        var service = {
            now: now,
            nowOrImminent: nowOrImminent,
            lineup: lineup
        };

        var lineupPromise = undefined;

        var onNextThreshold = parseInt(config.thresholdForOnNextTitleUpdateInMinutes) * 60 * 1000;
        var fifteenMinutes = 900000;

        return service;

        ////////////////

        function now(channels) {
            return atTime(channels, Date.now());
        }

        function nowOrImminent(channels) {
            return atTime(channels, Date.now() + onNextThreshold);
        }

        function atTime(channels, dateMsec) {
            var isArray = angular.isArray(channels);
            if (!isArray) {
                channels = [channels];
            }

            return lineup().then(function (lineup) {
                var programs = channels.map(function (channel) {
                    var programs = lineup[channel.tmsId] || [];
                    var whatsOnNow = programs.find(function (program) {
                        var start = program.startTimeSec * 1000;
                        var end = start + program.durationMinutes * 60000;
                        return dateMsec >= start && dateMsec < end;
                    });
                    if (whatsOnNow) {
                        whatsOnNow.channel = channel;
                    }
                    return whatsOnNow;
                }).map(function (whatsOnNow) {
                    return whatsOnNow ? whatsOnViewModelDefinition.createInstance(whatsOnNow) : undefined;
                });

                return isArray ? programs : programs[0]; //Return the same type that was passed in
            });
        }

        function lineup() {
            if (!lineupPromise) {
                var url = '' + config.piHost + config.services.onNowOnNext + '?shows=3&viewParentallyBlocked=true';
                lineupPromise = rxhttp.get(url, { withCredentials: true }).retry(3).map(function (response) {
                    return response.data;
                }).toPromise($q)['catch'](function () {
                    //Make sure the failed promise isn't stored (preventing future request)
                    lineupPromise = undefined;
                });

                $timeout(function () {
                    return lineupPromise = undefined;
                }, fifteenMinutes, false);
            }
            return lineupPromise;
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/whats-on.js.map
