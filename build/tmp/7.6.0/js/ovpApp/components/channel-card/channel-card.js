'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.channelCard', ['ovpApp.directives.lazySrc', 'ovpApp.ondemand.data', 'ovpApp.services.errorCodes', 'ovpApp.config']).component('channelCard', {
        bindings: {
            channel: '<',
            options: '<'
        },
        templateUrl: '/js/ovpApp/components/channel-card/channel-card.html',
        controller: (function () {
            /* @ngInject */

            ChannelCard.$inject = ["$state", "messages", "profileService", "CAPABILITIES", "alert", "onDemandData", "$rootScope", "errorCodesService", "config"];
            function ChannelCard($state, messages, profileService, CAPABILITIES, alert, onDemandData, $rootScope, errorCodesService, config) {
                _classCallCheck(this, ChannelCard);

                angular.extend(this, { $state: $state, messages: messages, profileService: profileService, CAPABILITIES: CAPABILITIES, alert: alert,
                    onDemandData: onDemandData, $rootScope: $rootScope, errorCodesService: errorCodesService, config: config });
            }

            _createClass(ChannelCard, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.options) {
                        this.applyDefaultOptions(changes.options.currentValue);
                    }
                }

                // On Click either go to the VOD boxart grid or display an unentitled network message.
            }, {
                key: 'click',
                value: function click() {

                    this.$rootScope.$broadcast('Analytics:select-channel-card');

                    if (this.channel.isEntitled) {
                        var _name = this.onDemandData.formatCategoryNameForRoute(this.channel.name);
                        this.$state.go('ovp.ondemand.networks.network', { name: _name, index: null, page: null });
                    } else {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WEN-1000', {
                                IVR_NUMBER: this.config.ivrNumber
                            }),
                            buttonText: 'OK'
                        });
                    }
                }

                //////////

            }, {
                key: 'applyDefaultOptions',
                value: function applyDefaultOptions(newOptions) {
                    var defaults = {
                        showChannelName: false
                    };

                    this.options = angular.extend({}, defaults, newOptions);
                }
            }]);

            return ChannelCard;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/channel-card/channel-card.js.map
