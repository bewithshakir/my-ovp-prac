'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.ovp.channel', ['ovpApp.config', 'ovpApp.services.epgsService']).component('ovpChannel', {
        templateUrl: '/js/ovpApp/components/ovp/ovp-channel/ovp-channel.html',
        bindings: {
            mystroServiceId: '<',
            channelId: '<',
            tmsGuideId: '<',
            callSign: '<',
            displayType: '@'
        },
        controller: (function () {
            /* @ngInject */

            ChannelController.$inject = ["epgsService", "ChannelService", "config"];
            function ChannelController(epgsService, ChannelService, config) {
                _classCallCheck(this, ChannelController);

                angular.extend(this, {
                    epgsService: epgsService,
                    ChannelService: ChannelService,
                    config: config
                });
            }

            _createClass(ChannelController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.imageQueryParams = '?sourceType=colorhybrid&apikey=' + this.config.oAuth.consumerKey + '&width=35';
                }
            }, {
                key: 'isList',
                value: function isList() {
                    return this.displayType === 'list';
                }
            }, {
                key: '$onChanges',
                value: function $onChanges() {
                    this.updateChannels();
                }
            }, {
                key: 'updateChannels',
                value: function updateChannels() {
                    if (this.channelId && this.mystroServiceId) {
                        this.updateByMystroServiceId();
                    } else if (this.tmsGuideId) {
                        this.updateByTmsGuideId();
                    }
                }
            }, {
                key: 'updateByMystroServiceId',
                value: function updateByMystroServiceId() {
                    var _this = this;

                    this.epgsService.getChannelByMystroSvcId(this.mystroServiceId, this.channelId).then(function (channel) {
                        if (channel) {
                            _this.networkLogoUrl = _this.config.image_api + '/guide/' + channel.callSign + _this.imageQueryParams;
                            _this.callSign = channel.callSign;
                        }
                    });
                }
            }, {
                key: 'updateByTmsGuideId',
                value: function updateByTmsGuideId() {
                    var _this2 = this;

                    this.ChannelService.getChannelByTmsId(this.tmsGuideId).then(function (channel) {
                        if (channel) {
                            _this2.networkLogoUrl = _this2.config.image_api + '/guide/' + channel.callsign + _this2.imageQueryParams;
                            _this2.callSign = channel.callsign;
                        }
                    });
                }
            }]);

            return ChannelController;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-channel/ovp-channel.js.map
