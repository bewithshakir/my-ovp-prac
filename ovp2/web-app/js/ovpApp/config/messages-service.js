(function () {
    'use strict';

    angular.module('ovpApp.messages', [
        'ovpApp.config',
        'ovpApp.messages.local'])
        .provider('messages', MessagesProvider);

    class Messages {
        constructor(messages) {
            this.messages = messages.reduce((memo, message) => {
                memo[message.full_code] = message;
                return memo;
            }, {});
        }

        getMessageForCode(code, replaceVars) {
            let data =  this.messages[code];
            if (data) {
                return this.subVars(data.full_customer_message, replaceVars);
            } else {
                return '';
            }
        }

        getHeaderForCode(code, replaceVars) {
            let data = this.messages[code];
            if (data) {
                return this.subVars(data.header, replaceVars);
            } else {
                return '';
            }
        }

        getAlertForCode(code, replaceVars = {}) {
            let message = this.messages[code];
            replaceVars.CODE = code;
            return {
                message: this.subVars(message.full_customer_message, replaceVars),
                title: (message.header) ? this.subVars(message.header, replaceVars) : null,
                buttonText: 'OK'
            };
        }

        subVars(message, replaceVars) {
            if (replaceVars) {
                message = Object.keys(replaceVars).reduce((memo, key) => {
                    return memo.replace('{{' + key + '}}', replaceVars[key]);
                }, message);
            }
            return message;
        }
    }

    /**
     * MessagesProvider depends on config to store the messages, this provides help when initilizing messages through
     * activity config.
     */
    function MessagesProvider() {
        var messagesService = null;
        /* @ngInject */
        this.$get = function (config, OVPAPP_MESSAGES_LOCAL) {
            if (!messagesService) {
                messagesService = new Messages(OVPAPP_MESSAGES_LOCAL);
            }
            return messagesService;
        };
    }
}());
