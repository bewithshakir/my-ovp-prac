'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.timeBlock.delete', ['ovpApp.services.stbSettingsService', 'ovpApp.directives.dropdownList', 'ovpApp.directives.focus']).component('stbDeleteTimeBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-deleteTimeBlock.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: (function () {
            /* @ngInject */

            StbDeleteTimeBlock.$inject = ["StbSettingsService", "TIMEBLOCK_DAYS"];
            function StbDeleteTimeBlock(StbSettingsService, TIMEBLOCK_DAYS) {
                _classCallCheck(this, StbDeleteTimeBlock);

                angular.extend(this, { StbSettingsService: StbSettingsService, TIMEBLOCK_DAYS: TIMEBLOCK_DAYS });
            }

            _createClass(StbDeleteTimeBlock, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.orgBlocks = [];

                    this.StbSettingsService.getTimeBlocks().then(function (blocks) {
                        _this.orgBlocks = blocks;
                        _this.timeBlocks = blocks.map(function (b, idx) {
                            return {
                                index: idx,
                                text: b.day + ', ' + b.startTime.format('LT') + ' - ' + b.endTime.format('LT')
                            };
                        });

                        _this.blockToDelete = _this.orgBlocks[0];
                    });

                    // Config
                    this.timeBlockDropdownConfig = {
                        activeIndex: 0,
                        onSelect: function onSelect(block) {
                            _this.blockToDelete = _this.orgBlocks[block.index];
                        },
                        buttonLabel: 'time block delete',
                        focusOnLoad: true
                    };
                }
            }, {
                key: 'onDelete',
                value: function onDelete() {
                    var _this2 = this;

                    if (this.blockToDelete) {
                        this.StbSettingsService.deleteTimeBlock(this.blockToDelete).then(function (result) {
                            _this2.modalInstance.close(result);
                        }, function (err) {
                            _this2.modalInstance.dismiss(err);
                        });
                    }
                }
            }, {
                key: 'onClose',
                value: function onClose() {
                    this.modalInstance.dismiss();
                }
            }]);

            return StbDeleteTimeBlock;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-deleteTimeBlock.js.map
