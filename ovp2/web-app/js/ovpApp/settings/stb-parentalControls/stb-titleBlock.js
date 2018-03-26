(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.titleBlock', [
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.stbSettingsService'])
    .component('stbTitleBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-titleBlock.html',
        bindings: {
            'stb': '<'
        },
        controller: class StbTitleBlock {
            /* @ngInject */
            constructor(StbSettingsService) {
                angular.extend(this, {StbSettingsService});
            }

            $onInit() {
                this.setToggleState();
            }

            toggleTitleBlocking() {
                this.titleBlockingEnabledForClient = !this.titleBlockingEnabledForClient;
                this.StbSettingsService.setTitleBlockForClient(this.stb, this.titleBlockingEnabledForClient)
                    .then(this.setToggleState.bind(this), this.setToggleState.bind(this));
            }

            setToggleState() {
                this.StbSettingsService.titleBlockingEnabled(this.stb).then((enabled) => {
                    this.titleBlockingEnabledForClient = enabled;
                });
                if (this.titleBlockingEnabledForClient === undefined) {
                    this.titleBlockingEnabledForClient = false;
                }
            }
        }
    });
})();
