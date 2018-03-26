(function () {
    'use strict';

    angular.module('ovpApp.components.editConflict', [
        'ovpApp.legacy.DateUtil',
        'ovpApp.rdvr.rdvrService',
        'ovpApp.messages',
        'ovpApp.components.ovp.button',
        'ovpApp.components.ovp.rating',
        'ovpApp.components.ovp.channel',
        'ovpApp.services.dateFormat',
        'ovpApp.services.errorCodes',
        'ovpApp.components.alert',
        'ajoslin.promise-tracker',
        'ovpApp.components.conflictItem'
    ])
    .directive('freezeheightuponfirstload', freezeheightuponfirstload)
    .directive('stopbodyscrolling', stopbodyscrolling)
    .component('editConflict', {
        templateUrl: '/js/ovpApp/components/edit-conflict/edit-conflict.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: class EditConflictController {
            /* @ngInject */
            constructor($scope, dateUtil, stbService, rdvrService, $rootScope, $q,
                alert, messages, $log, $timeout, $element,
                dateFormat, promiseTracker, errorCodesService) {
                angular.extend(this, {
                    $scope,
                    dateUtil,
                    stbService,
                    rdvrService,
                    $rootScope,
                    $q,
                    alert,
                    messages,
                    $log,
                    $timeout,
                    $element,
                    dateFormat,
                    promiseTracker,
                    errorCodesService
                });
            }

            $onInit() {
                this.dvrTracker = this.promiseTracker();
                this.model = (this.resolve && this.resolve.model) || {};

                this.resolveConflict(this.model.scheduledRecording, this.model.conflictingRecordings);
            }

            resolveConflict(primaryRecording, conflictingRecordings) {
                this.done = false;
                this.alreadyResolved = false;
                this.confirmLabel = 'Confirm';

                let conflictsPromise;
                if (angular.isUndefined(conflictingRecordings) || conflictingRecordings.length === 0) {
                    conflictsPromise = this.fetchConflicts(primaryRecording);
                } else {
                    conflictsPromise = this.$q.resolve(conflictingRecordings);
                }

                conflictsPromise.then(conflicts => {
                    if (!conflicts || conflicts.length === 0) {
                        // It's not in conflict after all. Move on to the next conflict, if able.
                        let hasNextConflict = false;
                        if (this.nextConflicts) {
                            const index = this.nextConflicts.indexOf(primaryRecording);
                            if (index >= 0 && index + 1 < this.nextConflicts.length) {
                                hasNextConflict = true;
                                this.resolveConflict(this.nextConflicts[index + 1]);
                            }
                        }

                        if (!hasNextConflict) {
                            this.alreadyResolved = true;
                            this.getNextConflict();
                        }
                    } else {
                        this.recordings = [primaryRecording].concat(conflicts);
                        this.selections = this.recordings.map(() => 'undecided');
                    }
                });

                this.dayDisplay = this.dateFormat.absolute.expanded(new Date
                    (parseInt(this.model.scheduledRecording.startTime * 1000)));

                this.oneTimeOnly = this.model.oneTimeOnly;
                this.isNotYetScheduled = this.model.isNotYetScheduled;
                this.onKeep = this.model.onKeep;
                this.onCancel = this.model.onCancel;
            }

            maxToKeep() {
                return this.recordings ? this.recordings.length - 1 : 2;
            }

            fetchConflicts(recording) {
                let getConflictsPromise = this.stbService.getCurrentStb()
                    .then(stb => this.rdvrService.getScheduledConflicts(stb, recording))
                    .then(conflicts => {
                        return conflicts;
                    }, () => {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WCM-9000'),
                            title: this.errorCodesService.getHeaderForCode('WCM-1016'),
                            buttonText: 'OK'
                        }).result.then(() => this.modalInstance.dismiss());
                    });
                this.dvrTracker.addPromise(getConflictsPromise);
                return getConflictsPromise;
            }

            recordingSelected($index, state) {
                this.selections[$index] = state;
                const saveCount = this.selections.filter(s => s === 'save').length;
                if (saveCount === this.maxToKeep()) {
                    // By process of elimination, we now know the rest should be deletes
                    this.selections = this.selections.map(s => {
                        if (s === 'undecided') {
                            return 'delete';
                        } else {
                            return s;
                        }
                    });
                } else if (saveCount > this.maxToKeep()) {
                    // Too many marked to keep; need to unmark one of them
                    this.selections[($index + 1) % this.selections.length] = 'delete';
                }
                this.confirmLabel = 'Confirm';
            }

            readyToSubmit() {
                return this.selections && this.maxToKeep() === this.selections.filter(s => s === 'save').length;
            }

            headerMessage() {
                if (this.alreadyResolved) {
                    return '';
                } else if (this.done) {
                    return `These ${this.recordings.length} shows will be recorded`;
                }

                const max = this.maxToKeep();
                if (this.selections === undefined || this.selections.every(s => s === 'undecided')) {
                    return 'Click the ' + max + ' recording' + (max === 1 ? '' : 's') +
                        ' you would like to keep. You can record up to ' + max + ' shows at a time.';
                } else {
                    const saveCount = this.selections.filter(s => s === 'save').length;
                    if (saveCount < max) {
                        const shortfall = max - saveCount;
                        const plural = shortfall === 1 ? '' : 's';
                        return `Please select ${shortfall} more recording${plural} you wish to keep`;
                    } else {
                        const delCount = this.selections.length - saveCount;
                        const thePrograms = delCount === 1 ? 'this program' : 'these ' + delCount + ' programs';
                        return `Click confirm if you want to cancel ${thePrograms} to resolve the recording conflict.`;
                    }
                }
            }

            confirm() {
                if (this.readyToSubmit()) {
                    return this.stbService.getCurrentStb().then(stb => {
                        this.isDirty = true;

                        let toCancel = [], promises = [];

                        // First recording may or may not already be scheduled
                        if (this.selections[0] === 'delete') {
                            if (!this.isNotYetScheduled) {
                                toCancel.push(this.recordings[0]);
                            }

                            if (this.onCancel) {
                                promises.push(this.$q.when(this.onCancel()));
                            }
                        }

                        // The rest are scheduled, so they just get cancelled.
                        for (let i = 1; i < this.selections.length; i++) {
                            if (this.selections[i] === 'delete') {
                                toCancel.push(this.recordings[i]);
                            }
                        }

                        promises.push(this.cancelRecordings(stb, toCancel)
                            .then(() => {
                                this.recordings = this.recordings.filter(r => toCancel.indexOf(r) < 0);
                                this.selections = this.recordings.map(() => 'save');
                                this.done = true;
                                if (!this.oneTimeOnly) {
                                    this.getNextConflict();
                                }
                            }, () => {
                                this.confirmLabel = 'Retry';
                            }));

                        let promise = this.$q.all(promises);
                        if (this.selections[0] === 'save' && this.onKeep) {
                            promise = promise
                                .then(() => this.$timeout(angular.noop, 500))
                                .then(() => this.onKeep());
                        }
                        this.dvrTracker.addPromise(promise);
                        return promise.finally(() => {
                            if (this.oneTimeOnly) {
                                this.modalInstance.close();
                            }
                        });
                    });
                }
            }

            cancelRecordings(stb, recordings) {
                let promises = [];
                recordings.forEach(r => {
                    let promise = this.rdvrService.cancelScheduled(stb, r, true);

                    this.$rootScope.$broadcast(
                        'message:loading',
                        promise,
                        'Resolving...'
                    );

                    promises.push(promise.then(
                        () => {},
                        (reason) => {
                            if (reason.status === 404) {
                                // It's apparently already cancelled
                                return this.$q.resolve();
                            }

                            this.alert.open({
                                message: this.errorCodesService.getMessageForCode('WCM-9000'),
                                title: this.errorCodesService.getHeaderForCode('WCM-1003'),
                                buttonText: 'OK'
                            });

                            return this.$q.reject(reason);
                        }));
                });

                return this.$q.all(promises);
            }

            getNextConflict() {
                if (this.updateSubscription) {
                    this.updateSubscription.dispose();
                }

                this.nextConflicts = undefined;
                this.resolveNextLabel = 'Checking for other conflicts...';
                this.resolveNextDisabled = true;
                this.stbService.getCurrentStb().then(stb => {
                    this.rdvrService.resetScheduledRecordings(stb);
                    this.updateSubscription = this.rdvrService.getScheduledRecordings(stb)
                        .map(({data, isComplete}) => {
                            return {
                                data: data.filter(recording => recording.conflicted),
                                isComplete: isComplete
                            };
                        })
                        .subscribe(
                            ({data, isComplete}) => {
                                this.nextConflicts = data;
                                if (this.nextConflicts.length === 0) {
                                    if (isComplete) {
                                        this.resolveNextLabel = 'No more conflicts!';
                                    }
                                    // else, leave the label as it is
                                } else {
                                    this.resolveNextDisabled = false;
                                    let countString;
                                    if (this.nextConflicts.length > 99) {
                                        countString = '99+';
                                    } else {
                                        countString = this.nextConflicts.length + (isComplete ? '' : '+');
                                    }
                                    this.resolveNextLabel = `Resolve Next Conflict (${countString})`;
                                }
                            },
                            () => {
                                if (this.nextConflicts === 0) {
                                    this.resolveNextLabel = 'Error checking for other conflicts';
                                }
                                // Else, leave the label as it is
                            }
                        );
                });
            }

            resolveNextConflict() {
                if (this.nextConflicts && this.nextConflicts[0]) {
                    this.resolveConflict(this.nextConflicts[0]);
                }
            }

            cancelLabel() {
                if (this.done || this.alreadyResolved) {
                    return 'Done';
                } else {
                    return 'Cancel';
                }
            }
        }
    });

    /* @ngInject */
    function freezeheightuponfirstload() {
        return {
            link: function ($scope, $element) {
                var listener = $scope.$watch('currentRecordingsInConflict', function () {
                    var height = $element.height();
                    if (height > 0) {
                        //since the height of the modal will get smaller
                        //once the conflict is resolved (1 less row)
                        //explicitly set height of the list to first rendered height
                        $element.css('height', height + 'px');
                        listener();
                    }
                });
            }
        };
    }

    /* @ngInject */
    function stopbodyscrolling($window) {
        return {
            link: function (scope) {
                var body = angular.element($window.document).find('body');
                body.addClass('body-stop-scrolling');
                scope.$on('$destroy', function () {
                    body.removeClass('body-stop-scrolling');
                });
            }
        };
    }
}());
