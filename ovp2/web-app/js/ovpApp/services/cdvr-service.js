(function () {
    'use strict';
    angular.module('ovpApp.services.cdvr', [
        'ovpApp.config',
        'ovpApp.dataDelegate',
        'ovpApp.product.service',
        'angularMoment',
        'ovpApp.messages',
        'ovpApp.services.entry',
        'ovpApp.services.channel',
        'ovpApp.services.errorCodes'
    ])
    .factory('cdvrService', CdvrService);

    /* @ngInject */
    function CdvrService(config, $http, $log, $q, productService, entryService, delegateFactory, moment,
        ChannelService, errorCodesService) {

        let service = {
            getProgramList,
            getScheduled,
            scheduleRecording,
            cancelRecording,
            deleteRecording,
            scheduleSeriesRecording,
            cancelSeriesRecording,
            getChannelNumber
        };

        return service;

        function getProgramList() {
            return entryService.forDefaultProfile().then(services => {
                return $http({
                    url: config.piHost + services.cdvr(),
                    withCredentials: true,
                    method: 'GET'
                }).then(results => {
                    if (results && results.data && results.data.results) {
                        let recorded = results.data.results
                            .find(pages => pages.context === 'recorded');
                        if (recorded && recorded.media) {
                            let recordings = recorded.media
                                .map(delegateFactory.createInstance);
                            return recordings;
                        } else {
                            return [];
                        }
                    } else {
                        throw 'Unable to get the list of recordings';
                    }
                })
                .catch(handleError);
            });
        }

        function getScheduled() {
            return entryService.forDefaultProfile().then(services => {
                return $http({
                    url: config.piHost + services.cdvr(),
                    withCredentials: true,
                    method: 'GET'
                }).then(results => {
                    if (results && results.data && results.data.results) {
                        let scheduled = results.data.results
                            .find(pages => pages.context === 'scheduled');
                        if (scheduled && scheduled.media) {
                            let scheduledRecordings = scheduled.media
                                .map(delegateFactory.createInstance)
                                .reduce((memo, scheduled) => {
                                    let today = moment().hours(0).minutes(0).seconds(0).unix();
                                    let stream = scheduled.nextLinearStream;
                                    if (stream && stream.streamProperties) {
                                        let day = moment(parseInt(stream.streamProperties.startTime));
                                        let date = day.format('MMMM Do');
                                        if (!memo[date]) {
                                            memo[date] = {
                                                label: day.format('dddd'),
                                                date: date,
                                                startTime: day.hours(0).minutes(0).seconds(0).unix(),
                                                recordings: []
                                            };
                                            if (day.unix() < (today + 86400)) {
                                                memo[date].label = 'Today';
                                            } else if (day.unix() < (today + 172800)) {
                                                memo[date].label = 'Tomorrow';
                                            }
                                        }
                                        scheduled.day = memo[date];
                                        memo[date].recordings.push(scheduled);
                                    } else {
                                        $log.warn('Unable to find next linear stream', scheduled);
                                    }
                                    return memo;
                                }, {});
                            scheduledRecordings = Object.keys(scheduledRecordings)
                                .map(key => scheduledRecordings[key])
                                .sort((a,b) => a.startTime - b.startTime);
                            return scheduledRecordings;
                        } else {
                            return [];
                        }
                    } else {
                        throw 'Unable to get the list of recordings';
                    }
                })
                .catch(handleError);
            });
        }

        function handleError() {
            // We need to show the error message to the user whenever there is some
            // error from the NNS. It could be 504 or 404 or 403 so no need to add
            // the specific check and just show the error message.
            return $q.reject(errorCodesService.getMessageForCode('WCD-1006'));
        }

        // Record a single instance of a program
        function scheduleRecording(action, stream) {
            let streamProps = stream.streamProperties;

            let postParams = {
                startTimeSec: parseInt(streamProps.startTime, 10) / 1000,
                stopTimeSec: parseInt(streamProps.endTime, 10) / 1000
            };

            return doIpvsAction(action, postParams);
        }


        // Schedule a series. Options are the POST params specified by IPVS
        function scheduleSeriesRecording(action, options) {
            return doIpvsAction(action, options);
        }

        // Schedule a series.
        function cancelSeriesRecording(action) {
            return doIpvsAction(action);
        }

        // Cancel a scheduled program
        function cancelRecording(action) {
            return doIpvsAction(action);
        }

        // Delete a recorded program
        function deleteRecording(action) {
            return doIpvsAction(action);
        }

        function doIpvsAction(action, options) {
            let ipvsAction = action.ipvsAction;

            let url = config.piHost + ipvsAction.baseUri;

            return $http({
                url: url,
                withCredentials: true,
                method: ipvsAction.operation,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: options
            });
        }

        function getChannelNumber(show) {
            if (show.latestEpisode && show.latestEpisode.cdvrRecordedStream) {
                let stream = show.latestEpisode.cdvrRecordedStream;
                if (stream.streamProperties &&
                    stream.streamProperties.cdvrRecording &&
                    stream.streamProperties.cdvrRecording.tmsGuideId) {
                    let tmsGuideId = stream.streamProperties.cdvrRecording.tmsGuideId;
                    return ChannelService.getChannelByTmsId(tmsGuideId).then(service => {
                        if (service && service.channels) {
                            return service.channels[0];
                        } else {
                            return '';
                        }
                    });
                } else {
                    return $q.reject('Unable to find cdvrRecording');
                }
            } else if (show.network && show.network.callsign) {
                return ChannelService.getChannelByNetwork(show.network).then(channels => {
                    let chan = channels.find(channel => channel.channels && channel.channels.length > 0);
                    if (!chan) {
                        chan = channels.filter(channel => channel.network && channel.network.services)
                            .reduce((channelWithNumber,channel) => {
                                if (!channelWithNumber) {
                                    return channel.network.services.find(
                                        channel => channel.channels && channel.channels.length > 0);
                                }
                                return channelWithNumber;
                            }, null);
                    }
                    if (chan) {
                        return chan.channels[0];
                    } else {
                        return '';
                    }
                });
            } else {
                return $q.reject('Unable to find channel / service information');
            }
        }
    }
})();
