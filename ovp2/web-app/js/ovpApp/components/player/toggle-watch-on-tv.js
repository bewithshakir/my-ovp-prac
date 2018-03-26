(() => {
    'use strict';

    angular.module('ovpApp.playerControls')
        .component('toggleWatchOnTv', {
            bindings: {
                asset: '<',
                stream: '<'
            },
            templateUrl: '/js/ovpApp/components/player/toggle-watch-on-tv.html',
            controller: class ToggleWatchOnTvController {
                /* @ngInject */
                constructor(modal, version, $state, productActionService) {
                    angular.extend(this, {modal, version, $state, productActionService});
                }
                checkForWatchOnTvActions() {
                    this.hasWatchOnTvActions = this.asset ? this.asset.hasWatchOnTvActions : false;
                    if (this.asset && this.asset.isEpisode) {
                        this.hasWatchOnTvActions = !!this.action;
                    }
                    this.action = this.asset && this.asset.actions && this.asset.actions.find(a => {
                        return ((a.actionType === 'watchOnDemandOnTv') || (a.actionType === 'resumeOnDemandOnTv'));
                    });
                }
                $onInit() {
                    this.checkForWatchOnTvActions();
                }
                $onChanges() {
                    this.checkForWatchOnTvActions();
                }
                watchOnTvToggle() {
                    this.productActionService.executeAction(this.action, this.asset);
                }
                watchOnTvImage() {
                    if (this.asset && !this.hasWatchOnTvActions) {
                        return this.version.appVersion + '/images/watch-on-tv-disable.svg';
                    } else if (this.hovered) {
                        return this.version.appVersion + '/images/watch-on-tv-active.svg';
                    } else {
                        return this.version.appVersion + '/images/watch-on-tv.svg';
                    }
                }
            }
        });
})();
