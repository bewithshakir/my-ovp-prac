/* globals console, window, platform */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    /**
     * OvpConfig class contains a few helper functions as well as some functions that help bootstrap the config
     * object at the beginning of execution.
     *
     * This should be created in the index.html and should fill in the following environment injections. If we are
     * using an activity config, this should fetch that explicitly and then continue with the app instantiation
     */
    window.OvpConfig = (function () {
        function _class(defaults, version, environments) {
            _classCallCheck(this, _class);

            this.deviceId = null;
            this.version = version;
            this.environmentStorageKey = 'env';
            this.environmentKey = 'prod';
            this.osVersion = 'none';
            this.deviceType = 'none';
            this.majorMinorVersion = this.parseMajorMinorVersion(version);

            this.getOrCreateDeviceId();
            this.parseEnvironmentOptions(environments);
            this.setInitialConfigDefaults(defaults);
            this.storeCurrentVersion();
        }

        /**
         * Initialize is separate from constructor to allow the initial fetch to happen after
         * contructor is completed
         * @param {Function} done Callback function after initialize is completed
         * @param {String} defaultEnvironmentKey Default environment name if none is set in LocalStorage
         */

        _createClass(_class, [{
            key: 'initialize',
            value: function initialize(done) {
                var _this = this;

                var defaultEnvironmentKey = arguments.length <= 1 || arguments[1] === undefined ? 'prod' : arguments[1];

                /*
                    1) Apply defaults
                    2) Apply environment config
                    3) Apply Public TDCS Config
                    ----
                    4) Apply Authenticated TDCS Config
                */
                this.environmentKey = this.getStoredEnvironmentKey(defaultEnvironmentKey);
                this.osVersion = platform.os.family.toUpperCase() + '-' + platform.os.version;
                this.deviceType = platform.name.toUpperCase() + '-' + platform.version;

                if (this.environmentMap[this.environmentKey]) {
                    this.installOverrides(this.environmentMap[this.environmentKey]);
                }

                if (this.environmentKey !== 'prod') {
                    var urlConfigs = this.fetchUrlParamConfigs();
                    this.installOverrides(urlConfigs);
                }

                this.fetchConfig(function (error, tdcsConfigs) {
                    if (!error) {
                        _this.installOverrides(tdcsConfigs);
                        _this.applyLocalConfigOverrides();
                    }
                    done(error, _this);
                });
            }
        }, {
            key: 'parseMajorMinorVersion',
            value: function parseMajorMinorVersion(version) {
                try {
                    return version.match(/^[0-9]+\.[0-9]+/)[0];
                } catch (err) {
                    throw 'Unable to parse app version ' + version;
                }
                return '0.0';
            }

            /**
             * Parse the potential environment options and
             * @param {String} environments base64 encoded json string
             */
        }, {
            key: 'parseEnvironmentOptions',
            value: function parseEnvironmentOptions(environments) {
                //Parse and assign potential environments to instance.
                try {
                    this.environments = environments ? JSON.parse(window.atob(environments)) : [];
                    this.environmentMap = this.environments.reduce(function (memo, environ) {
                        memo[environ.name] = environ;
                        return memo;
                    }, {});
                } catch (err) {
                    console.error('Problem while trying to decode / parse environments');
                    this.environments = [];
                }
            }
        }, {
            key: 'setDeviceType',
            value: function setDeviceType() {
                return;
            }
        }, {
            key: 'setInitialConfigDefaults',
            value: function setInitialConfigDefaults(defaults) {
                Object.assign(this, defaults);
            }
        }, {
            key: 'storeCurrentVersion',
            value: function storeCurrentVersion() {
                if (window.sessionStorage) {
                    try {
                        window.sessionStorage.setItem('appVersion', JSON.stringify(this.version));
                    } catch (err) {
                        console.error('Unable to store appVersion');
                    }
                }
            }
        }, {
            key: 'storeEnvironmentKey',
            value: function storeEnvironmentKey(environmentKey) {
                if (window.sessionStorage && window.localStorage) {
                    try {
                        window.localStorage.setItem(this.environmentStorageKey, environmentKey);
                    } catch (err) {
                        console.error('Unable to store selected environment');
                    }
                }
            }
        }, {
            key: 'getEnvironmentsMap',
            value: function getEnvironmentsMap() {
                return this.environmentMap;
            }
        }, {
            key: 'getEnvironments',
            value: function getEnvironments() {
                return this.environments;
            }
        }, {
            key: 'installOverrides',
            value: function installOverrides(overrides) {
                //Instead of activityConfig, messagesOverrides,
                this.currentConfig = this.deepApply(this, overrides);
            }
        }, {
            key: 'fetchConfig',
            value: function fetchConfig(done) {
                var url = this.piHost + this.services.config;
                url += '&apikey=' + window.encodeURIComponent(this.oAuth.consumerKey);
                url += '&deviceId=' + window.encodeURIComponent(this.deviceId).toUpperCase();
                url += '&appVersion=' + window.encodeURIComponent(this.majorMinorVersion);
                url += '&deviceType=' + window.encodeURIComponent(this.deviceType);
                url += '&osVersion=' + window.encodeURIComponent(this.osVersion);
                if (!this.piHost) {
                    throw 'Unable to get pihost';
                }
                this._nativeXHR(url, function (err, result) {
                    if (result) {
                        var config = JSON.parse(result);
                        if (config.config) {
                            config = config.config;
                        } else if (config.settings) {
                            config = config.settings; //Legacy support
                        } else if (!config) {
                                config = {};
                            }
                        done(null, config);
                    } else {
                        console.warn('Unable to retrieve activityConfig, ' + err);
                        done(err);
                    }
                });
            }
        }, {
            key: 'fetchUrlParamConfigs',
            value: function fetchUrlParamConfigs() {
                var searchString = '',
                    search = {};
                if (window.location.search.indexOf('?') > 0) {
                    searchString = window.location.search.split('?')[1];
                    search = searchString.split('?').reduce(function (memo, pair) {
                        var _pair$split = pair.split('=');

                        var _pair$split2 = _slicedToArray(_pair$split, 2);

                        var key = _pair$split2[0];
                        var value = _pair$split2[1];

                        memo[key] = value;
                        return memo;
                    }, {});
                }

                return Object.keys(search).filter(function (key) {
                    return key.startsWith('config.') || key === 'env';
                }).reduce(function (memo, key) {
                    memo[key.replace('config.', '')] = search[key];
                    return memo;
                }, {});
            }
        }, {
            key: '_nativeXHR',
            value: function _nativeXHR(url, done) {
                var method = arguments.length <= 2 || arguments[2] === undefined ? 'GET' : arguments[2];

                var xhr = new window.XMLHttpRequest();
                xhr.open(method, url);
                xhr.onload = function () {
                    done(null, xhr.response);
                };
                xhr.onerror = function () {
                    done(xhr.response);
                };
                xhr.send();
            }
        }, {
            key: 'getBool',
            value: function getBool(property) {
                if (property === undefined || property === null) {
                    throw 'Activity config property was not defined or provided and attempted to be used.';
                }
                return property.toString() === 'true';
            }
        }, {
            key: 'deepApply',
            value: function deepApply(obj) {
                var _this2 = this;

                var source = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                Object.keys(source).forEach(function (key) {
                    if (typeof source[key] === 'object') {
                        if (!obj[key]) {
                            obj[key] = {};
                        }
                        _this2.deepApply(obj[key], source[key]);
                    } else {
                        obj[key] = source[key];
                    }
                });
            }
        }, {
            key: 'randomGuid',
            value: function randomGuid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    /*jslint bitwise: true */
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : r & 0x3 | 0x8;
                    return v.toString(16);
                });
            }
        }, {
            key: 'getOrCreateDeviceId',
            value: function getOrCreateDeviceId() {
                if (window.localStorage) {
                    try {
                        this.deviceId = window.localStorage.getItem('device_id');
                        if (!this.deviceId) {
                            this.deviceId = this.randomGuid();
                            window.localStorage.setItem('device_id', JSON.stringify(this.deviceId));
                        } else {
                            this.deviceId = JSON.parse(this.deviceId);
                        }
                    } catch (err) {
                        console.error('Unable to retrieve stored deviceId: ' + err);
                    }
                } else {
                    this.deviceId = this.randomGuid();
                }
            }
        }, {
            key: 'getStoredEnvironmentKey',
            value: function getStoredEnvironmentKey(defaultEnv) {
                var env = defaultEnv;
                if (window.sessionStorage) {
                    var storedEnv = undefined;
                    try {
                        storedEnv = window.localStorage.getItem(this.environmentStorageKey);
                    } catch (err) {
                        console.error('Unable to retrieve storage data, ' + err);
                    }

                    if (storedEnv) {
                        try {
                            env = JSON.parse(storedEnv);
                        } catch (e) {
                            env = storedEnv;
                        }
                    }
                }

                this.environmentKey = env;
                return env;
            }
        }, {
            key: 'applyLocalConfigOverrides',
            value: function applyLocalConfigOverrides() {
                if (window.sessionStorage) {
                    var localOverrides = window.sessionStorage.getItem('configOverride');
                    if (localOverrides) {
                        try {
                            var configs = JSON.parse(localOverrides);
                            this.installOverrides(configs);
                        } catch (e) {
                            console.warn('Local overrides are not valid json, ignored');
                        }
                    }
                }
            }
        }]);

        return _class;
    })();
})();
//# sourceMappingURL=../../maps-babel/ovpApp/config/ovp-config-class.js.map
