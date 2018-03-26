(() => {
    'use strict';
    angular.module('ovpApp.components.loadingTracker', [
            'ajoslin.promise-tracker'])
        .component('loadingTracker', {
            templateUrl: '/js/ovpApp/components/loading-tracker/loading-tracker.html',
            controller: class LoadingTrackerController {
                /* @ngInject */
                constructor($scope, $element, promiseTracker) {
                    angular.extend(this, {
                        $scope, $element, promiseTracker
                    });
                }

                $onInit() {
                    var defaultMessage = 'Loading...';

                    this.$scope.$on('message:loading', (event, promise, message) => {
                        this.loadingTracker.addPromise(promise);
                        if (angular.isDefined(message)) {
                            this.message = message;
                        } else {
                            this.message = defaultMessage;
                        }
                    });

                    var width = this.$element.width();
                    if (width > 0) {
                        //element is fixed at 50% right, so set negative margin
                        this.$element.css('margin-right', -(width / 2));
                    }

                    this.$scope.$on('message:loading:cancel', () => this.reset());

                    this.reset();
                }

                reset() {
                    if (this.loadingTracker && this.loadingTracker.tracking()) {
                        this.loadingTracker.cancel();
                    }
                    this.loadingTracker = this.promiseTracker({activationDelay: 150});
                }
            }
        });
})();
