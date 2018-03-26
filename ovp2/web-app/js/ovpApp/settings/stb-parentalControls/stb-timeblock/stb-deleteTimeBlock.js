(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.timeBlock.delete', [
        'ovpApp.services.stbSettingsService',
        'ovpApp.directives.dropdownList',
        'ovpApp.directives.focus'
    ])
    .component('stbDeleteTimeBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-deleteTimeBlock.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: class StbDeleteTimeBlock {
            /* @ngInject */
            constructor(StbSettingsService, TIMEBLOCK_DAYS) {
                angular.extend(this, {StbSettingsService, TIMEBLOCK_DAYS});
            }

            $onInit() {
                this.orgBlocks = [];

                this.StbSettingsService.getTimeBlocks().then(blocks => {
                    this.orgBlocks = blocks;
                    this.timeBlocks = blocks.map((b, idx) => {
                        return {
                            index: idx,
                            text: b.day + ', ' + b.startTime.format('LT') + ' - ' + b.endTime.format('LT')
                        };
                    });

                    this.blockToDelete = this.orgBlocks[0];
                });

                // Config
                this.timeBlockDropdownConfig = {
                    activeIndex: 0,
                    onSelect: (block) => {
                        this.blockToDelete = this.orgBlocks[block.index];
                    },
                    buttonLabel: 'time block delete',
                    focusOnLoad: true
                };
            }

            onDelete() {
                if (this.blockToDelete) {
                    this.StbSettingsService.deleteTimeBlock(this.blockToDelete).then(result => {
                        this.modalInstance.close(result);
                    }, err => {
                        this.modalInstance.dismiss(err);
                    });
                }
            }

            onClose() {
                this.modalInstance.dismiss();
            }
        }
    });
})();
