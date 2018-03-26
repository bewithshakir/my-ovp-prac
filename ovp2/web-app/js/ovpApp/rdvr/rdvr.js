(function () {
    'use strict';

    /**
     * rdvrPage
     *
     * Main page for Remote DVR feature
     *
     * Example Usage:
     * <rdvr-page></rdvr-page>
     *
     */
    angular.module('ovpApp.rdvr', [
            'ovpApp.services.stbService',
            'ovpApp.rdvr.router',
            'ovpApp.rdvr.diskUsage',
            'ovpApp.rdvr.rdvrService',
            'ovpApp.rdvr.myRecordings',
            'ovpApp.rdvr.scheduled',
            'ovpApp.rdvr.priority',
            'ovpApp.rdvr.rdvrToolbar',
            'ovpApp.messages',
            'ovpApp.legacy.DateUtil',
            'ovpApp.rdvr.cacheService',
            'ovpApp.services.ovpStorage'
        ])
        .component('rdvrPage', {
            templateUrl: '/js/ovpApp/rdvr/rdvr.html',
            controller: class RdvrPage {
                /* @ngInject */
                constructor($scope, messages, stbService) {
                    angular.extend(this, {$scope, messages, stbService});
                }

                $onInit() {
                    this.stbService.currentStbSource
                        .subscribe(stb => this.setTopBox = stb);
                }

                hasDvr() {
                    return this.setTopBox && this.setTopBox.dvr;
                }
            }
        });
})();
