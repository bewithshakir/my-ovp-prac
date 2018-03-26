(function () {
    'use strict';

    /**
     * The ondemand subheader needs to be changed depending on what part
     * of ondemand is currently loaded. This service is used for getting
     * and setting the state of the subheader
     */
    angular.module('ovpApp.ondemand.subheaderService', [
            'rx'
        ])
        .factory('ondemandSubheaderService', function (rx) {
            const subject = new rx.BehaviorSubject({
                showFrontDoor: true
            });
            const service = {
                getSource,
                setState
            };

            return service;

            ////////////////

            function getSource() {
                return subject.asObservable();
            }

            function setState(state = {}) {
                subject.onNext(state);
            }
        });
})();
