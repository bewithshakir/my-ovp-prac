(() => {
    'use strict';
    angular.module('ovpApp.components.channelIdentifier', [])
        .component('channelIdentifier', {
            templateUrl: '/js/ovpApp/components/channel-identifier/channel-identifier.html',
            bindings: {
                item: '<'
            }
        });
})();
