(function () {
    'use strict';

    angular.module('ovpApp.settings.accessibility', ['ovpApp.services.accessibility'])
    .component('accessibility', {
        templateUrl: '/js/ovpApp/settings/accessibility/accessibility.html',
        controller: class Accessibility {
            /* @ngInject */
            constructor(AccessibilityService, $rootScope, $state) {
                angular.extend(this, {AccessibilityService, $rootScope, $state});
            }

            $onInit() {
                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                this.AccessibilityService.isEnabled().then(r => this.accessibilityEnabledForClient = r);
            }

            toggleAccessiblity(event) {
                event.preventDefault();
                event.stopPropagation();
                this.accessibilityEnabledForClient = !this.accessibilityEnabledForClient;

                // Analytics
                this.$rootScope.$emit('Analytics:prepareForRefresh');
                this.$rootScope.$emit('Analytics:select', {
                    operationType: 'accessibilityToggle',
                    toggleState: !this.accessibilityEnabledForClient,
                    elementStandardizedName: 'accessibilityToggle',
                    pageSectionName: 'settingsSelectArea'
                });

                if (this.accessibilityEnabledForClient) {
                    this.AccessibilityService.enable();
                } else {
                    this.AccessibilityService.disable();
                }

            }
        }
    });
}());
