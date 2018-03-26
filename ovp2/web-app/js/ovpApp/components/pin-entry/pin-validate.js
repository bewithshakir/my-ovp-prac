(function () {
    'use strict';
    angular.module('ovpApp.components.pinEntry')
        .component('pinValidate', {
            bindings: {
                resolve: '<',
                modalInstance: '<'
            },
            templateUrl: '/js/ovpApp/components/pin-entry/pin-validate.html',
            controller: class PinValidate {
                /* @ngInject */
                constructor(parentalControlsService, $rootScope, $scope, messages, promiseTracker,
                    $element, $q, Debouncer, errorCodesService) {
                    angular.extend(this, {parentalControlsService, $rootScope, $scope, messages,
                        promiseTracker, $element, $q, Debouncer, errorCodesService});
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
                        this.pinService = options.pinService;
                        this.showOOHWarningMessage = options.showOOHWarningMessage || false;
                        this.pleaseEnterPin = options.pleaseEnterPin ||
                            this.messages.getMessageForCode('MSG-9044');
                        this.minLength = options.minLength || 4;
                        this.maxLength = options.maxLength || 4;

                        let enableForgotPin = (options.enableForgotPin !== undefined) ? options.enableForgotPin : true;
                        this.$q.when(enableForgotPin)
                            .then(enabled => this.enableForgotPin = enabled);
                    }
                }

                onInputChange() {
                    this.showNumbersOnlyErrorMessage = false;
                    this.errorDelay.debounce(() => {
                        this.showNumbersOnlyErrorMessage = this.form.currentPIN.$error.pattern;
                    });
                }

                validatePIN() {
                    this.isValidationError = false;
                    if (this.currentPIN !== undefined) {
                        const promise = this.pinService.validatePIN(this.currentPIN).then(() => {
                            this.modalInstance.close('pinValidated');
                            this.isValidationError = false;

                            // Analytics Event
                            this.$rootScope.$emit('Analytics:pinEntry', {
                                // category: 'navigation',
                                // pinType: 'purchaseControl',
                                // context: 'tvodFlow',
                                // operationType: 'purchaseControl',
                                success: true
                            });

                        }, () => {
                            this.isValidationError = true;
                            this.currentPIN = '';
                            this.$element.find('#pin').focus();
                            this.errorMessage = this.errorCodesService.getMessageForCode('WPC-1006');

                            // Analytics Event
                            this.$rootScope.$emit('Analytics:pinEntry', {
                                // category: 'navigation',
                                // pinType: 'purchaseControl',
                                // context: 'tvodFlow',
                                // operationType: 'purchaseControl',
                                success: false
                            });

                        });
                        this.loadingTracker.addPromise(promise);
                    } else {
                        this.isValidationError = true;
                    }
                }

                forgotPIN() {
                    this.modalInstance.dismiss('forgotPIN');
                }
            }
        });
})();
