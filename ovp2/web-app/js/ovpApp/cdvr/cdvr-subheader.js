(function () {
    'use strict';
    angular.module('ovpApp.cdvr')
    .component('cdvrSubheader', {
        templateUrl: '/js/ovpApp/cdvr/cdvr-sub-header.html',
        controller: class CdvrSubheader {
            /* @ngInject */
            constructor($state) {
                angular.extend(this, {$state});
            }

            $onInit() {
                this.menuItems = [
                    {
                        enabled: () => true,
                        class: '',
                        badges: () => false,
                        description: 'My Recordings lists all recordings stored in the Cloud DVR',
                        state: 'ovp.cdvr.recorded',
                        title: 'My Recordings'
                    },
                    {
                        enabled: () => true,
                        class: '',
                        badges: () => false,
                        description: 'Scheduled Cloud DVR Recordings',
                        state: 'ovp.cdvr.scheduled',
                        title: 'Scheduled'
                    }
                ];
            }
        }
    });
})();
