(function () {
    'use strict';

    /**
     * infoPanel
     *
     * Displays information about the currently playing program in the player controls
     *
     * Example Usage:
     * <info-panel asset="$ctrl.someMovieOrTvShow"></info-panel>
     *
     * Bindings:
     *    asset: ([type]) The program to display information about
     */
    angular.module('ovpApp.playerControls')
        .component('infoPanel', {
            bindings: {
                asset: '<'
            },
            templateUrl: '/js/ovpApp/components/player/info-panel.html',
            controller: class InfoPanel {
                /* @ngInject */
                constructor($timeout, version, config, rx, createObservableFunction) {
                    angular.extend(this, {$timeout, version, config, rx, createObservableFunction});
                }

                $onInit() {
                    this.onFocus = this.createObservableFunction();
                    this.onMouseOver = this.createObservableFunction();
                    this.onMouseLeave = this.createObservableFunction();
                    this.togglePopup = this.createObservableFunction();

                    this.showInfoPanel = false;

                    const INFO_PANEL_TIMEOUT = parseInt(this.config.playerParameters.infoPopupTimeoutMs);

                    this.onMouseOver.subscribe(() => this.hovered = true);
                    this.onMouseLeave.subscribe(() => this.hovered = false);

                    let userInteracting = this.onFocus.merge(this.onMouseOver).map(() => true);
                    let userNotInteracting = this.onMouseLeave.map(() => false);

                    this.togglePopup.subscribe(() => {
                        this.showInfoPanel = !this.showInfoPanel;
                        if (this.showInfoPanel) {
                            let minimumTime = this.rx.Observable.timer(INFO_PANEL_TIMEOUT);

                            // Wait until 500 ms elapse with the user not hovering or focussing
                            userNotInteracting.merge(userInteracting)
                                .debounce(500)
                                .filter(val => !val)
                                .takeUntil(this.togglePopup)
                                .zip(minimumTime)
                                .first()
                                .subscribe(() => this.showInfoPanel = false);
                        }
                    });
                }

                getDirectors() {
                    return this.asset && this.asset.directors &&
                        this.asset.directors.map((director) => director.name).join(' ');
                }

                getActors() {
                    return this.asset && this.asset.actors &&
                        this.asset.actors.map((actor) => actor.name).join(', ');
                }

                image() {
                    let suffix = this.hovered || this.showInfoPanel ? '-active.svg' : '.svg';
                    return `${this.version.appVersion}/images/info-circle${suffix}`;
                }
            }
        });
})();
