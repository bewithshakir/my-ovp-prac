(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.timeBlock', [
        'ovpApp.services.stbSettingsService',
        'ovpApp.services.errorCodes',
        'ovpApp.directives.focus',
        'ovpApp.directives.arrowNav',
        'ovpApp.settings.stb.parentalControls.timeBlock.create',
        'ovpApp.settings.stb.parentalControls.timeBlock.delete'
    ])
    .component('stbTimeBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-timeBlock.html',
        bindings: {
            'stb': '<'
        },
        controller: class StbTimeBlock {
            /* @ngInject */
            constructor(StbSettingsService, dateFormat, modal, alert, messages, config, errorCodesService) {
                angular.extend(this, {StbSettingsService, dateFormat, modal, alert, messages, config,
                    errorCodesService});
            }

            $onInit() {
                if (!this.config.stbSettingsParentalControls.timeBlockEnabled) {
                    return;
                }

                this.timeBlocks = [];
                this.StbSettingsService.getTimeBlocks().then(blocks => {
                    this.timeBlocks = blocks;
                });
            }

            createTimeBlock() {
                if (this.timeBlocks.length > 7) {
                    this.alert.open(this.errorCodesService.getAlertForCode('WCM-1026'));
                } else {
                    this.modal.open({
                        component: 'stbCreateTimeBlock'
                    }).result.then(result => {
                        // We need to modify timeBlocks reference,
                        // so that a model change is detected.
                        this.timeBlocks = angular.copy(result);
                        this.srText = 'time block created';
                    }, err => {
                        if (err.message && err.title) {
                            this.alert.open({
                                title: err.title,
                                message: err.message,
                                buttonText: 'OK'
                            });
                        }
                    });
                }
            }

            deleteTimeBlock() {
                if (this.timeBlocks.length < 1) {
                    this.alert.open(this.errorCodesService.getAlertForCode('WCM-1025'));
                } else {
                    this.modal.open({
                        component: 'stbDeleteTimeBlock'
                    }).result.then(result => {
                        this.timeBlocks = result;
                        this.srText = 'time block deleted';
                    });
                }
            }
        }
    });
})();
