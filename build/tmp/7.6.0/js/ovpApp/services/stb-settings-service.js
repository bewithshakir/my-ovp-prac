'use strict';

(function () {
    'use strict';

    StbSettingsService.$inject = ["stbService", "$http", "config", "messages", "$q", "$rootScope", "rx", "rxhttp", "STB_PREFERENCES_DEFAULTS", "STB_DEVICE_DEFAULTS"];
    angular.module('ovpApp.services.stbSettingsService', ['ovpApp.config', 'ovpApp.services.stbService', 'ovpApp.services.rxUtils', 'rx']).constant('STB_PREFERENCES_DEFAULTS', {
        purchases: {
            blockingEnabled: false
        },
        parentalControls: {
            titleBlock: false
        },
        bookmarks: {
            sharingEnabled: true
        }

    }).constant('STB_DEVICE_DEFAULTS', {
        purchasePIN: '0000'
    }).service('StbSettingsService', StbSettingsService);

    /* ngInject */
    function StbSettingsService(stbService, $http, config, messages, $q, $rootScope, rx, rxhttp, STB_PREFERENCES_DEFAULTS, STB_DEVICE_DEFAULTS) {
        //Defaults should go away once we have a way to get this data from the spp service
        var service,
            stbData = {},
            timeBlocks = []; // default value, TODO: fix me

        service = {
            setEnablePurchasePINForClient: setEnablePurchasePINForClient,
            getPreferences: getPreferences,
            purchasePinEnabled: purchasePinEnabled,
            titleBlockingEnabled: titleBlockingEnabled,
            setTitleBlockForClient: setTitleBlockForClient,
            shareInProgressListEnabled: shareInProgressListEnabled,
            setShareInProgressListForClient: setShareInProgressListForClient,
            getDevice: getDevice,
            setDevice: setDevice,
            updateBlockedRatings: updateBlockedRatings,
            updateBlockedContent: updateBlockedContent,
            updateBlockedChannels: updateBlockedChannels,
            updateCCSettings: updateCCSettings,
            togglePCBlocking: togglePCBlocking,
            toggleSAP: toggleSAP,
            getTimeBlocks: getTimeBlocks,
            deleteTimeBlock: deleteTimeBlock,
            createTimeBlock: createTimeBlock,
            getSTBProperties: getSTBProperties
        };

        return service;

        function getStbState(stb) {
            if (!stb) {
                throw new Error('Attempted to access a STB without defining stb');
            }
            if (!stbData[stb.macAddress]) {
                stbData[stb.macAddress] = {
                    preferences: null,
                    preferencesPromise: null,
                    deviceData: null,
                    devicePromise: null
                };
            }
            return stbData[stb.macAddress];
        }

        function getPreferences(stb) {
            var restart = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var stbState = getStbState(stb);
            if (stbState.preferences) {
                return $q.resolve(stbState.preferences);
            } else if (!stbState.preferencesPromise || restart) {
                stbState.preferencesPromise = rxhttp.get(config.piHost + '/spp/v1/preferences/' + stb.macAddress)['catch'](function (err) {
                    // TODO: STVWEB-1321: Workaround to initialize SPP
                    // You can either set them from OVP or you can wait for them to be pushed back up from ODN.
                    if (err.status === 404) {
                        return setPreferences(stb, {}).then(function () {
                            return getPreferences(stb, restart);
                        });
                    } else {
                        throw err;
                    }
                }).map(function (response) {
                    var preferences = {};
                    angular.merge(preferences, STB_PREFERENCES_DEFAULTS, response.data);
                    delete preferences.timestamp; //This value is going to be INT MAX and is invalid
                    return preferences;
                })['do'](function (preferenceResult) {
                    return stbState.preferences = preferenceResult;
                }).toPromise($q);
            }
            return stbState.preferencesPromise;
        }

        function setPreferences(stb, prefs) {
            var stbState = getStbState(stb),
                setData = {
                networkId: stb.macAddress,
                strTimestamp: stbState && stbState.preferences ? stbState.preferences.strTimestamp : Date.now().toString(),
                type: 'STB'
            };

            angular.merge(setData, prefs);

            return $http({
                method: 'PUT',
                url: config.piHost + '/spp/v1/preferences/' + stb.macAddress,
                data: setData
            }).then(function (results) {
                stbState.preferences = {};
                angular.merge(stbState.preferences, STB_PREFERENCES_DEFAULTS, results.data);
                delete stbState.preferences.timestamp;
                return stbState.preferences;
            }, function (error) {
                if (error && error.data && error.data.message === 'Stale timestamp') {
                    stbState.preferences = null;
                    stbState.preferencesPromise = null;
                }
                return $q.reject(error);
            });
        }

        function updateBlockedRatings(stb, ratings) {
            return getPreferences(stb).then(function () {
                var change = {
                    parentalControls: {
                        blockedRatings: ratings
                    }
                };
                return setPreferences(stb, change);
            });
        }

        function getDevice(stb) {
            var restart = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var stbState = getStbState(stb);
            if (stbState.deviceData) {
                return $q.resolve(stbState.deviceData);
            } else if (!stbState.devicePromise || restart) {
                stbState.devicePromise = rxhttp.get(config.piHost + '/spp/v1/devices/' + stb.macAddress).retry(3).map(function (response) {
                    var deviceData = {};
                    angular.merge(deviceData, STB_DEVICE_DEFAULTS, response.data);
                    delete deviceData.timestamp; //This will be beyond the range of JS Int
                    return deviceData;
                })['do'](function (deviceResult) {
                    return stbState.deviceData = deviceResult;
                }).toPromise($q);
            }

            return stbState.devicePromise;
        }

        function setDevice(stb, device) {
            var stbState = getStbState(stb);
            var setData = {
                networkId: stb.macAddress,
                strTimestamp: stbState.deviceData.strTimestamp,
                type: 'STB'
            };

            angular.merge(setData, device);

            return $http({
                method: 'PUT',
                url: config.piHost + '/spp/v1/devices/' + stb.macAddress,
                data: setData
            }).then(function (results) {
                stbState.deviceData = {};
                angular.merge(stbState.deviceData, STB_DEVICE_DEFAULTS, results.data);
                delete stbState.deviceData.timestamp;
            }, function (error) {
                if (error && error.data && error.data.message === 'Stale timestamp') {
                    stbState.deviceData = null;
                    stbState.devicePromise = null;
                }
                return $q.reject(error);
            });
        }

        function setEnablePurchasePINForClient(stb, enabled) {
            return getPreferences(stb).then(function (currentPreferences) {
                if (currentPreferences.purchases.blockingEnabled !== enabled) {
                    var change = {
                        purchases: {
                            blockingEnabled: enabled
                        }
                    };
                    return setPreferences(stb, change);
                } else {
                    return currentPreferences;
                }
            });
        }

        function purchasePinEnabled(stb) {
            return getPreferences(stb).then(function (pref) {
                return pref.purchases.blockingEnabled;
            });
        }

        /* parentalControls title block interface */
        function titleBlockingEnabled(stb) {
            return getPreferences(stb).then(function (pref) {
                return pref.parentalControls.titleBlock;
            });
        }

        function setTitleBlockForClient(stb, state) {
            return getPreferences(stb).then(function (currentPreferences) {

                if (currentPreferences.parentalControls.titleBlock !== state) {
                    var change = {
                        parentalControls: {
                            titleBlock: state
                        }
                    };
                    return setPreferences(stb, change);
                } else {
                    return currentPreferences;
                }
            });
        }

        /* parentalControls share-in-progress-list interface */
        function shareInProgressListEnabled(stb) {
            return getPreferences(stb).then(function (pref) {
                return pref.bookmarks.sharingEnabled;
            });
        }

        function setShareInProgressListForClient(stb, state) {
            return getPreferences(stb).then(function (currentPreferences) {
                if (currentPreferences.bookmarks.sharingEnabled !== state) {
                    var change = {
                        bookmarks: {
                            sharingEnabled: state
                        }
                    };
                    return setPreferences(stb, change);
                } else {
                    return currentPreferences;
                }
            });
        }

        /* PC blocking */
        function togglePCBlocking(stb, value) {
            return getPreferences(stb).then(function (currentPreferences) {
                if (currentPreferences.parentalControls.blockingEnabled !== value) {
                    var change = {
                        parentalControls: {
                            blockingEnabled: value
                        }
                    };
                    return setPreferences(stb, change);
                } else {
                    return currentPreferences;
                }
            });
        }

        function toggleSAP(stb, value) {
            return getPreferences(stb).then(function (currentPreferences) {
                if (!currentPreferences.secondaryAudio || currentPreferences.secondaryAudio.selection !== value) {
                    var change = {
                        secondaryAudio: {
                            selection: value
                        }
                    };
                    return setPreferences(stb, change);
                } else {
                    return currentPreferences;
                }
            });
        }

        function getSTBProperties(stb) {
            return $http({
                method: 'GET',
                url: config.piHost + '/spp/v1/preferences/properties?networkId=' + stb.macAddress
            }).then(function (results) {
                return results.data;
            });
        }

        function updateBlockedContent(stb, content) {
            return getPreferences(stb).then(function () {
                var change = {
                    parentalControls: {
                        blockedContent: content
                    }
                };
                return setPreferences(stb, change);
            });
        }

        function updateBlockedChannels(stb, channelNumbers) {
            return getPreferences(stb).then(function () {
                var change = {
                    parentalControls: {
                        blockedChannels: channelNumbers
                    }
                };
                return setPreferences(stb, change);
            });
        }

        function updateCCSettings(stb, ccSettings) {
            return getPreferences(stb).then(function () {
                var change = {
                    closedCaptioning: ccSettings
                };
                return setPreferences(stb, change);
            });
        }

        function getTimeBlocks() {
            return $q.resolve(timeBlocks);
        }

        function deleteTimeBlock(timeBlock) {
            var index = timeBlocks.indexOf(timeBlock);
            if (index >= 0) {
                timeBlocks.splice(index, 1);
            }
            return $q.resolve(timeBlocks);
        }

        function createTimeBlock(timeBlock) {
            if (isDuplicate(timeBlock)) {
                return $q.reject(messages.stbSettings.duplicate_timeblock);
            }

            timeBlocks.push(timeBlock);
            return $q.resolve(timeBlocks);
        }

        function isDuplicate(timeBlock) {
            var isDup = false;
            timeBlocks.forEach(function (tb) {
                if (angular.equals(tb, timeBlock)) {
                    isDup = true;
                }
            });

            return isDup;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/stb-settings-service.js.map
