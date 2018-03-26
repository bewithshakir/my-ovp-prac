(function () {
    'use strict';

    angular.module('ovpApp.cdvr')
    .component('cdvrRecorded', {
        templateUrl: '/js/ovpApp/cdvr/recorded.html',
        controller: class CdvrRecorded {
            /* @ngInject */
            constructor($state, $rootScope, messages, cdvrService, storageKeys) {
                angular.extend(this, {$state, $rootScope, messages, cdvrService, storageKeys});
            }

            $onInit() {
                this.message = this.messages.getMessageForCode('MSG-9079');
                this.gridConfig = {
                    showTotal: false,
                    showToggle: true,
                    id: this.storageKeys.recordingGridCategoryViewMode,
                    useLocalStorage: true
                };

                this.getRecordings();

                this.unregisterUpdateDvrListener = this.$rootScope.$on('update-dvr', () => {
                    this.getRecordings();
                });
            }

            $onDestroy() {
                this.unregisterUpdateDvrListener();
            }

            getRecordings() {
                let promise = this.cdvrService.getProgramList().then((recordings) => {
                    this.cdvrRecordings = recordings;
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }).catch((message) => {
                    this.message = message;
                    this.cdvrRecordings = [];
                });
                this.$rootScope.$broadcast(
                    'message:loading',
                    promise,
                    undefined,
                    'DVR Recordings');
            }
        }
    });
})();
