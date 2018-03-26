'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.pinEntry').component('pinValidate', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/pin-entry/pin-validate.html',
        controller: (function () {
            /* @ngInject */

            PinValidate.$inject = ["parentalControlsService", "$rootScope", "$scope", "messages", "promiseTracker", "$element", "$q", "Debouncer", "errorCodesService"];
            function PinValidate(parentalControlsService, $rootScope, $scope, messages, promiseTracker, $element, $q, Debouncer, errorCodesService) {
                _classCallCheck(this, PinValidate);

                angular.extend(this, { parentalControlsService: parentalControlsService, $rootScope: $rootScope, $scope: $scope, messages: messages,
                    promiseTracker: promiseTracker, $element: $element, $q: $q, Debouncer: Debouncer, errorCodesService: errorCodesService });
            }

            _createClass(PinValidate, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.tagRegex = /(<[^>]+>)/g;
                    this.loadingTracker = this.promiseTracker();
                    this.parentalControlsService.isPrimaryAccount().then(function (isPrimaryAccount) {
                        return _this.isPrimaryAccount = isPrimaryAccount;
                    });
                    this.errorDelay = new this.Debouncer(this.$scope);
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    var _this2 = this;

                    if (changes.resolve) {
                        var options = this.resolve.options || {};
                        this.pinInstructions = options.pinInstructions;
                        this.pinService = options.pinService;
                        this.showOOHWarningMessage = options.showOOHWarningMessage || false;
                        this.pleaseEnterPin = options.pleaseEnterPin || this.messages.getMessageForCode('MSG-9044');
                        this.minLength = options.minLength || 4;
                        this.maxLength = options.maxLength || 4;

                        var enableForgotPin = options.enableForgotPin !== undefined ? options.enableForgotPin : true;
                        this.$q.when(enableForgotPin).then(function (enabled) {
                            return _this2.enableForgotPin = enabled;
                        });
                    }
                }
            }, {
                key: 'onInputChange',
                value: function onInputChange() {
                    var _this3 = this;

                    this.showNumbersOnlyErrorMessage = false;
                    this.errorDelay.debounce(function () {
                        _this3.showNumbersOnlyErrorMessage = _this3.form.currentPIN.$error.pattern;
                    });
                }
            }, {
                key: 'validatePIN',
                value: function validatePIN() {
                    var _this4 = this;

                    this.isValidationError = false;
                    if (this.currentPIN !== undefined) {
                        var promise = this.pinService.validatePIN(this.currentPIN).then(function () {
                            _this4.modalInstance.close('pinValidated');
                            _this4.isValidationError = false;

                            // Analytics Event
                            _this4.$rootScope.$emit('Analytics:pinEntry', {
                                // category: 'navigation',
                                // pinType: 'purchaseControl',
                                // context: 'tvodFlow',
                                // operationType: 'purchaseControl',
                                success: true
                            });
                        }, function () {
                            _this4.isValidationError = true;
                            _this4.currentPIN = '';
                            _this4.$element.find('#pin').focus();
                            _this4.errorMessage = _this4.errorCodesService.getMessageForCode('WPC-1006');

                            // Analytics Event
                            _this4.$rootScope.$emit('Analytics:pinEntry', {
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
            }, {
                key: 'forgotPIN',
                value: function forgotPIN() {
                    this.modalInstance.dismiss('forgotPIN');
                }
            }]);

            return PinValidate;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/pin-entry/pin-validate.js.map
