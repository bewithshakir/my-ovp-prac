'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.product.episodes', ['ovpApp.dataDelegate', 'ovpApp.services.dateFormat', 'ovpApp.product.productActionService']).component('productEpisodeList', {
        bindings: {
            fetcher: '<',
            series: '<',
            cameFromWatchLater: '<',
            app: '@',
            tmsProgramId: '<'
        },
        templateUrl: '/js/ovpApp/product/episode-list/product-episode-list.html',
        controller: (function () {
            ProductEpisodeList.$inject = ["$element", "$document", "$scope", "$rootScope", "productService", "$filter", "CDVR_STATE", "actionTypeMap", "$q", "dateFormat"];
            function ProductEpisodeList($element, $document, $scope, $rootScope, productService, $filter, CDVR_STATE, actionTypeMap, $q, dateFormat) {
                _classCallCheck(this, ProductEpisodeList);

                angular.extend(this, { $element: $element, $document: $document, $scope: $scope, $rootScope: $rootScope, productService: productService, $filter: $filter,
                    CDVR_STATE: CDVR_STATE, actionTypeMap: actionTypeMap, $q: $q, dateFormat: dateFormat });
            }

            _createClass(ProductEpisodeList, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.$scope.$on('update-dvr', function () {
                        return _this.actionExecuting();
                    });
                    this.focusAction = false;
                    this.$scope.$on('product:update-started', function (event, asset) {
                        _this.focusAction = asset.isSeries === true ? false : true;
                    });
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.series) {
                        this.onSeriesChanged();
                    }
                }
            }, {
                key: '$postLink',
                value: function $postLink() {
                    var _this2 = this;

                    var keys = { left: 37, up: 38, right: 39, down: 40, tab: 9 };

                    var episodeContainer = this.$element.find('#episode-container');
                    var details = this.$element.find('#episode-details');

                    episodeContainer.on('keydown', function (event) {
                        if (event.keyCode == keys.right || event.keyCode == keys.down) {
                            var buttons = details.find('[selectable]');
                            if (buttons.length > 0) {
                                buttons[0].focus();
                            }
                            event.preventDefault();
                        }
                    });

                    details.on('keydown', function (event) {
                        if (event.keyCode == keys.left || event.keyCode == keys.up) {
                            focus(-1);
                            event.preventDefault();
                        } else if (event.keyCode == keys.right || event.keyCode == keys.down) {
                            focus(1);
                            event.preventDefault();
                        } else if (event.keyCode == keys.tab) {
                            _this2.$element.find('.list-item-episode.active').focus();
                            // Deliberately allow event to continue, so that the focus will move
                            // to the next (or previous) episode
                        }
                    });

                    this.unregister = function () {
                        episodeContainer.off();
                        details.off();
                    };

                    var self = this;
                    function focus(increment) {
                        var buttons = details.find('[selectable]');
                        var current = self.$document[0].activeElement;
                        var i = undefined;
                        for (i = 0; i < buttons.length; i++) {
                            if (buttons[i] == current) {
                                break;
                            }
                        }

                        var button = buttons[i + increment];
                        if (button) {
                            button.focus();
                        }
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.unregister();
                }
            }, {
                key: 'actionExecuting',
                value: function actionExecuting() {
                    var _this3 = this;

                    if (this.fetcher) {
                        var waitForFresh = true;
                        this.$q.when(this.fetcher(waitForFresh)).then(function (asset) {
                            _this3.series = asset;
                            _this3.onSeriesChanged();
                        });
                    }
                }
            }, {
                key: 'onSeriesChanged',
                value: function onSeriesChanged() {
                    this.extractBonusContent();
                    this.pickElevatedEpisode();
                    this.selectDefaultEpisode();
                    this.assignElementIndices();
                }

                /**
                 * Assign numeric index to each episode for analytics purposes.
                 */
            }, {
                key: 'assignElementIndices',
                value: function assignElementIndices() {
                    // Analytics: Assign numeric index to each episode.
                    var elementIndex = 0;

                    // Reserve first elementIndex to the elevated episode, if one exists.
                    if (this.elevated && this.elevated.episode) {
                        this.elevated.episode.elementIndex = elementIndex++;
                    }

                    if (this.series && this.series.seasons) {
                        this.series.seasons.filter(function (season) {
                            return season.episodes;
                        }).forEach(function (season) {
                            season.episodes.forEach(function (episode) {
                                return episode.elementIndex = elementIndex++;
                            });
                        });
                    }
                }
            }, {
                key: 'extractBonusContent',
                value: function extractBonusContent() {
                    if (!this.series || !this.series.seasons) {
                        return;
                    }

                    var normalSeasons = this.series.seasons.filter(function (season) {
                        return season.name !== 'Other';
                    });
                    var otherSeason = this.series.seasons.find(function (season) {
                        return season.name === 'Other';
                    });
                    var previewEpisodes = otherSeason ? otherSeason.episodes.filter(function (episode) {
                        return episode.isPreview;
                    }) : [];
                    var nonPreviewEpisodes = otherSeason ? otherSeason.episodes.filter(function (episode) {
                        return !episode.isPreview;
                    }) : [];

                    this.seasons = normalSeasons;
                    if (nonPreviewEpisodes.length > 0) {
                        this.seasons.push({
                            name: 'Other episodes',
                            episodes: nonPreviewEpisodes
                        });
                    }

                    if (previewEpisodes.length > 0) {
                        this.seasons.push({
                            name: 'Clips and more',
                            episodes: previewEpisodes
                        });
                    }
                }
            }, {
                key: 'pickElevatedEpisode',
                value: function pickElevatedEpisode() {
                    if (this.app === 'livetv') {
                        this.elevated = this.byLiveNow();
                    } else if (this.app === 'ondemand') {
                        this.elevated = this.byBookmark();
                    } else if (this.app === 'watchLater') {
                        this.elevated = this.byBookmark();
                    } else if (this.app === 'rdvr' || this.app === 'cdvr') {
                        this.elevated = this.bySpecifiedEpisode() || this.byRecentlyRecorded();
                    } else if (this.app === 'search') {
                        this.elevated = this.byLiveNow() || this.byBookmark();
                    } else if (this.app === 'guide') {
                        this.elevated = this.bySpecifiedEpisode();
                    }
                }
            }, {
                key: 'bySpecifiedEpisode',
                value: function bySpecifiedEpisode() {
                    var _this4 = this;

                    var candidate = undefined;
                    if (this.tmsProgramId) {
                        this.seasons.forEach(function (season) {
                            return season.episodes.some(function (episode) {
                                if (episode.tmsProgramIds.indexOf(_this4.tmsProgramId) > -1) {
                                    candidate = episode;
                                    return true;
                                }
                                return false;
                            });
                        });
                    }

                    if (candidate) {
                        var description = undefined;
                        if (candidate.isOnNow) {
                            description = 'Currently airing live';
                        } else {
                            var stream = candidate.nextLinearStream;
                            if (stream) {
                                description = this.dateFormat.absolute.atTime(parseInt(stream.streamProperties.startTime));
                            } else {
                                description = 'Upcoming';
                            }
                        }
                        return {
                            description: description,
                            episode: angular.copy(candidate)
                        };
                    }
                }
            }, {
                key: 'byBookmark',
                value: function byBookmark() {
                    var mostRecent = undefined;
                    this.seasons.forEach(function (season) {
                        return season.episodes.forEach(function (episode) {
                            var bm = episode.bookmark;
                            if (bm && (!mostRecent || bm.lastWatchedUtcSeconds >= mostRecent.bookmark.lastWatchedUtcSeconds)) {
                                mostRecent = episode;
                            }
                        });
                    });

                    if (mostRecent) {
                        if (mostRecent.bookmark.complete || mostRecent.bookmark.playMarkerSeconds >= mostRecent.bookmark.runtimeSeconds) {
                            // Find next episode if able
                            var nextEpisode = this.findNextEpisode(mostRecent, this.seasons);
                            if (nextEpisode) {
                                return {
                                    description: 'You finished Episode ' + mostRecent.episodeNumber,
                                    episode: angular.copy(nextEpisode)
                                };
                            }
                        } else {
                            return {
                                description: 'You were watching',
                                episode: angular.copy(mostRecent)
                            };
                        }
                    }

                    var latest = this.findLatestEpisode(this.seasons);
                    if (latest) {
                        return {
                            description: 'Watch the latest episode',
                            episode: angular.copy(latest)
                        };
                    }
                }
            }, {
                key: 'selectDefaultEpisode',
                value: function selectDefaultEpisode() {
                    var _this5 = this;

                    //If programId (or an existing selectedEpisode) is selected select it instead of the first episode
                    this._previousSelected = this.selectedEpisode;
                    this.selectedEpisode = null;
                    if (this.tmsProgramId || this._previousSelected) {
                        (function () {
                            var programIds = [];

                            if (_this5._previousSelected) {
                                programIds = _this5._previousSelected.tmsProgramIds;
                            } else {
                                programIds.push(_this5.tmsProgramId);
                            }

                            var matchingId = function matchingId(episode) {
                                return episode.tmsProgramIds.some(function (progId) {
                                    var comp = programIds.indexOf(progId) >= 0;
                                    return comp;
                                });
                            };

                            if (_this5.elevated && matchingId(_this5.elevated.episode)) {
                                _this5.selectedEpisode = _this5.elevated.episode;
                            } else {
                                _this5.seasons.some(function (season) {
                                    var selectedEpisode = season.episodes.find(matchingId);
                                    if (selectedEpisode) {
                                        _this5.selectedEpisode = selectedEpisode;
                                        if (_this5.focusAction && _this5.selectedEpisode.actions) {
                                            _this5.focusAction = false;
                                            _this5.selectedEpisode.actions[0].focus = true;
                                        }
                                        _this5.selectedEpisode.isSeriesRecording = _this5.series.isSeriesRecording;
                                        return true;
                                    }
                                });
                            }
                        })();
                    }

                    if (!this.selectedEpisode && this.elevated) {
                        this.selectedEpisode = this.elevated.episode;
                    }

                    if (!this.selectedEpisode && this.seasons && this.seasons[0] && this.seasons[0].episodes) {
                        this.selectedEpisode = this.seasons[0].episodes[0];
                    }
                }
            }, {
                key: 'selectEpisode',
                value: function selectEpisode(episode) {
                    // Analytics (Only publish if episode has changed)
                    if (this.selectedEpisode !== episode) {
                        this.$rootScope.$emit('Analytics:selectContent', {
                            asset: episode,
                            elementIndex: episode.elementIndex,
                            operationType: 'episodeSelection',
                            pageSectionName: 'episodeListArea',
                            pageSubSectionName: 'episodeConversionArea'
                        });
                    }
                    this.selectedEpisode = episode;
                }
            }, {
                key: 'findNextEpisode',
                value: function findNextEpisode(episode, seasons) {
                    var nextEpisode = undefined;
                    var currentSeason = seasons.find(function (s) {
                        return s.number === episode.seasonNumber;
                    });

                    if (currentSeason) {
                        nextEpisode = this.findNext(currentSeason.episodes, episode, function (e) {
                            return e.episodeNumber;
                        });

                        if (!nextEpisode) {
                            var nextSeason = this.findNext(seasons, currentSeason, function (s) {
                                return s.number;
                            });
                            if (nextSeason) {
                                nextEpisode = this.findNext(nextSeason.episodes, { episodeNumber: -1 }, function (e) {
                                    return e.episodeNumber;
                                });
                            }
                        }
                    }

                    return nextEpisode;
                }

                /**
                 * Finds an element that is "greater" than a comparison element. If multiple exist, the element that is
                 *   the "smallest" while still being "greater" than the comparison element is chosen. If no elements
                 *   are greater, undefined is returned.
                 *
                 * Example:
                 * let arr = [{id: 1}, {id: 0}, {id: 5}, {id: 3}, {id: 4}];
                 * let next = findNext(arr, arr[0], element => element.id);
                 * // at this point next = {id: 3}
                 *
                 * @param  {array} arr             array to search through
                 * @param  {object} start          the base element to compare against.
                 * @param  {function} criterionFxn function to convert an element into a numeric score
                 * @return {object}                the element with the smallest score greater than the starting score
                 */
            }, {
                key: 'findNext',
                value: function findNext(arr, start, criterionFxn) {
                    var critStart = criterionFxn(start);
                    return arr.reduce(function (prev, curr) {
                        if (criterionFxn(curr) > critStart && (!prev || criterionFxn(prev) > criterionFxn(curr))) {
                            return curr;
                        }
                        return prev;
                    }, undefined);
                }
            }, {
                key: 'findLatestEpisode',
                value: function findLatestEpisode(seasons) {
                    var latestByAirDate = undefined;
                    var latestByEpisodeNumber = undefined;

                    function isHigherEpNum(a, b) {
                        return a.seasonNumber > b.seasonNumber || a.seasonNumber === b.seasonNumber && a.episodeNumber > b.episodeNumber;
                    }

                    seasons.forEach(function (s) {
                        return s.episodes.forEach(function (e) {
                            if (e.originalAirDate && (!latestByAirDate || e.originalAirDate > latestByAirDate.originalAirDate)) {
                                latestByAirDate = e;
                            }
                            if (e.seasonNumber && e.episodeNumber && (!latestByEpisodeNumber || isHigherEpNum(e, latestByEpisodeNumber))) {
                                latestByEpisodeNumber = e;
                            }
                        });
                    });

                    return latestByEpisodeNumber || latestByAirDate;
                }
            }, {
                key: 'byLiveNow',
                value: function byLiveNow() {
                    var candidate = undefined;
                    this.seasons.some(function (season) {
                        return season.episodes.find(function (episode) {
                            if (episode.isOnNow) {
                                candidate = episode;
                                return true;
                            }
                        });
                    });

                    return candidate && {
                        description: 'Currently airing live',
                        episode: angular.copy(candidate)
                    };
                }
            }, {
                key: 'byRecentlyRecorded',
                value: function byRecentlyRecorded() {
                    var _this6 = this;

                    var recorded = [];
                    this.seasons.forEach(function (season) {
                        return recorded.push.apply(recorded, _toConsumableArray(season.episodes.filter(_this6.hasRecordedStream)));
                    });

                    var mostRecent = recorded.sort(this.sortByMostRecentlyRecorded)[0];
                    if (mostRecent) {
                        var stream = mostRecent.streamList.find(function (stream) {
                            return stream.isCDVRRecorded;
                        });
                        var seasonName = '';
                        if (stream.cdvrState === this.CDVR_STATE.IN_PROGRESS) {
                            seasonName = 'Currently recording';
                        } else {
                            seasonName = 'You\'ve recorded';
                        }

                        return {
                            description: seasonName,
                            episode: angular.copy(mostRecent)
                        };
                    }
                }
            }, {
                key: 'hasRecordedStream',
                value: function hasRecordedStream(episode) {
                    return episode.streamList.some(function (stream) {
                        return stream.isCDVRRecorded;
                    });
                }
            }, {
                key: 'sortByMostRecentlyRecorded',
                value: function sortByMostRecentlyRecorded(a, b) {
                    var aEnd = a.streamList.find(function (stream) {
                        return stream.isCDVRRecorded;
                    }).cdvrRecording.stopTimeSec;
                    var bEnd = b.streamList.find(function (stream) {
                        return stream.isCDVRRecorded;
                    }).cdvrRecording.stopTimeSec;
                    return bEnd - aEnd;
                }
            }, {
                key: 'availabilityMessage',
                value: function availabilityMessage(episode) {
                    return this.productService.availabilityMessage(episode, this.cameFromWatchLater);
                }
            }, {
                key: 'originalAirDateMessage',
                value: function originalAirDateMessage() {
                    return this.selectedEpisode && 'Original airdate ' + this.$filter('date')(this.selectedEpisode.originalAirDate);
                }
            }]);

            return ProductEpisodeList;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/episode-list/product-episode-list.js.map
