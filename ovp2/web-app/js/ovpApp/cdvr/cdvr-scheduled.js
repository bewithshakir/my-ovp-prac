(function () {
    'use strict';

    angular.module('ovpApp.cdvr')
    .component('cdvrScheduled', {
        templateUrl: '/js/ovpApp/cdvr/scheduled.html',
        controller: class CdvrScheduled {
            /* @ngInject */
            constructor($state, $rootScope, messages, cdvrService, storageKeys) {
                angular.extend(this, {$state, $rootScope, messages, cdvrService, storageKeys});
            }

            $onInit() {
                this.message = this.messages.getMessageForCode('MSG-9080');
                this.listConfig = {
                    showHeader: false,
                    listOnly: true,
                    showTotal: false,
                    showToggle: false,
                    id: this.storageKeys.scheduledListViewMode,
                    useLocalStorage: true
                };

                this.unregisterUpdateDvrListener = this.$rootScope.$on('update-dvr', () => {
                    this.getScheduledRecordings();
                });

                this.getScheduledRecordings();
            }

            $onDestroy() {
                this.unregisterUpdateDvrListener();
            }

            getScheduledRecordings() {
                let promise = this.cdvrService.getScheduled().then(scheduled => {
                    this.schedule = scheduled;
                    this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                }).catch(message => {
                    this.message = message;
                    this.schedule = [];
                });
                this.$rootScope.$broadcast(
                    'message:loading',
                    promise,
                    undefined,
                    'DVR Scheduled');
            }
        }
    });
})();
