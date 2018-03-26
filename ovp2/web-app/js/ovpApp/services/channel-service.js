(function () {
    'use strict';

    angular.module('ovpApp.services.channel', [
        'ovpApp.config',
        'ovpApp.services.epgsService',
        'ovpApp.services.rxUtils'
    ])
    .service('ChannelService', ChannelService);

    /* @ngInject */
    function ChannelService(config, rxhttp, $q) {
        let vm = this;

        vm.channels = null;
        vm.channelsPromise = null;
        vm.getChannels = getChannels;
        vm.getChannelByProvider = getChannelByProvider;
        vm.getChannelByTmsId = getChannelByTmsId;
        vm.getChannelByChannelNumber = getChannelByChannelNumber;
        vm.getChannelByNetwork = getChannelByNetwork;

        return vm;

        ////////////

        function getChannels(refresh = false) {
            if (refresh || !vm.channelsPromise) {
                vm.channelsPromise = rxhttp.get(
                    config.parentalControls.parentalControlsByChannelUrl() + '?includeUnentitled=true',
                    {withCredentials: true})
                    .retry(3)
                    .map(result => {
                        if (result.data) {
                            vm.channels = result.data
                                .map(network => {
                                    if (network.services) {
                                        return network.services.map(service => {
                                            service.network = network;
                                            if (service.productProviders) {
                                                service.productProviders = service.productProviders
                                                    .map(provider => provider.toUpperCase());
                                            }
                                            return service;
                                        });
                                    }
                                })
                                .reduce((memo, services) => {
                                    return memo.concat(services);
                                }, []);
                        }
                        return vm.channels;
                    })
                    .toPromise($q);
                return vm.channelsPromise;
            } else {
                return vm.channelsPromise;
            }
        }

        function getChannelByProvider(providerId) {
            if (angular.isArray(vm.channels)) {
                providerId = providerId.toUpperCase();
                let channel = vm.channels.find(channel => {
                    if (channel.productProviders) {
                        return (channel.productProviders.indexOf(providerId) > -1);
                    }
                });
                return $q.resolve(channel);
            } else {
                return getChannels().then(() => getChannelByProvider(providerId));
            }
        }

        function getChannelByTmsId(tmsId) {
            if (angular.isArray(vm.channels)) {
                return $q.resolve(vm.channels.find(channel => (channel.tmsGuideId && channel.tmsGuideId == tmsId)));
            } else {
                return getChannels().then(() => getChannelByTmsId(tmsId));
            }
        }

        function getChannelByChannelNumber(channelNumber) {
            if (angular.isArray(vm.channels)) {
                channelNumber = parseInt(channelNumber);
                let channel = vm.channels.find(channel => {
                    return (channel.channels && channel.channels.indexOf(channelNumber) >= 0);
                });
                return $q.resolve(channel);
            } else {
                return getChannels().then(() => getChannelByChannelNumber(channelNumber));
            }
        }

        function getChannelByNetwork(network) {
            if (angular.isArray(vm.channels)) {
                let channels = [];
                if (network.product_provider) {
                    let providerId = network.product_provider.toUpperCase();
                    channels = vm.channels.filter(channel => {
                        if (channel.productProviders) {
                            return (channel.productProviders.indexOf(providerId) > -1);
                        }
                    });
                } else {
                    channels = vm.channels.filter(channel => {
                        return (channel.callsign === network.callsign);
                    });
                }
                return $q.resolve(channels);
            } else {
                return getChannels().then(() => getChannelByNetwork(network));
            }
        }

    }
}());
