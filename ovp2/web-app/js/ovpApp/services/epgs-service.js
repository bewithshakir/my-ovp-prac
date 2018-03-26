(function () {
    'use strict';
    angular.module('ovpApp.services.epgsService', [
        'ovpApp.config',
        'ovpApp.components.error.ServiceError',
        'ovpApp.services.stbService'
    ])
    .factory('epgsService', epgsService)
    .factory('realEpgsService', realEpgsService);

    /* @ngInject */
    function epgsService($http, $q, ServiceError, config, stbService, profileService) {
        let piHost = config.piHost,
            smartTv = config.smartTvApi,
            nmdEpgs = config.nmdEpgsApiV1,
            channelListQam = config.epgs.channelListQam,
            channelListIp = config.epgs.channelListIp,
            channelsPromise = null,
            lookupTable = {};

        let service = {
            getChannels,
            getChannelByMystroSvcId,
            getChannelByNcsSvcId,
            clearChannels
        };

        return service;

        //////////////////////

        /**
         * Make the channels http request. Determines whether this is an IP or QAM channels request and then builds the
         * correct URL to make the request to.
         *
         * @returns {$q.defer} The promise containing the Http get response.
         */
        function getChannels() {
            if (channelsPromise === null) {
                channelsPromise = $q.all ([profileService.isIpOnlyEnabled(),
                    stbService.getHeadend()]).then(params => {
                    let ipOnlyEnabled = params[0];
                    let headend = params[1];
                    let queryParams = {};
                    let requestUrl = piHost + smartTv;
                    let enrichedChannels = [];

                    // We need to determine if we are IP based or QAM based.
                    if (!ipOnlyEnabled) {
                        // QAM based needs to have the headend set, and uses a different channelList request URL
                        if (headend) {
                            queryParams.params = {headend: headend.id};
                        }
                        requestUrl += nmdEpgs + channelListQam;
                    } else {
                        // IP based channel list request doesn't include nmdEpgs in the URL and uses a different
                        // channelList property.
                        requestUrl += channelListIp;
                    }

                    // Set the credentials query param.
                    queryParams.withCredentials = true;

                    // Make our channels request.
                    return $http.get(requestUrl, queryParams).then(function (response) {
                        enrichedChannels = enrichChannels(response.data.channels);

                        if (!ipOnlyEnabled) {
                            angular.forEach(response.data.channels, function (channel, index) {
                                // Create a lookup table for QAM based channel list for RDVR
                                if (channel && channel.mystroServiceId !== undefined &&
                                    channel.channelNumber !== undefined) {
                                    // QAM based channel properties
                                    channel.channelNumber = parseInt(channel.channelNumber);
                                    lookupTable[[channel.mystroServiceId, channel.channelNumber].join(':')] = index;
                                }
                            });
                        }
                        return enrichedChannels;
                    }, function () {
                        throw new ServiceError('Error Loading Channels');
                    });
                }, clearChannels);
            }
            return channelsPromise;
        }

        function getChannelByMystroSvcId(mystroServiceID, channelID) {
            return getChannels().then(function (channels) {
                var index = lookupTable[[mystroServiceID, channelID].join(':')];
                return (angular.isDefined(index) && channels[index]) || null;
            });
        }

        /**
         * Retrieve the channel object by using the ncsServiceId & networkId in the lookupTable
         * @param ncsServiceId The ncsServiceId, IP based lineup
         * @param networkId The networkId, IP based lineup
         * @returns {*|Promise.<T>}
         */
        function getChannelByNcsSvcId(ncsServiceId, networkId) {
            return getChannels().then(function (channels) {
                var index = lookupTable[[ncsServiceId, networkId].join(':')];
                return (angular.isDefined(index) && channels[index]) || null;
            });
        }

        /**
         * Enrich the channels data array to make the channel objects consistent despite the data origin
         * @param channels The channels array to recurse over and enrich
         *
         * @returns {Object} The newly enriched channels array
         */
        function enrichChannels(channels) {
            if (!channels) {
                return [];
            }

            let duplicates = [];

            channels.forEach(channel => {
                //If there is a channels array, then we need to extract the channel number from that data node.
                if (channel.channels && channel.channels.length) {

                    // Create a channel object for each channel number in the array.
                    channel.channels.forEach((channelNumber, channelIndex) => {

                        // If there is more than one channel in the array then we need to clone the channel object
                        // for the additional channels.
                        if (channelIndex > 0) {
                            duplicates.push(enrichChannelData(angular.extend({}, channel), channelNumber));
                        } else {
                            enrichChannelData(channel, channelNumber);
                        }
                    });
                } else {
                    enrichChannelData(channel, channel.channelNumber);
                }
            });
            channels.push(...duplicates);
            channels = channels.sort((a, b) => a.channelNumber - b.channelNumber);

            return channels;
        }

        /**
         * Enrich the passed in channel to create consistent channel objects
         * @param channel The channel object to enrich
         * @param channelNumber The channel number to use for the channel object
         *
         * @returns {Object} The newlyEnriched channel object
         */
        function enrichChannelData(channel, channelNumber) {
            return angular.extend(channel, {
                channelNumber: angular.isDefined(channelNumber) ? parseInt(channelNumber) : undefined,
                tmsGuideId: channel.tmsGuideId || channel.tmsId,
                fullLogoUrl: (channel.logoUrl && channel.logoUrl.startsWith('/') ?
                    config.piHost + channel.logoUrl : channel.logoUrl) + '?width=50&sourceType=colorhybrid'
            });
        }

        function clearChannels() {
            channelsPromise = null;
        }
    }

    // This function is here to allow this service to be mocked in test while
    // allowing the stb-serviceSpec to reference the real thing here.
    /* @ngInject */
    function realEpgsService($http, $q, ServiceError, config, stbService, profileService) {
        return epgsService($http, $q, ServiceError, config, stbService, profileService);
    }

}());
