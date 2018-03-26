(() => {
    'use strict';

    angular.module('ovpApp.playerControls')
        .component('toggleCcSettings', {
            templateUrl: '/js/ovpApp/components/player/toggle-cc-settings.html',
            bindings: {
                player: '<'
            },
            controller: class ToggleCCSettingsController {
                /*  @ngInject */
                constructor($rootScope, version, modal) {
                    angular.extend(this, {
                        $rootScope,
                        version,
                        modal
                    });
                }

                $onInit() {
                    this.hovered = false;

                    this.playerSubscriptions = {
                        'playback-started': () => this.onPlaybackStarted()
                    };
                    this.ccSettingsChangedListener = this.$rootScope.$on('cc-settings-changed', (event, data) => {
                        this.player.setCCSettings(data);
                    });
                    this.registerPlayerEvents();
                }

                $onDestroy() {
                    if (this.ccSettingsChangedListener) {
                        this.ccSettingsChangedListener();
                    }

                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.off(key, this.playerSubscriptions[key]);
                        }
                    }
                }

                registerPlayerEvents() {
                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.on(key, this.playerSubscriptions[key]);
                        }
                    }
                }

                onPlaybackStarted() {
                    this.ccSettingsChangedListener = this.$rootScope.$on('cc-settings-changed', (event, data) => {
                        this.player.setCCSettings(data);
                    });
                }

                showCCSettings() {
                    this.modal.open({
                        component: 'ovp-caption-settings',
                        windowClass: 'ovp-player-caption-settings',
                        ariaDescribedBy: 'descriptionBlockText cc-text-color-button',
                        ariaLabelledBy: 'labelText',
                        showCloseIcon: false
                    });
                    // Enable CC
                    this.player.setCCEnabled(true);
                }

                ccSettingsImage() {
                    if (this.hovered || this.isCCSettingsVisible) {
                        return this.version.appVersion + '/images/settings-active.svg';
                    } else {
                        return this.version.appVersion + '/images/settings.svg';
                    }
                }
            }
        });
})();
