'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.settings.parentalControls.channelBlock', ['ovpApp.components.ovp.ovpSwitch', 'ovpApp.services.stbSettingsService', 'ovpApp.directives.arrowNav', 'ovpApp.settings.parentalControls.data', 'ovpApp.components.alert', 'ovpApp.messages', 'ovpApp.services.parentalControlsService']).component('channelBlock', {
        templateUrl: '/js/ovpApp/settings/parentalControls/channelBlock/channelBlock.html',
        bindings: {
            isChannelBlocked: '=',
            onFilterChanged: '=',
            getCardImage: '=',
            getCardNumber: '=',
            getCardName: '=',
            clearAllChannelBlocks: '=',
            toggleCardBlock: '=',
            channelCards: '<',
            filteredCards: '<'
        },
        controller: (function () {
            /* @ngInject */

            ChannelBlock.$inject = ["StbSettingsService", "parentalControlsService", "parentalControlsData", "$rootScope", "$timeout", "$window", "$q", "$log", "messages"];
            function ChannelBlock(StbSettingsService, parentalControlsService, parentalControlsData, $rootScope, $timeout, $window, $q, $log, messages) {
                _classCallCheck(this, ChannelBlock);

                angular.extend(this, { StbSettingsService: StbSettingsService, parentalControlsService: parentalControlsService, parentalControlsData: parentalControlsData,
                    $rootScope: $rootScope, $timeout: $timeout, $window: $window, $q: $q, $log: $log, messages: messages });
            }

            _createClass(ChannelBlock, [{
                key: '$onInit',
                value: function $onInit() {
                    this.parentalSearchValue = '';
                    this.callSignFilter = null;
                    this.channelBlockingEnabled = true;
                }
            }, {
                key: 'cancelSearch',
                value: function cancelSearch() {
                    this.parentalSearchValue = '';
                    this.searchInput();
                }
            }, {
                key: 'getCardAriaLabel',
                value: function getCardAriaLabel(card) {
                    var channelText = this.getCardNumber(card) ? 'channel ' + this.getCardNumber(card) : '';
                    var cardSign = card.callsign || card.callSign;
                    var musicChoiceRegex = /^(~?MC)/;
                    var cardName = undefined;
                    if (cardSign !== undefined && musicChoiceRegex.test(cardSign)) {
                        cardName = cardSign.replace(musicChoiceRegex, 'Music Choice ');
                    } else {
                        cardName = this.getCardName(card);
                    }
                    var blocked = this.isChannelBlocked(card) ? 'blocked' : 'unblocked';
                    return blocked + ' ' + channelText + ', ' + cardName;
                }
            }, {
                key: 'searchInput',
                value: function searchInput() {
                    var _this = this;

                    var nv = this.parentalSearchValue;
                    if (nv) {
                        if (isFinite(nv)) {
                            this.callSignFilter = null;
                            this.$timeout(function () {
                                return _this.jumpToChannel(parseInt(nv), 0, false);
                            });
                        } else {
                            this.callSignFilter = new RegExp(nv, 'i');
                        }
                    } else {
                        this.callSignFilter = null;
                    }
                    this.onFilterChanged(this.callSignFilter);
                }
            }, {
                key: 'jumpToChannel',
                value: function jumpToChannel(searchVal) {
                    var channel = 0,
                        scrollTo = 0,
                        scrollAt = angular.element('body').scrollTop(),
                        domBlock;

                    if (!isNaN(searchVal)) {
                        // find the nearest channel without going over
                        var diff = searchVal;
                        for (var i = 0; i < this.channelCards.length; i = i + 1) {
                            var chnl = this.channelCards[i].channelNumber || 0,
                                newDiff = searchVal - chnl;
                            if (newDiff >= 0 && newDiff <= diff) {
                                channel = chnl;
                                diff = newDiff;
                            }
                            if (newDiff === 0) {
                                break; // channel found
                            }
                        }

                        if (channel > 0) {
                            domBlock = this.$window.document.querySelector('#channel' + channel);
                            if (domBlock) {
                                // The channelId div is being referred to as the `domBlock`.
                                // Here whose immediate parent is the entire channel block
                                // and hence its offsetTop is calculated as 0 relative to its parent.
                                // domBlock.offsetParent gives the channelBlock where we need to scroll.
                                scrollTo = domBlock.offsetParent.offsetTop;

                                if (scrollTo < 0) {
                                    // scroll up
                                    scrollTo += scrollAt;
                                }

                                angular.element('html, body').animate({
                                    scrollTop: scrollTo
                                }, 600, 'swing', function () {
                                    domBlock.focus();
                                });
                            }
                        }
                    }
                }
            }]);

            return ChannelBlock;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/settings/parentalControls/channelBlock/channelBlock.js.map
