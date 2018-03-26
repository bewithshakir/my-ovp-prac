'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.search.sportsResultListItem', ['ovpApp.legacy.DateUtil']).component('sportsResultListItem', {
        bindings: {
            asset: '<',
            category: '<',
            index: '<',
            options: '<'
        },
        templateUrl: '/js/ovpApp/search/widgets/sports-result-list-item.html',
        controller: (function () {
            /* @ngInject */

            SportsResultListItem.$inject = ["$scope", "$filter", "dateUtil", "$state", "$rootScope"];
            function SportsResultListItem($scope, $filter, dateUtil, $state, $rootScope) {
                _classCallCheck(this, SportsResultListItem);

                angular.extend(this, { $scope: $scope, $filter: $filter, dateUtil: dateUtil, $state: $state, $rootScope: $rootScope });
            }

            _createClass(SportsResultListItem, [{
                key: '$onInit',
                value: function $onInit() {
                    this.focusOnLoad = this.options && this.options.focusOnLoad || false;
                }
            }, {
                key: 'getTypeString',
                value: function getTypeString() {
                    if (this.asset.tmsSeriesId) {
                        return 'Series';
                    } else if (this.asset.isLive) {
                        return 'Live Event';
                    } else if (this.asset.isReplay) {
                        return 'Rebroadcast';
                    } else {
                        return 'Special';
                    }
                }
            }, {
                key: 'getTimeString',
                value: function getTimeString() {
                    if (this.asset.scheduledStartTimeSec && this.asset.scheduledEndTimeSec) {
                        var start = new Date(this.asset.scheduledStartTimeSec * 1000);
                        var end = new Date(this.asset.scheduledEndTimeSec * 1000);
                        var now = new Date();
                        var dayLabel = undefined;

                        if (this.dateUtil.isToday(now, start)) {
                            dayLabel = 'Today';
                        } else if (this.dateUtil.isTomorrow(now, start)) {
                            dayLabel = 'Tomorrow';
                        } else {
                            dayLabel = this.dateUtil.formatDate(start, 'eeee');
                        }

                        return dayLabel + ' ' + this.dateUtil.formatDate(start, 'h:nn a') + (' - ' + this.dateUtil.formatDate(end, 'h:nn a'));
                    } else if (this.getTypeString() !== 'Series') {
                        return 'On Demand';
                    }
                }
            }, {
                key: 'getNetworkString',
                value: function getNetworkString() {
                    return this.asset.network && this.asset.network.callsign;
                }
            }, {
                key: 'click',
                value: function click() {
                    this.$rootScope.$emit('Analytics:search-select-item', {
                        asset: this.asset
                    });
                    var route = this.asset.clickRoute;
                    if (route) {
                        var _$state;

                        (_$state = this.$state).go.apply(_$state, _toConsumableArray(route));
                    }
                }
            }]);

            return SportsResultListItem;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/search/widgets/sports-result-list-item.js.map
