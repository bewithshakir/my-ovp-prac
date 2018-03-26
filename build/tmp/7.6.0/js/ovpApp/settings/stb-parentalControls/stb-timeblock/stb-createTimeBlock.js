'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.timeBlock.create', ['ovpApp.services.stbSettingsService', 'ovpApp.directives.dropdownList', 'ovpApp.directives.focus', 'angularMoment']).constant('TIMEBLOCK_DAYS', ['Weekdays', 'Weekends', 'Every Monday', 'Every Tuesday', 'Every Wednesday', 'Every Thursday', 'Every Friday', 'Every Saturday', 'Every Sunday']).component('stbCreateTimeBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-createTimeBlock.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: (function () {
            /* @ngInject */

            StbCreateTimeBlock.$inject = ["StbSettingsService", "TIMEBLOCK_DAYS", "moment"];
            function StbCreateTimeBlock(StbSettingsService, TIMEBLOCK_DAYS, moment) {
                _classCallCheck(this, StbCreateTimeBlock);

                angular.extend(this, { StbSettingsService: StbSettingsService, TIMEBLOCK_DAYS: TIMEBLOCK_DAYS, moment: moment });
            }

            _createClass(StbCreateTimeBlock, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.stb = this.resolve.stb;
                    this.days = this.TIMEBLOCK_DAYS.map(function (val) {
                        return {
                            text: val
                        };
                    });

                    this.endTimeList = this.startTimeList = Array.from(new Array(24), function (val, index) {
                        var time = _this.moment().startOf('day').add(index, 'hour');
                        return {
                            time: time,
                            text: time.format('LT')
                        };
                    });

                    // Default values
                    this.day = this.days[0].text;
                    this.startTime = this.startTimeList[0].time;
                    this.endTime = this.endTimeList[0].time;

                    // Config
                    this.dayDropdownConfig = {
                        activeIndex: 0,
                        onSelect: function onSelect(day) {
                            _this.day = day.text;
                        },
                        buttonLabel: 'time block day',
                        focusOnLoad: true
                    };
                    this.startTimeDropdownConfig = {
                        activeIndex: 0,
                        onSelect: function onSelect(startTime) {
                            _this.startTime = startTime.time;
                        },
                        buttonLabel: 'time block start time'
                    };
                    this.endTimeDropdownConfig = {
                        activeIndex: 0,
                        onSelect: function onSelect(endTime) {
                            _this.endTime = endTime.time;
                        },
                        buttonLabel: 'time block end time'
                    };
                }
            }, {
                key: 'onSave',
                value: function onSave() {
                    var _this2 = this;

                    if (this.day && this.startTime && this.endTime) {
                        this.StbSettingsService.createTimeBlock({
                            day: this.day,
                            startTime: this.startTime,
                            endTime: this.endTime
                        }).then(function (result) {
                            _this2.modalInstance.close(result);
                        }, function (err) {
                            _this2.modalInstance.dismiss(err);
                        });
                    }
                }
            }, {
                key: 'onClose',
                value: function onClose() {
                    this.modalInstance.dismiss(null);
                }
            }]);

            return StbCreateTimeBlock;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-createTimeBlock.js.map
