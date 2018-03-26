/*jshint -W072 */
(function () {
    'use strict';

    const keys = {up: 38, down: 40, tab: 9, enter: 13, space: 32, right: 39, left: 37};

    /**
     * miniGuide
     *
     * Example Usage:
     * <mini-guide player="someInputValue"</mini-guide>
     *
     * Bindings:
     *    player: ([type]) flash player object
     *    liveTmsId: ([type]) channel to tune to (optional)
     *    eanUrl: ([type]) ean to tune to (optional)
     */
    angular.module('ovpApp.playerControls.miniGuide', [
            'ovpApp.player',
            'ovpApp.player.whatsOn',
            'ovpApp.player.streamService',
            'ovpApp.playerControls.miniGuideData',
            'ovpApp.config',
            'ovpApp.services.ovpStorage',
            'ovpApp.services.parentalControlsService',
            'ovpApp.services.errorCodes',
            'ovpApp.services.profileService',
            'ovpApp.components.alert',
            'ovpApp.services.locationService',
            'ovpApp.messages',
            'ovpApp.video',
            'ovpApp.version',
            'ovpApp.directives.lazySrc',
            'ajoslin.promise-tracker',
            'ovpApp.services.rxUtils',
            'vs-repeat',
            'ovpApp.oauth'
        ])
        .component('miniGuide', {
            bindings: {
                player: '<',
                liveTmsId: '<',
                eanUrl: '<'
            },
            templateUrl: '/js/ovpApp/components/player/mini-guide.html',
            controller: class MiniGuide {
                /* @ngInject */
                constructor($scope, $q, playerStreamService, config, miniGuideData, ovpStorage,
                    $state, parentalControlsService, profileService, CAPABILITIES, alert, locationService,
                    messages, TWCVideoJS, playerErrors, $timeout, $rootScope, version, $element, promiseTracker,
                    playerControlTimer, createObservableFunction, storageKeys, playerService, errorCodesService,
                    OauthDataManager) {

                    angular.extend(this, {$scope, $q, playerStreamService, config, miniGuideData,
                        ovpStorage, $state, parentalControlsService, profileService, CAPABILITIES, alert,
                        locationService, messages, TWCVideoJS, playerErrors, $timeout, $rootScope, version, $element,
                        promiseTracker, playerControlTimer, createObservableFunction, storageKeys, playerService,
                        errorCodesService, OauthDataManager});
                }

                $onInit() {
                    this.focusedChannel = null;
                    this.miniGuideVisible = true;
                    this.showChannelNumber = true;
                    this.filtersVisible = false;
                    this.filterSelection = null;
                    this.channels = [];
                    this.filters = [];
                    this.currentAppliedFilter = {};
                    this.selectedFilter = {};
                    this.sorts = [];
                    this.currentAppliedSort = {};
                    this.selectedSort = {};
                    this.filteredChannels = [];
                    this.initialChannel = undefined;
                    this.version = this.version.appVersion;
                    this.channelSelectedBy = 'application';
                    this.parentalControlsEnabled = false;
                    this.loadingTracker = this.promiseTracker();
                    this.eventSubscriptions = [];
                    this.sortVisible = true;
                    this.allChannelsMsg = '';

                    this.profileService.isAccessibilityEnabled().then((isEnabled) => {
                        //No need to track changes to accessibility capability change
                        //as app will get reloaded when accessibility mode changes
                        this.isAccessibilityEnabled = isEnabled;
                    });

                    // Spec U hides channel numbers
                    this.isSpecU = this.profileService.isSpecU();

                    if (this.isSpecU) {
                        this.sortVisible = false;
                        this.showChannelNumbers = false;
                    }

                    if (!this.waitForPlayer) {
                        this.waitForPlayer = this.$q.defer();
                    }

                    // Throttle to improve the performace while scrolling as
                    // we get lot of scrolling events at once.
                    this.throttledScrollingFn = this.createObservableFunction();

                    this.lastScrollPosition = 0;
                    let scrollThreshold = 500;

                    let promise = this.$q.all([
                        this.loadChannelData(),
                        this.registerCallbacks()
                    ]).then(([initialChannel]) => {
                        this.selectChannel(initialChannel);
                        this.scrollToChannel(this.selectedChannel);
                        this.showMiniGuide();
                        this.isParentalControlsEnabled();
                    });

                    this.loadingTracker.addPromise(promise);

                    this.eventSubscriptions[this.eventSubscriptions.length] = this.$rootScope.$on('scrollable:scrolled',
                        (evt, element) => {
                            let filteredLastChannelNumber, limitLastChannelNumber;
                            let scrollTop = element.scrollTop();
                            let limitLastChildElement = angular.element(element[0].lastElementChild)
                                .find('.channel-number');

                            if (this.filteredChannels.length > 0 &&
                                limitLastChildElement &&
                                limitLastChildElement.length > 0) {
                                filteredLastChannelNumber = this.filteredChannels[this.filteredChannels.length - 1]
                                    .localChannelNumber;
                                limitLastChannelNumber = parseInt(limitLastChildElement[0].innerHTML);
                            }
                            // We need to scroll down.
                            if (scrollTop > this.lastScrollPosition) {
                                // When we have reached the bottom of the mini guide then load more elements.
                                if ((scrollTop + element.innerHeight()) >= (element[0].scrollHeight)) {
                                    if (limitLastChannelNumber != filteredLastChannelNumber) {
                                        this.throttledScrollingFn('scrollDown');
                                    }
                                }
                            } else { // We need to scroll up.
                                if (scrollTop <= 0) {
                                    if (this.begin > 0) {
                                        this.throttledScrollingFn();
                                        // So that user can scroll again if the channels are
                                        // still pending at the top.
                                        element.scrollTop(scrollThreshold);
                                    }
                                }
                            }
                            this.lastScrollPosition = scrollTop;
                        });

                    this.eventSubscriptions[this.eventSubscriptions.length] =
                        this.$rootScope.$on('connectivityService:statusChanged', (e, isOnline) => {
                            if (isOnline) {
                                this.loadChannelData();
                            }
                        });


                    this.$scope.$on('player-control:click', () => {
                        this.onPlayerMouseDown();
                    });

                    this.$scope.$on('player-control:hide', () => {
                        this.miniGuideVisible = false;
                    });

                    this.$scope.$on('player:fullscreen-toggled', (event, data) => {
                        if (data.isEnabled) {
                            this.miniGuideVisible = false;
                        }
                    });

                    this.$scope.$watch(() => this.miniGuideVisible, newValue => {
                        this.$rootScope.$broadcast('player-control:guide-toggled', {isVisible: newValue});
                        this.ariaAnnouncement = '';
                        if (newValue === true) {
                            this.setAriaAnnouncement('Mini Guide Opened');
                        }
                        this.$scope.$evalAsync();
                    });
                }

                $onChanges(changes) {
                    if (changes.player) {
                        if (angular.isDefined(this.player)) {
                            if (!this.waitForPlayer) {
                                this.waitForPlayer = this.$q.defer();
                            }
                            this.waitForPlayer.resolve();
                        }
                    }
                }

                $onDestroy() {
                    this.miniGuideData.onPlayerDestroyed();
                    this.eventSubscriptions.forEach(sub => sub());

                    if (this.playerSubscriptions) {
                        Object.keys(this.playerSubscriptions)
                            .forEach(key => this.player.off(key, this.playerSubscriptions[key]));
                    }

                    if (this.retryPromise) {
                        this.$timeout.cancel(this.retryPromise);
                    }
                }

                isParentalControlsEnabled() {
                    this.parentalControlsService.isParentalControlsDisabledForClient()
                        .then(isDisabled => this.parentalControlsEnabled = !isDisabled);

                    this.eventSubscriptions[this.eventSubscriptions.length] = this.$rootScope.$on(
                        'player:parentalControlsUnblocked',
                        () => this.parentalControlsEnabled = false);
                }

                isPrevious (event) {
                    return [keys.up, keys.left].indexOf(event.keyCode) > -1;
                }

                isNext (event) {
                    return [keys.down, keys.right].indexOf(event.keyCode) > -1;
                }

                channelBrowserKeyDown(event) {
                    if ([keys.up, keys.down, keys.enter,
                        keys.space, keys.left, keys.right].indexOf(event.keyCode) > -1) {
                        // This is to stop the default scrolling of the mini guide.
                        event.preventDefault();
                        var childElement = this.$element.find('.selected'),
                            selectedElement = {},
                            selectedElementBounds,
                            elementBounds;

                        // When user selects the channel from the mini guide.
                        if (event.keyCode === keys.enter) {
                            if (this.focusedChannel === this.selectedChannel &&
                                this.selectedChannel.isParentallyBlocked) {
                                this.$rootScope.$emit('player:focusUnblock');
                            } else if (this.focusedChannel === this.selectedChannel &&
                                this.focusedChannel.hasLinkedVODAsset) {
                                this.setAriaAnnouncement('Restarting Show');
                                //give time for announcement
                                this.$timeout(() => {
                                    this.startOver(this.selectedChannel);
                                }, 500);
                            } else {
                                this.selectChannel(this.focusedChannel);
                            }
                        } else if (this.isNext(event))  {
                            selectedElement = childElement.next('[selectable]');
                            if (selectedElement.length > 0) {
                                selectedElementBounds = selectedElement[0].getBoundingClientRect();
                                elementBounds = this.$element[0].getBoundingClientRect();
                                if (selectedElementBounds.top + selectedElementBounds.height >
                                    (elementBounds.height + elementBounds.top)) {
                                    this.$element.scrollTop(this.$element.scrollTop() + selectedElementBounds.height);
                                }
                            } else {
                                // When user reachea at the bottom of the screen using keyboard then
                                // load more elements.
                                this.throttledScrollingFn('scrollDown');
                            }
                        } else if (this.isPrevious(event)) {
                            selectedElement = childElement.prev('[selectable]');
                            if (selectedElement.length > 0) {
                                selectedElementBounds = selectedElement[0].getBoundingClientRect();
                                elementBounds = this.$element[0].getBoundingClientRect();
                                if (selectedElementBounds.bottom <= elementBounds.top) {
                                    this.$element.scrollTop(this.$element.scrollTop() - selectedElementBounds.height);
                                }
                            } else {
                                // When user reachea at the top of the screen using keyboard then
                                // load more elements.
                                this.throttledScrollingFn();
                            }
                        }
                        if (selectedElement.length > 0) {
                            childElement.blur();
                            selectedElement.focus();
                        }
                    }
                }

                //could be a directive
                sortOnKeyDown(event, sort) {
                    if (event.keyCode === keys.enter || event.keyCode === keys.space) {
                        this.selectedSort = sort;
                        if (!this.isAccessibilityEnabled) {
                            this.setFocusOnChannelFromFilterSelection();
                            this.onSortChanged();
                            const name = this.selectedSort.name.replace('-', ' through ');
                            this.setAriaAnnouncement('Sort Changed to: ' + name);
                        }
                    } else if (this.isNext(event)) {
                        event.preventDefault();
                        this.$element.find('#sort-' + (this.sorts.indexOf(this.focusedSort) + 1)).focus();
                    } else if (this.isPrevious(event)) {
                        event.preventDefault();
                        this.$element.find('#sort-' + (this.sorts.indexOf(this.focusedSort) - 1)).focus();
                    }
                }

                onSortFocus(sort) {
                    this.focusedSort = sort;
                    this.sortAria = sort.name.replace('-', ' through ');
                }

                filterLabelKeyDown(event) {
                    if (event.keyCode === keys.tab && !event.shiftKey) {
                        if (!this.filtersVisible) {
                            event.preventDefault();
                            this.setFocusOnChannelFromFilterSelection();
                        }
                    } else if ([keys.space, keys.enter].indexOf(event.keyCode) > -1) {
                        event.preventDefault();
                        this.filtersVisible = !this.filtersVisible;
                    }
                }

                filterOnKeyDown(event, filter) {
                    if (event.keyCode === keys.enter || event.keyCode === keys.space) {
                        this.selectedFilter = filter;
                        if (!this.isAccessibilityEnabled) {
                            this.setFocusOnChannelFromFilterSelection();
                            this.onFilterChanged();
                            this.setAriaAnnouncement('Filter Changed to: ' + this.selectedFilter.name);
                        }
                    } else if (this.isNext(event)) {
                        event.preventDefault();
                        this.$element.find('#filter-' + (this.filters.indexOf(this.focusedFilter) + 1)).focus();
                    }  else if (this.isPrevious(event)) {
                        event.preventDefault();
                        this.$element.find('#filter-' + (this.filters.indexOf(this.focusedFilter) - 1)).focus();
                    }
                }

                filterCancelKeyDown(event) {
                    if (event.keyCode === keys.tab && !event.shiftKey) {
                        this.filtersVisible = !this.filtersVisible;
                    }
                }

                onFilterFocus(filter) {
                    this.focusedFilter = filter;
                }

                registerCallbacks() {
                    return this.waitForPlayer.promise
                        .then(() => {
                            this.playerSubscriptions = {
                                'player-mouse-down': () => this.onPlayerMouseDown(),
                                'error': (error) => this.onVideoPlayerError(error)
                            };

                            Object.keys(this.playerSubscriptions)
                                .forEach(key => this.player.on(key, this.playerSubscriptions[key]));

                            let playSelectedChannelHandler = this.playSelectedChannel.bind(this);
                            let onEanHandler = this.onEan.bind(this);
                            this.$scope.$on('player:blockChanged', playSelectedChannelHandler);
                            this.$rootScope.$on('EAN:start', onEanHandler);
                        });
                }

                setFocusOnChannelFromFilterSelection(options) {
                    options = options || {};
                    const channel = this.filteredChannels.indexOf(this.selectedChannel) < 0 ?
                        this.filteredChannels[0] : this.selectedChannel;
                    this.scrollToChannel(channel)
                        .then(() => {
                            if (!options.noFocus) {
                                this.focusChannel(channel);
                            }
                        });
                }

                showMiniGuide($event) {
                    if (!this.miniGuideVisible) {
                        this.miniGuideVisible = true;
                        if ($event) {
                            $event.preventDefault();
                        }
                    }
                    this.playerControlTimer.scheduleHide();
                }

                onPlayerMouseDown() {
                    //set focus on dummy element so next tab is filters
                    this.playerMouseDown = true;
                    angular.element('#player-mouse-down-focus')[0].focus();
                    this.playerMouseDown = false;
                    this.miniGuideVisible = !this.miniGuideVisible;
                }

                onChannelFocussed(channel) {
                    this.focusedChannel = channel;
                }

                setAriaAnnouncement(data) {
                    this.ariaAnnouncement = data;
                    //clearing the aria announcement after giving time for announcements
                    //This is required for NGC-6039 where subsequent announcements are messed up
                    //if this is not cleared up.
                    this.$timeout(() => {
                        this.ariaAnnouncement = '';
                    }, 500);
                }

                selectChannel(channel, evt) {
                    if (this.selectedChannel !== channel) {

                        // If no initial channel, assume the application is automatically
                        // selecting the channel. In all other cases, assume the user chose.
                        this.channelSelectedBy = ('undefined' === typeof this.selectedChannel ? 'application' : 'user');
                        this.focusedChannel = channel;
                        this.selectedChannel = channel;

                        // Analytics (Should only emit when user clicks, not when app auto-selects)
                        if (evt && this.channelSelectedBy === 'user') {

                            this.$rootScope.$emit('Analytics:select-channel', {
                                channel: channel,
                                triggeredBy: this.channelSelectedBy
                            });
                        }

                        this.playSelectedChannel();
                    }
                }

                onFilterOrSortChanged() {
                    //don't set focus on current channel when filter/sorts are changed and set focus on
                    //filter label.
                    this.setFocusOnChannelFromFilterSelection({noFocus: this.isAccessibilityEnabled});
                    this.filtersVisible = !this.filtersVisible;
                    this.lastScrollPosition = 0;
                }

                onFilterChanged() {
                    if (!this.isAccessibilityEnabled) {
                        // Added this check to prevent this event from sending twice to
                        // EG in case of Flash UI as we have already send it from
                        // `VideoJSOutboundEvent.as`.
                        this.currentAppliedFilter = this.selectedFilter;
                        this.player.trigger('channel-filter-changed', this.selectedFilter);
                        this.miniGuideData.setSelectedFilter(this.selectedFilter);
                        this.onFilterOrSortChanged();

                        // Analytics:
                        this.$rootScope.$broadcast('Analytics:guide:updateFilter', {
                            filter: this.currentAppliedFilter
                        });
                    }
                }

                onCancel() {
                    //onCancel is only invoked when accessibility is enabled
                    //so added this as a guard
                    if (this.isAccessibilityEnabled) {
                        this.filtersVisible = !this.filtersVisible;
                        //Reset sort & filter
                        this.selectedSort = this.currentAppliedSort;
                        this.selectedFilter = this.currentAppliedFilter;
                        //Set focus back on filter label
                        angular.element('.filter-selection').focus();
                    }
                }

                onApply() {
                    //onApply is only invoked when accessibility is enabled
                    //so added this as a guard
                    if (this.isAccessibilityEnabled) {
                        if (this.selectedSort !== this.currentAppliedSort) {
                            //Sort has changed
                            this.miniGuideData.setSelectedSort(this.selectedSort);
                            this.player.trigger('channel-filter-changed', this.selectedFilter);

                            // Analytics:
                            this.$rootScope.$broadcast('Analytics:guide:updateSort', {
                                sort: this.selectedSort
                            });
                        }

                        if (this.selectedFilter !== this.currentAppliedFilter) {
                            //Filter has changed
                            this.player.trigger('channel-sortby-changed', this.selectedSort.egName);
                            this.miniGuideData.setSelectedFilter(this.selectedFilter);

                            // Analytics:
                            this.$rootScope.$broadcast('Analytics:guide:updateFilter', {
                                filter: this.selectedFilter
                            });
                        }
                        this.currentAppliedSort = this.selectedSort;
                        this.currentAppliedFilter = this.selectedFilter;
                        this.onFilterOrSortChanged();
                        //Set focus back on filter label
                        angular.element('.filter-selection').focus();
                    }
                }

                getFilterName(filter) {
                    let name = filter.name;
                    if (filter.channelCount !== undefined) {
                        name += ` (${filter.channelCount})`;
                    }
                    return name;
                }
                getFilterNameForAria(filter) {
                    let name = filter.name;
                    if (filter.channelCount !== undefined) {
                        name += `, ${filter.channelCount}`;
                    }
                    return name;
                }

                onSortChanged() {
                    if (!this.isAccessibilityEnabled) {
                        // Added this check to prevent this event from sending twice to
                        // EG in case of Flash UI as we have already send it from
                        // `VideoJSOutboundEvent.as`.
                        this.currentAppliedFilter = this.selectedFilter;
                        this.player.trigger('channel-sortby-changed', this.selectedSort.egName);
                        this.miniGuideData.setSelectedSort(this.selectedSort);
                        this.onFilterOrSortChanged();

                        // Analytics:
                        this.$rootScope.$broadcast('Analytics:guide:updateSort', {
                            sort: this.selectedSort
                        });
                    }
                }

                startOver(channel) {
                    let program = channel.asset;
                    let channelNumber = channel.localChannelNumber;
                    if (channelNumber !== undefined) {
                        this.ovpStorage.setItem('twctv:startOverChannelInfo', JSON.stringify({
                            channelNumber: channelNumber,
                            channelID: channel.channelId
                        }));
                    }

                    if (program) {
                        let seriesId = program.vodTmsSeriesId;
                        let vodProviderAssetId = program.vodProviderAssetId;
                        let state, params;
                        if (seriesId) {
                            state = 'ovp.ondemand.playEpisodeWithDetails';
                            params = {
                                seriesID: seriesId,
                                episodeID: vodProviderAssetId
                            };
                        } else {
                            state = 'ovp.ondemand.playProduct';
                            params = {
                                productID: vodProviderAssetId
                            };
                        }
                        params.startOver = true;
                        this.$state.go(state, params);
                    } else {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WGE-1001'),
                            buttonText: 'OK'
                        });
                    }
                }

                isEANChannel(channel) {
                    return channel && channel.localChannelNumber === this.config.eanChannelNumber;
                }

                /**
                 * Loads channel data. Doesn't attempt to insert it into the player, so this function
                 * can safely be run while the player is still initializing
                 * @return {[type]} [description]
                 */
                loadChannelData() {
                    return this.miniGuideData.getData(this.liveTmsId, this.eanUrl)
                        .then(data => {
                            this.channels = data.channels;
                            this.filters = data.filters;
                            this.sorts = data.sorts;
                            this.filteredChannels = data.filteredChannels;
                            this.selectedSort = data.selectedSort; //Keeps track of selected sort by radio
                            this.currentAppliedSort = data.selectedSort; //Keeps track of current applied sort
                            this.selectedFilter = data.selectedFilter; //Keeps track of selected filter by radio
                            this.currentAppliedFilter = data.selectedFilter; //Keeps track of current applied filter
                            //TODO: whether or not filters are allowed (Based on location and config)
                            return data.selectedChannel;
                        });
                }

                onEan(event, {eanUrl}) {
                    this.eanUrl = eanUrl;
                    this.selectChannel(this.miniGuideData.addDummyEANChannel(eanUrl));
                }

                playSelectedChannel() {
                    if (this.isEANChannel(this.selectedChannel)) {
                        return this.playEan();
                    } else {
                        if (this.onEanCompletion) {
                            this.onEanCompletion();
                        }
                        // start the channelUpdateTimer even if we have not been able to play the asset,
                        // so that if user decides to still be on the channel,
                        // we can try to play the new asset when current asset ends.
                        this.miniGuideData.startChannelUpdateTimer(this.selectedChannel);
                        return this.playerStreamService.playChannel({
                                player: this.player,
                                channel: this.selectedChannel,
                                triggeredBy: this.channelSelectedBy})
                            .then(() => {
                                this.miniGuideData.setSelectedChannel(this.selectedChannel);
                            }).catch(err => this.onPlayChannelError(err));
                    }
                }

                playEan() {
                    let promise = this.playerStreamService.playEAN({player: this.player, eanUrl: this.eanUrl})
                        .then(() => {
                            let wasMuted = this.ovpStorage.getItem(this.storageKeys.muted);
                            this.player.setMuted(false);
                            this.onEanCompletion = function (event) {
                                this.player.setMuted(wasMuted);
                                if (event) {
                                    this.selectChannel(this.miniGuideData.getDefaultChannel(this.liveTmsId));
                                }

                                this.player.off('playback-stopped', this.onEanCompletion);
                                this.onEanCompletion = undefined;

                                this.miniGuideData.removeDummyEANChannel();
                            };
                            this.player.on('playback-stopped', this.onEanCompletion);
                        })
                        .catch(err => this.onPlayChannelError(err));

                    this.eanUrl = undefined;

                    return promise;
                }

                onPlayChannelError(error) {
                    if (error == this.playerErrors.tunedAway || error == this.playerErrors.oohFraudDetection) {
                        return;
                    } else if (error == this.playerErrors.outOfHome) {
                        this.locationService.resetCache();
                        this.onUnavailableChannelSelected();
                    } else if (error == this.playerErrors.unentitled) {
                        this.alert.open(this.errorCodesService.getAlertForCode('WEN-1004', {
                            IVR_NUMBER: this.config.ivrNumber
                        }));
                    } else if (error == this.playerErrors.notFound) {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WCH-1000', {
                                CHANNEL: this.selectedChannel.localChannelNumber
                            }),
                            buttonText: 'OK'
                        });
                    } else {
                        this.alert.open({
                            message: this.errorCodesService.getMessageForCode('WGE-1001'),
                            buttonText: 'OK'
                        });
                    }
                }

                onUnavailableChannelSelected() {
                    this.alert.open(this.errorCodesService.getAlertForCode('WLC-1000'));
                }

                onVideoPlayerError(error) {
                    let codes = this.TWCVideoJS.FlashVideoPlayer.playerErrorCodes;
                    if (error.errorID === codes.STREAMING_FAILED_ERROR) {
                        this.$rootScope.$emit('Analytics:playbackFailure', {
                            asset: this.selectedChannel.asset,
                            cause: error,
                            errorCode: 'WVP-3305',
                            errorMessage: this.errorCodesService.getMessageForCode('WVP-3305')
                        });
                        // Reset locationService cache in the hopes that the failure was due to a network change
                        this.locationService.resetCache();

                        // Retry in 20 seconds
                        this.retryPromise = this.$timeout(() => {
                            this.playSelectedChannel();
                            this.retryPromise = undefined;
                        }, 20000);
                    } else if (error.title && error.message) {
                        this.playerService.showErrorAlert(error, this.selectedChannel.asset);
                    }
                }

                scrollToChannel(channel) {
                    // Timeout needed to ensure channel dom nodes have been rendered
                    return this.$timeout(() => {
                        const index = this.filteredChannels.indexOf(channel);
                        if (index < 0) {
                            return;
                        }

                        const container = this.$element.find('#channel-browser');
                        const channelHeight = this.$element.find('.channel-list-item').outerHeight();
                        const channelsPerViewport = container.height() / channelHeight;
                        const scrollOffset = channelHeight * (index - Math.floor(channelsPerViewport / 2));

                        container.scrollTop(scrollOffset);
                    }, 0);
                }


                focusChannel(channel, doNotScroll = false) {
                    // Timeout needed to ensure channel dom nodes have been rendered
                    this.$timeout(() => {
                        const index = this.filteredChannels.indexOf(channel);
                        if (index < 0) {
                            return;
                        }

                        const id = `#channel-list-item-${channel.localChannelNumber}-${channel.channelId}`;
                        const el = this.$element.find(id);
                        if (el.length > 0) {
                            el.focus();
                            this.firstFocusedChannel = channel;
                        } else if (!doNotScroll) {
                            // Since we use a virtual repeat, the element only exists if it's in the viewport
                            this.scrollToChannel(channel)
                                .then(() => this.focusChannel(channel, true));
                        }
                    }, 0);
                }
            }
        });
})();
