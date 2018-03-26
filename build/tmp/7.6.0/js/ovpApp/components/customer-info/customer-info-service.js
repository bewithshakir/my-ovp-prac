'use strict';

(function () {
    'use strict';

    customerInfoService.$inject = ["config", "$http", "$q"];
    angular.module('ovpApp.customerInfo.service', ['ovpApp.config']).factory('customerInfoService', customerInfoService);

    /* @ngInject */
    function customerInfoService(config, $http, $q) {
        var name = undefined;

        var service = {
            getCustomerInfo: getCustomerInfo,
            getName: getName
        };

        return service;

        /////////////////

        function getCustomerInfo() {
            var bypassRefresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            return $http({
                method: 'GET',
                cache: false,
                url: config.parentalControls.parentalControlsForUserUrl(),
                withCredentials: true,
                bypassRefresh: bypassRefresh
            }).then(function (response) {
                var data = response.data;
                name = data.loggedInUsername;
                return name;
            })['catch'](function () {
                return $q.reject({
                    errorCode: 'WPC-1005'
                });
            });
        }

        function getName() {
            var bypassRefresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (name) {
                return $q.resolve(name);
            } else {
                return getCustomerInfo(bypassRefresh);
            }
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/customer-info/customer-info-service.js.map
