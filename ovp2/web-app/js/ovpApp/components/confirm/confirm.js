(function () {
    'use strict';

    angular.module('ovpApp.components.confirm', [
        'ajoslin.promise-tracker'
    ])
    .constant('CONFIRM_BUTTON_TYPE', {
        OK: 'OK',
        CANCEL: 'Cancel',
        YES: 'Yes',
        NO: 'No'
    })
    /*
     * Confirmation popup that provides one or two buttons (OK and/or CANCEL).
     *
     * Single options parameter may have the following properties:
     *
     * options.okLabel - Optional. String to display on the ok button. Defaults to
     * CONFIRM_BUTTON_TYPE.OK
     *
     * options.cancelLabel - Optional. String to display on the ok button. Defaults to
     * CONFIRM_BUTTON_TYPE.CANCEL
     *
     * options.preOkMessage - Required. String to be displayed when the dialog pops.
     *
     * options.postOkMessage - Optional. String to be displayed for a
     * configurable timeout (see options.confirmMessageDelayMs). The dialog
     * automatically dismisses after the timeout.
     *
     * options.okAction - Optional. A function returning a promise that is
     * executed when the OK button is pressed. If not set, the OK button simply
     * dismisses the dialog.
     *
     * options.cancelAction - Optional. A function that is
     * executed when the CANCEL button is pressed. If not set, the CANCEL button simply
     * dismisses the dialog.
     *
     * options.inProgressMessage - Optional. String to be displayed while Ok action is in
     * progress.
     *
     * options.getErrorString(error) - Optional. Function returning an error
     * string to display if okAction resolves to an error. ConfirmPopup will log an
     * error and then show an error with the string returned by this function
     * and dismiss the dialog.
     */
    .component('confirm', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/confirm/confirm.html',
        controller: class Confirm {
            /* @ngInject */
            constructor($q, $log, $rootScope, CONFIRM_BUTTON_TYPE, promiseTracker) {
                angular.extend(this, {$q, $log, $rootScope, CONFIRM_BUTTON_TYPE, promiseTracker});
            }

            $onChanges(changes) {
                if (changes.resolve) {
                    this.success = false;
                    this.destroyed = false;
                    this.loadingTracker = this.promiseTracker();

                    const options = this.resolve.options || {};
                    this.preOkMessage = options.preOkMessage;
                    this.postOkMessage = options.postOkMessage;
                    this.ariaLabel = options.ariaLabel;
                    this.ariaDescription = options.ariaDescription;
                    this.okLabel = options.okLabel || this.CONFIRM_BUTTON_TYPE.OK;
                    this.cancelLabel = options.cancelLabel || this.CONFIRM_BUTTON_TYPE.CANCEL;
                    this.okAction = options.okAction;
                    this.cancelAction = options.cancelAction;
                    this.inProgressMessage = options.inProgressMessage;
                    this.getErrorString = options.getErrorString;
                }
            }

            $onDestroy() {
                this.destroyed = true;
            }

            okHandler() {
                if (this.okAction) {
                    const promise = this.$q.when(this.okAction());
                    this.loadingTracker.addPromise(promise);
                    promise.then(
                        () => {
                            this.success = true;
                            if (!this.destroyed) {
                                this.modalInstance.close('success');
                                if (this.postOkMessage) {
                                    this.$rootScope.$broadcast('message:growl', this.postOkMessage);
                                }
                            }
                        },
                        error => {
                            this.modalInstance.dismiss('error');
                            this.$log.error(error);
                            if (this.getErrorString) {
                                this.$rootScope.$broadcast('message:growl', this.getErrorString(error));
                            }
                        });
                } else {
                    this.modalInstance.close('success');
                }
            }

            cancelHandler() {
                if (this.cancelAction) {
                    this.cancelAction();
                }
                this.modalInstance.dismiss('cancel clicked');
            }
        }
    });
})();
