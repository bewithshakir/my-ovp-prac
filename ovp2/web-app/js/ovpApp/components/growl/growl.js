(() => {
    'use strict';
    angular.module('ovpApp.components.growlTracker', [
        'ajoslin.promise-tracker',
        'ovpApp.config'
    ])
    .component('growlTracker', {
        templateUrl: '/js/ovpApp/components/growl/growl.html',
        controller: class GrowlTrackerController {
            /* @ngInject */
            constructor($scope, promiseTracker, $timeout, $q, config, $document, $element) {
                angular.extend(this, {
                    $scope,
                    promiseTracker,
                    $timeout,
                    $q,
                    config,
                    $document,
                    $element
                });
            }

            $onInit() {
                this.message = undefined;
                this.growlTracker = this.promiseTracker();

                this.$scope.$on('message:growl', (event, message, millisecondsLength) => {
                    var length = angular.isDefined(millisecondsLength) ? millisecondsLength
                    : this.config.confirmMessageDelayMs;
                    this.clean();
                    this.deferred = this.$q.defer();
                    this.growlTracker.addPromise(this.deferred.promise);
                    this.message = message;
                    this.boundEventHandler = this.growlHandleEvent.bind(this);
                    this.$document.on('keydown', this.boundEventHandler);
                    this.$document.on('click', this.boundEventHandler);
                    this.previousActiveElement = this.$document[0].activeElement;
                    var width = this.$element.width();
                    if (width > 0) {
                        //element is fixed at 50% right, so set negative margin
                        this.$element.css('margin-right', -(width / 2));
                    }

                    //wait until after this is displayed to set the focus
                    this.$timeout(() => {
                        this.$document.find('#growlpopup .popupCloseClick').focus();
                    }, 50);

                    this.timer = this.$timeout(() => {
                        this.deferred.resolve();
                        this.deferred = undefined;
                        this.clean();
                    }, length);
                });

                this.hide = function () {
                    // Cleaning will cause the template to hide
                    this.clean();
                };
            }

            growlHandleEvent(evt) {
                // Do not register click for HTML elements that do not have classNames as String.
                // E.g; svg icons.
                if (!this.timer || !(evt.target && angular.isFunction(evt.target.className.search))) {
                    return;
                }

                //Not an escape key or enter or a click on the message, just keep the focus
                if (!(evt.keyCode === 27 || evt.keyCode === 13) &&
                    !(evt.keyCode === undefined && (angular.element(evt.target).parents('#popup').length === 0))) {
                    this.$document.find('#growlpopup .popupCloseClick').focus();
                    evt.preventDefault();
                    return true;
                }
            }

            clean() {
                this.$document.off('keydown', this.boundEventHandler);
                this.$document.off('click', this.boundEventHandler);

                this.message = undefined;

                if (this.timer) {
                    this.$timeout.cancel(this.timer);
                    this.timer = undefined;
                }

                if (this.deferred) {
                    this.deferred.reject();
                    this.deferred = undefined;
                }

                if (this.previousActiveElement) {
                    angular.element(this.previousActiveElement).focus();
                }
            }
        }
    });
})();
