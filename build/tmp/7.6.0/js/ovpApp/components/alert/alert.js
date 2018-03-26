'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    alert.$inject = ["modal"];
    angular.module('ovpApp.components.alert', ['ui.bootstrap', 'ovpApp.components.modal', 'ovpApp.directives.focus']).factory('alert', alert).component('alertComponent', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/alert/alert.html',
        controller: (function () {
            /* @ngInject */

            Alert.$inject = ["$rootScope"];
            function Alert($rootScope) {
                _classCallCheck(this, Alert);

                angular.extend(this, { $rootScope: $rootScope });
            }

            _createClass(Alert, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.resolve) {
                        this.title = this.resolve.title;
                        this.message = this.resolve.message;
                        this.buttonText = this.resolve.buttonText;
                        this.openTime = this.resolve.openTime;
                        this.analyticsModalName = this.resolve.analyticsModalName;
                    }

                    // Analytics
                    this.$rootScope.$emit('Analytics:modal-start', { timestamp: this.openTime });
                    this.$rootScope.$emit('Analytics:modal-view', {
                        triggeredBy: 'application',
                        modalName: this.analyticsModalName ? this.analyticsModalName : null,
                        modalText: JSON.stringify(changes.resolve ? changes.resolve.currentValue : '')
                    });
                }
            }, {
                key: 'close',
                value: function close() {
                    this.modalInstance.close('closed by user');
                    this.$rootScope.$broadcast('Analytics:select', {
                        elementStandardizedName: 'ok'
                    });
                }
            }]);

            return Alert;
        })()
    });

    // A specific type of modal, used for displaying a title, a message, and a single button
    /* @ngInject */
    function alert(modal) {
        var service = {
            open: open
        };
        return service;

        ////////////

        function open() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return modal.open({
                size: 'md',
                showCloseIcon: options.showCloseIcon || false,
                windowClass: options.windowClass || 'generic-alert',
                component: 'alertComponent',
                ariaLabelledBy: 'alert-title',
                ariaDescribedBy: 'alert-error-message',
                resolve: {
                    title: function title() {
                        return options.title;
                    },
                    message: function message() {
                        return options.message;
                    },
                    buttonText: function buttonText() {
                        return options.buttonText;
                    },
                    openTime: function openTime() {
                        return Date.now();
                    },
                    analyticsModalName: function analyticsModalName() {
                        return options.analyticsModalName;
                    }
                }
            });
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/alert/alert.js.map
