(function () {
    'use strict';

    angular.module('ovpApp.service.vpns', [
            'ovpApp.config',
            'ovpApp.hnav.vpns',
            'ovpApp.services.ovpStorage',
            'ovpApp.legacy.deviceid'
        ])
        .constant('vpnsEventMap', {
            'Alert': 'VpnsAlert'
        })
        .factory('easFlag', easFlag)
        .factory('fipsService', fipsService)
        .factory('vpnsService', vpnsService);

    /* @ngInject */
    function vpnsService($q, $log, config, $rootScope, fipsService, ovpStorage, storageKeys,
        VpnsClient, vpnsEventMap, easFlag, deviceid) {
        // Do not process VPNS message if it's not enabled
        if (!easFlag.isEnabled) {
            return {};
        }
        return fipsService.then((fips) => {
            var client = new VpnsClient({
                baseUri: config.vpns.baseUri || 'https://vpns-sys.timewarnercable.com',
                deviceId: deviceid.get(),
                filters: {
                    Alert: {
                        FIPS: fips
                    }
                },
                msgTypes: ['Alert'],
                onError: function (log, level='debug') {
                    if ($log[level]) {
                        $log[level](log);
                    } else {
                        $log.debug(log);
                    }
                },
                onMessage: function (message) {
                    // parse the envelope for expected `GenericeMessage` keys
                    var type = message && message.GenericMessage && message.GenericMessage.type;
                    var data = message && message.GenericMessage;

                    // extract supported event name
                    var name = vpnsEventMap[type];

                    // bail out if we do not support the event or there is no data
                    if (!name || !data) {
                        return;
                    }

                    $log.debug({
                        msg: 'VPNS notification',
                        name: name,
                        envelope: message
                    });

                    $rootScope.$emit(name, data);
                },
                pollOnInit: true,
                store: ovpStorage,
                clientIdKey: storageKeys.vpnsClientId,
                sessionIdKey: storageKeys.vpnsSessionId,
                availableTypesKey: storageKeys.vpnsAvailableTypes,
                registrationDataKey: storageKeys.vpnsRegistrationData
            }).start();

            return client;
        }, (err) => {
            $log.error('Failed to load FIPS data');
            return err;
        })
        .then(null, (err) => {
            $log.error('Can not start VPNS client');
            return err;
        });
    }

    function easFlag(config) {
        return {isEnabled: config.getBool(config.easEnabled)};
    }

    /* @ngInject */
    function fipsService($http, config, easFlag) {
        // Do not process VPNS message if it's not enabled
        if (!easFlag.isEnabled) {
            return {};
        }

        return $http({
                method: 'GET',
                url: `${config.piHost}${config.services.fips}`,
                withCredentials: true
            })
            .then((response) => {
                let fips = [];
                let keys = function * (fips) {
                    for (let fip of Object.keys(fips)) {
                        yield fips[fip];
                    }
                };
                for (let fip of keys(response.data)) {
                    fips.push(fip);
                }
                return fips;
            });
    }
}());
