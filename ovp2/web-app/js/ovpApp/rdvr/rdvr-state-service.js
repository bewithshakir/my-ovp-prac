(function () {
    'use strict';

    angular.module('ovpApp.rdvr.rdvrStateService', [
        'ovpApp.services.stbService',
        'rx'
    ])

    .factory('rdvrStateService', rdvrStateService);

    /* @ngInject */
    function rdvrStateService($rootScope, stbService, rdvrService, rx) {
        let conflicts = 0, stb;

        const stbChanged = stbService.currentStbSource.skip(1);

        stbService.currentStbSource
            .do(newStb => {
                stb = newStb;
                conflicts = 0;
            })
            .flatMap(newStb => {
                return rdvrService.getScheduledRecordings(newStb)
                    .takeUntil(stbChanged)
                    .catch(() => rx.Observable.empty());
            })
            .subscribe(result => {
                conflicts = result.data.reduce((a, b) => b.conflicted ? a + 1 : a, 0);
                if (conflicts > 99) {
                    conflicts = '99+';
                } else if (conflicts > 0 && !result.isComplete) {
                    conflicts = conflicts + '+';
                }
            });

        const always = () => true,
            hasDvr = () => stb && stb.dvr === true,
            hasRdvrVersion2 = () => hasDvr() && stb.rdvrVersion > 1,
            states = [
                {
                    title: 'My Recordings',
                    description: '',
                    class: '',
                    state: 'ovp.dvr.my-recordings',
                    enabled: hasRdvrVersion2,
                    analytics: {
                        appSection: 'dvrManager',
                        pageName: 'dvrRecordings',
                        isLazyLoad: false
                    }
                },
                {
                    title: 'Scheduled',
                    description: '',
                    class: '',
                    state: 'ovp.dvr.scheduled',
                    enabled: always,
                    badges: () => conflicts,
                    analytics: {
                        appSection: 'dvrManager',
                        pageName: 'dvrScheduled',
                        isLazyLoad: false
                    }
                },
                {
                    title: 'Series Priority',
                    description: '',
                    class: '',
                    state: 'ovp.dvr.priority',
                    enabled: hasRdvrVersion2,
                    analytics: {
                        appSection: 'dvrManager',
                        pageName: 'dvrSeriesManager',
                        isLazyLoad: true
                    }
                }
            ];

        return {
            states: states,
            getState: function (state) {
                return states.find((s) => s.state == state);
            },
            nextAvailableState: function () {
                let state = states.find((s) => {
                    return s.enabled();
                });
                return state;
            }
        };
    }
}());
