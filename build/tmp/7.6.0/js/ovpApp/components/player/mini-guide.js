/*jshint -W072 */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    var keys = { up: 38, down: 40, tab: 9, enter: 13, space: 32, right: 39, left: 37 };

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
    angular.module('ovpApp.playerControls.miniGuide', ['ovpApp.player', 'ovpApp.player.whatsOn', 'ovpApp.player.streamService', 'ovpApp.playerControls.miniGuideData', 'ovpApp.config', 'ovpApp.services.ovpStorage', 'ovpApp.services.parentalControlsService', 'ovpApp.services.errorCodes', 'ovpApp.services.profileService', 'ovpApp.components.alert', 'ovpApp.services.locationService', 'ovpApp.messages', 'ovpApp.video', 'ovpApp.version', 'ovpApp.directives.lazySrc', 'ajoslin.promise-tracker', 'ovpApp.services.rxUtils', 'vs-repeat', 'ovpApp.oauth']).component('miniGuide', {
        bindings: {
            player: '<',
            liveTmsId: '<',
            eanUrl: '<'
        },
        templateUrl: '/js/ovpApp/components/player/mini-guide.html',
        controller: (function () {
            /* @ngInject */

            MiniGuide.$inject = ["$scope", "$q", "playerStreamService", "config", "miniGuideData", "ovpStorage", "$state", "parentalControlsService", "profileService", "CAPABILITIES", "alert", "locationService", "messages", "TWCVideoJS", "playerErrors", "$timeout", "$rootScope", "version", "$element", "promiseTracker", "playerControlTimer", "createObservableFunction", "storageKeys", "playerService", "errorCodesService", "OauthDataManager"];
            function MiniGuide($scope, $q, playerStreamService, config, miniGuideData, ovpStorage, $state, parentalControlsService, profileService, CAPABILITIES, alert, locationService, messages, TWCVideoJS, playerErrors, $timeout, $rootScope, version, $element, promiseTracker, playerControlTimer, createObservableFunction, storageKeys, playerService, errorCodesService, OauthDataManager) {
                _classCallCheck(this, MiniGuide);

                angular.extend(this, { $scope: $scope, $q: $q, playerStreamService: playerStreamService, config: config, miniGuideData: miniGuideData,
                    ovpStorage: ovpStorage, $state: $state, parentalControlsService: parentalControlsService, profileService: profileService, CAPABILITIES: CAPABILITIES, alert: alert,
                    locationService: locationService, messages: messages, TWCVideoJS: TWCVideoJS, playerErrors: playerErrors, $timeout: $timeout, $rootScope: $rootScope, version: version, $element: $element,
                    promiseTracker: promiseTracker, playerControlTimer: playerControlTimer, createObservableFunction: createObservableFunction, storageKeys: storageKeys, playerService: playerService,
                    errorCodesService: errorCodesService, OauthDataManager: OauthDataManager });
            }

            _createClass(MiniGuide, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

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

                    this.profileService.isAccessibilityEnabled().then(function (isEnabled) {
                        //No need to track changes to accessibility capability change
                        //as app will get reloaded when accessibility mode changes
                        _this.isAccessibilityEnabled = isEnabled;
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
                    var scrollThreshold = 500;

                    var promise = this.$q.all([this.loadChannelData(), this.registerCallbacks()]).then(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 1);

                        var initialChannel = _ref2[0];

                        _this.selectChannel(initialChannel);
                        _this.scrollToChannel(_this.selectedChannel);
                        _this.showMiniGuide();
                        _this.isParentalControlsEnabled();
                    });

                    this.loadingTracker.addPromise(promise);

                    this.eventSubscriptions[this.eventSubscriptions.length] = this.$rootScope.$on('scrollable:scrolled', function (evt, element) {
                        var filteredLastChannelNumber = undefined,
                            limitLastChannelNumber = undefined;
                        var scrollTop = element.scrollTop();
                        var limitLastChildElement = angular.element(element[0].lastElementChild).find('.channel-number');

                        if (_this.filteredChannels.length > 0 && limitLastChildElement && limitLastChildElement.length > 0) {
                            filteredLastChannelNumber = _this.filteredChannels[_this.filteredChannels.length - 1].localChannelNumber;
                            limitLastChannelNumber = parseInt(limitLastChildElement[0].innerHTML);
                        }
                        // We need to scroll down.
                        if (scrollTop > _this.lastScrollPosition) {
                            // When we have reached the bottom of the mini guide then load more elements.
                            if (scrollTop + element.innerHeight() >= element[0].scrollHeight) {
                                if (limitLastChannelNumber != filteredLastChannelNumber) {
                                    _this.throttledScrollingFn('scrollDown');
                                }
                            }
                        } else {
                            // We need to scroll up.
                            if (scrollTop <= 0) {
                                if (_this.begin > 0) {
                                    _this.throttledScrollingFn();
                                    // So that user can scroll again if the channels are
                                    // still pending at the top.
                                    element.scrollTop(scrollThreshold);
                                }
                            }
                        }
                        _this.lastScrollPosition = scrollTop;
                    });

                    this.eventSubscriptions[this.eventSubscriptions.length] = this.$rootScope.$on('connectivityService:statusChanged', function (e, isOnline) {
                        if (isOnline) {
                            _this.loadChannelData();
                        }
                    });

                    this.$scope.$on('player-control:click', function () {
                        _this.onPlayerMouseDown();
                    });

                    this.$scope.$on('player-control:hide', function () {
                        _this.miniGuideVisible = false;
                    });

                    this.$scope.$on('player:fullscreen-toggled', function (event, data) {
                        if (data.isEnabled) {
                            _this.miniGuideVisible = false;
                        }
                    });

                    this.$scope.$watch(function () {
                        return _this.miniGuideVisible;
                    }, function (newValue) {
                        _this.$rootScope.$broadcast('player-control:guide-toggled', { isVisible: newValue });
                        _this.ariaAnnouncement = '';
                        if (newValue === true) {
                            _this.setAriaAnnouncement('Mini Guide Opened');
                        }
                        _this.$scope.$evalAsync();
                    });
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.player) {
                        if (angular.isDefined(this.player)) {
                            if (!this.waitForPlayer) {
                                this.waitForPlayer = this.$q.defer();
                            }
                            this.waitForPlayer.resolve();
                        }
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    var _this2 = this;

                    this.miniGuideData.onPlayerDestroyed();
                    this.eventSubscriptions.forEach(function (sub) {
                        return sub();
                    });

                    if (this.playerSubscriptions) {
                        Object.keys(this.playerSubscriptions).forEach(function (key) {
                            return _this2.player.off(key, _this2.playerSubscriptions[key]);
                        });
                    }

                    if (this.retryPromise) {
                        this.$timeout.cancel(this.retryPromise);
                    }
                }
            }, {
                key: 'isParentalControlsEnabled',
                value: function isParentalControlsEnabled() {
                    var _this3 = this;

                    this.parentalControlsService.isParentalControlsDisabledForClient().then(function (isDisabled) {
                        return _this3.parentalControlsEnabled = !isDisabled;
                    });

                    this.eventSubscriptions[this.eventSubscriptions.length] = this.$rootScope.$on('player:parentalControlsUnblocked', function () {
                        return _this3.parentalControlsEnabled = false;
                    });
                }
            }, {
                key: 'isPrevious',
                value: function isPrevious(event) {
                    return [keys.up, keys.left].indexOf(event.keyCode) > -1;
                }
            }, {
                key: 'isNext',
                value: function isNext(event) {
                    return [keys.down, keys.right].indexOf(event.keyCode) > -1;
                }
            }, {
                key: 'channelBrowserKeyDown',
                value: function channelBrowserKeyDown(event) {
                    var _this4 = this;

                    if ([keys.up, keys.down, keys.enter, keys.space, keys.left, keys.right].indexOf(event.keyCode) > -1) {
                        // This is to stop the default scrolling of the mini guide.
                        event.preventDefault();
                        var childElement = this.$element.find('.selected'),
                            selectedElement = {},
                            selectedElementBounds,
                            elementBounds;

                        // When user selects the channel from the mini guide.
                        if (event.keyCode === keys.enter) {
                            if (this.focusedChannel === this.selectedChannel && this.selectedChannel.isParentallyBlocked) {
                                this.$rootScope.$emit('player:focusUnblock');
                            } else if (this.focusedChannel === this.selectedChannel && this.focusedChannel.hasLinkedVODAsset) {
                                this.setAriaAnnouncement('Restarting Show');
                                //give time for announcement
                                this.$timeout(function () {
                                    _this4.startOver(_this4.selectedChannel);
                                }, 500);
                            } else {
                                this.selectChannel(this.focusedChannel);
                            }
                        } else if (this.isNext(event)) {
                            selectedElement = childElement.next('[selectable]');
                            if (selectedElement.length > 0) {
                                selectedElementBounds = selectedElement[0].getBoundingClientRect();
                                elementBounds = this.$element[0].getBoundingClientRect();
                                if (selectedElementBounds.top + selectedElementBounds.height > elementBounds.height + elementBounds.top) {
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
            }, {
                key: 'sortOnKeyDown',
                value: function sortOnKeyDown(event, sort) {
                    if (event.keyCode === keys.enter || event.keyCode === keys.space) {
                        this.selectedSort = sort;
                        if (!this.isAccessibilityEnabled) {
                            this.setFocusOnChannelFromFilterSelection();
                            this.onSortChanged();
                            var _name = this.selectedSort.name.replace('-', ' through ');
                            this.setAriaAnnouncement('Sort Changed to: ' + _name);
                        }
                    } else if (this.isNext(event)) {
                        event.preventDefault();
                        this.$element.find('#sort-' + (this.sorts.indexOf(this.focusedSort) + 1)).focus();
                    } else if (this.isPrevious(event)) {
                        event.preventDefault();
                        this.$element.find('#sort-' + (this.sorts.indexOf(this.focusedSort) - 1)).focus();
                    }
                }
            }, {
                key: 'onSortFocus',
                value: function onSortFocus(sort) {
                    this.focusedSort = sort;
                    this.sortAria = sort.name.replace('-', ' through ');
                }
            }, {
                key: 'filterLabelKeyDown',
                value: function filterLabelKeyDown(event) {
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
            }, {
                key: 'filterOnKeyDown',
                value: function filterOnKeyDown(event, filter) {
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
                    } else if (this.isPrevious(event)) {
                        event.preventDefault();
                        this.$element.find('#filter-' + (this.filters.indexOf(this.focusedFilter) - 1)).focus();
                    }
                }
            }, {
                key: 'filterCancelKeyDown',
                value: function filterCancelKeyDown(event) {
                    if (event.keyCode === keys.tab && !event.shiftKey) {
                        this.filtersVisible = !this.filtersVisible;
                    }
                }
            }, {
                key: 'onFilterFocus',
                value: function onFilterFocus(filter) {
                    this.focusedFilter = filter;
                }
            }, {
                key: 'registerCallbacks',
                value: function registerCallbacks() {
                    var _this5 = this;

                    return this.waitForPlayer.promise.then(function () {
                        _this5.playerSubscriptions = {
                            'player-mouse-down': function playerMouseDown() {
                                return _this5.onPlayerMouseDown();
                            },
                            'error': function error(_error) {
                                return _this5.onVideoPlayerError(_error);
                            }
                        };

                        Object.keys(_this5.playerSubscriptions).forEach(function (key) {
                            return _this5.player.on(key, _this5.playerSubscriptions[key]);
                        });

                        var playSelectedChannelHandler = _this5.playSelectedChannel.bind(_this5);
                        var onEanHandler = _this5.onEan.bind(_this5);
                        _this5.$scope.$on('player:blockChanged', playSelectedChannelHandler);
                        _this5.$rootScope.$on('EAN:start', onEanHandler);
                    });
                }
            }, {
                key: 'setFocusOnChannelFromFilterSelection',
                value: function setFocusOnChannelFromFilterSelection(options) {
                    var _this6 = this;

                    options = options || {};
                    var channel = this.filteredChannels.indexOf(this.selectedChannel) < 0 ? this.filteredChannels[0] : this.selectedChannel;
                    this.scrollToChannel(channel).then(function () {
                        if (!options.noFocus) {
                            _this6.focusChannel(channel);
                        }
                    });
                }
            }, {
                key: 'showMiniGuide',
                value: function showMiniGuide($event) {
                    if (!this.miniGuideVisible) {
                        this.miniGuideVisible = true;
                        if ($event) {
                            $event.preventDefault();
                        }
                    }
                    this.playerControlTimer.scheduleHide();
                }
            }, {
                key: 'onPlayerMouseDown',
                value: function onPlayerMouseDown() {
                    //set focus on dummy element so next tab is filters
                    this.playerMouseDown = true;
                    angular.element('#player-mouse-down-focus')[0].focus();
                    this.playerMouseDown = false;
                    this.miniGuideVisible = !this.miniGuideVisible;
                }
            }, {
                key: 'onChannelFocussed',
                value: function onChannelFocussed(channel) {
                    this.focusedChannel = channel;
                }
            }, {
                key: 'setAriaAnnouncement',
                value: function setAriaAnnouncement(data) {
                    var _this7 = this;

                    this.ariaAnnouncement = data;
                    //clearing the aria announcement after giving time for announcements
                    //This is required for NGC-6039 where subsequent announcements are messed up
                    //if this is not cleared up.
                    this.$timeout(function () {
                        _this7.ariaAnnouncement = '';
                    }, 500);
                }
            }, {
                key: 'selectChannel',
                value: function selectChannel(channel, evt) {
                    if (this.selectedChannel !== channel) {

                        // If no initial channel, assume the application is automatically
                        // selecting the channel. In all other cases, assume the user chose.
                        this.channelSelectedBy = 'undefined' === typeof this.selectedChannel ? 'application' : 'user';
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
            }, {
                key: 'onFilterOrSortChanged',
                value: function onFilterOrSortChanged() {
                    //don't set focus on current channel when filter/sorts are changed and set focus on
                    //filter label.
                    this.setFocusOnChannelFromFilterSelection({ noFocus: this.isAccessibilityEnabled });
                    this.filtersVisible = !this.filtersVisible;
                    this.lastScrollPosition = 0;
                }
            }, {
                key: 'onFilterChanged',
                value: function onFilterChanged() {
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
            }, {
                key: 'onCancel',
                value: function onCancel() {
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
            }, {
                key: 'onApply',
                value: function onApply() {
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
            }, {
                key: 'getFilterName',
                value: function getFilterName(filter) {
                    var name = filter.name;
                    if (filter.channelCount !== undefined) {
                        name += ' (' + filter.channelCount + ')';
                    }
                    return name;
                }
            }, {
                key: 'getFilterNameForAria',
                value: function getFilterNameForAria(filter) {
                    var name = filter.name;
                    if (filter.channelCount !== undefined) {
                        name += ', ' + filter.channelCount;
                    }
                    return name;
                }
            }, {
                key: 'onSortChanged',
                value: function onSortChanged() {
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
            }, {
                key: 'startOver',
                value: function startOver(channel) {
                    var program = channel.asset;
                    var channelNumber = channel.localChannelNumber;
                    if (channelNumber !== undefined) {
                        this.ovpStorage.setItem('twctv:startOverChannelInfo', JSON.stringify({
                            channelNumber: channelNumber,
                            channelID: channel.channelId
                        }));
                    }

                    if (program) {
                        var seriesId = program.vodTmsSeriesId;
                        var vodProviderAssetId = program.vodProviderAssetId;
                        var state = undefined,
                            params = undefined;
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
            }, {
                key: 'isEANChannel',
                value: function isEANChannel(channel) {
                    return channel && channel.localChannelNumber === this.config.eanChannelNumber;
                }

                /**
                 * Loads channel data. Doesn't attempt to insert it into the player, so this function
                 * can safely be run while the player is still initializing
                 * @return {[type]} [description]
                 */
            }, {
                key: 'loadChannelData',
                value: function loadChannelData() {
                    var _this8 = this;

                    return this.miniGuideData.getData(this.liveTmsId, this.eanUrl).then(function (data) {
                        _this8.channels = data.channels;
                        _this8.filters = data.filters;
                        _this8.sorts = data.sorts;
                        _this8.filteredChannels = data.filteredChannels;
                        _this8.selectedSort = data.selectedSort; //Keeps track of selected sort by radio
                        _this8.currentAppliedSort = data.selectedSort; //Keeps track of current applied sort
                        _this8.selectedFilter = data.selectedFilter; //Keeps track of selected filter by radio
                        _this8.currentAppliedFilter = data.selectedFilter; //Keeps track of current applied filter
                        //TODO: whether or not filters are allowed (Based on location and config)
                        return data.selectedChannel;
                    });
                }
            }, {
                key: 'onEan',
                value: function onEan(event, _ref3) {
                    var eanUrl = _ref3.eanUrl;

                    this.eanUrl = eanUrl;
                    this.selectChannel(this.miniGuideData.addDummyEANChannel(eanUrl));
                }
            }, {
                key: 'playSelectedChannel',
                value: function playSelectedChannel() {
                    var _this9 = this;

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
                            triggeredBy: this.channelSelectedBy }).then(function () {
                            _this9.miniGuideData.setSelectedChannel(_this9.selectedChannel);
                        })['catch'](function (err) {
                            return _this9.onPlayChannelError(err);
                        });
                    }
                }
            }, {
                key: 'playEan',
                value: function playEan() {
                    var _this10 = this;

                    var promise = this.playerStreamService.playEAN({ player: this.player, eanUrl: this.eanUrl }).then(function () {
                        var wasMuted = _this10.ovpStorage.getItem(_this10.storageKeys.muted);
                        _this10.player.setMuted(false);
                        _this10.onEanCompletion = function (event) {
                            this.player.setMuted(wasMuted);
                            if (event) {
                                this.selectChannel(this.miniGuideData.getDefaultChannel(this.liveTmsId));
                            }

                            this.player.off('playback-stopped', this.onEanCompletion);
                            this.onEanCompletion = undefined;

                            this.miniGuideData.removeDummyEANChannel();
                        };
                        _this10.player.on('playback-stopped', _this10.onEanCompletion);
                    })['catch'](function (err) {
                        return _this10.onPlayChannelError(err);
                    });

                    this.eanUrl = undefined;

                    return promise;
                }
            }, {
                key: 'onPlayChannelError',
                value: function onPlayChannelError(error) {
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
            }, {
                key: 'onUnavailableChannelSelected',
                value: function onUnavailableChannelSelected() {
                    this.alert.open(this.errorCodesService.getAlertForCode('WLC-1000'));
                }
            }, {
                key: 'onVideoPlayerError',
                value: function onVideoPlayerError(error) {
                    var _this11 = this;

                    var codes = this.TWCVideoJS.FlashVideoPlayer.playerErrorCodes;
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
                        this.retryPromise = this.$timeout(function () {
                            _this11.playSelectedChannel();
                            _this11.retryPromise = undefined;
                        }, 20000);
                    } else if (error.title && error.message) {
                        this.playerService.showErrorAlert(error, this.selectedChannel.asset);
                    }
                }
            }, {
                key: 'scrollToChannel',
                value: function scrollToChannel(channel) {
                    var _this12 = this;

                    // Timeout needed to ensure channel dom nodes have been rendered
                    return this.$timeout(function () {
                        var index = _this12.filteredChannels.indexOf(channel);
                        if (index < 0) {
                            return;
                        }

                        var container = _this12.$element.find('#channel-browser');
                        var channelHeight = _this12.$element.find('.channel-list-item').outerHeight();
                        var channelsPerViewport = container.height() / channelHeight;
                        var scrollOffset = channelHeight * (index - Math.floor(channelsPerViewport / 2));

                        container.scrollTop(scrollOffset);
                    }, 0);
                }
            }, {
                key: 'focusChannel',
                value: function focusChannel(channel) {
                    var _this13 = this;

                    var doNotScroll = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                    // Timeout needed to ensure channel dom nodes have been rendered
                    this.$timeout(function () {
                        var index = _this13.filteredChannels.indexOf(channel);
                        if (index < 0) {
                            return;
                        }

                        var id = '#channel-list-item-' + channel.localChannelNumber + '-' + channel.channelId;
                        var el = _this13.$element.find(id);
                        if (el.length > 0) {
                            el.focus();
                            _this13.firstFocusedChannel = channel;
                        } else if (!doNotScroll) {
                            // Since we use a virtual repeat, the element only exists if it's in the viewport
                            _this13.scrollToChannel(channel).then(function () {
                                return _this13.focusChannel(channel, true);
                            });
                        }
                    }, 0);
                }
            }]);

            return MiniGuide;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/mini-guide.js.map
