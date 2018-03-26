(() => {
    'use strict';
    angular.module('ovpApp.settings.stb.parentalControls', [
        'ovpApp.settings.stb.parentalControls.allowedRatings',
        'ovpApp.settings.stb.parentalControls.changeBlockingPin',
        'ovpApp.settings.stb.parentalControls.contentBlock',
        'ovpApp.settings.parentalControls.channelBlock',
        'ovpApp.settings.stb.parentalControls.toggle',
        'ovpApp.parentalControlsDialog',
        'ovpApp.services.stbSettingsService'
    ])
    .component('stbParentalControls', {
        bindings: {
            preferences: '<',
            allowedRatings: '<',
            currentStb: '<',
            isPrimaryAccount: '<',
            properties: '<',
            channelList: '<'
        },
        templateUrl: '/js/ovpApp/settings/stb-parentalControls/stb-parentalControls.html',
        controller: class StbParentalControls {
            /* @ngInject */
            constructor(messages, config, $log, alert, $rootScope, StbSettingsService, errorCodesService) {
                angular.extend(this, {messages, config, $log, alert, $rootScope,
                    StbSettingsService, errorCodesService});
            }

            $onInit() {
                this.channelCards = [];
                this.initChannels();

                // Bind to this to pass it as a callback function to channelBlock component
                this.clearAllChannelBlocks = this.clearAllChannelBlocks.bind(this);
                this.toggleCardBlock = this.toggleCardBlock.bind(this);
                this.isChannelBlocked = this.isChannelBlocked.bind(this);
                this.blockCard = this.blockCard.bind(this);
                this.unblockCard = this.unblockCard.bind(this);
            }

            initChannels() {
                this.channelCards = this.channelList;
                this.onFilterChanged();
            }

            getBlockedChannelArray() {
                return this.preferences.parentalControls.blockedChannels;
            }

            clearBlockedChannelArray() {
                this.preferences.parentalControls.blockedChannels = [];
            }
            clearAllChannelBlocks($event) {
                $event.stopPropagation();
                $event.preventDefault();
                var unblockPromise = this.StbSettingsService.updateBlockedChannels(this.currentStb, [])
                .then(() => {
                        this.clearBlockedChannelArray();
                        this.initChannels();
                    }, (error) => {
                        this.$log.error(error);
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WGE-1001')
                        });
                    });
                this.$rootScope.$broadcast(
                    'message:loading',
                     unblockPromise,
                    'Unblocking all channels...',
                    undefined
                );
            }

            toggleCardBlock($event, card) {
                $event.stopPropagation();
                $event.preventDefault();
                if (this.isChannelBlocked(card)) {
                    this.unblockCard(card);
                } else {
                    this.blockCard(card);
                }
            }
            onFilterChanged() {
                this.filteredCards = this.channelCards
                .filter((channel) => !this.callSignFilter || channel.callSign.match(this.callSignFilter))
                .sort((a, b) => a.channelNumber - b.channelNumber);
                // Add an empty "card" for the clearAll button
                this.filteredCards.unshift({});
            }

            getCardNumber(card) {
                return card.channelNumber;
            }

            getCardName(card) {
                return card.callSign;
            }

            getCardImage(card) {
                return card.fullLogoUrl;
            }

            isChannelBlocked(card) {
                let blockedChannelArray = this.getBlockedChannelArray();
                if (Array.isArray(blockedChannelArray)) {
                    return blockedChannelArray.find(x => x.channelNumber === card.channelNumber) !== undefined;
                } else {
                    return false;
                }
            }

            blockCard(card) {
                let blockedChannelArray = this.getBlockedChannelArray();
                var duplicateChannels = this.getDuplicateChannels(card);
                duplicateChannels.forEach((channel) => {
                    blockedChannelArray.push(channel);
                });
                this.StbSettingsService.updateBlockedChannels(this.currentStb, blockedChannelArray);
            }
            unblockCard(card) {
                let blockedChannelArray = this.getBlockedChannelArray();
                var duplicateChannels = this.getDuplicateChannels(card);
                duplicateChannels.forEach((channel) => {
                    var channelObject = blockedChannelArray.find(x =>
                        x.channelNumber === channel.channelNumber);
                    var index = blockedChannelArray.indexOf(channelObject);
                    if (index > -1) {
                        blockedChannelArray.splice(index, 1);
                    }
                });
                this.StbSettingsService.updateBlockedChannels(this.currentStb, blockedChannelArray);
            }

            getDuplicateChannels(card) {
                var channelList = this.channelCards;
                return channelList.filter((channel)=> {
                    return (channel.mystroServiceId === card.mystroServiceId);
                }).map((card) => {
                    return {channelNumber : parseInt(card.channelNumber)};
                });
            }
        }
    });
})();
