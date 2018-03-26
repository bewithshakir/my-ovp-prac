'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * rdvrRecordingListItem
     *
     * Example Usage:
     * <component-name recording="someInputValue" on-selected="outputCallback(param)"></component-name>
     *
     * Bindings:
     *    recording: ([type]) [description]
     *    onStateChanged: (function) callback when the selection state changes
     */
    angular.module('ovpApp.rdvr.recordingItem', ['ovpApp.components.alert', 'ovpApp.messages', 'ovpApp.rdvr.rdvrService', 'ovpApp.services.stbService', 'ovpApp.services.errorCodes']).component('rdvrRecordingListItem', {
        bindings: {
            recording: '<',
            state: '<',
            onStateChanged: '&'
        },
        templateUrl: '/js/ovpApp/rdvr/my-recordings/recording-item.html',
        controller: (function () {
            /* @ngInject */

            ComponentName.$inject = ["$state", "stbService", "rdvrService", "$rootScope", "messages", "alert", "errorCodesService"];
            function ComponentName($state, stbService, rdvrService, $rootScope, messages, alert, errorCodesService) {
                _classCallCheck(this, ComponentName);

                angular.extend(this, { $state: $state, stbService: stbService, rdvrService: rdvrService, $rootScope: $rootScope, messages: messages, alert: alert,
                    errorCodesService: errorCodesService });
            }

            _createClass(ComponentName, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.state && typeof this.state !== 'boolean') {
                        this.state = false;
                    }
                }
            }, {
                key: 'episodeTitleDescription',
                value: function episodeTitleDescription() {
                    if (!this.recording || this.recording.episodes[0].isMovie) {
                        return '';
                    } else {
                        var episodeCount = this.recording.episodes.length;
                        if (episodeCount === 1) {
                            return this.recording.episodes[0].episodeTitle;
                        } else {
                            return episodeCount + ' Episodes';
                        }
                    }
                }
            }, {
                key: 'click',
                value: function click() {
                    var isSeries = angular.isDefined(this.recording.episodes[0].tmsSeriesId);
                    var episode = this.recording.episodes[0];
                    if (isSeries) {
                        this.$state.go('product.series', {
                            tmsSeriesId: episode.tmsSeriesId,
                            airtime: episode.startTime,
                            serviceId: episode.mystroServiceId
                        });
                    } else {
                        this.$state.go('product.event', {
                            tmsId: episode.tmsProgramId,
                            airtime: episode.startTime,
                            serviceId: episode.mystroServiceId
                        });
                    }

                    // eventGatewayProductPageService.viewShown('contentDetails', 'modalPopup', 'plain', {
                    //     category: 'My Recordings',
                    //     contentType: 'linear'
                    // });
                }
            }, {
                key: 'stateToggled',
                value: function stateToggled($event) {
                    $event.stopPropagation();
                    this.onStateChanged({ recording: this.recording, state: this.state });
                }
            }, {
                key: 'watchRecording',
                value: function watchRecording() {
                    var _this = this;

                    // $rootScope.$emit('EG:sendSwitchScreen', {
                    //     playerType: 'dvr',
                    //     assetMetadata: {
                    //         airingTime: episode.startUnixTimestampSeconds * 1000,
                    //         channelNumber: episode.displayChannel.toString(),
                    //         tmsGuideId: episode.mystroServiceId.toString()
                    //     },
                    //     direction: 'to',
                    //     otherDevice: 'stb'
                    // });

                    var promise = this.stbService.getCurrentStb().then(function (stb) {
                        return _this.rdvrService.resumeCompletedRecording(stb, _this.recording.episodes[0]);
                    }).then(function () {}, function () {
                        _this.alert.open(_this.errorCodesService.getAlertForCode('WCM-1603'));
                    });

                    this.$rootScope.$broadcast('message:loading', promise, undefined, this.recording.episodes[0].title);
                }
            }]);

            return ComponentName;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/my-recordings/recording-item.js.map
