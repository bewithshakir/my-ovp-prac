'use strict';

(function () {
    'use strict';

    rdvrStateService.$inject = ["$rootScope", "stbService", "rdvrService", "rx"];
    angular.module('ovpApp.rdvr.rdvrStateService', ['ovpApp.services.stbService', 'rx']).factory('rdvrStateService', rdvrStateService);

    /* @ngInject */
    function rdvrStateService($rootScope, stbService, rdvrService, rx) {
        var conflicts = 0,
            stb = undefined;

        var stbChanged = stbService.currentStbSource.skip(1);

        stbService.currentStbSource['do'](function (newStb) {
            stb = newStb;
            conflicts = 0;
        }).flatMap(function (newStb) {
            return rdvrService.getScheduledRecordings(newStb).takeUntil(stbChanged)['catch'](function () {
                return rx.Observable.empty();
            });
        }).subscribe(function (result) {
            conflicts = result.data.reduce(function (a, b) {
                return b.conflicted ? a + 1 : a;
            }, 0);
            if (conflicts > 99) {
                conflicts = '99+';
            } else if (conflicts > 0 && !result.isComplete) {
                conflicts = conflicts + '+';
            }
        });

        var always = function always() {
            return true;
        },
            hasDvr = function hasDvr() {
            return stb && stb.dvr === true;
        },
            hasRdvrVersion2 = function hasRdvrVersion2() {
            return hasDvr() && stb.rdvrVersion > 1;
        },
            states = [{
            title: 'My Recordings',
            description: '',
            'class': '',
            state: 'ovp.dvr.my-recordings',
            enabled: hasRdvrVersion2,
            analytics: {
                appSection: 'dvrManager',
                pageName: 'dvrRecordings',
                isLazyLoad: false
            }
        }, {
            title: 'Scheduled',
            description: '',
            'class': '',
            state: 'ovp.dvr.scheduled',
            enabled: always,
            badges: function badges() {
                return conflicts;
            },
            analytics: {
                appSection: 'dvrManager',
                pageName: 'dvrScheduled',
                isLazyLoad: false
            }
        }, {
            title: 'Series Priority',
            description: '',
            'class': '',
            state: 'ovp.dvr.priority',
            enabled: hasRdvrVersion2,
            analytics: {
                appSection: 'dvrManager',
                pageName: 'dvrSeriesManager',
                isLazyLoad: true
            }
        }];

        return {
            states: states,
            getState: function getState(state) {
                return states.find(function (s) {
                    return s.state == state;
                });
            },
            nextAvailableState: function nextAvailableState() {
                var state = states.find(function (s) {
                    return s.enabled();
                });
                return state;
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/rdvr-state-service.js.map
