'use strict';

(function () {
    'use strict';
    angular.module('ovpApp.oauth', ['ovpApp.config', 'ovpApp.legacy.httpUtil', 'ovpApp.messages', 'ngCookies', 'ovpApp.services.ovpStorage', 'ovpApp.legacy.deviceid', 'lib.sha1', 'ovpApp.analytics', 'ovpApp.services.streamPlusService', 'ovpApp.services.profileService'])
    //.sservice('OauthService', OauthService)
    .constant('OauthKeyMap', {
        'oauth_token': 'token',
        'oauth_token_secret': 'tokenSecret',
        'xoauth_token_expiration': 'expiration',
        'xoauth_device_registration': 'deviceRegistration',
        'oauth_verifier': 'verifier',
        'xoauth_device_verifier': 'deviceVerifier',
        'xoauth_refresh_token': 'refreshToken'
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/oauth/oauth.js.map
