'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.product.otherWays', ['ovpApp.services.profileService', 'ovpApp.product.productActionService', 'ovpApp.product.button', 'ovpApp.services.dateFormat', 'ovpApp.dataDelegate', 'ovpApp.directives.focus']).constant('languageLabelMap', {
        'en': '',
        'sp': 'ESP',
        'es': 'ESP'
    }).component('otherWaysPopup', {
        bindings: {
            resolve: '<'
        },
        template: '\n        <p id="ariaLabelledByText" class="sr-only">Other ways to watch {{$ctrl.resolve.asset.title}}, </p>\n        <other-ways asset="$ctrl.resolve.asset" in-popup="true"/>'
    }).component('otherWays', {
        bindings: {
            asset: '<',
            inPopup: '<'
        },
        templateUrl: '/js/ovpApp/product/other-ways/other-ways.html',
        controller: (function () {
            OtherWays.$inject = ["actionTypeMap", "languageLabelMap", "$filter", "$rootScope", "dateFormat", "delegateUtils", "profileService"];
            function OtherWays(actionTypeMap, languageLabelMap, $filter, $rootScope, dateFormat, delegateUtils, profileService) {
                _classCallCheck(this, OtherWays);

                angular.extend(this, { actionTypeMap: actionTypeMap, languageLabelMap: languageLabelMap, $filter: $filter,
                    $rootScope: $rootScope, dateFormat: dateFormat, delegateUtils: delegateUtils, profileService: profileService });
            }

            _createClass(OtherWays, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.profileService.isCdvrEnabled().then(function (isEnabled) {
                        _this.isCdvrEnabled = isEnabled;
                    });
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.asset) {
                        this.onAssetChanged();
                    }
                }
            }, {
                key: 'onAssetChanged',
                value: function onAssetChanged() {
                    var _this2 = this;

                    this.activeTab = 'watchHere';

                    if (this.asset && (!this.asset.watchHereActions || this.asset.watchHereActions.length === 0)) {
                        this.activeTab = 'watchOnTv';
                    }

                    var isOoh = !!(this.$rootScope.location && this.$rootScope.location.behindOwnModem === false);

                    //Create a new item that contains some calculated data as well as all the
                    //same existing fields as the 'item'
                    var itemMapper = function itemMapper(item) {
                        var out = {
                            label: _this2.getLabel(item.actionType),
                            timeAvailability: _this2.getTimeAvailability(item),
                            lang: _this2.getLanguageLabel(item),
                            network: _this2.getNetwork(item),
                            statusIcon: _this2.getStatusIcon(item),
                            ooh: isOoh,
                            streamProps: _this2.getStreamProperties(item),
                            chNumber: _this2.getChannelNumber(item),
                            callSign: _this2.getCallSign(item),
                            cdvrNotCompleted: _this2.cdvrNotCompleted(item),
                            isSeriesRecording: _this2.asset ? _this2.asset.isSeriesRecording : null
                        };
                        return Object.assign(out, item);
                    };

                    this.watchOnTvActions = this.asset ? this.asset.watchOnTvActions.map(itemMapper) : [];
                    this.watchHereActions = this.asset ? this.asset.watchHereActions.map(itemMapper) : [];
                }
            }, {
                key: 'setActiveTab',
                value: function setActiveTab(tab) {
                    if (tab === 'watchHere' && this.watchHereActions && this.watchHereActions.length > 0) {
                        this.activeTab = tab;
                    } else if (tab === 'watchOnTv' && this.watchOnTvActions && this.watchOnTvActions.length > 0) {
                        this.activeTab = tab;
                    }
                }
            }, {
                key: 'getLabel',
                value: function getLabel(actionType) {
                    return this.actionTypeMap[actionType].otherWaysWatchOnTVLabel;
                }
            }, {
                key: 'getTimeAvailability',
                value: function getTimeAvailability(item) {
                    if (['futureAiring', 'scheduleRecording', 'watchLiveOnTv', 'watchLiveIP', 'cdvrScheduleRecording', 'cdvrCancelRecording', 'cdvrDeleteRecording', 'cdvrResumeRecording', 'cdvrPlayRecording'].indexOf(this.actionTypeMap[item.actionType].id) > -1) {
                        var stream = this.asset.streamList[item.streamIndex];
                        var startDate = new Date(parseInt(stream.streamProperties.startTime));

                        return this.dateFormat.relative.expanded.atTime(startDate);
                    } else if (['watchOnDemandOnTv', 'resumeOnDemandOnTv', 'watchOnDemandIP', 'resumeOnDemandIP'].indexOf(this.actionTypeMap[item.actionType].id) > -1) {
                        var stream = this.asset.streamList[item.streamIndex];
                        var endTime = stream.streamProperties.tvodEntitlement ? stream.streamProperties.tvodEntitlement.rentalEndTimeUtcSeconds * 1000 : stream.streamProperties.endTime;
                        var endDate = new Date(parseInt(endTime));
                        return 'Available until ' + this.dateFormat.relative.short.atTime(endDate);
                    }
                    return '';
                }
            }, {
                key: 'getNetwork',
                value: function getNetwork(item) {
                    var stream = this.asset.streamList[item.streamIndex];
                    var callsign = '';
                    var channel = '';
                    if (stream.network && stream.network.callsign) {
                        callsign = stream.network.callsign;
                    }
                    if (stream.streamProperties.allChannelNumbers) {
                        channel = stream.streamProperties.allChannelNumbers[0];
                    }
                    return callsign + (callsign && channel ? ' | ' : '') + channel;
                }
            }, {
                key: 'getChannelNumber',
                value: function getChannelNumber(item) {
                    var stream = this.asset.streamList[item.streamIndex];
                    var channel = '';
                    if (stream.streamProperties.allChannelNumbers) {
                        channel = stream.streamProperties.allChannelNumbers[0];
                    }
                    return channel;
                }
            }, {
                key: 'getCallSign',
                value: function getCallSign(item) {
                    var stream = this.asset.streamList[item.streamIndex];
                    var callsign = '';
                    if (stream.network && stream.network.callsign) {
                        callsign = stream.network.callsign;
                    }
                    return callsign;
                }
            }, {
                key: 'getLanguageLabel',
                value: function getLanguageLabel(item) {
                    var language = this.asset.streamList[item.streamIndex].streamProperties.primaryAudioLanguage;
                    return this.languageLabelMap[language];
                }
            }, {
                key: 'getStatusIcon',
                value: function getStatusIcon(item) {
                    var stream = this.asset.streamList[item.streamIndex];

                    if (!stream.isEntitled) {
                        return 'unentitled';
                    } else {
                        return false;
                    }
                }
            }, {
                key: 'getStreamProperties',
                value: function getStreamProperties(item) {
                    var stream = this.asset.streamList[item.streamIndex];
                    var properties = this.delegateUtils.getStreamProps(stream);
                    properties.rating = stream.streamProperties.rating || '';
                    return properties;
                }
            }, {
                key: 'cdvrNotCompleted',
                value: function cdvrNotCompleted(item) {
                    var stream = this.asset.streamList[item.streamIndex];
                    return stream.cdvrNotCompleted;
                }
            }]);

            return OtherWays;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/other-ways/other-ways.js.map
