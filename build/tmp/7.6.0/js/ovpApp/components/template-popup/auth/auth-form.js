'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.authForm', ['ovpApp.components.templatePopup', 'ajoslin.promise-tracker', 'ovpApp.services.parentalControlsService', 'ovpApp.services.errorCodes', 'ovpApp.config', 'ovpApp.messages']).component('authForm', {
        templateUrl: '/js/ovpApp/components/template-popup/auth/auth-form.html',
        bindings: {
            modalInstance: '<'
        },
        controller: (function () {
            /* @ngInject */

            AuthFormController.$inject = ["config", "promiseTracker", "parentalControlsService", "errorCodesService", "messages"];
            function AuthFormController(config, promiseTracker, parentalControlsService, errorCodesService, messages) {
                _classCallCheck(this, AuthFormController);

                angular.extend(this, { config: config, promiseTracker: promiseTracker, parentalControlsService: parentalControlsService,
                    errorCodesService: errorCodesService, messages: messages });
            }

            _createClass(AuthFormController, [{
                key: '$onInit',
                value: function $onInit() {
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
            }, {
                key: 'authenticate',
                value: function authenticate() {
                    var _this = this;

                    this.isValidationError = false;
                    var promise = this.parentalControlsService.validateAdminPassword(this.user.password).then(function () {
                        _this.modalInstance.close(_this.user.password);
                    }, function () {
                        _this.errorMessage = _this.errorCodesService.getMessageForCode('WPC-1001');
                        _this.isValidationError = true;
                    });

                    this.loadingTracker.addPromise(promise);
                }
            }]);

            return AuthFormController;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/template-popup/auth/auth-form.js.map
