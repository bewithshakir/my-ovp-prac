(function () {
    'use strict';

    /**
    * blockingScreen
    *
    * Example Usage:
    * <blocking-screen player="$ctrl.player" fullscreen="$ctrl.isVodMode()" asset="$ctrl.asset"></blocking-screen>
    *
    * Bindings:
    *    player: ([type]) the video player object
    *    fullscreen: ([type]) whether or not to take up the full area of the player. If false, a strip is left at the
    *        bottom for the controls
    *    asset: ([type]) the program to display information about
    */
    angular.module('ovpApp.player.blockingScreen', [
        'rx',
        'ovpApp.parentalControlsDialog'
    ])
    .factory('blockingScreenService', blockingScreenService)
    .component('blockingScreen', {
        bindings: {
            player: '<',
            fullscreen: '<',
            asset: '<'
        },
        templateUrl: '/js/ovpApp/components/player/blocking-screen.html',
        controller: class BlockingScreen {
            /* @ngInject */
            constructor($scope, $rootScope, $controller,
                $timeout, $document, $location, blockingScreenService, parentalControlsDialog,
                parentalControlsContext) {
                angular.extend(this, {$scope, $rootScope, $controller,
                    $timeout, $document, $location, blockingScreenService, parentalControlsDialog,
                    parentalControlsContext});
            }

            $onInit() {
                this.visible = false;

                this.stateSubscription = this.blockingScreenService.getSource()
                .subscribe(state => {
                    this.visible = state.visible;
                    if (this.visible) {
                        try {
                            this.player.stop();
                        } catch (ex) {}
                        this.blockType = state.type;
                        this.url = this.$location.$$host;
                    }
                });

                this.focusListener = this.$rootScope.$on(
                    'player:focusUnblock',
                    () => this.focusUnblock());
            }

            $onDestroy() {
                this.focusListener();
                this.stateSubscription.dispose();
            }

            focusUnblock() {
                this.$timeout(() => {
                    this.$document[0].getElementById('unblock-parental-controls-button').focus();
                }, 0, false);
            }

            unblockOnKeyDown($event) {
                const keys = {enter: 13, space: 32};
                if ([keys.space, keys.enter].indexOf($event.keyCode) > -1) {
                    this.unlockParentalControls();
                }
            }

            unlockParentalControls() {
                this.parentalControlsDialog
                    .withContext(this.parentalControlsContext.PLAYBACK)
                    .unlock()
                    .then(() => {
                        this.$rootScope.$broadcast('player:parentalControlsUnblocked');
                    });
            }

            onClick($event) {
                if ($event.target.className.indexOf('base-button') > -1) {
                    return;
                }
                this.$rootScope.$broadcast('player-control:click');
            }
        }
    });

    /**
    * Tracks and modifies the state of the blocking screen
    */
    /* @ngInject */
    function blockingScreenService(rx) {
        const state = new rx.BehaviorSubject({visible: false});
        const service = {
            show,
            hide,
            getSource
        };

        return service;

        ///////////

        /**
        * Display the blocking screen
        * @param  {object} options
        * @param  {string} options.type either 'adBlocker' or 'parentalControls'
        */
        function show(options = {}) {
            options.visible = true;
            state.onNext(options);
        }

        function hide() {
            state.onNext({visible: false});
        }

        function getSource() {
            return state
            .asObservable()
            .distinctUntilChanged();
        }
    }
})();
