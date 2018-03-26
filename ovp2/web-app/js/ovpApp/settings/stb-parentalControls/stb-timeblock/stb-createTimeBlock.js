(() => {
    'use strict';

    angular.module('ovpApp.settings.stb.parentalControls.timeBlock.create', [
        'ovpApp.services.stbSettingsService',
        'ovpApp.directives.dropdownList',
        'ovpApp.directives.focus',
        'angularMoment'
    ])
    .constant('TIMEBLOCK_DAYS', [
        'Weekdays',
        'Weekends',
        'Every Monday',
        'Every Tuesday',
        'Every Wednesday',
        'Every Thursday',
        'Every Friday',
        'Every Saturday',
        'Every Sunday'
    ])
    .component('stbCreateTimeBlock', {
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-timeblock/stb-createTimeBlock.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: class StbCreateTimeBlock {
            /* @ngInject */
            constructor(StbSettingsService, TIMEBLOCK_DAYS, moment) {
                angular.extend(this, {StbSettingsService, TIMEBLOCK_DAYS, moment});
            }

            $onInit() {
                this.stb = this.resolve.stb;
                this.days = this.TIMEBLOCK_DAYS.map(val => {
                    return {
                        text: val
                    };
                });

                this.endTimeList = this.startTimeList =
                    Array.from(new Array(24), (val, index) => {
                        let time = this.moment().startOf('day').add(index, 'hour');
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
                    onSelect: (day) => {
                        this.day = day.text;
                    },
                    buttonLabel: 'time block day',
                    focusOnLoad: true
                };
                this.startTimeDropdownConfig = {
                    activeIndex: 0,
                    onSelect: (startTime) => {
                        this.startTime = startTime.time;
                    },
                    buttonLabel: 'time block start time'
                };
                this.endTimeDropdownConfig = {
                    activeIndex: 0,
                    onSelect: (endTime) => {
                        this.endTime = endTime.time;
                    },
                    buttonLabel: 'time block end time'
                };
            }

            onSave() {
                if (this.day && this.startTime && this.endTime) {
                    this.StbSettingsService.createTimeBlock({
                        day: this.day,
                        startTime: this.startTime,
                        endTime: this.endTime
                    }).then(result => {
                        this.modalInstance.close(result);
                    }, err => {
                        this.modalInstance.dismiss(err);
                    });
                }
            }

            onClose() {
                this.modalInstance.dismiss(null);
            }
        }
    });
})();
