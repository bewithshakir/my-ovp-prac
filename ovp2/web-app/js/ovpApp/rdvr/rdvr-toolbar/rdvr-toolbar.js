(function () {
    'use strict';

    /**
     * rdvr-toolbar
     *
     * Renders a set of widgets for the top of the rdvr pages
     *
     * Example Usage:
     * <rdvr-toolbar options="someInputValue"></rdvr-toolbar>
     *
     * Bindings:
     *    options: ([type]) [description]
     */
    angular.module('ovpApp.rdvr.rdvrToolbar', ['ovpApp.stbPicker', 'ovpApp.renameStb'])
        .component('rdvrToolbar', {
            bindings: {
                options: '<'
            },
            templateUrl: '/js/ovpApp/rdvr/rdvr-toolbar/rdvr-toolbar.html',
            controller: class RdvrToolbar {
                /* @ngInject */
                constructor($timeout, $interval, dateUtil, rx, stbService, modal, $q) {
                    angular.extend(this, {$timeout, $interval, dateUtil, rx, stbService, modal, $q});
                }

                $onInit() {
                    this.subscription = this.stbService.currentStbSource
                        .filter(stb => stb && stb.dvr === true)
                        .subscribe(stb => this.stb = stb);
                }

                $onDestroy() {
                    this.subscription.dispose();
                }

                $onChanges(changes) {
                    if (changes.options) {
                        this.showToggler = changes.options.showToggler || false;
                    }
                }

                showDvrPicker() {
                    this.modal.open({
                        component: 'stb-picker',
                        windowClass: 'ovp-watch-on-tv-picker-container',
                        showCloseIcon: false,
                        ariaDescribedBy: 'picker-description',
                        ariaLabelledBy: 'picker-label',
                        resolve: {
                            stbs: () => {
                                return this.$q.all([
                                    this.stbService.getSTBs(),
                                    this.stbService.getCurrentStb()
                                ]).then(([stbs, current]) => {
                                    return stbs.filter(s => s.dvr)
                                        // Move the selected set top box to the front of the list
                                        .sort((a, b) => {
                                            if (a.macAddress === current.macAddress) {
                                                return -1;
                                            } else if (b.macAddress === current.macAddress) {
                                                return 1;
                                            }
                                            return 0;
                                        });
                                });
                            },
                            title: () => 'Select your DVR',
                            ariaDescription: () => 'Choose a DVR device from the list to manage'
                        }
                    }).result.then(this.stbService.setCurrentStb);
                }

                renameStb() {
                    this.modal.open({
                        component: 'rename-stb',
                        windowClass: 'ovp-watch-on-tv-picker-container',
                        showCloseIcon: false,
                        ariaLabelledBy: 'rename-label',
                        resolve: {
                            stb: () => this.stb
                        }
                    });
                }
            }
        });
})();
