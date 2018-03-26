/* globals window */
'use strict';

(function () {
    'use strict';
    angular.module('ovpApp.config').constant('environmentConstants', {
        ENVIRONMENT_PRODUCTION: 'prod'
    }).provider('config', ConfigProvider);

    function ConfigProvider() {
        var currentConfig = window.currentConfig;

        //Used in the twctv-ui-router to get the current name
        this.get = function () {
            return currentConfig;
        };

        /* @ngInject */
        this.$get = ["$injector", function ($injector) {
            //Append this function to the config once we have instantiated the rest of the services
            if (!currentConfig.fetchAuthenticatedConfig) {
                currentConfig.fetchAuthenticatedConfig = function () {
                    var $http = $injector.get('$http');

                    var url = currentConfig.piHost + currentConfig.services.configAuth;
                    var configData = {
                        clientType: 'ONEAPP-OVP',
                        apiKey: currentConfig.oAuth.consumerKey,
                        deviceId: currentConfig.deviceId.toUpperCase(),
                        appVersion: currentConfig.majorMinorVersion,
                        deviceType: currentConfig.deviceType,
                        osVersion: currentConfig.osVersion
                    };

                    return $http({
                        method: 'POST',
                        url: url,
                        data: configData,
                        withCredentials: true,
                        bypassRefresh: true
                    }).then(function (result) {
                        if (result && result.data) {
                            var config = result.data.config;
                            if (!config) {
                                config = {};
                            }
                            currentConfig.installOverrides(config);
                        }
                        return currentConfig;
                    });
                };
            }

            return currentConfig;
        }];
        this.$get.$inject = ["$injector"];
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/config/config-service.js.map
