'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.cdvr').component('cdvrScheduleListItem', {
        bindings: {
            asset: '<'
        },
        templateUrl: '/js/ovpApp/cdvr/cdvr-schedule-list-item.html',
        controller: (function () {
            /* @ngInject */

            CdvrScheduleListItem.$inject = ["$state", "cdvrService"];
            function CdvrScheduleListItem($state, cdvrService) {
                _classCallCheck(this, CdvrScheduleListItem);

                this.$state = $state;
                this.cdvrService = cdvrService;
            }

            _createClass(CdvrScheduleListItem, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.channelNumber = '--';

                    this.cdvrService.getChannelNumber(this.asset).then(function (channelNumber) {
                        return _this.channelNumber = channelNumber;
                    });
                }
            }, {
                key: 'click',
                value: function click() {
                    var route = this.asset.clickRoute;
                    if (route) {
                        var recording = this.asset.cdvrRecording;
                        if (recording) {
                            //Attempt to pass in the correct time and day
                            if (recording.tmsSeriesId) {
                                this.$state.go('product.series', {
                                    tmsSeriesId: recording.tmsSeriesId,
                                    tmsProgramId: recording.tmsProgramId,
                                    airtime: recording.startTimeSec,
                                    tmsGuideId: recording.tmsGuideId
                                });
                            } else {
                                //Maybe this should be the default if we can get airtime and serviceId
                                this.$state.go('product.event', {
                                    tmsId: recording.tmsProgramId,
                                    airtime: recording.startTimeSec,
                                    tmsGuideId: recording.tmsGuideId
                                });
                            }
                        } else {
                            var _$state;

                            (_$state = this.$state).go.apply(_$state, _toConsumableArray(route));
                        }
                    }
                }
            }, {
                key: 'getTitlePrefix',
                value: function getTitlePrefix() {
                    var prefix = '';
                    if (this.asset.isEntitled === false) {
                        prefix = 'Not Entitled';
                    }
                    return prefix;
                }
            }]);

            return CdvrScheduleListItem;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/cdvr/cdvr-schedule-list-item.js.map
