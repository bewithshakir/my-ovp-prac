(function () {
    'use strict';
    angular.module('ovpApp.components.pinEntry.message', [])
        .component('pinEntryMessage', {
            bindings: {
                resolve: '<',
                modalInstance: '<'
            },
            templateUrl: '/js/ovpApp/components/pin-entry/pin-entry-message.html',
            controller: class PinEntryMessageController {
                $onInit() {
                    this.tagRegex = /(<[^>]+>)/g;
                }

                $onChanges(changes) {
                    if (changes.resolve) {
                        const options = this.resolve.options || {};
                        this.headerMessage = options.headerMessage;
                        this.secondaryMessage = options.secondaryMessage;
                    }
                }
            }
        });
})();
