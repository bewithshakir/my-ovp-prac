(function () {
    'use strict';

    angular.module('ovpApp.guide')
        .constant('guideIpOnlyEpg', {
            WINDOW_HOURS: 4 // EPG V2 service is fixed window sizes
        })
        .service('GuideService', GuideService);

    /* @ngInject */
    function GuideService($http, config, $rootScope, $log, stbService, $q, epgsService,
        profileService, guideIpOnlyEpg, $timeout, alert, errorCodesService) {
        var service = this,
            loadPromise,
            earliest,
            latest,
            displayEarliest,
            zeroHour,
            filters;

        service.fetchChannelList = fetchChannelList;
        service.fetchChannels = fetchChannels;
        service.getZeroHour = getZeroHour;
        service.filterChannel = filterChannel;
        service.clearProgramData = clearProgramData;
        service.setZeroTime = setZeroTime;

        activate();

        return service;

        function activate() {
            setZeroTime();
            $rootScope.$on('guide:updateFilter', function (event, updatedFilters) {
                filters = updatedFilters;
            });
        }

        function setZeroTime() {
            zeroHour = new Date();
            let currentTimeMillis = zeroHour.getTime();
            zeroHour.setMinutes(0);
            zeroHour.setSeconds(0);
            zeroHour.setMilliseconds(0);
            service.zeroTime = Math.floor(zeroHour.getTime() / 1000);
            let resetTimeout = (zeroHour.getTime() + 3600000) - currentTimeMillis;
            service.endTime = service.zeroTime + (14 * 24 * 3600);
            displayEarliest = service.zeroTime;
            getTimeBounds();

            $timeout(setZeroTime, resetTimeout);
        }

        /**
         * Fetch the channel list, this is required before we can fetch any other info.
         * @return {Promise}
         */
        function fetchChannelList() {
            loadPromise = epgsService.getChannels()
                .then(channels => {
                    if (profileService.isSpecU()) {
                        channels.sort((a, b) => a.networkName > b.networkName ? 1 : -1);
                    }
                    // STVWEB-1868: Display Subscribed Only (Video/Internet Only) - Guide
                    if (profileService.isIpOnlyEnabled()) {
                        channels = channels.filter(chnl => chnl.subscribed !== false);
                    }
                    service.channels = channels ? channels.map((channel, idx) => {
                        channel.index = idx;
                        channel.content = [];
                        return channel;
                    }) : [];
                    return service.channels;
                });
            return loadPromise;
        }

        function fetchChannels(channels, timeStart, timeEnd) {
            if (!loadPromise) {
                loadPromise = fetchChannelList();
            }

            return loadPromise.then(function () {
                let channelDataPromise = fetchChannelData(channels, timeStart, timeEnd);
                return channelDataPromise;
            });
        }

        function fetchChannelData(channelSlice, begin = 0, end = 2) {
            //Filter out any channels that we already have this data for
            channelSlice = channelSlice.filter(channel => !channelHasTime(channel, begin, end));

            return profileService.isIpOnlyEnabled().then((ipOnly) => {
                if (ipOnly) {
                    return fetchIpChannelData(channelSlice, begin, end);
                } else {
                    end += 1;
                    return fetchQamChannelData(channelSlice, begin, end);
                }
            });
        }

        function fetchQamChannelData(channelSlice, begin, end) {
            var requestData;
            var headend;

            return stbService.getHeadend().then(he => {
                headend = he.id;

                requestData = {
                    headend: headend,
                    hourBegin: begin,
                    hourEnd: end,
                    //This seems like bad behavior - this should use something other than the channel index
                    tmsGuideIds: channelSlice.map(channel => channel.tmsGuideId).join('.')
                };

                requestData = updateRequestTimeBounds(requestData);
                channelSlice.forEach(channel => {
                    channel.loading = true;
                });

                if (channelSlice.length > 0) {
                    return $http({
                        url: config.piHost +
                        config.smartTvApi +
                        config.nmdEpgsApiV1 +
                        config.epgs.guide +
                        '/' + headend +
                        config.epgs.grid,
                        method: 'GET',
                        params: requestData,
                        withCredentials: true
                    }).then(res => {
                        Object.keys(res.data).forEach((tmsGuideId) => {
                            let shows = res.data[tmsGuideId];
                            service.channels.filter(c => {
                                return c.tmsGuideId == tmsGuideId;
                            }).forEach(channel => {
                                let newShows = shows.map(show => enrichShowData(show, channel));
                                if (channel.staged && channel.staged.length > 0) {
                                    channel.staged = channel.staged.concat(newShows);
                                } else {
                                    channel.staged = newShows;
                                }
                                channel.loaded = true;
                                channel.loading = false;
                                channelSaveLoadedTime(channel, begin, end);
                            });
                            return service.channels;
                        });
                    }, function errorCallback() {
                        alert.open({
                            message: errorCodesService.getMessageForCode('WGU-1000'),
                            title: errorCodesService.getHeaderForCode('WGU-1000'),
                            buttonText: 'OK'
                        });
                    });
                } else {
                    //Determined that we didn't need to send a request
                    return $q.resolve();
                }
            });
        }

        function fetchIpChannelData(channelSlice, begin, end) {
            // Adjust begin to be an hour and day offset
            let now = new Date();
            let nowHour = now.getUTCHours();
            let hourOffset = (nowHour + begin) % 24;
            let dayOffset = Math.floor((nowHour + begin) / 24);
            let entitlementIds = channelSlice.map(channel => channel.entitlementId).join(',');

            if (channelSlice.length === 0) {
                //Determined that we didn't need to send a request
                return $q.resolve();
            }

            channelSlice.forEach(channel => {
                channel.loading = true;
            });

            // Loop, getting data in guideIpOnlyEpg.WINDOW_HOURS hour chunks which is what the API returns
            let numChunks = Math.ceil((end - begin) / guideIpOnlyEpg.WINDOW_HOURS);
            let promises = [];
            var i;
            for (i = 0; i < numChunks; i++) {
                // Create a closure so the async code below understands what chunk itis in.
                let absStartOffset = begin + (i * guideIpOnlyEpg.WINDOW_HOURS);
                let absEndOffset = absStartOffset + guideIpOnlyEpg.WINDOW_HOURS;

                promises.push(fetchIpOnlyChunk(entitlementIds, hourOffset, dayOffset, absStartOffset, absEndOffset));

                // Increment to the next guideIpOnlyEpg.WINDOW_HOURS hour chunk
                dayOffset = dayOffset + Math.floor((hourOffset + guideIpOnlyEpg.WINDOW_HOURS) / 24);
                hourOffset = (hourOffset + guideIpOnlyEpg.WINDOW_HOURS) % 24;
            }

            $q.all(promises).then(() => {
                channelSlice.forEach(channel => {
                    channel.loaded = true;
                    channel.loading = false;
                });

                return service.channels;
            });
        }

        function fetchIpOnlyChunk(entitlementIds, hourOffset, dayOffset, absStartOffset, absEndOffset) {
            let requestData = {
                hourOffset: hourOffset,
                dayOffset: dayOffset,
                entitlementIds: entitlementIds
            };

            return $http({
                url:
                config.piHost +
                config.smartTvApi +
                config.epgs.ipOnlyGuide,
                method: 'GET',
                params: requestData,
                withCredentials: true
            }).then(res => {
                Object.keys(res.data).forEach((tmsGuideId) => {
                    let shows = res.data[tmsGuideId];
                    service.channels.filter(c => {
                        return c.tmsGuideId == tmsGuideId;
                    }).forEach(channel => {
                        let newShows = shows.map(show => enrichShowData(show, channel));
                        if (channel.staged && channel.staged.length > 0) {
                            channel.staged = channel.staged.concat(newShows);
                        } else {
                            channel.staged = newShows;
                        }
                        channelSaveLoadedTime(channel, absStartOffset, absEndOffset);
                    });
                });
                return service.channels;
            }, function errorCallback() {
                alert.open({
                    message: errorCodesService.getMessageForCode('WGU-1000'),
                    title: errorCodesService.getHeaderForCode('WGU-1000'),
                    buttonText: 'OK'
                });
            });
        }

        function enrichShowData(show) {
            var endTime = show.startTimeSec + (show.durationMinutes * 60),
                classData = {};
            show.endTimeUtcSeconds = endTime;
            let nowSec = Math.round(Date.now() / 1000);
            if ((show.startTimeSec < nowSec) && (nowSec < endTime)) {
                classData.onnow = true;
            }
            classData['duration_' + show.durationMinutes] = true;
            classData['new'] = (show.icons.indexOf('New') >= 0);
            classData.series = (show.metadata && show.metadata.tmsSeriesId) ? true : false;
            classData.rating_block = show.ratingsBlocked;
            show.classData = classData;
            show.startTimeOffset = show.startTimeSec - displayEarliest;

            return show;

        }

        //Create a list of unix timestamps for every 30 minutes starting with the current hour
        function getTimeBounds() {
            let start = earliest, end = service.endTime;

            let endTime = displayEarliest;
            let timesSeconds = [displayEarliest]; //Store as seconds,
            while (endTime < end) {
                endTime += (30 * 60); //30 min blocks as seconds
                timesSeconds.push(endTime);
            }
            //The actual time bounds (since we are fixing the earliest to 2 hours before, then there isn't much we can
            //do with this info.
            latest = service.latest = end;
            earliest = service.earliest = start;
            service.times = timesSeconds.map(time => time *= 1000); //End
            return service.times;
        }

        function getZeroHour() {
            return zeroHour;
        }

        //Since the request is relative to the current time, we may have loaded data that is a few minutes out dated,
        //and the current start=0 may have advanced by an hour on the server.
        function updateRequestTimeBounds(requestData) {
            var current = new Date();
            let min = current.getMinutes();
            current.setMinutes(0);
            current.setMilliseconds(0);
            if (min > 55) {
                current.setTime(current.getTime() + (3600 * 1000));
            }
            let timeDiff = current.getTime() - zeroHour.getTime();
            if (timeDiff > (55 * 60 * 1000)) {
                //If the current time has elapsed to more than 55min past
                //the beginning of the hour then we want to decriment the begin and end by

                let decAmount = Math.floor(timeDiff / 3600000);
                requestData.hourBegin -= decAmount;
                requestData.hourEnd -= decAmount;
            }
            return requestData;
        }

        function filterChannel(channel) {

            if (filters) {
                let display = true;
                if (filters.preset && filters.preset.filter) {
                    if (!filters.preset.filter(channel)) {
                        display = false;
                    }
                }

                if (display && filters.text) {
                    display = (channel.callSign.indexOf(filters.text.toUpperCase()) >= 0);
                }
                channel.display = display;
            } else {
                channel.display = false;
            }
            return channel.display;
        }

        /**
         * Store the times that have already been loaded for the channel - combine times that are contiguious
         * @param  {channel} channel the channel to look at
         * @param  {int} start   the start time to add
         * @param  {int} end     the end time to add
         */
        function channelSaveLoadedTime(channel, start, end) {
            if (!channel.loadedTimes) {
                channel.loadedTimes = [];
            }
            channel.loadedTimes.push([start, end]);
            channel.loadedTimes = channel.loadedTimes.sort((a, b) => a[0] - b[0])
                .reduce((memo, timePair) => {
                    if (memo.length > 0 &&
                        memo[memo.length - 1][0] <= timePair[0] &&
                        memo[memo.length - 1][1] >= timePair[0]) {
                        //The times are overlapping or contiguious, the list is sorted by start, so they must
                        if (memo[memo.length - 1][1] < timePair[1]) {
                            memo[memo.length - 1][1] = timePair[1];
                        }//same or timePair is less time than what is already on the list;
                    } else {
                        //Non contiguious, just append it to the end
                        memo.push(timePair);
                    }
                    return memo;
                }, []);
        }

        function channelHasTime(channel, start, end) {
            if (!channel.loadedTimes) {
                return false;
            } else {
                return channel.loadedTimes.some(time => (time[0] < start - 1 && time[1] > end + 1));
            }
        }

        function clearProgramData() {
            service.channels.forEach(channel => {
                channel.loadedTimes = [];
            });
        }
    }
})();
