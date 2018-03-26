(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.shareInProgressList', [
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.stbSettingsService'
    ])
    .component('stbShareInProgressList', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-shareInProgressList.html',
        bindings: {
            'stb': '<'
        },
        controller: class StbShareInProgressList {
            /* @ngInject */
            constructor(StbSettingsService) {
                angular.extend(this, {StbSettingsService});
            }

            $onInit() {
                this.setToggleState();
            }

            toggleShareInProgressList() {
                this.shareInProgressListEnabledForClient = !this.shareInProgressListEnabledForClient;
                this.StbSettingsService.setShareInProgressListForClient(this.stb,
                    this.shareInProgressListEnabledForClient)
                    .then(this.setToggleState.bind(this), this.setToggleState.bind(this));

            }

            setToggleState() {
                this.StbSettingsService.shareInProgressListEnabled(this.stb).then((enabled) => {
                    this.shareInProgressListEnabledForClient = enabled;
                });
                if (this.shareInProgressListEnabledForClient === undefined) {
                    this.shareInProgressListEnabledForClient = false;
                }
            }
        }
    });
})();
