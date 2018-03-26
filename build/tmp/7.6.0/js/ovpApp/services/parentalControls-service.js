/* globals md5 */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';

    parentalControlsService.$inject = ["$http", "$q", "config", "ovpStorage", "storageKeys", "$window", "TV_RATINGS", "MOVIE_RATINGS", "TV_RATINGS_TYPE", "MOVIE_RATINGS_TYPE", "DEFAULT_MOVIE_RATING", "DEFAULT_TV_RATING", "$timeout", "$rootScope", "PC_BLOCK_REASON", "createObservableFunction", "profileService"];
    angular.module('ovpApp.services.parentalControlsService', ['ovpApp.config', 'ovpApp.services.ovpStorage', 'ovpApp.services.rxUtils', 'ovpApp.services.profileService']).constant('TV_RATINGS', ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA']).constant('MOVIE_RATINGS', ['G', 'PG', 'PG-13', 'R', 'NC-17', 'ADULT'
    //'NR'
    ]).constant('TV_RATINGS_TYPE', 'TVRatings').constant('MOVIE_RATINGS_TYPE', 'MovieRatings').constant('DEFAULT_TV_RATING', 'TV-PG').constant('DEFAULT_MOVIE_RATING', 'PG-13').constant('PC_BLOCK_REASON', {
        rating: 'rating',
        channel: 'channel'
    }).constant('PC_UNBLOCK_REASON', {
        settings: 'settings'
    }).factory('parentalControlsService', parentalControlsService);

    /* @ngInject */
    function parentalControlsService($http, $q, config, ovpStorage, storageKeys, $window, TV_RATINGS, MOVIE_RATINGS, TV_RATINGS_TYPE, MOVIE_RATINGS_TYPE, DEFAULT_MOVIE_RATING, DEFAULT_TV_RATING, $timeout, $rootScope, PC_BLOCK_REASON, createObservableFunction, profileService) {

        var getPcDeferred,
            loggedInUsername = null,
            adminUsername = null,
            channelsDefer = null,
            ratingsDefer = null,
            service = {
            getParentalControlsForUser: function getParentalControlsForUser() {
                if (!getPcDeferred) {
                    getPcDeferred = $q.defer();
                    return $http({
                        method: 'GET',
                        url: config.parentalControls.parentalControlsForUserUrl(),
                        withCredentials: true
                    }).then(function (response) {
                        var data = response.data;
                        loggedInUsername = data.loggedInUsername;
                        adminUsername = data.adminUsername;
                        getPcDeferred.resolve(data);
                    }, function (error) {
                        getPcDeferred.reject(error);
                        getPcDeferred = null;
                    });
                }
                return getPcDeferred.promise;
            },
            getRatingsForUser: function getRatingsForUser() {
                if (!ratingsDefer) {
                    ratingsDefer = $q.defer();
                    service.getParentalControlsForUser().then(function () {
                        return $http({
                            method: 'GET',
                            url: config.parentalControls.parentalControlsByRatingUrl(),
                            withCredentials: true
                        }).then(function (response) {
                            //BLATENT Hack to remove NR
                            var ratings = response.data,
                                movieRatings = ratings.parentalControls.MovieRatings,
                                nrIndex = movieRatings.findIndex(function (r) {
                                return r.rating === 'NR';
                            });

                            if (nrIndex > -1) {
                                ratings.parentalControls.MovieRatings.splice(nrIndex, 1);
                            }
                            //END BLATENT HACK
                            ratingsDefer.resolve(ratings);
                        }, function (error) {
                            ratingsDefer.reject(error);
                            ratingsDefer = null;
                        });
                    });
                }
                return ratingsDefer.promise;
            },
            updateRatingForUser: function updateRatingForUser(json) {
                var _this = this;

                return $http({
                    method: 'PUT',
                    url: config.parentalControls.parentalControlsByRatingUrl(),
                    data: JSON.stringify(json),
                    withCredentials: true,
                    contentType: 'application/json'
                }).then(function () {
                    ratingsDefer = null;
                    return _this.getRatingsForUser().then(function () {
                        $rootScope.$emit('ParentalControls:updated');
                    });
                });
            },
            getLoggedInUsername: function getLoggedInUsername() {
                return service.getParentalControlsForUser().then(function () {
                    return loggedInUsername;
                });
            },
            setDefaultRatings: function setDefaultRatings() {
                return this.unblockRating(DEFAULT_MOVIE_RATING, DEFAULT_TV_RATING);
            },
            isPrimaryAccount: function isPrimaryAccount() {
                return service.getParentalControlsForUser().then(function () {
                    return loggedInUsername === adminUsername;
                });
            },
            getParentalControlsDomainKey: function getParentalControlsDomainKey() {
                return service.getLoggedInUsername().then(function (username) {
                    return 'ovpApp.pc.' + username;
                });
            },
            clearAllChannelBlocks: function clearAllChannelBlocks() {
                return this.updateParentalControlsByChannel([]);
            },
            isParentalControlsDisabledForClient: function isParentalControlsDisabledForClient() {
                var disabled = ovpStorage.getItem(storageKeys.parentalControlsDisabled);
                // May be undefined or false
                if (!disabled) {
                    disabled = false;
                }
                if (profileService.isSpecUOrBulkMDU()) {
                    return $q.resolve(true);
                } else {
                    return this.isPINSet().then(function (hasSavedPin) {
                        return disabled || !hasSavedPin; // disable parental controls if no pin is set
                    });
                }
            },
            isBlocked: function isBlocked(ratings, tmsGuideServiceIds, providerIds) {
                var _this2 = this;

                var rating,
                    guide,
                    provider,
                    blockResponse = {
                    isBlocked: false,
                    reason: null
                };

                return this.isParentalControlsDisabledForClient().then(function (isDisabled) {
                    if (isDisabled) {
                        return blockResponse;
                    } else {
                        if (ratings && ratings.length) {
                            rating = _this2.isBlockedByRating(ratings);
                        } else {
                            rating = false;
                        }

                        if (tmsGuideServiceIds && tmsGuideServiceIds.length) {
                            guide = _this2.isChannelBlockedByTmsGuideServiceId(tmsGuideServiceIds);
                        } else {
                            guide = false;
                        }

                        if (providerIds && providerIds.length) {
                            provider = _this2.isChannelBlockedByProviderIds(providerIds);
                        } else {
                            provider = false;
                        }

                        return $q.all([rating, guide, provider]).then(function (blocks) {
                            var _blocks = _slicedToArray(blocks, 3);

                            var isRatingBlocked = _blocks[0];
                            var isGuideIdBlocked = _blocks[1];
                            var isProviderIdBlocked = _blocks[2];

                            if (isRatingBlocked) {
                                blockResponse.isBlocked = true;
                                blockResponse.reason = PC_BLOCK_REASON.rating;
                            } else if (isGuideIdBlocked || isProviderIdBlocked) {
                                blockResponse.isBlocked = true;
                                blockResponse.reason = PC_BLOCK_REASON.channel;
                            }
                            return blockResponse;
                        });
                    }
                });
            },

            disableParentalControlsForClient: function disableParentalControlsForClient() {
                ovpStorage.setItem(storageKeys.parentalControlsDisabled, true);
                $rootScope.$emit('ParentalControls:updated');

                // TODO: Analytics Event
                // $rootScope.$emit('EG:settingParentalControlsToggled', {
                //     enabled: false
                // });
            },
            enableParentalControlsForClient: function enableParentalControlsForClient() {
                ovpStorage.setItem(storageKeys.parentalControlsDisabled, false);
                $rootScope.$emit('ParentalControls:updated');

                // TODO: Analytics Event
                // $rootScope.$emit('EG:settingParentalControlsToggled', {
                //     enabled: true
                // });
            },
            hasChannelBlockingEnabled: function hasChannelBlockingEnabled() {
                // TBD check callers and change to synchronous
                return $q.resolve(!!ovpStorage.getItem(storageKeys.parentalControlsChannelEnabled));
            },
            clearSession: function clearSession() {
                // TBD check callers and change to synchronous
                return $q.resolve(ovpStorage.removeItem(storageKeys.parentalControlsUnlocked));
            },
            savePINLocally: function savePINLocally(pin) {
                return $q.resolve(ovpStorage.setItem(storageKeys.parentalControlsLocalPin, md5(pin)));
            },
            getLocalPin: function getLocalPin() {
                return $q.resolve(ovpStorage.getItem(storageKeys.parentalControlsLocalPin));
            },
            createRatingsUpdateJson: function createRatingsUpdateJson(movieRating, tvRating) {
                var unblockedMovieRatingIndex = MOVIE_RATINGS.indexOf(movieRating),
                    unblockedTvRatingIndex = TV_RATINGS.indexOf(tvRating),
                    ratingsJson = {
                    parentalControls: {
                        blockedTVRatings: [],
                        blockedMovieRatings: [],
                        blockUnrated: false
                    }
                };

                for (var i = unblockedMovieRatingIndex + 1; i < MOVIE_RATINGS.length; i++) {
                    ratingsJson.parentalControls.blockedMovieRatings.push(MOVIE_RATINGS[i]);
                }

                for (i = unblockedTvRatingIndex + 1; i < TV_RATINGS.length; i++) {
                    ratingsJson.parentalControls.blockedTVRatings.push(TV_RATINGS[i]);
                }
                return ratingsJson;
            },
            compareRatingOrdinalLevel: function compareRatingOrdinalLevel(ratingA, ratingB) {
                //compare the ratings and return -1 if rating a is
                //less than b,0 if equal and 1 otherwise
                //Array.sort compatible for a list of rating strings
                var idxA = TV_RATINGS.indexOf(ratingA),
                    idxB = TV_RATINGS.indexOf(ratingB);
                if (idxA < 0 || idxB < 0) {
                    idxA = MOVIE_RATINGS.indexOf(ratingA);
                    idxB = MOVIE_RATINGS.indexOf(ratingB);
                }
                if (idxA < 0 || idxB < 0) {
                    throw 'Unable to determine rating system: ' + ratingA + ', ' + ratingB;
                }
                return idxA < idxB ? idxA === idxB ? 0 : -1 : 1;
            },
            sortRatingList: function sortRatingList(ratings) {
                //In place sort
                return ratings.sort(this.compareRatingOrdinalLevel);
            },
            getHighestRatingFromList: function getHighestRatingFromList(ratings) {
                return this.sortRatingList(ratings.slice()).pop();
            },
            getHighestUnblockedRatingByType: function getHighestUnblockedRatingByType(type) {
                return this.getRatingsForUser().then(function (ratings) {
                    var ratingsByType = ratings.parentalControls[type],
                        i;
                    for (i = 0; i < ratingsByType.length; i++) {
                        if (config.getBool(ratingsByType[i].blocked)) {
                            break;
                        }
                    }
                    if (i === 0) {
                        return '';
                    } else {
                        return ratingsByType[i - 1].rating;
                    }
                });
            },
            unblockRating: function unblockRating(movieRating, tvRating) {
                return this.updateRatingForUser(this.createRatingsUpdateJson(movieRating, tvRating));
            },
            isBlockedByRating: function isBlockedByRating(ratings) {
                var _this3 = this;

                if (!angular.isArray(ratings)) {
                    ratings = [ratings];
                }
                var promises = [];
                ratings.forEach(function (tvOrMovieRating) {
                    var isTvRating = TV_RATINGS.includes(tvOrMovieRating);
                    var isMovieRating = MOVIE_RATINGS.includes(tvOrMovieRating);
                    if (isTvRating) {
                        promises[promises.length] = _this3.isTvShowBlockedByRating(tvOrMovieRating);
                    } else if (isMovieRating) {
                        promises[promises.length] = _this3.isMovieBlockedByRating(tvOrMovieRating);
                    } else {
                        var defer = $q.defer();
                        defer.resolve(false);
                        promises[promises.length] = defer.promise;
                    }
                });

                return $q.all(promises).then(function (results) {
                    return results.every(function (r) {
                        return r;
                    });
                });
            },
            isMovieRating: function isMovieRating(rating) {
                return MOVIE_RATINGS.includes(rating);
            },
            isTvShowBlockedByRating: function isTvShowBlockedByRating(rating) {
                return service.isParentalControlsDisabledForClient().then(function (value) {
                    if (value) {
                        return false;
                    } else {
                        return service.getUnblockedTvRating().then(function (currentUnBlockedRating) {
                            if (!currentUnBlockedRating) {
                                return true;
                            } else {
                                if (TV_RATINGS.indexOf(rating) > -1 && TV_RATINGS.indexOf(currentUnBlockedRating) > -1) {
                                    return TV_RATINGS.indexOf(currentUnBlockedRating) < TV_RATINGS.indexOf(rating);
                                } else {
                                    return false;
                                }
                            }
                        });
                    }
                });
            },
            isMovieBlockedByRating: function isMovieBlockedByRating(rating) {
                return service.isParentalControlsDisabledForClient().then(function (value) {
                    if (value) {
                        return false;
                    } else {
                        return service.getUnblockedMovieRating().then(function (currentUnBlockedRating) {
                            if (!currentUnBlockedRating) {
                                return true;
                            } else {
                                if (MOVIE_RATINGS.indexOf(rating) > -1 && MOVIE_RATINGS.indexOf(currentUnBlockedRating) > -1) {
                                    return MOVIE_RATINGS.indexOf(currentUnBlockedRating) < MOVIE_RATINGS.indexOf(rating);
                                } else {
                                    return false;
                                }
                            }
                        });
                    }
                });
            },
            getUnblockedTvRating: function getUnblockedTvRating() {
                return this.getHighestUnblockedRatingByType(TV_RATINGS_TYPE);
            },
            getUnblockedMovieRating: function getUnblockedMovieRating() {
                return this.getHighestUnblockedRatingByType(MOVIE_RATINGS_TYPE);
            },
            isPINSet: function isPINSet() {
                return service.getParentalControlsForUser().then(function (json) {
                    return json ? config.getBool(json.pinSet) : false;
                });
            },
            shouldSetDefaults: function shouldSetDefaults() {
                var _this4 = this;

                return this.isPINSet().then(function (hasSavedPin) {
                    if (!hasSavedPin) {
                        return _this4.parentalControlsByChannel().then(function (channels) {
                            var foundChannel = channels.find(function (channel) {
                                return channel.services.find(function (s) {
                                    return s.blocked === true;
                                });
                            });
                            return foundChannel === undefined;
                        });
                    } else {
                        return false;
                    }
                });
            },
            validatePIN: function validatePIN(pin) {
                var pinJson = { parentalControlPIN: md5(pin) };
                return $http({
                    method: 'POST',
                    url: config.parentalControls.validatePINUrl(),
                    data: JSON.stringify(pinJson),
                    withCredentials: true,
                    bypassRefresh: true //Do not attempt to refresh authentication on 401 of 403
                }).then(function () {
                    service.savePINLocally(pin);
                });
            },
            setPIN: function setPIN(pin, password) {
                var defer = $q.defer();
                var postData = { parentalControlPIN: pin };
                if (password !== undefined && password !== '') {
                    postData.adminPassword = password;
                }
                $http({
                    method: 'POST',
                    url: config.parentalControls.setPINUrl(),
                    data: JSON.stringify(postData),
                    withCredentials: true
                }).then(function () {
                    //needs a delay for pinSet
                    $timeout(function () {
                        getPcDeferred = null;
                        service.savePINLocally(pin);
                        defer.resolve();
                    }, 1000);
                });
                return defer.promise;
            },
            setPINForFirstTimeWithDefaultRatings: function setPINForFirstTimeWithDefaultRatings(pin, password) {
                return service.setPIN(pin, password).then(function () {
                    return service.setDefaultRatings().then(function () {
                        return service.getParentalControlsForUser();
                    });
                });
            },
            parentalControlsByChannel: function parentalControlsByChannel() {
                if (!channelsDefer) {
                    channelsDefer = $q.defer();
                    $http({
                        method: 'GET',
                        url: config.parentalControls.parentalControlsByChannelUrl(),
                        withCredentials: true
                    }).then(function (response) {
                        channelsDefer.resolve(response.data);
                    }, function (error) {
                        channelsDefer.reject(error);
                    });
                }
                return channelsDefer.promise;
            },
            isChannelBlockedByTmsGuideServiceId: function isChannelBlockedByTmsGuideServiceId(tmsGuideServiceIds) {
                var _this5 = this;

                return service.isParentalControlsDisabledForClient().then(function (value) {
                    if (value) {
                        return false;
                    } else {
                        if (!angular.isArray(tmsGuideServiceIds)) {
                            tmsGuideServiceIds = [tmsGuideServiceIds];
                        }
                        tmsGuideServiceIds = tmsGuideServiceIds.map(function (id) {
                            return parseInt(id);
                        });
                        return _this5.parentalControlsByChannel().then(function (channels) {
                            var foundService = [];
                            channels.forEach(function (channel) {
                                channel.services.forEach(function (service) {
                                    if (service.tmsGuideId && tmsGuideServiceIds.includes(parseInt(service.tmsGuideId))) {
                                        foundService.push(service);
                                    }
                                });
                            });
                            //If all are blocked
                            if (foundService.length > 0 && foundService.length === tmsGuideServiceIds.length && foundService.every(function (service) {
                                return service.blocked;
                            })) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                    }
                });
            },
            isChannelBlockedByProviderIds: function isChannelBlockedByProviderIds(providerIds) {
                var _this6 = this;

                return service.isParentalControlsDisabledForClient().then(function (value) {
                    if (value || !(providerIds && providerIds.length > 0)) {
                        return false;
                    } else {
                        return _this6.parentalControlsByChannel().then(function (channels) {
                            //Reduce to only services, filter to providers that provide this product
                            //check that all providers are blocked
                            var matchedServices =
                            //Reduce to just the services
                            channels.reduce(function (memo, channel) {
                                return memo.concat(channel.services);
                            }, []).
                            //Get only the services we have matching provider ids
                            filter(function (srvc) {
                                return srvc.productProviders && srvc.productProviders.some(function (id) {
                                    return providerIds.includes(id);
                                });
                            });

                            //Make sure that we matched at least one service and
                            //all the services are blocked
                            return matchedServices.length > 0 && matchedServices.every(function (srvc) {
                                return srvc.blocked;
                            });
                        });
                    }
                });
            },
            createChannelUpdateJson: function createChannelUpdateJson(channels) {
                var channelUpdateJson = {
                    parentalControls: {
                        blockedChannels: []
                    }
                };

                channels.forEach(function (channel) {
                    channel.services.forEach(function (service) {
                        if (service.blocked) {
                            channelUpdateJson.parentalControls.blockedChannels.push({ ncsServiceId: parseInt(service.ncsServiceId) });
                        }
                    });
                });
                return channelUpdateJson;
            },
            validateAdminPassword: function validateAdminPassword(password) {
                return $http({
                    method: 'POST',
                    url: config.parentalControls.validateAdminPasswordUrl(),
                    data: JSON.stringify({ 'adminPassword': password }),
                    withCredentials: true
                });
            },
            updateParentalControlsByChannel: function updateParentalControlsByChannel(channels) {
                return $http({
                    method: 'POST',
                    url: config.parentalControls.updateParentalControlsByChannelUrl(),
                    contentType: 'application/json',
                    data: JSON.stringify(service.createChannelUpdateJson(channels)),
                    withCredentials: true
                }).then(function () {
                    channelsDefer = null;
                });
            }
        };

        service.debounceUnblockRating = createObservableFunction();
        service.debounceUnblockRating.debounce(1000).subscribe(function (params) {
            return service.unblockRating.apply(service, _toConsumableArray(params));
        });

        return service;
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/parentalControls-service.js.map
