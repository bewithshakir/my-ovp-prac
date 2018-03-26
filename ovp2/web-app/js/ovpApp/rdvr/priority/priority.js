(function () {
    'use strict';

    /**
     * rdvrPriority
     *
     * Series priority subpage for Remote DVR
     *
     * Example Usage:
     * <rdvr-priority></rdvr-priority>
     *
     */
    angular.module('ovpApp.rdvr.priority', [
            'ovpApp.rdvr.rdvrService',
            'ovpApp.components.ovp.sortable',
            'ovpApp.rdvr.cacheService',
            'ovpApp.messages',
            'ovpApp.components.alert',
            'ovpApp.services.errorCodes'
        ])
        .component('rdvrPriority', {
            templateUrl: '/js/ovpApp/rdvr/priority/priority.html',
            controller: class RdvrPriority {
                /* @ngInject */
                constructor($log, alert, messages, $scope, createObservableFunction, stbService, rdvrService, $q,
                    $rootScope, rx, $state, errorCodesService) {
                    angular.extend(this, {$log, alert, messages, $scope, createObservableFunction, stbService,
                        rdvrService, $q, $rootScope, rx, $state, errorCodesService});
                }

                $onInit() {
                    this.teardown = this.createObservableFunction();

                    this.stbService.currentStbSource
                        .do(stb => this.stb = stb)
                        .filter(stb => this.hasRdvrVersion2(stb))
                        .flatMap(stb => this.getSeriesPriorities(stb))
                        .takeUntil(this.teardown)
                        .subscribe(
                            result => {
                                this.processSeries(result);

                                this.updateLoadingIndicator(result);

                                this.handleError(result);
                            }
                        );

                    this.$scope.$on('ovp-sortable:order-change', (evt, data) => {
                        this.$scope.$emit('Analytics:' + (data.movedUp ?
                            'rdvr-higher-priority' : 'rdvr-lower-priority'), {});
                        return this.updatePriorities();
                    });
                }

                $onDestroy() {
                    this.teardown();
                }

                getSeriesPriorities(stb) {
                    const stbChanged = this.stbService.currentStbSource.skip(1);

                    return this.rdvrService.getSeriesPriorities(stb)
                        .takeUntil(stbChanged);
                }

                processSeries({data, isComplete}) {
                    if (isComplete) {
                        // Series priority needs the full set of data before showing it to the user
                        this.seriesPriorities = data;
                    } else {
                        this.seriesPriorities = [];
                    }
                }

                updateLoadingIndicator({data, isComplete, error}) {
                    if (error) {
                        if (this.loading) {
                            this.loading.reject();
                            this.loading = undefined;
                        }
                    } else if (data.length === 0 && !isComplete) {
                        //Start of Fetch
                        if (this.loading) {
                            this.loading.reject();
                        }

                        this.loading = this.$q.defer();
                        this.$rootScope.$broadcast(
                            'message:loading',
                            this.loading.promise,
                            undefined,
                            'DVR Priority'
                        );
                    } else if (isComplete) {
                        // Data is fully loaded
                        if (this.loading) {
                            this.loading.resolve();
                            this.loading = undefined;
                        }
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    }
                    // Series priority doesn't display partially loaded data, so no need to handle that.
                }

                handleError({error}) {
                    this.error = error;
                    if (this.error) {
                        this.$log.error('Series Priority: Error fetching series priority; status:- ' + error);
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WCM-9000'),
                            title: this.errorCodesService.getHeaderForCode('WCM-1009'),
                            buttonText: 'OK'
                        });
                    }
                }

                updatePriorities() {
                    const order = this.seriesPriorities.map(p => p.settings.seriesPriority);

                    this.rdvrService.setSeriesPriorities(this.stb, order)
                        .then(
                            () => {
                                this.seriesPriorities.forEach((p, i) => p.settings.seriesPriority = i + 1);
                            },
                            error => {
                                this.$log.error('Series Priority: Error updating series priority; status:- ' + error);
                                this.alert.open({
                                    message: this.errorCodesService.getMessageForCode('WCM-9000'),
                                    title: this.errorCodesService.getMessageForCode('WCM-1013'),
                                    buttonText: 'OK'
                                });
                            });
                }

                hasRdvrVersion2(stb = this.stb) {
                    return stb.dvr && stb.dvr && stb.rdvrVersion > 1;
                }
            }
        });
})();
