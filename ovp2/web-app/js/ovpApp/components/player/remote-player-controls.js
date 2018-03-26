(() => {
    'use strict';

    angular.module('ovpApp.remotePlayer.controls', [
        'ovpApp.components.ovp.remotePlayerCCSettings',
        'ovpApp.components.modal'
    ]).component('remotePlayerControls', {
        bindings: {
            asset: '<',
            stb: '<'
        },
        templateUrl: '/js/ovpApp/components/player/remote-player-controls.html',
        controller: class RemotePlayerControls {
            /* @ngInject */
            constructor(version, modal, StbSettingsService) {
                angular.extend(this, {version, modal, StbSettingsService});
            }

            $onChanges() {
                this.getCCSettings();
            }

            getCCSettings() {
                if (this.stb) {
                    this.StbSettingsService.getSTBProperties(this.stb).then(result => {
                        this.allowedCCOptions = result.closedCaptioning;
                        this.allowedSAPOptions = result.secondaryAudio;

                        // Set default value for ccEnabled and sapEnabled
                        this.isCCEnabled = (this.allowedCCOptions.selection.defaultValue === 'Off') ?
                            false : true;
                        this.isSAPAvailable = (this.allowedSAPOptions.selection) ? true : false;
                        this.isSapEnabled = (!this.isSAPAvailable ||
                            this.allowedSAPOptions.selection.defaultValue === 'Off') ? false : true;

                        this.StbSettingsService.getPreferences(this.stb).then(preferences => {
                            this.ccSettings = preferences.closedCaptioning || {};
                            this.sapSettings = preferences.secondaryAudio || {};

                            this.isCCEnabled = (this.ccSettings.selection === 'Off') ? false : true;
                            this.isSapEnabled = (!this.isSAPAvailable || !this.sapSettings ||
                                !this.sapSettings.selection || this.sapSettings.selection === 'Off') ?
                                false : true;
                        });
                    });
                }
            }

            // ********** Toggle Settings **************

            showStbCcSettings() {
                this.modal.open({
                    component: 'ovp-remote-player-caption-settings',
                    windowClass: 'ovp-player-caption-settings',
                    showCloseIcon: false,
                    resolve: {
                        'stb': this.stb,
                        'allowedCCOptions': this.allowedCCOptions,
                        'ccSettings': this.ccSettings
                    }
                }).result.then(() => this.getCCSettings());
            }

            ccToggle() {
                this.isCCEnabled = !this.isCCEnabled;
                let ccValue = this.isCCEnabled ? 'On' : 'Off';
                this.StbSettingsService.updateCCSettings(this.stb, {
                    'selection': ccValue
                }).then(preferences => {
                    this.isCCEnabled = (preferences.closedCaptioning.selection === 'Off') ? false : true;
                }, () => {
                    this.isCCEnabled = !this.isCCEnabled; // Reset on error
                });
            }

            sapToggle() {
                this.isSapEnabled = !this.isSapEnabled;
                this.StbSettingsService.toggleSAP(this.stb, (this.isSapEnabled ? 'On' : 'Off'))
                    .then(preferences => {
                        this.isSapEnabled = (!preferences.secondaryAudio ||
                            preferences.secondaryAudio.selection === 'Off') ? false : true;
                    }, () => {
                        this.isSapEnabled = !this.isSapEnabled; // Reset on error
                    });
            }

            // ***************** Toggle Images

            ccToggleImage() {
                if (this.ccHovered) {
                    return this.version.appVersion + '/images/cc-active.svg';
                } else {
                    return this.isCCEnabled ? this.version.appVersion +
                        '/images/cc-active.svg' : this.version.appVersion + '/images/cc.svg';
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

            ccSettingsImage() {
                if (this.ccSettingsHovered) {
                    return this.version.appVersion + '/images/settings-active.svg';
                } else {
                    return this.version.appVersion + '/images/settings.svg';
                }
            }
        }
    });
})();
