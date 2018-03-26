'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.messages', ['ovpApp.config', 'ovpApp.messages.local']).provider('messages', MessagesProvider);

    var Messages = (function () {
        function Messages(messages) {
            _classCallCheck(this, Messages);

            this.messages = messages.reduce(function (memo, message) {
                memo[message.full_code] = message;
                return memo;
            }, {});
        }

        /**
         * MessagesProvider depends on config to store the messages, this provides help when initilizing messages through
         * activity config.
         */

        _createClass(Messages, [{
            key: 'getMessageForCode',
            value: function getMessageForCode(code, replaceVars) {
                var data = this.messages[code];
                if (data) {
                    return this.subVars(data.full_customer_message, replaceVars);
                } else {
                    return '';
                }
            }
        }, {
            key: 'getHeaderForCode',
            value: function getHeaderForCode(code, replaceVars) {
                var data = this.messages[code];
                if (data) {
                    return this.subVars(data.header, replaceVars);
                } else {
                    return '';
                }
            }
        }, {
            key: 'getAlertForCode',
            value: function getAlertForCode(code) {
                var replaceVars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                var message = this.messages[code];
                replaceVars.CODE = code;
                return {
                    message: this.subVars(message.full_customer_message, replaceVars),
                    title: message.header ? this.subVars(message.header, replaceVars) : null,
                    buttonText: 'OK'
                };
            }
        }, {
            key: 'subVars',
            value: function subVars(message, replaceVars) {
                if (replaceVars) {
                    message = Object.keys(replaceVars).reduce(function (memo, key) {
                        return memo.replace('{{' + key + '}}', replaceVars[key]);
                    }, message);
                }
                return message;
            }
        }]);

        return Messages;
    })();

    function MessagesProvider() {
        var messagesService = null;
        /* @ngInject */
        this.$get = ["config", "OVPAPP_MESSAGES_LOCAL", function (config, OVPAPP_MESSAGES_LOCAL) {
            if (!messagesService) {
                messagesService = new Messages(OVPAPP_MESSAGES_LOCAL);
            }
            return messagesService;
        }];
        this.$get.$inject = ["config", "OVPAPP_MESSAGES_LOCAL"];
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/config/messages-service.js.map
