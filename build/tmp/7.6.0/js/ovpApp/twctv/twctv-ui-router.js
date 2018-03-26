'use strict';

(function () {
    'use strict';
    run.$inject = ["$window", "$document", "$urlRouter", "$state", "rx", "$rootScope", "$q", "$log", "$stateParams", "$transitions", "profileService", "httpUtil", "alert", "$location", "loginService", "messages", "ovpStorage", "storageKeys", "OauthService", "$timeout", "stringUtil", "streamPlusService", "config", "locationService", "errorCodesService"];
    config.$inject = ["$provide", "$stateProvider", "configProvider", "$logProvider", "environmentConstants", "CAPABILITIES", "$urlRouterProvider", "$locationProvider", "version", "$urlMatcherFactoryProvider"];
    angular.module('ovpApp.twctv.router', ['ovpApp.services.locationService', 'ui.router', 'ovpApp.eas', 'ovpApp.services.profileService', 'ovpApp.services.streamPlusService', 'ovpApp.legacy.httpUtil', 'ovpApp.components.alert', 'ovpApp.messages', 'ovpApp.services.bookmark', 'ovpApp.services.homePage', 'ovpApp.services.nns', 'ovpApp.services.ovpStorage', 'ovpApp.services.errorCodes', 'ovpApp.store', 'ovpApp.playerControls', 'ovpApp.components.environmentDropdown', 'ovpApp.components.mobileNav', 'ovpApp.components.header', 'ovpApp.guide', 'ovpApp.service.lineup', 'ovpApp.connectivityAlert', 'ovpApp.components.specu.campusWifiError', 'ovpApp.legacy.stringUtil', 'ovpApp.services.errorCodes', 'ovpApp.specuWelcome', 'ovpApp.config', 'ovpApp.components.mobile.login', 'ovpApp.oauth', 'ovpApp.components.error.sadTv']).run(run).config(config);

    /* @ngInject */
    function run($window, $document, $urlRouter, $state, rx, $rootScope, $q, $log, $stateParams, $transitions, profileService, httpUtil, alert, $location, loginService, messages, ovpStorage, storageKeys, OauthService, $timeout, stringUtil, streamPlusService, config, locationService, errorCodesService) {

        var deferred = $q.defer();
        var ignoreMobileCheck = ovpStorage.getItem(storageKeys.ignoreMobileCheck) || false;

        $rootScope.hideSiteFooterRegex = /(play|livetv|product|search)/;

        deferred.promise.then(function () {
            $urlRouter.sync();
        });

        $rootScope.$on('message:loading', function (event, promise, message) {
            var page = arguments.length <= 3 || arguments[3] === undefined ? 'content' : arguments[3];

            $rootScope.loadingMessage = 'Loading ' + page;
            $q.when(promise, function () {
                $timeout(function () {
                    $rootScope.loadingMessage = 'loading ' + page + ' complete';
                });
            });
        });

        $state.defaultErrorHandler(function (err) {
            var SUPERSEDED = 2; // These numbers come from ui-router RejectType
            var ABORTED = 3;
            if (err && (err.silent === true || err.type === SUPERSEDED || err.type === ABORTED)) {
                return;
            }

            if (err && err.error === 'serviceErrorReload') {
                alert.open({
                    message: errorCodesService.getMessageForCode('WFE-1113'),
                    buttonText: 'RELOAD'
                }).result['finally'](function () {
                    //Force a reload and reset the path to the root
                    $window.location = '/';
                });
            } else {
                alert.open(errorCodesService.getAlertForCode('TMP-9038'));
            }
            $log.error(err);
            $rootScope.$broadcast('message:loading:cancel');
        });

        $transitions.onSuccess({}, function (transition) {
            var toState = transition.to();
            var fromState = transition.from();
            var fromParams = transition.params('from');

            if (fromState.name !== 'ovp.blankPage') {
                $state.previous = fromState;
                $state.previous.fromParams = fromParams;
            }

            if (toState.data && toState.data.subheader) {
                $rootScope.subheader = toState.data.subheader;
            } // Otherwise, keep whatever it was previously

            $rootScope.bodyClass = toState.data && toState.data.bodyClass || '';
            updatePageTitle(transition);

            // If page was merely inactivated and reactivated, indicate the page
            // change has completed.
            if (transition.wasReactivated) {
                $rootScope.$broadcast('pageChangeComplete', transition.to());
            } else {
                // Analytics for a non-reactivated pageChange.
                var analytics = transition.to().analytics;
                if (analytics) {
                    if (analytics.isLazyLoad) {
                        $rootScope.$emit('Analytics:partial-render');
                    } else {
                        $rootScope.$emit('Analytics:pageChangeComplete');
                    }
                }
            }
        });

        var pageTitleSubscription = undefined;

        function applyTitle(title) {
            $document[0].title = stringUtil.formatPageTitle(title) + '| Spectrum TV';
        }

        function updatePageTitle(transition) {
            if (pageTitleSubscription) {
                pageTitleSubscription.dispose();
                pageTitleSubscription = undefined;
            }

            var data = transition.to().data;

            if (data && data.pageTitle) {
                var pageTitle = undefined;
                if (angular.isFunction(data.pageTitle)) {
                    pageTitle = data.pageTitle(transition);
                } else {
                    pageTitle = data.pageTitle;
                }

                if (pageTitle instanceof rx.Observable) {
                    pageTitleSubscription = pageTitle.subscribe(applyTitle);
                } else {
                    $q.when(pageTitle, applyTitle);
                }
            } else {
                $document[0].title = 'Spectrum TV';
            }
        }

        // TODO: Reload `ovp.ondemand.majorCategory` for network subcategory and
        // pass page title as state parameter instead of ovp:setPageTitle event
        // to update the page title for network subcategory
        $rootScope.$on('ovp:setPageTitle', function (event, data) {
            $document[0].title = data + '| Spectrum TV';
        });

        $rootScope.$on('goToDesktopVersionClicked', function () {
            ignoreMobileCheck = true;
            ovpStorage.setItem(storageKeys.ignoreMobileCheck, true);
        });

        $transitions.onBefore({}, function (transition) {
            // In some cases, when we route to a recently-visited page, the app
            // can simply reactivate the page instead of reinitializing it.
            // This is fast, but means we now need to use this mechanism to
            // indicate the page is already loaded.
            var stickyStates = transition.router.getPlugin('stickystates');
            var inactives = stickyStates.inactives();
            var inactiveState = inactives.find(function (state) {
                return state.name === transition.to().name;
            });
            if (inactiveState && angular.equals(inactiveState.fromParams, transition.params())) {

                // Indicate that destination is already initialized and will
                // just be reactivated.
                transition.wasReactivated = true;
            }

            // Analytics
            $rootScope.$emit('Analytics:route-start', {
                transition: transition
            });
        });

        // Check that the user is authenticated and has the appropriate capabilities
        // before allowing them into a private state
        $transitions.onBefore({ to: function to(state) {
                return !state['public'];
            } }, function (transition) {
            return OauthService.isAuthenticated().then(function (authenticated) {
                var toState = transition.to();
                var isMobile = $window.navigator.userAgent.match(/(ipad)|(iphone)|(ipod)|(android)/i);

                if (!ignoreMobileCheck && isMobile) {
                    return transition.router.stateService.target('ovp.mobilelogin');
                }

                if (authenticated) {
                    $rootScope.$broadcast('message:loading:cancel');
                    if (toState.ignoreRedirects) {
                        return true;
                    }
                    return $q.when(locationService.getLocation(), function (location) {
                        if (profileService.isSpecU() && !location.behindOwnModem) {
                            return transition.router.stateService.target('ovp.specuerror');
                        }
                        return $q.when(checkForRedirects(transition)).then(function (result) {

                            if (result === true) {
                                return authorizeState(transition);
                            } else {
                                return result;
                            }
                        });
                    })['catch'](function (err) {

                        // Analytics
                        var errorCode = err.errorCode || 'WLC-1001';
                        $rootScope.$emit('Analytics:sadTv', {
                            errorCode: errorCode,
                            errorMessage: errorCodesService.getMessageForCode(errorCode)
                        });

                        return transition.router.stateService.target('ovp.sadtverror', {
                            errorCode: errorCode
                        });
                    });
                } else {
                    var error = OauthService.getOAuthError();
                    if (error && (error.errorCode === 'WLC-1001' || error.errorCode === 'WUC-1002')) {
                        // Analytics
                        $rootScope.$emit('Analytics:sadTv', {
                            errorCode: error.errorCode,
                            errorMessage: errorCodesService.getMessageForCode(error.errorCode)
                        });
                        return transition.router.stateService.target('ovp.sadtverror', { errorCode: error.errorCode });
                    }

                    if (toState.name !== 'ovp.blankPage') {
                        var data = undefined;
                        if (toState.name.indexOf('**') > -1) {
                            // Saving a lazy-loaded state isn't much use; save url instead
                            data = {
                                url: $location.url()
                            };
                        } else {
                            data = {
                                state: toState.name,
                                params: transition.params('to')
                            };
                        }
                        ovpStorage.setItem(storageKeys.appLink, data);
                    }
                    httpUtil.logout({
                        allowAutoLogin: true
                    });

                    return false;
                }
            });
        });

        //Privacy policy and terms of use don't display correctly if
        //   ovp is active in the background.
        $transitions.onSuccess({
            to: function to(state) {
                return state.name === 'terms';
            }
        }, function (transition) {
            var stickyStates = transition.router.getPlugin('stickystates');
            var inactives = stickyStates.inactives();
            if (inactives.find(function (state) {
                return state.name === 'ovp';
            })) {
                stickyStates.exitSticky('ovp');
            }
        });

        /**
         * Check if this transition needs to redirect elsewhere
         * @param {Transition} the in progress transition
         * @returns {true|false|TargetState|promise} instructions to the router
         *    for how to procede
         */
        function checkForRedirects(transition) {
            if (profileService.isSpecU() && !loginService.hasAcceptedSpecUTerms() && transition.to().name !== 'ovp.specuwelcome') {
                return transition.router.stateService.target('ovp.specuwelcome');
            } else if (transition.to().name.match(/^ovp.dvr.*/)) {
                return checkRDVRRedirect(transition);
            } else {
                return true;
            }
        }

        function checkRDVRRedirect(transition) {
            return profileService.isAccessibilityEnabled().then(function (isEnabled) {
                if (isEnabled) {
                    return transition.router.stateService.target('ovp.livetv');
                } else {
                    return true;
                }
            });
        }

        // Private method
        function checkForStreamPlusEligibility(transition) {
            var callback = function callback() {
                $rootScope.$emit('Analytics:applicationTriggeredRouting');
                return transition.router.stateService.target('novideoservice');
            };
            return streamPlusService.isStreamPlusEligible(true).then(function () {
                return transition.router.stateService.target('buyFlow.welcome');
            })['catch'](function (err) {
                if (err && err.data && err.data.code === 1501) {
                    return alert.open(errorCodesService.getAlertForCode('WEN-1022')).result.then(callback, callback);
                }
                return callback();
            });
        }

        /**
         * Check that the user has the required capabilities for entering a state.
         * If they don't, fall back to alternative states.
         * @param {Transition} the in progress transition
         * @returns {true|false|TargetState|promise} instructions to the router
         *    for how to procede
         */
        function authorizeState(transition) {
            var toState = transition.to();
            if (toState.data && toState.data.capability) {
                return profileService.hasCapability(toState.data.capability).then(function (isCapable) {
                    return isCapable || profileService.getFirstAvailableState().then(function (stateName) {
                        if (!stateName) {
                            return checkForStreamPlusEligibility(transition);
                        }
                        return transition.router.stateService.target(stateName);
                    });
                }, function () {
                    return transition.router.stateService.target('ovp.disableAppDueServiceError');
                });
            } else {
                return profileService.canUseTwctv().then(function () {
                    return true;
                }, function () {
                    return checkForStreamPlusEligibility(transition);
                });
            }
        }

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }

    /* @ngInject */
    function config($provide, $stateProvider, configProvider, $logProvider, environmentConstants, CAPABILITIES, $urlRouterProvider, $locationProvider, version, $urlMatcherFactoryProvider) {
        var redirects = {
            '/DVR': '/rdvr',
            '/dvr': '/rdvr'
        };

        // Disable debug logs for production
        if (configProvider.get().name === environmentConstants.ENVIRONMENT_PRODUCTION) {
            $logProvider.debugEnabled(false);
        }

        $locationProvider.html5Mode({ enabled: true, requireBase: false });

        //Watch for ondemand i.e. #/ondemand/featured and rewrite to an actual
        //url. This will redirect to the desired url, this will; not handle other
        //locations though
        $urlRouterProvider.rule(function ($injector, $location) {
            var hash = $location.hash(),
                result;
            if (hash && hash.indexOf('/ondemand') === 0) {
                result = hash;
            } else if (hash && hash.indexOf('ondemand/networks') === 0) {
                result = '/' + hash;
            } else if ($location.path() === '/ondemand' && hash !== '') {
                var movieMatch = hash.match(/^\/*details\/([0-9]+)/);
                if (movieMatch) {
                    result = '/product/movie/' + movieMatch[1];
                } else {
                    var seriesMatch = hash.match(/\/*details\/series\/([0-9]+)/);
                    if (seriesMatch) {
                        result = '/product/series/' + seriesMatch[1];
                    }
                }
            } else if (hash && hash.startsWith('/rdvr')) {
                result = hash;
            }
            return result;
        });

        $urlRouterProvider.rule(function ($injector, $location) {
            if ($location.path().startsWith('/auth')) {
                var hash = $location.hash();
                if (hash && (hash.startsWith('/') || hash.startsWith('%25'))) {
                    return hash;
                } else {
                    return '/' + hash;
                }
            } else if (redirects[$location.path()]) {
                return redirects[$location.path()];
            }
        });

        $urlRouterProvider.otherwise('/livetv');

        $stateProvider.state('root', {
            url: '/',
            'public': true,
            redirectTo: function redirectTo(transition) {
                var injector = transition.injector(),
                    OauthDataManager = injector.get('OauthDataManager'),
                    urlParameters = injector.get('$location').search(),
                    ovpStorage = injector.get('ovpStorage'),
                    $rootScope = injector.get('$rootScope'),
                    storageKeys = injector.get('storageKeys');

                if (urlParameters && (urlParameters.sessionOverride === 'true' || urlParameters.mqtn)) {
                    ovpStorage.removeItem(storageKeys.autoAuthSignOutTime);
                    // If we have stored token then we need to reload page after resetting oauth
                    // to re-initialize all services
                    if (OauthDataManager.get().token) {
                        OauthDataManager.reset();
                        injector.get('$window').location.reload();
                    }
                }

                $rootScope.$emit('Analytics:applicationTriggeredRouting');

                // default state
                return 'ovp.livetv';
            }
        });

        // OVP-505: Need to decode url prameter uri to support old encoding
        $urlMatcherFactoryProvider.type('uri', {
            decode: function decode(item) {
                return decodeURIComponent(item);
            }
        });

        $provide.decorator('$uiViewScroll', ['$state', '$window', function ($state, $window) {
            return function (uiViewElement) {
                var top = uiViewElement[0].getBoundingClientRect().top,
                    subHeader = $state.current.data && $state.current.data.subheader,
                    scrollY = $window.scrollY,
                    pxOffset = 67;
                if (subHeader == 'normal') {
                    pxOffset = 117;
                } else if (subHeader == 'large') {
                    pxOffset = 159;
                }

                $window.scrollTo(0, top + scrollY - pxOffset);
            };
        }]);

        $provide.decorator('$log', ["$delegate", "$sniffer", "$injector", function ($delegate, $sniffer, $injector) {
            var _error = $delegate.error,
                //Keep original reference to maintain the existing functionality
            SplunkService = null;

            $delegate.error = function () {
                if (!SplunkService) {
                    SplunkService = $injector.get('SplunkService');
                }
                SplunkService.sendError.apply(SplunkService, arguments);
                _error.apply($delegate, arguments);
            };

            return $delegate;
        }]);

        $stateProvider.state('ovp', {
            abstract: true,
            resolve: {
                authenticatedDependencies: ['BookmarkService', 'lineupService', 'profileService', 'NNSService',
                //dependent on nns service for menuitems
                'versionService', function (BookmarkService, lineupService) {
                    BookmarkService.activate();
                    lineupService.getLineup();
                }]
            },
            sticky: true,
            templateUrl: '/js/ovpApp/twctv/twctv.html'
        });

        $stateProvider.state('login', {
            data: {
                bodyClass: 'login-page',
                pageTitle: 'Sign In',
                hideMenu: true
            },
            'public': true,
            templateUrl: '/js/ovpApp/login/login.html'
        });

        $stateProvider.state('ovp.mobilelogin', {
            data: {
                bodyClass: 'mobile-login-page',
                hideMenu: true
            },
            'public': true,
            views: {
                appView: {
                    component: 'mobileLogin'
                }
            }
        });

        $stateProvider.state('ovp.specuwelcome', {
            url: '',
            data: {
                bodyClass: 'specu-welcome',
                hideMenu: true
            },
            views: {
                appView: {
                    component: 'specuWelcome'
                }
            }
        });

        $stateProvider.state('ovp.specuerror', {
            url: '',
            'public': true,
            data: {
                bodyClass: 'specu-wifi-error',
                hideMenu: true
            },
            views: {
                appView: {
                    component: 'specuCampusWifiError'
                }
            },
            resolve: {
                error: function error() {
                    return {
                        title: 'Connect to Campus WiFi',
                        message: 'To watch TV on SpectrumU, please connect to your campus WiFi network.'
                    };
                }
            }
        });

        $stateProvider.state('novideoservice', {
            controller: ["config", "$rootScope", "$state", function controller(config, $rootScope, $state) {
                this.buyUrl = config.buyUrl;
                $rootScope.$broadcast('pageChangeComplete', $state.current);

                this.buyStream2 = function () {
                    $rootScope.$emit('Analytics:select', {
                        elementStandardizedName: 'buyStream2'
                    });
                };
            }],
            controllerAs: 'vm',
            data: {
                bodyClass: 'no-video-page',
                hideMenu: true
            },
            url: '',
            ignoreRedirects: true,
            templateUrl: '/js/ovpApp/twctv/no-video-service.html'
        });

        $stateProvider.state('ovp.sadtverror', {
            url: '',
            'public': true,
            data: {
                hideMenu: true
            },
            views: {
                appView: {
                    component: 'sadTvError'
                }
            },
            params: {
                errorCode: null
            },
            resolve: {
                errorCode: ["$stateParams", function errorCode($stateParams) {
                    return $stateParams.errorCode;
                }]
            }
        });

        // A blank page. Used by product page to ensure that the header (which is part of 'ovp') displays
        $stateProvider.state('ovp.blankPage', {});

        $stateProvider.state('ovp.guide', {
            data: {
                capability: CAPABILITIES.GUIDE,
                subheader: 89,
                bodyClass: 'guide',
                pageTitle: 'Guide'
            },
            resolve: {
                loadingDefer: ['$q', '$rootScope', function ($q, $rootScope) {
                    var ld = $q.defer();
                    $rootScope.$broadcast('message:loading', ld.promise);
                    return ld;
                }],
                //needed for integration of scheduled recordings through dispatchers
                rdvrService: ['rdvrService', function (rdvrService) {
                    return rdvrService;
                }],
                channelList: ['GuideService', function (GuideService) {
                    return GuideService.fetchChannelList();
                }],
                favorites: ['favoritesService', function (favoritesService) {
                    return favoritesService.syncFavoriteChannels();
                }]
            },
            url: '/guide',
            views: {
                'subMenu@ovp': {
                    templateUrl: '/js/ovpApp/guide/guide-subheader.html',
                    controller: 'GuideSubheaderController as vm'
                },
                appView: {
                    template: '<guide-scroll-container></guide-scroll-container>',
                    controller: 'GuideController as vm'
                }
            },
            /* @ngInject */
            onReactivate: ["$rootScope", function onReactivate($rootScope) {
                $rootScope.$broadcast('guide:reactivate');
            }],
            /* @ngInject */
            onInactivate: ["$rootScope", function onInactivate($rootScope) {
                $rootScope.$broadcast('guide:inactivate');
            }]

        });

        $stateProvider.state('ovp.playRemote', {
            data: {
                bodyClass: 'video-player-page',
                subheader: 'none'
            },
            params: {
                asset: null,
                action: null,
                stb: null
            },
            /* @ngInject */
            onEnter: ["$state", "$stateParams", function onEnter($state, $stateParams) {
                if (!$stateParams.asset && !$stateParams.tvAction && !$stateParams.stb) {
                    return $state.go('ovp.livetv');
                }
            }],
            url: '/playRemote'
        });

        $stateProvider.state('ovp.store', {
            url: '/store?category&page',
            data: {
                //capability: CAPABILITIES.STORE,
                bodyClass: 'store-page',
                pageTitle: 'VOD Store'
            },
            resolve: {
                /* @ngInject */
                home: ["homePage", "$q", function home(homePage, $q) {
                    var deferred = $q.defer();
                    homePage().then(function (defaultCategory) {
                        deferred.resolve(defaultCategory);
                    }, function () {
                        deferred.reject({ error: 'serviceErrorReload' });
                    });
                    return deferred.promise;
                }],
                isTVODEnabled: ['profileService', '$state', '$timeout', function (profileService, $state, $timeout) {
                    return profileService.isTVODEnabled().then(function (tvodEnabled) {
                        $timeout(function () {
                            if (!tvodEnabled) {
                                $state.go('ovp.ondemand');
                            }
                        });
                        return tvodEnabled;
                    });
                }]
            },
            views: {
                appView: {
                    template: '<div><store-page page="$stateParams.page" category="$stateParams.category"></store-page></div>'
                }
            }
        }).state('ovp.store.viewall', {});

        $stateProvider.state('ovp.notAuthorized', {
            views: {
                appView: {
                    /* @ngInject */
                    controller: ["alert", "errorCodesService", function controller(alert, errorCodesService) {
                        alert.open(errorCodesService.getAlertForCode('WGE-1002'));
                    }]
                }
            }
        });

        $stateProvider.state('ovp.outOfUs', {
            views: {
                appView: {
                    /* @ngInject */
                    controller: ["alert", "messages", "errorCodesService", function controller(alert, messages, errorCodesService) {
                        alert.open(errorCodesService.getAlertForCode('WLC-1006'));
                    }]
                }
            }
        });

        $stateProvider.state('ovp.disableAppDueServiceError', {
            views: {
                appView: {
                    /* @ngInject */
                    controller: ["alert", "messages", "$window", "errorCodesService", function controller(alert, messages, $window, errorCodesService) {
                        alert.open({
                            message: errorCodesService.getMessageForCode('TMP-9038'),
                            buttonText: 'RELOAD'
                        }).result['finally'](function () {
                            $window.location.reload();
                        });
                    }]
                }
            }
        });

        $stateProvider.state('terms', {
            data: {
                pageTitle: 'Terms of Use'
            },
            url: '/terms',
            templateUrl: '/' + version.appVersion + '/templates/terms.html',
            'public': true,
            /* @ngInject */
            controller: ["config", "$window", "$state", function controller(config, $window, $state) {
                this.help_twcable = config.help_twcable;
                //This ensures that the window is scrolled up so that if the user does back
                //he starts from the top.
                $window.scrollTo(0, 0);
                this.goBack = function () {
                    $window.history.back();
                };
                this.showBackLink = $state.previous && $state.previous.name !== '';
            }],
            controllerAs: 'vm'
        });
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/twctv/twctv-ui-router.js.map
