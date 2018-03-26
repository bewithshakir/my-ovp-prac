(() => {
    'use strict';

    angular.module('ovpApp.playerControls')
        .component('toggleSap', {
            templateUrl: '/js/ovpApp/components/player/toggle-sap.html',
            bindings: {
                player: '<'
            },
            controller: class ToggleSAPController {
                /* @ngInject */
                constructor($rootScope, version, sapService) {
                    angular.extend(this, {$rootScope, version, sapService});
                }

                $onInit() {
                    const {stream, toggle} = this.sapService.withPlayer(this.player);
                    this.subscription = stream.subscribe(state => {
                        this.isSapEnabled = state.enabled;
                        this.isSAPAvailable = state.available;
                    });
                    this.sapToggle = toggle;

                    this.sapIconHovered = false;
                }

                $onDestroy() {
                    if (this.subscription) {
                        this.subscription.dispose();
                    }
                }

                sapToggleImage() {
                    if (this.sapIconHovered) {
                        return this.version.appVersion + '/images/sap-dvs-active.svg';
                    } else {
                        return this.isSapEnabled ? this.version.appVersion +
                            '/images/sap-dvs-active.svg' : this.version.appVersion + '/images/sap-dvs.svg';
                    }
                }
            }
        });
})();
