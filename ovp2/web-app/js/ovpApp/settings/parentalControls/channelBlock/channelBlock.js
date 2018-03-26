(() => {
    'use strict';

    angular.module('ovpApp.settings.parentalControls.channelBlock', [
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.stbSettingsService',
        'ovpApp.directives.arrowNav',
        'ovpApp.settings.parentalControls.data',
        'ovpApp.components.alert',
        'ovpApp.messages',
        'ovpApp.services.parentalControlsService'
    ])
    .component('channelBlock', {
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
        controller: class ChannelBlock {
            /* @ngInject */
            constructor(StbSettingsService, parentalControlsService, parentalControlsData, $rootScope,
                $timeout, $window, $q, $log, messages) {
                angular.extend(this, {StbSettingsService, parentalControlsService, parentalControlsData,
                    $rootScope, $timeout, $window, $q,$log, messages });
            }

            $onInit() {
                this.parentalSearchValue = '';
                this.callSignFilter = null;
                this.channelBlockingEnabled = true;
            }
            cancelSearch() {
                this.parentalSearchValue = '';
                this.searchInput();
            }

            getCardAriaLabel(card) {
                const channelText = this.getCardNumber(card) ? 'channel ' + this.getCardNumber(card) : '';
                const cardSign = card.callsign || card.callSign;
                const musicChoiceRegex = /^(~?MC)/;
                let cardName;
                if (cardSign !== undefined && musicChoiceRegex.test(cardSign)) {
                    cardName = cardSign.replace(musicChoiceRegex, 'Music Choice ');
                } else {
                    cardName = this.getCardName(card);
                }
                const blocked = this.isChannelBlocked(card) ? 'blocked' : 'unblocked';
                return `${blocked} ${channelText}, ${cardName}`;
            }

            searchInput() {
                var nv = this.parentalSearchValue;
                if (nv) {
                    if (isFinite(nv)) {
                        this.callSignFilter = null;
                        this.$timeout(() => this.jumpToChannel(parseInt(nv), 0, false));
                    } else {
                        this.callSignFilter = new RegExp(nv, 'i');
                    }
                } else {
                    this.callSignFilter = null;
                }
                this.onFilterChanged(this.callSignFilter);
            }

            jumpToChannel(searchVal) {
                var channel = 0,
                    scrollTo = 0,
                    scrollAt = angular.element('body').scrollTop(),
                    domBlock;

                if (!isNaN(searchVal)) {
                    // find the nearest channel without going over
                    let diff = searchVal;
                    for (let i = 0; i < this.channelCards.length; i = i + 1) {
                        let chnl = this.channelCards[i].channelNumber || 0,
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
                                scrollTop:  scrollTo
                            }, 600, 'swing', function () {
                                domBlock.focus();
                            });
                        }
                    }
                }
            }
        }
    });
})();
