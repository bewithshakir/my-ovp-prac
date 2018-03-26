(() => {
    'use strict';

    angular.module('ovpApp.components.ooh', [
        'ovpApp.messages',
        'ovpApp.filters.toTrusted',
        'ovpApp.services.ovpStorage',
        'ovpApp.components.alert',
        'ovpApp.services.locationService',
        'ovpApp.services.errorCodes',
        'ovpApp.services.profileService'
    ])
    .component('ooh', {
        templateUrl: '/js/ovpApp/components/header/ooh/ooh.html',
        controller: class OohController {
            /* @ngInject */
            constructor($timeout, messages, $scope, ovpStorage, storageKeys, alert,
                locationService, OauthService, profileService, errorCodesService) {
                angular.extend(this, {$timeout, messages, $scope, ovpStorage, storageKeys, alert,
                    locationService, OauthService, profileService, errorCodesService});
            }

            $onInit() {
                this.tooltip = this.errorCodesService.getMessageForCode('WLC-1005');
                this.status = {
                    isopen: false
                };
                this.$scope.$on('LocationService:locationChanged', () => this.getLocation());
            }

            $postLink() {
                this.getLocation();
            }

            toggleDropdown($event) {
                $event.preventDefault();
                $event.stopPropagation();
                this.status.isopen = !this.status.isopen;
            }

            showOutOfUSMessage() {
                this.alert.open(this.errorCodesService.getAlertForCode('WLC-1002'));
            }

            showOutOfHomeMessage() {
                this.alert.open(this.errorCodesService.getAlertForCode('WLC-1006'));
            }

            showInHomeMessage() {
                this.alert.open(this.errorCodesService.getAlertForCode('MSG-9100'));
            }

            getLocation() {
                if (this.profileService.isSpecUOrBulkMDU()) {
                    // Ignore OOH messages for specU / bulk MDU
                    return;
                }
                this.OauthService.waitUntilAuthenticated()
                    .then(() => this.locationService.getLocation())
                    .then(
                        (location) => this.oohDone(location)
                    );
            }

            oohDone(location) {
                const isFirstCheck = typeof this.ovpStorage.getItem(this.storageKeys.behindOwnModem) !== 'boolean',
                    lastBehindOwnModem = this.ovpStorage.getItem(this.storageKeys.behindOwnModem) === true;

                if (isFirstCheck) {
                    if (!location.inUS) {
                        this.showOutOfUSMessage();
                    } else if (!location.behindOwnModem) {
                        this.showOutOfHomeMessage();
                    }
                } else if (lastBehindOwnModem !== location.behindOwnModem) {

                    if (!location.behindOwnModem) {
                        this.showOutOfHomeMessage();
                    } else if (location.behindOwnModem) {
                        this.showInHomeMessage();
                    }

                }

                this.isOoh = !location.behindOwnModem;
                this.ovpStorage.setItem(this.storageKeys.behindOwnModem, location.behindOwnModem);
            }
        }
    });
})();
