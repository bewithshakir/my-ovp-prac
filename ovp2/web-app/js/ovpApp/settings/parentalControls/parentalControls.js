(function () {
    'use strict';
    angular.module('ovpApp.settings.parentalControls', [
        'ovpApp.config',
        'ovpApp.components.ovp.ovpSwitch',
        'ovpApp.services.parentalControlsService',
        'ovpApp.services.errorCodes',
        'ovpApp.components.alert',
        'ovpApp.messages',
        'ovpApp.components.ovpParentalControlsSlider',
        'ovpApp.components.authForm',
        'ovpApp.parentalControlsDialog',
        'ovpApp.settings.parentalControls.data',
        'ovpApp.settings.parentalControls.channelBlock'
    ])
    .controller('ParentalControlsSettingsController', ParentalControlsSettingsController);

    /* @ngInject */
    function ParentalControlsSettingsController($scope, config, parentalControlsService,
              messages, $rootScope, alert, $q, $log, TV_RATINGS, $state, parentalControlsDialog,
              MOVIE_RATINGS, $controller, PC_UNBLOCK_REASON, parentalControlsData, $window, $timeout,
              parentalControlsContext, errorCodesService) {
        const vm = this;

        vm.togglePCEnabled = togglePCEnabled;
        vm.unlock = unlock;
        vm.isChannelBlocked = isChannelBlocked;
        vm.getCardImage = getCardImage;
        vm.getCardName = getCardName;
        vm.getCardNumber = getCardNumber;
        vm.getCardCallsign = getCardCallsign;
        vm.clearAllChannelBlocks = clearAllChannelBlocks;
        vm.onFilterChanged = onFilterChanged;
        vm.blockCard = blockCard;
        vm.unblockCard = unblockCard;
        vm.toggleCardBlock = toggleCardBlock;

        vm.channelBlockingEnabled = true;
        vm.parentalControlsEnabledForClient = false;
        vm.canEdit = false;
        vm.tvRatings = TV_RATINGS;
        vm.movieRatings = MOVIE_RATINGS;
        vm.channelCards = [];
        vm.ratings = {
            movieRating: '',
            tvRating: ''
        };
        vm.hasPin = false;
        vm.unlocked = false;
        vm.parentalSearchValue = '';
        vm.$state = $state;
        let channels = [];
        let watchingRatings = false;
        let pcDialog = parentalControlsDialog.withContext(parentalControlsContext.WEB_SETTINGS);

        activate();

        /////////////////////

        function activate() {
            $scope.$watch(() => vm.hasPin, updateCanEdit);
            $scope.$watch(() => vm.unlocked, updateCanEdit);
            $scope.$watch(() => vm.parentalControlsEnabledForClient, updateCanEdit);
            parentalControlsService.getParentalControlsForUser().then(function () {
                parentalControlsService.isPINSet().then(hasSavedPin => {
                    vm.hasPin = hasSavedPin;
                    if (!vm.hasPin) {
                        vm.parentalControlsEnabledForClient = false;
                    } else {
                        parentalControlsService.isParentalControlsDisabledForClient().then(result => {
                            vm.parentalControlsEnabledForClient = !result;
                        });
                    }
                });
                initChannels();
                initRatings();
            }, function (error) {
                $log.error(error);
                alert.open({
                    message: errorCodesService.getMessageForCode('WGE-1001')
                });
            });
        }

        function initChannels(message) {
            let channelPromise = parentalControlsData.getChannelCards()
                .then(result => {
                    channels = result.channels;
                    vm.channelCards = result.channelCards;
                    //Attaching channelNumber and channelName for each card used for searching
                    vm.channelCards.forEach((card) => {
                        card.channelNumber = getCardNumber(card);
                        card.channelName = getCardName(card);
                    });
                    onFilterChanged();
                });
            $rootScope.$broadcast(
                'message:loading',
                channelPromise,
                message,
                undefined
            );
        }

        function initRatings() {
            parentalControlsData.getRatingBlocks()
                .then(result => {
                    vm.ratings = result;

                    if (!watchingRatings) {
                        $scope.$watch(() => vm.ratings.tvRating, function (newRating, oldRating) {
                            if (newRating !== oldRating) {

                                // TODO: Analytics Event
                                // $rootScope.$emit('EG:parentalControlsUpdated', {
                                //     ratingType: 'tvRating',
                                //     newRating: newRating,
                                //     oldRating: oldRating
                                // });
                                parentalControlsService.debounceUnblockRating(vm.ratings.movieRating, newRating);
                            }
                        });

                        $scope.$watch(() => vm.ratings.movieRating, function (newRating, oldRating) {
                            if (newRating !== oldRating) {

                                // TODO: Analytics Event
                                // $rootScope.$emit('EG:parentalControlsUpdated', {
                                //     ratingType: 'movieRating',
                                //     newRating: newRating,
                                //     oldRating: oldRating
                                // });

                                parentalControlsService.debounceUnblockRating(newRating, vm.ratings.tvRating);
                            }
                        });
                        watchingRatings = true;
                    }
                    $rootScope.$broadcast('pageChangeComplete', $state.current);
                });
        }

        function updateCanEdit() {
            vm.canEdit = vm.hasPin && vm.unlocked && vm.parentalControlsEnabledForClient;
        }

        function isChannel(card) {
            return angular.isDefined(card.services);
        }

        function isChannelBlocked(card) {
            if (isChannel(card)) {
                return card.services.some(s => s.blocked);
            } else {
                return card.blocked;
            }
        }

        function getCardImage(card) {
            let url;
            if (isChannel(card)) {
                url = card.logoUrl;
            } else {
                url = card.imageUrl;
            }
            return addLogoQueryParams(swapProtocol(url));
        }

        function getCardName(card) {
            if (isChannel(card)) {
                return card.name;
            } else {
                return card.networkName;
            }
        }

        /**
         * This only returns a channel number if there is a _single_ channel associated with the card. If there are
         * more than 1, they do not get displayed.
         * Due to the logic - we merge multiple services and channels into the same card, so that may represent many
         * channels.
         */
        function getCardNumber(card) {
            if (card.channels) {
                if (card.channels.length >= 1) {
                    return card.channels[0];
                }
                return '';
            } else if (card.services) {
                let uniqueChannels = card.services.reduce((memo, service) => {
                    if (service.channels) {
                        let unique = service.channels.filter(s => memo.indexOf(s) < 0);
                        return memo.concat(unique);
                    } else {
                        return memo;
                    }
                }, []);

                if (uniqueChannels.length >= 1) {
                    return uniqueChannels[0];
                } else {
                    return '';
                }
            }
        }

        function getCardCallsign(card) {
            if (isChannel(card)) {
                return card.name;
            } else {
                return card.callsign;
            }
        }

        function clearAllChannelBlocks($event) {
            $event.stopPropagation();
            $event.preventDefault();

            unlock().then(() => {
                //$rootScope.$emit('EG:parentalControlsCleared');
                parentalControlsService.clearAllChannelBlocks().then(function () {
                    initChannels('Unblocking all channels...');
                }, function (error) {
                    $log.error(error);
                    alert.open({
                        message: errorCodesService.getMessageForCode('WGE-1001')
                    });
                });
            });
        }

        function blockCard(card) {
            if (isChannel(card)) {
                card.services.forEach(s => s.blocked = true);
            } else {
                card.blocked = true;
            }
            parentalControlsService.updateParentalControlsByChannel(channels);
        }

        function unblockCard(card) {
            if (isChannel(card)) {
                card.services.forEach(s => s.blocked = false);
            } else {
                card.blocked = false;
            }
            parentalControlsService.updateParentalControlsByChannel(channels);
        }

        function onFilterChanged(callSignFilter) {
            vm.filteredCards = vm.channelCards
                .filter((card) => {
                    const callsign = getCardCallsign(card);
                    return !callSignFilter || callsign.match(callSignFilter);
                });

            // Add an empty "card" for the clearAll button
            vm.filteredCards.push();
        }

        function swapProtocol(url) {
            return url.replace('http://', 'https://');
        }

        function addLogoQueryParams(url) {
            return url + ((url.indexOf('?') > -1) ? '&' : '?') + 'width=100&sourceType=colorhybrid';
        }

        function unlock() {
            if (vm.canEdit) {
                return $q.resolve();
            } else {
                return pcDialog.unlock().then(() => {
                    parentalControlsService.enableParentalControlsForClient();
                    vm.hasPin = true;
                    vm.unlocked = true;
                    vm.parentalControlsEnabledForClient = true;
                    updateCanEdit();
                });
            }
        }

        function toggleCardBlock($event, card) {
            $event.stopPropagation();
            $event.preventDefault();
            unlock().then(() => {
                if (isChannelBlocked(card)) {
                    unblockCard(card);
                } else {
                    blockCard(card);
                }
            });
        }
        function toggleParentalControlsForClient() {
            if (vm.parentalControlsEnabledForClient === false) {
                vm.parentalControlsEnabledForClient = true;
                parentalControlsService.enableParentalControlsForClient();
            } else {
                vm.parentalControlsEnabledForClient = false;
                parentalControlsService.disableParentalControlsForClient();
            }
            updateCanEdit();
        }

        function togglePCEnabled($event) {
            $event.stopPropagation();
            $event.preventDefault();

            if (!vm.hasPin || !vm.unlocked) {
                pcDialog.unlock().then(() => {
                    initRatings();
                    toggleParentalControlsForClient();
                    vm.hasPin = true;
                    vm.unlocked = true;
                    updateCanEdit();
                });
            } else if (vm.parentalControlsEnabledForClient) {
                pcDialog.unlock().then(() => {
                    toggleParentalControlsForClient();
                });
            } else if (!vm.parentalControlsEnabledForClient) {
                toggleParentalControlsForClient();
            }
        }
    }
}());
