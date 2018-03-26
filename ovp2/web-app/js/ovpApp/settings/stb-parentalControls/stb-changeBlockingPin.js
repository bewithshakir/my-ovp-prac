(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.changeBlockingPin', [
        'ovpApp.directives.dropdownList',
        'ovpApp.services.stbSettingsService'])
    .component('stbChangeBlockingPin', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-changeBlockingPin.html',
        bindings: {
            'stb': '<'
        },
        controller: class StbChangeBlockingPin {
            /* @ngInject */
            constructor(parentalControlsDialog, parentalControlsContext, $rootScope,
                alert) {
                angular.extend(this, {parentalControlsDialog, parentalControlsContext, $rootScope,
                    alert});
            }

            changePin() {
                this.parentalControlsDialog
                    .withContext(this.parentalControlsContext.STB_SETTINGS, this.stb)
                    .changePIN()
                    .then(() => this.$rootScope.$broadcast('message:growl', 'PIN successfully changed'));
            }
        }
    });
})();
