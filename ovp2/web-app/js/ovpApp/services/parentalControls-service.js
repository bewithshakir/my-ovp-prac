/* globals md5 */
(function () {
    'use strict';

    angular.module('ovpApp.services.parentalControlsService', [
        'ovpApp.config',
        'ovpApp.services.ovpStorage',
        'ovpApp.services.rxUtils',
        'ovpApp.services.profileService'
    ])
    .constant('TV_RATINGS', [
        'TV-Y',
        'TV-Y7',
        'TV-G',
        'TV-PG',
        'TV-14',
        'TV-MA'
    ])
    .constant('MOVIE_RATINGS', [
        'G',
        'PG',
        'PG-13',
        'R',
        'NC-17',
        'ADULT'
        //'NR'
    ])
    .constant('TV_RATINGS_TYPE', 'TVRatings')
    .constant('MOVIE_RATINGS_TYPE', 'MovieRatings')
    .constant('DEFAULT_TV_RATING', 'TV-PG')
    .constant('DEFAULT_MOVIE_RATING', 'PG-13')
    .constant('PC_BLOCK_REASON', {
        rating: 'rating',
        channel: 'channel'
    })
    .constant('PC_UNBLOCK_REASON', {
        settings: 'settings'
    })
    .factory('parentalControlsService', parentalControlsService);

    /* @ngInject */
    function parentalControlsService($http, $q, config, ovpStorage, storageKeys, $window, TV_RATINGS,
              MOVIE_RATINGS, TV_RATINGS_TYPE, MOVIE_RATINGS_TYPE, DEFAULT_MOVIE_RATING, DEFAULT_TV_RATING,
              $timeout, $rootScope, PC_BLOCK_REASON, createObservableFunction, profileService) {

        var getPcDeferred,
            loggedInUsername = null,
            adminUsername = null,
            channelsDefer = null,
            ratingsDefer = null,
            service = {
                getParentalControlsForUser: function () {
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
                getRatingsForUser: function () {
                    if (!ratingsDefer) {
                        ratingsDefer = $q.defer();
                        service.getParentalControlsForUser().then(() => {
                            return $http({
                                method: 'GET',
                                url: config.parentalControls.parentalControlsByRatingUrl(),
                                withCredentials: true
                            })
                            .then(function (response) {
                                //BLATENT Hack to remove NR
                                var ratings = response.data,
                                    movieRatings = ratings.parentalControls.MovieRatings,
                                    nrIndex = movieRatings.findIndex((r) => r.rating === 'NR');

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
                updateRatingForUser: function (json) {
                    return $http({
                        method: 'PUT',
                        url: config.parentalControls.parentalControlsByRatingUrl(),
                        data: JSON.stringify(json),
                        withCredentials: true,
                        contentType: 'application/json'
                    })
                    .then(() => {
                        ratingsDefer = null;
                        return this.getRatingsForUser()
                            .then(() => {
                                $rootScope.$emit('ParentalControls:updated');
                            });
                    });
                },
                getLoggedInUsername: function () {
                    return service.getParentalControlsForUser().then(() => {
                        return loggedInUsername;
                    });
                },
                setDefaultRatings: function () {
                    return this.unblockRating(DEFAULT_MOVIE_RATING, DEFAULT_TV_RATING);
                },
                isPrimaryAccount: function () {
                    return service.getParentalControlsForUser().then(() => {
                        return loggedInUsername === adminUsername;
                    });
                },
                getParentalControlsDomainKey: function () {
                    return service.getLoggedInUsername().then(username => {
                        return 'ovpApp.pc.' + username;
                    });
                },
                clearAllChannelBlocks: function () {
                    return this.updateParentalControlsByChannel([]);
                },
                isParentalControlsDisabledForClient: function () {
                    let disabled = ovpStorage.getItem(storageKeys.parentalControlsDisabled);
                    // May be undefined or false
                    if (!disabled) {
                        disabled = false;
                    }
                    if (profileService.isSpecUOrBulkMDU()) {
                        return $q.resolve(true);
                    } else {
                        return this.isPINSet().then((hasSavedPin) => {
                            return disabled || !hasSavedPin; // disable parental controls if no pin is set
                        });
                    }
                },
                isBlocked: function (ratings, tmsGuideServiceIds, providerIds) {
                    var rating,
                        guide,
                        provider,
                        blockResponse = {
                            isBlocked: false,
                            reason: null
                        };

                    return this.isParentalControlsDisabledForClient().then(isDisabled => {
                        if (isDisabled) {
                            return blockResponse;
                        } else {
                            if (ratings && ratings.length) {
                                rating = this.isBlockedByRating(ratings);
                            } else {
                                rating = false;
                            }

                            if (tmsGuideServiceIds && tmsGuideServiceIds.length) {
                                guide = this.isChannelBlockedByTmsGuideServiceId(tmsGuideServiceIds);
                            } else {
                                guide = false;
                            }

                            if (providerIds && providerIds.length) {
                                provider = this.isChannelBlockedByProviderIds(providerIds);
                            } else {
                                provider = false;
                            }

                            return $q.all([rating, guide, provider]).then(blocks => {
                                let [isRatingBlocked, isGuideIdBlocked, isProviderIdBlocked] = blocks;
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

                disableParentalControlsForClient: function () {
                    ovpStorage.setItem(storageKeys.parentalControlsDisabled, true);
                    $rootScope.$emit('ParentalControls:updated');

                    // TODO: Analytics Event
                    // $rootScope.$emit('EG:settingParentalControlsToggled', {
                    //     enabled: false
                    // });
                },
                enableParentalControlsForClient: function () {
                    ovpStorage.setItem(storageKeys.parentalControlsDisabled, false);
                    $rootScope.$emit('ParentalControls:updated');

                    // TODO: Analytics Event
                    // $rootScope.$emit('EG:settingParentalControlsToggled', {
                    //     enabled: true
                    // });
                },
                hasChannelBlockingEnabled: function () {
                    // TBD check callers and change to synchronous
                    return $q.resolve(!!ovpStorage.getItem(storageKeys.parentalControlsChannelEnabled));
                },
                clearSession: function () {
                    // TBD check callers and change to synchronous
                    return $q.resolve(ovpStorage.removeItem(storageKeys.parentalControlsUnlocked));
                },
                savePINLocally: function (pin) {
                    return $q.resolve(ovpStorage.setItem(storageKeys.parentalControlsLocalPin, md5(pin)));
                },
                getLocalPin: function () {
                    return $q.resolve(ovpStorage.getItem(storageKeys.parentalControlsLocalPin));
                },
                createRatingsUpdateJson: function (movieRating, tvRating) {
                    var unblockedMovieRatingIndex = MOVIE_RATINGS.indexOf(movieRating),
                        unblockedTvRatingIndex = TV_RATINGS.indexOf(tvRating),
                        ratingsJson =
                        {
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
                compareRatingOrdinalLevel: function (ratingA, ratingB) {
                    //compare the ratings and return -1 if rating a is
                    //less than b,0 if equal and 1 otherwise
                    //Array.sort compatible for a list of rating strings
                    var idxA = TV_RATINGS.indexOf(ratingA), idxB = TV_RATINGS.indexOf(ratingB);
                    if (idxA < 0 || idxB < 0) {
                        idxA = MOVIE_RATINGS.indexOf(ratingA);
                        idxB = MOVIE_RATINGS.indexOf(ratingB);
                    }
                    if (idxA < 0 || idxB < 0) {
                        throw 'Unable to determine rating system: ' +
                            ratingA + ', ' + ratingB;
                    }
                    return (idxA < idxB) ? (idxA === idxB) ? 0 : -1 : 1;
                },
                sortRatingList: function (ratings) {
                    //In place sort
                    return ratings.sort(this.compareRatingOrdinalLevel);
                },
                getHighestRatingFromList: function (ratings) {
                    return this.sortRatingList(ratings.slice()).pop();
                },
                getHighestUnblockedRatingByType: function (type) {
                    return this.getRatingsForUser().then(ratings => {
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
                unblockRating: function (movieRating, tvRating) {
                    return this.updateRatingForUser(this.createRatingsUpdateJson(movieRating, tvRating));
                },
                isBlockedByRating: function (ratings) {
                    if (!angular.isArray(ratings)) {
                        ratings = [ratings];
                    }
                    let promises = [];
                    ratings.forEach(tvOrMovieRating => {
                        let isTvRating = TV_RATINGS.includes(tvOrMovieRating);
                        let isMovieRating = MOVIE_RATINGS.includes(tvOrMovieRating);
                        if (isTvRating) {
                            promises[promises.length] = this.isTvShowBlockedByRating(tvOrMovieRating);
                        } else if (isMovieRating) {
                            promises[promises.length] = this.isMovieBlockedByRating(tvOrMovieRating);
                        } else {
                            let defer = $q.defer();
                            defer.resolve(false);
                            promises[promises.length] = defer.promise;
                        }
                    });

                    return $q.all(promises)
                        .then(results => results.every(r => r));
                },
                isMovieRating: function (rating) {
                    return MOVIE_RATINGS.includes(rating);
                },
                isTvShowBlockedByRating: function (rating) {
                    return service.isParentalControlsDisabledForClient().then(value => {
                        if (value) {
                            return false;
                        } else {
                            return service.getUnblockedTvRating()
                                .then(currentUnBlockedRating => {
                                    if (!currentUnBlockedRating) {
                                        return true;
                                    } else {
                                        if (TV_RATINGS.indexOf(rating) > -1 &&
                                            TV_RATINGS.indexOf(currentUnBlockedRating) > -1) {
                                            return TV_RATINGS.indexOf(currentUnBlockedRating) <
                                                TV_RATINGS.indexOf(rating);
                                        } else {
                                            return false;
                                        }
                                    }
                                });
                        }
                    });
                },
                isMovieBlockedByRating: function (rating) {
                    return service.isParentalControlsDisabledForClient().then(value => {
                        if (value) {
                            return false;
                        } else {
                            return service.getUnblockedMovieRating()
                                .then(currentUnBlockedRating => {
                                    if (!currentUnBlockedRating) {
                                        return true;
                                    } else {
                                        if (MOVIE_RATINGS.indexOf(rating) > -1 &&
                                            MOVIE_RATINGS.indexOf(currentUnBlockedRating) > -1) {
                                            return MOVIE_RATINGS.indexOf(currentUnBlockedRating) <
                                                MOVIE_RATINGS.indexOf(rating);
                                        } else {
                                            return false;
                                        }
                                    }
                                });
                        }
                    });
                },
                getUnblockedTvRating: function () {
                    return this.getHighestUnblockedRatingByType(TV_RATINGS_TYPE);
                },
                getUnblockedMovieRating: function () {
                    return this.getHighestUnblockedRatingByType(MOVIE_RATINGS_TYPE);
                },
                isPINSet: function () {
                    return service.getParentalControlsForUser().then(json => {
                        return json ? config.getBool(json.pinSet) : false;
                    });
                },
                shouldSetDefaults: function () {
                    return this.isPINSet().then(hasSavedPin => {
                        if (!hasSavedPin) {
                            return this.parentalControlsByChannel().then(channels => {
                                let foundChannel =
                                    channels.find(channel => channel.services.find(s => s.blocked === true));
                                return foundChannel === undefined;
                            });
                        } else {
                            return false;
                        }
                    });
                },
                validatePIN: function (pin) {
                    var pinJson = {parentalControlPIN: md5(pin)};
                    return $http({
                        method: 'POST',
                        url: config.parentalControls.validatePINUrl(),
                        data: JSON.stringify(pinJson),
                        withCredentials: true,
                        bypassRefresh: true //Do not attempt to refresh authentication on 401 of 403
                    })
                    .then(function () {
                        service.savePINLocally(pin);
                    });
                },
                setPIN: function (pin, password) {
                    var defer = $q.defer();
                    let postData = {parentalControlPIN: pin};
                    if (password !== undefined && password !== '') {
                        postData.adminPassword = password;
                    }
                    $http({
                        method: 'POST',
                        url: config.parentalControls.setPINUrl(),
                        data: JSON.stringify(postData),
                        withCredentials: true
                    }).then(() => {
                        //needs a delay for pinSet
                        $timeout(function () {
                            getPcDeferred = null;
                            service.savePINLocally(pin);
                            defer.resolve();
                        }, 1000);
                    });
                    return defer.promise;
                },
                setPINForFirstTimeWithDefaultRatings: function (pin, password) {
                    return service.setPIN(pin, password).then(() => {
                        return service.setDefaultRatings().then(() => {
                            return service.getParentalControlsForUser();
                        });
                    });
                },
                parentalControlsByChannel: function () {
                    if (!channelsDefer) {
                        channelsDefer = $q.defer();
                        $http({
                            method: 'GET',
                            url: config.parentalControls.parentalControlsByChannelUrl(),
                            withCredentials: true
                        })
                        .then(response => {
                            channelsDefer.resolve(response.data);
                        }, error => {
                            channelsDefer.reject(error);
                        });
                    }
                    return channelsDefer.promise;
                },
                isChannelBlockedByTmsGuideServiceId: function (tmsGuideServiceIds) {
                    return service.isParentalControlsDisabledForClient().then(value => {
                        if (value) {
                            return false;
                        } else {
                            if (!angular.isArray(tmsGuideServiceIds)) {
                                tmsGuideServiceIds = [tmsGuideServiceIds];
                            }
                            tmsGuideServiceIds = tmsGuideServiceIds.map(id => parseInt(id));
                            return this.parentalControlsByChannel().then(channels => {
                                let foundService = [];
                                channels.forEach(function (channel) {
                                    channel.services.forEach(function (service) {
                                        if (service.tmsGuideId &&
                                            tmsGuideServiceIds.includes(parseInt(service.tmsGuideId))) {
                                            foundService.push(service);
                                        }
                                    });
                                });
                                //If all are blocked
                                if (foundService.length > 0 &&
                                    foundService.length === tmsGuideServiceIds.length &&
                                    foundService.every(service => service.blocked)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }
                    });
                },
                isChannelBlockedByProviderIds: function (providerIds) {
                    return service.isParentalControlsDisabledForClient().then(value => {
                        if (value || !(providerIds && providerIds.length > 0)) {
                            return false;
                        } else {
                            return this.parentalControlsByChannel().then(channels => {
                                //Reduce to only services, filter to providers that provide this product
                                //check that all providers are blocked
                                let matchedServices =
                                    //Reduce to just the services
                                    channels.reduce((memo, channel) => memo.concat(channel.services), []).
                                    //Get only the services we have matching provider ids
                                    filter(srvc => srvc.productProviders &&
                                        srvc.productProviders.some(id => providerIds.includes(id)));

                                //Make sure that we matched at least one service and
                                //all the services are blocked
                                return matchedServices.length > 0 && matchedServices.every(srvc => srvc.blocked);
                            });
                        }
                    });
                },
                createChannelUpdateJson: function (channels) {
                    var channelUpdateJson = {
                        parentalControls: {
                            blockedChannels: []
                        }
                    };

                    channels.forEach(channel => {
                        channel.services.forEach(service => {
                            if (service.blocked) {
                                channelUpdateJson.parentalControls
                                    .blockedChannels.push({ncsServiceId: parseInt(service.ncsServiceId)});
                            }
                        });
                    });
                    return channelUpdateJson;
                },
                validateAdminPassword: function (password) {
                    return $http({
                        method: 'POST',
                        url: config.parentalControls.validateAdminPasswordUrl(),
                        data: JSON.stringify({'adminPassword': password}),
                        withCredentials: true
                    });
                },
                updateParentalControlsByChannel: function (channels) {
                    return $http({
                        method: 'POST',
                        url: config.parentalControls.updateParentalControlsByChannelUrl(),
                        contentType: 'application/json',
                        data: JSON.stringify(service.createChannelUpdateJson(channels)),
                        withCredentials: true
                    })
                    .then(() => {
                        channelsDefer = null;
                    });
                }
            };

        service.debounceUnblockRating = createObservableFunction();
        service.debounceUnblockRating
            .debounce(1000)
            .subscribe(params => service.unblockRating(...params));

        return service;
    }
}());
