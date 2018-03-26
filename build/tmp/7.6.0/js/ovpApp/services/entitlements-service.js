'use strict';

(function () {
    'use strict';

    EntitlementsService.$inject = ["$q", "ChannelService"];
    angular.module('ovpApp.services.entitlementsService', ['ovpApp.services.channel']).service('EntitlementsService', EntitlementsService);

    /* @ngInject */
    function EntitlementsService($q, ChannelService) {
        var vm = this;
        vm.isVodNetworkEntitled = isVodNetworkEntitled;

        return vm;

        //////////////////

        function toArray(a) {
            return angular.isArray(a) ? a : [a];
        }

        function isVodNetworkEntitled(allVPPs) {
            allVPPs = toArray(allVPPs);

            var channelCheckPromises = allVPPs.map(vppVodOnlyIsEntitled);
            if (channelCheckPromises.length > 0) {
                return $q.all(channelCheckPromises).then(function (allChecks) {
                    return allChecks.some(function (entitled) {
                        return entitled;
                    });
                });
            } else {
                return $q.resolve(false);
            }
        }

        /**
         * Checks if the channel is VOD only and is entitled
         * @param vpp The product provider id to check entitlement and type of.
         */
        function vppVodOnlyIsEntitled(vpp) {
            return ChannelService.getChannelByProvider(vpp).then(function (channel) {
                if (channel) {
                    // Only interested in VOD channels, so channel must not be live.
                    return channel.entitled && !channel.live;
                }
                // If channel is not found return false. QAM not supported in VOD only setting
                return false;
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/entitlements-service.js.map
