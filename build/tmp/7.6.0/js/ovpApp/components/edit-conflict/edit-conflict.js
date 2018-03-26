'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    stopbodyscrolling.$inject = ["$window"];
    angular.module('ovpApp.components.editConflict', ['ovpApp.legacy.DateUtil', 'ovpApp.rdvr.rdvrService', 'ovpApp.messages', 'ovpApp.components.ovp.button', 'ovpApp.components.ovp.rating', 'ovpApp.components.ovp.channel', 'ovpApp.services.dateFormat', 'ovpApp.services.errorCodes', 'ovpApp.components.alert', 'ajoslin.promise-tracker', 'ovpApp.components.conflictItem']).directive('freezeheightuponfirstload', freezeheightuponfirstload).directive('stopbodyscrolling', stopbodyscrolling).component('editConflict', {
        templateUrl: '/js/ovpApp/components/edit-conflict/edit-conflict.html',
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        controller: (function () {
            /* @ngInject */

            EditConflictController.$inject = ["$scope", "dateUtil", "stbService", "rdvrService", "$rootScope", "$q", "alert", "messages", "$log", "$timeout", "$element", "dateFormat", "promiseTracker", "errorCodesService"];
            function EditConflictController($scope, dateUtil, stbService, rdvrService, $rootScope, $q, alert, messages, $log, $timeout, $element, dateFormat, promiseTracker, errorCodesService) {
                _classCallCheck(this, EditConflictController);

                angular.extend(this, {
                    $scope: $scope,
                    dateUtil: dateUtil,
                    stbService: stbService,
                    rdvrService: rdvrService,
                    $rootScope: $rootScope,
                    $q: $q,
                    alert: alert,
                    messages: messages,
                    $log: $log,
                    $timeout: $timeout,
                    $element: $element,
                    dateFormat: dateFormat,
                    promiseTracker: promiseTracker,
                    errorCodesService: errorCodesService
                });
            }

            _createClass(EditConflictController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.dvrTracker = this.promiseTracker();
                    this.model = this.resolve && this.resolve.model || {};

                    this.resolveConflict(this.model.scheduledRecording, this.model.conflictingRecordings);
                }
            }, {
                key: 'resolveConflict',
                value: function resolveConflict(primaryRecording, conflictingRecordings) {
                    var _this = this;

                    this.done = false;
                    this.alreadyResolved = false;
                    this.confirmLabel = 'Confirm';

                    var conflictsPromise = undefined;
                    if (angular.isUndefined(conflictingRecordings) || conflictingRecordings.length === 0) {
                        conflictsPromise = this.fetchConflicts(primaryRecording);
                    } else {
                        conflictsPromise = this.$q.resolve(conflictingRecordings);
                    }

                    conflictsPromise.then(function (conflicts) {
                        if (!conflicts || conflicts.length === 0) {
                            // It's not in conflict after all. Move on to the next conflict, if able.
                            var hasNextConflict = false;
                            if (_this.nextConflicts) {
                                var index = _this.nextConflicts.indexOf(primaryRecording);
                                if (index >= 0 && index + 1 < _this.nextConflicts.length) {
                                    hasNextConflict = true;
                                    _this.resolveConflict(_this.nextConflicts[index + 1]);
                                }
                            }

                            if (!hasNextConflict) {
                                _this.alreadyResolved = true;
                                _this.getNextConflict();
                            }
                        } else {
                            _this.recordings = [primaryRecording].concat(conflicts);
                            _this.selections = _this.recordings.map(function () {
                                return 'undecided';
                            });
                        }
                    });

                    this.dayDisplay = this.dateFormat.absolute.expanded(new Date(parseInt(this.model.scheduledRecording.startTime * 1000)));

                    this.oneTimeOnly = this.model.oneTimeOnly;
                    this.isNotYetScheduled = this.model.isNotYetScheduled;
                    this.onKeep = this.model.onKeep;
                    this.onCancel = this.model.onCancel;
                }
            }, {
                key: 'maxToKeep',
                value: function maxToKeep() {
                    return this.recordings ? this.recordings.length - 1 : 2;
                }
            }, {
                key: 'fetchConflicts',
                value: function fetchConflicts(recording) {
                    var _this2 = this;

                    var getConflictsPromise = this.stbService.getCurrentStb().then(function (stb) {
                        return _this2.rdvrService.getScheduledConflicts(stb, recording);
                    }).then(function (conflicts) {
                        return conflicts;
                    }, function () {
                        _this2.alert.open({
                            message: _this2.errorCodesService.getMessageForCode('WCM-9000'),
                            title: _this2.errorCodesService.getHeaderForCode('WCM-1016'),
                            buttonText: 'OK'
                        }).result.then(function () {
                            return _this2.modalInstance.dismiss();
                        });
                    });
                    this.dvrTracker.addPromise(getConflictsPromise);
                    return getConflictsPromise;
                }
            }, {
                key: 'recordingSelected',
                value: function recordingSelected($index, state) {
                    this.selections[$index] = state;
                    var saveCount = this.selections.filter(function (s) {
                        return s === 'save';
                    }).length;
                    if (saveCount === this.maxToKeep()) {
                        // By process of elimination, we now know the rest should be deletes
                        this.selections = this.selections.map(function (s) {
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
            }, {
                key: 'readyToSubmit',
                value: function readyToSubmit() {
                    return this.selections && this.maxToKeep() === this.selections.filter(function (s) {
                        return s === 'save';
                    }).length;
                }
            }, {
                key: 'headerMessage',
                value: function headerMessage() {
                    if (this.alreadyResolved) {
                        return '';
                    } else if (this.done) {
                        return 'These ' + this.recordings.length + ' shows will be recorded';
                    }

                    var max = this.maxToKeep();
                    if (this.selections === undefined || this.selections.every(function (s) {
                        return s === 'undecided';
                    })) {
                        return 'Click the ' + max + ' recording' + (max === 1 ? '' : 's') + ' you would like to keep. You can record up to ' + max + ' shows at a time.';
                    } else {
                        var saveCount = this.selections.filter(function (s) {
                            return s === 'save';
                        }).length;
                        if (saveCount < max) {
                            var shortfall = max - saveCount;
                            var plural = shortfall === 1 ? '' : 's';
                            return 'Please select ' + shortfall + ' more recording' + plural + ' you wish to keep';
                        } else {
                            var delCount = this.selections.length - saveCount;
                            var thePrograms = delCount === 1 ? 'this program' : 'these ' + delCount + ' programs';
                            return 'Click confirm if you want to cancel ' + thePrograms + ' to resolve the recording conflict.';
                        }
                    }
                }
            }, {
                key: 'confirm',
                value: function confirm() {
                    var _this3 = this;

                    if (this.readyToSubmit()) {
                        return this.stbService.getCurrentStb().then(function (stb) {
                            _this3.isDirty = true;

                            var toCancel = [],
                                promises = [];

                            // First recording may or may not already be scheduled
                            if (_this3.selections[0] === 'delete') {
                                if (!_this3.isNotYetScheduled) {
                                    toCancel.push(_this3.recordings[0]);
                                }

                                if (_this3.onCancel) {
                                    promises.push(_this3.$q.when(_this3.onCancel()));
                                }
                            }

                            // The rest are scheduled, so they just get cancelled.
                            for (var i = 1; i < _this3.selections.length; i++) {
                                if (_this3.selections[i] === 'delete') {
                                    toCancel.push(_this3.recordings[i]);
                                }
                            }

                            promises.push(_this3.cancelRecordings(stb, toCancel).then(function () {
                                _this3.recordings = _this3.recordings.filter(function (r) {
                                    return toCancel.indexOf(r) < 0;
                                });
                                _this3.selections = _this3.recordings.map(function () {
                                    return 'save';
                                });
                                _this3.done = true;
                                if (!_this3.oneTimeOnly) {
                                    _this3.getNextConflict();
                                }
                            }, function () {
                                _this3.confirmLabel = 'Retry';
                            }));

                            var promise = _this3.$q.all(promises);
                            if (_this3.selections[0] === 'save' && _this3.onKeep) {
                                promise = promise.then(function () {
                                    return _this3.$timeout(angular.noop, 500);
                                }).then(function () {
                                    return _this3.onKeep();
                                });
                            }
                            _this3.dvrTracker.addPromise(promise);
                            return promise['finally'](function () {
                                if (_this3.oneTimeOnly) {
                                    _this3.modalInstance.close();
                                }
                            });
                        });
                    }
                }
            }, {
                key: 'cancelRecordings',
                value: function cancelRecordings(stb, recordings) {
                    var _this4 = this;

                    var promises = [];
                    recordings.forEach(function (r) {
                        var promise = _this4.rdvrService.cancelScheduled(stb, r, true);

                        _this4.$rootScope.$broadcast('message:loading', promise, 'Resolving...');

                        promises.push(promise.then(function () {}, function (reason) {
                            if (reason.status === 404) {
                                // It's apparently already cancelled
                                return _this4.$q.resolve();
                            }

                            _this4.alert.open({
                                message: _this4.errorCodesService.getMessageForCode('WCM-9000'),
                                title: _this4.errorCodesService.getHeaderForCode('WCM-1003'),
                                buttonText: 'OK'
                            });

                            return _this4.$q.reject(reason);
                        }));
                    });

                    return this.$q.all(promises);
                }
            }, {
                key: 'getNextConflict',
                value: function getNextConflict() {
                    var _this5 = this;

                    if (this.updateSubscription) {
                        this.updateSubscription.dispose();
                    }

                    this.nextConflicts = undefined;
                    this.resolveNextLabel = 'Checking for other conflicts...';
                    this.resolveNextDisabled = true;
                    this.stbService.getCurrentStb().then(function (stb) {
                        _this5.rdvrService.resetScheduledRecordings(stb);
                        _this5.updateSubscription = _this5.rdvrService.getScheduledRecordings(stb).map(function (_ref) {
                            var data = _ref.data;
                            var isComplete = _ref.isComplete;

                            return {
                                data: data.filter(function (recording) {
                                    return recording.conflicted;
                                }),
                                isComplete: isComplete
                            };
                        }).subscribe(function (_ref2) {
                            var data = _ref2.data;
                            var isComplete = _ref2.isComplete;

                            _this5.nextConflicts = data;
                            if (_this5.nextConflicts.length === 0) {
                                if (isComplete) {
                                    _this5.resolveNextLabel = 'No more conflicts!';
                                }
                                // else, leave the label as it is
                            } else {
                                    _this5.resolveNextDisabled = false;
                                    var countString = undefined;
                                    if (_this5.nextConflicts.length > 99) {
                                        countString = '99+';
                                    } else {
                                        countString = _this5.nextConflicts.length + (isComplete ? '' : '+');
                                    }
                                    _this5.resolveNextLabel = 'Resolve Next Conflict (' + countString + ')';
                                }
                        }, function () {
                            if (_this5.nextConflicts === 0) {
                                _this5.resolveNextLabel = 'Error checking for other conflicts';
                            }
                            // Else, leave the label as it is
                        });
                    });
                }
            }, {
                key: 'resolveNextConflict',
                value: function resolveNextConflict() {
                    if (this.nextConflicts && this.nextConflicts[0]) {
                        this.resolveConflict(this.nextConflicts[0]);
                    }
                }
            }, {
                key: 'cancelLabel',
                value: function cancelLabel() {
                    if (this.done || this.alreadyResolved) {
                        return 'Done';
                    } else {
                        return 'Cancel';
                    }
                }
            }]);

            return EditConflictController;
        })()
    });

    /* @ngInject */
    function freezeheightuponfirstload() {
        return {
            link: function link($scope, $element) {
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
            link: function link(scope) {
                var body = angular.element($window.document).find('body');
                body.addClass('body-stop-scrolling');
                scope.$on('$destroy', function () {
                    body.removeClass('body-stop-scrolling');
                });
            }
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/edit-conflict/edit-conflict.js.map
