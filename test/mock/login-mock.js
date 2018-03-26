define(function (require, exports) {
    'use strict';

    var oAuthConfig = require('config/oAuthConfig'),
        ovpConfig = require('config/config'),
        OAuthAuthenticator = require('components/auth/OAuthAuthenticator'),
        oAuthManager = require('components/oauth/oauth-manager'),
        Deferred = require('deferred');

    exports.mock = function () {
        oAuthConfig.temporaryRequestUrl = '/js/test/fixtures/login/oauth-request.txt';
        oAuthConfig.deviceAuthorizationUrl = '/js/test/fixtures/login/oauth-authorize.txt';
        oAuthConfig.tokenUrl = '/js/test/fixtures/login/oauth-token.txt';
        oAuthConfig.legacyTokensUrl = '/js/test/fixtures/login/legacy-cookies.txt';
        ovpConfig.customerInfoUrl = function () {
            return '/js/test/fixtures/login/name.json';
        };
        ovpConfig.capabilitiesUrl = function () {
            return '/js/test/fixtures/login/capabilities.json';
        };
        ovpConfig.locationUrl = function () {
            return '/js/test/fixtures/login/location.json';
        };

        OAuthAuthenticator.prototype.isAuthenticated = function () {
            var deferred = new Deferred();
            deferred.resolve();
            return deferred.promise();
        };

        oAuthManager.getOAuthHeader = function () {
            var deferred = new Deferred();
            deferred.resolve({ key: 'fake auth header', value: 'no value' });
            return deferred.promise();
        };
    };
});
