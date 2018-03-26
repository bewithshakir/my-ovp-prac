/* globals window */
describe('ovpApp.OauthDataManager', function () {
    'use strict';
    beforeEach(module('ovpApp.oauth'));
    afterEach(function () {
        window.localStorage.clear();
    });

    it('should migrate the data from legacy keys', function () {
        var OauthDataManager;
        window.localStorage.setItem('device_id', '"mock-device-id"');
        window.localStorage.setItem('twctv:oauth:device_verifier', 'device0');
        window.localStorage.setItem('twctv:oauth:expiration', '100');
        window.localStorage.setItem('twctv:oauth:refresh_token', 'refreshtoken');
        window.localStorage.setItem('twctv:oauth.token', 'token');
        window.localStorage.setItem('twctv:oauth:token_secret', 'secret');

        inject(function (_OauthDataManager_) {
            OauthDataManager = _OauthDataManager_;
        });

        expect(window.localStorage.getItem('oauth:device_verifier')).toBe('"device0"');
        expect(window.localStorage.getItem('oauth:expiration')).toBe('"100"');
        expect(window.localStorage.getItem('oauth:refresh_token')).toBe('"refreshtoken"');

        expect(OauthDataManager.get().token).toBe('token');
        expect(OauthDataManager.get().expiration).toBe('100');

        OauthDataManager.set({'deviceVerifier': 'newDeviceVerifier'});

        expect(window.localStorage.getItem('twctv:oauth:deviceVerifier')).toBe(null);
    });


    it('should initialize correctly after migration', function () {
        var OauthDataManager;
        window.localStorage.setItem('oauth:device_verifier', '"device0"');
        window.localStorage.setItem('oauth:expiration', '"100"');
        window.localStorage.setItem('oauth:refresh_token', '"refreshtoken"');
        window.localStorage.setItem('oauth.token', '"token"');
        window.localStorage.setItem('oauth:token_secret', '"secret"');


        inject(function (_OauthDataManager_) {
            OauthDataManager = _OauthDataManager_;
        });

        expect(window.localStorage.getItem('oauth:device_verifier')).toBe('"device0"');
        expect(window.localStorage.getItem('oauth:expiration')).toBe('"100"');
        expect(window.localStorage.getItem('oauth:refresh_token')).toBe('"refreshtoken"');

        expect(OauthDataManager.get().token).toBe('token');
        expect(OauthDataManager.get().expiration).toBe('100');
    });
});
