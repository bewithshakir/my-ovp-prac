(function () {
    'use strict';

    angular
        .module('ovpApp.product.rental', [
                'ovpApp.config',
                'ovpApp.messages',
                'ui.router',
                'ovpApp.components.ovp.rating',
                'ovpApp.product.rental-service',
                'ovpApp.services.errorCodes',
                'ovpApp.services.profileService',
                'ovpApp.purchasePinDialog',
                'ajoslin.promise-tracker',
                'ovpApp.components.popup'
            ])
        .component('productRental', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/product/rental/product-rental-popup.html',
        controller: class ProductRental {
            /* @ngInject */
            constructor($scope, $state, $http, config,
                $rootScope, $log, ProductRentalService, profileService,
                $controller, messages, $uibModalStack, errorCodesService) {
                angular.extend(this, {$scope, $state, $http, config,
                    $rootScope, $log, ProductRentalService, profileService,
                    $controller, messages, $uibModalStack, errorCodesService});
                this.$scope.pc = this.$scope.$new();
                this.$controller('PurchasePinDialogController', {$scope: this.$scope});
            }

            $onInit() {
                const options = this.resolve.options || {};
                this.asset = options.asset;
                this.action = options.action;
                this.step = 'options';
                this.modalDomEl = this.$uibModalStack.getTop().value.modalDomEl;
                this.streamOptions = [];
                this.oohWarningMessage = this.errorCodesService.getMessageForCode('WLC-1012');
                this.rentLoadingMessage = this.messages.getMessageForCode('MSG-9070');
                this.RENT_SINGLE_OPTION_TITLE = this.messages.getMessageForCode('MSG-9071');
                this.RENT_COMPLEX_OPTION_TITLE = this.messages.getMessageForCode('MSG-9072');

                this.profileService.isAccessibilityEnabled().then((hasCapability) => {
                    this.hasAccessibility = hasCapability;
                });

                if (this.asset && this.action) {
                    this.streamOptions = this.ProductRentalService.getRentalOptions(this.asset);
                    this.startStep('options');

                    if ('confirm' === this.step) {
                        this.$rootScope.$emit('Analytics:modal-view', {
                            context: 'tvodFlow',
                            featureStepName: 'rentConfirmation',
                            modalName: 'rentConfirmation',
                            modalType: 'options',
                            triggeredBy: 'user',
                            modalText: (this.step === 'options' ?
                                this.RENT_COMPLEX_OPTION_TITLE : this.RENT_SINGLE_OPTION_TITLE)
                        });
                    }
                } else {
                    this.modalInstance.dismiss('error');
                    this.$log.error('Unable to start the rental, the asset and/or action is missing');
                }
            }

            //Options step complete
            selectOption(option) {
                if (option) {
                    this.selectedOption = option;
                    this.selectedStream = this.asset.streamList[this.selectedOption.streamIndex];
                    this.startStep('pin');
                } else {
                    this.invalidOptionMessage = 'This option is Invalid, please select another';
                }
            }

            cancel(msg) {
                this.modalInstance.close(msg);

                // Analytics
                this.$rootScope.$broadcast('Analytics:select', {
                    source: 4,
                    category: 'navigation',
                    context: 'tvodFlow',
                    featureStepName: 'rentConfirmation',
                    pageName: 'rentConfirmation',
                    elementUiName: 'cancel',
                    pageSectionName: 'conversionArea',
                    elementStandardizedName: 'cancel',
                    triggeredBy: 'user',
                    operationType: 'buttonClick',
                    featureCurrentStep: 4
                });
                this.$rootScope.$emit('Analytics:tvod-purchase-stop', { // cancelled
                    context: 'tvodFlow',
                    success: false,
                    triggeredBy: 'user',
                    asset: this.asset,
                    featureCurrentStep: 5
                });
            }

            //Confirm step complete
            confirm(suppressAnalytics) {
                this.startStep('renting');

                // Analytics: If 'suppressAnalytics' is true, this
                // event was already published earlier.
                if (!suppressAnalytics) {
                    this.$rootScope.$broadcast('Analytics:select', {
                        source: 5,
                        category: 'navigation',
                        context: 'tvodFlow',
                        featureStepName: 'rentConfirmation',
                        pageName: 'rentConfirmation',
                        elementUiName: 'rent',
                        pageSectionName: 'conversionArea',
                        elementStandardizedName: 'rent',
                        triggeredBy: 'user',
                        operationType: 'buttonClick',
                        featureCurrentStep: 4
                    });
                }

                this.ProductRentalService.confirmRental(this.asset, this.selectedOption)
                    .then(() => {
                        this.modalInstance.close('success');
                    }, (err) => {
                        this.displayError(err);
                        this.startStep('error');
                    });
            }

            startStep(step) {
                if (step === 'pin') {
                    this.step = 'pin';
                    this.modalDomEl.addClass('hidden');
                    this.ProductRentalService.validatePins(this.$scope, this.asset, this.selectedStream)
                        .then((data) => {
                            if (data.skipConfirm) {
                                // TODO: Seems 'skipConfirm' is somewhat misleadingly named.
                                this.confirm(data.skipConfirm);
                            } else {
                                this.startStep('confirm');
                            }
                            this.modalDomEl.removeClass('hidden');
                        }, () => {
                            //Cancel out of dialog
                            this.modalInstance.dismiss('error');
                        });
                } else if (step === 'confirm') {
                    if (!this.selectedOption) {

                        this.selectedOption = this.streamOptions[0];
                        this.selectedStream = this.asset.streamList[this.selectedOption.streamIndex];
                    }

                    // Analytics
                    this.$rootScope.$emit('Analytics:modal-view', {
                        context: 'tvodFlow',
                        featureStepName: 'rentConfirmation',
                        modalName: 'rentConfirmation',
                        modalType: 'options',
                        triggeredBy: 'user',
                        modalText: this.RENT_SINGLE_OPTION_TITLE
                    });

                    this.step = 'confirm';
                } else if (step === 'options') {
                    if (this.streamOptions.length > 1) {
                        this.step = 'options';
                    } else {
                        this.selectedOption = this.streamOptions[0];
                        this.selectedStream = this.asset.streamList[this.selectedOption.streamIndex];
                        this.startStep('pin');
                    }
                } else if (step === 'renting') {
                    this.step = 'renting';
                } else if (step === 'error') {
                    this.step = 'error';
                }
            }

            displayError(err) {
                this.error = {
                    code: err.code || 'WTX-9000'
                };
                this.error.message = this.errorCodesService.getMessageForCode(this.error.code);

                // Add raw rent error to display, if configured to do so.
                let errorData = err.data || {};
                if (this.config.displayRawRentError && errorData.context &&
                    errorData.context.detailedResponseDescription) {
                    this.error.details =  errorData.context.detailedResponseDescription;
                }

                // Analytics (Just updating a modal, not opening a new one)
                this.$rootScope.$emit('Analytics:modal-start');
                this.$rootScope.$emit('Analytics:modal-view', {
                    context: 'tvodFlow',
                    featureStepName: 'rentConfirmation',
                    modalName: 'purchaseError',
                    modalType: 'error',
                    triggeredBy: 'application',
                    modalText: this.error.message
                });
            }
        }
    });
})();
