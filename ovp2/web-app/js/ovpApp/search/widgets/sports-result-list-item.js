(function () {
    'use strict';

    angular
        .module('ovpApp.search.sportsResultListItem', [
            'ovpApp.legacy.DateUtil'
        ])
        .component('sportsResultListItem', {
            bindings: {
                asset: '<',
                category: '<',
                index: '<',
                options: '<'
            },
            templateUrl: '/js/ovpApp/search/widgets/sports-result-list-item.html',
            controller: class SportsResultListItem {
                /* @ngInject */
                constructor($scope, $filter, dateUtil, $state, $rootScope) {
                    angular.extend(this, {$scope, $filter, dateUtil, $state, $rootScope});
                }

                $onInit() {
                    this.focusOnLoad = (this.options && this.options.focusOnLoad) || false;
                }

                getTypeString() {
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

                getTimeString() {
                    if (this.asset.scheduledStartTimeSec && this.asset.scheduledEndTimeSec) {
                        let start = new Date(this.asset.scheduledStartTimeSec * 1000);
                        let end = new Date(this.asset.scheduledEndTimeSec * 1000);
                        let now = new Date();
                        let dayLabel;

                        if (this.dateUtil.isToday(now, start)) {
                            dayLabel = 'Today';
                        } else if (this.dateUtil.isTomorrow(now, start)) {
                            dayLabel = 'Tomorrow';
                        } else {
                            dayLabel = this.dateUtil.formatDate(start, 'eeee');
                        }

                        return `${dayLabel} ${this.dateUtil.formatDate(start, 'h:nn a')}` +
                            ` - ${this.dateUtil.formatDate(end, 'h:nn a')}`;
                    } else if (this.getTypeString() !== 'Series') {
                        return 'On Demand';
                    }
                }

                getNetworkString() {
                    return this.asset.network && this.asset.network.callsign;
                }

                click() {
                    this.$rootScope.$emit('Analytics:search-select-item', {
                        asset: this.asset
                    });
                    let route = this.asset.clickRoute;
                    if (route) {
                        this.$state.go(...route);
                    }
                }
            }
        });
})();
