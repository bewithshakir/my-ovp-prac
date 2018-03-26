(function () {
    'use strict';

    /*
     * Search ui-router config
     */

    angular.module('ovpApp.search', [
        'ui.router',
        'ovpApp.dataDelegate',
        'ovpApp.services.ovpStorage',
        'ovpApp.search.header',
        'ovpApp.search.input',
        'ovpApp.search.personResults',
        'ovpApp.search.quickResults',
        'ovpApp.search.results',
        'ovpApp.search.sportsResults',
        'ovpApp.search.error',
        'ovpApp.search.recentSearches',
        'ovpApp.search.searchService',
        'rx',
        'ovpApp.services.rxUtils',
        'ovpApp.config',
        'ovpApp.directives.gridList',
        'ovpApp.directives.focus',
        'ovpApp.directives.fadeinImmediate',
        'ovpApp.directives.fadeinOnload',
        'ovpApp.directives.lazySrc',
        'ovpApp.directives.trapFocus',
        'ovpApp.services.bookmark',
        'ovpApp.services.capabilitiesService'
        ])
    .run(run)
    .factory('searchFocusIndex', () => {
        let focusIndex = {
            index: -1,
            parentIndex: -1
        };
        return {
            set: (i, p) => {
                focusIndex.index = i;
                focusIndex.parentIndex = p;
            },
            get: () => focusIndex,
            reset: () => {
                focusIndex.index = -1;
                focusIndex.parentIndex = -1;
            }
        };
    })
    .config(config);

    /* @ngInject */
    function run($state, $rootScope, $timeout, ovpStorage, storageKeys, $location,
      $q,$transitions, searchService) {

        loadBackgroundStateOnDeepLink();

        replaceStatesInHistory();

        redirectIfOnlyOneResult();

        redirectIfError();

        function loadBackgroundStateOnDeepLink() {
            // The menu is part of the 'ovp' state, so for search to look correct an ovp state must exist
            //   inactive in the background. So on deep link, we need to manually load the ovp state
            $transitions.onSuccess({to: 'search.**'}, function (transition) {
                const inactives = transition.router.getPlugin('stickystates').inactives();
                const ovp = inactives.find(state => state.name === 'ovp');
                if (!ovp) {
                    const dispose = $transitions.onSuccess({to: 'ovp.blankPage'}, function () {
                        $state.go(transition.to(), transition.params('to'), {location: 'replace'});
                        dispose();
                    });

                    $state.go('ovp.blankPage');
                }
            });
        }

        function replaceStatesInHistory() {
            const searchStatesToReplace = ['search.recent', 'search.quickresults'];
            $transitions.onSuccess({}, function (transition) {
                if (searchStatesToReplace.indexOf(transition.from().name) >= 0) {
                    $location.replace();
                }
            });
        }

        function redirectIfOnlyOneResult() {
            $transitions.onEnter({
                entering: state => state.name === 'search.quickresults' || state.name === 'search.results'
            }, function (transition) {
                // If the user came from product page, then redirecting to a product page could
                // give the appearance that nothing happened.
                if (searchService.doNotRedirect) {
                    // It's a one-time thing
                    searchService = false;
                    return;
                }

                const results = transition.injector().get('results');

                // Analytics event for when the user is navigating to the results
                // for a recent search.
                if (results && transition.targetState().params().isRecentSearch === true) {
                    $rootScope.$emit('Analytics:search-recent-search', {results: results});
                }

                if (results && results.numResults == 1) {

                    // Analytics: Emit select-item event because we're pre-selecting this one.
                    $rootScope.$emit('Analytics:search-select-item', {
                        asset: results.categories[0].results[0],
                        triggeredBy: 'application'
                    });

                    let route = results.categories[0].results[0].clickRoute;
                    if (route) {
                        route[1] = route[1] || {};
                        return transition.router.stateService.target(...route);
                    }
                }
            });

            $transitions.onEnter({
                entering: state => {
                    return ['search.person', 'search.sports', 'search.team'].indexOf(state.name) > -1;
                }
            }, function (transition) {
                // If the user came from product page, then redirecting to a product page could
                // give the appearance that nothing happened.
                if (searchService.doNotRedirect) {
                    // It's a one-time thing
                    searchService = false;
                    return;
                }

                const results = transition.injector().get('results');

                // Analytics: Issue curated sub-search 'searched' event.
                $rootScope.$emit('Analytics:sub-search', {
                    searchText: transition.params('to').query,
                    results: results
                });

                if (results.length == 1 && results[0].clickRoute) {

                    // Analytics: Emit select-item event because we're pre-selecting this one.
                    $rootScope.$emit('Analytics:search-select-item', {
                        asset: results[0],
                        triggeredBy: 'application'
                    });

                    let route = results[0].clickRoute;
                    route[1] = route[1] || {};
                    return transition.router.stateService.target(...route);
                }
            });
        }

        function redirectIfError() {
            $transitions.onError({to: 'search.**'}, function (transition) {
                const err = transition.error();
                const SUPERSEDED = 2; // These numbers come from ui-router RejectType
                const ABORTED = 3;
                if (err && (err.silent === true || err.type === SUPERSEDED || err.type === ABORTED)) {
                    return;
                }

                $state.go('search.error', {error: err});
            });
        }
    }
    /* @ngInject */
    function config($stateProvider, CAPABILITIES) {
        $stateProvider.state('search', {
            abstract: 'true',
            sticky: 'true',
            url: '/search',
            views: {
                searchView: {
                    template:
                        `<div class="search-container" ng-class='{"invisible": !$state.includes("search")}' 
                            role="application">
                            <search-header></search-header>
                            <ui-view></ui-view>
                        </div>`
                }
            },
            /* @ngInject */
            onEnter: (BookmarkService) => {
                BookmarkService.getBookmarks();
            },
            data: {
                capability: CAPABILITIES.SEARCH,
                bodyClass: 'search-active',
                pageTitle: 'Search',
                hideMenu: true,
                hideSubMenu: true
            }
        });

        $stateProvider.state('search.error', {
            component: 'searchError',
            params: {
                error: null
            },
            resolve: {
                /* @ngInject */
                error: function ($stateParams) {
                    return $stateParams.error;
                }
            }
        });


        $stateProvider.state('search.blank', {});

        $stateProvider.state('search.recent', {
            url: '',
            component: 'recentSearches'
        });

        $stateProvider.state('search.quickresults', {
            component: 'quickSearchResults',
            params: {
                results: null,
                query: null
            },
            resolve: {
                /* @ngInject */
                query: function ($stateParams) {
                    return $stateParams.query;
                },
                results: getComponentResults
            }
        });

        $stateProvider.state('search.results', {
            url: '/result/:query?focusOnLoad',
            component: 'searchResults',
            resolve: {
                /* @ngInject */
                query: function ($stateParams) {
                    return $stateParams.query;
                },
                results: getComponentResults
            }
        });

        $stateProvider.state('search.person', {
            url: '/result/person/:query?tmsPersonId&tmsId&role&{uri:uri}',
            templateUrl: '/js/ovpApp/search/result-pages/person-search-results.html',
            controller: 'PersonResultsController',
            controllerAs: 'vm',
            resolve: {
                /* @ngInject */
                query: function ($stateParams) {
                    return $stateParams.query;
                },
                results: subResultBuilder('person')
            }
        });

        $stateProvider.state('search.sports', {
            url: '/result/sports/:query?{uri:uri}',
            component: 'sportsSearchResults',
            resolve: {
                /* @ngInject */
                query: function ($stateParams) {
                    return $stateParams.query;
                },
                results: subResultBuilder('sports')
            }
        });

        $stateProvider.state('search.team', {
            url: '/result/team/:query?{uri:uri}',
            component: 'sportsSearchResults',
            resolve: {
                /* @ngInject */
                query: function ($stateParams) {
                    return $stateParams.query;
                },
                results: subResultBuilder('team')
            }
        });

        function subResultBuilder(category) {
            /* @ngInject */
            function inner(searchService, $state, $stateParams, $q, $rootScope, delegateFactory) {
                let results;
                if ($stateParams.uri) {
                    // We know the uri from a previous search
                    results = searchService.getSubResultsByUri($stateParams.uri)
                        .retry(3)
                        .toPromise($q);
                } else if ($stateParams.tmsPersonId && $stateParams.tmsId && $stateParams.role) {
                    // We're searching from the context of a specific asset
                    let searchFxn = $stateParams.role == 'director' ?
                        searchService.getDirectorResults : searchService.getActorResults;
                    results = searchFxn($stateParams.tmsPersonId, $stateParams.tmsId)
                        .retry(3)
                        .toPromise($q);
                } else {
                    // All we have is the string to work with. This may happen when the user deep links in
                    results = searchService.getSubResultsByQueryAndCategory($stateParams.query, category)
                        .retry(3)
                        .toPromise($q);
                }

                const promise = results.then(results => {
                    let delegates = (results && results.results) ?
                        results.results.map(delegateFactory.createInstance) : [];

                    return delegates;
                });

                $rootScope.$broadcast(
                    'message:loading',
                    promise,
                    undefined,
                    'Search results'
                );

                return promise;
            }

            return inner;
        }

        /* @ngInject */
        function getComponentResults(searchService, $stateParams, $q, $rootScope, delegateFactory) {
            $rootScope.$emit('Analytics:issue-search');
            const promise = searchService.getComponentResults($stateParams.query)
                .retry(3)
                .toPromise($q)
                .then(delegateFactory.createInstance);

            $rootScope.$broadcast(
                'message:loading',
                promise,
                undefined,
                'Search Results'
            );

            return promise;

        }
    }
}());
