/* globals spyOn, localStorage */
describe('ovpApp.oauth', function () {
    'use strict';
    var OauthService,
        getSpy,
        $scope,
        $rootScope,
        $q,
        $httpBackend,
        $http,
        config,
        $timeout,
        OauthDataManager,
        $cookies,
        httpUtil,
        $location,
        mockStoredOauthData,
        flushOk = false,
        hasIpTv = true;

    let mockErrorCodesService = {
        getMessageForCode : function(){return 'mock-error-msg';},
        getHeaderForCode : function(){return 'mock-error-hdr';},
        getAlertForCode : function(){ return {
            message: 'mock-error-code',
            title: 'mock-error-code',
            buttonText: 'OK'
        };},
        getAltForCode : function(){return 'mock-error-alt';},
        getErrorCodes : angular.noop,
        subscribe : angular.noop
    };

    // beforeEach(module('ovpApp.services.errorCodes'));
    beforeEach(module('ovpApp.oauth'));

    beforeEach(module(function ($provide) {
        httpUtil = {
            getPairsFromQueryString: angular.noop
        };
        $provide.constant('errorCodesService', mockErrorCodesService);
        window.localStorage.setItem('device_id', '"mock-device-id"');
        $provide.value('httpUtil', httpUtil);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function (_$controller_, _$rootScope_, _config_, $window,
                                _$q_, _$injector_, _$http_, _OauthService_,
                                _$timeout_, _$cookies_, _OauthDataManager_, _$location_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        config = _config_;
        $q = _$q_;
        $httpBackend = _$injector_.get('$httpBackend');
        $http = _$http_;
        $timeout = _$timeout_;
        $cookies = _$cookies_;
        $location = _$location_;
        OauthDataManager = _OauthDataManager_;
        OauthService = _OauthService_;
        // enabled streamPlus
        config.streamPlus.enabled = true;
        // enable sso
        config.ssoEnabled = true;
    }));

    afterEach(function () {
        if (!flushOk) {
            $timeout.verifyNoPendingTasks();
        }
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
        flushOk = false;

    });

    it('should instantiate the OauthService service', function () {
        expect(OauthService).toBeDefined();
    });


    it('should verify the user is not logged in', function () {
        $httpBackend.expectPOST('temporaryRequestUrl').respond(404, 'temporary');
        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(false);
        });
        $httpBackend.flush();
        $timeout.flush();
    });

    it('if user is masquerading, auto-access should not be executed', function () {
        $location.search = function () {
            return {
                mqtn: 'void'
            };
        };

        let autoSpy = spyOn(mockProfileService, 'isAutoAuthEnabled').and.returnValue(true);
        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (request) {
            if (request === 'autotemptoken') {
                return {
                    oauth_token: 'temptoken',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'rfshtkn',
                    oauth_token_secret: 'EV4gXm3puVFE2qYD'
                };
            } else if (request === 'masqueradeToken') {
                //This will be passed to getToken
                return {
                    oauth_token: 'masqtoken',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'masqrfshtkn',
                    oauth_token_secret: 'fakesecret2',
                    oauth_verifier: 'verifierval'
                };
            } else if (request === 'tokenExchange') {
                return {
                    oauth_token: 'postmasqtoken',
                    oauth_token_secret: 'fakesecret',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'fakerefresh'
                };
            } else {
                throw new Error('Unexpected request into getPairsFromQueryString: ' + request);
            }
        });
        config.masqueradeEnabled = true;
        //masqueradeUser() would oridnarily be called on service start, but that has already
        //happened so we need to call it here
        OauthDataManager.set({});
        localStorage.clear();
        $httpBackend.expectPOST('temporaryRequestUrl').respond(200, 'autotemptoken'); //???
        // $httpBackend.expectPOST('tokenExchangeUrl').respond(400);//SSO request fails, this doesn't need to happen
        $httpBackend.expectPOST('masqueradeUrl').respond(200, 'masqueradeToken');
        $httpBackend.expectPOST('tokenUrl').respond(200, 'tokenExchange');
        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
        });
        $httpBackend.flush();
        expect(utilSpy).toHaveBeenCalled();
        expect(OauthDataManager.get().token).toBe('postmasqtoken');
        flushOk = true;
    });

    it('if masquerading is disabled, do not run masquerade', function () {
        expect(config.masqueradeEnabled).toBeDefined();
        expect(OauthService.shouldAttemptMasquerade()).toBe(false);
    });

    it('if masquerading is enabled and there is a query param in the url, run masquerade', function () {
        $location.search = function () {
            return {
                mqtn: 'void'
            };
        };
        config.masqueradeEnabled = true;
        expect(config.masqueradeEnabled).toBeDefined();
        expect(OauthService.shouldAttemptMasquerade()).toBe(true);
    });

    it('if masquerading is enabled and there is no query param in the url, dont run masquerade', function () {
        $location.search = function () {
            return {};
        };
        config.masqueradeEnabled = true;
        expect(OauthService.shouldAttemptMasquerade()).toBe(false);
    });

    it('should try to refresh an existing oauth token if the expiration is soon', function () {
        let nowTimestamp = Date.now();

        //The initial call to ooauth data should return this object
        mockStoredOauthData = {
            consumer: null,
            deviceId: null,
            deviceType: null,
            deviceVerifier: null,
            expiration: nowTimestamp + 10000,
            secret: 'xyz',
            refreshToken: 'abc',
            token: 'token',
            tokenSecret: 's3cr3t'
        };

        OauthDataManager.set(mockStoredOauthData);
        let oauthDataSpy = spyOn(OauthDataManager, 'get').and.callThrough();
        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.returnValue({
            oauth_token: 'refreshedtoken',
            xoauth_token_expiration: Date.now() + 40000,
            xoauth_refresh_token: 'rfshtkn'
        });

        //This should trigger a refresh, since we haven't actually verified the keys are valid.
        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
            expect(oauthDataSpy).toHaveBeenCalled();
            expect(utilSpy).toHaveBeenCalled();
            expect(OauthDataManager.get().token).toBe('refreshedtoken');
            expect(OauthDataManager.get().refreshToken).toBe('rfshtkn');
        });
        //Config data is mocked in bootstrap.js
        $httpBackend.expectPOST('tokenUrl')
            .respond(200, 'thisstringisnotparsed[we use the utilSpy instead]');

        $httpBackend.flush();
        $httpBackend.expectPOST('tokenUrl')
            .respond(200, 'thisstringisnotparsed[we use the utilSpy instead]');
        $timeout.flush();
        $httpBackend.flush();
        OauthService.clearTimeout();
        $timeout.flush();
    });

    it('should update a nearly expired token', function () {
        //The initial call to ooauth data should return this object
        mockStoredOauthData = {
            consumer: null,
            deviceId: null,
            deviceType: null,
            deviceVerifier: 'notnull',
            expiration: Date.now() + 10000,
            secret: 'xyz',
            refreshToken: 'abc',
            token: 'token',
            tokenSecret: 's3cr3t'
        };
        let tokenCount = 0;
        OauthDataManager.set(mockStoredOauthData);
        let oauthDataSpy = spyOn(OauthDataManager, 'get').and.callThrough();
        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function () {
            tokenCount++;
            return {
                oauth_token: 'refreshedtoken' + tokenCount,
                xoauth_token_expiration: Date.now() + 40000,
                xoauth_refresh_token: 'rfshtkn'
            };
        });

        //This should trigger a refresh, since we haven't actually verified the keys are valid.
        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
            expect(oauthDataSpy).toHaveBeenCalled();
            expect(utilSpy).toHaveBeenCalled();
            expect(OauthDataManager.get().token).toBe('refreshedtoken1');
            expect(OauthDataManager.get().refreshToken).toBe('rfshtkn');
        });

        //This should piggy back on the same request as before - should not send a new request
        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
            expect(OauthDataManager.get().token).toBe('refreshedtoken1');
            expect(OauthDataManager.get().refreshToken).toBe('rfshtkn');
        });

        //Config data is mocked in bootstrap.js
        $httpBackend.expectPOST('tokenUrl')
            .respond(200, 'oauth_token=tokenstring&xoauth_refresh_token=refreshtoken');
        $httpBackend.flush();

        ////////////////////////////////// The expectations above are for the previous 2 isAuthenticated calls

        //Refresh
        $httpBackend.expectPOST('tokenUrl')
            .respond(200, 'thisstringisnotparsed[we use the utilSpy instead]');

        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
            expect(OauthDataManager.get().token).toBe('refreshedtoken1');
            expect(OauthDataManager.get().refreshToken).toBe('rfshtkn');
        });

        $timeout.flush(); //Forces a refresh
        $httpBackend.flush(); //Forces a tokenUrl 500 error

        //There should be a pending timeout at this point, but
        OauthService.clearTimeout();

        //Same bug as above
        $timeout.flush();
    });

    it('should try to use the deviceVerifier if the refresh token exchange fails', function () {
        //The initial call to ooauth data should return this object
        mockStoredOauthData = {
            consumer: null,
            deviceId: 'dev-id',
            deviceType: 'browser',
            deviceVerifier: 'devverifier',
            expiration: Date.now() + 10000, //Nearly expired token
            secret: 'xyz',
            refreshToken: 'abc',
            token: 'token',
            tokenSecret: 's3cr3t'
        };
        OauthDataManager.set(mockStoredOauthData);
        let oauthDataSpy = spyOn(OauthDataManager, 'get').and.callThrough();
        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (request) {
            if (request === 'temptoken') {
                return {
                    oauth_token: 'temptoken',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'rfshtkn',
                    oauth_token_secret: 'EV4gXm3puVFE2qYD'
                };
            } else if (request === 'fakedevicerequest') {
                return {
                    xoauth_device_registration: '90e88225a5225b4bd1b7e1f5ee3e60a433efa6c3',
                    xoauth_device_verifier: 'HaGAqFeW.90e88225a5225b4bd1b7e1f5ee3e60a433efa6c3',
                    oauth_verifier: 'gGl6MYTVXvUi'
                };
            } else if (request === 'faketokenresponse') {

                return {
                    oauth_token: 'faketoken',
                    oauth_token_secret: 'fakesecret',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'fakerefresh'
                };
            } else {
                throw new Error('Unexpected request into getPairsFromQueryString');
            }
        });

        //This should trigger a refresh, since we haven't actually verified the keys are valid.
        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
            expect(oauthDataSpy).toHaveBeenCalled();
            expect(utilSpy).toHaveBeenCalled();
            expect(OauthDataManager.get().token).toBe('faketoken');
            expect(OauthDataManager.get().refreshToken).toBe('fakerefresh');
            expect(OauthDataManager.get().secret).toBe('mockSecret');
            expect(OauthDataManager.get().tokenSecret).toBe('fakesecret');
        });

        $httpBackend.expectPOST('tokenUrl')
            .respond(401);

        $httpBackend.expectPOST('temporaryRequestUrl')
            .respond(200, 'temptoken');

        $httpBackend.expectPOST(
            'deviceAuthorizationUrl',
            'xoauth_device_id=undefined&xoauth_device_type=ONEAPP-OVP&oauth_token=temptoken' +
                '&xoauth_device_verifier=devverifier'
        ).respond(200, 'fakedevicerequest');

        $httpBackend.expectPOST('tokenUrl')
            .respond(200, 'faketokenresponse');

        $timeout.flush();
        $httpBackend.flush();
        OauthService.clearTimeout();
        $timeout.flush();
    });

    it('should reset the state if getting the token fails', function () {
        mockStoredOauthData = {
            consumer: null,
            deviceId: 'dev-id',
            deviceType: 'browser',
            deviceVerifier: 'devverifier',
            expiration: Date.now() - 300000, //over 30 seconds past expiration
            secret: 'xyz',
            refreshToken: 'abc',
            token: 'token',
            tokenSecret: 's3cr3t'
        };
        OauthDataManager.set(mockStoredOauthData);
        let oauthDataSpy = spyOn(OauthDataManager, 'get').and.callThrough();
        spyOn(mockProfileService, 'isAutoAuthEnabled').and.returnValue(true);
        //This spe
        let firstExpirationTime = Date.now() + 250000;
        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (arg) {
            if (arg === 'temporary') {
                return {
                    oauth_token: 'temptoken0',
                    xoauth_token_expiration: Date.now() + 25000,
                    xoauth_refresh_token: 'rfshtkn'
                };
            } else if (arg === 'authorized') {
                return {
                    oauth_token: 'deviceverifiedtoken',
                    oauth_verifier: 'vrf-key',
                    xoauth_token_expiration: firstExpirationTime,
                    xoauth_refresh_token: 'rfshtkndev',
                    xoauth_device_verifier: 'devverifiertoken'
                };
            } else if (arg === 'token') {
                return {
                    oauth_token: 'normaltoken',
                    xoauth_token_expiration: firstExpirationTime,
                    xoauth_refresh_token: 'rfshtkndev',
                    xoauth_device_verifier: 'devverifiertoken'
                };
            } else {
                throw new Error('Unexpected function call');
            }
        });

        OauthService.userLogin('un', 'pw').then(function () {
            expect(utilSpy).toHaveBeenCalled();
            expect(OauthDataManager.get().token).toBe('normaltoken');
            expect(OauthDataManager.get().deviceVerifier).toBe('devverifiertoken');
        });
        $httpBackend.expectPOST('temporaryRequestUrl').respond(200, 'temporary');
        $httpBackend.expectPOST('deviceAuthorizationUrl').respond(200, 'authorized');
        $httpBackend.expectPOST('tokenUrl').respond(200, 'token');
        $httpBackend.flush();
        expect(OauthDataManager.get().expiration).toBe(firstExpirationTime);
        OauthService.updateToken().then(function () {
            expect(OauthDataManager.get().token).toBe('normaltoken');
        });
        OauthDataManager.set({expiration: 0});
        //User should be logged in at this point, with _isAuthenticated = true

        //This should trigger a refresh, since we haven't actually verified the keys are valid.
        OauthService.updateToken().then(function () {
            throw new Error('Should not have updated the token');
        }, function (err) {
            expect(err).toEqual({ isInvalidCreds : false, errorName : 'RC_MOCK_FAILURE',
                errorMessage : 'mock-error-msg', errorCode : 'WLI-9000',
                clientErrorMessage : 'RC_MOCK_FAILURE (1111)'});
            expect(OauthDataManager.get().token).toBe(null);
            expect(OauthDataManager.get().refreshToken).toBe(null);
        });

        $httpBackend.expectPOST('temporaryRequestUrl')
            .respond(200, 'temporary');

        $httpBackend.expectPOST('deviceAuthorizationUrl').respond(401, 'RC_MOCK_FAILURE (1111)');
        // $httpBackend.expectPOST('tokenExchangeUrl').respond(401, 'RC_MOCK_FAILURE (1111)');
        $httpBackend.expectPOST('autoAuthorizationUrl').respond(401, 'RC_MOCK_FAILURE (1111)');

        $httpBackend.flush();
        expect(oauthDataSpy).toHaveBeenCalled();
        OauthService.isAuthenticated().then(auth => {
            expect(auth).toBe(false);
        });
        flushOk = true;
    });

    it('should add an appropriate header when required', function () {
        var header = OauthService.getOAuthHeader({
            url: 'testurl?paramOne=one&paramTwo=two`',
            method: 'get',
            oauth_token: 'mynewtoken'
        });
        var sig = new RegExp('OAuth oauth_consumer_key="asdf", oauth_nonce="([a-z0-9]*)", oauth_signature_m' +
            'ethod="HMOCK", oauth_timestamp="([0-9]*)", oauth_token="mynewtoken", oauth_version="0", oauth_signa' +
            'ture="hmac"');
        expect(header.Authorization).toMatch(sig);

        let tempheader = OauthService.getOAuthHeader({
            url: 'testurl?paramOne=one&paramTwo=two`',
            method: 'get',
            oAuthTemp: {
                token: 'temptoken',
                tokenSecret: 'secret'
            }
        });
        let sigtemp = new RegExp('OAuth oauth_consumer_key="asdf", oauth_nonce="([a-z0-9]*)", oauth_signature_m' +
            'ethod="HMOCK", oauth_timestamp="([0-9]*)", oauth_token="temptoken", oauth_version="0", oauth_signa' +
            'ture="hmac"');
        expect(tempheader.Authorization).toMatch(sigtemp);
    });

    it('should fail if the user password is incorrect', function () {
        OauthService.reset();
        let oauthDataSpy = spyOn(OauthDataManager, 'get').and.callThrough();
        //This spe
        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (arg) {
            if (arg === 'temporary') {
                return {
                    oauth_token: 'temptoken0',
                    xoauth_token_expiration: Date.now() + 25000,
                    xoauth_refresh_token: 'rfshtkn'
                };
            } else {
                throw new Error('Unexpected function call');
            }
        });
        OauthService.userLogin('un', 'pw').then(() => {
            throw new Error('User login should fail');
        }, function (err) {
            expect(utilSpy).toHaveBeenCalled();
            expect(OauthDataManager.get().token).toBe(null);
            expect(OauthDataManager.get().deviceVerifier).toBe(null);
            expect(err.errorCode).toBe('WLI-1025');
            expect(err.errorName).toBe('RC_LOGIN_FAIL');
        });
        $httpBackend.expectPOST('temporaryRequestUrl')
            .respond(200, 'temporary');

        $httpBackend.expectPOST('deviceAuthorizationUrl').respond(401, 'RC_LOGIN_FAIL (1025)');
        $httpBackend.flush();
        expect(oauthDataSpy).toHaveBeenCalled();
        $timeout.flush();
    });

    it('should fail if the response is empty', function () {
        OauthService.userLogin('un', 'pw');
        $httpBackend.expectPOST('temporaryRequestUrl')
            .respond(200);
        expect(function () {
            $httpBackend.flush();
        }).toThrow();
        flushOk = true;
    });

    it('should update the token if the localStorage gets updated', function () {
        //The initial call to ooauth data should return this object
        mockStoredOauthData = {
            consumer: null,
            deviceId: 'dev-id',
            deviceType: 'browser',
            deviceVerifier: 'devverifier',
            expiration: Date.now() + 30000, //over 30 seconds past expiration
            secret: 'xyz',
            refreshToken: 'abc',
            token: 'token',
            tokenSecret: 's3cr3t'
        };
        OauthDataManager.set(mockStoredOauthData);
        let lastWrite = localStorage.getItem('_lastWriteTime');
        localStorage.setItem('_lastWriteTime', JSON.stringify(lastWrite + 100));
        localStorage.setItem('oauth.token', JSON.stringify('newToken'));
        let data = OauthDataManager.get();
        expect(data.token).toBe('newToken');
        $timeout.flush();
    });

    it('should auto authenticate if the user is enabled', function() {
        OauthDataManager.set({});
        localStorage.clear();
        hasIpTv = false;
        let autoSpy = spyOn(mockProfileService, 'isAutoAuthEnabled').and.returnValue(true);
        let isIpSpy = spyOn(mockProfileService, 'isIptvPackage').and.callFake(function() {
            return $q.resolve(true);
        });

        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (request) {
            if (request === 'autotemptoken') {
                return {
                    oauth_token: 'temptoken',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'rfshtkn',
                    oauth_token_secret: 'EV4gXm3puVFE2qYD'
                };
            } else if (request === 'refreshautotoken') {
                return {
                    oauth_token: 'faketoken',
                    oauth_token_secret: 'fakesecret',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'fakerefresh'
                };
            } else {
                throw new Error('Unexpected request into getPairsFromQueryString: ' + request);
            }
        });

        OauthService.isAuthenticated().then(function (auth) {
            expect(isIpSpy).toHaveBeenCalled();
            expect(auth).toBe(true);
        });

        $httpBackend.expectPOST('temporaryRequestUrl').respond(200, 'autotemptoken');
        // $httpBackend.expectPOST('tokenExchangeUrl').respond(401, 'RC_MOCK_FAILURE (1111)');
        $httpBackend.expectPOST('autoAuthorizationUrl')
            .respond(200, {
                xoauth_device_registration: 'autoauth',
                xoauth_device_verifier: 'devver',
                oauth_verifier: 111
            });
        $httpBackend.expectPOST('tokenUrl').respond(200, 'refreshautotoken');
        // $httpBackend.expectGET('/ipvs/api/smarttv/offers/v1/buyflow/eligible').respond(401);
        $httpBackend.flush();

        expect(utilSpy).toHaveBeenCalled();
        flushOk = true;
    });

    it('should auto authenticate if the sso is enabled', function() {
        $location.search = function () {
            return {
                sessionOverride: 'true'
            };
        };
        OauthDataManager.set({});
        localStorage.clear();
        hasIpTv = false;

        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (request) {
            if (request === 'temptoken') {
                return {
                    oauth_token: 'temptoken',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'rfshtkn',
                    oauth_token_secret: 'EV4gXm3puVFE2qYD'
                };
            } else if (request === 'exchangetoken') {
                return {
                    oauth_token: 'exchangetoken',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'exchangerefresh',
                    oauth_token_secret: 'EV4gXm3puAAA2qYA'
                };
            } else if (request === 'refreshautotoken') {
                return {
                    oauth_token: 'faketoken',
                    oauth_token_secret: 'fakesecret',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'fakerefresh'
                };
            } else {
                throw new Error('Unexpected request into getPairsFromQueryString: ' + request);
            }
        });

        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
        });

        $httpBackend.expectPOST('temporaryRequestUrl').respond(200, 'temptoken');
        $httpBackend.expectPOST('tokenExchangeUrl').respond(200, 'exchangetoken');
        $httpBackend.expectPOST('tokenUrl').respond(200, 'refreshautotoken');
        $httpBackend.flush();

        expect(utilSpy).toHaveBeenCalled();
        flushOk = true;
    });

    it('should not autoauthenticate if the user has previously signed out', function() {
        OauthDataManager.set({});
        localStorage.clear();

        localStorage.setItem('autoAuthEnabled', 'false');

        let utilSpy = spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (request) {
            throw new Error('Unexpected request into getPairsFromQueryString: ' + request);
        });

        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(false);
        });
        expect(utilSpy).not.toHaveBeenCalled();
        flushOk = true;
    });

    it('should authenticate into specu and send the type in the header', function() {
        // enabled specU
        config.specU.enabled = true;
        mockProfileService.isSpecU = () => true;
        mockProfileService.isSpecUOrBulkMDU = () => true;

        OauthDataManager.set({});
        localStorage.clear();
        spyOn(mockProfileService, 'isAutoAuthEnabled').and.returnValue(true);
        spyOn(httpUtil, 'getPairsFromQueryString').and.callFake(function (request) {
            if (request === 'autotemptoken') {
                return {
                    oauth_token: 'temptoken',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'rfshtkn',
                    oauth_token_secret: 'EV4gXm3puVFE2qYD'
                };
            } else if (request === 'refreshautotoken') {
                return {
                    oauth_token: 'faketoken',
                    oauth_token_secret: 'fakesecret',
                    xoauth_token_expiration: Date.now() + 40000,
                    xoauth_refresh_token: 'fakerefresh'
                };
            } else {
                throw new Error('Unexpected request into getPairsFromQueryString: ' + request);
            }
        });

        OauthService.isAuthenticated().then(function (auth) {
            expect(auth).toBe(true);
        });

        $httpBackend.expectPOST('temporaryRequestUrl').respond(200, 'autotemptoken');
        // $httpBackend.expectPOST('tokenExchangeUrl').respond(401, 'RC_MOCK_FAILURE (1111)');
        $httpBackend.expectPOST('autoAuthorizationUrl')
            .respond(200, {
                xoauth_device_registration: 'autoauth',
                xoauth_device_verifier: 'devver',
                xoauth_account_type: 'SPECU', // <---- This is important
                oauth_verifier: 111
            });
        $httpBackend.expectPOST('tokenUrl').respond(200, 'refreshautotoken');
        $httpBackend.flush();

        let header = OauthService.getOAuthHeader({
            method: 'GET',
            url: 'https://services.timewarnercable.com/testurl?testa=one&testb=two'
        });
        expect(header.Authorization).toContain('oauth_account_type');
        expect(header.Authorization).toContain('oauth_token="faketoken"');
        flushOk = true;
    })

});
