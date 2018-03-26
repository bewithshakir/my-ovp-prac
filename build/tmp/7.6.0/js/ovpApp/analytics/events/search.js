'use strict';

(function () {
    'use strict';

    searchEvents.$inject = ["$rootScope", "analyticsService", "$log", "stringUtil"];
    angular.module('ovpApp.analytics.events.search', ['ovpApp.analytics.analyticsService']).factory('search', searchEvents).run(["search", function loadHandler(search) {
        return search;
    }]);

    /* @ngInject */
    function searchEvents($rootScope, analyticsService, $log, stringUtil) {

        // Get a handle to the analytic state object for storing things.
        var state = analyticsService.state;

        // Simple enumeration for SearchMode
        var SearchModeEnum = Object.freeze({
            NONE: null,
            RECENT: 'recent',
            SUGGESTED: 'suggested'
        });

        // Simple enumeration for SearchType
        var SearchTypeEnum = Object.freeze({
            NONE: null,
            PREDICTIVE: 'predictive',
            KEYWORD: 'keyword'
        });

        // Need to track the search mode after a search so it can be included
        // in any subsequent 'selectContent' events.
        var searchMode = SearchModeEnum.NONE;

        // Unique ID for each distinguishable search. Reset when user clicks
        // the search icon, or resets the search field.
        var searchId = null;

        // Track the first character in the search field. If this ever changes,
        // create a new search id, because the user is probably looking for
        // something different now.
        var lastKnownFirstChar = null;

        // Track the last known search type. This is important when executing
        // curated sub-searches on an existing search.
        var lastSearchType = null;

        // Track the last known queryId.
        var lastQueryId = null;

        /**
         * Record the start of a new search.
         */
        $rootScope.$on('Analytics:search-start', function () {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: search-start');
                }

                searchId = stringUtil.guid();

                // No search terms have been entered yet.
                lastKnownFirstChar = null;

                // Haven't chosen a search mode yet.
                searchMode = SearchModeEnum.NONE;

                var payload = {
                    category: 'search',
                    operationType: 'searchStarted',
                    triggeredBy: 'user',
                    triggeredUsing: analyticsService.getTriggeredBy(),
                    searchId: searchId,
                    elementStandardizedName: 'search',
                    elementUiName: 'Search',
                    elementType: 'link',
                    searchType: SearchTypeEnum.PREDICTIVE
                };

                analyticsService.event('selectAction', payload);

                state.setLastSearchStartedEvent(payload);
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * React to a keyup event in the search input field.
         *
         * @param e event
         * @param data Key press event data.
         */
        $rootScope.$on('searchInput:key', function (e, data) {
            try {
                // If search input field is now empty, change the search id.
                if (!data.target.value || data.target.value.length === 0) {
                    searchId = stringUtil.guid();
                    lastKnownFirstChar = null;
                } else {
                    // Search input field is not empty.
                    var searchTerm = data.target.value;

                    // If we don't have a previous first char, capture it now.
                    if (!lastKnownFirstChar) {
                        lastKnownFirstChar = searchTerm[0];
                    }

                    // If the first character has changed, generate a new search id
                    // because the user appears to be searching for something different.
                    else if (lastKnownFirstChar !== searchTerm[0]) {
                            searchId = stringUtil.guid();
                            lastKnownFirstChar = searchTerm[0];
                        }
                }
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * Record the closure of the search dialog.
         */
        $rootScope.$on('Analytics:search-exit', function () {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: search-exit');
                }

                analyticsService.event('searchClosed', {
                    operationType: 'searchClosed',
                    triggeredBy: 'user',
                    searchId: searchId,
                    category: 'search'
                });

                // Reset our search state.
                resetSearchState();
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * React to the user clicking on a recent search result.
         *
         * @param e event
         * @param data Event data for the recent search event.
         */
        $rootScope.$on('Analytics:search-recent-search', function (e, data) {
            try {

                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: search-recent-search', data);
                }

                var payload = {
                    queryId: data.results.queryId,
                    operationType: 'searchEntered',
                    triggeredBy: 'user',
                    searchId: searchId,
                    category: 'search',
                    numberOfSearchResults: 1,
                    searchType: SearchTypeEnum.KEYWORD,
                    searchText: data.results.queryString,
                    results: [data.results.queryString],
                    resultsMs: Math.max(0, Date.now() - state.getSearchStartedTimestamp()),
                    rawData: data // Capture incoming event for future reprocess.
                };

                analyticsService.event('searched', payload);

                // Store this as the last 'searched' event.
                state.setLastSearchedEvent(payload);

                // Record selected search mode in case user selects a result.
                searchMode = SearchModeEnum.RECENT;

                // Update guid after selecting a recent search (per reqs).
                searchId = stringUtil.guid();
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * React to the performance of a search query against the external
         * search service.
         *
         * @param e event
         * @param data Event data for the search, including query and result details.
         */
        $rootScope.$on('Analytics:searched', function (e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: searched', data);
                }

                if (!state.getSearchStartedTimestamp()) {
                    // If this happens, we can still record the search as a
                    // zero-duration search, which will likely be flagged
                    // for further investigation.
                    $log.error('Analytics: state.getSearchStartedTimestamp() is unset.');
                    state.setSearchStartedTimestamp(Date.now());
                }

                // Record selcted search mode.
                searchMode = SearchModeEnum.SUGGESTED;

                // Collect result count and top 5 matches
                var resultCount = 0;
                var topResultNames = [];
                for (var i = 0; i < data.results.length; ++i) {
                    var matchList = data.results[i].results;

                    // Aggregate result count.
                    resultCount += data.results[i].num_results;

                    // Append topResultName count
                    for (var j = 0; j < matchList.length; ++j) {
                        var match = matchList[j];
                        if (topResultNames.length < 5) {
                            topResultNames.push(match.tmsProgramId || match.searchStringMatch);
                        }
                    }
                }

                var payload = {
                    queryId: data.queryId,
                    operationType: 'searchEntered',
                    triggeredBy: 'user',
                    searchId: searchId,
                    category: 'search',
                    numberOfSearchResults: resultCount,
                    searchType: data.isQuickSearch ? SearchTypeEnum.PREDICTIVE : SearchTypeEnum.KEYWORD,
                    searchText: data.params.query,
                    results: topResultNames,
                    resultsMs: Math.max(0, Date.now() - state.getSearchStartedTimestamp()),
                    rawData: data // Capture incoming event for future reprocess.
                };

                // Track the last known search type and query ID.
                lastSearchType = payload.searchType;
                lastQueryId = data.queryId;

                analyticsService.event('searched', payload);

                // Store this as the last 'searched' event.
                state.setLastSearchedEvent(payload);

                // Clear the search start timestamp so we don't accidentally
                // reuse it for a subsequent search. This assumes searches are
                // serialized. (If they're concurrent, this could get reused and
                // we would see artificially short search durations.)
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: Clearing search started timestamp');
                }
                state.setSearchStartedTimestamp(null);
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * React to the performance of a search query against the external
         * search service.
         *
         * @param e event
         * @param data Event data for the search, including query and result details.
         */
        $rootScope.$on('Analytics:sub-search', function (e, data) {
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: sub-search', data);
            }
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: sub-search', data, state);
                }

                if (!state.getSearchStartedTimestamp()) {

                    // If this happens, we can still record the search as a
                    // zero-duration search, which will likely be flagged
                    // for further investigation.
                    $log.error('Analytics: state.getSearchStartedTimestamp() is unset.');
                    state.setSearchStartedTimestamp(Date.now());
                }

                // Collect result count and top 5 matches
                // let resultCount = data.results.length;
                var topResultNames = [];
                var idx = 0;
                while (topResultNames.length < 5 && idx < data.results.length) {

                    var match = data.results[idx];

                    if (match.tmsProgramId) {
                        topResultNames.push(match.tmsProgramIds[0]);
                    } else if (angular.isDefined(match.tmsProgramIds) && Array.isArray(match.tmsProgramIds) && match.tmsProgramIds.length > 0) {
                        topResultNames.push(match.tmsProgramIds[0]);
                    }
                    idx += 1;
                }

                var payload = {
                    operationType: 'searchEntered',
                    triggeredBy: 'user',
                    searchId: searchId,
                    category: 'search',
                    numberOfSearchResults: data.results.length,
                    searchType: lastSearchType,
                    searchText: data.searchText,
                    results: topResultNames,
                    resultsMs: Math.max(0, Date.now() - state.getSearchStartedTimestamp())
                };

                analyticsService.event('searched', payload);

                // Store this as the last 'searched' event.
                payload.rawData = data;
                state.setLastSearchedEvent(payload);

                // Clear the search start timestamp so we don't accidentally
                // reuse it for a subsequent search. This assumes searches are
                // serialized. (If they're concurrent, this could get reused and
                // we would see artificially short search durations.)
                state.setSearchStartedTimestamp(null);
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * React to the issuance of a search query to the external search
         * service. Used to detect the duration before results are returned.
         */
        $rootScope.$on('Analytics:issue-search', function () {
            try {
                state.setSearchStartedTimestamp(Date.now());
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: issue-search. timestamp=' + state.getSearchStartedTimestamp());
                }
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * Receive a selection by the user, which could be a Person, Movie, Series,
         * Team, etc. Propagate as a selectAction or selectContent event as appropriate.
         *
         * @param e event
         * @param data Event data for the selection.
         */
        $rootScope.$on('Analytics:search-select-item', function (e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: search-select-item. searchId=' + searchId + ', started=' + state.getSearchStartedTimestamp(), data);
                }

                data.pageSectionName = data.pageSectionName || 'searchResultsArea';
                data.triggeredUsing = analyticsService.getTriggeredBy();

                // If we don't have a search ID, we need to create one based on the
                // most recent search event. This can happen when the user begins
                // playing a search result, then navigates backs to the result page
                // (via the browser back button) and selects another asset.
                if (!searchId) {
                    replayPastSearchEvents(data.asset.dsQueryId);
                }

                if (!data.asset.resultDisplay || ['Title', 'Movie', 'Series'].indexOf(data.asset.resultDisplay) >= 0) {
                    $rootScope.$emit('Analytics:selectContent', data);
                } else {
                    curatedSelectAction(data, data.asset.resultDisplay);

                    if (data.generateSelectContent && data.asset.tmsProgramId) {
                        $rootScope.$emit('Analytics:selectContent', data);
                    }
                }
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        });

        /**
         * We've received a search-select event after our search context was
         * discarded. To compensate, we'll create a new search context here,
         * based on the last known search.
         *
         * @param newQueryId The queryId used for the incoming selected item or content.
         *
         */
        function replayPastSearchEvents(newQueryId) {
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: replayPastSearchEvents()');
            }

            var searchStarted = angular.copy(state.getLastSearchStartedEvent());
            var searched = angular.copy(state.getLastSearchedEvent());

            if (!searchStarted || !searched) {
                $log.error('Analytics: Prior search events not found');
                return;
            }

            // Update events with new searchId.
            searchId = stringUtil.guid();

            searchStarted.searchId = searchId;
            searchStarted.triggeredBy = 'application';
            searchStarted.triggeredUsing = 'backButton';
            analyticsService.event('selectAction', searchStarted);

            searched.searchId = searchId;
            searched.queryId = newQueryId;
            searched.triggeredBy = 'application';
            searched.triggeredUsing = 'backButton';
            analyticsService.event('searched', searched);
        }

        /**
         * Clear the search state.
         */
        function resetSearchState() {
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: search:resetSearchState');
            }

            searchId = null;
            searchMode = SearchModeEnum.NONE;
            state.setSearchStartedTimestamp(null);
            lastKnownFirstChar = null;
            lastSearchType = null;
            lastQueryId = null;
        }

        /**
         * React to a Analytics:search-reset event by clearing the search state.
         */
        $rootScope.$on('Analytics:search-reset', function (e) {
            if (analyticsService.isDebug()) {
                $log.debug('Analytics: search-reset', e);
            }

            resetSearchState();
        });

        /**
         * Publish a selectAction event to indicate the user chose
         * to refine their search by person, sports, or other category.
         *
         * @param data Data about the user's selection.
         */
        function curatedSelectAction(data, category) {
            try {

                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: curatedSelectAction', data, category);
                }

                // Capture result facet. Does not exist for DVR recordings.
                var selectedResultFacet = data.asset.resultDisplay && data.asset.resultDisplay.toLowerCase() || null;
                var payload = {
                    category: 'search',
                    triggeredBy: 'user',
                    triggeredUsing: analyticsService.getTriggeredBy(),
                    operationType: 'unknown',
                    searchId: searchId,
                    elementStandardizedName: 'search',
                    elementUiName: 'Search',
                    elementType: 'link',
                    selectedResultName: data.asset.title,
                    selectedResultFacet: selectedResultFacet,
                    queryId: data.asset.dsQueryId,
                    elementIndex: data.asset.searchResultIndex
                };

                if (category) {
                    if (category === 'Person') {
                        payload.operationType = 'curatedSearchCastAndCrew';
                        payload.selectedResultFacet = 'person';
                    } else if (category === 'Sports') {
                        payload.operationType = 'curatedSearchSports';
                        payload.selectedResultFacet = 'sports';
                    } else if (category === 'Team') {
                        payload.operationType = 'curatedSearchTeam';
                        payload.selectedResultFacet = 'team';
                    } else if (category === 'Networks') {
                        payload.operationType = 'curatedSearchNetworks';
                        payload.selectedResultFacet = 'network';
                    }
                }

                analyticsService.event('selectAction', payload);
            } catch (ex) {
                $log.error('Analytics: search error', ex);
            }
        }

        return {};
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/search.js.map
