(function () {
    'use strict';

    angular
        .module('ovpApp.playerControls.miniGuideData', [
            'ovpApp.player.whatsOn',
            'ovpApp.services.ovpStorage',
            'ovpApp.config',
            'ovpApp.services.locationService'
        ])
        .constant('dummyEANAsset', {
            title: 'Emergency Alert',
            isEpisodic: false,
            networkImage: angular.noop,
            imageUri: angular.noop
        })
        .constant('ALL_CHANNELS_FILTER', {
            name: 'All Channels',
            filter: 'All Channels'
        })
        .constant('RECENT_HISTORY_FILTER', {
            name: 'Recently Watched',
            filter: 'Recently Watched'
        })
        .constant('AZ_SORT', {
            name: 'A-Z (networks)',
            id: 'networkAToZ',
            egName: 'network'
        })
        .constant('CHANNEL_NUMBER_SORT', {
            name: 'Channel Number',
            id: 'channelNumber',
            egName: 'channel'
        })
        .factory('miniGuideData', miniGuideData);

    /* @ngInject */
    function miniGuideData(ovpStorage, storageKeys, whatsOn, $http, config,
            $q, locationService, $rootScope, parentalControlsService, $timeout, $interval,
            ALL_CHANNELS_FILTER, RECENT_HISTORY_FILTER, AZ_SORT, CHANNEL_NUMBER_SORT, profileService) {

        const service = {
            getData,
            getDefaultChannel,
            addDummyEANChannel,
            removeDummyEANChannel,
            setSelectedFilter,
            setSelectedSort,
            setSelectedChannel,
            onPlayerDestroyed,
            startChannelUpdateTimer,
            _private: {
                //Exposed for unit tests only
                sortAndFilter
            }
        };

        const maxRecentHistoryChannels = 10;
        const channels = [], filteredChannels = [], recent = [], filters = [], sorts = [];

        let location, isPCDisabled, selectedFilter, selectedSort, selectedChannel, promise;
        let channelUpdateTimer, lineupUpdateInterval;

        return service;

        ////////////////

        function getData(desiredChannelId, eanUrl) {
            if (!promise) {
                promise = $q.all([
                        initLocation(),
                        initParentalControls()
                    ])
                    .then(initChannels)
                    .then(initRecent)
                    .then(() => {
                        initSort();
                        initFilters(desiredChannelId);
                        initFilteredChannels();
                        startLineupUpdateInterval();
                        addConnectivityListener();
                    });
            }

            return promise.then(() => {
                selectedChannel = getDefaultChannel(desiredChannelId, eanUrl);
                return { channels, filters, sorts, filteredChannels, selectedFilter, selectedSort, selectedChannel };
            });
        }

        function initLocation() {
            return locationService.getLocation()
                .then(loc => {
                    location = loc;
                    $rootScope.$on('LocationService:locationChanged', onLocationChanged);
                });
        }

        function initParentalControls() {
            return parentalControlsService.isParentalControlsDisabledForClient()
                .then(disabled => {
                    isPCDisabled = disabled;
                    $rootScope.$on('ParentalControls:updated', onParentalControlsChanged);
                });
        }

        function addConnectivityListener() {
            $rootScope.$on('connectivityService:statusChanged', (event, isOnline) => {
                if (isOnline) {
                    whatsOn.now(selectedChannel)
                    .then(assetOnNow => {
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
            channels.forEach(c =>
                c.available = location.behindOwnModem || c.availableOutOfHome === true);

            updateFilteredChannels();
        }

        function onParentalControlsChanged() {
            parentalControlsService.isParentalControlsDisabledForClient()
                .then(disabled => {
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

            let url = config.piHost + config.services.streamingChannels + '?viewParentallyBlocked=true';
            return $http.get(url, {withCredentials: true})
                .then(response => {
                    // STVWEB-1868: Display Subscribed Only (Video/Internet Only) - Guide
                    if (profileService.isIpOnlyEnabled()) {
                        return response.data.channels.filter(chnl => chnl.subscribed !== false);
                    }
                    return response.data.channels;
                })
                .then(response => {
                    replaceArrayContents(channels, response.map(augmentChannelData));
                    return whatsOn.nowOrImminent(channels);
                })
                .then(assetsOnNow => {
                    let promises = [];
                    channels.forEach((c, i) => promises.push(setCurrentAsset(c, assetsOnNow[i])));
                    return $q.all(promises);
                })
                .then(() => channels);
        }

        function augmentChannelData(channel) {
            if (!channel.channels) {
                channel.channels = [];
            }
            angular.extend(channel, {
                channelId: channel.tmsId,
                channelTitle: channel.networkName,
                available: location.behindOwnModem || channel.availableOutOfHome === true,
                localChannelNumber: (channel.channels.length > 0) ? channel.channels[0] : '',
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

            return asset.isBlocked.then(blocked => {
                let newData = {
                    channelTitle: asset.isOnNow ? asset.title : `On Next: ${asset.title}`,
                    episodeTitle: asset.episodeTitle || '',
                    hasLinkedVODAsset: !!asset.vodProviderAssetId,
                    isParentallyBlocked: blocked,
                    networkLogoUri: asset.networkImage({height: 60})
                };

                let isNew = false;
                for (let key in newData) {
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
            let channel;
            // If ean was specified, use it.
            if (eanUrl) {
                return addDummyEANChannel(eanUrl);
            }

            // Otherwise, if a channel was specified, use it
            if (desiredChannelId !== undefined) {
                channel = channels.find(c => c.tmsId === desiredChannelId);
                if (channel) {
                    return channel;
                }
            }

            let compareFn = profileService.isSpecU() ?
            (a,b) => {
                return (a.available && (a.ncsServiceId === b));
            } :
            // We must compare the recent channel list from localChannelNumbers array.
            (a,b) => {
                return (a.available && (a.localChannelNumbers.indexOf(b) > -1));
            };

            // This will only return the channelNumber/ncsServiceId from recent list.
            for (var i = 0; i < recent.length; i++) {
                channel = channels.find(c => compareFn(c, recent[i]));
                if (channel && angular.isNumber(channel.localChannelNumber) &&
                    channel.localChannelNumber !== recent[i]) {
                    // If a localChannelNumber is not found
                    // compare recent from the list of duplicate channels
                    channel = filteredChannels.find(c => {
                        return c.available && c.localChannelNumber === recent[i];
                    });
                }
                if (channel) {
                    return channel;
                }
            }

            // Failing that, find any available channel
            return channel || channels.find(c => c.available);
        }


        /**
         * Initializes filers.
         * Preconditions: channels and recent must have been initialized
         * @return {[type]} [description]
         */
        function initFilters(desiredChannelId) {
            let f = [
                ALL_CHANNELS_FILTER,
                RECENT_HISTORY_FILTER,
                {
                    name: 'TV Shows',
                    filter: 'TV Shows'
                },
                {
                    name: 'Movies',
                    filter: 'Movies'
                },
                {
                    name: 'Sports',
                    filter: 'Sports'
                },
                {
                    name: 'Broadcasters',
                    filter: 'Broadcasters'
                },
                {
                    name: 'Kids',
                    filter: 'Kids'
                },
                {
                    name: 'News',
                    filter: 'News'
                },
                {
                    name: 'Life & Style',
                    filter: 'Life & Style'
                },
                {
                    name: 'Music',
                    filter: 'Music'
                },
                {
                    name: 'Latino',
                    filter: 'Latino'
                }
            ];

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
            let filtersAllowed = location.behindOwnModem || config.showPlayerChannelBrowserFiltersOutOfHome;
            if (filtersAllowed && desiredChannelId === undefined) {
                let previousFilter = ovpStorage.getItem(storageKeys.lastViewedChannelFilter);
                if (previousFilter && (previousFilter.filter !== RECENT_HISTORY_FILTER.filter || recent.length !== 0)) {
                    return filters.find(f => f.filter === previousFilter.filter);
                }
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

            let id = ovpStorage.getItem(storageKeys.channelsSortByType) ||
                config.playerChannelBrowserDefaultSortByType;
            selectedSort = sorts.find(s => s.id === id);
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
            let result = sortAndFilter({channels, selectedFilter, selectedSort});
            replaceArrayContents(filteredChannels, result);
        }

        function sortAndFilter({channels, selectedFilter, selectedSort}) {
            let result;
            if (selectedFilter.filter === RECENT_HISTORY_FILTER.filter) {
                if (profileService.isSpecU()) {
                    result = channels.filter(c => recent.indexOf(c.ncsServiceId) > -1)
                    .sort((a, b) => recent.indexOf(a.ncsServiceId) - recent.indexOf(b.ncsServiceId));
                } else {
                    result = channels.filter(c => recent.indexOf(c.localChannelNumber) > -1)
                        .sort((a, b) => recent.indexOf(a.localChannelNumber) - recent.indexOf(b.localChannelNumber));
                }
            } else if (selectedFilter.filter === ALL_CHANNELS_FILTER.filter) {
                result = channels.slice();
            } else {
                // Genre filter
                result = channels.filter(c =>
                    getGenresForChannel(c).indexOf(selectedFilter.filter) > -1);
            }


            if (selectedFilter !== RECENT_HISTORY_FILTER) {
                if (selectedSort === CHANNEL_NUMBER_SORT) {
                    // Create duplicates in order to display channels with multiple channel numbers
                    let duplicates = [];
                    result.forEach(channel => {
                        channel.localChannelNumbers.forEach(num => {
                            if (num !== channel.localChannelNumber) {
                                duplicates.push(angular.extend({}, channel, {localChannelNumber: num}));
                            }
                        });
                    });
                    result.push(...duplicates);
                    result = result.sort((a, b) => a.localChannelNumber - b.localChannelNumber);
                } else if (selectedSort === AZ_SORT) {
                    result = result.sort((a, b) => a.networkName < b.networkName ? -1 : 1);
                }
            }

            let available = [], unavailable = [];
            result.forEach(c => {
                let arr = c.available ? available : unavailable;
                arr.push(c);
            });

            return available.concat(...unavailable);
        }

        function updateLineup() {
            if (channels.length > 0) {
                return whatsOn.nowOrImminent(channels)
                    .then(assetsOnNow => {
                        channels.forEach((chan, i) => setCurrentAsset(chan, assetsOnNow[i]));
                        countFilters(filters);
                    });
            } else {
                return $q.resolve();
            }
        }

        function countFilters(filters) {
            let counts = {};
            channels.forEach(c => {
                getGenresForChannel(c)
                    .forEach(g => {
                        let count = (selectedSort === CHANNEL_NUMBER_SORT) ? c.localChannelNumbers.length : 1;
                        if (g in counts) {
                            counts[g] += count;
                        } else {
                            counts[g] = count;
                        }
                    });
            });

            filters.filter(f => f !== ALL_CHANNELS_FILTER && f !== RECENT_HISTORY_FILTER)
                .forEach(f => f.channelCount = counts[f.filter] || 0);

            return filters;
        }

        function getGenresForChannel(channel) {
            let genres = [];
            if (angular.isArray(channel.genres)) {
                genres = channel.genres;
            } else {
                if (channel.asset && angular.isArray(channel.asset.genres)) {
                    genres = channel.asset.genres;
                }
            }

            // Prefer to get Movie/tv show info from the type of asset rather than the genre information.
            genres = genres.filter(g => ['TV Shows', 'Movies'].indexOf(g) < 0);

            // Add 'TV Show' genre.
            if (channel.asset && channel.asset.isEpisode) {
                genres.push('TV Shows');
            }

            // Add 'Movie' genre.
            if (channel.asset && channel.asset.isMovie) {
                genres.push('Movies');
            }

            // Exlude Sports if it is a movie (VDIS-855)
            let index = genres.findIndex(g => g === 'Sports');
            if (index > -1 && channel.asset && channel.asset.isMovie) {
                genres.splice(index, 1);
            }

            return genres;
        }

        function initRecent() {
            let fromStorage = ovpStorage.getItem(storageKeys.recentHistory);
            replaceArrayContents(recent, fromStorage || []);
            return $q.resolve(recent);
        }

        function saveRecent(channel) {
            if (isEANChannel(channel)) {
                return; // Do not add EAN channel to history
            }

            let oldLength = recent.length,
                channelKey = (profileService.isSpecU()) ?
                    channel.ncsServiceId : channel.localChannelNumber;

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
            let chan = channels.find(isEANChannel);
            if (!chan) {
                chan = getDummyEANChannel(eanUrl);
                channels.push(chan);
                filteredChannels.push(chan);
            }
            return chan;
        }

        function removeDummyEANChannel() {
            let index = channels.findIndex(isEANChannel);
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
            const channelDisplayInterval = parseInt(config.intervalForChannelBrowserUpdateInMinutes) * 60 * 1000;
            lineupUpdateInterval = $interval(updateLineup, channelDisplayInterval);
        }

        function startChannelUpdateTimer(channel) {
            if (isEANChannel(channel)) {
                return;
            }
            whatsOn.now(channel)
            .then(assetOnNow => {
                if (channelUpdateTimer) {
                    $timeout.cancel(channelUpdateTimer);
                }

                if (!assetOnNow) {
                    // Data is missing, so unfortunately we can't tell when an update would be needed.
                    // As a result, Info panel will be blank and blocking won't be enforced locally.
                    return;
                }

                let asset = assetOnNow;
                let endTimeMsec = asset.scheduledEndTimeSec * 1000;
                let delay = endTimeMsec - Date.now();

                channelUpdateTimer = $timeout(() => {
                    channelUpdateTimer = undefined;
                    forceUpdateLineup(asset, selectedChannel);
                }, delay);
            });
        }

        function forceUpdateLineup(asset, selectedChannel) {
            let wasBlocked = asset.isBlocked;
            updateLineup()
                .then(() => {
                    $rootScope.$broadcast('player:assetSelected', selectedChannel.asset);
                    startChannelUpdateTimer(selectedChannel);
                    let isBlocked = selectedChannel.asset ? selectedChannel.asset.isBlocked : $q.resolve(false);
                    return $q.all([isBlocked, wasBlocked]);
                })
                .then(([is, was]) => {
                    if (is !== was) {
                        // Notify the miniguide of the change, so it can play or block as as necessary
                        $rootScope.$broadcast('player:blockChanged', is);
                    }
                });
        }

        function replaceArrayContents(arrayRef, newContents) {
            arrayRef.splice(0, arrayRef.length, ...newContents);
        }
    }
})();
