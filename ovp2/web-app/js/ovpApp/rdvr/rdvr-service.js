(function () {

    'use strict';

    angular.module('ovpApp.rdvr.rdvrService', [
        'ovpApp.config',
        'ovpApp.rdvr.recordingsCache',
        'ovpApp.rdvr.cacheService',
        'ovpApp.services.stbService',
        'ovpApp.services.epgsService',
        'rx',
        'ovpApp.services.rxUtils',
        'ovpApp.dataDelegate',
        'ovpApp.rdvr.datasource'
    ])
    .constant('recordingsListType', {
        SCHEDULED: 'SCHEDULED',
        COMPLETED: 'COMPLETED',
        SERIES_PRIORITY: 'SERIES_PRIORITY',
        DISK_USAGE: 'DISK_USAGE'
    })
    .factory('rdvrService', rdvrService);

    /* @ngInject */
    function rdvrService($http, $q, $log, config, RecordingsCache, rx, rxhttp, createObservableFunction,
              recordingsListType, $window, $rootScope, rdvrCacheService, stbService, epgsService,
              recordingViewModelDefinition, ScheduledRecordingsDatasource, SeriesPriorityDatasource,
              DiskUsageDatasource, MyRecordingsDatasource, $timeout) {

        const stbs = {};
        let lastScheduledRecordingsResetTime = Date.now();

        const service = {
            getSeriesPriorities,
            setSeriesPriorities,
            getMyRecordingGroups,
            getCompletedAndInProgressRecordings,
            getUsage,
            resumeCompletedRecording,
            playCompletedRecording,
            deleteRecordings,
            getScheduledRecordings,
            resetScheduledRecordings,
            cancelScheduled,
            scheduleRecording,
            getScheduledConflicts,
            isMovie,
            getSeriesRecordingSettings,
            getEventRecordingSettings
        };

        return service;

        //////////////////////

        function initStb(stb) {
            const key = stb.macAddressNormalized;
            if (!stbs[key]) {
                stbs[key] = {
                    scheduledRecordings: new ScheduledRecordingsDatasource(stb),
                    myRecordings: new MyRecordingsDatasource(stb),
                    seriesPriorities: new SeriesPriorityDatasource(stb),
                    diskUsage: new DiskUsageDatasource(stb)
                };
            }
            return stbs[key];
        }

        function getDvrBase(rdvrVersion) {
            return config.services.dvrBase.replace('*', rdvrVersion);
        }

        /**
         * On very old shows, metadata is sometimes absent.  mock out data for UI
         * @param recording
         */
        function createEmptyProgramMetadata(recording) {
            recording.programMetadata = {
                imageUrl: '/imageserver/program/' + recording.tmsProgramId,
                mystroServiceId: recording.mystroServiceId,
                rating: '',
                title: '',
                episodeTitle: '',
                seasonNumber: '',
                episodeNumber: '',
                genres: []
            };
        }

        function getSeriesPriorities(stb) {
            return initStb(stb).seriesPriorities.source;
        }

        function setSeriesPriorities(stb, priorities) {
            return initStb(stb).seriesPriorities.setSeriesPriorities(priorities);
        }

        function getMyRecordingGroups(stb) {
            return initStb(stb).myRecordings.source
                .map(result => {
                    let foundSeries = {};
                    let groupedRecordings = [];

                    result.data.forEach(r => {
                        const seriesId = r.tmsSeriesId;
                        if (!(seriesId in foundSeries)) {
                            let group = {
                                episodes: [r]
                            };

                            groupedRecordings.push(group);

                            if (angular.isDefined(seriesId)) {
                                foundSeries[seriesId] = group;
                            }
                        } else {
                            foundSeries[seriesId].episodes.push(r);
                        }
                    });

                    return angular.extend({}, result, {data: groupedRecordings});
                });
        }

        function getCompletedAndInProgressRecordings(stb) {
            return initStb(stb).myRecordings.source;
        }

        function deleteRecordings(stb, recordings) {
            return initStb(stb).myRecordings.deleteRecordings(recordings)
                .then(result => {
                    if (result.data.failedDeletions.length < recordings.length) {
                        initStb(stb).diskUsage.reset();
                    }
                    return result;
                });
        }

        function getUsage(stb) {
            return initStb(stb).diskUsage.source;
        }

        function resumeCompletedRecording(stb, recording) {
            return playOrResume(stb, recording, true);
        }

        function playCompletedRecording(stb, recording) {
            return playOrResume(stb, recording, false);
        }

        function playOrResume(stb, recording, resume) {
            if (!stb || !stb.dvr) {
                return rx.Observable.empty();
            }

            const baseUrl = config.piHost + config.nrsApi + getDvrBase(stb.rdvrVersion);
            const fullUrl = baseUrl + stb.macAddressNormalized +
                (resume ? config.services.dvrRecordedResume : config.services.dvrRecordedPlay) +
                recording.mystroServiceId + '/' +
                recording.tmsProgramId + '/' +
                recording.startTime;

            return rxhttp.get(fullUrl, {withCredentials: true})
                .toPromise($q);
        }

        function getScheduledRecordings(stb) {
            resetExpiredScheduledRecordings(stb);
            return initStb(stb).scheduledRecordings.source;
        }

        /* Private method to reset / refetch recordings after delay */
        function resetExpiredScheduledRecordings(stb) {
            let now = Date.now(),
                delay = parseInt(config.resetScheduledRecordingsDelayInMs);
            if (lastScheduledRecordingsResetTime && (now - lastScheduledRecordingsResetTime) > delay) {
                resetScheduledRecordings(stb);
            }
        }

        function resetScheduledRecordings(stb) {
            lastScheduledRecordingsResetTime = Date.now();
            return initStb(stb).scheduledRecordings.reset();
        }

        function scheduleRecording(stb, scheduledItem) {
            return initStb(stb).scheduledRecordings.scheduleRecording(scheduledItem).then(() => {
                // Get schedule recordings after delay
                if (scheduledItem.recordSeries) {
                    $timeout(() => {
                        resetScheduledRecordings(stb);
                    }, parseInt(config.resetScheduledRecordingsDelayInMs));
                }
            });
        }

        function cancelScheduled(stb, scheduledItem, cancelSingle) {
            return initStb(stb).scheduledRecordings.cancelScheduled(scheduledItem, cancelSingle).then(() => {
                // Get schedule recordings after delay
                if (!cancelSingle) {
                    $timeout(() => {
                        resetScheduledRecordings(stb);
                    }, parseInt(config.resetScheduledRecordingsDelayInMs));
                }
            });
        }

        function getScheduledConflicts(stb, scheduledItem) {
            if (!stb || !stb.dvr) {
                return $q.resolve([]);
            }

            const baseUrl = config.piHost + config.nrsApi + getDvrBase(stb.rdvrVersion);
            const fullUrl = baseUrl + stb.macAddressNormalized +
                config.services.dvrConflicts + '/' +
                scheduledItem.mystroServiceId + '/' +
                scheduledItem.tmsProgramId + '/' +
                scheduledItem.startTime + '/' +
                (scheduledItem.recordSeries ? 'series' : 'single');
            const options = {
                withCredentials: true,
                params: {
                    lineupId: scheduledItem.lineupId
                }
            };

            return rxhttp.get(fullUrl, options)
                .retry(2)
                .map(result => {
                    result.data.conflictingRecordings = result.data.conflictingRecordings || [];
                    // If data is missing, fill it up. Also, install a data delegate
                    return result.data.conflictingRecordings.map(r => {
                        if (!r.programMetadata) {
                            createEmptyProgramMetadata(r);
                        }

                        return recordingViewModelDefinition.createInstance(r);
                    });
                })
                .toPromise($q);
        }

        // This may be more generic than just RDVR
        // could potentially live in a more generic
        // service
        function isMovie(tmsProgramId) {
            return tmsProgramId && tmsProgramId.substring(0, 2) === 'MV';
        }


        /**
         * Take a series and episode "ViewModel" and generate a 'recording'
         * settings model that can be passed to the display popup. This connects
         * the product page to the dvr data to allow editing series recording
         *
         * @param  {seriesViewModelDefinition} recordingSeries
         * @param  {eventViewModelDefinition} recordingEpisode
         * @param  {stream object} recordingStream
         * @return recordingSettings
         */
        function getSeriesRecordingSettings({series, episode, stream, settings, isNew, conflicted}) {
            conflicted = conflicted || false;
            settings = settings || {
                deleteWhenSpaceIsNeeded: true,
                numEpisodesToKeep: 7,
                priority: 'MIN',
                recordOnlyAtThisAirTime: false,
                recordOnlyNewEpisodes: false,
                startAdjustMinutes: 0,
                stopAdjustMinutes: 0
            };

            const props = stream.streamProperties;

            const data = {
                conflicted: conflicted,
                mystroServiceId: '' + props.mystroServiceID,
                displayChannel: props.allChannelNumbers.includes(series.displayChannel) ?
                    series.displayChannel : props.allChannelNumbers[0],
                programMetadata: {
                    episodeNumber: episode.episodeNumber,
                    episodeTitle: episode.title,
                    genres: series.genres,
                    rating: series.rating,
                    tmsProgramId: series.tmsProgramId,
                    tmsSeriesId: series.tmsSeriesId,
                    title: series.title
                },
                recordSeries: true,
                settings: settings,
                startUnixTimestampSeconds: Math.floor(props.startTime / 1000),
                tmsProgramId: props.tmsProviderProgramID,
                isNew: isNew
            };

            return recordingViewModelDefinition.createInstance(data);
        }

        /**
         * creates a recording object with the same structure as though it came from the set top box,
         * but was in fact created locally.
         * @return {[type]} [description]
         */
        function getEventRecordingSettings({asset, stream, settings, isNew, conflicted}) {
            conflicted = conflicted || false;
            settings = settings || {
                deleteWhenSpaceIsNeeded: true,
                numEpisodesToKeep: 7,
                priority: 'MIN',
                recordOnlyAtThisAirTime: false,
                recordOnlyNewEpisodes: false,
                startAdjustMinutes: 0,
                stopAdjustMinutes: 0
            };

            const props = stream.streamProperties;

            const data = {
                conflicted: conflicted,
                mystroServiceId: '' + props.mystroServiceID,
                programMetadata: {
                    episodeNumber: asset.episodeNumber,
                    episodeTitle: asset.title,
                    genres: asset.genres,
                    rating: asset.rating,
                    tmsProgramId: asset.tmsProgramIds[0],
                    tmsSeriesId: asset.tmsSeriesId,
                    title: asset.title
                },
                displayChannel: props.allChannelNumbers.includes(asset.displayChannel) ?
                    asset.displayChannel : props.allChannelNumbers[0],
                settings: settings,
                startUnixTimestampSeconds: Math.floor(props.startTime / 1000),
                tmsProgramId: props.tmsProviderProgramID,
                isNew: isNew
            };

            // seriestitle check is required to stub out case where seriesTitle and title are same
            // ex. ads like It's Supernatural has same seriesTitle and title.
            if (asset.isEpisode && asset.seriesTitle && asset.seriesTitle !== asset.title) {
                data.programMetadata.title = asset.seriesTitle;
                data.programMetadata.episodeTitle = asset.title;
                data.programMetadata.seasonNumber = asset.seasonNumber;
                data.programMetadata.episodeNumber = asset.episodeNumber;
            }

            return recordingViewModelDefinition.createInstance(data);
        }
    }
}());
