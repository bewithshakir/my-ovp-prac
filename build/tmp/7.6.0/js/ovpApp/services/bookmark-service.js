'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';

    /**
     * RecentlyWatched service
     * Fetch recently watched assets from the bookmark service and then pull in the
     * reset of the required data to display the assets.
     */
    BookmarkService.$inject = ["config", "$http", "$q", "$log", "NNSService", "parentalControlsService", "$rootScope", "$timeout", "rx", "SplunkService"];
    angular.module('ovpApp.services.bookmark', ['ovpApp.config', 'ovpApp.services.nns', 'ovpApp.services.parentalControlsService', 'ovpApp.services.rxUtils', 'ovpApp.services.splunk']).factory('BookmarkService', BookmarkService);

    /* @ngInject */
    function BookmarkService(config, $http, $q, $log, NNSService, parentalControlsService, $rootScope, $timeout, rx, SplunkService) {
        var bookmarks = [],
            watches = [],
            globalBookmarksUrl = config.piHost + config.smartTvApi + config.vod.globalBookmarks,
            watchlistUrl = config.piHost + config.smartTvApi + config.watchlist,
            hasBookmarkToSet = false,
            // flag to indicate whether there is a pending bookmark to be send to server
        bookMark = null,
            // actual bookmark to be set
        bookmarkAssetId = null,
            postBookmarkUrlBase = globalBookmarksUrl + '/',
            postCdvrBookmarkUrlBase = config.piHost + config.smartTvApi + config.smartTv.cdvrBookmark + '/',
            postBookmarkUrl = undefined,
            // initialized with proper AssetID in init
        postBookmarkInterval = 60000,
            // TODO hardcoded to 1 min, will be configurable from Activity.Config
        postImmediateBookmarkInterval = 5000,
            invalidAsset = false,
            postBookmark$ = new rx.Subject();

        var service = {
            activate: activate,
            getBookmarks: getBookmarks,
            updateBookmark: updateBookmark,
            deleteFromInProgressList: deleteFromInProgressList,
            clearInProgressList: clearInProgressList,
            getBookmarkByTmsProgramId: getBookmarkByTmsProgramId,
            getBookmarkByTmsSeriesId: getBookmarkByTmsSeriesId,
            getBookmarkByProviderAssetId: getBookmarkByProviderAssetId,

            getWatchLaters: getWatchLaters,
            addToWatchLater: addToWatchLater,
            deleteFromWatchLater: deleteFromWatchLater,
            clearWatchLater: clearWatchLater,
            getWatchLaterByTmsProgramIds: getWatchLaterByTmsProgramIds,
            getWatchLaterByTmsSeriesId: getWatchLaterByTmsSeriesId,

            setAssetToBookmark: setAssetToBookmark,
            setCdvrToBookmark: setCdvrToBookmark,
            setBookmark: setBookmark,
            getBookmark: getBookmark,

            _private: {
                // exposed for unit testing
                throttlePostingBookmarks: throttlePostingBookmarks
            }
        };

        return service;

        ///////////////////////

        function activate() {
            getBookmarks();
            getWatchLaters();

            var streams = throttlePostingBookmarks({
                stream: postBookmark$,
                shortThrottle: postImmediateBookmarkInterval,
                longThrottle: postBookmarkInterval,
                excessiveThreshold: 5
            });

            streams.postBookmark$.subscribe(postBookmark);
            streams.excessive$.subscribe(onExcessiveBookmarks);
        }

        /**
         * Applies two levels of throttling to a stream. Truthy emissions are throttled
         * with the shortThrottle value, falsy emissions are throttled with the long.
         * @param {Object} options
         * @param {Observable} options.stream source stream
         * @param {Number} options.shortThrottle throttle duration to apply to truthy values
         * @param {Number} options.longThrottle throttle duration to apply to falsy values
         * @param {Number} options.excessiveThreshold number of throttled immediate events to
         *    treat as "excessive"
         * @param {*} options.scheduler Allows unit tests to define a scheduler. for normal use,
         *    this should be undefined.
         */
        function throttlePostingBookmarks(_ref) {
            var stream = _ref.stream;
            var shortThrottle = _ref.shortThrottle;
            var longThrottle = _ref.longThrottle;
            var excessiveThreshold = _ref.excessiveThreshold;
            var scheduler = _ref.scheduler;

            // Most bookmarks updates can be sent at a leisurly pace
            var throttled$ = stream.filter(function (immediate) {
                return !immediate;
            }).throttle(longThrottle, scheduler);
            // Some come from important events, such as stopping or jumping and should be sent
            // more or less immediately. We still have a short throttle to prevent the possibility
            // of spamming the server if immediate bookmarks are invoked in rapid succession
            var immediate$ = stream.filter(function (immediate) {
                return !!immediate;
            }).share();
            var throttledImmediate$ = immediate$.throttle(shortThrottle, scheduler).share();

            return {
                postBookmark$: rx.Observable.merge(throttled$, throttledImmediate$),
                excessive$: throttledImmediate$.flatMap(function () {
                    return immediate$.timestamp(scheduler).takeUntil(throttledImmediate$).toArray();
                }).filter(function (throttled) {
                    return throttled.length >= excessiveThreshold;
                })
            };
        }

        function getBookmarkByTmsProgramId(tmsProgramId) {
            return bookmarks.find(function (b) {
                return b.tmsProgramId == tmsProgramId;
            });
        }

        function getBookmarkByTmsSeriesId(tmsSeriesId) {
            return bookmarks.find(function (b) {
                return b.tmsSeriesId == tmsSeriesId;
            });
        }

        function getBookmarkByProviderAssetId(providerAssetId) {
            return bookmarks.find(function (b) {
                return b.providerAssetId == providerAssetId;
            });
        }

        function getWatchLaterByTmsProgramIds(tmsProgramIds) {
            return watches.find(function (a) {
                return tmsProgramIds.find(function (b) {
                    return b == a.tmsProgramId;
                });
            });
        }

        function getWatchLaterByTmsSeriesId(tmsSeriesId) {
            return watches.find(function (b) {
                return b.tmsSeriesId == tmsSeriesId;
            });
        }

        function replaceArrayContents(arrayRef, newContents) {
            arrayRef.splice.apply(arrayRef, [0, arrayRef.length].concat(_toConsumableArray(newContents)));
        }

        function getBookmarks() {
            //TODO: cache the result
            return get(globalBookmarksUrl).then(function (b) {
                replaceArrayContents(bookmarks, b);
                return bookmarks;
            });
        }

        function getWatchLaters() {
            //TODO: cache the result
            return get(watchlistUrl, config.watchListParameters).then(function (w) {
                replaceArrayContents(watches, w);
                return watches;
            });
        }

        function get(url, params) {
            return $http.get(url, {
                withCredentials: true,
                params: params
            }).then(function (response) {
                return response && response.data && response.data.result || [];
            });
        }

        /**
         * Take an asset object and append it to the currect watch list
         * @param  {asset} a series datadelegate or a movie datadelegate
         * @return {promise}      promise
         */
        function addToWatchLater(asset) {
            var appendUrl;
            if (!asset) {
                throw 'Error appending asset to watchlist, missing data';
            }

            appendUrl = asset.tmsSeriesId ? '/series/' + asset.tmsSeriesId : '/assets/' + asset.watchListProviderAssetId;

            $rootScope.$emit('watchlater:add', asset);

            return $http({
                url: watchlistUrl + appendUrl,
                method: 'POST',
                withCredentials: true,
                data: {}
            }).then(function () {
                $timeout(function () {
                    getWatchLaters();
                });
            });
        }

        /**
         * Delete a specific item from the watchlist, this should automatically
         * determine the correct url, and
         * @param  {object} asset asset with assetId or tmsSeriesId set
         * @return {promise}       A promise to resolve when the call is finished
         */
        function deleteFromWatchLater(asset) {
            if (!asset) {
                return;
            }
            var watch = undefined,
                deleteUrl = undefined,
                index = -1;

            if (asset.tmsSeriesId) {
                watch = getWatchLaterByTmsSeriesId(asset.tmsSeriesId);
            } else if (asset.tmsProgramIds) {
                watch = getWatchLaterByTmsProgramIds(asset.tmsProgramIds);
            }

            $rootScope.$emit('watchlater:delete', asset);

            if (watch) {
                deleteUrl = watch.tmsSeriesId ? '/series/' + watch.tmsSeriesId : '/assets/' + watch.providerAssetId;

                index = watches.indexOf(watch);
                watches.splice(index, 1);

                return $http({
                    url: watchlistUrl + deleteUrl,
                    method: 'DELETE',
                    withCredentials: true,
                    data: {}
                })['catch'](function (error) {
                    $log.warn('Unable to remove from the watchlist ' + error);
                    watches.splice(index, 0, watch);
                });
            }
        }

        /**
         * Clear everything in the watchlist
         * @return {promise} A promise that resolves when the request is complete
         */
        function clearWatchLater() {
            replaceArrayContents(watches, []);
            $rootScope.$emit('watchlater:clear');

            return $http({
                url: watchlistUrl,
                method: 'DELETE',
                withCredentials: true,
                data: {}
            });
        }

        /**
         * "Deletes" an asset from the In Progress list, this actually just
         * sets the show to hidden.
         * @param  {object} asset
         * @return {promise}
         */
        function deleteFromInProgressList(asset) {
            if (!asset) {
                return;
            }

            var bm = [],
                providerAssetIds = [];
            var programIds = asset.tmsProgramIds || (asset.tmsProgramId ? [asset.tmsProgramId] : undefined);

            //If the delegate has an bookmark set use that to make sure we are getting the correct
            //tmsProgramId (since we might have multiple)
            if (asset.bookmark) {
                programIds = [asset.bookmark.tmsProgramId];
            }

            if (asset.tmsSeriesId) {
                bm = bookmarks.filter(function (b) {
                    return b.tmsSeriesId == asset.tmsSeriesId;
                });
            } else if (programIds) {
                bm = bookmarks.filter(function (b) {
                    return programIds.includes(b.tmsProgramId);
                });
            }

            $rootScope.$emit('inprogress:delete', asset);
            if (bm.length > 0) {
                bm.forEach(function (b) {
                    b.hidden = true;
                    providerAssetIds.push(b.providerAssetId);
                });
                return sendHideBookmarksMessage(providerAssetIds);
            } else {
                return $q.resolve();
            }
        }

        function sendHideBookmarksMessage(providerAssetIds) {
            return $http({
                url: globalBookmarksUrl + '/hidden',
                method: 'POST',
                withCredentials: true,
                data: { providerAssetIds: providerAssetIds }
            }).then(function (results) {
                if (results.failedAssetIds && results.failedAssetIds.length > 0) {
                    throw 'Unable to remove some items from the Recently Watched List';
                }
                return results;
            });
        }

        /**
         * "Clears" everything in the inprogress list. They are actually just
         * set to be hidden.
         * @return {promise} A promise that resolves when the request is complete
         */
        function clearInProgressList() {
            var providerAssetIds = [];
            bookmarks.forEach(function (b) {
                b.hidden = true;
                providerAssetIds.push(b.providerAssetId);
            });
            $rootScope.$emit('inprogress:clear');

            return sendHideBookmarksMessage(providerAssetIds);
        }

        /**
         * Use this when the bookmark has been saved elsewhere, i.e. recentlyPlayedCollection
         * and must be kept in sync
         * @param  {object} bookmarkResult  an object from the bookmark service
         * @return {boolean}                bookmark was updated
         */
        function updateBookmark(bookmarkResult) {
            if (bookmarkResult && bookmarkResult.tmsProgramId) {
                var currentBookmark = getBookmarkByTmsProgramId(bookmarkResult.tmsProgramId);
                if (currentBookmark) {
                    //Overwrite the bookmark with updated data
                    for (var key in currentBookmark) {
                        if (currentBookmark.hasOwnProperty(key) && bookmarkResult.hasOwnProperty(key)) {
                            currentBookmark[key] = bookmarkResult[key];
                        }
                    }
                    return true;
                } else {
                    bookmarks.unshift(bookmarkResult);
                    $rootScope.$emit('inprogress:add', bookmarkResult);
                    return true;
                }
            }
            return false;
        }

        function setAssetToBookmark(assetId) {
            hasBookmarkToSet = false;
            invalidAsset = false;
            bookMark = null;
            bookmarkAssetId = assetId;
            postBookmarkUrl = postBookmarkUrlBase + bookmarkAssetId;
        }

        function setCdvrToBookmark(assetId) {
            hasBookmarkToSet = false;
            invalidAsset = false;
            bookMark = null;
            bookmarkAssetId = assetId;
            postBookmarkUrl = postCdvrBookmarkUrlBase + bookmarkAssetId;
        }

        /*
         * Posting a bookmark right away or starting a timer for the same
         *
         * @param {string} reason for posting right away. If truthy, it will be posted immediately-ish.
         *    If falsy, it will be enqueued for eventual posting.
         * @param {number} playerMarker current playing position of the asset in seconds
         * @param {number} total playable duration of the asset in seconds
         */
        function setBookmark(postRightAway, playerMarker, entertainmentMarker, runTime) {
            if (!invalidAsset) {
                //bookmark values to be set, if they are defined.
                if (typeof playerMarker !== 'undefined' && typeof entertainmentMarker != 'undefined') {
                    if (typeof runTime === 'undefined' && bookMark) {
                        runTime = bookMark.runtime;
                    }
                    hasBookmarkToSet = true;
                    bookMark = {
                        playMarker: playerMarker,
                        entertainmentPlayMarker: entertainmentMarker,
                        runtime: runTime
                    };
                }

                postBookmark$.onNext(hasBookmarkToSet && postRightAway);
            }
        }

        /**
         * Get the most recent bookmark
         * @return {object} bookmark object
         */
        function getBookmark() {
            return bookMark;
        }

        /*
         * This function will post bookmark data.
         */
        function postBookmark() {
            if (hasBookmarkToSet) {
                hasBookmarkToSet = false;

                return $http({
                    method: 'POST',
                    url: postBookmarkUrl,
                    data: JSON.stringify(bookMark),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    dataType: 'json'
                }).then(function (bookmarkResult) {
                    var result = {};
                    if (bookmarkResult && bookmarkResult.data.result && bookmarkResult.data.result.length > 0) {
                        result = bookmarkResult.data.result[0];
                        onBookmarkUpdated(bookmarkAssetId, bookMark, result);
                    }
                }, function (obj) {
                    if (obj.status && obj.status == 404) {

                        //asset expired on catalog.
                        invalidAsset = true;
                    }
                });
            }
        }

        // To try to find the root cause of STVWEB-553, we are logging to splunk when we encounter
        //   an excessive number of attempts to post the bookmark immediately.
        function onExcessiveBookmarks(events) {
            SplunkService.sendCustomMessage({
                type: 'excessiveBookmarks',
                data: events
            }, 'ERROR');
        }

        function onBookmarkUpdated(assetId, bookmark, bookmarkResult) {
            if (bookmarkResult) {
                if (bookmarkResult.complete) {
                    updateBookmark(bookmarkResult);
                    deleteFromInProgressList(bookmarkResult);
                } else {
                    updateBookmark(bookmarkResult);
                }
            }
        }
    } // end watchlist service funciton
})(); // end iife
//# sourceMappingURL=../../maps-babel/ovpApp/services/bookmark-service.js.map
