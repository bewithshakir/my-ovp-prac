(() => {
    'use strict';

    angular.module('ovpApp.playerControls')
        .component('toggleCc', {
            templateUrl: '/js/ovpApp/components/player/toggle-cc.html',
            bindings: {
                player: '<'
            },
            controller: class ToggleCCController {
                /* @ngInject */
                constructor($rootScope, version, ovpStorage, storageKeys) {
                    angular.extend(this, {
                        $rootScope,
                        version,
                        ovpStorage,
                        storageKeys
                    });
                }

                $onInit() {
                    this.hovered = false;
                    this.isCCEnabled = this.ovpStorage.getItem(this.storageKeys.ccEnabled);

                    this.playerSubscriptions = {
                        'cc-enabled-toggled': (val) => this.onCCToggled(val)
                    };
                    this.registerPlayerEvents();
                }

                registerPlayerEvents() {
                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.on(key, this.playerSubscriptions[key]);
                        }
                    }
                }

                $onDestroy() {
                    for (let key in this.playerSubscriptions) {
                        if (this.playerSubscriptions.hasOwnProperty(key)) {
                            this.player.off(key, this.playerSubscriptions[key]);
                        }
                    }
                }

                onCCToggled(val) {
                    this.isCCEnabled = val;
                }

                ccToggle() {
                    this.player.setCCEnabled(!this.isCCEnabled);

                    // Analytics:
                    this.$rootScope.$emit('Analytics:select', {
                        operationType: 'closedCaptionToggle',
                        toggleState: !this.isCCEnabled,
                        elementStandardizedName: 'closedCaptionToggle',
                        pageSectionName: 'DeriveFromOpType'
                    });
                }

                ccToggleImage() {
                    if (this.hovered) {
                        return this.version.appVersion + '/images/cc-active.svg';
                    } else {
                        return this.isCCEnabled ? this.version.appVersion +
                            '/images/cc-active.svg' : this.version.appVersion + '/images/cc.svg';
                    }
                }
            }
        });
})();
