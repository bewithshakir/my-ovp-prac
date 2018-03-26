'use strict';

(function () {
    'use strict';

    ChannelService.$inject = ["config", "rxhttp", "$q"];
    angular.module('ovpApp.services.channel', ['ovpApp.config', 'ovpApp.services.epgsService', 'ovpApp.services.rxUtils']).service('ChannelService', ChannelService);

    /* @ngInject */
    function ChannelService(config, rxhttp, $q) {
        var vm = this;

        vm.channels = null;
        vm.channelsPromise = null;
        vm.getChannels = getChannels;
        vm.getChannelByProvider = getChannelByProvider;
        vm.getChannelByTmsId = getChannelByTmsId;
        vm.getChannelByChannelNumber = getChannelByChannelNumber;
        vm.getChannelByNetwork = getChannelByNetwork;

        return vm;

        ////////////

        function getChannels() {
            var refresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (refresh || !vm.channelsPromise) {
                vm.channelsPromise = rxhttp.get(config.parentalControls.parentalControlsByChannelUrl() + '?includeUnentitled=true', { withCredentials: true }).retry(3).map(function (result) {
                    if (result.data) {
                        vm.channels = result.data.map(function (network) {
                            if (network.services) {
                                return network.services.map(function (service) {
                                    service.network = network;
                                    if (service.productProviders) {
                                        service.productProviders = service.productProviders.map(function (provider) {
                                            return provider.toUpperCase();
                                        });
                                    }
                                    return service;
                                });
                            }
                        }).reduce(function (memo, services) {
                            return memo.concat(services);
                        }, []);
                    }
                    return vm.channels;
                }).toPromise($q);
                return vm.channelsPromise;
            } else {
                return vm.channelsPromise;
            }
        }

        function getChannelByProvider(providerId) {
            if (angular.isArray(vm.channels)) {
                providerId = providerId.toUpperCase();
                var channel = vm.channels.find(function (channel) {
                    if (channel.productProviders) {
                        return channel.productProviders.indexOf(providerId) > -1;
                    }
                });
                return $q.resolve(channel);
            } else {
                return getChannels().then(function () {
                    return getChannelByProvider(providerId);
                });
            }
        }

        function getChannelByTmsId(tmsId) {
            if (angular.isArray(vm.channels)) {
                return $q.resolve(vm.channels.find(function (channel) {
                    return channel.tmsGuideId && channel.tmsGuideId == tmsId;
                }));
            } else {
                return getChannels().then(function () {
                    return getChannelByTmsId(tmsId);
                });
            }
        }

        function getChannelByChannelNumber(channelNumber) {
            if (angular.isArray(vm.channels)) {
                channelNumber = parseInt(channelNumber);
                var channel = vm.channels.find(function (channel) {
                    return channel.channels && channel.channels.indexOf(channelNumber) >= 0;
                });
                return $q.resolve(channel);
            } else {
                return getChannels().then(function () {
                    return getChannelByChannelNumber(channelNumber);
                });
            }
        }

        function getChannelByNetwork(network) {
            if (angular.isArray(vm.channels)) {
                var channels = [];
                if (network.product_provider) {
                    (function () {
                        var providerId = network.product_provider.toUpperCase();
                        channels = vm.channels.filter(function (channel) {
                            if (channel.productProviders) {
                                return channel.productProviders.indexOf(providerId) > -1;
                            }
                        });
                    })();
                } else {
                    channels = vm.channels.filter(function (channel) {
                        return channel.callsign === network.callsign;
                    });
                }
                return $q.resolve(channels);
            } else {
                return getChannels().then(function () {
                    return getChannelByNetwork(network);
                });
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/channel-service.js.map
