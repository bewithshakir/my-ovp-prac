(function () {
    'use strict';

    angular.module('ovpApp.analytics.events.login', [
        'ovpApp.analytics.analyticsService'
    ])
    .factory('login', loginEvents)
    .run(function loadHandler(login) {
            return login;
        });

    /* @ngInject */
    function loginEvents($rootScope, analyticsService, $log) {

        // Set to true between loginStart and loginStop events.
        let loggingIn = false;

        // Access to the analytics state.
        let state = analyticsService.state;

        /**
         * Function for attaching all event listeners.
         */
        function attachEventListeners() {
            try {
                $rootScope.$on('Analytics:loginStop', (event, data) => {
                    loginStop(data);
                });

                $rootScope.$on('Analytics:loginStart', (event, data) => {
                    loginStart(data);
                });

                $rootScope.$on('Analytics:logout', (event, data) => {
                    logout(data);
                });

                $rootScope.$on('Analytics:inVisitOauthRefresh', (event, data) => {
                    inVisitOauthRefresh(data);
                });
                $rootScope.$on('Analytics:receivedOauthToken', (event, data) => {
                    receivedOauthToken(data);
                });
                $rootScope.$on('Analytics:forcedLogin', (event, data) => {
                    forcedLogin(data);
                });
                $rootScope.$on('Analytics:captureAuthAttemptId', (event, data) => {
                    captureAuthAttemptId(data);
                });
            }
            catch (ex) {
                $log.error('Analytics login:', ex);
            }
        }

        /**
         * Indicate that an attempt to log in has begun.
         *
         * @param data Event data associated with login.
         */
        function loginStart(data) {
            try {

                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: loginStart, loggingIn=' + loggingIn, data);
                }

                // If we're already logging in, it's better to discard this attempt
                // than to allow the extra loginStart to disable the client analytics library.
                if (loggingIn) {
                    return;
                }

                // Capture the current auth type
                state.setCurrentAuthType(data.authType);

                // STVWEB-569: Track our login state, in case of hibernation
                if (state.getIsLoggedIn()) {

                    // STVWEB-1637: If this is a verifierAuth, we might be waking from
                    // a short hibernation, so we can treat this as an inVisitOauthRefresh.
                    if ('verifierAuth' === data.authType) {
                        if (analyticsService.isDebug()) {
                            $log.debug('Analytics: ignoring verifierAuth start');
                        }
                        return;
                    }

                    $log.warn('Analytics: logging out due to login attempt');

                    // Record that we have apparently logged out.
                    state.setIsLoggedIn(false);
                    logout({
                        goOffline: false,
                        triggeredBy: 'user'
                    });
                }

                // Record that we're entering a "logging in" state.
                loggingIn = true;
                analyticsService.event('loginStart', data);
            } catch (ex) {
                $log.error('Analytics Login Error:', ex);
            }
        }

        /**
         * Expand the oath token in an object into fields expected by the
         * analytics SDK.
         * @param data Data object potentially containing the 'oauth' field.
         * @return Given data object, potentially with additional fields from oauth expansion.
         */
        function expandOauthToken(data) {
            // If we have an 'oauth' item, expand it into parts:
            if (data.oauth && data.oauth.token && !angular.isDefined(data.oAuthToken)) {
                data.oAuthToken = data.oauth.token;
            }

            if (data.oauth && data.oauth.expiration && !angular.isDefined(data.oAuthExpirationTimestamp)) {
                data.oAuthExpirationTimestamp = Number(data.oauth.expiration);
            }

            return data;
        }

        /**
         * Capture the current authAttemptId.
         *
         * @param data Event data containing authAttemptId.
         */
        function captureAuthAttemptId(data) {
            try {

                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: captureAuthAttemptId: ' + data.authAttemptId, data);
                }

                if (data.authAttemptId) {
                    state.setAuthAttemptId(data.authAttemptId);
                }

            } catch (ex) {
                $log.error('Analytics Login Error:', ex);
            }
        }

        /**
         * Indicate that an attempt to log in has concluded.
         *
         * @param data Event data
         */
        function loginStop(data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: loginStop, loggingIn=' + loggingIn, data);
                }

                // Expand the oauth token, if necessary.
                data = expandOauthToken(data);

                if (!loggingIn) {

                    // STVWEB-1637: If we're finishing a verifierAuth while already
                    // logged in, this is actually an inVisitOauthRefresh.
                    if (data.success && state.getIsLoggedIn() && 'verifierAuth' === state.getCurrentAuthType()) {
                        inVisitOauthRefresh(data);
                        return;
                    }

                    return;
                }

                // If this is for any authType other than resumeAuth, ensure we
                // know we are online. Examples of why this is needed would be
                // when the user was logged out.
                if ('resumeAuth' !== state.getCurrentAuthType()) {
                    analyticsService.getSDK().set('isOnline', true);
                }

                // We're no longer in a "logging in" state.
                loggingIn = false;

                // Include this authAttemptId, if it exists. Clear it afterwards.
                if (state.getAuthAttemptId()) {
                    data.authAttemptId = state.getAuthAttemptId();
                    state.setAuthAttemptId(null);
                }

                // If login succeeded, record it and return.
                if (data.oAuthToken && data.oAuthExpirationTimestamp && data.success) {

                    analyticsService.event('loginStop', data);

                    // Update our state to indicate we have logged in.
                    state.setIsLoggedIn(true);
                    return;
                }

                // If we have a response, emit error event.
                else if (data.response && 'object' === typeof data.response) {

                    let eventData = {
                        success: false,
                        errorType: 'authentication'
                    };

                    // Include authAttemptId, if it exists.
                    if (data.authAttemptId) {
                        eventData.authAttemptId = data.authAttemptId;
                    }

                    if (data.response.errorCode && data.response.errorName) {
                        // Capture error data from an Oauth error object.
                        eventData.errorCode = data.response.errorCode;
                        eventData.errorMessage = data.response.errorMessage || data.response.errorName;
                    } else if (data.response.headers &&
                        data.response.headers('x-pi-auth-failure') &&
                        data.response.data) {

                        // Capture error data from an http response.
                        eventData.errorCode = data.response.headers('x-pi-auth-failure');
                        eventData.errorMessage = data.response.errorMessage || getAsStringOrJSON(data.response.data);
                    }

                    // Login failed. Record the failure.
                    analyticsService.event('loginStop', eventData);
                } else {

                    $log.error('Analytics: loginStop, event not handled.', data);
                }
            } catch (ex) {
                $log.error('Analytics Login Error:', ex);
            }
        }

        /**
         * Indicate that the user has been logged out.
         */
        function logout(data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: logout isLoggedIn=' + state.getIsLoggedIn(), data);
                }

                // Ignore this event if not logged in.
                if (!state.getIsLoggedIn()) {
                    return;
                }

                var eventData = {
                    triggeredBy: data.triggeredBy || 'user'
                };

                // Prepare to go offline.
                if (data && data.goOffline) {
                    $rootScope.$emit('Analytics:prepareForRefresh');
                }

                // If we're playing any content, it's time to stop.
                $rootScope.$emit('Analytics:haltPlaybackFromLogout');

                // Record that we are now logged out.
                state.setIsLoggedIn(false);
                analyticsService.event('logout', eventData);
            } catch (ex) {
                $log.error('Analytics Login Error:', ex);
            }
        }

        /**
         * Invoked during an active session when the oauth token has timed
         * out, usually after 6 hours, and been replaced with a new one.
         *
         * @param data Event data associated with login, including the new
         * oauth token and expiration timestamp.
         */
        function inVisitOauthRefresh(data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: inVisitOauthRefresh, loggingIn=' + loggingIn, data);
                }

                if (loggingIn) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Dropping inVisitOauthRefresh inside login process', data);
                    }
                    return;
                }

                // Expand the oauth token, if necessary.
                data = expandOauthToken(data);

                data.operationType = 'refreshAuth';
                if (data.errorCode) {
                    data.errorType = 'authentication';
                    data.success = false;
                } else {
                    data.success = true;
                }

                analyticsService.event('inVisitOauthRefresh', data);
            } catch (ex) {
                $log.error('Analytics Login Error:', ex);
            }
        }

        /**
         * Handle a forcedLogin event, where a user has successfully authenticated
         * via autoAccess, but does not have access to iptv capability.
         *
         * @param data Event data associated with the event.
         */
        function forcedLogin(data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: forcedLogin', data);
                }

                // Record that the user is no longer logged in.
                state.setIsLoggedIn(false);

                analyticsService.event('forcedLogin', data);

            } catch (ex) {
                $log.error('Analytics forcedLogin Error:', ex);
            }
        }

        /**
         * Invoked during an active session when the oauth token has timed
         * out, usually after 6 hours, and been replaced with a new one.
         *
         * @param data Event data associated with login, including the new
         * oauth token and expiration timestamp.
         */
        function receivedOauthToken(data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: receivedOauthToken, loggingIn=' + loggingIn, data);
                }

                if (loggingIn) {
                    loginStop(data);
                } else {
                    inVisitOauthRefresh(data);
                }
            } catch (ex) {
                $log.error('Analytics Login Error:', ex);
            }
        }

        /**
         * Retrieve the given object as a string, or as JSON.
         * @param obj The object to convert to a string.
         * @return JSON string if object, else string or empty string.
         */
        function getAsStringOrJSON(obj) {
            if (obj) {
                if ('string' === typeof obj) {
                    return obj;
                } else if ('object' === typeof obj) {
                    return JSON.stringify(obj);
                }
            }
            return '';
        }

        // Attach the event listeners.
        attachEventListeners();

        return {
            loginStart,
            expandOauthToken,
            loginStop,
            logout,
            inVisitOauthRefresh,
            getAsStringOrJSON,
            captureAuthAttemptId
        };
    }
}());
