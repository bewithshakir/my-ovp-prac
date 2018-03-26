(function () {
    'use strict';
    angular.module('ovpApp.config')
        .service('oAuthConfig', oAuthConfig);

    function oAuthConfig(config, stringUtil) {
        var s = stringUtil.fromBase64(stringUtil.fromBase64(config.oAuth.s));

        return {
            deviceAuthorizationUrl:
                config.piHost +
                config.oAuthApi +
                config.oAuth.authorize,
            autoAuthorizationUrl:
                config.piHost +
                config.oAuthApi +
                config.oAuth.autoAuthorize,
            masqueradeUrl:
                config.piHost +
                config.oAuthApi +
                config.oAuth.masqueradeAuthorize,
            headerKey: 'Authorization',
            headerValuePrefix: 'OAuth ',
            consumerKey: config.oAuth.consumerKey,
            cookieKey: 'oAuth',
            signatureMethod: 'HMAC-SHA1',
            refreshBufferTime: 10000, //in milliseconds
            s: s,
            statusUrl:
                config.piHost +
                config.oAuthApi +
                config.oAuth.status,
            temporaryRequestUrl:
                config.piHost +
                config.oAuthApi +
                config.oAuth.tempRequest,
            tokenUrl:
                config.piHost +
                config.oAuthApi +
                config.oAuth.token,
            version: '1.0',
            tokenExchangeUrl:
                config.piHost +
                config.oAuthApi +
                config.oAuth.tokenExchange
        };
    }

}());
