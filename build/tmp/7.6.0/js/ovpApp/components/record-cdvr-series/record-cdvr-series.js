'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.recordCdvrSeries', ['ovpApp.components.ovp.channel', 'ovpApp.messages', 'ovpApp.components.alert', 'ovpApp.components.ovp.button', 'ovpApp.components.ovp.selectBox', 'ovpApp.components.ovp.clickConfirm', 'ovpApp.services.dateFormat', 'ovpApp.directives.dropdownList', 'ovpApp.services.cdvr', 'ajoslin.promise-tracker']).component('recordCdvrSeries', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/record-cdvr-series/record-cdvr-series.html',
        controller: (function () {
            RecordCdvrSeries.$inject = ["promiseTracker", "$rootScope", "cdvrService", "ChannelService", "$q", "$element", "$timeout", "$log", "errorCodesService"];
            function RecordCdvrSeries(promiseTracker, $rootScope, cdvrService, ChannelService, $q, $element, $timeout, $log, errorCodesService) {
                _classCallCheck(this, RecordCdvrSeries);

                angular.extend(this, { promiseTracker: promiseTracker, $rootScope: $rootScope, cdvrService: cdvrService, ChannelService: ChannelService,
                    $q: $q, $element: $element, $timeout: $timeout, $log: $log, errorCodesService: errorCodesService });
            }

            _createClass(RecordCdvrSeries, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.asset = this.resolve.asset;
                    this.action = this.resolve.action;
                    this.preferredTmsGuideId = this.resolve.preferredTmsGuideId;
                    this.settings = {
                        recordOnlyNew: true,
                        tmsGuideId: this.preferredTmsGuideId
                    };

                    this.loadingTracker = this.promiseTracker();

                    this.channels = [];
                    this.getChannels().then(function (channels) {
                        var _channels;

                        (_channels = _this.channels).splice.apply(_channels, [0, _this.channels.length].concat(_toConsumableArray(channels)));

                        _this.initForm();

                        _this.setSelectedChannel();
                    });

                    // Options use same property names as settings to help link the form
                    // entry fields of the dialog to the settings we save.
                    this.options = {
                        recordOnlyNew: [{ label: 'All Episodes', value: false }, { label: 'New Episodes', value: true }],
                        tmsGuideId: this.channels
                    };
                }
            }, {
                key: '$postLink',
                value: function $postLink() {
                    var _this2 = this;

                    this.$timeout(function () {
                        _this2.$element.find('ovp-dropdown-list button:visible')[0].focus();
                    }, 0, false);
                }
            }, {
                key: 'onSelect',
                value: function onSelect(key) {
                    var _this3 = this;

                    return function (item) {
                        _this3.form[key] = _this3.options[key].findIndex(function (opt) {
                            return opt.value === item.value;
                        });
                        angular.forEach(_this3.form, function (val, key) {
                            _this3.settings[key] = _this3.options[key][val].value;
                        });

                        if (key === 'tmsGuideId') {
                            _this3.setSelectedChannel();
                        }
                    };
                }
            }, {
                key: 'confirm',
                value: function confirm() {
                    var _this4 = this;

                    // Analytics
                    this.$rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToRecord',
                        featureCurrentStep: 3,
                        featureNumberOfSteps: 100,
                        elementStandardizedName: 'confirm',
                        operationType: 'buttonClick',
                        modalName: 'cdvrConfirmRecord',
                        modalType: 'options',
                        asset: this.asset,
                        cdvrSettings: this.settings
                    });

                    var promise = this.cdvrService.scheduleSeriesRecording(this.action, this.settings).then(function () {
                        _this4.$rootScope.$broadcast('update-dvr', {}, /* no schedule options at this point */
                        _this4.asset, _this4.action);
                        _this4.$rootScope.$broadcast('message:growl', 'Recording for ' + _this4.asset.title + ' successfully set');
                        _this4.modalInstance.close('success');

                        // Analytics
                        _this4.$rootScope.$emit('Analytics:cdvr-schedule-series-recording', _this4.asset, _this4.action, {
                            recordOnlyNew: _this4.settings.recordOnlyNew,
                            tmsGuideId: _this4.settings.tmsGuideId
                        });
                    }, function (error) {
                        _this4.$log.error(error);
                        _this4.modalInstance.dismiss('error');
                        // UNISTR - CDVR_ERROR_RECORDING_FAIL
                        _this4.$rootScope.$broadcast('message:growl', 'We’re sorry, we were unable to schedule your recording. Please try again later.');

                        // Analytics
                        _this4.$rootScope.$emit('Analytics:cdvr-record-failed', _this4.asset, _this4.action, {
                            recordOnlyNew: _this4.settings.recordOnlyNew,
                            tmsGuideId: _this4.settings.tmsGuideId
                        }, {
                            error: error,
                            errorCode: 'WCD-1400',
                            errorMessage: _this4.errorCodesService.getMessageForCode('WCD-1400', {
                                TITLE: _this4.asset.title
                            })
                        });
                    });

                    this.loadingTracker.addPromise(promise);
                }
            }, {
                key: 'cancel',
                value: function cancel() {

                    // Analytics
                    this.$rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToRecord',
                        featureCurrentStep: 3,
                        featureNumberOfSteps: 4,
                        modalName: 'cdvrConfirmRecord',
                        modalType: 'options',
                        elementStandardizedName: 'cancel',
                        operationType: 'buttonClick',
                        asset: this.asset,
                        cdvrSettings: this.settings
                    });

                    this.modalInstance.dismiss('cancelled');
                }
            }, {
                key: 'getChannels',
                value: function getChannels() {
                    var _this5 = this;

                    var promises = this.asset.cdvrChannelPickerTmsGuideIds.map(function (guideId) {
                        return _this5.ChannelService.getChannelByTmsId(guideId).then(function (chanInfo) {
                            if (chanInfo && chanInfo.channels) {
                                // Create drop up list item for channel
                                var channel = {
                                    callSign: chanInfo.callsign,
                                    // Default to first channel number in array
                                    chanNum: chanInfo.channels.includes(_this5.asset.displayChannel) ? _this5.asset.displayChannel : chanInfo.channels[0],
                                    value: chanInfo.tmsGuideId
                                };
                                channel.label = chanInfo.callsign + ' | ' + channel.chanNum;
                                return channel;
                            }
                        });
                    });

                    var byCallsign = function byCallsign(a, b) {
                        var callSignA = a.callSign.toUpperCase();
                        var callSignB = b.callSign.toUpperCase();

                        if (callSignA < callSignB) {
                            return -1;
                        }

                        if (callSignA > callSignB) {
                            return 1;
                        }
                        return 0;
                    };

                    return this.$q.all(promises).then(function (channels) {
                        return channels.filter(function (channel) {
                            return !!channel;
                        }).sort(byCallsign);
                    });
                }
            }, {
                key: 'initForm',
                value: function initForm() {
                    var _this6 = this;

                    this.form = {};
                    angular.forEach(this.settings, function (val, key) {
                        if (_this6.options[key]) {
                            _this6.form[key] = _this6.options[key].findIndex(function (opt) {
                                return opt.value == val;
                            });
                        }
                    });
                }
            }, {
                key: 'setSelectedChannel',
                value: function setSelectedChannel() {
                    this.displayChannel = this.channels[this.form.tmsGuideId].chanNum;
                    this.tmsGuideId = this.channels[this.form.tmsGuideId].value;
                }
            }]);

            return RecordCdvrSeries;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/record-cdvr-series/record-cdvr-series.js.map
