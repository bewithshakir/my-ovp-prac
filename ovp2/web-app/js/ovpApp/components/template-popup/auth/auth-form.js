(() => {
    'use strict';

    angular.module('ovpApp.components.authForm', [
        'ovpApp.components.templatePopup',
        'ajoslin.promise-tracker',
        'ovpApp.services.parentalControlsService',
        'ovpApp.services.errorCodes',
        'ovpApp.config',
        'ovpApp.messages'])
    .component('authForm', {
        templateUrl: '/js/ovpApp/components/template-popup/auth/auth-form.html',
        bindings: {
            modalInstance: '<'
        },
        controller: class AuthFormController {
            /* @ngInject */
            constructor(config, promiseTracker, parentalControlsService,
                errorCodesService, messages) {
                angular.extend(this, {config, promiseTracker, parentalControlsService,
                    errorCodesService, messages});
            }

            $onInit() {
                this.isValidationError = false;
                this.loadingTracker = this.promiseTracker();
                this.headerMessage = this.messages.getMessageForCode('MSG-9051');
                this.user = {
                    password: ''
                };

                this.ivrNumber = this.config.forgotPinNumber;
                this.ivrNumberTelUri = this.messages.getMessageForCode('MSG-9101', {
                    IVR_NUMBER: this.ivrNumber.replace(/-/g, '')
                });

            }

            authenticate() {
                this.isValidationError = false;
                const promise = this.parentalControlsService.validateAdminPassword(this.user.password).then(() => {
                    this.modalInstance.close(this.user.password);
                }, () => {
                    this.errorMessage = this.errorCodesService.getMessageForCode('WPC-1001');
                    this.isValidationError = true;
                });

                this.loadingTracker.addPromise(promise);
            }
        }
    });
})();
