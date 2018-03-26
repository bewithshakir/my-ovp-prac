(function () {
    'use strict';

    /**
     * quietLoadingTracker
     *
     * Displays an unobtrusive loading indicator, until a promise is resolved
     *
     * Example Usage:
     * <quiet-loading track="somePromise" message="'some message'"></quiet-loading>
     *
     * Bindings:
     *    track: (Promise) A promise object. When it resolves or rejects the loading will go away, provided
     *        no other outstanding promises are waiting to be resolved/rejected.
     *    message: (String) a message to display with the loading indicator. Defaults to 'Loading ...'
     */
    angular.module('ovpApp.directives.quiet-loading-tracker', [])
        .component('quietLoadingTracker', {
            bindings: {
                track: '<',
                message: '@'
            },
            template: `
                <div>
                    <div class="quiet-loading-tracker" ng-show="$ctrl.loading">
                        <div class="spinner"></div>
                        {{$ctrl.message}}
                    </div>
                    <div class='sr-only' role='status' aria-live='polite' aria-atomic='true' ng-bind="$ctrl.srMessage">
                    </div>
                </div>`,
            controller: class QuietLoadingTracker {
                /* @ngInject */
                constructor($q, $timeout) {
                    angular.extend(this, {$q, $timeout});
                }

                $onInit() {
                    this.loading = this.activePromises > 0;
                    this.srMessage = this.srMessage || '';
                }

                $onChanges(changes) {
                    if (changes.message && !this.message) {
                        this.message = 'Loading ...';
                    }

                    if (changes.track && this.track) {
                        this.loading = true;
                        //Use displayMessage to help with the a11y live
                        this.srMessage = this.message;
                        this.activePromises = this.activePromises ? this.activePromises + 1 : 1;
                        if (this.debounceTimeout) {
                            this.$timeout.cancel(this.debounceTimeout);
                        }

                        this.track.finally(() => {
                            this.activePromises--;
                            if (this.debounceTimeout) {
                                this.$timeout.cancel(this.debounceTimeout);
                            }
                            this.debounceTimeout = this.$timeout(() => this.debounce(), 50);
                        });
                    }
                }

                debounce() {
                    if (this.activePromises < 1) {
                        this.loading = false;
                        this.srMessage = '';
                    }
                    this.debounceTimeout = null;
                }
            }
        });
})();
