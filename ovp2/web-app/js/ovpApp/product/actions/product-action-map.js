(function () {
    'use strict';

    angular.module('ovpApp.product.productActionService')
    .factory('actionTypeMap', actionTypeMap);

    /* @ngInject */
    function actionTypeMap(dateFormat, messages, productService) {
        return {
            watchOnDemandIP: {
                id: 'watchOnDemandIP',
                icon: playOrStartOver,
                label: function (asset, action) {
                    // 'On Demand',
                    let stream =  asset.streamList[action.streamIndex];
                    if (stream.streamProperties.ondemandStreamType === 'TOD') {
                        return 'Play';
                    } else {
                        return 'Watch On\xa0Demand';
                    }
                },
                otherWaysWatchOnTVLabel: 'On Demand',
                oohRestricted: true,
                hoverText: getRentPlayHoverText,
                otherWaysToWatchSrOnlyLabel: function () {
                    return 'Watch On\xa0Demand';
                }
            },
            resumeOnDemandIP: {
                id: 'resumeOnDemandIP',
                icon: playOrStartOver,
                label: 'Resume',
                oohRestricted: true,
                hoverText: function (asset) {
                    var position, bm = asset.bookmark;
                    if (!bm) {
                        return '';
                    } else {
                        position = dateFormat.elapsedAndDuration(bm.playMarkerSeconds, bm.runtimeSeconds);
                        return `Continue watching at ${position}`;
                    }
                },
                otherWaysWatchOnTVLabel: 'On Demand'
            },
            addToWatchList: {
                id: 'addToWatchList',
                icon: 'plus-icon',
                label: 'Watch Later',
                hoverText: messages.getMessageForCode('MSG-9064')
            },
            removeFromWatchList: {
                id: 'removeFromWatchList',
                icon: 'remove-icon',
                label: 'Remove',
                hoverText: messages.getMessageForCode('MSG-9065')
            },
            otherWaysToWatch: {
                id: 'otherWaysToWatch',
                icon: 'ellipsis-horizontal-icon',
                label: 'Other Ways To Watch'
            },
            scheduleRecording: {
                id: 'scheduleRecording',
                icon: 'record-icon',
                label: function (asset) {
                    return asset.isEpisode ? 'Record Episode' : 'Record';
                },
                otherWaysWatchOnTVLabel: 'Live TV',
                hoverText: function (asset, action) {
                    //This is only to schedule a single recording
                    if (action.streamIndex >= 0 && asset && asset.streamList) {
                        let recordStream = asset.streamList[action.streamIndex];
                        let dateString = dateFormat.absolute.expanded.atTime(
                            new Date(parseInt(recordStream.streamProperties.startTime, 10))
                        );

                        return `Record this show on ${dateString}`;

                    }
                }
            },
            watchLiveIP: {
                id: 'watchLiveIP',
                icon: 'play-large-icon',
                label: 'Watch Live',
                otherWaysWatchOnTVLabel: 'On Now',
                oohRestricted: true,
                hoverText: function (asset, action) {
                    if (action.streamIndex >= 0 && asset && asset.streamList) {
                        let recordStream = asset.streamList[action.streamIndex];
                        let streamStart = parseInt(recordStream.streamProperties.startTime, 10);
                        let streamEnd = parseInt(recordStream.streamProperties.endTime, 10);
                        let dateString;

                        if (isOnNow(recordStream)) {
                            dateString = 'On now';
                        } else {
                            dateString = dateFormat.absolute.expanded(streamStart);
                        }

                        let timeString = `${dateFormat.timeOfDay(streamStart)} - ${dateFormat.timeOfDay(streamEnd)}`;

                        return `${dateString}, ${timeString} on ${recordStream.network.name}`;
                    }
                }
            },
            watchOnDemandOnTv: {
                id: 'watchOnDemandOnTv',
                icon: 'flick-icon',
                label: 'Watch on TV',
                hoverText: messages.getMessageForCode('MSG-9074'),
                otherWaysWatchOnTVLabel: 'On Demand'
            },
            resumeOnDemandOnTv: {
                id: 'resumeOnDemandOnTv',
                icon: 'flick-icon',
                label: 'Resume On TV',
                hoverText: messages.getMessageForCode('MSG-9075'),
                otherWaysWatchOnTVLabel: 'Resume On TV'
            },
            scheduleSeriesRecording: {
                id: 'scheduleSeriesRecording',
                icon: 'record-series-icon',
                label: 'Record',
                hoverText: messages.getMessageForCode('MSG-9077')
            },
            editSeriesRecording: {
                id: 'editSeriesRecording',
                icon: 'wrench-icon',
                label: 'Options',
                hoverText: messages.getMessageForCode('MSG-9063')
            },
            editRecording: {
                id: 'editRecording',
                icon: 'wrench-icon',
                label: 'Options',
                hoverText: messages.getMessageForCode('MSG-9063')
            },
            futureAiring: {
                id: 'futureAiring',
                icon: '',
                label: '',
                otherWaysWatchOnTVLabel: 'Future Airing'
            },
            deleteRecording: {
                id: 'deleteRecording',
                icon: 'trash-icon',
                label: 'Delete',
                hoverText: messages.getMessageForCode('MSG-9062')
            },
            playRecordingOnTv: {
                id: 'playRecordingOnTv',
                icon: 'flick-icon',
                label: 'Watch on TV',
                hoverText: messages.getMessageForCode('MSG-9076'),
                otherWaysWatchOnTVLabel: 'DVR'
            },
            watchLiveOnTv: {
                id: 'watchLiveOnTv',
                icon: 'flick-icon',
                label: 'Watch on TV',
                hoverText: messages.getMessageForCode('MSG-9073'),
                otherWaysWatchOnTVLabel: 'On Now'
            },
            cancelSeriesRecording: {
                id: 'cancelSeriesRecording',
                icon: 'remove-icon',
                label: 'Cancel',
                hoverText: messages.getMessageForCode('MSG-9078')
            },
            cancelRecording: {
                id: 'cancelRecording',
                icon: 'remove-icon',
                label: 'Cancel',
                hoverText: function (asset, action) {
                    //This is only to cancel a single recording
                    if (action.streamIndex >= 0 && asset && asset.streamList) {
                        let recordStream = asset.streamList[action.streamIndex];
                        let dateString = dateFormat.absolute.expanded.atTime(
                            new Date(parseInt(recordStream.streamProperties.startTime, 10))
                        );

                        return `Cancel the scheduled recording on ${dateString}`;

                    }
                }
            },
            cdvrPlayRecording: {
                id: 'cdvrPlayRecording',
                icon: playOrStartOver,
                label: 'Watch Recording',   // UNISTR DVR
                otherWaysLabel: 'Watch',   // UNISTR WATCH
                hoverText: function (asset, action) {
                    if (asset && asset.isOnNow && !asset.bookmark) {
                        // UNISTR BUTTON_ROLLOVER_RESTART_DVR
                        return 'Watch your recording from the beginning on your DVR';
                    } else {
                        // UNISTR BUTTON_ROLLOVER_PLAY
                        return 'Recorded on ' + productService.getCdvrDateText(asset, action);
                    }
                },
                otherWaysToWatchSrOnlyLabel: function () {
                    return 'Watch your recording';
                },
                otherWaysWatchOnTVLabel: 'DVR'  // UNISTR DVR
            },
            cdvrResumeRecording: {
                id: 'cdvrResumeRecording',
                icon: 'play-large-icon',
                label: 'Resume',    // UNISTR RESUME
                hoverText: function (asset, action) {
                    let recordedStream = asset.streamList[action.streamIndex];
                    let bm = recordedStream.bookmark;
                    let position;

                    if (!bm) {
                        return '';
                    } else {
                        position = dateFormat.elapsedAndDuration(bm.playMarkerSeconds, bm.runtimeSeconds);
                        // UNISTR BUTTON_ROLLOVER_RESUME
                        return `Resume watching at ${position}`;
                    }
                },
                otherWaysWatchOnTVLabel: 'DVR'  // UNISTR DVR
            },
            cdvrScheduleRecording: {
                id: 'cdvrScheduleRecording',
                icon: 'record-icon',
                label: function (asset) {
                    return asset.isEpisode ? 'Record Episode' : 'Record'; // UNISTR RECORD
                },
                hoverText: function (asset, action) {
                    // UNISTR BUTTON_ROLLOVER_RECORD_SINGLE
                    return 'Record this show on ' + productService.getCdvrDateText(asset, action);
                },
                otherWaysWatchOnTVLabel: 'Live TV'
            },
            cdvrScheduleRecordingNotAvailable: {
                id: 'cdvrScheduleRecordingNotAvailable',
                icon: 'record-icon',
                label: 'Record',    // UNISTR RECORD
                // UNISTR BUTTON_ROLLOVER_RECORD_INACTIVE
                hoverText: 'Recording is currently unavailable for programs on this network',
                disabled: true  // Shows but in a disabled state
            },
            cdvrCancelRecording: {
                id: 'cdvrCancelRecording',
                icon: 'remove-icon',
                label: 'Cancel',   // UNISTR CANCEL
                hoverText: function (asset, action) {
                    // UNISTR BUTTON_ROLLOVER_RECORD_CANCEL
                    return 'Cancel the scheduled recording on ' + productService.getCdvrDateText(asset, action);
                },
                otherWaysWatchOnTVLabel: 'Live TV'
            },
            cdvrScheduleSeriesRecording: {
                id: 'cdvrScheduleSeriesRecording',
                icon: 'record-series-icon',
                label: 'Record Series',    // UNISTR SERIES_RECORD
                hoverText: 'Record the series' // BUTTON_ROLLOVER_RECORD_SERIES
            },
            cdvrScheduleSeriesRecordingNotAvailable: {
                id: 'cdvrScheduleSeriesRecordingNotAvailable',
                icon: 'record-series-icon',
                label: 'Record',    // UNISTR RECORD
                // UNISTR BUTTON_ROLLOVER_RECORD_INACTIVE
                hoverText: 'Recording is currently unavailable for programs on this network',
                disabled: true  // Shows but in a disabled state
            },
            cdvrCancelSeriesRecording: {
                id: 'cdvrCancelSeriesRecording',
                icon: 'remove-icon',
                label: 'Cancel Series',    // UNISTR SERIES_CANCEL
                hoverText: 'Cancel recording for the series' // BUTTON_ROLLOVER_RECORD_CANCEL_SERIES
            },
            cdvrDeleteRecording: {
                id: 'cdvrDeleteRecording',
                icon: 'trash-icon',
                label: 'Delete Recording',   // UNISTR DELETE
                hoverText: 'Permanently delete this recorded show', // UNISTR BUTTON_ROLLOVER_RECORD_DELETE
                otherWaysWatchOnTVLabel: 'DVR'  // UNISTR DVR
            },
            rentOnDemand: {
                id: 'rentOnDemand',
                icon: 'ticket-icon',
                label: function (asset, action) {
                    if (asset && action && action.streamIndex >= 0 && !asset.isComplexOffering) {
                        let stream = asset.streamList[action.streamIndex];
                        if (stream.streamProperties.tvodEntitlement) {
                            return 'Play';
                        } else if (asset.price === 0 || asset.price === 0.00) {
                            return 'Free';
                        } else {
                            return 'Rent $' + asset.price;
                        }
                    }
                    return 'Rent';
                },
                hoverText: getRentPlayHoverText
            },
            watchTrailerIP: {
                id: 'watchTrailerIP',
                icon: 'play-large-icon',
                label: 'Play Trailer',
                hoverText: messages.getMessageForCode('MSG-9061')
            },

            //Unhandled events
            watchTrailerOnTV: {}, //Not used yet
            subscribeUpSell: {}
        };

        /////////

        function isOnNow(stream) {
            let now = Date.now();
            return stream && stream.streamProperties.startTime <= now && stream.streamProperties.endTime > now;
        }

        function getRentPlayHoverText(asset, action) {
            if (asset && action && action.streamIndex >= 0) {
                let stream = asset.streamList[action.streamIndex];
                if (stream.streamProperties.ondemandStreamType === 'TOD') {
                    if (stream.streamProperties.tvodEntitlement) {
                        //dateFormat.relative.standard(new Date())
                        let endTime = stream.streamProperties
                            .tvodEntitlement.rentalEndTimeUtcSeconds;
                        let time = dateFormat.relative.expanded.atTime(new Date(endTime * 1000));
                        return `Watch rental until ${time}`;
                    } else {
                        if (!asset.isComplexOffering) {
                            return 'Rent for $' + asset.price +
                                '. Available for ' + stream.streamProperties.rentalWindowInHours +
                                ' hours.';
                        } else {
                            let cheapestStream = asset.streamList
                                .filter(str => str.streamProperties.ondemandStreamType === 'TOD')
                                .filter(str => str.streamProperties.price > 0)
                                .sort((a, b) => a.streamProperties.price - b.streamProperties.price)
                                .shift();
                            return 'Rent from $' + cheapestStream.streamProperties.price +
                                '. Available for ' + cheapestStream.streamProperties.rentalWindowInHours +
                                ' hours.';
                        }
                    }
                } else {
                    //Free OnDemand
                    let d = new Date(0);
                    d.setUTCSeconds(stream.streamProperties.endTime / 1000);
                    return 'Available until ' + dateFormat.relative.short(d);
                }
            }
        }

        function playOrStartOver(asset) {
            if (asset && asset.isOnNow && !asset.bookmark) {
                return 'restart-icon';
            } else {
                return 'play-large-icon';
            }
        }
    }
}());
