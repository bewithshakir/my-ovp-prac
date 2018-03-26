'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.confirm', ['ajoslin.promise-tracker']).constant('CONFIRM_BUTTON_TYPE', {
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
        controller: (function () {
            /* @ngInject */

            Confirm.$inject = ["$q", "$log", "$rootScope", "CONFIRM_BUTTON_TYPE", "promiseTracker"];
            function Confirm($q, $log, $rootScope, CONFIRM_BUTTON_TYPE, promiseTracker) {
                _classCallCheck(this, Confirm);

                angular.extend(this, { $q: $q, $log: $log, $rootScope: $rootScope, CONFIRM_BUTTON_TYPE: CONFIRM_BUTTON_TYPE, promiseTracker: promiseTracker });
            }

            _createClass(Confirm, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.resolve) {
                        this.success = false;
                        this.destroyed = false;
                        this.loadingTracker = this.promiseTracker();

                        var options = this.resolve.options || {};
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
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.destroyed = true;
                }
            }, {
                key: 'okHandler',
                value: function okHandler() {
                    var _this = this;

                    if (this.okAction) {
                        var promise = this.$q.when(this.okAction());
                        this.loadingTracker.addPromise(promise);
                        promise.then(function () {
                            _this.success = true;
                            if (!_this.destroyed) {
                                _this.modalInstance.close('success');
                                if (_this.postOkMessage) {
                                    _this.$rootScope.$broadcast('message:growl', _this.postOkMessage);
                                }
                            }
                        }, function (error) {
                            _this.modalInstance.dismiss('error');
                            _this.$log.error(error);
                            if (_this.getErrorString) {
                                _this.$rootScope.$broadcast('message:growl', _this.getErrorString(error));
                            }
                        });
                    } else {
                        this.modalInstance.close('success');
                    }
                }
            }, {
                key: 'cancelHandler',
                value: function cancelHandler() {
                    if (this.cancelAction) {
                        this.cancelAction();
                    }
                    this.modalInstance.dismiss('cancel clicked');
                }
            }]);

            return Confirm;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/confirm/confirm.js.map
