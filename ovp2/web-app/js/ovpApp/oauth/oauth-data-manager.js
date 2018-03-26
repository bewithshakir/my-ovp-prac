/* globals window */
(function () {
    'use strict';
    angular.module('ovpApp.oauth')
        .service('OauthDataManager', OauthDataManager)
        .factory('StorageBuffer', StorageBufferFactory);
    /* @ngInject */
    function OauthDataManager(StorageBuffer, ovpStorage, oAuthConfig, deviceid, $rootScope, $timeout, config) {
        var deviceVerifierKey = 'oauth:device_verifier',
            expirationKey = 'oauth:expiration',
            refreshTokenKey = 'oauth:refresh_token',
            tokenKey = 'oauth.token',
            tokenSecretKey = 'oauth:token_secret',
            tokenAccountType = 'oauth:token_account_type',
            tokenClassification = 'xoauth_classification',
            consumer = oAuthConfig.consumerKey,
            deviceType = 'ONEAPP-OVP',
            secret = oAuthConfig.s,
            buffer,
            migrationKeys = {
                'twctv:oauth:device_verifier': deviceVerifierKey,
                'twctv:oauth:expiration': expirationKey,
                'twctv:oauth:refresh_token': refreshTokenKey,
                'twctv:oauth.token': tokenKey,
                'twctv:oauth:token_secret': tokenSecretKey
            };

        let service = {
            get: get,
            set: set,
            reset: reset
        };

        initialize();

        return service;

        ///////////////

        function initialize() {
            buffer = StorageBuffer.create(ovpStorage);
            if (window.localStorage && window.localStorage.getItem) {
                Object.keys(migrationKeys).forEach(key => {
                    let legacyData = window.localStorage.getItem(key);
                    if (legacyData) {
                        buffer.setItem(migrationKeys[key], legacyData);
                        buffer.removeItem(key);
                    }
                });
            }
        }

        function get() {
            var tempToken = buffer.getItem(tokenKey),
                bufferCleared = buffer.clearStaleBuffer();

            let currentParams = {
                consumer: consumer,
                deviceId: deviceid.get(),
                deviceType: deviceType,
                deviceVerifier: buffer.getItem(deviceVerifierKey),
                expiration: buffer.getItem(expirationKey),
                secret: secret,
                refreshToken: buffer.getItem(refreshTokenKey),
                token: buffer.getItem(tokenKey),
                tokenSecret: buffer.getItem(tokenSecretKey),
                accountType: buffer.getItem(tokenAccountType),
                classification: buffer.getItem(tokenClassification)
            };

            // Cannot use profileService.isSpecU because of circular dependency
            if (config.specU.enabled && currentParams.accountType === 'SPECU') {
                currentParams.deviceType = 'SPECU-OVP';
            }

            if (bufferCleared && currentParams.token !== tempToken) {
                $rootScope.$emit('Analytics:inVisitOauthRefresh', {success: true,
                    operationType: 'refreshAuth',
                    oAuthToken: currentParams.token,
                    oAuthExpirationTimestamp: Number(currentParams.expiration)
                });
            }
            return currentParams;
        }

        function set(data) {
            if (data.hasOwnProperty('deviceVerifier')) {
                buffer.setItem(deviceVerifierKey, data.deviceVerifier);
            }

            if (data.hasOwnProperty('expiration')) {
                // data.expiration -= 1000 * ((60 * 60 * 6) -30) ; //Make the key "expire" in 30 seconds
                buffer.setItem(expirationKey, data.expiration);
            }

            if (data.hasOwnProperty('refreshToken')) {
                buffer.setItem(refreshTokenKey, data.refreshToken);
            }

            if (data.hasOwnProperty('token')) {
                buffer.setItem(tokenKey, data.token);
                //Make sure we also have a refresh token, otherwise its just a temporary (temp doesnt return refresh)
                if (data.hasOwnProperty('refreshToken')) {
                    $timeout(function () {
                        $rootScope.$broadcast('OauthManager:tokenAcquired', data.token);
                    });
                }
            }

            if (data.hasOwnProperty('tokenSecret')) {
                buffer.setItem(tokenSecretKey, data.tokenSecret);
            }

            if (data.hasOwnProperty('accountType')) {
                buffer.setItem(tokenAccountType, data.accountType);
            }

            if (data.hasOwnProperty('classification')) {
                buffer.setItem(tokenClassification, data.classification);
            }
        }

        function reset() {
            buffer.removeItem(expirationKey);
            buffer.removeItem(refreshTokenKey);
            buffer.removeItem(tokenKey);
            buffer.removeItem(tokenSecretKey);
            buffer.removeItem(deviceVerifierKey);
            buffer.removeItem(tokenAccountType);
            buffer.removeItem(tokenClassification);
        }
    }


    function StorageBufferFactory() {
        return {
            create: function (storageObject) {
                return new StorageBuffer(storageObject);
            }
        };

        ///

        function StorageBuffer(storageObject) {

            this.data = {};
            this.storage = storageObject;
            this.updateTime = Date.now();

            this.setItem = function (key, item) {
                this.data[key] = item;
                if (this.storage) {
                    this.storage.setItem(key, item);
                    this.updateTime = Date.now();
                    this.storage.setItem('_lastWriteTime', this.updateTime);
                }
            };

            this.getItem = function (key) {
                if (this.storage && !this.data[key]) {
                    this.data[key] = this.storage.getItem(key);
                }
                return this.data[key];
            };

            this.removeItem = function (key) {
                delete this.data[key];
                if (this.storage) {
                    this.storage.removeItem(key);
                    this.updateTime = Date.now();
                    this.storage.setItem('_lastWriteTime', this.updateTime);
                }
            };

            this.clearStaleBuffer = function () {
                var cleared = false;
                if (this.storage) {
                    let lastWriteTime = this.storage.getItem('_lastWriteTime');
                    if (lastWriteTime && lastWriteTime > this.updateTime) {
                        this.updateTime = lastWriteTime;
                        this.data = {};
                        cleared = true;
                    }
                }
                return cleared;
            };
        }
    }
})();
