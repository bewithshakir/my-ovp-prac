(() => {
    'use strict';

    angular.module('ovpApp.remotePlayer.setTopConnection', [
        'ovpApp.remotePlayer'
    ]).component('setTopConnection', {
        templateUrl: '/js/ovpApp/components/player/set-top-connection.html',
        controller: class SetTopConnectionController {
            /* @ngInject */
            constructor(remotePlayService, $state, $transitions, $timeout) {
                angular.extend(this, {
                    remotePlayService,
                    $state,
                    $transitions,
                    $timeout
                });
            }
            $onInit() {
                this.remotePlaySubscription = this.remotePlayService.getSource()
                    .subscribe(options => {
                        this.options = options;
                        this.asset = options.asset;
                        this.stb = options.stb;

                        // Update program-title and stb-title
                        this.stbTitle = options.stb && (options.stb.name || options.stb.macAddress);
                        this.programTitle = options.asset && options.asset.title;
                    });
                this.$transitions.onSuccess({}, () => {
                    if (this.canShow()) {
                        // for screen reader
                        this.$timeout(() => {
                            this.ariaLiveMessage = `Watching ${this.programTitle} on ${this.stbTitle}`;
                        }, 100);
                    } else {
                        this.ariaLiveMessage = '';
                    }
                });
            }
            $onDestroy() {
                if (this.remotePlaySubscription) {
                    this.remotePlaySubscription.dispose();
                }
            }
            canShow() {
                return !this.$state.includes('ovp.playRemote') && !!this.asset && !!this.stb;
            }
            reconnect() {
                this.$state.go('ovp.playRemote', this.options);
            }
        }
    });
})();
