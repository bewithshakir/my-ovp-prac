'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    angular.module('ovpApp.rdvr.myRecordings', ['ovpApp.rdvr.recordingItem', 'ovpApp.rdvr.rdvrService', 'ovpApp.services.rxUtils', 'ovpApp.components.alert', 'ovpApp.components.confirm', 'ovpApp.messages', 'ovpApp.components.confirm', 'ovpApp.services.errorCodes']).component('myRecordings', {
        templateUrl: '/js/ovpApp/rdvr/my-recordings/my-recordings.html',
        controller: (function () {
            /* @ngInject */

            MyRecordings.$inject = ["rdvrService", "stbService", "rx", "createObservableFunction", "$q", "$rootScope", "messages", "alert", "modal", "CONFIRM_BUTTON_TYPE", "$state", "errorCodesService"];
            function MyRecordings(rdvrService, stbService, rx, createObservableFunction, $q, $rootScope, messages, alert, modal, CONFIRM_BUTTON_TYPE, $state, errorCodesService) {
                _classCallCheck(this, MyRecordings);

                angular.extend(this, { rdvrService: rdvrService, stbService: stbService, rx: rx, createObservableFunction: createObservableFunction, $q: $q,
                    $rootScope: $rootScope, messages: messages, alert: alert, modal: modal, CONFIRM_BUTTON_TYPE: CONFIRM_BUTTON_TYPE, $state: $state, errorCodesService: errorCodesService });
            }

            _createClass(MyRecordings, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.recordingGroups = [];
                    this.teardown = this.createObservableFunction();

                    this.stbService.currentStbSource['do'](function (stb) {
                        return _this.stb = stb;
                    }).filter(function (stb) {
                        return _this.hasRdvrVersion2(stb);
                    }).flatMap(function (stb) {
                        return _this.getMyRecordingGroups(stb);
                    }).takeUntil(this.teardown).subscribe(function (result) {
                        _this.processRecordings(result);

                        _this.updateLoadingIndicator(result);

                        _this.updateSubheader(result);

                        _this.handleError(result);
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.teardown();
                }
            }, {
                key: 'getMyRecordingGroups',
                value: function getMyRecordingGroups(stb) {
                    var stbChanged = this.stbService.currentStbSource.skip(1);

                    return this.rdvrService.getMyRecordingGroups(stb).takeUntil(stbChanged);
                }
            }, {
                key: 'processRecordings',
                value: function processRecordings(_ref) {
                    var data = _ref.data;
                    var isComplete = _ref.isComplete;

                    if (isComplete) {
                        // My recordings needs the full set of data before showing it to the user
                        this.recordingGroups = data;
                        this.recordingGroups.forEach(function (r) {
                            return r.deleteGroupSelection = false;
                        });
                    } else {
                        this.recordingGroups = [];
                    }
                }
            }, {
                key: 'updateLoadingIndicator',
                value: function updateLoadingIndicator(_ref2) {
                    var data = _ref2.data;
                    var isComplete = _ref2.isComplete;
                    var error = _ref2.error;

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
                        this.$rootScope.$broadcast('message:loading', this.loading.promise, undefined, 'DVR Recordings');
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
            }, {
                key: 'updateSubheader',
                value: function updateSubheader() {
                    this.subheaderOptions = {
                        showToggler: true,
                        id: 'myRecordings'
                    };
                }
            }, {
                key: 'handleError',
                value: function handleError(_ref3) {
                    var error = _ref3.error;

                    this.error = error;
                    if (this.error) {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WCM-9000'),
                            title: this.errorCodesService.getHeaderForCode('WCM-1009'),
                            buttonText: 'OK'
                        });
                    }
                }
            }, {
                key: 'viewChanged',
                value: function viewChanged(view) {
                    this.view = view;
                    this.updateSubheader();
                }
            }, {
                key: 'onCheckboxStateChanged',
                value: function onCheckboxStateChanged(recording, state) {
                    recording.deleteGroupSelection = state;
                    this.updateSubheader();
                }
            }, {
                key: 'unselectAll',
                value: function unselectAll() {
                    this.recordingGroups.forEach(function (r) {
                        return r.deleteGroupSelection = false;
                    });
                    this.updateSubheader();
                }
            }, {
                key: 'bulkDelete',
                value: function bulkDelete() {
                    var _this2 = this;

                    var episodesToDelete = this.recordingGroups.filter(function (r) {
                        return r.deleteGroupSelection;
                    }).reduce(function (memo, group) {
                        memo.push.apply(memo, _toConsumableArray(group.episodes));
                        return memo;
                    }, []);
                    var plural = episodesToDelete.length > 1 ? 's' : '';
                    var message = 'Are you sure you want to delete ' + episodesToDelete.length + ' recording' + plural + '?';

                    var _options = {
                        okLabel: this.CONFIRM_BUTTON_TYPE.YES,
                        cancelLabel: this.CONFIRM_BUTTON_TYPE.NO,
                        preOkMessage: message,
                        inProgressMessage: 'Deleting ' + episodesToDelete.length + ' recording' + plural,
                        okAction: function okAction() {
                            return _this2.doDelete(episodesToDelete);
                        }
                    };

                    this.modal.open({
                        component: 'confirm',
                        resolve: {
                            options: function options() {
                                return _options;
                            }
                        }
                    });
                }
            }, {
                key: 'singleDelete',
                value: function singleDelete(asset, group) {
                    var _this3 = this;

                    var plural = group.episodes.length > 1 ? 's' : '';
                    var message = 'Are you sure you want to delete ' + (group.episodes.length + ' recording' + plural + ' of ' + asset.title + '?');

                    var options = {
                        okLabel: this.CONFIRM_BUTTON_TYPE.YES,
                        cancelLabel: this.CONFIRM_BUTTON_TYPE.NO,
                        preOkMessage: message,
                        inProgressMessage: 'Deleting ' + group.episodes.length + ' recording' + plural,
                        okAction: function okAction() {
                            return _this3.doDelete(group.episodes);
                        }
                    };

                    this.modal.open({
                        component: 'confirm',
                        resolve: {
                            options: options
                        }
                    });
                }
            }, {
                key: 'doDelete',
                value: function doDelete(episodesToDelete) {
                    var _this4 = this;

                    var promise = this.rdvrService.deleteRecordings(this.stb, episodesToDelete).then(function (response) {
                        if (response.data.failedDeletions > 0) {
                            _this4.alert.open({
                                message: _this4.errorCodesService.getMessageForCode('WCM-2406'),
                                title: _this4.errorCodesService.getHeaderForCode('WCM-1012'),
                                buttonText: 'OK'
                            });
                        }
                    }, function (error) {
                        _this4.alert.open({
                            message: error.statusCode === 404 ? _this4.errorCodesService.getMessageForCode('WCM-2406') : _this4.errorCodesService.getMessageForCode('WCM-9000'),
                            title: _this4.errorCodesService.getMessageForCode('WCM-1012'),
                            buttonText: 'OK'
                        });
                    });
                    return promise;
                }
            }, {
                key: 'hasRdvrVersion2',
                value: function hasRdvrVersion2() {
                    var stb = arguments.length <= 0 || arguments[0] === undefined ? this.stb : arguments[0];

                    return stb && stb.dvr && stb.rdvrVersion > 1;
                }
            }]);

            return MyRecordings;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/my-recordings/my-recordings.js.map
