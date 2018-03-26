/*
 * Product ui-router config
 */

(function () {
    'use strict';

    angular.module('ovpApp.product.router', [
        'ui.router',
        'ovpApp.product',
        'ovpApp.product.focusRestore',
        'ovpApp.product.info',
        'ovpApp.search.searchService',
        'ovpApp.dataDelegate',
        'ovpApp.messages',
        'ovpApp.directives.scrollReset',
        'ovpApp.services.focusMediator',
        'lib.platform'
    ])
        //A list to verify the app name is correct/and translates to the correct name
        .constant('appOptions', {
            'guide': 'guide',
            'dvr': 'rdvr',
            'cdvr': 'rdvr',
            'ondemand': 'ondemand',
            'livetv': 'livetv',
            'search': 'search',
            'watchLater': 'watchLater'
        })
        .run(run)
        .config(productUiRouter);

    /* @ngInject */
    function run($state, $rootScope, $timeout, searchService, messages, delegateFactory, $document, platform,
        focusMediator, $transitions) {

        loadBackgroundStateOnDeepLink();

        restoreFocusOnTransitions();

        removeProductPageStickyState();

        function removeProductPageStickyState() {
            // As product page is a part of sticky state. So need to exit sticky state when user
            // navigate back from playing video to updated product button.
            $transitions.onSuccess({
                to: function (state) {
                    return (state.name.startsWith('ovp.ondemand.play'));
                }
            }, (transition) => {
                const stickyStates = transition.router.getPlugin('stickystates');
                const inactives = stickyStates.inactives();
                if (inactives.find(state => state.name === 'product')) {
                    stickyStates.exitSticky('product');
                }
            });
        }

        function loadBackgroundStateOnDeepLink() {
            // The menu is part of the 'ovp' state, so for product to look correct an ovp state must exist
            //   inactive in the background. So on deep link, we need to manually load the ovp state
            $transitions.onSuccess({to: 'product.**'}, function (transition) {
                const inactives = transition.router.getPlugin('stickystates').inactives();
                const ovp = inactives.find(state => state.name === 'ovp');
                if (!ovp) {
                    const dispose = $transitions.onSuccess({to: 'ovp.blankPage'}, function () {
                        $state.go(transition.to(), transition.params('to'), {location: 'replace'});
                        dispose();
                        $rootScope.$emit('Analytics:unpauseNavigation');
                    });

                    $rootScope.$emit('Analytics:pauseNavigation');

                    $state.go('ovp.blankPage');
                }
            });
        }

        function restoreFocusOnTransitions() {
            $transitions.onStart({}, function (transition) {
                const toState = transition.to();
                const fromState = transition.from();
                if (toState.name.startsWith('product') && !fromState.name.startsWith('product')) {
                    // When entering product, save the focus and restore it if user exits back the way they came
                    let activeEl = $document[0].activeElement;
                    let entryState = fromState.name;
                    let unregister = $transitions.onSuccess({}, function (_transition) {
                        const _toState = _transition.to();
                        if (!_toState.name.startsWith('product')) {
                            if (_toState.name === entryState) {
                                focusMediator.requestFocus(focusMediator.highPriority)
                                    .then(() => {
                                        //added timeout for windows / ff ngc-5784
                                        const isFF = platform.name === 'Firefox';
                                        if (isFF) {
                                            $timeout(() => activeEl.focus(), 1000);
                                        } else {
                                            activeEl.focus();
                                        }
                                    });

                                unregister();
                            } else if (!_toState.name.startsWith('search')) {
                                unregister();
                            }
                            // Else they went product -> search. That's still "in" the product page, so don't unregister
                        }
                    });
                }
            });
        }
    }


    /* @ngInject */
    function productUiRouter($stateProvider) {
        $stateProvider
            .state('product', {
                abstract: true,
                url: '/product',
                sticky: true,
                views: {
                    productView: {
                        template: `<ui-view class="product-page-content" ` +
                            `ng-class='{"invisible": !$state.includes("product")}' />`
                    }
                },
                data: {
                    bodyClass: 'product-active',
                    hideSubMenu: true
                }
            })
            .state('product.series', {
                url: `/series/{tmsSeriesId}?app&serviceId&airtime&tmsProgramId&{uri:uri}&tmsGuideServiceId
                    &displayChannel`,
                component: 'productSeries',
                params: {
                    app: resolveApp,
                    serviceId: null, //mystroServiceId
                    tmsGuideServiceId: null,
                    airtime: null, //airtimeUtcSec
                    tmsProgramId: null,
                    uri: null, // A specific uri to use instead of constructing one from the tmsSeriesId
                    displayChannel: null
                },
                redirectTo: {
                    state: 'product.series.episodes'
                },
                resolve: {
                    fetcher: (productService, $q, $stateParams) => {
                        return createFetcher(productService, $q, $stateParams);
                    },
                    series: (fetcher, $rootScope) => {
                        let promise = fetcher();
                        if (promise) {
                            $rootScope.$broadcast(
                                'message:loading',
                                promise,
                                undefined,
                                'Series'
                            );
                        }
                        return promise || {};
                    },
                    /* @ngInject */
                    blocked: series => series.isBlocked,
                    /* @ngInject */
                    cameFromWatchLater: $transition$ => $transition$.from().name.startsWith('ovp.watchLater'),
                    app: fromStateParams('app'),
                    tmsProgramId: fromStateParams('tmsProgramId')
                },
                /* @ngInject */
                onEnter: function ($rootScope) {
                    $rootScope.$broadcast('productEnter'); //Used to trigger a scroll reset
                }
            })
            .state('product.series.episodes', {
                url: '/episodes',
                component: 'productEpisodeList'
            })
            .state('product.series.info', {
                url: '/info',
                component: 'productInfo',
                resolve: {
                    /* @ngInject */
                    asset: series => series
                }
            })
            .state('product.event', {
                url: '/movie/:tmsId?app&serviceId&airtime&tmsProgramId&{uri:uri}&tmsGuideServiceId&displayChannel',
                component: 'productMovie',
                params: {
                    // Passes additional data about the context. Eg, a specific program or time
                    app: resolveApp,
                    serviceId: null, //mystroServiceId
                    airtime: null, //airtimeUtcSec
                    uri: null, // A specific uri to use instead of constructing one from the tmsProgramId
                    tmsGuideServiceId: null,
                    displayChannel: null
                },
                resolve: {
                    fetcher: (productService, $q, $stateParams) => {
                        return createFetcher(productService, $q, $stateParams);
                    },
                    movie: (fetcher, $rootScope) => {
                        let promise = fetcher();
                        if (promise) {
                            $rootScope.$broadcast(
                                'message:loading',
                                promise,
                                undefined,
                                'Movie'
                            );
                        }
                        return promise || {};
                    },
                    /* @ngInject */
                    blocked: movie => movie.isBlocked,
                    /* @ngInject */
                    cameFromWatchLater: $transition$ => $transition$.from().name.startsWith('ovp.watchLater')
                },
                /* @ngInject */
                onEnter: function ($rootScope) {
                    $rootScope.$broadcast('productEnter'); //Used to trigger a scroll reset
                }
            });

        function fromStateParams(key) {
            return ['$stateParams', function ($stateParams) {
                return $stateParams[key];
            }];
        }

        /* @ngInject */
        function resolveApp($state, appOptions) {
            var app, re = /ovp\.([a-zA-Z0-9]*)/;
            if ($state.current) {
                if ($state.current.name.startsWith('search')) {
                    app = 'search';
                } else if (re.test($state.current.name)) {
                    app = re.exec($state.current.name)[1];
                    app = (appOptions[app]) ? appOptions[app] : null;
                }
            }
            return app;
        }

        function createFetcher(productService, $q, $stateParams) {
            let fetch;
            if ($stateParams.uri) {
                fetch = productService
                    .withUri($stateParams.uri)
                    .fetch;
            } else if ($stateParams.tmsId) {
                fetch = productService
                    .withTmsId($stateParams.tmsId, $stateParams)
                    .fetch;
            } else if ($stateParams.tmsSeriesId) {
                fetch = productService
                    .withTmsSeriesId($stateParams.tmsSeriesId, $stateParams)
                    .fetch;
            } else {
                fetch = () => $q.resolve({});
            }

            return function (waitForFetch) {
                return fetch(waitForFetch)
                    .then(data => {
                        data.displayChannel = parseInt($stateParams.displayChannel) || null;
                        if (data.seasons) {
                            data.seasons.forEach(season =>
                                season.episodes.forEach(episode =>
                                    episode.displayChannel = data.displayChannel));
                        }
                        return data;
                    });
            };
        }
    }
}());
