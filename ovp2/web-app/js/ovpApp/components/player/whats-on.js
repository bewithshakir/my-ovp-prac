(function () {
    'use strict';

    angular
        .module('ovpApp.player.whatsOn', [
            'ovpApp.config',
            'ovpApp.player.whatsOnDelegate',
            'ovpApp.services.rxUtils'
        ])
        .factory('whatsOn', whatsOn);

    /* @ngInject */
    function whatsOn(config, rxhttp, whatsOnViewModelDefinition, $timeout, $q) {
        let service = {
            now,
            nowOrImminent,
            lineup
        };

        let lineupPromise;

        const onNextThreshold = parseInt(config.thresholdForOnNextTitleUpdateInMinutes) * 60 * 1000;
        const fifteenMinutes = 900000;

        return service;

        ////////////////

        function now(channels) {
            return atTime(channels, Date.now());
        }

        function nowOrImminent(channels) {
            return atTime(channels, Date.now() + onNextThreshold);
        }

        function atTime(channels, dateMsec) {
            let isArray = angular.isArray(channels);
            if (!isArray) {
                channels = [channels];
            }

            return lineup()
                .then(lineup => {
                    let programs = channels
                        .map(channel => {
                            let programs = lineup[channel.tmsId] || [];
                            let whatsOnNow = programs.find(program => {
                                let start = program.startTimeSec * 1000;
                                let end = start + (program.durationMinutes * 60000);
                                return dateMsec >= start && dateMsec < end;
                            });
                            if (whatsOnNow) {
                                whatsOnNow.channel = channel;
                            }
                            return whatsOnNow;
                        })
                        .map(whatsOnNow =>
                            whatsOnNow ? whatsOnViewModelDefinition.createInstance(whatsOnNow) : undefined
                        );

                    return isArray ? programs : programs[0]; //Return the same type that was passed in
                });
        }

        function lineup() {
            if (!lineupPromise) {
                let url = `${config.piHost}${config.services.onNowOnNext}?shows=3&viewParentallyBlocked=true`;
                lineupPromise = rxhttp.get(url, {withCredentials: true})
                    .retry(3)
                    .map(response => response.data)
                    .toPromise($q)
                    .catch(() => {
                        //Make sure the failed promise isn't stored (preventing future request)
                        lineupPromise = undefined;
                    });

                $timeout(() => lineupPromise = undefined, fifteenMinutes, false);
            }
            return lineupPromise;
        }
    }
})();
