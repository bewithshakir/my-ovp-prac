(function () {
    'use strict';

    angular
        .module('ovpApp.player.sapService', ['rx'])
        .factory('sapService', sapService);

    /** @ngInject */
    function sapService(rx, $rootScope, ovpStorage, storageKeys) {
        const map = new Map();

        const notAvailable = {
            available: false,
            enabled: false
        };

        const service = {
            withPlayer
        };

        return service;

        ///////////

        function withPlayer(player) {
            let sapState = map.get(player);
            if (!sapState) {
                sapState = init(player);
                map.set(player, sapState);
            }
            return sapState;
        }

        function init(player) {
            const subject = new rx.BehaviorSubject(notAvailable);

            $rootScope.$on('sap-reset', () => {
                subject.onNext(notAvailable);
            });
            player.on('sap-init', val => {
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
                toggle: function () {
                    const currentState = subject.getValue();
                    const newEnabled = !currentState.enabled;
                    ovpStorage.setItem(storageKeys.sapEnabled, newEnabled);
                    player.setSAPEnabled(newEnabled);

                    subject.onNext(
                        angular.extend({}, currentState, {enabled: newEnabled})
                    );

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
}());
