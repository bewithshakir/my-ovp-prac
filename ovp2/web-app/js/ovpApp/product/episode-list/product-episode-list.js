(function () {
    'use strict';

    angular.module('ovpApp.product.episodes', [
        'ovpApp.dataDelegate',
        'ovpApp.services.dateFormat',
        'ovpApp.product.productActionService'
    ])
    .component('productEpisodeList', {
        bindings: {
            fetcher: '<',
            series: '<',
            cameFromWatchLater: '<',
            app: '@',
            tmsProgramId: '<'
        },
        templateUrl: '/js/ovpApp/product/episode-list/product-episode-list.html',
        controller: class ProductEpisodeList {
            constructor($element, $document, $scope, $rootScope, productService, $filter,
                CDVR_STATE, actionTypeMap, $q, dateFormat) {
                angular.extend(this, {$element, $document, $scope, $rootScope, productService, $filter,
                    CDVR_STATE, actionTypeMap, $q, dateFormat});
            }

            $onInit() {
                this.$scope.$on('update-dvr', () => this.actionExecuting());
                this.focusAction = false;
                this.$scope.$on('product:update-started', (event, asset) => {
                    this.focusAction = asset.isSeries === true ? false : true;
                });
            }

            $onChanges(changes) {
                if (changes.series) {
                    this.onSeriesChanged();
                }
            }

            $postLink() {
                const keys = {left: 37, up: 38, right: 39, down: 40, tab: 9};

                let episodeContainer = this.$element.find('#episode-container');
                let details = this.$element.find('#episode-details');

                episodeContainer.on('keydown', (event) => {
                    if (event.keyCode == keys.right || event.keyCode == keys.down) {
                        let buttons = details.find('[selectable]');
                        if (buttons.length > 0) {
                            buttons[0].focus();
                        }
                        event.preventDefault();
                    }
                });

                details.on('keydown', (event) => {
                    if (event.keyCode == keys.left || event.keyCode == keys.up) {
                        focus(-1);
                        event.preventDefault();
                    } else if (event.keyCode == keys.right || event.keyCode == keys.down) {
                        focus(1);
                        event.preventDefault();
                    } else if (event.keyCode == keys.tab) {
                        this.$element.find('.list-item-episode.active').focus();
                        // Deliberately allow event to continue, so that the focus will move
                        // to the next (or previous) episode
                    }
                });

                this.unregister = () => {
                    episodeContainer.off();
                    details.off();
                };

                const self = this;
                function focus(increment) {
                    let buttons = details.find('[selectable]');
                    let current = self.$document[0].activeElement;
                    let i;
                    for (i = 0; i < buttons.length; i++) {
                        if (buttons[i] == current) {
                            break;
                        }
                    }

                    let button = buttons[i + increment];
                    if (button) {
                        button.focus();
                    }
                }
            }

            $onDestroy() {
                this.unregister();
            }

            actionExecuting() {
                if (this.fetcher) {
                    const waitForFresh = true;
                    this.$q.when(this.fetcher(waitForFresh))
                        .then(asset => {
                            this.series = asset;
                            this.onSeriesChanged();
                        });
                }
            }

            onSeriesChanged() {
                this.extractBonusContent();
                this.pickElevatedEpisode();
                this.selectDefaultEpisode();
                this.assignElementIndices();
            }

            /**
             * Assign numeric index to each episode for analytics purposes.
             */
            assignElementIndices() {
                // Analytics: Assign numeric index to each episode.
                let elementIndex = 0;

                // Reserve first elementIndex to the elevated episode, if one exists.
                if (this.elevated && this.elevated.episode) {
                    this.elevated.episode.elementIndex = elementIndex++;
                }

                if (this.series && this.series.seasons) {
                    this.series.seasons
                        .filter(season => season.episodes)
                        .forEach((season) => {
                            season.episodes
                                .forEach((episode) => episode.elementIndex = elementIndex++);
                        });
                }
            }

            extractBonusContent() {
                if (!this.series || !this.series.seasons) {
                    return;
                }

                let normalSeasons = this.series.seasons.filter(season => season.name !== 'Other');
                let otherSeason = this.series.seasons.find(season => season.name === 'Other');
                let previewEpisodes = otherSeason ? otherSeason.episodes
                    .filter(episode => episode.isPreview) : [];
                let nonPreviewEpisodes = otherSeason ? otherSeason.episodes
                    .filter(episode => !episode.isPreview) : [];

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

            pickElevatedEpisode() {
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

            bySpecifiedEpisode() {
                let candidate;
                if (this.tmsProgramId) {
                    this.seasons.forEach(season =>
                        season.episodes.some(episode => {
                            if (episode.tmsProgramIds.indexOf(this.tmsProgramId) > -1) {
                                candidate = episode;
                                return true;
                            }
                            return false;
                        })
                    );
                }

                if (candidate) {
                    let description;
                    if (candidate.isOnNow) {
                        description = 'Currently airing live';
                    } else {
                        let stream = candidate.nextLinearStream;
                        if (stream) {
                            description = this.dateFormat.absolute.atTime(
                                parseInt(stream.streamProperties.startTime));
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

            byBookmark() {
                let mostRecent;
                this.seasons.forEach(season =>
                    season.episodes.forEach(episode => {
                        let bm = episode.bookmark;
                        if (bm && (!mostRecent ||
                            bm.lastWatchedUtcSeconds >= mostRecent.bookmark.lastWatchedUtcSeconds)) {
                            mostRecent = episode;
                        }
                    }));

                if (mostRecent) {
                    if (mostRecent.bookmark.complete ||
                        mostRecent.bookmark.playMarkerSeconds >= mostRecent.bookmark.runtimeSeconds) {
                        // Find next episode if able
                        let nextEpisode = this.findNextEpisode(mostRecent, this.seasons);
                        if (nextEpisode) {
                            return {
                                description: `You finished Episode ${mostRecent.episodeNumber}`,
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

                let latest = this.findLatestEpisode(this.seasons);
                if (latest) {
                    return {
                        description: 'Watch the latest episode',
                        episode: angular.copy(latest)
                    };
                }
            }

            selectDefaultEpisode() {
                //If programId (or an existing selectedEpisode) is selected select it instead of the first episode
                this._previousSelected = this.selectedEpisode;
                this.selectedEpisode = null;
                if (this.tmsProgramId || this._previousSelected) {
                    let programIds = [];

                    if (this._previousSelected) {
                        programIds = this._previousSelected.tmsProgramIds;
                    } else {
                        programIds.push(this.tmsProgramId);
                    }

                    const matchingId = episode => {
                        return episode.tmsProgramIds.some(progId => {
                            let comp = (programIds.indexOf(progId) >= 0);
                            return comp;
                        });
                    };

                    if (this.elevated && matchingId(this.elevated.episode)) {
                        this.selectedEpisode = this.elevated.episode;
                    } else {
                        this.seasons.some(season => {
                            let selectedEpisode = season.episodes.find(matchingId);
                            if (selectedEpisode) {
                                this.selectedEpisode = selectedEpisode;
                                if (this.focusAction && this.selectedEpisode.actions) {
                                    this.focusAction = false;
                                    this.selectedEpisode.actions[0].focus = true;
                                }
                                this.selectedEpisode.isSeriesRecording = this.series.isSeriesRecording;
                                return true;
                            }
                        });
                    }
                }

                if (!this.selectedEpisode && this.elevated) {
                    this.selectedEpisode = this.elevated.episode;
                }

                if (!this.selectedEpisode && this.seasons && this.seasons[0] && this.seasons[0].episodes) {
                    this.selectedEpisode = this.seasons[0].episodes[0];
                }
            }

            selectEpisode(episode) {
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

            findNextEpisode(episode, seasons) {
                let nextEpisode;
                let currentSeason = seasons.find(s => s.number === episode.seasonNumber);

                if (currentSeason) {
                    nextEpisode = this.findNext(currentSeason.episodes, episode, e => e.episodeNumber);

                    if (!nextEpisode) {
                        let nextSeason = this.findNext(seasons, currentSeason, s => s.number);
                        if (nextSeason) {
                            nextEpisode = this.findNext(
                                nextSeason.episodes,
                                {episodeNumber: -1},
                                e => e.episodeNumber
                            );
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
            findNext(arr, start, criterionFxn) {
                let critStart = criterionFxn(start);
                return arr.reduce((prev, curr) => {
                    if (criterionFxn(curr) > critStart &&
                        (!prev || criterionFxn(prev) > criterionFxn(curr))) {
                        return curr;
                    }
                    return prev;
                }, undefined);
            }

            findLatestEpisode(seasons) {
                let latestByAirDate;
                let latestByEpisodeNumber;

                function isHigherEpNum(a, b) {
                    return a.seasonNumber > b.seasonNumber ||
                        (a.seasonNumber === b.seasonNumber && a.episodeNumber > b.episodeNumber);
                }

                seasons.forEach(s =>
                    s.episodes.forEach(e => {
                        if (e.originalAirDate &&
                            (!latestByAirDate || e.originalAirDate > latestByAirDate.originalAirDate)) {
                            latestByAirDate = e;
                        }
                        if (e.seasonNumber && e.episodeNumber &&
                            (!latestByEpisodeNumber || isHigherEpNum(e, latestByEpisodeNumber))) {
                            latestByEpisodeNumber = e;
                        }
                    }));

                return latestByEpisodeNumber || latestByAirDate;
            }

            byLiveNow() {
                let candidate;
                this.seasons.some(season =>
                    season.episodes.find(episode => {
                        if (episode.isOnNow) {
                            candidate = episode;
                            return true;
                        }
                    }));

                return candidate && {
                    description: 'Currently airing live',
                    episode: angular.copy(candidate)
                };
            }

            byRecentlyRecorded() {
                let recorded = [];
                this.seasons.forEach(season =>
                    recorded.push(...season.episodes.filter(this.hasRecordedStream)));

                let mostRecent = recorded.sort(this.sortByMostRecentlyRecorded)[0];
                if (mostRecent) {
                    let stream = mostRecent.streamList.find(stream => stream.isCDVRRecorded);
                    let seasonName = '';
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

            hasRecordedStream(episode) {
                return episode.streamList.some(stream => stream.isCDVRRecorded);
            }

            sortByMostRecentlyRecorded(a, b) {
                let aEnd = a.streamList.find(stream => stream.isCDVRRecorded).cdvrRecording.stopTimeSec;
                let bEnd = b.streamList.find(stream => stream.isCDVRRecorded).cdvrRecording.stopTimeSec;
                return bEnd - aEnd;
            }

            availabilityMessage(episode) {
                return this.productService.availabilityMessage(episode, this.cameFromWatchLater);
            }

            originalAirDateMessage() {
                return this.selectedEpisode &&
                    `Original airdate ${this.$filter('date')(this.selectedEpisode.originalAirDate)}`;
            }
        }
    });
})();
