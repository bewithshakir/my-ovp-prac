'use strict';

(function () {
    'use strict';

    vpnsService.$inject = ["$q", "$log", "config", "$rootScope", "fipsService", "ovpStorage", "storageKeys", "VpnsClient", "vpnsEventMap", "easFlag", "deviceid"];
    fipsService.$inject = ["$http", "config", "easFlag"];
    easFlag.$inject = ["config"];
    angular.module('ovpApp.service.vpns', ['ovpApp.config', 'ovpApp.hnav.vpns', 'ovpApp.services.ovpStorage', 'ovpApp.legacy.deviceid']).constant('vpnsEventMap', {
        'Alert': 'VpnsAlert'
    }).factory('easFlag', easFlag).factory('fipsService', fipsService).factory('vpnsService', vpnsService);

    /* @ngInject */
    function vpnsService($q, $log, config, $rootScope, fipsService, ovpStorage, storageKeys, VpnsClient, vpnsEventMap, easFlag, deviceid) {
        // Do not process VPNS message if it's not enabled
        if (!easFlag.isEnabled) {
            return {};
        }
        return fipsService.then(function (fips) {
            var client = new VpnsClient({
                baseUri: config.vpns.baseUri || 'https://vpns-sys.timewarnercable.com',
                deviceId: deviceid.get(),
                filters: {
                    Alert: {
                        FIPS: fips
                    }
                },
                msgTypes: ['Alert'],
                onError: function onError(log) {
                    var level = arguments.length <= 1 || arguments[1] === undefined ? 'debug' : arguments[1];

                    if ($log[level]) {
                        $log[level](log);
                    } else {
                        $log.debug(log);
                    }
                },
                onMessage: function onMessage(message) {
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
        }, function (err) {
            $log.error('Failed to load FIPS data');
            return err;
        }).then(null, function (err) {
            $log.error('Can not start VPNS client');
            return err;
        });
    }

    function easFlag(config) {
        return { isEnabled: config.getBool(config.easEnabled) };
    }

    /* @ngInject */
    function fipsService($http, config, easFlag) {
        // Do not process VPNS message if it's not enabled
        if (!easFlag.isEnabled) {
            return {};
        }

        return $http({
            method: 'GET',
            url: '' + config.piHost + config.services.fips,
            withCredentials: true
        }).then(function (response) {
            var fips = [];
            var keys = regeneratorRuntime.mark(function keys(fips) {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fip;

                return regeneratorRuntime.wrap(function keys$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            context$4$0.prev = 3;
                            _iterator = Object.keys(fips)[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                context$4$0.next = 12;
                                break;
                            }

                            fip = _step.value;
                            context$4$0.next = 9;
                            return fips[fip];

                        case 9:
                            _iteratorNormalCompletion = true;
                            context$4$0.next = 5;
                            break;

                        case 12:
                            context$4$0.next = 18;
                            break;

                        case 14:
                            context$4$0.prev = 14;
                            context$4$0.t0 = context$4$0['catch'](3);
                            _didIteratorError = true;
                            _iteratorError = context$4$0.t0;

                        case 18:
                            context$4$0.prev = 18;
                            context$4$0.prev = 19;

                            if (!_iteratorNormalCompletion && _iterator['return']) {
                                _iterator['return']();
                            }

                        case 21:
                            context$4$0.prev = 21;

                            if (!_didIteratorError) {
                                context$4$0.next = 24;
                                break;
                            }

                            throw _iteratorError;

                        case 24:
                            return context$4$0.finish(21);

                        case 25:
                            return context$4$0.finish(18);

                        case 26:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, keys, this, [[3, 14, 18, 26], [19,, 21, 25]]);
            });
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = keys(response.data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var fip = _step2.value;

                    fips.push(fip);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return fips;
        });
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/vpns-service.js.map
