'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.timeBlock', ['ovpApp.services.stbSettingsService', 'ovpApp.services.errorCodes', 'ovpApp.directives.focus', 'ovpApp.directives.arrowNav', 'ovpApp.settings.stb.parentalControls.timeBlock.create', 'ovpApp.settings.stb.parentalControls.timeBlock.delete']).component('stbTimeBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-timeBlock.html',
        bindings: {
            'stb': '<'
        },
        controller: (function () {
            /* @ngInject */

            StbTimeBlock.$inject = ["StbSettingsService", "dateFormat", "modal", "alert", "messages", "config", "errorCodesService"];
            function StbTimeBlock(StbSettingsService, dateFormat, modal, alert, messages, config, errorCodesService) {
                _classCallCheck(this, StbTimeBlock);

                angular.extend(this, { StbSettingsService: StbSettingsService, dateFormat: dateFormat, modal: modal, alert: alert, messages: messages, config: config,
                    errorCodesService: errorCodesService });
            }

            _createClass(StbTimeBlock, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    if (!this.config.stbSettingsParentalControls.timeBlockEnabled) {
                        return;
                    }

                    this.timeBlocks = [];
                    this.StbSettingsService.getTimeBlocks().then(function (blocks) {
                        _this.timeBlocks = blocks;
                    });
                }
            }, {
                key: 'createTimeBlock',
                value: function createTimeBlock() {
                    var _this2 = this;

                    if (this.timeBlocks.length > 7) {
                        this.alert.open(this.errorCodesService.getAlertForCode('WCM-1026'));
                    } else {
                        this.modal.open({
                            component: 'stbCreateTimeBlock'
                        }).result.then(function (result) {
                            // We need to modify timeBlocks reference,
                            // so that a model change is detected.
                            _this2.timeBlocks = angular.copy(result);
                            _this2.srText = 'time block created';
                        }, function (err) {
                            if (err.message && err.title) {
                                _this2.alert.open({
                                    title: err.title,
                                    message: err.message,
                                    buttonText: 'OK'
                                });
                            }
                        });
                    }
                }
            }, {
                key: 'deleteTimeBlock',
                value: function deleteTimeBlock() {
                    var _this3 = this;

                    if (this.timeBlocks.length < 1) {
                        this.alert.open(this.errorCodesService.getAlertForCode('WCM-1025'));
                    } else {
                        this.modal.open({
                            component: 'stbDeleteTimeBlock'
                        }).result.then(function (result) {
                            _this3.timeBlocks = result;
                            _this3.srText = 'time block deleted';
                        });
                    }
                }
            }]);

            return StbTimeBlock;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-timeBlock.js.map
