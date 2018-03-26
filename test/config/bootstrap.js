/* globals angular */
(function () {
/*jshint undef: false */
'use strict';
var $qq = null;

angular.module('ovpApp.twctv.router', ['ui.router']).config(function ($stateProvider) {
    $stateProvider.state('ovp', {
        abstract: true
    });
});

angular.module('ovpApp.legacy.deviceid', []).factory('deviceid', function () {
    return {
        get: angular.noop
    };
});

angular.module('ovpApp.version', []).factory('version', function () {
    return {
        appVersion: 'void',
        commitHash: 'void'
    };
});

angular.module('ovpApp.analytics', []).factory('analytics', function () {
    return {
    };
});

angular.module('ovpApp.config', []).factory('config', [function () {
    var config = window.defaultConfig,
        testConfig = {
        piHost: '',
        nrsApi: '/nrs/api',
        smartTvApi: '/ipvs/api/smarttv',
        smartTv: {
            info: '/info/v1/name',
            capabilities: '/user/capabilities/v2',
            adobeSession: '/adobe/session',
            cdvrBookmark: '/action/dvr/v1/bookmark',
            schedule: '/action/dvr/v1/show',
            cdvrProgram: '/cdvr/v1/programs'
        },
        nmdEpgsApiV1: '/nmdepgs/v1',
        nrs: {
            stb: '/stbs'
        },
        services: {
            dvrBase: '/rdvr*/dvr/',
            dvrRecordedPlay: '/recorded/play/',
            dvrRecordedResume: '/recorded/play/resume/',
            dvrRecordedDelete: '/recorded/delete',
            dvrRecorded: '/recorded',
            dvrDiskUsage: '/usage',
            dvrRecording: '/recording',
            dvrScheduled: '/scheduled',
            dvrSchedule: '/schedule',
            dvrSeriesPriorities: '/series/priorities',
            dvrConflicts: '/scheduled/conflicts'
        },
        epgs: {
            channelListQam: '/guide/channels',
            guide: '/guide',
            grid: '/grid',
            channelListIp: '/channels/v1'
        },
        capabilitiesFailureRetryCount: 2,
        capabilitiesUrl : function () {
            return '/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true';
        },
        splunkControlParameters: {
            splunkLoggingEnabled: false,
            splunkHeartbeatEnabled: false,
            splunkPlayerStatusEnabled: false,
            maxBufferSizeRecords: 10
        },
        ivrNumber: '555-555-5555',
        _accessibilityIvrNumber: '666-666-6666'
    };
    angular.extend(config, testConfig);
    window.currentConfig = config = new window.OvpConfig(config, '1.0', window.btoa('[{"name": "test", "default": true}]'), 'test');
    config.fetchAuthenticatedConfig = function() {
        return $qq.resolve(true);
    };
    return config;
}]).constant('oAuthConfig', {
    legacyTokensUrl: 'oAuthConfig.legacyTokensUrl',
    temporaryRequestUrl: 'temporaryRequestUrl',
    deviceAuthorizationUrl: 'deviceAuthorizationUrl',
    masqueradeUrl: 'masqueradeUrl',
    autoAuthorizationUrl: 'autoAuthorizationUrl',
    tokenExchangeUrl: 'tokenExchangeUrl',
    wayfarerUrl: 'wayfarerUrl',
    refreshBufferTime: 10,
    consumerKey: 'asdf',
    signatureMethod: 'HMOCK',
    version: 0,
    tokenUrl: 'tokenUrl',
    s: 'mockSecret'
}).constant('environmentConstants', {
    ENVIRONMENT_PRODUCTION: 'prod'
});

angular.module('ovpApp.services.splunk', []).factory('SplunkService', function () {

    var mockSplunk = {
        sendPlayerStatus: angular.noop,
        sendPlayerError: angular.noop,
        sendServiceError: angular.noop,
        updateCapabilities: angular.noop,
        flush: angular.noop
    };

    function returnMockSplunk() {
        return mockSplunk;
    }

    return returnMockSplunk;
});

angular.module('angularMoment', []).factory('moment', function () {

    var mockMoment = {
        subtract: returnMockMoment,
        isBefore: angular.noop,
        format: angular.noop,
        clone: returnMockMoment,
        isSame: function() {return true;},
        isValid: function() {return true;}
    };

    function returnMockMoment() {
        return mockMoment;
    }

    return returnMockMoment;
});

angular.module('dataDelegate', []).factory('DataDelegate', function () {
    return require('DataDelegate');
});


angular.module('ovpApp.legacy.ovpUtils', []).factory('ovpUtils', function () {
    return {
        ovp: {
            settings: {
                config: {}
            }
        }
    };
});

angular.module('ovpApp.legacy.PopupFrame', []).factory('PopupFrame', function () {
    return angular.noop;
});

angular.module('ovpApp.legacy.UIPopup', []).factory('Popup', function () {
    return angular.noop;
});

angular.module('ovpApp.legacy.popup', []).factory('popup', function () {
    return {
        message: angular.noop
    };
});


angular.module('ovpApp.legacy.storage', []).factory('storage', function () {

    function createGetKeys(keyName) {
        function getKeys() {
            var keys = [],
                i, len;

            for (i = 0, len = browser.window[keyName].length; i < len; ++i) {
                keys.push(browser.window[keyName].key(i));
            }

            return keys;
        }

        return getKeys;
    }

    return {
        localStorage: window.localStorage,
        sessionStorage: window.sessionStorage,
        getLocalKeys: createGetKeys('localStorage'),
        getSessionKeys: createGetKeys('sessionStorage')
    };
});


angular.module('ovpApp.components.authForm', []).factory('AuthFormPopup', function () {
    return {
        message: angular.noop
    };
});

angular.module('ovpApp.parentalControlsDialog', []).factory('parentalControlsDialog', function () {
    return {
        withContext: function () {
            return {
                unlock: angular.noop,
                changePIN: angular.noop
            }
        }
    };
}).constant('parentalControlsContext', {});

angular.module('ovpApp.services.activityConfigService', ['ovpApp.config']).
    factory('activityConfigService', function () {
    return require('config/activityConfigService');
});

angular.module('ovpApp.legacy.PlayerSplunkServices', []).factory('PlayerSplunkService',  function () {
    return angular.noop;
});

angular.module('ovpApp.authenticationService', []).factory('authenticationService', function ($q) {
    return {
        isAuthenticated: function () {
            return {done: angular.noop};
        }
    };
});

window.platform = {
    name: 'Phantom',
    version: '8888.0',
    os: {
        family: "AnyOS",
        version: '1.0'
    }

}

angular.module('lib.platform', []).factory('platform', function () {
    return window.platform;
});

angular.module('ovpApp.video', []).constant('TWCVideoJS', {});

angular.module('ovpApp.analytics.analyticsService', ['ovpApp.analytics.state']).factory('analyticsService',
    function (AnalyticsState) {
    return {
        events: [],
        state: new AnalyticsState(),
        initialize: () => angular.noop,
        event: function (name, evt) {
            evt.name = name;
            this.events.push(evt);
        },
        reset: function () {
            this.events=[];
        },
        setPlayerPosition: () => angular.noop,
        isDebug: () => true
    };
});

angular.module('cfp.hotkeys', []).service('hotkeys', function () {
    return {
        bindTo: angular.noop
    };
});

angular.module('lib.sha1', []).constant('sha1', function () {
    this.getHMAC = function () {
        return 'hmac';
    };
});

angular.module('ovpApp.adBlockerDetection', []).factory('adBlockerDetection', function ($q) {
    return {
        adsBlocked: function () {
            return $q.resolve();
        }
    };
});

angular.module('ovpApp.services.locationService', []).factory('locationService', function ($q) {
    return {
        resetCache: angular.noop,
        getLocation: function () {
            return $q.resolve({
                behindOwnModem: true,
                inUS: true,
                inUsOrTerritory: true
            });
        }
    };
});

window.mockErrorCodesService = {

    getMessageForCode: function (code) {
        return code;
    },
    getHeaderForCode: function (code) {
        return code;
    },
    getAlertForCode: function (code) {
        console.log("GetErrorCode (alert): " + code);
        return {
            message: code
        }
    }
};

window.mockProfileService = {
    //$qq is late bound to the $q service
    postAuth: function() {
        return $qq.resolve();
    },
    isMockService: function() {
        return true;
    },
    isCdvrEnabled: function () {
        return $qq.resolve(false);
    },
    isRdvrEnabled: function () {
        return $qq.resolve(true);
    },
    isIptvPackage: function () {
        return $qq.resolve(false);
    },
    isIpOnlyEnabled: function () {
        return $qq.resolve(false);
    },
    hasCapability: function () {
        return $qq.resolve(false);
    },
    refreshProfile: function () {
        return $qq.resolve(true);
    },
    canUseTwctv: function () {
        return $qq.resolve(false);
    },
    getFirstAvailableState: function () {
        return $qq.resolve(null);
    },
    isTVODRentEnabled: function () {
        return $qq.resolve(false);
    },
    isTVODWatchEnabled: function () {
        return $qq.resolve(false);
    },
    isAccessibilityEnabled: function () {
        return $qq.resolve(false);
    },
    canWatchLive: function () {
        return $qq.resolve(true);
    },
    canUseGuide: function() {
        return $qq.resolve(true);
    },
    getCode: function () {
        return $qq.resolve(0);
    },
    isAutoAuthEnabled: function () {
        return false;
    },
    isSpecU: function () {
        return false;
    },
    isBulkMDU: function () {
        return false;
    },
    isSpecUOrBulkMDU: function () {
        return false;
    },
    isStreamPlus: function () {
        return $qq.resolve(false);
    },
    isHidden: function () {
        return false;
    },
    isProfileRefreshed: function () {
        return false;
    }
};

// This needs to be mocked in before each because doing this at the more global
// scope here like the other mocks seems to cause all the other factories and
// constants that are part of the module to go away.
beforeEach(function() {
    module('ovpApp.services.connectivityService', function ($provide) {
        $provide.factory('connectivityService', function ($q) {
            $qq = $q;
            var serviceMock = {
                isOnline: function () {
                    return true;
                },
                checkXhr: function () {
                    return angular.noop();
                }
            }
            return serviceMock;
        });
    })
});





    // This needs to be mocked in before each because doing this at the more global
    // scope here like the other mocks seems to cause all the other factories and
    // constants that are part of the module to go away.
    beforeEach(
        module('ovpApp.services.stbService', function ($provide) {
            $provide.factory('stbService', function ($q, rx) {
                var stbServiceMock = {
                    getHeadend: function () {
                        return $q.defer().promise;
                    },
                    setHeadend: function () {
                        //return $q.defer(false);
                    },
                    defaultDvrLanding: function () {
                        return $q.defer().promise;
                    },
                    getSTBs: function () {
                        return $q.defer().promise;
                    },
                    getCurrentStbPromise: function () {
                        return $q.defer().promise;
                    },
                    getCurrentStb: function () {
                        return $q.defer().promise;
                    },
                    setCurrentStb: function () {

                    },
                    postStbName: function () {
                    },
                    getDate: function () {
                        return '';
                    },
                    getOffsetFromGMT: function () {
                        return '';
                    },
                    setOffsetFromGMT: function () {
                        //return $q.resolve(false);
                    },
                    formatUnix: function () {
                    },
                    getDayLabel: function () {
                        return '';
                    },
                    selectDefaultDvr: function () {
                        return $q.defer().promise;
                    },
                    currentStbSource: rx.Observable.never()
                };

                return stbServiceMock;
            });
        })
    );


    // This needs to be mocked in before each because doing this at the more global
    // scope here like the other mocks seems to cause all the other factories and
    // constants that are part of the module to go away.
    beforeEach(
        module('ovpApp.services.epgsService', function ($provide) {
            $provide.factory('epgsService', function ($q) {
                var epgsServiceMock = {
                    getChannels: function () {
                        return $q.defer().promise;
                    },
                    getChannelByMystroSvcId: function () {
                        return {};
                    },
                    getChannelByNcsSvcId: function () {
                        return {};
                    },
                    clearChannels: function () {
                    }
                };

                return epgsServiceMock;
            });
        })
    );

    beforeEach(
        module('ovpApp.services.ovpStorage', function ($provide) {
            $provide.factory('$transitions', function () {
                return {
                    onBefore: angular.noop,
                    onStart: angular.noop,
                    onSuccess: angular.noop,
                    onError: angular.noop,
                    onEnter: angular.noop
                };
            });
        })
    );
}());
