/* globals Deferred, window */
(function () {
    'use strict';
    angular.module('ovpApp.interceptors.jquery', ['ovpApp.config', 'ovpApp.oauth'])
        .run(jqueryAjaxInterceptor);

    /**
     * Moved from the oauth-manager in an attempt to reduce legacy module code. This sets up the jquery.ajax method
     * to add the oauth tokens to jquery ajax reqests.
     */
    /* @ngInject */
    function jqueryAjaxInterceptor($injector, selectn, OauthService, config) {
        var $ = window.jQuery,
            originalAjax = $.ajax ;

        $.ajaxPrefilter(function (options) {
            var beforeSend = options.beforeSend;
            Object.assign(options, {
                // sign request if it's through PI
                beforeSend: function (xhr, settings) {
                    if (isOauth(options.url)) {
                        let header = OauthService.getOAuthHeader(options);
                        xhr.setRequestHeader('Authorization', header.Authorization);

                        // set data for headers (required for IE CORS)
                        settings = settings || {};
                        settings.headers = [{
                            key: 'Authorization',
                            value: header.Authorization
                        }];
                    }

                    if (beforeSend && typeof beforeSend === 'function') {
                        beforeSend(xhr, settings);
                    }
                },

                // send headers for CORS
                xhrFields: {
                    withCredentials: true
                }
            });
        });

        $.ajax = function (options) {
            var promise; // promise when done

            // only check oauth token if going through PI
            if (options && !options.bypassRefresh && options.url && options.url.indexOf(config.piHost) === 0) {
                let def = new Deferred();
                //Check if the user is authenticated before continuing. This is effectively the same as the
                //Angular oauthInterceptor. Just for legacy requests.
                OauthService.isAuthenticated().then(function (authenticated) {
                    if (authenticated) {
                        afterRefresh(options).done(def.resolve).fail(def.reject);
                    } else {
                        if (options.error) {
                            options.error('not_logged_in');
                        }
                        def.reject('not_logged_in');
                    }
                });
                return def.promise();
            } else {
                promise = originalAjax(options);
            }

            return promise;
        };

        function isOauth(url) {
            return config.oAuth.routes.some(function (path) {
                var c = selectn(path, config);
                return c && url && url.indexOf(c) === 0;
            });
        }

        function afterRefresh(ajaxOptions) {
            var deferred = new Deferred();
            if (!ajaxOptions) {
                deferred.resolve();
            } else {
                ajaxOptions.bypassRefresh = true;
                ajaxOptions.statusCode = ajaxOptions.statusCode || {};

                originalAjax(ajaxOptions)
                    .done(deferred.resolve.bind(deferred))
                    .fail(deferred.reject.bind(deferred));
            }
            return deferred.promise();
        }
    }
})();
