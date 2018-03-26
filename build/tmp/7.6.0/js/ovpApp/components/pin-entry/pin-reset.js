'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.pinEntry').directive('comparePin', comparePin).component('pinReset', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/pin-entry/pin-reset.html',
        controller: (function () {
            /* @ngInject */

            PinReset.$inject = ["PIN_ENTRY_TYPE", "parentalControlsService", "$rootScope", "$scope", "promiseTracker", "messages", "Debouncer", "errorCodesService"];
            function PinReset(PIN_ENTRY_TYPE, parentalControlsService, $rootScope, $scope, promiseTracker, messages, Debouncer, errorCodesService) {
                _classCallCheck(this, PinReset);

                angular.extend(this, { PIN_ENTRY_TYPE: PIN_ENTRY_TYPE, parentalControlsService: parentalControlsService, $rootScope: $rootScope, $scope: $scope, promiseTracker: promiseTracker,
                    messages: messages, Debouncer: Debouncer, errorCodesService: errorCodesService });
            }

            _createClass(PinReset, [{
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
                    if (changes.resolve) {
                        var options = this.resolve.options || {};
                        this.pinInstructions = options.pinInstructions;
                        this.headerMessage = options.headerMessage;
                        this.secondaryMessage = options.secondaryMessage;
                        this.password = options.password;
                        this.pinService = options.pinService;
                    }
                }
            }, {
                key: 'onInputChange',
                value: function onInputChange() {
                    var _this2 = this;

                    this.showNumbersOnlyErrorMessage = false;
                    this.errorDelay.debounce(function () {
                        _this2.showNumbersOnlyErrorMessage = _this2.form.newPIN.$error.pattern;
                    });
                }
            }, {
                key: 'resetPIN',
                value: function resetPIN() {
                    var _this3 = this;

                    var promise = this.pinService.shouldSetDefaults().then(function (shouldSetDefaults) {
                        if (shouldSetDefaults) {
                            return _this3.pinService.setPINForFirstTimeWithDefaultRatings(_this3.newPIN, _this3.password);
                        } else {
                            return _this3.pinService.setPIN(_this3.newPIN, _this3.password);
                        }
                    }).then(function () {
                        _this3.modalInstance.close('pinReset');
                    }, function () {
                        _this3.modalInstance.dismiss('pinValidationError');
                        _this3.$rootScope.$broadcast('message:growl', _this3.errorCodesService.getMessageForCode('WGE-1001'));
                    });

                    this.loadingTracker.addPromise(promise);
                }
            }]);

            return PinReset;
        })()
    });

    /* @ngInject */
    function comparePin() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=comparePin'
            },
            link: function link(scope, element, attributes, ngModel) {
                var hasValue = function hasValue(value) {
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
//# sourceMappingURL=../../../maps-babel/ovpApp/components/pin-entry/pin-reset.js.map
