(() => {
    'use strict';

    /**
     * Dialog for selecting a set top box
     *
     * bindings:
     *   resolve: {
     *     title: title of the dialog
     *     stbs: list of set top boxes
     *     onSelect: callback to execute when the stb is selected.
     *               If this takes time, a loading spinner will display
     *   }
     *
     */
    angular.module('ovpApp.stbPicker', [])
        .component('stbPicker', {
            templateUrl: '/js/ovpApp/components/stb-picker/stb-picker.html',
            bindings: {
                resolve: '<',
                modalInstance: '<'
            },
            controller: class StbPicker {
                /* @ngInject */
                constructor(stbService, version, promiseTracker) {
                    angular.extend(this, {
                        stbService,
                        version,
                        promiseTracker
                    });
                }

                $onInit() {
                    this.loadingTracker = this.promiseTracker();
                }

                $onChanges(changes) {
                    if (changes.resolve) {
                        this.title = this.resolve.title;
                        this.stbs = this.resolve.stbs;
                        this.callback = this.resolve.callback;
                        this.ariaDescription = this.resolve.ariaDescription;
                    }
                }

                closeIcon() {
                    return this.version.appVersion + '/images/close-x' +
                        (this.activeCloseIcon ? '-active' : '') + '.svg';
                }

                onSelect(stb) {
                    if (angular.isFunction(this.callback)) {
                        const promise = this.$q.when(this.callback(stb))
                            .then(
                                () => this.modalInstance.close(stb),
                                (error) => this.modalInstance.dismiss({error, stb})
                            );

                        this.loadingTracker.addPromise(promise);
                    } else {
                        this.modalInstance.close(stb);
                    }
                }
            }
        });
})();
