'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.settings.stb.parentalControls', ['ovpApp.settings.stb.parentalControls.allowedRatings', 'ovpApp.settings.stb.parentalControls.changeBlockingPin', 'ovpApp.settings.stb.parentalControls.contentBlock', 'ovpApp.settings.parentalControls.channelBlock', 'ovpApp.settings.stb.parentalControls.toggle', 'ovpApp.parentalControlsDialog', 'ovpApp.services.stbSettingsService']).component('stbParentalControls', {
        bindings: {
            preferences: '<',
            allowedRatings: '<',
            currentStb: '<',
            isPrimaryAccount: '<',
            properties: '<',
            channelList: '<'
        },
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-parentalControls.html',
        controller: (function () {
            /* @ngInject */

            StbParentalControls.$inject = ["messages", "config", "$log", "alert", "$rootScope", "StbSettingsService", "errorCodesService"];
            function StbParentalControls(messages, config, $log, alert, $rootScope, StbSettingsService, errorCodesService) {
                _classCallCheck(this, StbParentalControls);

                angular.extend(this, { messages: messages, config: config, $log: $log, alert: alert, $rootScope: $rootScope,
                    StbSettingsService: StbSettingsService, errorCodesService: errorCodesService });
            }

            _createClass(StbParentalControls, [{
                key: '$onInit',
                value: function $onInit() {
                    this.channelCards = [];
                    this.initChannels();

                    // Bind to this to pass it as a callback function to channelBlock component
                    this.clearAllChannelBlocks = this.clearAllChannelBlocks.bind(this);
                    this.toggleCardBlock = this.toggleCardBlock.bind(this);
                    this.isChannelBlocked = this.isChannelBlocked.bind(this);
                    this.blockCard = this.blockCard.bind(this);
                    this.unblockCard = this.unblockCard.bind(this);
                }
            }, {
                key: 'initChannels',
                value: function initChannels() {
                    this.channelCards = this.channelList;
                    this.onFilterChanged();
                }
            }, {
                key: 'getBlockedChannelArray',
                value: function getBlockedChannelArray() {
                    return this.preferences.parentalControls.blockedChannels;
                }
            }, {
                key: 'clearBlockedChannelArray',
                value: function clearBlockedChannelArray() {
                    this.preferences.parentalControls.blockedChannels = [];
                }
            }, {
                key: 'clearAllChannelBlocks',
                value: function clearAllChannelBlocks($event) {
                    var _this = this;

                    $event.stopPropagation();
                    $event.preventDefault();
                    var unblockPromise = this.StbSettingsService.updateBlockedChannels(this.currentStb, []).then(function () {
                        _this.clearBlockedChannelArray();
                        _this.initChannels();
                    }, function (error) {
                        _this.$log.error(error);
                        _this.alert.open({
                            message: _this.errorCodesService.getMessageForCode('WGE-1001')
                        });
                    });
                    this.$rootScope.$broadcast('message:loading', unblockPromise, 'Unblocking all channels...', undefined);
                }
            }, {
                key: 'toggleCardBlock',
                value: function toggleCardBlock($event, card) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    if (this.isChannelBlocked(card)) {
                        this.unblockCard(card);
                    } else {
                        this.blockCard(card);
                    }
                }
            }, {
                key: 'onFilterChanged',
                value: function onFilterChanged() {
                    var _this2 = this;

                    this.filteredCards = this.channelCards.filter(function (channel) {
                        return !_this2.callSignFilter || channel.callSign.match(_this2.callSignFilter);
                    }).sort(function (a, b) {
                        return a.channelNumber - b.channelNumber;
                    });
                    // Add an empty "card" for the clearAll button
                    this.filteredCards.unshift({});
                }
            }, {
                key: 'getCardNumber',
                value: function getCardNumber(card) {
                    return card.channelNumber;
                }
            }, {
                key: 'getCardName',
                value: function getCardName(card) {
                    return card.callSign;
                }
            }, {
                key: 'getCardImage',
                value: function getCardImage(card) {
                    return card.fullLogoUrl;
                }
            }, {
                key: 'isChannelBlocked',
                value: function isChannelBlocked(card) {
                    var blockedChannelArray = this.getBlockedChannelArray();
                    if (Array.isArray(blockedChannelArray)) {
                        return blockedChannelArray.find(function (x) {
                            return x.channelNumber === card.channelNumber;
                        }) !== undefined;
                    } else {
                        return false;
                    }
                }
            }, {
                key: 'blockCard',
                value: function blockCard(card) {
                    var blockedChannelArray = this.getBlockedChannelArray();
                    var duplicateChannels = this.getDuplicateChannels(card);
                    duplicateChannels.forEach(function (channel) {
                        blockedChannelArray.push(channel);
                    });
                    this.StbSettingsService.updateBlockedChannels(this.currentStb, blockedChannelArray);
                }
            }, {
                key: 'unblockCard',
                value: function unblockCard(card) {
                    var blockedChannelArray = this.getBlockedChannelArray();
                    var duplicateChannels = this.getDuplicateChannels(card);
                    duplicateChannels.forEach(function (channel) {
                        var channelObject = blockedChannelArray.find(function (x) {
                            return x.channelNumber === channel.channelNumber;
                        });
                        var index = blockedChannelArray.indexOf(channelObject);
                        if (index > -1) {
                            blockedChannelArray.splice(index, 1);
                        }
                    });
                    this.StbSettingsService.updateBlockedChannels(this.currentStb, blockedChannelArray);
                }
            }, {
                key: 'getDuplicateChannels',
                value: function getDuplicateChannels(card) {
                    var channelList = this.channelCards;
                    return channelList.filter(function (channel) {
                        return channel.mystroServiceId === card.mystroServiceId;
                    }).map(function (card) {
                        return { channelNumber: parseInt(card.channelNumber) };
                    });
                }
            }]);

            return StbParentalControls;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/stb-parentalControls/stb-parentalControls.js.map
