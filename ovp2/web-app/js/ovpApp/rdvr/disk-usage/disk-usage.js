(function () {
    'use strict';

    /**
     * diskUsage
     *
     * Displays disk usage bar
     *
     * Example Usage:
     * <disk-usage></disk-usage>
     */
    angular.module('ovpApp.rdvr.diskUsage', [
            'ovpApp.rdvr.rdvrService',
            'ovpApp.services.rxUtils'
        ])
        .component('diskUsage', {
            bindings: {
                stb: '<'
            },
            templateUrl: '/js/ovpApp/rdvr/disk-usage/disk-usage.html',
            controller: class DiskUsage {
                /* @ngInject */
                constructor($scope, rdvrService, stbService) {
                    angular.extend(this, {$scope, rdvrService, stbService});
                }

                $onChanges(changes) {
                    if (changes.stb) {
                        this.getDiskUsage(changes.stb.currentValue);
                    }
                }

                getDiskUsage(stb) {
                    if (this.hasRdvrVersion2(stb)) {
                        if (this.subscription) {
                            this.subscription.dispose();
                            this.subscription = null;
                        }
                        this.subscription = this.rdvrService.getUsage(stb)
                            .subscribe(result => this.onDiskUsageReceived(result));
                    }
                }

                onDiskUsageReceived(result) {
                    if (!result.error && result.data && result.data.usedPercentage) {
                        this.usedPercent = Math.floor(result.data.usedPercentage * 100);
                    } else {
                        this.usedPercent = 0;
                    }
                }

                $onDestroy() {
                    if (this.subscription) {
                        this.subscription.dispose();
                    }
                }

                hasRdvrVersion2(stb = this.stb) {
                    return stb && stb.dvr === true && stb.rdvrVersion > 1;
                }
            }
        });
})();
