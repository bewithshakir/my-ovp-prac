(function () {
    'use strict';
    angular.module('ovpApp.components.pinEntry')
        .directive('comparePin', comparePin)
        .component('pinReset', {
            bindings: {
                resolve: '<',
                modalInstance: '<'
            },
            templateUrl: '/js/ovpApp/components/pin-entry/pin-reset.html',
            controller: class PinReset {
                /* @ngInject */
                constructor(PIN_ENTRY_TYPE, parentalControlsService, $rootScope, $scope, promiseTracker,
                    messages, Debouncer, errorCodesService) {
                    angular.extend(this, {PIN_ENTRY_TYPE, parentalControlsService, $rootScope, $scope, promiseTracker,
                        messages, Debouncer, errorCodesService});
                }

                $onInit() {
                    this.tagRegex = /(<[^>]+>)/g;
                    this.loadingTracker = this.promiseTracker();
                    this.parentalControlsService.isPrimaryAccount()
                        .then(isPrimaryAccount => this.isPrimaryAccount = isPrimaryAccount);
                    this.errorDelay = new this.Debouncer(this.$scope);
                }

                $onChanges(changes) {
                    if (changes.resolve) {
                        const options = this.resolve.options || {};
                        this.pinInstructions = options.pinInstructions;
                        this.headerMessage = options.headerMessage;
                        this.secondaryMessage = options.secondaryMessage;
                        this.password = options.password;
                        this.pinService = options.pinService;
                    }
                }

                onInputChange() {
                    this.showNumbersOnlyErrorMessage = false;
                    this.errorDelay.debounce(() => {
                        this.showNumbersOnlyErrorMessage = this.form.newPIN.$error.pattern;
                    });
                }

                resetPIN() {
                    const promise = this.pinService.shouldSetDefaults()
                        .then(shouldSetDefaults => {
                            if (shouldSetDefaults) {
                                return this.pinService.setPINForFirstTimeWithDefaultRatings(this.newPIN, this.password);
                            } else {
                                return this.pinService.setPIN(this.newPIN, this.password);
                            }
                        })
                        .then(() => {
                            this.modalInstance.close('pinReset');
                        }, () => {
                            this.modalInstance.dismiss('pinValidationError');
                            this.$rootScope.$broadcast('message:growl',
                                this.errorCodesService.getMessageForCode('WGE-1001')
                            );
                        });

                    this.loadingTracker.addPromise(promise);
                }
            }
        });

    /* @ngInject */
    function comparePin() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=comparePin'
            },
            link: function (scope, element, attributes, ngModel) {
                var hasValue = function (value) {
                    return angular.isDefined(value) && value.length == 4;
                };

                ngModel.$validators.comparePin = function (modelValue) {
                    if (!hasValue(modelValue)) {
                        return true;
                    } else {
                        return modelValue === scope.otherModelValue;
                    }
                };

                scope.$watch('otherModelValue', function () {
                    ngModel.$validate();
                });
            }
        };
    }
})();
