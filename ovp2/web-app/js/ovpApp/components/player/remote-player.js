(() => {
    'use strict';

    angular.module('ovpApp.remotePlayer', [
        'ovpApp.remotePlayer.controls',
        'ovpApp.product.productActionService',
        'rx',
        'ovpApp.directives.focus'
    ]).factory('remotePlayService', remotePlayService)
    .component('remotePlayer', {
        templateUrl: '/js/ovpApp/components/player/remote-player.html',
        controller: class Player {
            /* @ngInject */
            constructor($state, remotePlayService, productActionService, $transitions, $timeout) {
                angular.extend(this, {$state, remotePlayService, productActionService, $transitions, $timeout});
            }
            $onInit() {
                this.visible = false;
                this.selectedStb = null;
                this.asset = null;
                this.ariaLiveMessage = '';
                this.buttonText = 'Switch Playback to This Device';
                this.remotePlaySubscription = this.remotePlayService.getSource()
                    .subscribe(options => {
                        if (options.asset) {
                            this.selectedStb = options.stb;
                            this.asset = options.asset;
                            this.tvAction = options.tvAction;
                            this.ipAction = options.ipAction;
                        }
                    });
                this.$transitions.onEnter({}, (transition) => {
                    this.visible = transition.to().name.startsWith('ovp.playRemote');
                    if (this.visible) {
                        // for screen reader
                        this.$timeout(() => {
                            this.ariaLiveMessage = `This title has been sent to play on TV named
                                ${this.selectedStb.name || this.selectedStb.macAddress},
                                Use your TV remote or device for player controls.`;
                        }, 100);
                    }
                });
            }
            $onDestroy() {
                if (this.remotePlaySubscription) {
                    this.remotePlaySubscription.dispose();
                }
            }
            switchPlayBack() {
                this.remotePlayService.stopRemotePlay();

                if (this.ipAction) {
                    this.productActionService.executeAction(this.ipAction, this.asset);
                } else {
                    this.$state.go('ovp.livetv');
                }
            }
        }
    });

    function remotePlayService(rx) {
        const state = new rx.BehaviorSubject({});
        return {
            remotePlay,
            stopRemotePlay,
            getSource
        };

        /////////////

        function remotePlay(options = {}) {
            state.onNext(options);
        }

        function stopRemotePlay() {
            state.onNext({});
        }

        function getSource() {
            return state
                .asObservable()
                .distinctUntilChanged();
        }
    }
})();
