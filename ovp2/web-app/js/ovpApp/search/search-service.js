(function () {
    'use strict';
    angular.module('ovpApp.search.searchService', [
        'ovpApp.services.entry',
        'ovpApp.services.ovpStorage',
        'ovpApp.config',
        'ovpApp.services.rxUtils',
        'rx'
    ])
    .factory('searchService', searchService);

    /* @ngInject */
    function searchService($http, $q, $timeout, $rootScope, config, entryService,
        ovpStorage, storageKeys, rx, rxhttp) {

        let service = {
            stripInvalidCharacters,
            getComponentResults,
            getSubResultsByUri,
            getSubResultsByQueryAndCategory,
            getActorResults,
            getDirectorResults,
            getRelatedByTmsProgramId,
            getRelatedByTmsSeriesId,
            getRecentSearches,
            saveRecentSearch,
            clearRecentSearches,
            doNotRedirect: false
        };

        return service;

        ///////////////

        function stripInvalidCharacters(searchString = '') {
            return searchString
                .replace(/[^ 0-9a-zA-Z\-&ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]/gi, '') // jshint ignore:line
                .toLowerCase();
        }

        function findCategory(data, categoryName) {
            categoryName = categoryName.toLowerCase();
            return data.results.find(category => category.title.toLowerCase() == categoryName);
        }

        function findItem(data, searchString, categoryName) {
            let categories, match;
            if (data) {
                searchString = stripInvalidCharacters(searchString);
                if (categoryName) {
                    let cat = findCategory(data, categoryName);
                    if (cat) {
                        categories = [cat];
                    }
                }
                if (!categories) {
                    categories = data.results;
                }

                categories.forEach(category =>
                    match = category.results.find(val =>
                        searchString == stripInvalidCharacters(val.searchStringMatch)));
            }
            return match;
        }

        /**
         * Executes a search, and returns results separated into different components. For example,
         * There may be some "title" results, some "person" results, some "sports" results, etc.
         * @param  {string} searchString
         * @return {Observable} An observable which will emit the result of the search
         */
        function getComponentResults(searchString) {
            searchString = encodeURIComponent(stripInvalidCharacters(searchString));
            return rx.Observable.fromPromise(entryService.forDefaultProfile())
                .flatMap(function (services) {
                    let url = config.piHost + services.componentSearch.searchString(searchString);
                    return rxhttp.get(url, {withCredentials: true})
                        .map(response => {

                            // Analytics: Propagate queryId and resultIndex to each result.
                            if (angular.isDefined(response.data.results)) {
                                let resultArrays = response.data.results;
                                for (var i = 0; i < resultArrays.length; ++i) {
                                    populateSearchAnalytics(resultArrays[i]);
                                }
                            }

                            return response.data;
                        });
                });
        }


        /**
         * Find results underneath a top level search, using the uri found by a previous
         * top level search. If you have not done a top level search and thus don't
         * know the uri, use getSubResultsByQueryAndCategory instead.
         * @param  {string} uri uri to use
         * @return {observable}
         */
        function getSubResultsByUri(uri) {
            $rootScope.$emit('Analytics:issue-search');
            return rxhttp.get(config.piHost + uri, {withCredentials: true})
                .map(response => {
                    populateSearchAnalytics(response.data);
                    return response.data;
                });
        }

        function getActorResults(personid, tmsid) {
            return rx.Observable.fromPromise(entryService.forDefaultProfile())
                .flatMap(function (services) {
                    let url = config.piHost + services.actor.tmsProviderProgramID_tmsPersonID(tmsid, personid);
                    return rxhttp.get(url, {withCredentials: true})
                        .map(response => {
                            populateSearchAnalytics(response.data);
                            return response.data;
                        });
                });
        }

        function getDirectorResults(personid, tmsid) {
            return rx.Observable.fromPromise(entryService.forDefaultProfile())
                .flatMap(function (services) {
                    let url = config.piHost + services.director.tmsProviderProgramID_tmsPersonID(tmsid, personid);
                    return rxhttp.get(url, {withCredentials: true})
                        .map(response => {
                            populateSearchAnalytics(response.data);
                            return response.data;
                        });
                });
        }

        /**
         * Find results underneath a top level search, but having never actually done the
         * top level search. If you've done a top level search and thus know the uri for the
         * subsearch, use getSubResultsByUri() instead.
         * @param {string} query string to search for
         * @param {string} (optional) a category in which to look. only results in the specified
         *         category will be checked. You can omit this if you want, but it is
         *         possible for there to be matches in multiple categories, and no
         *         guarantee is provided on which one will be selected.
         * @return {observable}
         */
        function getSubResultsByQueryAndCategory(searchString, category) {
            return getComponentResults(searchString)
                .map(data => findItem(data, searchString, category))
                .flatMap(item => item ? getSubResultsByUri(item.uri) : rx.Observable.just([]));
        }

        function saveRecentSearch(searchString) {
            let recentSearches = getRecentSearches();
            let i = recentSearches.indexOf(searchString),
                limit = 10; //TODO: limit should come from activityconfig
            if (i >= 0) {
                recentSearches.splice(i, 1);
            }
            recentSearches.unshift(searchString);
            if (recentSearches.length > limit) {
                recentSearches.pop();
            }
            ovpStorage.setItem(storageKeys.recentSearches, recentSearches);
        }

        function getRecentSearches() {
            return ovpStorage.getItem(storageKeys.recentSearches) || [];
        }

        function clearRecentSearches() {
            ovpStorage.setItem(storageKeys.recentSearches, []);
        }

        function getRelatedByTmsProgramId(tmsProgramId) {
            if (!tmsProgramId) {
                return rx.Observable.throw('tmsProgramId is null');
            } else {
                return rx.Observable.fromPromise(entryService.forDefaultProfile())
                    .flatMap(function (services) {
                        let url = config.piHost + services.similarTo.tmsProviderProgramID(tmsProgramId);
                        return rxhttp.get(url, {withCredentials: true})
                            .map(response => response.data);
                    });
            }
        }

        function getRelatedByTmsSeriesId(tmsSeriesId) {
            if (!tmsSeriesId) {
                return rx.Observable.throw('tmsSeriesId is null');
            } else {
                return rx.Observable.fromPromise(entryService.forDefaultProfile())
                    .flatMap(function (services) {
                        let url = config.piHost + services.similarTo.tmsSeriesID(tmsSeriesId);
                        return rxhttp.get(url, {withCredentials: true})
                            .map(response => response.data);
                    });
            }
        }

        /**
         * Given a search response containing an array of results, propagate the
         * queryId, resultIndex, and searchFacet ("type of search") to each result.
         *
         * @param result An updateable search result object containing an array
         *               of results, as well as additional data relevant to this
         *               search.
         */
        function populateSearchAnalytics(result) {
            // Do nothing if we're missing required fields.
            if (!angular.isDefined(result.results) || !Array.isArray(result.results)) {
                return;
            }

            let searchFacet = (result.title ? result.title.toLowerCase() : '');

            for (var i = 0; i < result.results.length; ++i) {
                result.results[i].dsQueryId = result.dsQueryId;
                result.results[i].searchResultIndex = i;
                result.results[i].searchFacet = searchFacet;
            }
        }

    } // end search service function
}()); // end IIFE
