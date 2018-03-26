/* globals md5 */
'use strict';

(function () {
    'use strict';

    ovpStorage.$inject = ["$window", "$q", "storageKeys", "customerInfoService", "$transitions"];
    angular.module('ovpApp.services.ovpStorage', ['ovpApp.customerInfo.service']).constant('storageKeys', {
        accessibilityEnabled: 'accessibilityEnabled',
        appLink: 'appLink',
        behindOwnModem: 'behindOwnModem',
        ccSettings: 'ccSettings',
        ccEnabled: 'ccEnabled',
        channelsSortByType: 'channelsSortByType',
        currentStb: 'currentStb',
        currentUser: 'currentUser',
        drmSessionKey: 'drmSessionKey',
        guideFilter: 'guideFilter',
        lastViewedChannelFilter: 'lastViewedChannelFilter',
        loginRememberMe: 'loginRememberMe',
        muted: 'muted',
        parentalControlsAccepted: 'parentalControlsAccepted',
        parentalControlsChannelEnabled: 'parentalControlsChannelEnabled',
        parentalControlsDisabled: 'parentalControlsDisabled',
        parentalControlsLocalPin: 'parentalControlsLocalPin',
        parentalControlsUnlocked: 'parentalControlsUnlocked',
        purchasePinDisabled: 'purchasePinDisabled',
        purchasePinLocal: 'purchasePinLocal',
        rdvrDisplayType: 'rdvrDisplayType',
        recentHistory: 'recentHistory',
        recentSearches: 'recentSearches',
        recordingGridCategoryViewMode: 'recordingGridCategoryViewMode',
        sapEnabled: 'sapEnabled',
        scheduledListViewMode: 'scheduledListViewMode',
        specuTermsAccepted: 'specuTermsAccepted',
        vodMinorCategoryViewMode: 'vodMinorCategoryViewMode',
        volumeLevel: 'volumeLevel',
        vpnsAvailableTypes: 'vpnsAvailableTypes',
        vpnsClientId: 'vpnsClientId',
        vpnsRegistrationData: 'vpnsRegistrationData',
        vpnsSessionId: 'vpnsSessionId',
        deviceId: 'device_id',
        env: 'env',
        cdvr: 'cdvrEnv',
        environmentTools: 'environmentTools',
        environmentToolsMinimized: 'environmentToolsMinimized',
        configOverride: 'configOverride',
        figaroOverride: 'figaroOverride',
        httpOverride: 'httpOverride',
        bulkMDUOverrideEnabled: 'bulkMDUOverrideEnabled',
        visualizerEnabled: 'visualizerEnabled',
        onDemandScrollCachePosition: 'onDemandScrollCachePosition',
        specUUserName: 'specu',
        bulkMDUUserName: 'bulkMDU',
        autoAuthSignOutTime: 'autoAuthSignOutTime',
        ignoreMobileCheck: 'ignoreMobileCheck',
        specUToBulkMDU: 'specUToBulkMDU'
    }).factory('ovpStorage', ovpStorage);

    var storageLocation = {
        USER: 'USER',
        LOCAL: 'LOCAL',
        SESSION: 'SESSION'
    };

    var storageConfig = {
        accessibilityEnabled: {
            keyName: 'accessibilityEnabled',
            location: storageLocation.USER
        },
        appLink: {
            keyName: 'appLink',
            location: storageLocation.LOCAL
        },
        appVersion: {
            keyName: 'appVersion',
            location: storageLocation.SESSION
        },
        behindOwnModem: {
            keyName: 'behindOwnModem',
            location: storageLocation.SESSION
        },
        ccEnabled: {
            keyName: 'ccEnabled',
            location: storageLocation.USER
        },
        ccSettings: {
            keyName: 'ccSettings',
            location: storageLocation.USER
        },
        channelsSortByType: {
            keyName: 'channelsSortbyType',
            location: storageLocation.USER
        },
        currentStb: {
            keyName: 'currentStb',
            location: storageLocation.USER
        },
        currentUser: {
            keyName: 'currentUser',
            location: storageLocation.LOCAL
        },
        drmSessionKey: {
            keyName: 'drmSession',
            location: storageLocation.SESSION
        },
        guideFilter: {
            keyName: 'guideFilter',
            location: storageLocation.USER
        },
        lastViewedChannelFilter: {
            keyName: 'lastViewedChannelFilter',
            location: storageLocation.USER
        },
        loginRememberMe: {
            keyName: 'loginRememberMe',
            location: storageLocation.LOCAL
        },
        muted: {
            keyName: 'muted',
            location: storageLocation.USER
        },
        parentalControlsAccepted: {
            keyName: 'parentalControlsAccepted',
            location: storageLocation.USER
        },
        parentalControlsChannelEnabled: {
            keyName: 'parentalControlsChannelEnabled',
            location: storageLocation.USER
        },
        parentalControlsDisabled: {
            keyName: 'parentalControlsDisabled',
            location: storageLocation.USER
        },
        parentalControlsLocalPin: {
            keyName: 'parentalControlsLocalPin',
            location: storageLocation.USER
        },
        parentalControlsUnlocked: {
            keyName: 'parentalControlsUnlocked',
            location: storageLocation.SESSION
        },
        purchasePinDisabled: {
            keyName: 'purchasePinDisabled',
            location: storageLocation.USER
        },
        purchasePinLocal: {
            keyName: 'purchasePinLocal',
            location: storageLocation.USER
        },
        rdvrDisplayType: {
            keyName: 'rdvrDisplayType',
            location: storageLocation.USER
        },
        recentHistory: {
            keyName: 'recentHistory',
            location: storageLocation.USER
        },
        recentSearches: {
            keyName: 'recentSearches',
            location: storageLocation.USER
        },
        recordingGridCategoryViewMode: {
            keyName: 'recordingGridCategoryViewMode',
            location: storageLocation.USER
        },
        sapEnabled: {
            keyName: 'sapEnabled',
            location: storageLocation.USER
        },
        scheduledListViewMode: {
            keyName: 'scheduledListViewMode',
            location: storageLocation.USER
        },
        specuTermsAccepted: {
            keyName: 'specuTermsAccepted',
            location: storageLocation.USER
        },
        visualizerEnabled: {
            keyName: 'visualizerEnabled',
            location: storageLocation.SESSION
        },
        volumeLevel: {
            keyName: 'volumeLevel',
            location: storageLocation.USER
        },
        vpnsAvailableTypes: {
            keyName: 'vpnsAvailableTypes',
            location: storageLocation.LOCAL
        },
        vpnsClientId: {
            keyName: 'vpnsClientId',
            location: storageLocation.LOCAL
        },
        vpnsRegistrationData: {
            keyName: 'vpnsRegistrationData',
            location: storageLocation.LOCAL
        },
        vpnsSessionId: {
            keyName: 'vpnsSessionId',
            location: storageLocation.LOCAL
        },
        deviceId: {
            keyName: 'deviceId',
            location: storageLocation.LOCAL
        },
        env: {
            keyName: 'env',
            location: storageLocation.LOCAL
        },
        cdvrEnv: {
            keyName: 'cdvr',
            location: storageLocation.SESSION
        },
        environmentTools: {
            keyName: 'environmentTools',
            location: storageLocation.SESSION
        },
        environmentToolsMinimized: {
            keyName: 'environmentTools-minimized',
            location: storageLocation.SESSION
        },
        configOverride: {
            keyName: 'configOverride',
            location: storageLocation.SESSION
        },
        figaroOverride: {
            keyName: 'figaroOverride',
            location: storageLocation.SESSION
        },
        httpOverride: {
            keyName: 'httpOverride',
            location: storageLocation.SESSION
        },
        bulkMDUOverrideEnabled: {
            keyName: 'bulkMDUOverrideEnabled',
            location: storageLocation.SESSION
        },
        onDemandScrollCachePosition: {
            keyName: 'onDemandScrollCachePosition',
            location: storageLocation.SESSION
        },
        autoAuthSignOutTime: {
            keyName: 'autoAuthSignOutTime',
            location: storageLocation.LOCAL
        },
        ignoreMobileCheck: {
            keyName: 'ignoreMobileCheck',
            location: storageLocation.SESSION
        }
    };

    var userName = undefined;

    /* @ngInject */
    function ovpStorage($window, $q, storageKeys, customerInfoService, $transitions) {
        var localStorage = undefined,
            sessionStorage = undefined,
            service = {
            initUserStorage: initUserStorage,
            setItem: setItem,
            getItem: getItem,
            removeItem: removeItem,
            localStorage: localStorage
        };

        /////////////////////

        activate();

        return service;

        function activate() {
            if (isLocalStorageSupported()) {
                localStorage = $window.localStorage;
            } else {
                localStorage = new TemporaryStorage();
            }

            if (isSessionStorageSupported()) {
                sessionStorage = $window.sessionStorage;
            } else {
                sessionStorage = new TemporaryStorage();
            }

            // Seed the user with what local storage says. If this is a new
            // login, then the login process will call initUserStorage() to cause
            // us to override this value with the now current user.
            userName = getItem(storageKeys.currentUser);

            $transitions.onStart({ to: 'login' }, cleanUp);
        }

        function isSessionStorageSupported() {
            if ($window.sessionStorage) {
                try {
                    // Check for private mode (Safari - sessionStorage not supported in private mode)
                    $window.sessionStorage.setItem('storageCheck', 'test');
                    $window.sessionStorage.removeItem('storageCheck');
                } catch (e) {
                    // Safari private mode
                    return false;
                }
            }
            return true;
        }

        function isLocalStorageSupported() {
            if ($window.localStorage) {
                try {
                    // Check for private mode (Safari - localStorage not supported in private mode)
                    $window.localStorage.setItem('storageCheck', 'test');
                    $window.localStorage.removeItem('storageCheck');
                } catch (e) {
                    // Safari private mode
                    return false;
                }
            }
            return true;
        }

        function initUserStorage() {
            var bypassRefresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            return getUserName(bypassRefresh).then(function (name) {
                setItem(storageKeys.currentUser, name);
            });
        }

        function cleanUp() {
            removeItem(storageKeys.currentUser);
            removeItem(storageKeys.vpnsClientId);
            userName = undefined;
        }

        function setItem(key, value) {
            var encrypt = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            var keyName = undefined;
            var location = undefined;
            var config = storageConfig[key];

            if (config) {
                location = config.location;
                keyName = config.keyName;
            } else {
                // No pre-defined key. Assume local storage
                location = storageLocation.LOCAL;
                keyName = key;
            }

            if (encrypt && encrypt.key) {
                keyName = md5(keyName);
            }

            if (encrypt && encrypt.value) {
                value = md5(value);
            }

            if (location === storageLocation.LOCAL) {
                localStorage.setItem(keyName, JSON.stringify(value));
            } else if (location === storageLocation.SESSION) {
                sessionStorage.setItem(keyName, JSON.stringify(value));
            } else if (location === storageLocation.USER) {
                var userObjKey = getUserObjectKey();
                var userObj = getUserObject(userObjKey);
                userObj[keyName] = value;
                localStorage.setItem(userObjKey, JSON.stringify(userObj));
            }
        }

        function getItem(key, encrypt) {
            var keyName = undefined;
            var location = undefined;
            var config = storageConfig[key];

            if (config) {
                location = config.location;
                keyName = config.keyName;
            } else {
                // No pre-defined key. Assume local storage
                location = storageLocation.LOCAL;
                keyName = key;
            }

            if (encrypt) {
                keyName = md5(keyName);
            }

            try {
                if (location === storageLocation.LOCAL) {
                    return JSON.parse(localStorage.getItem(keyName));
                } else if (location === storageLocation.SESSION) {
                    return JSON.parse(sessionStorage.getItem(keyName));
                } else if (location === storageLocation.USER) {
                    var userObjKey = getUserObjectKey();
                    var userObj = getUserObject(userObjKey);
                    return userObj[keyName];
                }
            } catch (e) {
                // Previous unformated value.
                return undefined;
            }
        }

        function removeItem(key) {
            var keyName = undefined;
            var location = undefined;
            var config = storageConfig[key];

            if (config) {
                location = config.location;
                keyName = config.keyName;
            } else {
                // No pre-defined key. Assume local storage
                location = storageLocation.LOCAL;
                keyName = key;
            }

            if (location === storageLocation.LOCAL) {
                localStorage.removeItem(keyName);
            } else if (location === storageLocation.SESSION) {
                sessionStorage.removeItem(keyName);
            } else if (location === storageLocation.USER) {
                var userObjKey = getUserObjectKey();
                var userObj = getUserObject(userObjKey);
                delete userObj[keyName];
                localStorage.setItem(userObjKey, JSON.stringify(userObj));
            }
        }

        function getUserObjectKey() {
            return 'user-' + userName;
        }

        function getUserObject(key) {
            var userObj = getItem(key) || {};
            return angular.copy(userObj, {});
        }

        function getUserName() {
            var bypassRefresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            // Cannot use profileService.isSpecU method because of circular dependency
            if (getItem('oauth:token_account_type') === 'SPECU') {
                userName = storageKeys.specUUserName;
                return $q.resolve(userName);
            }if (getItem('oauth:token_account_type') === 'BULK') {
                userName = storageKeys.bulkMDUUserName;
                return $q.resolve(userName);
            } else {
                return customerInfoService.getName(bypassRefresh).then(function (fullName) {
                    userName = fullName.replace(/\s/g, '_');
                    return userName;
                });
            }
        }
    }

    function TemporaryStorage() {
        this.data = {};
        this.getItem = function (key) {
            return this.data[key];
        };
        this.setItem = function (key, value) {
            this.data[key] = value;
        };
        this.removeItem = function (key) {
            var val = this.data[key];
            delete this.data[key];
            return val;
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/ovp-storage.js.map
