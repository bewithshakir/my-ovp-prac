(function () {
    'use strict';

    angular.module('ovpApp.ondemand', [
        'ovpApp.messages',
        'ovpApp.product.service',
        'ui.router',
        'ovpApp.player',
        'ovpApp.remotePlayer',
        'ovpApp.services.homePage',
        'ovpApp.components.alert',
        'ovpApp.services.locationService',
        'ovpApp.services.errorCodes',
        'ovpApp.ondemand.data',
        'ovpApp.ondemand.subheader',
        'ovpApp.ondemand.category',
        'ovpApp.ondemand.networks',
        'ovpApp.ondemand.networkSubPage',
        'ovpApp.ondemand.gallerySummaryPage',
        'ovpApp.ondemand.networkCategoryList',
        'ovpApp.ondemand.subheaderService',
        'ovpApp.services.ovpStorage',
        'ovpApp.directives.scrollCache',
        'ui.router'
        ])
    .run(run)
    .config(config);

    /* @ngInject */
    function run(playerService, $timeout, $transitions) {
        // This would be better in an onInactivate, but stickyState's onInactivate hooks
        //    appear to be nonfunctional in the current version
        const playerState = state => state.name.indexOf('ovp.ondemand.play') === 0;

        $transitions.onSuccess({from: playerState}, function (transition) {
            const stickyStates = transition.router.getPlugin('stickystates');
            const inactives = stickyStates.inactives();
            if (inactives.find(state => state.name === transition.from().name)) {
                playerService.getInstance()
                    .then(player => player.stop());

                // Keeping the player in an 'inactive' state causes problems when resuming
                //   it. Bookmarks can be lost, analytics can miss it, etc. So instead we exit,
                //   which will force it to reload into the correct state on re-enter
                stickyStates.exitSticky(transition.from().name);
            }
        });
    }

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider, CAPABILITIES) {

        //backwards compatible rewrite
        $urlRouterProvider.rule(function ($injector, $location) {
            //what this function returns will be set as the $location.url
            var path = $location.url();

            if (path.indexOf('networks$') > -1) {
                $location.replace().path('/networks');  //to do: handle old links
            }
        });

        /**
          Because we don't know ahead of time precisely what the menu items in ondemand are, we use
          lazy loading to initialize the states. The exact structure will depend on what data the
          server sends, but it will look something like this:

          ovp.ondemand
            |--ovp.ondemand.favorites
            |    \--ovp.ondemand.favorites.viewall
            |--ovp.ondemand.tv_shows
            |--ovp.ondemand.movies
            |--ovp.ondemand.kids
            |--ovp.ondemand.networks
            |    \--ovp.ondemand.networks.network
            |--ovp.ondemand.playProduct
            |--ovp.ondemand.playEpisodeWithDetails
            \--ovp.ondemand.playCdvr
        */

        // Placeholder ondemand state
        $stateProvider.state('ovp.ondemand.**', {
            url: '/ondemand',
            lazyLoad: registerOndemandStates
        });

        // Real ondemand state
        const rootStateDefinition = {
            name: 'ovp.ondemand',
            url: '/ondemand',
            data: {
                capability: CAPABILITIES.ONDEMAND,
                subheader: 50,
                subheaderLabel: 'On Demand'
            },
            redirectTo: function (transition) {
                return transition.injector().get('onDemandData').defaultCategory()
                    .then(defaultCategory => `ovp.ondemand.${defaultCategory}`);
            },
            resolve: {
                /* @ngInject */
                menuItems: function (onDemandData) {
                    return onDemandData.getFrontDoor();
                }
            },
            views: {
                'subMenu@ovp': {
                    component: 'onDemandSubheader'
                },
                appView: {
                    template: '<div ui-view scroll-reset="resetNetworkScroll" scroll-cache></div>'
                }
            }
        };

        // Flattens a multidimensional dimensional array by one dimension
        function concatAll(arr) {
            return arr.reduce((result, current) => {
                if (Array.isArray(current)) {
                    result.push(...current);
                } else {
                    result.push(current);
                }
                return result;
            }, []);
        }

        /**
         * Replaces the placeholder ovp.ondemand.** state with a real tree of states
         * @param {Transition} $transition$
         */
        function registerOndemandStates($transition$) {
            const OauthService = $transition$.injector().get('OauthService');
            const onDemandData = $transition$.injector().get('onDemandData');
            const $q = $transition$.injector().get('$q');
            const $rootScope = $transition$.injector().get('$rootScope');
            const registry = $transition$.router.stateRegistry;

            const promise = OauthService.isAuthenticated()
                .then(authenticated => {
                    if (authenticated) {
                        return onDemandData.getFrontDoor();
                    } else {
                        return $q.reject({silent: true});
                    }
                })
                .then(categories => {
                    registry.deregister('ovp.ondemand.**');
                    registry.register(rootStateDefinition);
                    let states = categories.map(category =>
                        createStateDefinitions(category, onDemandData, $transition$));
                    states.push(createPlayerStates());
                    concatAll(states)
                        .filter(state => !!state)
                        .forEach(state => registry.register(state));
                })
                .catch(err => {
                    if (angular.isString(err) && err.indexOf('User is not logged in') > -1) {
                        return $q.reject({silent: true});
                    } else {
                        return $q.reject(err);
                    }
                });

            $rootScope.$broadcast(
                'message:loading',
                promise,
                undefined,
                'On Demand'
            );

            return promise;
        }

        const factories = {
            // Creates the favorites page and its children
            pods_with_assets: function (category, rootName) {
                return [{
                    name: `ovp.ondemand.${rootName}`,
                    component: 'gallerySummaryPage',
                    redirectTo: restrictOutOfUs,
                    url: `/${rootName}`,
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageNameHint: 'gallerySummaryPage',
                        categoryHint: category.name,
                        isLazyLoad: false
                    },
                    data: {
                        pageTitle: `On Demand - ${rootName}`
                    },
                    resolve: {
                        /* @ngInject */
                        data: (onDemandData, $rootScope) => {
                            const promise = onDemandData.getByUri(category.uri);
                            $rootScope.$broadcast(
                                'message:loading',
                                promise,
                                undefined,
                                `On Demand - ${rootName}`
                            );

                            return promise;
                        }
                    },
                    /* @ngInject */
                    onEnter(ondemandSubheaderService) {
                        ondemandSubheaderService.setState({
                            showFrontDoor: true
                        });
                    }
                }, {
                    name: `ovp.ondemand.${rootName}.viewall`,
                    url: '/:name?page',
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageNameHint: 'viewall',
                        categoryHint: category.name,
                        isLazyLoad: false
                    },
                    views: {
                        '@ovp.ondemand': {
                            component: 'ondemandCategory'
                        }
                    },
                    resolve: {
                        /* @ngInject */
                        category: (onDemandData, name, data, page, $state, $rootScope) => {
                            if (angular.isUndefined(page) || page < 1) {
                                page = 1;
                            }
                            const format = onDemandData.formatCategoryNameForRoute;
                            name = format(name);
                            const category = data.categories.find(c => format(c.name) === name);
                            if (category) {
                                let promise = onDemandData.getByUri(category.uri, page);
                                $rootScope.$broadcast(
                                    'message:loading',
                                    promise,
                                    undefined,
                                    `On Demand - ${category.name}`
                                );
                                return promise;
                            } else {
                                $state.go(`ovp.ondemand.${rootName}`);
                            }
                        },
                        name: fromStateParams('name'),
                        page: fromStateParams('page')
                    },
                    /* @ngInject */
                    onEnter(ondemandSubheaderService) {
                        ondemandSubheaderService.setState({
                            showFrontDoor: true,
                            showToggle: true
                        });
                    },
                    /* @ngInject */
                    onExit(ondemandSubheaderService) {
                        ondemandSubheaderService.setState({
                            showFrontDoor: true,
                            showToggle: false
                        });
                    }
                }];
            },
            // Creates top-level category pages, such as 'movies' or 'kids'
            media_list: function (category, name) {
                return {
                    name: `ovp.ondemand.${name}`,
                    component: 'ondemandCategory',
                    url: `/${name}?page`,
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageNameHint: 'ondemandCategory',
                        categoryHint: category.name,
                        isLazyLoad: false
                    },
                    redirectTo: restrictOutOfUs,
                    data: {
                        pageTitle: `On Demand - ${name}`
                    },
                    resolve: {
                        /* @ngInject */
                        category: (onDemandData, page, $rootScope) => {
                            if (angular.isUndefined(page) || page < 1) {
                                page = 1;
                            }
                            const promise = onDemandData.getByUri(category.uri, page);
                            // replace underscores with spaces for screed reader
                            name = name.replace('_', ' ');
                            $rootScope.$broadcast(
                                'message:loading',
                                promise,
                                undefined,
                                `On Demand - ${name}`
                            );

                            return promise;
                        },
                        page: fromStateParams('page')
                    },
                    /* @ngInject */
                    onEnter(ondemandSubheaderService) {
                        ondemandSubheaderService.setState({
                            showFrontDoor: true,
                            showToggle: true
                        });
                    }
                };
            },
            // Creates the networks page and its children
            network_list: function (category, rootName, $transition$) {
                // Update subheader when going to the main network page
                $transition$.router.transitionService
                    .onSuccess({to: `ovp.ondemand.${rootName}`}, function () {
                        $transition$.injector().get('ondemandSubheaderService').setState({
                            showFrontDoor: true
                        });
                    });

                // Rset the scroll position when going to any network page
                $transition$.router.transitionService
                    .onSuccess({to: `ovp.ondemand.${rootName}.**`}, function () {
                        $transition$.injector().get('$rootScope').$emit('resetNetworkScroll');
                    });

                return [{
                    name: `ovp.ondemand.${rootName}`,
                    url: `/${rootName}`,
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageNameHint: 'networkMainPage',
                        categoryHint: category.name,
                        isLazyLoad: false
                    },
                    redirectTo: restrictOutOfUs,
                    component: 'networkMainPage',
                    data: {
                        pageTitle: `On Demand - ${rootName}`
                    },
                    resolve: {
                        /* @ngInject */
                        networks: (onDemandData, $rootScope) => {
                            const promise = onDemandData.getByUri(category.uri)
                                .then(data => data.networks);
                            $rootScope.$broadcast(
                                'message:loading',
                                promise,
                                undefined,
                                `On Demand - ${rootName}`
                            );
                            return promise;
                        }
                    }
                }, {
                    name: `ovp.ondemand.${rootName}.network`,
                    url: `/:name?index&page`,
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageNameHint: 'curatedNetworks',
                        categoryHint: category.name,
                        isLazyLoad: false
                    },
                    data: {
                        pageTitle: transition => `On Demand - ${transition.params('to').name}`
                    },
                    views: {
                        '@ovp.ondemand': {
                            component: 'networkSubPage'
                        }
                    },
                    resolve: {
                        name: fromStateParams('name'),
                        index: fromStateParams('index'),
                        page: fromStateParams('page'),
                        /* @ngInject */
                        data: (page, name, networks, onDemandData, $q, $state, $rootScope) => {
                            const format = onDemandData.formatCategoryNameForRoute;
                            name = format(name);
                            const network = networks.find(n => format(n.name) === name);
                            if (network) {
                                let promise;
                                if (network.type === 'media_list') {
                                    promise = onDemandData.getByUri(network.uri, page);
                                } else {
                                    // category_list or pods_with_assets contain a list of categories,
                                    //   and then underneath that a number of assets. If we included
                                    //   params to limit the results, that limits the number of
                                    //   categories, not the number of results per category.
                                    promise = onDemandData.getByUri(network.uri);
                                }
                                $rootScope.$broadcast(
                                    'message:loading',
                                    promise,
                                    undefined,
                                    `On Demand - ${network.name}`
                                );
                                return promise;
                            } else {
                                $state.go(`ovp.ondemand.${rootName}`);
                            }
                        }
                    },
                    /* @ngInject */
                    onEnter: (ondemandSubheaderService, data, $state, index) => {
                        let options;
                        if (data.type === 'media_list') {
                            options = {
                                showBack: true,
                                backString: 'Networks',
                                onBackClick: () => $state.go(`ovp.ondemand.${rootName}`),
                                showToggle: true,
                                showNetworkLogo: true,
                                networkName: () => data.name,
                                networkLogoUrl: () => data.imageUri({height: 80})
                            };
                        } else if (data.type === 'pods_with_assets') {
                            options = {
                                showBack: true,
                                backString: 'Networks',
                                onBackClick: () => $state.go(`ovp.ondemand.${rootName}`),
                                showToggle: true,
                                showNetworkLogo: true,
                                networkName: () => data.name,
                                networkLogoUrl: () => data.imageUri({height: 80}),
                                showNetwork3Tier: true,
                                network3TierIndex: index,
                                childNetworks: () => data.categories
                            };
                        }
                        // Deliberately not checked: network.type === 'category_list'.
                        //    NetworkCategoryList sets the subheader itself

                        if (options) {
                            ondemandSubheaderService.setState(options);
                        }
                    }
                }];
            }
        };

        function createStateDefinitions(category, onDemandData, $transition$) {
            const factory = factories[category.type];
            if (factory) {
                const formattedName = onDemandData.formatCategoryNameForRoute(category.name);
                return factory(category, formattedName, $transition$);
            }
        }

        function fromStateParams(key) {
            return ['$stateParams', function ($stateParams) {
                return $stateParams[key];
            }];
        }

        let oohListener;
        const commonPlayerParams = {
            redirectTo: restrictOutOfUs,
            data: {
                bodyClass: 'video-player-page',
                subheader: 'none',
                pageTitle: transition => {
                    return transition.injector().getAsync('asset')
                        .then(asset => `${asset.seriesTitle || asset.title}, ${asset.network.callsign}, OnDemand`);
                },
                hideHeaderGradient: true
            },
            resolve: {
                asset: fetchAsset,
                /* @ngInject */
                stream: function (asset, $stateParams) {
                    if ($stateParams.streamIndex !== undefined && $stateParams.streamIndex !== null) {
                        return asset.streamList[$stateParams.streamIndex];
                    } else {
                        let id = $stateParams.episodeID || $stateParams.productID,
                            type = !!$stateParams.isCdvr ? 'CDVR' : 'ONLINE_ONDEMAND',
                            streamByProviderAssetId = asset.streamList
                                .find(s => s.streamProperties.providerAssetID === id && s.type == type),
                            streamByPlatformMediaId;

                        //deprecated for deeplink by streamByProviderAssetId,
                        // only included for compatibility check with
                        //twcc sites.
                        if (!streamByProviderAssetId) {
                            //send splunk message?
                            streamByPlatformMediaId = asset.streamList
                                .find(s => s.streamProperties.thePlatformMediaId === id);
                        }

                        return streamByProviderAssetId || streamByPlatformMediaId;
                    }
                }
            },
            params: {
                streamIndex: null
            },
            views: {
                '': {
                    /* @ngInject */
                    controller: function ($stateParams, asset,
                                          stream, $rootScope, $scope,
                                          playerService) {
                        let vm = this;

                        vm.options = {
                            mode: !!$stateParams.isCdvr ? 'CDVR' : 'VOD',
                            asset: asset,
                            stream: stream,
                            isTrailer: !!$stateParams.trailer,
                            isStartOver: !!$stateParams.isStartOver,
                            isCdvr: !!$stateParams.isCdvr
                        };

                        playerService.playStream(vm.options);
                        $rootScope.$broadcast('Analytics:pageChangeComplete');

                        $scope.$on('$destroy', () => {
                            playerService.stop();
                        });
                    },
                    controllerAs: 'vm'
                },
                'subMenu@ovp': {
                    template: '<div></div>'
                }
            },
            /* @ngInject */
            onEnter: function (asset, stream, $rootScope, $stateParams, ondemandGoBack) {
                if (!stream.streamProperties.availableOutOfHome) {
                    oohListener = $rootScope.$on('LocationService:locationChanged', function (data) {
                        if (!data.behindOwnModem) {
                            ondemandGoBack(asset, $stateParams.trailer);
                        }
                    });
                }
            },
            /* @ngInject */
            onExit: function () {
                if (oohListener) {
                    oohListener();
                    oohListener = undefined;
                }
            }
        };

        function createPlayerStates() {
            return [
                angular.extend({}, commonPlayerParams, {
                    name: 'ovp.ondemand.playEpisodeWithDetails',
                    url: '/play/:seriesID/:episodeID?showDetails&startOver',
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageName: 'playerOnDemand',
                        checkForTvod: true,
                        isLazyLoad: false,
                        dependsOnFlash: true
                    }
                }),
                angular.extend({}, commonPlayerParams, {
                    name: 'ovp.ondemand.playProduct',
                    url: '/play/:productID?showDetails&startOver&trailer&streamIndex',
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageName: 'playerOnDemand',
                        checkForTvod: true,
                        isLazyLoad: false,
                        dependsOnFlash: true
                    }
                }),
                angular.extend({}, commonPlayerParams, {
                    name: 'ovp.ondemand.playCdvr',
                    url: '/playcdvr/:tmsProgramID?showDetails&startOver&isCdvr&streamIndex',
                    analytics: {
                        appSection: 'curatedCatalog',
                        pageName: 'playerOnDemand',
                        isLazyLoad: false,
                        dependsOnFlash: true
                    }
                })
            ];
        }

        /* @ngInject */
        function fetchAsset($stateParams, productService, alert, messages, $state, $q, errorCodesService) {
            let productToPlayId, fetcher,
                onError = function (error) {
                    let dialog;
                    if (error.status === 404) {
                        dialog = alert.open({
                            message: errorCodesService.getMessageForCode('WGU-1002'),
                            buttonText: 'OK'
                        });
                    } else {
                        dialog = alert.open({
                            message: errorCodesService.getMessageForCode('WGE-1001'),
                            buttonText: 'OK'
                        });
                    }

                    return dialog.result.then(() => {
                        if ($state.current.name === '' || $state.current.name === 'login') {
                            // Deep linked in, so we can't just stay where we are;
                            $state.go('ovp.ondemand');
                        }

                        // Cancel the transition to the player
                        return $q.reject({silent: true});
                    });
                };
            if ($stateParams.productID !== undefined) {
                productToPlayId = $stateParams.productID;
                fetcher = productService.withProviderAssetId($stateParams.productID);
            } else if ($stateParams.seriesID) { // episodic content
                productToPlayId = $stateParams.episodeID;
                fetcher = productService.withTmsSeriesId($stateParams.seriesID);
            } else if ($stateParams.tmsProgramID) {
                productToPlayId = $stateParams.tmsProgramID;
                fetcher = productService.withTmsId($stateParams.tmsProgramID);
            } else {
                return onError({});
            }

            return fetcher.fetch()
                .then(product => {
                    let asset;
                    if (product && product.isSeries) {
                        let episodes = product.seasons ? product.seasons.reduce((episodeArray, season) =>
                            episodeArray.concat(...season.episodes), []) : [];

                        asset = episodes.find(e => e.streamList && e.streamList.find(
                            s => s.streamProperties.providerAssetID == productToPlayId));
                        if (!asset) {
                            asset = episodes.find(e => e.tmsProgramIds.includes(productToPlayId));
                        }

                    } else {
                        asset = product;
                    }

                    if (!asset) {
                        return onError({status: 404});
                    } else {
                        return asset;
                    }
                }, onError);
        }

        function restrictOutOfUs(transition) {
            const locationService = transition.injector().get('locationService');
            return locationService.getLocation()
                .then(location => {
                    if (!location.inUS) {
                        return 'ovp.outOfUs';
                    }
                });
        }
    }
}());
