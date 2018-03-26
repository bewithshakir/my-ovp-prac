/* globals console, window, platform */
(function () {
    'use strict';
    /**
     * OvpConfig class contains a few helper functions as well as some functions that help bootstrap the config
     * object at the beginning of execution.
     *
     * This should be created in the index.html and should fill in the following environment injections. If we are
     * using an activity config, this should fetch that explicitly and then continue with the app instantiation
     */
    window.OvpConfig = class {
        constructor(defaults, version, environments) {
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
        initialize(done, defaultEnvironmentKey = 'prod') {
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
                let urlConfigs = this.fetchUrlParamConfigs();
                this.installOverrides(urlConfigs);
            }

            this.fetchConfig((error, tdcsConfigs) => {
                if (!error) {
                    this.installOverrides(tdcsConfigs);
                    this.applyLocalConfigOverrides();
                }
                done(error, this);
            });
        }

        parseMajorMinorVersion(version) {
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
        parseEnvironmentOptions(environments) {
            //Parse and assign potential environments to instance.
            try {
                this.environments = environments ? JSON.parse(window.atob(environments)) : [];
                this.environmentMap = this.environments.reduce((memo, environ) => {
                    memo[environ.name] = environ;
                    return memo;
                }, {});
            } catch (err) {
                console.error('Problem while trying to decode / parse environments');
                this.environments = [];
            }
        }

        setDeviceType() {
            return;
        }

        setInitialConfigDefaults(defaults) {
            Object.assign(this, defaults);
        }

        storeCurrentVersion() {
            if (window.sessionStorage) {
                try {
                    window.sessionStorage.setItem('appVersion', JSON.stringify(this.version));
                } catch (err) {
                    console.error('Unable to store appVersion');
                }
            }
        }

        storeEnvironmentKey(environmentKey) {
            if (window.sessionStorage && window.localStorage) {
                try {
                    window.localStorage.setItem(this.environmentStorageKey, environmentKey);
                } catch (err) {
                    console.error('Unable to store selected environment');
                }
            }
        }

        getEnvironmentsMap() {
            return this.environmentMap;
        }

        getEnvironments() {
            return this.environments;
        }

        installOverrides(overrides) {
            //Instead of activityConfig, messagesOverrides,
            this.currentConfig = this.deepApply(this, overrides);
        }

        fetchConfig(done) {
            let url = this.piHost + this.services.config;
            url += '&apikey=' + window.encodeURIComponent(this.oAuth.consumerKey);
            url += '&deviceId=' + window.encodeURIComponent(this.deviceId).toUpperCase();
            url += '&appVersion=' + window.encodeURIComponent(this.majorMinorVersion);
            url += '&deviceType=' + window.encodeURIComponent(this.deviceType);
            url += '&osVersion=' + window.encodeURIComponent(this.osVersion);
            if (!this.piHost) {
                throw 'Unable to get pihost';
            }
            this._nativeXHR(url, (err, result) => {
                if (result) {
                    let config = JSON.parse(result);
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

        fetchUrlParamConfigs() {
            let searchString = '', search = {};
            if (window.location.search.indexOf('?') > 0) {
                searchString = window.location.search.split('?')[1];
                search = searchString.split('?').reduce((memo, pair) => {
                    let [key, value] = pair.split('=');
                    memo[key] = value;
                    return memo;
                }, {});
            }

            return Object.keys(search).filter(key => key.startsWith('config.') || key === 'env').reduce((memo, key) => {
                memo[key.replace('config.', '')] = search[key];
                return memo;
            }, {});
        }

        _nativeXHR (url, done, method = 'GET') {
            let xhr = new window.XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                done(null, xhr.response);
            };
            xhr.onerror = function () {
                done(xhr.response);
            };
            xhr.send();
        }

        getBool(property) {
            if (property === undefined || property === null) {
                throw 'Activity config property was not defined or provided and attempted to be used.';
            }
            return property.toString() === 'true';
        }

        deepApply(obj, source = {}) {
            Object.keys(source).forEach(key => {
                if (typeof source[key] === 'object') {
                    if (!obj[key]) {
                        obj[key] = {};
                    }
                    this.deepApply(obj[key], source[key]);
                } else {
                    obj[key] = source[key];
                }
            });
        }

        randomGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                /*jslint bitwise: true */
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        getOrCreateDeviceId() {
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

        getStoredEnvironmentKey(defaultEnv) {
            let env = defaultEnv;
            if (window.sessionStorage) {
                let storedEnv;
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

        applyLocalConfigOverrides() {
            if (window.sessionStorage) {
                let localOverrides = window.sessionStorage.getItem('configOverride');
                if (localOverrides) {
                    try {
                        let configs = JSON.parse(localOverrides);
                        this.installOverrides(configs);
                    } catch (e) {
                        console.warn('Local overrides are not valid json, ignored');
                    }
                }
            }
        }
    };
}());
