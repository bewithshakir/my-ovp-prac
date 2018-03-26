(function () {
    'use strict';

    angular.module('ovpApp.login', [
        'ovpApp.login.loginService',
        'ovpApp.components.alert',
        'ovpApp.legacy.httpUtil',
        'ovpApp.config',
        'ovpApp.messages',
        'ajoslin.promise-tracker',
        'ovpApp.oauth',
        'ovpApp.services.profileService',
        'ovpApp.services.streamPlusService',
        'ovpApp.services.runOnceService',
        'ovpApp.services.ovpStorage',
        'ovpApp.services.locationService',
        'ovpApp.directives.focus',
        'ovpApp.services.errorCodes',
        'ui.router',
        'ngAria',
        'ngMessages',
        'ngCookies'
    ])
    .constant('subViews', {
        PARENTAL: 'parental',
        HELP: 'help',
        FORM: 'form',
        ERROR: 'error'
    })
    //If the login error returned matches a key in the list this will display the "fatal" block inidicating
    //the user must do something special before continuing
    .constant('LOGIN_ERROR_TEMPLATES', {
        '1024': '/js/ovpApp/login/errors/login-error-blacklist.html'
    })
    .controller('LoginController', LoginController)
    .directive('ovpLoginForm', loginForm);

    /* @ngInject */

    function LoginController($scope, $window, $q, subViews, loginService, $log, alert,
              promiseTracker, runOnce, config, messages, $state, profileService,
              httpUtil, ovpStorage, storageKeys, $rootScope, $timeout, LOGIN_ERROR_TEMPLATES,
              $element, $location, connectivityService, streamPlusService, errorCodesService,
              locationService) {


        $scope.artOrigin = config.piHost;
        $scope.collageImageUrl = null;
        $scope.config = config;
        $scope.parentalControlsSpinner = false; //This cannot _fail_ so no need to use a promiseTracker
        $scope.messages = messages;

        $scope.user = {
            username: '',
            password: '',
            rememberme: true,
            loginsubmit: 'Sign In'
            //$error: false
        };

        $scope.enterSite = function () {
            // OVP-382: Get capabilities to initialize SPP
            profileService.canUseTwctv().then(() => {
                $scope.showParentalControlWarning().then(() => {
                    let storedLink = ovpStorage.getItem(storageKeys.appLink);
                    if (storedLink) {
                        // Clear storedLink and navigate to it
                        ovpStorage.removeItem(storageKeys.appLink);
                        if (storedLink.url) {
                            $location.url(storedLink.url);
                            $state.router.urlRouter.sync();
                        } else {
                            $state.go(storedLink.state, storedLink.params);
                        }
                    } else {
                        profileService.canWatchLive().then((isEnabled) => {
                            $scope.success = true;
                            if (isEnabled) {
                                $state.go('ovp.livetv');
                            } else {
                                profileService.getFirstAvailableState().then((state) => {
                                    $state.go(state);
                                });
                            }
                        }, (error) => {
                            $log.error('Unable to check capabilities', error);
                        });
                    }
                });
            }, () => {
                streamPlusService.isStreamPlusEligible(true).then(() => {
                    $state.go('buyFlow.welcome');
                }).catch(() => {
                    $state.go('novideoservice');
                });
            });
        };

        $scope.updateFormWithRememberme = function () {
            var rememberMe = ovpStorage.getItem(storageKeys.loginRememberMe);
            $scope.user.username = rememberMe ? rememberMe.username : '';
            $scope.user.rememberme = true;
        };

        $scope.parentalControlWarningDeferred = $q.defer();
        $scope.isValidationError = false;
        $scope.loadingTracker = promiseTracker();
        $scope.parentalControlsTracker = promiseTracker();

        $scope.updateFormWithRememberme();

        $scope.parentalControlsWarningAccepted = function () {
            loginService.acceptParentalControlsWarning();
            $scope.parentalControlsSpinner = true;
            $scope.parentalControlWarningDeferred.resolve();
        };

        $scope.showParentalControlWarning = function () {
            if (profileService.isSpecUOrBulkMDU()) {
                $scope.parentalControlWarningDeferred.resolve();
            } else {
                loginService.hasAcceptedParentalControlsWarning().then((hasAccepted) => {
                    if (hasAccepted) {
                        $scope.parentalControlWarningDeferred.resolve();
                    } else {
                        $scope.login.subView = subViews.PARENTAL;
                    }
                });
            }

            return $scope.parentalControlWarningDeferred.promise;
        };

        $scope.onRememberMeChange = function () {
            if (!$scope.user.rememberme) {
                loginService.rememberMe('');
            }
        };

        $scope.authenticate = function () {
            if (!connectivityService.isOnline()) {
                $scope.errorCode = '-1';
                $scope.login.subView = subViews.FORM;
            } else {
                var authenticationPromise = $q.when(loginService.authenticate($scope.user.username,
                        $scope.user.password, $scope.user.rememberme)),
                    loginTrackerPromise = $q.defer(),
                    locationPromise,
                    postAuthConfigPromise;

                // reset the form validity so the screen reader will read any new errrors
                $scope.isValidationError = false;
                $scope.errorCode = null;
                $scope.loadingTracker.addPromise(loginTrackerPromise.promise);
                $scope.fatalErrorTemplate = null;

                authenticationPromise.then(
                    //success
                    function () {
                        $scope.isValidationError = false;
                        postAuthConfigPromise = profileService.postAuth();
                        locationPromise = locationService.getLocation();
                        $q.all([locationPromise, postAuthConfigPromise]).then(function () {
                            $scope.enterSite();
                        }).catch((err = {}) => {
                            // Analytics
                            $rootScope.$emit('Analytics:sadTv', {
                                errorCode: err.errorCode,
                                errorMessage: errorCodesService.getMessageForCode(err.errorCode)
                            });

                            $state.go('ovp.sadtverror', {errorCode: err.errorCode});
                        });
                    },
                    function (errorResponse = {}) {
                        loginTrackerPromise.resolve();
                        if (errorResponse.isInvalidCreds) {
                            $scope.user.password = '';
                            $element.find('#password').focus();
                        }
                        $scope.login.subView = subViews.FORM;
                        $scope.isValidationError = true;
                        $scope.errorCode = errorResponse.errorCode;
                        if (LOGIN_ERROR_TEMPLATES[$scope.errorCode]) {
                            $scope.login.subView = 'fatal';
                            $scope.fatalErrorTemplate = LOGIN_ERROR_TEMPLATES[$scope.errorCode];
                        }
                    }
                );
            }
        };

        $scope.fatalErrorClick = function () {
            $window.open(config.forgotHost + config.registration.forgot, '_forgotpass');
            $scope.returnToLoginForm();
        };

        $scope.login = {
            subView: subViews.FORM,
            subViews: subViews
        };

        $scope.forgotUsernameOrPassword = function () {
            // Analytics:
            $rootScope.$emit('Analytics:select', {
                elementStandardizedName: 'forgotUsernamePassword',
                pageSectionName: 'loginArea'
            });
        };

        $scope.createUsername = function () {

            // Analytics:
            $rootScope.$emit('Analytics:select', {
                elementStandardizedName: 'createUsername',
                pageSectionName: 'loginArea'
            });
        };

        $scope.viewTOS = function () {
            // TODO: Analytics Event
            // $rootScope.$emit('EG:TOSViewed', {
            //     showable: 'shown',
            //     agreement: 'termsOfService'
            // });
        };

        $scope.viewPrivacy = function () {
            // TODO: Analytics Event
            // $rootScope.$emit('EG:TOSViewed', {
            //     showable: 'shown',
            //     agreement: 'privacyPolicy'
            // });
        };

        $scope.returnToLoginForm = function () {
            $scope.errorCode = null;
            $scope.login.subView = subViews.FORM;
        };

        loginService.error(function () {
            $scope.login.subView = subViews.FORM;
            $scope.loadingTracker.cancel();
        });

        $rootScope.$broadcast('pageChangeComplete', $state.current);
    }

    /* @ngInject */
    function loginForm(messages, LOGIN_ERROR_TEMPLATES, ovpStorage, storageKeys,
        $window, OauthService, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: '/js/ovpApp/login/loginForm.html',
            link: ($scope) => {
                let oauthError = OauthService.getOAuthError();
                $scope.isSpecUError = oauthError.isSpecU || false;
                $scope.isStreamPlusError = oauthError.isStreamPlus || false;
                $scope.messages = messages;
                $scope.privacyPolicyLink = 'https://www.spectrum.com/policies/spectrum-customer-privacy-policy.html';
                $scope.termsAndConditionsLink = 'https://www.spectrum.com/policies/residential-terms.html';

                $scope.retryAutoOauth = () => {
                    ovpStorage.removeItem(storageKeys.autoAuthSignOutTime);

                    // Analytics:
                    $rootScope.$emit('Analytics:prepareForRefresh');
                    $rootScope.$emit('Analytics:select', {
                        elementStandardizedName: 'retryAutoAccess',
                        pageSectionName: 'loginArea'
                    });

                    $window.location.reload();
                };

                $scope.onSubmit = () => {
                    // error check
                    if ($scope.loginForm.username.$error.required || $scope.loginForm.password.$error.required) {
                        if ($scope.loginForm.username.$error.required) {
                            $scope.loginForm.username.$setDirty();
                        }
                        if ($scope.loginForm.password.$error.required) {
                            $scope.loginForm.password.$setDirty();
                        }
                        return true;
                    }

                    $scope.authenticate();
                };

                $scope.$watch('errorCode', (nv, ov) => {
                    if (nv) {
                        $scope.loginForm.$setSubmitted(true);
                        if ($scope.errorCode && LOGIN_ERROR_TEMPLATES[$scope.errorCode]) {
                            $scope.loginForm.loginForm.$setValidity(LOGIN_ERROR_TEMPLATES[$scope.errorCode], false);
                        } else {
                            if ($scope.errorCode && $scope.errorCode === '-1') {
                                $scope.loginForm.loginForm.$setValidity('error-connectivity', false);
                            } else if ($scope.errorCode && $scope.errorCode === 'WLI-1025') {
                                $scope.loginForm.loginForm.$setValidity('error-locked', false);
                            } else {
                                $scope.loginForm.loginForm.$setValidity('error-generic', false);
                                $scope.loginForm.password.$setPristine();
                            }

                        }
                    } else if (ov && !nv) {
                        //Clear any errors that might have been set
                        Object.keys(LOGIN_ERROR_TEMPLATES).forEach((key) => {
                            $scope.loginForm.loginForm.$setValidity(LOGIN_ERROR_TEMPLATES[key], null);
                        });
                        $scope.loginForm.loginForm.$setValidity('error-generic', null);
                        $scope.loginForm.password.$setPristine();
                    }
                });
            }
        };
    }
}());
