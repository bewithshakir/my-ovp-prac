/* globals $ */
'use strict';

(function () {
    'use strict';
    LegacyHttpUtil.$inject = ["config", "oAuthConfig", "OauthDataManager", "$location", "$rootScope", "drmSessionService", "$state", "$window", "$injector", "$q", "ovpStorage", "storageKeys"];
    angular.module('ovpApp.legacy.httpUtil', ['ovpApp.config', 'ovpApp.oauth', 'ovpApp.services.drmSessionService', 'ui.router', 'ovpApp.services.ovpStorage']).factory('httpUtil', LegacyHttpUtil).run(["httpUtil", function (httpUtil) {

        /**
         *  This is needed for all non-angular jquery ajax requests.
         */
        $.ajaxSetup({
            statusCode: {
                401: httpUtil.logout
            }
        });
    }]);

    /* @ngInject */
    function LegacyHttpUtil(config, oAuthConfig, OauthDataManager, $location, $rootScope, drmSessionService, $state, $window, $injector, $q, ovpStorage, storageKeys) {

        var queryStringDictionary;

        return {
            cleanUp: cleanUp,
            logout: logout,
            getQueryStringValue: getQueryStringValue,
            getPairsFromQueryString: getPairsFromQueryString,
            toString: function toString() {
                return 'HttpUtil';
            },
            updateQueryStringParameter: updateQueryStringParameter,
            removeURLParameter: removeURLParameter
        };

        ///

        /*
         * Retrieve a value from the querystring
         *
         * @param {String} key Key to get
         *
         * @return {String} The value for the given key
         */
        function getQueryStringDictionary() {
            if (!queryStringDictionary) {
                queryStringDictionary = $location.search();
            }

            return angular.copy(queryStringDictionary);
        }

        /*
         * Get a dictionary of key value pairs from a query string or a url
         *
         * @param {String} queryString Query string to parse
         *
         * @return {Object} Dictionary of key/value pairs, looked up via key
         */
        function getPairsFromQueryString(url) {
            var queryString, params;

            if (!url) {
                return getQueryStringDictionary();
            }
            params = url.match(/.*\?(.*)/);

            if (params && params.length > 1) {
                queryString = params[1];
            } else if (url.indexOf('://') < 0) {
                queryString = url;
            }

            if (queryString) {
                return queryString.split('&').reduce(function (memo, keys) {
                    var k = keys.split('=');
                    memo[k[0]] = decodeURIComponent(k[1]);
                    return memo;
                }, {});
            } else {
                return {};
            }
        }

        /*
         * Retrieve a value from the query string
         *
         * @param {String} key Key to get
         *
         * @return {String} The value for the given key
         */
        function getQueryStringValue(key) {
            return getQueryStringDictionary()[key];
        }

        /*
        * Add or update a query string parameter
        *
        * @param {String} uri The entire URL including query
        * @param {String} key The key to add or replace
        * @param {String} value The value to set or update
        *
        * @return {String} The updated URI
        */
        function updateQueryStringParameter(uri, key, value) {
            // remove the hash part before operating on the uri
            var i = uri.indexOf('#');
            var hash = i === -1 ? '' : uri.substr(i);
            uri = i === -1 ? uri : uri.substr(0, i);

            var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
            var separator = uri.indexOf('?') !== -1 ? '&' : '?';

            if (!value) {
                // remove key-value pair if value is empty
                uri = uri.replace(new RegExp('([&]?)' + key + '=.*?(&|$)', 'i'), '');
                if (uri.slice(-1) === '?') {
                    uri = uri.slice(0, -1);
                }
            } else if (uri.match(re)) {
                uri = uri.replace(re, '$1' + key + '=' + value + '$2');
            } else {
                uri = uri + separator + key + '=' + value;
            }
            return uri + hash;
        }

        /**
         * From: https://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
         */
        function removeURLParameter(url, parameter) {
            //prefer to use l.search if you have a location/link object
            var urlparts = url.split('?');
            if (urlparts.length >= 2) {

                var prefix = encodeURIComponent(parameter) + '=';
                var pars = urlparts[1].split(/[&;]/g);

                //reverse iteration as may be destructive
                for (var i = pars.length; i-- > 0;) {
                    //idiom for string.startsWith
                    if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                        pars.splice(i, 1);
                    }
                }

                url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
                return url;
            } else {
                return url;
            }
        }

        function cleanUp() {
            OauthDataManager.reset();
            drmSessionService.reset();
        }

        function flushAnalytics() {
            // Note: there is no longer a need to flush venona analytics. The
            // 'prepareForRefresh' event is used when a visit needs to continue.
            // Recommend future rename of this method to 'flushSplunk'.
            var SplunkService = $injector.get('SplunkService');
            return $q.all([SplunkService.flush()]);
        }

        function logout() {
            var flags = arguments.length <= 0 || arguments[0] === undefined ? { allowAutoLogin: false } : arguments[0];

            cleanUp();

            // Set flags to prevent auto login
            var preventAutoLogin = !angular.isDefined(flags.allowAutoLogin) || flags.allowAutoLogin === false;
            if (preventAutoLogin) {
                ovpStorage.setItem(storageKeys.autoAuthSignOutTime, Date.now());
            }

            //Only refresh the page if we are coming from a known state or not login
            //This will most likely be the root state "/", if the user has come frome here they
            //Would not have any data loaded because that is from manual navigation that would force a
            //refresh.
            //This forces a refresh to ensure that the user data is unloaded from memory.
            if (!($state.includes('login') || $state.current && $state.current.name === '')) {
                $rootScope.$emit('Analytics:logout', {
                    goOffline: true,
                    triggeredBy: preventAutoLogin ? 'user' : 'application'
                });
                flushAnalytics()['finally'](function () {
                    $window.location.href = config.loginPath || '/';
                });
            } else {
                $rootScope.$emit('Analytics:logout', {
                    goOffline: false,
                    triggeredBy: preventAutoLogin ? 'user' : 'application'
                });
                $state.go('login', undefined, { reload: true });
            }
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/util/httpUtil.js.map
