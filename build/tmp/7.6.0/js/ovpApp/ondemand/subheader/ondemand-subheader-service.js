'use strict';

(function () {
    'use strict';

    /**
     * The ondemand subheader needs to be changed depending on what part
     * of ondemand is currently loaded. This service is used for getting
     * and setting the state of the subheader
     */
    angular.module('ovpApp.ondemand.subheaderService', ['rx']).factory('ondemandSubheaderService', ["rx", function (rx) {
        var subject = new rx.BehaviorSubject({
            showFrontDoor: true
        });
        var service = {
            getSource: getSource,
            setState: setState
        };

        return service;

        ////////////////

        function getSource() {
            return subject.asObservable();
        }

        function setState() {
            var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            subject.onNext(state);
        }
    }]);
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/subheader/ondemand-subheader-service.js.map
