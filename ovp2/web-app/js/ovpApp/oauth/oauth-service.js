(function () {
    'use strict';

    /**
     * OAuth service
     * Manage and control user authentication.
     */
    angular.module('ovpApp.oauth')
        .provider('OauthService', OauthProvider);

    /**
     * Must use a provider here to make sure this is available in the configuration when creating the
     * interceptors
     */
    function OauthProvider() {
        var oService = null;

        return {
            $get: function ($injector) {
                if (!oService) {
                    oService = $injector.instantiate(OauthService);
                }
                return oService;
            },

            getService: function () {
                return oService;
            }
        };
    }

    /* @ngInject */

    function OauthService($q, $http, $log, $cookies, $timeout, OauthDataManager, oAuthConfig, httpUtil, config,
        OauthKeyMap, messages, $rootScope, OauthSigner, $injector, streamPlusService, profileService,
        ovpStorage, storageKeys, $window, $location, errorCodesService) {
        const service = this;

        let _isAuthenticated = false,
            _loginRequired = false,
            verifierKey = 'oauth_verifier',
            refreshTokenKey = 'xoauth_refresh_token',
            _refreshTokenMutex = null,
            _getTokenMutex = null,
            _sentResumeAuth = false,
            _sentAutoAccess = false,
            _timerPromise = null,
            _oauthError = null,
            loginDefer = null,
            _refreshExpireBufferTime = 30000, //Add this when determining if the token is expired
            _refreshBufferTime = oAuthConfig.refreshBufferTime,
            _autoOauthDisabledTimeInMilliseconds = (config.autoAccessDisabledTimePeriodInMinutes * 60000);

        //The refresh timer should vary by tab so it doesn't fire at the same time in more than one instance
        _refreshBufferTime += Math.floor(Math.random() * 10) * 1000;

        service.updateToken = updateToken;
        service.userLogin = userLogin;
        service.getOAuthHeader = getHeader;
        service.isAuthenticated = isAuthenticated;
        service.getOAuthError = getOAuthError;
        service.logout = logout;
        service.reset = reset;
        service.clearTimeout = removeTimeouts;
        service.shouldAttemptMasquerade = shouldAttemptMasquerade;
        service.getMasqueradeToken = getMasqueradeToken;
        service.waitUntilAuthenticated = waitUntilAuthenticated;

        // Clear specU state from storage
        ovpStorage.removeItem(storageKeys.showSpecULink);

        return;
        //////

        /**
         * This is the definitive "isAuthenticated" this knows the actual state of the user, an can verify the
         * user's state.
         *
         * NOTE: this has a slight change from the previous version in that tries hard not to reject the promise
         * under normal operation.
         *
         * @return {Promise(Boolean)} returns a promise that will resolve with the answer
         */
        function isAuthenticated(force = false) {
            return updateToken(force).then(() => {
                ovpStorage.removeItem(storageKeys.autoAuthSignOutTime);
                _oauthError = null;
                return $q.resolve(true);
            }, (err = {}) => {
                _loginRequired = true;
                _oauthError = err;
                return $q.resolve(false);
            });
        }

        /**
         * Attempt to sso if url parameter exists and feature is enabled
         * @returns {boolean}
         */
        function shouldAttemptSso() {
            return config.ssoEnabled && ($location.search().sessionOverride === 'true');
        }

        /**
         * Attempt to masquerade if url parameter exists and feature is enabled
         * @returns {boolean}
         */
        function shouldAttemptMasquerade() {
            return config.masqueradeEnabled && angular.isDefined(getMasqueradeToken());
        }

        /**
         * ACE application will supply a request parameter with a valid token that is used to
         * authenticate
         * @returns {*}
         */
        function getMasqueradeToken() {
            return $location.search().mqtn;
        }

        /**
         * masquerade token to be used to create special OAuth session
         */
        function createOAuthSessionFromMasqueradeToken(masqueradeToken, temp) {
            if (shouldAttemptMasquerade()) {
                OauthDataManager.reset();
                var oAuthData = OauthDataManager.get(),
                    authData = {
                        xoauth_device_id: oAuthData.deviceId,
                        xoauth_device_type: oAuthData.deviceType,
                        xoauth_masquerade_token: masqueradeToken,
                        oauth_token: temp.token
                    };

                return $http({
                    bypassRefresh: true,
                    oAuthIgnoreToken: true,
                    data: authData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        return Object.keys(obj)
                            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
                            .join('&');
                    },
                    method: 'POST',
                    url: oAuthConfig.masqueradeUrl
                })
                .then(function (response) {
                    let masqResponse = getOAuthDataFromResponse(response);
                    return getToken(masqResponse.verifier, temp);
                });
            } else {
                return $q.reject('No masquerade token');
            }
        }

        function getOAuthError() {
            return _oauthError;
        }

        // Private method
        function shouldRejectAutoOauth() {
            let autoAuthSignOutTime = ovpStorage.getItem(storageKeys.autoAuthSignOutTime);
            return autoAuthSignOutTime &&
                ((Date.now() - autoAuthSignOutTime) < _autoOauthDisabledTimeInMilliseconds);
        }

        /**
         * Returns a promise which will resolve once the user is authenticated
         */
        function waitUntilAuthenticated() {
            return isAuthenticated()
                .then(authenticated => {
                    if (!authenticated) {
                        if (!loginDefer) {
                            loginDefer = $q.defer();
                        }
                        return loginDefer.promise;
                    }
                });
        }

        /**
         * Verify that we have a valid token or attempt to update the token, this function manages the token state
         * so that it knows if the token actually needs updating or if we know its ok.
         * @return {Promise}
         */
        function updateToken(force = false) {
            var oAuthData = OauthDataManager.get();

            // Record resumeAuth, if appropriate and we haven't already done so for this session.
            if (!_isAuthenticated && !_sentResumeAuth && !isExpired(oAuthData.expiration, _refreshExpireBufferTime) &&
                !_sentAutoAccess) {

                // Analytics
                $rootScope.$emit('Analytics:loginStart', {
                    authType: 'resumeAuth'
                });
                $rootScope.$emit('Analytics:loginStop', {
                    oauth: OauthDataManager.get(),
                    success: true
                });

                _sentResumeAuth = true;
            }

            // No longer force a refreshToken on page refresh, only if forced or expired
            // _refreshTokenMutex check to make sure that refresh token request is not in-progress
            if (!_refreshTokenMutex && !isExpired(oAuthData.expiration, _refreshExpireBufferTime) && !force) {
                return profileService.isProfileRefreshed() ? $q.resolve() : profileService.postAuth();
            } else if (!_loginRequired || force) {
                return refreshToken();
            } else {
                //User must login before contiune
                return $q.reject(_oauthError || 'User must login');
            }
        }

        /**
         * Use a username and password to fetch an oauth token set and use that for future data requests.
         *
         * @param  {String} username
         * @param  {String} password
         * @return {Promise}
         */
        function userLogin(username, password) {

            // Analytics
            $rootScope.$emit('Analytics:loginStart', {
                authType: 'manualAuth',
                username: username
            });

            return getTemporaryToken().then((temp) => {
                return authorizeUser(username, password, temp).then((verifier) => {
                    _isAuthenticated = true;
                    return getToken(verifier, temp);
                }, function (err) {

                    // Emit loginStop failure event.
                    $rootScope.$emit('Analytics:loginStop', {
                        response: getOAuthErrorCodeFromResponse(err),
                        success: false
                    });
                    return $q.reject(getOAuthErrorCodeFromResponse(err));
                });
            }).then(function (token) {
                // Manual authorization succeeded
                _isAuthenticated = true;
                if (loginDefer) {
                    loginDefer.resolve();
                    loginDefer = undefined;
                }
                $rootScope.$broadcast('OauthService:loginActionComplete');
                return token;
            });
        }

        /**
         * Attempt to refresh the token by all means. If this eventually fails after attempting all tokens and login
         * methods, log the user out
         * @return {Promise}
         */
        function refreshToken() {
            if (!_refreshTokenMutex) {
                _refreshTokenMutex = getToken().catch((tokenErr) => {
                    return getTemporaryToken().then((tempToken) => {
                        return refreshTokenWithDeviceVerifier(tempToken).catch((deviceErr) => {
                            return attemptTokenExchange(tempToken).catch((err) => {
                                //If all normal attempts to long fail, we should try to use the masq
                                //token, if that fails - we should see a normal login
                                if (shouldAttemptMasquerade()) {
                                    return createOAuthSessionFromMasqueradeToken(getMasqueradeToken(), tempToken)
                                    .then((oauthData) => {
                                        $location.search({}); // clear query param
                                        return oauthData;
                                    }, (err) => {
                                        $location.search({}); // clear query params on error too
                                        return $q.reject(err);
                                    });
                                } else if (profileService.isAutoAuthEnabled()) {
                                    return refreshTokenWithAutoVerifier(tempToken);
                                } else {
                                    $log.debug(`Failed to fetch token with deviceVerifier ${tokenErr},
                                        ${(deviceErr && deviceErr.errorName) ? deviceErr.errorName : deviceErr}`);
                                    return $q.reject(err);
                                }
                            });
                        });
                    });
                }).then(() => {
                    //If we managed to get a token we can say for sure that we where able to verify a login.
                    _isAuthenticated = true;
                    _refreshTokenMutex = null;
                    _loginRequired = false;

                    return profileService.isProfileRefreshed() ? $q.resolve() : profileService.postAuth();
                }, (err = {}) => {
                    //Need to make sure and clear the mutex so we can try again at some point - regardless of
                    //what happened
                    _refreshTokenMutex = null;
                    _isAuthenticated = false;
                    // Get a reference to the connectivity service. This is
                    // done here to avoid a circular dependency at module load
                    // time.
                    let connectivitySvc = $injector.get('connectivityService');
                    if (connectivitySvc && connectivitySvc.isOnline()) {
                        // We are online or not able to determine if online
                        // Force login.
                        _loginRequired = true;
                        OauthDataManager.reset();
                        return $q.reject(err);
                    } else {
                        // Offline so try again  when another request is made.
                        // Silently fail.
                        return $q.resolve();
                    }
                });
            }
            return _refreshTokenMutex;
        }

        function refreshTokenWithDeviceVerifier(tempToken) {
            let deviceVerifier = OauthDataManager.get().deviceVerifier;
            if (deviceVerifier) {

                // Analytics
                $rootScope.$emit('Analytics:loginStart', {
                    authType: 'verifierAuth'
                });

                return authorizeDevice(deviceVerifier, tempToken).then((verifier) => {
                    return getToken(verifier, tempToken);
                }).then(function () {
                    // verifierAuthSuccess

                    // Analytics
                    $rootScope.$emit('Analytics:loginStop', {
                        oauth: OauthDataManager.get(),
                        success: true
                    });
                }, function (err) {
                    // verifier auth failed

                    // Analytics
                    $rootScope.$emit('Analytics:loginStop', {
                        response: err,
                        success: false
                    });
                    return $q.reject(err);
                });
            } else {
                return $q.reject();
            }
        }

        function attemptTokenExchange(temp) {
            let shouldAttempt = shouldAttemptSso();
            if (shouldAttempt && shouldRejectAutoOauth()) {
                return $q.reject('SSO enabled, but user manually logged out recently');
            } else if (shouldAttempt) {
                const isMobile = $window.navigator.userAgent.match(/(ipad)|(iphone)|(ipod)|(android)/i);
                if (!isMobile) {
                    return tokenExchange(temp).then((verifier) => {
                        return getToken(verifier, temp);
                    });
                } else {
                    return $q.reject('SSO enabled, but user is on a mobile device');
                }
            } else {
                return $q.reject('SSO is not enabled');
            }
        }

        function refreshTokenWithAutoVerifier(tempToken) {
            // Analytics: loginstart - autoAccess
            if (!_sentAutoAccess) {
                $rootScope.$emit('Analytics:loginStart', {
                    authType: 'autoAccess'
                });
                _sentAutoAccess = true;
            }

            return autoAuthorize(tempToken).then((verifier) => {
                return getToken(verifier, tempToken);
            }).then(function () {
                // Autoauth success
                // SpecU and Bulk MDU users don't need a package. Other account types much check capabilities
                // We need to disable auto auth for 24 hours before application auto logs in for a user,
                // and also show a link on the login screen that enables SpecU login, in this situation.
                // Refer - https://jira.charter.com/browse/STVWEB-1265
                if (profileService.isSpecUOrBulkMDU()) {
                    return shouldRejectAutoOauth() ?
                        $q.reject({
                            isSpecU: profileService.isSpecU(),
                            isBulkMDU: profileService.isBulkMDU(),
                            isManualOperation: true
                        }) : $q.resolve();
                } else {
                    // Autoauth only for eligible customer
                    // Refresh capabilities to cache values
                    return profileService.postAuth(true).then(() => {
                        // Show login screen for video customer not subscribed to IPTV package
                        return profileService.isIptvPackage().then((isIpOnly) => {
                            return profileService.canUseTwctv().then(() => { // has video capabilitiy
                                if (!isIpOnly) {
                                    return $q.reject('ipOnlyError');
                                }
                            }).catch(err => { // no video capabilitiy
                                if (err === 'ipOnlyError') {
                                    throw err;
                                } else {
                                    return true;
                                }
                            });
                        }).then(() => {
                            if (shouldRejectAutoOauth()) {
                                // Clear token
                                OauthDataManager.reset();
                                // Analytics
                                $rootScope.$emit('Analytics:forcedLogin', {
                                    operationType: 'manual'
                                });
                                return $q.reject({
                                    isStreamPlus: true,
                                    isManualOperation: true
                                });
                            }
                        });
                    });
                }
            }, function (err) {

                // Analytics: loginstop - autoAccess - failed
                $rootScope.$emit('Analytics:loginStop', {
                    response: err,
                    success: false
                });

                // Autoauth failed
                $log.debug('Failed to auto authorize');
                return $q.reject(err);
            });
        }

        /**
         * Get a new OauthToken and store the response. This code makes sure that we do not generate more than
         * one request at a time.
         * @param  {String} verifier device verifier token
         * @param  {String} temp     Temporary oauth token
         * @return {Promise}         This may be a new promise or a stored promise (_getTokenMutex)
         */
        function getToken(verifier, temp) {
            var oAuthData = OauthDataManager.get(),
                expiration = oAuthData.expiration,
                unixTimeNow = Date.now(),
                oAuthFields = {},
                ajaxOptions = {
                    bypassRefresh: true,
                    oAuthFields: oAuthFields,
                    method: 'POST',
                    url: oAuthConfig.tokenUrl
                };

            //_getTokenMutex keeps us from trying to fetch the token more than once.
            if (!_getTokenMutex) {
                if (verifier) {
                    oAuthFields[verifierKey] = verifier;
                } else if (unixTimeNow < expiration) {
                    oAuthFields[refreshTokenKey] = oAuthData.refreshToken;
                } else {
                    return $q.reject('Expired Token');
                }

                if (temp) {
                    ajaxOptions.oAuthTemp = temp;
                }

                _getTokenMutex = $http(ajaxOptions).then(function (response) {
                    var oAuthData = getOAuthDataFromResponse(response);
                    _getTokenMutex = null;
                    _loginRequired = false;

                    // STVWEB-600: Reject token if it's already expired, e.g. client clock is set to a future time
                    if (isExpired(oAuthData.expiration)) {
                        return $q.reject('Expired Token');
                    }

                    OauthDataManager.set(oAuthData);
                    startTimer(oAuthData.expiration);

                    $rootScope.$emit('Analytics:receivedOauthToken', {
                        success: true,
                        oauth: oAuthData
                    });
                    return oAuthData;
                }, (err) => {
                    _getTokenMutex = null;

                    // Analytics
                    let errorResponse = getOAuthErrorCodeFromResponse(err);
                    $rootScope.$emit('Analytics:receivedOauthToken', {
                        success: false,
                        response: errorResponse,
                        errorCode: errorResponse.errorCode,
                        clientErrorCode: err.headers('x-pi-auth-failure'),
                        errorMessage: errorResponse.errorMessage
                    });
                    return $q.reject(errorResponse);
                });
            }

            return _getTokenMutex;
        }

        /**
         * Parse the response text and extract the key pairs.
         * @param  {HttpResponseObject} oAuthResponse A response from an oauth service
         * @return {Object}             Object with oauth data
         */
        function getOAuthDataFromResponse(oAuthResponse) {
            if (!oAuthResponse || !oAuthResponse.data) {
                throw new Error('unable to get data from response');
            }
            let oAuthString = oAuthResponse.data;
            // get keys and map them to preferred param name
            let dataPairs = httpUtil.getPairsFromQueryString(oAuthString);
            // Look for each known parameter key and get the value, assign it to dataMap
            return Object.keys(dataPairs).reduce((memo, key) => {
                if (OauthKeyMap[key] && dataPairs[key]) {
                    memo[OauthKeyMap[key]] = dataPairs[key];
                }
                return memo;
            }, {});
        }

        function getAutoAccessDataFromResponse(oAuthResponse) {
            if (!oAuthResponse || !oAuthResponse.data) {
                throw new Error('unable to get data from response');
            }
            return {
                deviceRegistration: oAuthResponse.data.xoauth_device_registration,
                deviceVerifier: oAuthResponse.data.xoauth_device_verifier,
                verifier: oAuthResponse.data.oauth_verifier,
                accountType: oAuthResponse.data.xoauth_account_type,
                classification: oAuthResponse.data.xoauth_classification
            };
        }

        /*
         * Parse OAuth response for error
         *
         * @param {string} oAuthErrorCodeResponse Raw OAuth response
         *
         * @return {string} Error code, usually a number
         */
        function getOAuthErrorCodeFromResponse(oAuthErrorCodeResponse) {
            var errorCode = 0, errorName = 'UNKNOWN', matches, errorMessage, clientErrorMessage;

            oAuthErrorCodeResponse = oAuthErrorCodeResponse.data;
            // format of response is typically ERROR_CODE (1010) some error code explained
            // get just the (1010) portion
            if (oAuthErrorCodeResponse) {
                matches = oAuthErrorCodeResponse.match(/\([0-9]+\)/g);
                errorCode = matches && matches.length > 0 && matches[0];
                // remove parens
                errorCode = errorCode && errorCode.replace(/[()]/g, '');

                // Normalize error code
                switch (errorCode) {
                    case '1010':
                    case '1012':
                    case '1024':
                    case '1025':
                    case '1027':
                    case '1032': {
                        errorCode = errorCode ? 'WLI-' + errorCode : errorCode;
                        break;
                    }

                    default: {
                        errorCode = 'WLI-9000';
                        break;
                    }
                }

                errorName = oAuthErrorCodeResponse.match(/RC_[A-Z_]*/g);
                errorName = errorName && errorName.length > 0 && errorName[0];

                clientErrorMessage = ('object' === typeof oAuthErrorCodeResponse) ?
                    JSON.stringify(oAuthErrorCodeResponse) :
                    oAuthErrorCodeResponse;
                errorMessage = errorCodesService.getMessageForCode(errorCode);
            }
            return {
                isInvalidCreds: (errorCode === 'WLI-1010'),
                errorName: errorName,
                errorMessage: errorMessage,
                errorCode: errorCode,
                clientErrorMessage
            };
        }

        /**
         * Get a temporary token
         *
         * @return {Promise} [description]
         */
        function getTemporaryToken() {
            //Make sure that we wipe the old token so that it isn't used when getting the new token
            OauthDataManager.set({
                token: null,
                tokenSecret: null
            });
            return $http({
                    bypassRefresh: true,
                    oAuthIgnoreToken: true,
                    method: 'POST',
                    url: oAuthConfig.temporaryRequestUrl
                }).then(getOAuthDataFromResponse,
                err => {
                    $rootScope.$emit('Analytics:loginStop', {
                        response: getOAuthErrorCodeFromResponse(err),
                        success: false
                    });
                    return $q.reject(getOAuthErrorCodeFromResponse(err));
                });
        }

        /* Private method */
        function _deviceOauthRequest(temp, verifier, reqUrl, reqOpt, responseHandler) {
            var oAuthData = OauthDataManager.get(),
                authData = {
                    xoauth_device_id: oAuthData.deviceId,
                    xoauth_device_type: oAuthData.deviceType,
                    oauth_token: temp.token
                };

            if (verifier) {
                authData.xoauth_device_verifier = verifier;
            }

            let options = angular.extend({
                bypassRefresh: true,
                oAuthTemp: temp,
                oAuthIgnoreToken: true,
                data: authData,
                method: 'POST',
                url: reqUrl
            }, reqOpt);
            return $http(options).then((response) => {
                // Analytics: Capture authorization attempt Id
                $rootScope.$emit('Analytics:captureAuthAttemptId', {
                    authAttemptId: response.headers('x-trace-id')
                });
                if (angular.isFunction(responseHandler)) {
                    var oAuthDeviceData = responseHandler(response);
                    if (oAuthDeviceData) {
                        //Store device auth data here so we know refreshToken can be run

                        OauthDataManager.set(oAuthDeviceData);
                        return oAuthDeviceData.verifier;
                    } else {
                        return $q.reject('Unable to retrieve device data');
                    }
                }
                return response;
            }, (err) => {

                // Analytics: Capture authorization attempt Id
                $rootScope.$emit('Analytics:captureAuthAttemptId', {
                    authAttemptId: err.headers('x-trace-id')
                });

                return $q.reject(getOAuthErrorCodeFromResponse(err));
            });
        }

        /**
         * Use stored device token to fetch a new _verifier_ ??
         *
         * I suspect that this may not be necessary, since we are using a temp token and a stored device_verifer
         * to get a new device verifier.
         */
        function authorizeDevice(verifier, temp) {
            return _deviceOauthRequest(temp, verifier, oAuthConfig.deviceAuthorizationUrl, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    return Object.keys(obj)
                        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
                        .join('&');
                }
            }, getOAuthDataFromResponse);
        }

        function autoAuthorize(temp) {
            return _deviceOauthRequest(temp, null, oAuthConfig.autoAuthorizationUrl, {
                headers: {
                    'Content-Type': 'application/json'
                },
                ignoreStatus: [401]
            }, getAutoAccessDataFromResponse);
        }

        function tokenExchange(temp) {
            return _deviceOauthRequest(temp, null, oAuthConfig.tokenExchangeUrl, {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    return Object.keys(obj)
                        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
                        .join('&');
                }
            }, getOAuthDataFromResponse);
        }

        /**
         * Use a username and password combination get a device verifier token to use in the _getToken_ call.
         *
         * @param  {String} username
         * @param  {String} password
         * @param  {String} temp     Temporary token
         * @return {Promise}
         */
        function authorizeUser(username, password, temp) {

            var oAuthData = OauthDataManager.get(),
                authData = {
                    xoauth_device_id: oAuthData.deviceId,
                    xoauth_device_type: oAuthData.deviceType,
                    oauth_token: temp.token,
                    username: username,
                    password: password
                };

            return $http({
                    bypassRefresh: true,
                    oAuthTemp: temp,
                    oAuthIgnoreToken: true,
                    data: authData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        return Object.keys(obj)
                            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
                            .join('&');
                    },
                    method: 'POST',
                    url: oAuthConfig.deviceAuthorizationUrl
                })
                .then(function (response) {
                    var oAuthDeviceData = getOAuthDataFromResponse(response);
                    if (oAuthDeviceData) {
                        //Store device auth data here so we know refreshToken can be run
                        OauthDataManager.set(oAuthDeviceData);
                        return oAuthDeviceData.verifier;
                    } else {
                        return $q.reject([{
                            isInvalidCreds: false,
                            url: oAuthConfig.deviceAuthorizationUrl
                        }]);
                    }
                });

        }

        function startTimer(expiration) {

            var millis = expiration - Date.now() - _refreshBufferTime; //oAuthConfig.refreshBufferTime;
            if (millis > 0) {
                removeTimeouts();
            }
            _timerPromise = $timeout(function () {
                _timerPromise = null;
                refreshToken();
            }, millis);

            return _timerPromise;
        }

        /*
         * Returns modified headers for OAuth requests
         *
         * @param {Object} options URL, POST/GET, oAuthParamKeys to send, ignoreTokenSecret
         * for pre-token oauth calls
         *
         * @return {Object} Modified headers including OAuth headers to be send with request
         */
        function getHeader(request) {
            var oAuthData = OauthDataManager.get(),

                // oauth keys to always send
                params = Object.assign(
                {
                    'oauth_consumer_key': oAuthConfig.consumerKey,
                    'oauth_nonce': guid(),
                    'oauth_signature_method': oAuthConfig.signatureMethod,
                    'oauth_token': '',
                    'oauth_timestamp': Date.now(),
                    'oauth_version': oAuthConfig.version
                }, request.oAuthFields),

                isTemp = request.oAuthTemp ? true : false,

                paramsHeader,
                signature;

            if (!request.oAuthIgnoreToken) {
                params.oauth_token = (isTemp ? request.oAuthTemp.token : request.oauth_token) || '';
            }

            if (oAuthData.accountType) {
                params.oauth_account_type = oAuthData.accountType;
            }

            if (isTemp) {
                oAuthData.token = request.oAuthTemp.token;
                oAuthData.tokenSecret = request.oAuthTemp.tokenSecret;
            }
            signature = OauthSigner.sign(request, oAuthData, params);

            paramsHeader = Object.keys(params).map(key => key + '="' + params[key] + '"').sort().join(', ');
            // append signature to header
            paramsHeader += ', oauth_signature="' + signature + '"';

            return {
                'Authorization': 'OAuth ' + paramsHeader
            };
        }

        function isExpired(timestamp, buffer = 0) {
            var now = Date.now();
            return Number(timestamp) === 0 || ((now + buffer) > Number(timestamp));
        }

        function guid() {
            function S4() {
                return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
            }

            return (
                S4() + S4() +
                S4() +
                S4() +
                S4() +
                S4() + S4() + S4()
            );
        }

        function reset() {
            OauthDataManager.reset();
        }
        function logout() {
            httpUtil.logout();
        }

        /**
         * Clear any existing timeout that might be waiting to refresh the token.
         */
        function removeTimeouts() {
            if (_timerPromise) {
                $timeout.cancel(_timerPromise);
            }
        }
    }//End OauthService
}());
