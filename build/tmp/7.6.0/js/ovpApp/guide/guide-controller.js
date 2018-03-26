'use strict';

(function () {
    'use strict';

    GuideController.$inject = ["$scope", "$state", "$http", "config", "$rootScope", "$log", "GuideService", "favoritesService", "$q", "rdvrService", "ChannelService", "channelList", "favorites", "alert", "messages", "$filter", "profileService", "loadingDefer", "stbService", "$timeout"];
    angular.module('ovpApp.guide').controller('GuideController', GuideController);

    /* @ngInject */
    function GuideController($scope, $state, $http, config, $rootScope, $log, GuideService, favoritesService, $q, rdvrService, ChannelService, channelList, favorites, alert, messages, $filter, profileService, loadingDefer, stbService, $timeout) {
        var vm = this,
            zoneLoadQueue = [[0, 0], [0, 1], [1, 0], [1, 1]],
            dateFilter = $filter('date');

        vm.displayHours = 14 * 24; //Total number of hours to display - this should come from the STB though.
        vm.times = [];
        vm.channels = channelList;
        vm.favorites = favorites || [];
        vm.recentChannels = [];
        vm.recordings = [];
        vm.getShowData = getShowData;
        vm.toggleFavorite = toggleFavorite;
        vm.fetchPromise = null;
        vm.focusChannel = null;
        vm.focusShow = null;
        vm.focusTime = null;
        vm.move = move;
        vm.keypress = keypress;
        vm.gridFocused = gridFocused;
        vm.setFocus = setFocus;
        vm.$state = $state;

        /*
            A zone is a single window. This is used to help load the page by thinking of it as a large grid of zones.
            We ensure that we only load each zone once and on time.
         */
        vm.zoneData = [];
        vm.channelsPerZone = -1;
        vm.hoursPerZone = -1;

        activate();

        function activate() {
            //guide:currentZone gets sent by : GSCD->fetchZoneData (called by scroll handler)
            //displayZone is sent by GSCD to go 'down' to the rows (not listened to here, essentially the same event)
            $scope.$on('guide:currentZone', fetchZone);
            $scope.$on('update-dvr', function () {
                //Only use the update-dvr if we are using CDVR
                profileService.isCdvrEnabled().then(function (isEnabled) {
                    if (isEnabled) {
                        GuideService.clearProgramData();
                        // updateGrid();
                        $scope.$broadcast('guide:invalidateData');
                    }
                });
            });

            $scope.$on('guide:reactivate', function () {
                // timeout is needed to correctly set blue colored focus on the Dom element.
                $timeout(function () {
                    setFocus(vm.focusZone, vm.focusChannel, vm.focusShow);
                }, 0);
            });

            $scope.$on('set-top-box-selected', updateRecordings);
            $scope.$on('guide:updateFilter', updateGrid);

            $scope.$on('guide:channelSearch', function (e, channelNumber) {
                if (profileService.isSpecU() || vm.channels.every(function (c) {
                    return c.channelNumber === undefined;
                })) {
                    // No searching by channel when there are no channel numbers (ie, SpecU)
                    return;
                }
                var closest = vm.channels.reduce(function (candidate, channel) {
                    if (channel.globalIndex !== null && (!candidate.channel || Math.abs(channel.channelNumber - channelNumber) < candidate.dist)) {
                        candidate.channel = channel;
                        candidate.dist = Math.abs(channel.channelNumber - channelNumber);
                    }
                    return candidate;
                }, {
                    dist: null,
                    channel: null
                }).channel;
                $scope.setChannelPos(closest.globalIndex);
                setFocus(closest.zone, closest);
            });
            //Wait for zonesize before we trigger the first fetch
            $scope.$on('guide:zonesize', function (event, channelsPerZone, hoursPerZone) {
                vm.channelsPerZone = channelsPerZone;
                vm.hoursPerZone = hoursPerZone;
                updateGrid(vm.channels);
            });

            $scope.$on('guide:timejump', clearSelection);
            enrichChannelData();
            updateRecordings();

            $scope.$watch(function () {
                return GuideService.times;
            }, function (nv) {
                vm.times = nv.map(function (epoch, idx) {
                    return {
                        time: dateFilter(epoch, 'shortTime'),
                        index: idx,
                        epoch: epoch
                    };
                });
            });

            // Analytics
            $rootScope.$emit('Analytics:channel-info', {
                channels: vm.channels
            });
        }

        function clearSelection() {
            vm.focusZone = null;
            vm.focusChannel = null;
            vm.focusShow = null;
            vm.focusTime = null;
        }

        /**
         * When the screen size changes, update the grid to ensure the zone is appropriatly sized.
         */
        function updateGrid() {
            initZones();
            //Updates the display variable on each channel
            var saveTime = vm.focusTime;
            clearSelection();
            vm.focusTime = saveTime;
            //Updates GuideScrollContainer -> create zone html elements, forceFetchCurrent zone
            $scope.$broadcast('guide:updateZones');
        }

        /**
         * Update the recordings asyncrounously so we can append that data to the current display when available.
         * @return {[type]} [description]
         */
        function updateRecordings() {
            profileService.isRdvrEnabled().then(function (rdvrEnabled) {
                vm.recordings = [];

                if (rdvrEnabled) {
                    stbService.getCurrentStb().then(function (stb) {
                        var stbChanged = stbService.currentStbSource.skip(1);
                        rdvrService.getScheduledRecordings(stb).takeUntil(stbChanged).subscribe(function (result) {
                            updateLoadingIndicator(result);
                            applyRecordings(result);
                        });
                    });
                }
            });
        }

        function updateLoadingIndicator(_ref) {
            var data = _ref.data;
            var isComplete = _ref.isComplete;
            var error = _ref.error;

            if (error) {
                if (vm.rdvrDefer) {
                    vm.rdvrDefer.resolve();
                    vm.rdvrDefer = undefined;
                }
            } else if (data.length === 0 && !isComplete) {
                //Start of fetch
                if (vm.rdvrDefer) {
                    vm.rdvrDefer.reject();
                }

                vm.rdvrDefer = $q.defer();
                vm.rdvrPromise = vm.rdvrDefer.promise;
            } else if (isComplete) {
                // Data is fully loaded
                if (vm.rdvrDefer) {
                    vm.rdvrDefer.resolve();
                    vm.rdvrDefer = undefined;
                }
            }
        }

        /**
         * Append the subscribed and favorite data to the channel list once for filtering the the channels.
         * @return {[type]} [description]
         */
        function enrichChannelData() {
            vm.channels.forEach(function (channel) {
                // If there is a channel that is marked as a QAM favorite and has the same channel number
                // in the IP lineup, but does not represent the same channel (ncsServiceId or mystroServiceId)
                // We could potentially mark this as a favorite and entitled when it is not.
                // Or if the channel is IP only and doesn't have a channel number there might not be a channel
                // object to operate on.
                ChannelService.getChannelByChannelNumber(channel.channelNumber).then(function (bc) {
                    if (bc && !bc.entitled) {
                        channel.subscribed = false;
                    } else {
                        channel.subscribed = true;
                    }
                });
                if (favoritesService.isFavorite(channel)) {
                    channel.favorite = true;
                } else {
                    channel.favorite = false;
                }
            });
        }

        /**
         * Calculate all the zones on the page based on the current size of the guide
         * viewport.
         * @return {Array} zoneData, the array containing all the channels subdivided into 'zones'
         */
        function initZones() {
            // update the favorites on init
            enrichChannelData();
            var channels = vm.channels;

            var channelZones = Math.ceil(channels.length / vm.channelsPerZone);
            var timeZones = Math.ceil(vm.displayHours / vm.hoursPerZone) + 1;
            vm.zoneData = [];
            var lastChannelIndex = 0;
            var globalIndex = 0;
            for (var i = 0; i < channelZones; i++) {
                var channelZone = {
                    zoneIndex: i,
                    timeZones: []
                };
                var zoneChannels = [];
                var channelIndex = lastChannelIndex;
                while (channelIndex < vm.channels.length && zoneChannels.length < vm.channelsPerZone) {
                    var currentChannel = vm.channels[channelIndex];
                    if (GuideService.filterChannel(currentChannel)) {
                        zoneChannels.push(currentChannel);
                        currentChannel.globalIndex = globalIndex;
                        currentChannel.zoneIndex = i;
                        globalIndex++;
                    } else {
                        currentChannel.globalIndex = null;
                        currentChannel.zoneIndex = null;
                    }
                    channelIndex++;
                }
                lastChannelIndex = channelIndex;
                channelZone.zoneChannels = zoneChannels;

                for (var j = 0; j < timeZones; j++) {
                    var start = j * vm.hoursPerZone;
                    channelZone.timeZones.push({
                        startTime: start,
                        startSecondsOffset: start * 3600,
                        endTime: start + vm.hoursPerZone,
                        endSecondsOffset: (start + vm.hoursPerZone) * 3600,
                        timeZoneIndex: j
                    });
                }

                vm.zoneData.push(channelZone);
            }
            return vm.zoneData;
        }

        /**
         * Fetch all the data for the given zone and apply to the vm.zoneData variable.
         * @param  {Event} event Angular Event
         * @param  {Array} zones Array of zones
         * @return {Promise|undefined}
         */
        function fetchZone(event, zones) {
            if (zones) {
                vm.lastFetchedZones = zones;
            }
            if (vm.zoneData.length > 0) {
                var combinedZones = combineZones(zones);
                if (combinedZones.channels.length > 0) {
                    var fetchPromise = GuideService.fetchChannels(combinedZones.channels, combinedZones.startTime, combinedZones.endTime);

                    fetchPromise.then(function (results) {
                        if (loadingDefer && loadingDefer.promise.$$state.pending) {
                            $rootScope.$broadcast('pageChangeComplete', $state.current);
                            loadingDefer.resolve();
                        }
                        checkForRecordings();
                        return results;
                    }, function (err) {
                        if (loadingDefer && loadingDefer.promise.$$state.pending) {
                            loadingDefer.resolve();
                        }
                        $log.warn('Error fetching channel data', err);
                    });

                    vm.fetchPromise = fetchPromise;
                    return vm.fetchPromise;
                }
            } else {
                zoneLoadQueue = zoneLoadQueue.concat(zones);
            }
        }

        function getShowData(show, channel) {
            vm.recentChannels.push(channel);
        }

        function toggleFavorite(channel) {
            channel.favorite = !channel.favorite;
            favoritesService.toggleFavorite(channel);
        }

        /**
         * When the recordings have been returned from the dvr service, append them to each channel based on the
         * mystroServiceId so we can later apply them to the recordings
         */
        function applyRecordings(_ref2) {
            var data = _ref2.data;
            var isComplete = _ref2.isComplete;

            vm.recordings = data;

            if (data.length === 0 && !isComplete) {
                //Starting to fetch
                vm.channels.forEach(function (ch) {
                    return ch.recordings = {};
                });
                $scope.$broadcast('guide:clearRecordings');
            } else {
                vm.recordings.forEach(function (recording) {
                    vm.channels.filter(function (ch) {
                        return ch.mystroServiceId === recording.mystroServiceId;
                    }).forEach(function (channel) {
                        if (!channel.recordings) {
                            channel.recordings = {};
                        }
                        channel.recordings[recording.tmsProgramId] = recording;
                    });
                });
                $scope.$broadcast('guide:updateRecordings');
            }
        }

        /**
         * All recordings are stored at the channel level before they are applied to each show. We should have
         * the channel when the recordings return
         */
        function checkForRecordings() {
            vm.channels.forEach(function (channel) {
                if (channel.content) {
                    channel.content.forEach(function (show) {
                        if (channel.recordings && channel.recordings[show.tmsProgramId]) {
                            show.recording = channel.recordings[show.tmsProgramId];
                        }
                    });
                }
            });
        }

        /**
         * This takes all the zones and combines the data into a format that we can use to call the service with so that
         * we are not making more service calls than neccessary.
         * @param  {Array} zones The zones list that we need to fetch.
         * @return {Object}      An object containing the channels and the time zones we want from the server
         */
        function combineZones(zones) {
            var combinedZones = zones.reduce(function (memo, zone) {
                var timeZoneIndex = zone[0];
                var channelZone = zone[1];
                if (vm.zoneData[channelZone]) {
                    var tz = vm.zoneData[channelZone].timeZones[timeZoneIndex];
                    memo.channels = memo.channels.concat(vm.zoneData[channelZone].zoneChannels);
                    if (memo.startTime === null || tz.startTime < memo.startTime) {
                        memo.startTime = tz.startTime;
                    }
                    if (memo.endTime === null || tz.endTime > memo.endTime) {
                        memo.endTime = tz.endTime;
                    }
                }
                return memo;
            }, {
                channels: [],
                startTime: null,
                endTime: null
            });
            combinedZones.channels = combinedZones.channels.reduce(function (channels, channel) {
                if (channels.indexOf(channel) < 0) {
                    channels.push(channel);
                }
                return channels;
            }, []);
            return combinedZones;
        }

        function keypress($event) {

            switch ($event.keyCode) {
                case 38:
                    move($event, 'up');break;
                case 39:
                    move($event, 'right');break;
                case 40:
                    move($event, 'down');break;
                case 37:
                    move($event, 'left');break;
                case 9:
                    //Tab key
                    if ($event.shiftKey) {
                        angular.element('.channel-header-row[channel-index="' + vm.focusChannel.globalIndex + '"]').focus();
                        $event.preventDefault();
                    }
                    break;
            }
        }

        function setFocus(zone, channel) {
            var show = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var time = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
            var updateTime = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

            var focusPromise = null;
            vm.focusZone = zone;
            vm.focusChannel = channel;
            if (channel && !zone) {
                vm.focusZone = vm.zoneData[channel.zoneIndex];
            }

            if (vm.focusChannel && vm.focusChannel.focusIn) {
                if (!show || show === null) {
                    var findAtTime = time || vm.focusTime;
                    focusPromise = vm.focusChannel.focusIn(findAtTime, null);
                } else {
                    vm.focusShow = show;
                    focusPromise = vm.focusChannel.focusIn(null, show);
                }
            } else {
                $log.error('Channel does not have the focusIn function set', vm.focusChannel);
            }

            if (focusPromise) {
                focusPromise.then(function (focusedShow) {
                    if (focusedShow) {
                        vm.focusShow = focusedShow;
                        if (updateTime) {
                            if (focusedShow.startTimeOffset >= 0) {
                                vm.focusTime = focusedShow.startTimeOffset;
                            } else {
                                vm.focusTime = 0;
                            }
                        }
                    }
                }, function (err) {
                    $log.error('Unable to set focus, dom element is missing', err);
                    var idx = vm.focusZone.channels.indexOf(vm.focusChannel);
                    if (idx >= 0 && vm.focusZone.channels[idx + 1]) {
                        return setFocus(vm.focusZone, vm.focusZone.channels[idx + 1], null, time, updateTime);
                    } else {
                        vm.focusZone = null;
                        vm.focusChannel = null;
                        gridFocused();
                    }
                });
            }
        }

        function move(e, direction) {
            if (!vm.focusChannel || !vm.focusZone || !vm.focusShow) {
                return gridFocused(e);
            } else {
                var focusChannelIdx = undefined;
                var focusZoneIdx = undefined;
                var focusTime = vm.focusTime || 0;

                if (direction == 'up' || direction == 'down') {
                    focusChannelIdx = vm.focusZone.zoneChannels.indexOf(vm.focusChannel);
                    focusZoneIdx = vm.focusZone.zoneIndex;
                    if (direction == 'down') {
                        if (vm.focusZone.zoneChannels[focusChannelIdx + 1]) {
                            focusChannelIdx++;
                        } else if (vm.zoneData[focusZoneIdx + 1] && vm.zoneData[focusZoneIdx + 1].zoneChannels.length > 0) {
                            focusChannelIdx = 0;
                            focusZoneIdx++;
                        } //else - at the bottom, do nothing
                    } else {
                            if (vm.focusZone.zoneChannels[focusChannelIdx - 1]) {
                                focusChannelIdx--;
                            } else if (vm.zoneData[focusZoneIdx - 1] && vm.zoneData[focusZoneIdx - 1].zoneChannels.length > 0) {
                                focusZoneIdx--;
                                focusChannelIdx = vm.zoneData[focusZoneIdx].zoneChannels.length - 1;
                            } //else - at the top, do nothing
                        }
                } else {
                        //right or left
                        focusChannelIdx = vm.focusZone.zoneChannels.indexOf(vm.focusChannel);
                        focusZoneIdx = vm.focusZone.zoneIndex;
                        if (direction === 'right') {
                            focusTime = vm.focusShow.startTimeOffset + vm.focusShow.durationMinutes * 60 + 300;
                        } else {
                            focusTime = vm.focusShow.startTimeOffset - 300; //5min
                        }
                    }
                if (vm.zoneData[focusZoneIdx] && vm.zoneData[focusZoneIdx].zoneChannels[focusChannelIdx]) {
                    var zone = vm.zoneData[focusZoneIdx];
                    var channel = zone.zoneChannels[focusChannelIdx];
                    setFocus(zone, channel, null, focusTime, direction === 'right' || direction === 'left');
                    e.preventDefault();
                } else {
                    $log.warn('Zone or Channel index out of range', vm.zoneData[focusZoneIdx], vm.zoneData[focusZoneIdx].zoneChannels[focusChannelIdx]);
                }
            }
        }

        /**
         * When focusing the grid, this will determine the upper left most cell and set the focus at that time if
         * the event type is actually a focus event
         * @return {undefined}
         */
        function gridFocused(event) {
            //Figure out the event type and if
            if (event.type === 'focus' && (!vm.focusZone || !vm.focusChannel)) {
                (function () {
                    var _$scope$getPos = $scope.getPos();

                    var channelIndex = _$scope$getPos.channelIndex;
                    var hour = _$scope$getPos.hour;
                    var scroll = _$scope$getPos.scroll;

                    var channel = vm.channels.find(function (channel) {
                        return channel.globalIndex === channelIndex;
                    });
                    var time = hour * 3600;
                    setFocus(vm.zoneData[channel.zoneIndex], channel, null, time);
                    $scope.setPos(scroll);
                })();
            } else {
                setFocus(vm.focusZone, vm.focusChannel, vm.focusShow);
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/guide/guide-controller.js.map
