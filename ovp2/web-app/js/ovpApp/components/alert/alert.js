(function () {
    'use strict';

    angular.module('ovpApp.components.alert', [
        'ui.bootstrap',
        'ovpApp.components.modal',
        'ovpApp.directives.focus'
    ])
    .factory('alert', alert)
    .component('alertComponent', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/alert/alert.html',
        controller: class Alert {
            /* @ngInject */
            constructor($rootScope) {
                angular.extend(this, {$rootScope});
            }

            $onChanges(changes) {
                if (changes.resolve) {
                    this.title = this.resolve.title;
                    this.message = this.resolve.message;
                    this.buttonText = this.resolve.buttonText;
                    this.openTime = this.resolve.openTime;
                    this.analyticsModalName = this.resolve.analyticsModalName;
                }

                // Analytics
                this.$rootScope.$emit('Analytics:modal-start', {timestamp: this.openTime});
                this.$rootScope.$emit('Analytics:modal-view', {
                    triggeredBy: 'application',
                    modalName: this.analyticsModalName ? this.analyticsModalName : null,
                    modalText: JSON.stringify((changes.resolve ? changes.resolve.currentValue : ''))
                });
            }

            close() {
                this.modalInstance.close('closed by user');
                this.$rootScope.$broadcast('Analytics:select', {
                    elementStandardizedName: 'ok'
                });
            }
        }
    });

    // A specific type of modal, used for displaying a title, a message, and a single button
    /* @ngInject */
    function alert(modal) {
        const service = {
            open
        };
        return service;

        ////////////

        function open(options = {}) {
            return modal.open({
                size: 'md',
                showCloseIcon: options.showCloseIcon || false,
                windowClass: options.windowClass || 'generic-alert',
                component: 'alertComponent',
                ariaLabelledBy: 'alert-title',
                ariaDescribedBy: 'alert-error-message',
                resolve: {
                    title: () => options.title,
                    message: () => options.message,
                    buttonText: () => options.buttonText,
                    openTime: () => Date.now(),
                    analyticsModalName: () => options.analyticsModalName
                }
            });
        }
    }
}());
