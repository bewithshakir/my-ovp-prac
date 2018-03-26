'use strict';

(function () {
    'use strict';

    sapService.$inject = ["rx", "$rootScope", "ovpStorage", "storageKeys"];
    angular.module('ovpApp.player.sapService', ['rx']).factory('sapService', sapService);

    /** @ngInject */
    function sapService(rx, $rootScope, ovpStorage, storageKeys) {
        var map = new Map();

        var notAvailable = {
            available: false,
            enabled: false
        };

        var service = {
            withPlayer: withPlayer
        };

        return service;

        ///////////

        function withPlayer(player) {
            var sapState = map.get(player);
            if (!sapState) {
                sapState = init(player);
                map.set(player, sapState);
            }
            return sapState;
        }

        function init(player) {
            var subject = new rx.BehaviorSubject(notAvailable);

            $rootScope.$on('sap-reset', function () {
                subject.onNext(notAvailable);
            });
            player.on('sap-init', function (val) {
                if (val.audio.length > 1) {
                    subject.onNext({
                        available: true,
                        enabled: !!ovpStorage.getItem(storageKeys.sapEnabled)
                    });
                } else {
                    subject.onNext(notAvailable);
                }
            });

            return {
                stream: subject.asObservable().distinctUntilChanged(),
                toggle: function toggle() {
                    var currentState = subject.getValue();
                    var newEnabled = !currentState.enabled;
                    ovpStorage.setItem(storageKeys.sapEnabled, newEnabled);
                    player.setSAPEnabled(newEnabled);

                    subject.onNext(angular.extend({}, currentState, { enabled: newEnabled }));

                    // Analytics:
                    this.$rootScope.$emit('Analytics:select', {
                        operationType: 'sapToggle',
                        toggleState: newEnabled,
                        elementStandardizedName: 'sapToggle',
                        pageSectionName: 'DeriveFromOpType'
                    });
                }
            };
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/sap-service.js.map
