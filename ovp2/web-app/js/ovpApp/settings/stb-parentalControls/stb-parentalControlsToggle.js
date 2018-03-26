(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.toggle', [
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.stbSettingsService',
        'ovpApp.parentalControlsDialog',
        'ovpApp.config'])
    .component('stbParentalControlsToggle', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-parentalControlsToggle.html',
        bindings: {
            'stb': '<',
            'blockingEnabled': '<'
        },
        controller: class StbPCBlock {
            /* @ngInject */
            constructor(StbSettingsService, parentalControlsDialog, parentalControlsContext,
                config, $q) {
                angular.extend(this, {StbSettingsService, parentalControlsDialog, parentalControlsContext,
                    config, $q});
            }

            $onInit() {
                this.pcBlockingEnabledForClient = this.blockingEnabled || false;
                this.pcDialog = this.parentalControlsDialog
                    .withContext(this.parentalControlsContext.STB_SETTINGS, this.stb);
            }

            togglePCBlocking() {
                if (this.pcBlockingEnabledForClient) {
                    return this.pcDialog.unlock().then(() => {
                        this.pcBlockingEnabledForClient = !this.pcBlockingEnabledForClient;
                    });
                } else {
                    this.pcBlockingEnabledForClient = !this.pcBlockingEnabledForClient;
                    return this._setPCBlocking(this.pcBlockingEnabledForClient).catch((err) => {
                        // Reset settings
                        this.pcBlockingEnabledForClient = !this.pcBlockingEnabledForClient;
                        return this.$q.reject(err);
                    });
                }
            }

            /* Private method */
            _setPCBlocking(eanbled) {
                return this.StbSettingsService.togglePCBlocking(this.stb, eanbled);
            }
        }
    });
})();
