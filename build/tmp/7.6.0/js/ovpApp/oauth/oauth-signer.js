'use strict';

(function () {
    'use strict';
    OauthSigner.$inject = ["OauthDataManager", "sha1"];
    angular.module('ovpApp.oauth').service('OauthSigner', OauthSigner);

    /* @ngInject */
    function OauthSigner(OauthDataManager, sha1) {
        var Sha = sha1;

        return {
            getQueryParams: getQueryParams,
            sign: sign
        };

        function getQueryParams(url) {
            var queryParams = {},
                queryStringMatches = url.match(/[?&][^?]+/g),
                queryString,
                qParams,
                i,
                pair,
                split,
                key,
                value;

            if (queryStringMatches && queryStringMatches.length) {
                queryString = queryStringMatches[0].substring(1);
                qParams = queryString.match(/[^?&]+/g);

                for (i = 0; i < qParams.length; i++) {
                    pair = qParams[i];
                    split = pair.split('=');
                    key = '';
                    value = '';

                    if (split.length < 2) {
                        key = pair;
                    } else {
                        key = split[0];
                        value = split[1];
                    }

                    queryParams[key] = encodeURIComponent(value);
                }
            }

            return queryParams;
        }

        function sign(request, oAuthData, oAuthParams) {

            // remove querystring from URL
            var shortUrl = request.url.match(/[^?]+/g)[0],
                method = request.method ? request.method.toUpperCase() : request.type.toUpperCase(),

            // base URI used in oauth signature
            baseUri = method + '&' + encodeURIComponent(shortUrl),
                tokenSecret = oAuthData.tokenSecret || '',
                queryParams = {},
                allParams,
                paramsSignature,
                paramsHeader,
                unsignedParams,
                sha1Generator,
                secret,
                hmac;

            if (oAuthData.token && oAuthData.tokenSecret) {
                oAuthParams.oauth_token = oAuthData.token;
            }

            // if get, retrieve querystring params and append to signature
            if (method === 'GET') {
                queryParams = getQueryParams(request.url);
            }

            allParams = Object.assign({}, queryParams, oAuthParams);
            paramsSignature = Object.keys(allParams).map(function (key) {
                return key + '=' + allParams[key];
            }).sort().join('&');
            paramsSignature = encodeURIComponent(paramsSignature);
            paramsHeader = Object.keys(oAuthParams).map(function (key) {
                return key + '="' + oAuthParams[key] + '"';
            }).sort().join(', ');

            // this is the string we will sign
            unsignedParams = baseUri + '&' + paramsSignature;
            sha1Generator = new Sha(unsignedParams, 'TEXT');

            // secret is normally the OVP secret concatenatenated the the token secret returned from PI,
            // however some PI OAuth API calls do not use it so you can choose to ignore it.
            secret = OauthDataManager.get().secret + '&' + tokenSecret;
            // sign
            hmac = encodeURIComponent(sha1Generator.getHMAC(secret, 'TEXT', 'SHA-1', 'B64'));

            return hmac;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/oauth/oauth-signer.js.map
