'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.ondemand.networkSubPage', ['ovpApp.ondemand.networkThreeTier', 'ovpApp.ondemand.data']).component('networkSubPage', {
        templateUrl: '/js/ovpApp/ondemand/networks/network-sub-page.html',
        bindings: {
            data: '<',
            page: '<',
            index: '<'
        }
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/ondemand/networks/network-sub-page.js.map
