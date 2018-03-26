'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * rdvrScheduledItem
     *
     * Example Usage:
     * <rdvr-schedule-list-item
     *    recording="someInputObject"
     *    on-state-changed="someCallback">
     * </rdvr-schedule-list-item>
     *
     * Bindings:
     *    recording: (object) the recording
     *    state: (boolean) whether it is checked or not. defaults to false
     *    onStateChanged: (function) callback when the selection state changes
     */
    angular.module('ovpApp.rdvr.scheduledItem', ['ovpApp.messages', 'ovpApp.config', 'ovpApp.components.ovp.checkBox', 'ovpApp.components.modal', 'ovpApp.components.editConflict', 'ovpApp.services.errorCodes', 'ovpApp.product.productActionService']).component('rdvrScheduleListItem', {
        bindings: {
            recording: '=',
            state: '<',
            onStateChanged: '&',
            day: '<',
            cancelCallBack: '&'
        },
        templateUrl: '/js/ovpApp/rdvr/scheduled/scheduled-item.html',
        controller: (function () {
            /* @ngInject */

            RdvrScheduledItem.$inject = ["$state", "messages", "rdvrCacheService", "stbService", "$rootScope", "alert", "modal", "rdvrService", "recordingsListType", "errorCodesService", "productService", "productActionService", "actionTypeMap"];
            function RdvrScheduledItem($state, messages, rdvrCacheService, stbService, $rootScope, alert, modal, rdvrService, recordingsListType, errorCodesService, productService, productActionService, actionTypeMap) {
                _classCallCheck(this, RdvrScheduledItem);

                angular.extend(this, { $state: $state, messages: messages, rdvrCacheService: rdvrCacheService, stbService: stbService, $rootScope: $rootScope, alert: alert,
                    modal: modal, rdvrService: rdvrService, recordingsListType: recordingsListType, errorCodesService: errorCodesService, productService: productService,
                    productActionService: productActionService, actionTypeMap: actionTypeMap });
            }

            _createClass(RdvrScheduledItem, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.recording) {
                        this.startTime = this.stbService.formatUnix(this.recording.startTime, 'h:nn a');
                    }

                    if (changes.state && typeof this.state !== 'boolean') {
                        this.state = false;
                    }
                }
            }, {
                key: 'click',
                value: function click() {
                    if (this.recording.conflicted) {
                        this.showConflictPopup();
                    } else {
                        this.showProductPage();
                    }
                }
            }, {
                key: 'productActionClicked',
                value: function productActionClicked() {
                    this.recording.cancelScheduledSelection = true;
                    this.cancelCallBack();
                }
            }, {
                key: 'stateToggled',
                value: function stateToggled($event) {
                    $event.stopPropagation();
                    this.onStateChanged({ recording: this.recording, state: this.state });
                }
            }, {
                key: 'isMovie',
                value: function isMovie() {
                    var recording = arguments.length <= 0 || arguments[0] === undefined ? this.recording : arguments[0];

                    return this.rdvrService.isMovie(recording.tmsProgramId);
                }
            }, {
                key: 'showConflictPopup',
                value: function showConflictPopup() {
                    var _this = this;

                    var recording = arguments.length <= 0 || arguments[0] === undefined ? this.recording : arguments[0];

                    var promise = this.stbService.getCurrentStb().then(function (stb) {
                        return _this.rdvrService.getScheduledConflicts(stb, recording);
                    });

                    this.$rootScope.$broadcast('message:loading', promise, 'DVR Scheduled');

                    promise.then(function (conflicts) {
                        //its possible that another client updated the conflicts after user loaded
                        //the page with results
                        if (angular.isDefined(conflicts) && conflicts.length === 0) {
                            _this.rdvrCacheService.clearCache(_this.recordingsListType.SCHEDULED, _this.setTopBox);

                            _this.alert.open({
                                message: _this.errorCodesService.getMessageForCode('WCM-9000'),
                                title: _this.errorCodesService.getMessageForCode('WCM-1016'),
                                buttonText: 'OK'
                            });
                        } else {
                            _this.modal.open({
                                showCloseIcon: false,
                                backdrop: 'static',
                                component: 'editConflict',
                                resolve: {
                                    model: {
                                        scheduledRecording: _this.recording,
                                        conflictingRecordings: conflicts
                                    }
                                }
                            });
                        }
                    }, function () {
                        _this.alert.open({
                            message: _this.errorCodesService.getMessageForCode('WCM-9000'),
                            title: _this.errorCodesService.getMessageForCode('WCM-1016'),
                            buttonText: 'OK'
                        });
                    });
                }
            }, {
                key: 'showProductPage',
                value: function showProductPage() {
                    var recording = arguments.length <= 0 || arguments[0] === undefined ? this.recording : arguments[0];

                    var isSeries = angular.isDefined(recording.tmsSeriesId);
                    if (isSeries) {
                        this.$state.go('product.series', {
                            tmsSeriesId: recording.tmsSeriesId,
                            serviceId: recording.mystroServiceId,
                            airtime: recording.startTime,
                            tmsProgramId: recording.tmsProgramId
                        });
                    } else {
                        this.$state.go('product.event', {
                            tmsId: recording.tmsProgramId,
                            serviceId: recording.mystroServiceId,
                            airtime: recording.startTime
                        });
                    }
                }
            }]);

            return RdvrScheduledItem;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/scheduled/scheduled-item.js.map
