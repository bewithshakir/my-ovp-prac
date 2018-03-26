(function () {
    'use strict';

    /**
     * myRecordings
     *
     * My Recordings subpage for Remote DVR
     *
     * Example Usage:
     * <my-recordings></my-recordings>
     *
     */
    angular.module('ovpApp.rdvr.myRecordings', [
            'ovpApp.rdvr.recordingItem',
            'ovpApp.rdvr.rdvrService',
            'ovpApp.services.rxUtils',
            'ovpApp.components.alert',
            'ovpApp.components.confirm',
            'ovpApp.messages',
            'ovpApp.components.confirm',
            'ovpApp.services.errorCodes'
        ])
        .component('myRecordings', {
            templateUrl: '/js/ovpApp/rdvr/my-recordings/my-recordings.html',
            controller: class MyRecordings {
                /* @ngInject */
                constructor(rdvrService, stbService, rx, createObservableFunction, $q, $rootScope, messages,
                    alert, modal, CONFIRM_BUTTON_TYPE, $state, errorCodesService) {
                    angular.extend(this, {rdvrService, stbService, rx, createObservableFunction, $q,
                        $rootScope, messages, alert, modal, CONFIRM_BUTTON_TYPE, $state, errorCodesService});
                }

                $onInit() {
                    this.recordingGroups = [];
                    this.teardown = this.createObservableFunction();

                    this.stbService.currentStbSource
                        .do(stb => this.stb = stb)
                        .filter(stb => this.hasRdvrVersion2(stb))
                        .flatMap(stb => this.getMyRecordingGroups(stb))
                        .takeUntil(this.teardown)
                        .subscribe(
                            result => {
                                this.processRecordings(result);

                                this.updateLoadingIndicator(result);

                                this.updateSubheader(result);

                                this.handleError(result);
                            }
                        );
                }

                $onDestroy() {
                    this.teardown();
                }

                getMyRecordingGroups(stb) {
                    const stbChanged = this.stbService.currentStbSource.skip(1);

                    return this.rdvrService.getMyRecordingGroups(stb)
                        .takeUntil(stbChanged);
                }

                processRecordings({data, isComplete}) {
                    if (isComplete) {
                        // My recordings needs the full set of data before showing it to the user
                        this.recordingGroups = data;
                        this.recordingGroups.forEach(r => r.deleteGroupSelection = false);
                    } else {
                        this.recordingGroups = [];
                    }
                }

                updateLoadingIndicator({data, isComplete, error}) {
                    if (error) {
                        if (this.loading) {
                            this.loading.reject();
                            this.loading = undefined;
                        }
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
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
                            'DVR Recordings'
                        );
                    } else if (isComplete) {
                        // Data is fully loaded
                        if (this.loading) {
                            this.loading.resolve();
                            this.loading = undefined;
                        }
                        this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
                    }
                    // My recordings doesn't display partially loaded data, so no need to handle that.
                }

                updateSubheader() {
                    this.subheaderOptions = {
                        showToggler: true,
                        id: 'myRecordings'
                    };
                }

                handleError({error}) {
                    this.error = error;
                    if (this.error) {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WCM-9000'),
                            title: this.errorCodesService.getHeaderForCode('WCM-1009'),
                            buttonText: 'OK'
                        });
                    }
                }

                viewChanged(view) {
                    this.view = view;
                    this.updateSubheader();
                }

                onCheckboxStateChanged(recording, state) {
                    recording.deleteGroupSelection = state;
                    this.updateSubheader();
                }

                unselectAll() {
                    this.recordingGroups.forEach(r => r.deleteGroupSelection = false);
                    this.updateSubheader();
                }

                bulkDelete() {
                    const episodesToDelete = this.recordingGroups.filter(r => r.deleteGroupSelection)
                        .reduce((memo, group) => {
                            memo.push(...group.episodes);
                            return memo;
                        }, []);
                    const plural = (episodesToDelete.length > 1 ? 's' : '');
                    const message = `Are you sure you want to delete ${episodesToDelete.length} recording${plural}?`;

                    const options = {
                        okLabel: this.CONFIRM_BUTTON_TYPE.YES,
                        cancelLabel: this.CONFIRM_BUTTON_TYPE.NO,
                        preOkMessage: message,
                        inProgressMessage: `Deleting ${episodesToDelete.length} recording${plural}`,
                        okAction: () => this.doDelete(episodesToDelete)
                    };

                    this.modal.open({
                        component: 'confirm',
                        resolve: {
                            options: () => options
                        }
                    });
                }

                singleDelete(asset, group) {
                    const plural = (group.episodes.length > 1 ? 's' : '');
                    const message = `Are you sure you want to delete ` +
                        `${group.episodes.length} recording${plural} of ${asset.title}?`;

                    const options = {
                        okLabel: this.CONFIRM_BUTTON_TYPE.YES,
                        cancelLabel: this.CONFIRM_BUTTON_TYPE.NO,
                        preOkMessage: message,
                        inProgressMessage: `Deleting ${group.episodes.length} recording${plural}`,
                        okAction: () => this.doDelete(group.episodes)
                    };

                    this.modal.open({
                        component: 'confirm',
                        resolve: {
                            options
                        }
                    });
                }

                doDelete(episodesToDelete) {
                    const promise = this.rdvrService.deleteRecordings(this.stb, episodesToDelete)
                        .then(
                            (response) => {
                                if (response.data.failedDeletions > 0) {
                                    this.alert.open({
                                        message: this.errorCodesService.getMessageForCode('WCM-2406'),
                                        title: this.errorCodesService.getHeaderForCode('WCM-1012'),
                                        buttonText: 'OK'
                                    });
                                }
                            },
                            (error) => {
                                this.alert.open({
                                    message: error.statusCode === 404 ?
                                        this.errorCodesService.getMessageForCode('WCM-2406') :
                                        this.errorCodesService.getMessageForCode('WCM-9000'),
                                    title: this.errorCodesService.getMessageForCode('WCM-1012'),
                                    buttonText: 'OK'
                                });
                            }
                        );
                    return promise;
                }

                hasRdvrVersion2(stb = this.stb) {
                    return stb && stb.dvr && stb.rdvrVersion > 1;
                }
            }
        });
})();
