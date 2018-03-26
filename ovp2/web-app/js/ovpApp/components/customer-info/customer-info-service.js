(function () {
    'use strict';

    angular.module('ovpApp.customerInfo.service', [
        'ovpApp.config'])
    .factory('customerInfoService', customerInfoService);

    /* @ngInject */
    function customerInfoService(config, $http, $q) {
        let name;

        let service = {
            getCustomerInfo,
            getName
        };

        return service;

        /////////////////

        function getCustomerInfo(bypassRefresh=false) {
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
                }).catch(() => {
                    return $q.reject({
                        errorCode: 'WPC-1005'
                    });
                });
        }

        function getName(bypassRefresh=false) {
            if (name) {
                return $q.resolve(name);
            } else {
                return getCustomerInfo(bypassRefresh);
            }
        }
    }
}());
