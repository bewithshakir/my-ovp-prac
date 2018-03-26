'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';

    miniGuideData.$inject = ["ovpStorage", "storageKeys", "whatsOn", "$http", "config", "$q", "locationService", "$rootScope", "parentalControlsService", "$timeout", "$interval", "ALL_CHANNELS_FILTER", "RECENT_HISTORY_FILTER", "AZ_SORT", "CHANNEL_NUMBER_SORT", "profileService"];
    angular.module('ovpApp.playerControls.miniGuideData', ['ovpApp.player.whatsOn', 'ovpApp.services.ovpStorage', 'ovpApp.config', 'ovpApp.services.locationService']).constant('dummyEANAsset', {
        title: 'Emergency Alert',
        isEpisodic: false,
        networkImage: angular.noop,
        imageUri: angular.noop
    }).constant('ALL_CHANNELS_FILTER', {
        name: 'All Channels',
        filter: 'All Channels'
    }).constant('RECENT_HISTORY_FILTER', {
        name: 'Recently Watched',
        filter: 'Recently Watched'
    }).constant('AZ_SORT', {
        name: 'A-Z (networks)',
        id: 'networkAToZ',
        egName: 'network'
    }).constant('CHANNEL_NUMBER_SORT', {
        name: 'Channel Number',
        id: 'channelNumber',
        egName: 'channel'
    }).factory('miniGuideData', miniGuideData);

    /* @ngInject */
    function miniGuideData(ovpStorage, storageKeys, whatsOn, $http, config, $q, locationService, $rootScope, parentalControlsService, $timeout, $interval, ALL_CHANNELS_FILTER, RECENT_HISTORY_FILTER, AZ_SORT, CHANNEL_NUMBER_SORT, profileService) {

        var service = {
            getData: getData,
            getDefaultChannel: getDefaultChannel,
            addDummyEANChannel: addDummyEANChannel,
            removeDummyEANChannel: removeDummyEANChannel,
            setSelectedFilter: setSelectedFilter,
            setSelectedSort: setSelectedSort,
            setSelectedChannel: setSelectedChannel,
            onPlayerDestroyed: onPlayerDestroyed,
            startChannelUpdateTimer: startChannelUpdateTimer,
            _private: {
                //Exposed for unit tests only
                sortAndFilter: sortAndFilter
            }
        };

        var maxRecentHistoryChannels = 10;
        var channels = [],
            filteredChannels = [],
            recent = [],
            filters = [],
            sorts = [];

        var location = undefined,
            isPCDisabled = undefined,
            selectedFilter = undefined,
            selectedSort = undefined,
            selectedChannel = undefined,
            promise = undefined;
        var channelUpdateTimer = undefined,
            lineupUpdateInterval = undefined;

        return service;

        ////////////////

        function getData(desiredChannelId, eanUrl) {
            if (!promise) {
                promise = $q.all([initLocation(), initParentalControls()]).then(initChannels).then(initRecent).then(function () {
                    initSort();
                    initFilters(desiredChannelId);
                    initFilteredChannels();
                    startLineupUpdateInterval();
                    addConnectivityListener();
                });
            }

            return promise.then(function () {
                selectedChannel = getDefaultChannel(desiredChannelId, eanUrl);
                return { channels: channels, filters: filters, sorts: sorts, filteredChannels: filteredChannels, selectedFilter: selectedFilter, selectedSort: selectedSort, selectedChannel: selectedChannel };
            });
        }

        function initLocation() {
            return locationService.getLocation().then(function (loc) {
                location = loc;
                $rootScope.$on('LocationService:locationChanged', onLocationChanged);
            });
        }

        function initParentalControls() {
            return parentalControlsService.isParentalControlsDisabledForClient().then(function (disabled) {
                isPCDisabled = disabled;
                $rootScope.$on('ParentalControls:updated', onParentalControlsChanged);
            });
        }

        function addConnectivityListener() {
            $rootScope.$on('connectivityService:statusChanged', function (event, isOnline) {
                if (isOnline) {
                    whatsOn.now(selectedChannel).then(function (assetOnNow) {
                        if (!assetOnNow) {
                            return;
                        }

                        forceUpdateLineup(assetOnNow, selectedChannel);
                    });
                }
            });
        }

        function onLocationChanged(event, newLocation) {
            if (newLocation === location) {
                return;
            }

            location = newLocation;
            // let filtersAllowed = loc.behindOwnModem || config.showPlayerChannelBrowserFiltersOutOfHome;
            // this.player.showCategoryFilters(filtersAllowed);
            channels.forEach(function (c) {
                return c.available = location.behindOwnModem || c.availableOutOfHome === true;
            });

            updateFilteredChannels();
        }

        function onParentalControlsChanged() {
            parentalControlsService.isParentalControlsDisabledForClient().then(function (disabled) {
                isPCDisabled = disabled;
                updateLineup();
            });
        }

        function onPlayerDestroyed() {
            if (channelUpdateTimer) {
                $timeout.cancel(channelUpdateTimer);
                channelUpdateTimer = undefined;
            }
        }

        function initChannels() {
            whatsOn.lineup(); // Get the lineup downloading in parallel

            var url = config.piHost + config.services.streamingChannels + '?viewParentallyBlocked=true';
            return $http.get(url, { withCredentials: true }).then(function (response) {
                // STVWEB-1868: Display Subscribed Only (Video/Internet Only) - Guide
                if (profileService.isIpOnlyEnabled()) {
                    return response.data.channels.filter(function (chnl) {
                        return chnl.subscribed !== false;
                    });
                }
                return response.data.channels;
            }).then(function (response) {
                replaceArrayContents(channels, response.map(augmentChannelData));
                return whatsOn.nowOrImminent(channels);
            }).then(function (assetsOnNow) {
                var promises = [];
                channels.forEach(function (c, i) {
                    return promises.push(setCurrentAsset(c, assetsOnNow[i]));
                });
                return $q.all(promises);
            }).then(function () {
                return channels;
            });
        }

        function augmentChannelData(channel) {
            if (!channel.channels) {
                channel.channels = [];
            }
            angular.extend(channel, {
                channelId: channel.tmsId,
                channelTitle: channel.networkName,
                available: location.behindOwnModem || channel.availableOutOfHome === true,
                localChannelNumber: channel.channels.length > 0 ? channel.channels[0] : '',
                localChannelNumbers: channel.channels,
                callSign: channel.callSign,
                hasLinkedVODAsset: false,
                isParentallyBlocked: isPCDisabled ? false : channel.parentallyBlocked
            });

            return channel;
        }

        function setCurrentAsset(channel, asset) {
            if (!asset) {
                return $q.resolve(false);
            }

            return asset.isBlocked.then(function (blocked) {
                var newData = {
                    channelTitle: asset.isOnNow ? asset.title : 'On Next: ' + asset.title,
                    episodeTitle: asset.episodeTitle || '',
                    hasLinkedVODAsset: !!asset.vodProviderAssetId,
                    isParentallyBlocked: blocked,
                    networkLogoUri: asset.networkImage({ height: 60 })
                };

                var isNew = false;
                for (var key in newData) {
                    if (newData.hasOwnProperty(key) && newData[key] !== channel[key]) {
                        isNew = true;
                        break;
                    }
                }

                if (isNew) {
                    angular.extend(channel, newData);

                    channel.asset = asset;
                }

                return isNew;
            });
        }

        function getDefaultChannel(desiredChannelId, eanUrl) {
            var channel = undefined;
            // If ean was specified, use it.
            if (eanUrl) {
                return addDummyEANChannel(eanUrl);
            }

            // Otherwise, if a channel was specified, use it
            if (desiredChannelId !== undefined) {
                channel = channels.find(function (c) {
                    return c.tmsId === desiredChannelId;
                });
                if (channel) {
                    return channel;
                }
            }

            var compareFn = profileService.isSpecU() ? function (a, b) {
                return a.available && a.ncsServiceId === b;
            } :
            // We must compare the recent channel list from localChannelNumbers array.
            function (a, b) {
                return a.available && a.localChannelNumbers.indexOf(b) > -1;
            };

            // This will only return the channelNumber/ncsServiceId from recent list.
            for (var i = 0; i < recent.length; i++) {
                channel = channels.find(function (c) {
                    return compareFn(c, recent[i]);
                });
                if (channel && angular.isNumber(channel.localChannelNumber) && channel.localChannelNumber !== recent[i]) {
                    // If a localChannelNumber is not found
                    // compare recent from the list of duplicate channels
                    channel = filteredChannels.find(function (c) {
                        return c.available && c.localChannelNumber === recent[i];
                    });
                }
                if (channel) {
                    return channel;
                }
            }

            // Failing that, find any available channel
            return channel || channels.find(function (c) {
                return c.available;
            });
        }

        /**
         * Initializes filers.
         * Preconditions: channels and recent must have been initialized
         * @return {[type]} [description]
         */
        function initFilters(desiredChannelId) {
            var f = [ALL_CHANNELS_FILTER, RECENT_HISTORY_FILTER, {
                name: 'TV Shows',
                filter: 'TV Shows'
            }, {
                name: 'Movies',
                filter: 'Movies'
            }, {
                name: 'Sports',
                filter: 'Sports'
            }, {
                name: 'Broadcasters',
                filter: 'Broadcasters'
            }, {
                name: 'Kids',
                filter: 'Kids'
            }, {
                name: 'News',
                filter: 'News'
            }, {
                name: 'Life & Style',
                filter: 'Life & Style'
            }, {
                name: 'Music',
                filter: 'Music'
            }, {
                name: 'Latino',
                filter: 'Latino'
            }];

            // STVWEB-1070: SPECU OVP: Remove "Premiums" from mini-guide filter list
            if (!profileService.isSpecU()) {
                f.splice(6, 0, {
                    name: 'Premiums',
                    filter: 'Premiums'
                });
            }

            if (recent.length === 0) {
                f.splice(1, 1);
            }

            replaceArrayContents(filters, countFilters(f));
            selectedFilter = getDefaultFilter(desiredChannelId);
            return filters;
        }

        function getDefaultFilter(desiredChannelId) {
            var filtersAllowed = location.behindOwnModem || config.showPlayerChannelBrowserFiltersOutOfHome;
            if (filtersAllowed && desiredChannelId === undefined) {
                var _ret = (function () {
                    var previousFilter = ovpStorage.getItem(storageKeys.lastViewedChannelFilter);
                    if (previousFilter && (previousFilter.filter !== RECENT_HISTORY_FILTER.filter || recent.length !== 0)) {
                        return {
                            v: filters.find(function (f) {
                                return f.filter === previousFilter.filter;
                            })
                        };
                    }
                })();

                if (typeof _ret === 'object') return _ret.v;
            }

            return ALL_CHANNELS_FILTER;
        }

        function initSort() {
            // Spec U has no channel numbers, so A to Z is the only sort that will work
            if (profileService.isSpecU()) {
                selectedSort = AZ_SORT;
                return;
            }

            replaceArrayContents(sorts, [AZ_SORT, CHANNEL_NUMBER_SORT]);

            var id = ovpStorage.getItem(storageKeys.channelsSortByType) || config.playerChannelBrowserDefaultSortByType;
            selectedSort = sorts.find(function (s) {
                return s.id === id;
            });
        }

        /**
         * Initializes filtered channels
         * Preconditions: channels, filters, and sort must all have been initialized
         * @return {[type]} [description]
         */
        function initFilteredChannels() {
            updateFilteredChannels();
            return filteredChannels;
        }

        function updateFilteredChannels() {
            var result = sortAndFilter({ channels: channels, selectedFilter: selectedFilter, selectedSort: selectedSort });
            replaceArrayContents(filteredChannels, result);
        }

        function sortAndFilter(_ref) {
            var channels = _ref.channels;
            var selectedFilter = _ref.selectedFilter;
            var selectedSort = _ref.selectedSort;

            var result = undefined;
            if (selectedFilter.filter === RECENT_HISTORY_FILTER.filter) {
                if (profileService.isSpecU()) {
                    result = channels.filter(function (c) {
                        return recent.indexOf(c.ncsServiceId) > -1;
                    }).sort(function (a, b) {
                        return recent.indexOf(a.ncsServiceId) - recent.indexOf(b.ncsServiceId);
                    });
                } else {
                    result = channels.filter(function (c) {
                        return recent.indexOf(c.localChannelNumber) > -1;
                    }).sort(function (a, b) {
                        return recent.indexOf(a.localChannelNumber) - recent.indexOf(b.localChannelNumber);
                    });
                }
            } else if (selectedFilter.filter === ALL_CHANNELS_FILTER.filter) {
                result = channels.slice();
            } else {
                // Genre filter
                result = channels.filter(function (c) {
                    return getGenresForChannel(c).indexOf(selectedFilter.filter) > -1;
                });
            }

            if (selectedFilter !== RECENT_HISTORY_FILTER) {
                if (selectedSort === CHANNEL_NUMBER_SORT) {
                    (function () {
                        var _result;

                        // Create duplicates in order to display channels with multiple channel numbers
                        var duplicates = [];
                        result.forEach(function (channel) {
                            channel.localChannelNumbers.forEach(function (num) {
                                if (num !== channel.localChannelNumber) {
                                    duplicates.push(angular.extend({}, channel, { localChannelNumber: num }));
                                }
                            });
                        });
                        (_result = result).push.apply(_result, duplicates);
                        result = result.sort(function (a, b) {
                            return a.localChannelNumber - b.localChannelNumber;
                        });
                    })();
                } else if (selectedSort === AZ_SORT) {
                    result = result.sort(function (a, b) {
                        return a.networkName < b.networkName ? -1 : 1;
                    });
                }
            }

            var available = [],
                unavailable = [];
            result.forEach(function (c) {
                var arr = c.available ? available : unavailable;
                arr.push(c);
            });

            return available.concat.apply(available, unavailable);
        }

        function updateLineup() {
            if (channels.length > 0) {
                return whatsOn.nowOrImminent(channels).then(function (assetsOnNow) {
                    channels.forEach(function (chan, i) {
                        return setCurrentAsset(chan, assetsOnNow[i]);
                    });
                    countFilters(filters);
                });
            } else {
                return $q.resolve();
            }
        }

        function countFilters(filters) {
            var counts = {};
            channels.forEach(function (c) {
                getGenresForChannel(c).forEach(function (g) {
                    var count = selectedSort === CHANNEL_NUMBER_SORT ? c.localChannelNumbers.length : 1;
                    if (g in counts) {
                        counts[g] += count;
                    } else {
                        counts[g] = count;
                    }
                });
            });

            filters.filter(function (f) {
                return f !== ALL_CHANNELS_FILTER && f !== RECENT_HISTORY_FILTER;
            }).forEach(function (f) {
                return f.channelCount = counts[f.filter] || 0;
            });

            return filters;
        }

        function getGenresForChannel(channel) {
            var genres = [];
            if (angular.isArray(channel.genres)) {
                genres = channel.genres;
            } else {
                if (channel.asset && angular.isArray(channel.asset.genres)) {
                    genres = channel.asset.genres;
                }
            }

            // Prefer to get Movie/tv show info from the type of asset rather than the genre information.
            genres = genres.filter(function (g) {
                return ['TV Shows', 'Movies'].indexOf(g) < 0;
            });

            // Add 'TV Show' genre.
            if (channel.asset && channel.asset.isEpisode) {
                genres.push('TV Shows');
            }

            // Add 'Movie' genre.
            if (channel.asset && channel.asset.isMovie) {
                genres.push('Movies');
            }

            // Exlude Sports if it is a movie (VDIS-855)
            var index = genres.findIndex(function (g) {
                return g === 'Sports';
            });
            if (index > -1 && channel.asset && channel.asset.isMovie) {
                genres.splice(index, 1);
            }

            return genres;
        }

        function initRecent() {
            var fromStorage = ovpStorage.getItem(storageKeys.recentHistory);
            replaceArrayContents(recent, fromStorage || []);
            return $q.resolve(recent);
        }

        function saveRecent(channel) {
            if (isEANChannel(channel)) {
                return; // Do not add EAN channel to history
            }

            var oldLength = recent.length,
                channelKey = profileService.isSpecU() ? channel.ncsServiceId : channel.localChannelNumber;

            if (recent.indexOf(channelKey) !== -1) {
                recent.splice(recent.indexOf(channelKey), 1);
            }
            recent.unshift(channelKey);
            recent.splice(maxRecentHistoryChannels);
            ovpStorage.setItem(storageKeys.recentHistory, recent);

            if (oldLength === 0 && recent.length === 1) {
                filters.splice(1, 0, RECENT_HISTORY_FILTER);
            }
        }

        function setSelectedFilter(filter) {
            selectedFilter = filter;
            ovpStorage.setItem(storageKeys.lastViewedChannelFilter, selectedFilter);
            updateFilteredChannels();
        }

        function setSelectedSort(sort) {
            selectedSort = sort;
            ovpStorage.setItem(storageKeys.channelsSortByType, selectedSort.id);
            countFilters(filters);
            updateFilteredChannels();
        }

        function setSelectedChannel(channel) {
            selectedChannel = channel;
            saveRecent(channel);
            startChannelUpdateTimer(channel);
        }

        function getDummyEANChannel(eanUrl) {
            return augmentChannelData({
                asset: {
                    title: 'Emergency Alert',
                    isEpisodic: false
                },
                ncsServiceId: '',
                tmsId: '',
                networkName: 'Emergency Alert',
                networkId: '',
                callSign: '',
                streamUri: '',
                logoUrl: '',
                genres: [],
                availableOutOfHome: false,
                favorite: false,
                cdvrRecordable: false,
                blockEas: false,
                hd: false,
                channels: [config.eanChannelNumber],
                streams: [{
                    type: 'hls',
                    drm: false,
                    dai: false,
                    uri: '',
                    cdnUrl: eanUrl
                }],
                parentallyBlocked: false
            });
        }

        function addDummyEANChannel(eanUrl) {
            var chan = channels.find(isEANChannel);
            if (!chan) {
                chan = getDummyEANChannel(eanUrl);
                channels.push(chan);
                filteredChannels.push(chan);
            }
            return chan;
        }

        function removeDummyEANChannel() {
            var index = channels.findIndex(isEANChannel);
            if (index >= 0) {
                channels.splice(index, 1);
            }
            index = filteredChannels.findIndex(isEANChannel);
            if (index >= 0) {
                filteredChannels.splice(index, 1);
            }
        }

        function isEANChannel(channel) {
            return channel.localChannelNumber === config.eanChannelNumber;
        }

        function startLineupUpdateInterval() {
            var channelDisplayInterval = parseInt(config.intervalForChannelBrowserUpdateInMinutes) * 60 * 1000;
            lineupUpdateInterval = $interval(updateLineup, channelDisplayInterval);
        }

        function startChannelUpdateTimer(channel) {
            if (isEANChannel(channel)) {
                return;
            }
            whatsOn.now(channel).then(function (assetOnNow) {
                if (channelUpdateTimer) {
                    $timeout.cancel(channelUpdateTimer);
                }

                if (!assetOnNow) {
                    // Data is missing, so unfortunately we can't tell when an update would be needed.
                    // As a result, Info panel will be blank and blocking won't be enforced locally.
                    return;
                }

                var asset = assetOnNow;
                var endTimeMsec = asset.scheduledEndTimeSec * 1000;
                var delay = endTimeMsec - Date.now();

                channelUpdateTimer = $timeout(function () {
                    channelUpdateTimer = undefined;
                    forceUpdateLineup(asset, selectedChannel);
                }, delay);
            });
        }

        function forceUpdateLineup(asset, selectedChannel) {
            var wasBlocked = asset.isBlocked;
            updateLineup().then(function () {
                $rootScope.$broadcast('player:assetSelected', selectedChannel.asset);
                startChannelUpdateTimer(selectedChannel);
                var isBlocked = selectedChannel.asset ? selectedChannel.asset.isBlocked : $q.resolve(false);
                return $q.all([isBlocked, wasBlocked]);
            }).then(function (_ref2) {
                var _ref22 = _slicedToArray(_ref2, 2);

                var is = _ref22[0];
                var was = _ref22[1];

                if (is !== was) {
                    // Notify the miniguide of the change, so it can play or block as as necessary
                    $rootScope.$broadcast('player:blockChanged', is);
                }
            });
        }

        function replaceArrayContents(arrayRef, newContents) {
            arrayRef.splice.apply(arrayRef, [0, arrayRef.length].concat(_toConsumableArray(newContents)));
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/mini-guide-data.js.map
