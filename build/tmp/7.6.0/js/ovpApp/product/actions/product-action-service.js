'use strict';

(function () {
    'use strict';

    productActionService.$inject = ["BookmarkService", "actionTypeMap", "$state", "cdvrService", "flickToService", "ChannelService", "$rootScope", "stbService", "rdvrService", "productService", "$log", "CONFIRM_BUTTON_TYPE", "modal", "dateFormat", "recordingViewModelDefinition", "remotePlayService", "alert", "config", "$q", "errorCodesService", "messages"];
    angular.module('ovpApp.product.productActionService', ['ui.router', 'ovpApp.services.bookmark', 'ovpApp.services.cdvr', 'ovpApp.services.flickTo', 'ovpApp.services.stbService', 'ovpApp.services.errorCodes', 'ovpApp.rdvr', 'ovpApp.rdvr.rdvrService', 'ovpApp.rdvr.scheduled', 'ovpApp.components.templatePopup.editScheduled', 'ovpApp.components.recordCdvrSeries', 'ovpApp.components.modal', 'ovpApp.components.alert', 'ovpApp.product.service', 'ovpApp.product.rental', 'ovpApp.product.rental-service', 'ovpApp.services.dateFormat', 'ovpApp.services.channel', 'ovpApp.remotePlayer', 'ovpApp.dataDelegate']).factory('productActionService', productActionService);

    /* @ngInject */
    function productActionService(BookmarkService, actionTypeMap, $state, cdvrService, flickToService, ChannelService, $rootScope, stbService, rdvrService, productService, $log, CONFIRM_BUTTON_TYPE, modal, dateFormat, recordingViewModelDefinition, remotePlayService, alert, config, $q, errorCodesService, messages) {

        var service = {
            executeAction: executeAction,
            getActionIcon: getActionIcon,
            getActionLabel: getActionLabel,
            getActionHoverText: getActionHoverText,
            getOtherWaysActionLabel: getOtherWaysActionLabel,
            getOtherWaysToWatchSrOnlyLabel: getOtherWaysToWatchSrOnlyLabel
        };

        return service;

        /////////////////////

        function executeAction(action, asset) {
            var stream = null;
            if (asset.streamList && angular.isDefined(action.streamIndex)) {
                stream = asset.streamList[action.streamIndex];
            }
            $rootScope.$broadcast('product:action', action, asset, stream);

            switch (action.actionType) {
                case actionTypeMap.addToWatchList.id:
                    BookmarkService.addToWatchLater(asset);
                    action.actionType = actionTypeMap.removeFromWatchList.id;
                    break;
                case actionTypeMap.removeFromWatchList.id:
                    BookmarkService.deleteFromWatchLater(asset);
                    action.actionType = actionTypeMap.addToWatchList.id;
                    break;
                case actionTypeMap.watchOnDemandIP.id:
                case actionTypeMap.resumeOnDemandIP.id:

                    if (stream.streamProperties.ondemandStreamType === 'TOD') {
                        $state.go('ovp.ondemand.playProduct', {
                            productID: stream.streamProperties.providerAssetID,
                            streamIndex: action.streamIndex
                        });
                    } else {
                        $state.go('ovp.ondemand.playProduct', { productID: stream.streamProperties.providerAssetID });
                    }
                    break;
                case actionTypeMap.watchLiveIP.id:
                    $state.go('ovp.livetv', { tmsid: stream.streamProperties.tmsGuideServiceId });
                    break;
                case actionTypeMap.resumeOnDemandOnTv.id:
                case actionTypeMap.watchOnDemandOnTv.id:
                    var bookmarkSeconds = 0;
                    if (stream.streamProperties && stream.streamProperties.bookmark && stream.streamProperties.bookmark.playMarkerSeconds) {
                        bookmarkSeconds = stream.streamProperties.bookmark.playMarkerSeconds;
                    }

                    var ipAction = asset.actions.find(function (a) {
                        return a.actionType === actionTypeMap.watchOnDemandIP.id || a.actionType === actionTypeMap.resumeOnDemandIP.id;
                    });

                    watchOnTv(asset, ipAction, action, function (stb) {
                        return flickToService.flickToVodQam(stream.streamProperties.providerAssetID, bookmarkSeconds, stb);
                    });
                    break;
                case actionTypeMap.watchLiveOnTv.id:

                    var currentStb = undefined;
                    stbService.getCurrentStbPromise().then(function (stb) {
                        currentStb = stb;
                    });
                    flickToService.tuneToChannel(asset.streamList[action.streamIndex]).then(function () {
                        var message = asset.title + (currentStb.name ? ' on ' + currentStb.name : '');
                        $rootScope.$broadcast('message:growl', 'Playing: ' + message);
                    }, function (error) {
                        $log.error(error.message, error);
                        $rootScope.$broadcast('message:growl', error.errorMessage + ' (' + error.errorCode + ')');
                    });
                    break;
                case actionTypeMap.playRecordingOnTv.id:
                    var recording = {
                        mystroServiceId: stream.streamProperties.mystroServiceID,
                        tmsProgramId: asset.tmsProgramIds[0],
                        startTime: Math.floor(stream.streamProperties.startTime / 1000)
                    };

                    watchOnTv(asset, null, action, function (stb) {
                        return rdvrService.playCompletedRecording(stb, recording);
                    });
                    break;
                case actionTypeMap.editRecording.id:
                case actionTypeMap.scheduleRecording.id:
                case actionTypeMap.cancelRecording.id:
                    stbService.getCurrentStbPromise().then(function (currentStb) {
                        if (currentStb.simpleRecordingsOnly) {
                            showSimpleScheduleRecordingPopup(currentStb, asset, action);
                        } else {
                            showScheduleRecordingPopup(asset, action);
                        }
                    });
                    break;
                case actionTypeMap.scheduleSeriesRecording.id:
                case actionTypeMap.editSeriesRecording.id:
                case actionTypeMap.cancelSeriesRecording.id:
                    stbService.getCurrentStbPromise().then(function (currentStb) {
                        if (currentStb.simpleRecordingsOnly) {
                            showSimpleSeriesRecordingPopup(currentStb, asset, action);
                        } else {
                            showEditSeriesRecordingPopup(asset, action);
                        }
                    });
                    break;
                case actionTypeMap.deleteRecording.id:

                    stbService.getCurrentStbPromise().then(function (currentStb) {
                        var stream = asset.streamList[action.streamIndex];
                        if (stream && stream.streamProperties) {
                            (function () {
                                var recording = recordingViewModelDefinition.createInstance({
                                    mystroServiceId: stream.streamProperties.mystroServiceID,
                                    tmsProgramId: asset.tmsProgramIds[0],
                                    startUnixTimestampSeconds: Math.floor(stream.streamProperties.startTime / 1000)
                                });

                                var message = asset.title + (currentStb.name ? ' on ' + currentStb.name : '');
                                rdvrService.deleteRecordings(currentStb, recording).then(function () {
                                    $rootScope.$broadcast('message:growl', 'Recording deleted: ' + message);
                                    $rootScope.$broadcast('update-dvr', recording, asset, action);
                                }, function (error) {
                                    $log.error(error);
                                    $rootScope.$broadcast('message:growl', 'Unable to delete recording ' + message);
                                    $rootScope.$broadcast('update-dvr', recording, asset, action);
                                });
                            })();
                        }
                    });
                    break;
                case actionTypeMap.cdvrPlayRecording.id:
                case actionTypeMap.cdvrResumeRecording.id:

                    $state.go('ovp.ondemand.playCdvr', {
                        isCdvr: true,
                        tmsProgramID: stream.streamProperties.cdvrRecording.tmsProgramId,
                        streamIndex: action.streamIndex
                    });
                    break;
                case actionTypeMap.cdvrScheduleRecording.id:
                    showCdvrScheduleRecordingConfirmation(asset, action, stream);
                    break;
                case actionTypeMap.cdvrScheduleSeriesRecording.id:
                    showRecordCdvrSeriesPopup(asset, action);
                    break;
                case actionTypeMap.cdvrCancelSeriesRecording.id:
                    showCdvrCancelSeriesRecordingConfirmation(asset, action);
                    break;
                case actionTypeMap.cdvrCancelRecording.id:
                    showCdvrCancelRecordingConfirmation(asset, action, stream);
                    break;
                case actionTypeMap.cdvrDeleteRecording.id:
                    showCdvrDeleteRecordingConfirmation(asset, action);
                    break;
                case actionTypeMap.cdvrScheduleSeriesRecordingNotAvailable.id:
                case actionTypeMap.cdvrScheduleRecordingNotAvailable.id:
                    // UNITSTR - MODAL_RECORD_INACTIVE
                    $rootScope.$broadcast('message:growl', 'This program is not recordable by your Cloud DVR service');
                    break;
                case actionTypeMap.otherWaysToWatch.id:
                    showOtherWaysToWatch(asset, action);
                    break;
                case actionTypeMap.rentOnDemand.id:
                    showRentalPopup(asset, action);
                    break;
                case actionTypeMap.watchTrailerIP.id:
                    $state.go('ovp.ondemand.playProduct', {
                        productID: stream.streamProperties.providerAssetID,
                        trailer: true,
                        streamIndex: stream.index
                    });
                    break;
                default:
                    $log.debug('action not implemented:', action.actionType);

            }
        }

        /* Watch On TV Picker */
        function watchOnTv(asset, ipAction, tvAction, callback) {
            if (config.remoteSessionControlEnabled) {
                modal.open({
                    component: 'stb-picker',
                    windowClass: 'ovp-watch-on-tv-picker-container',
                    showCloseIcon: false,
                    ariaDescribedBy: 'picker-description',
                    ariaLabelledBy: 'picker-label',
                    resolve: {
                        stbs: stbService.getSTBs().then(function (stbs) {
                            return stbs.filter(function (s) {
                                return s.flickable;
                            });
                        }),
                        onSelect: function onSelect() {
                            return callback;
                        },
                        title: function title() {
                            return 'Select TV to watch';
                        }
                    }
                }).result.then(function (stb) {
                    var options = { stb: stb, asset: asset, ipAction: ipAction, tvAction: tvAction };
                    // Store remote play related data
                    remotePlayService.remotePlay(options);

                    // Analytics (switchScreen)
                    $rootScope.$broadcast('Analytics:switchScreen', {
                        switchScreenId: stb.macAddress
                    });

                    $state.go('ovp.playRemote', options);
                }, function (val) {
                    var error = val.error;
                    var stb = val.stb;

                    if (error && stb) {
                        $log.error(error);

                        var errorCode = 'WCM-1001';
                        var message = errorCodesService.getAlertForCode(errorCode, {
                            TITLE: asset.title,
                            STB: stb.name || undefined
                        });

                        // Analytics (switchScreen)
                        $rootScope.$broadcast('Analytics:switchScreen', {
                            switchScreenId: stb ? stb.macAddress : 'unknown',
                            error: error,
                            errorCode: errorCode,
                            errorMessage: message
                        });

                        return alert.open({
                            message: message.message,
                            buttonText: message.buttonText
                        });
                    }
                });
            } else {
                stbService.getCurrentStbPromise().then(function (currentStb) {
                    callback(currentStb).then(function () {
                        var message = messages.getMessageForCode('MSG-9088', {
                            TITLE: asset.title,
                            STB: currentStb.name || undefined
                        });
                        $rootScope.$broadcast('message:growl', message);

                        // Analytics (switchScreen)
                        $rootScope.$broadcast('Analytics:switchScreen', {
                            switchScreenId: currentStb.macAddress
                        });
                    }, function (error) {
                        $log.error(error);
                        var errorCode = 'WCM-1001';
                        var message = errorCodesService.getMessageForCode(errorCode, {
                            TITLE: asset.title,
                            STB: currentStb.name || undefined
                        });
                        $rootScope.$broadcast('message:growl', message);

                        // Analytics (switchScreen)
                        $rootScope.$broadcast('Analytics:switchScreen', {
                            switchScreenId: currentStb ? currentStb.macAddress : 'unknown',
                            errorCode: errorCode,
                            errorMessage: message
                        });
                    });
                });
            }
        }

        /**
         * Format the information required to display the recording popup.
         */
        function showEditSeriesRecordingPopup(asset, action) {
            var recordingStream = undefined,
                recordingEpisode = undefined,
                recordingSeason = undefined,
                recordingSettings = undefined;

            if (action.seasonIndex !== undefined && action.episodeIndex !== undefined && action.streamIndex !== undefined) {
                recordingSeason = asset.seasons[action.seasonIndex];
                recordingEpisode = recordingSeason.episodes[action.episodeIndex];
                recordingStream = recordingEpisode.streamList[action.streamIndex];

                recordingSettings = rdvrService.getSeriesRecordingSettings({
                    series: asset,
                    episode: recordingEpisode,
                    stream: recordingStream,
                    isNew: action.actionType !== 'editSeriesRecording'
                });

                modal.open({
                    component: 'EditScheduled',
                    resolve: {
                        scheduledRecording: recordingSettings,
                        seriesOnly: true
                    }
                }).result.then(function (result) {
                    if (result && result.reason === 'update-schedule') {
                        $rootScope.$broadcast('message:growl', messages.getMessageForCode('MSG-9089'));
                    } else if (result && result.reason === 'cancel-schedule') {
                        $rootScope.$broadcast('message:growl', messages.getMessageForCode('MSG-9090'));
                    }

                    if (result && result.recording) {
                        $rootScope.$broadcast('update-dvr', result.recording, asset, action);
                    }
                });
            } else {
                $log.error('Unable to determine the correct stream to use when recording action:', action);
            }
        }

        // Simple scheduled recording popup
        function showSimpleScheduleRecordingPopup(stb, asset, action) {
            // For legacy user we will always show recording dialog, user will not be able to cancel or edit
            var recordingSettings = undefined,
                displayDate = undefined;
            recordingSettings = rdvrService.getEventRecordingSettings({
                asset: asset,
                stream: asset.streamList[action.streamIndex],
                isNew: true
            });

            displayDate = dateFormat.absolute.expanded.atTime(new Date(parseInt(recordingSettings.startTime * 1000)));

            var options = {
                okLabel: CONFIRM_BUTTON_TYPE.YES,
                cancelLabel: CONFIRM_BUTTON_TYPE.NO,
                preOkMessage: messages.getMessageForCode('MSG-9092', {
                    TITLE: asset.title,
                    DATE: displayDate,
                    CHANNEL: recordingSettings.displayChannel
                }),
                postOkMessage: messages.getMessageForCode('MSG-9091', {
                    TITLE: asset.title
                }),
                okAction: function okAction() {
                    return rdvrService.scheduleRecording(stb, recordingSettings);
                },
                getErrorString: function getErrorString() {
                    // UNITSTR - RDVR_ERROR_RECORDING_FAIL
                    return errorCodesService.getMessageForCode('WCM-1400', {
                        TITLE: asset.title
                    });
                }
            };

            modal.open({
                component: 'confirm',
                resolve: { options: options }
            });
        }

        function showScheduleRecordingPopup(asset, action) {
            var recordingSettings = undefined;
            var stream = asset.streamList[action.streamIndex];
            var isNew = action.actionType !== 'editRecording' && action.actionType !== 'cancelRecording';
            recordingSettings = rdvrService.getEventRecordingSettings({
                asset: asset,
                stream: stream,
                isNew: isNew,
                settings: stream && stream.streamProperties && stream.streamProperties.rdvrRecording && stream.streamProperties.rdvrRecording.settings
            });

            modal.open({
                component: 'EditScheduled',
                resolve: {
                    scheduledRecording: recordingSettings,
                    seriesOnly: false
                }
            }).result.then(function (result) {
                if (result && result.reason === 'update-schedule') {
                    $rootScope.$broadcast('message:growl', messages.getMessageForCode('MSG-9089'));
                } else if (result && result.reason === 'cancel-schedule') {
                    $rootScope.$broadcast('message:growl', messages.getMessageForCode('MSG-9090'));
                }

                if (result.recording) {
                    $rootScope.$broadcast('update-dvr', result.recording, asset, action);
                }
            });
        }

        // Simple series recording popup
        function showSimpleSeriesRecordingPopup(stb, asset, action) {
            // For legacy user we will always show series recording dialog, user will not be able to cancel or edit
            var recordingStream = undefined,
                recordingEpisode = undefined,
                recordingSeason = undefined,
                recordingSettings = undefined,
                displayDate = undefined;

            if (action.seasonIndex !== undefined && action.episodeIndex !== undefined && action.streamIndex !== undefined) {
                try {
                    recordingSeason = asset.seasons[action.seasonIndex];
                    recordingEpisode = recordingSeason.episodes[action.episodeIndex];
                    recordingStream = recordingEpisode.streamList[action.streamIndex];
                    recordingSettings = rdvrService.getSeriesRecordingSettings({
                        series: asset,
                        episode: recordingEpisode,
                        stream: recordingStream,
                        isNew: action.actionType !== 'editSeriesRecording'
                    });
                    displayDate = dateFormat.absolute.expanded.atTime(new Date(parseInt(recordingSettings.startTime * 1000)));

                    var options = {
                        okLabel: CONFIRM_BUTTON_TYPE.YES,
                        cancelLabel: CONFIRM_BUTTON_TYPE.NO,
                        preOkMessage: messages.getMessageForCode('MSG-9092', {
                            TITLE: asset.title,
                            DATE: displayDate,
                            CHANNEL: recordingSettings.displayChannel
                        }),
                        postOkMessage: messages.getMessageForCode('MSG-9091', {
                            TITLE: asset.title
                        }),
                        okAction: function okAction() {
                            return rdvrService.scheduleRecording(stb, recordingSettings);
                        },
                        getErrorString: function getErrorString() {
                            // UNITSTR - RDVR_ERROR_RECORDING_FAIL
                            return errorCodesService.getMessageForCode('WCM-1400', {
                                TITLE: asset.title
                            });
                        }
                    };

                    modal.open({
                        component: 'confirm',
                        resolve: { options: options }
                    });
                } catch (e) {
                    $rootScope.$broadcast('message:growl', 'We’re sorry, we were unable to schedule your recording. Please try again later.');
                }
            }
        }

        function showCdvrScheduleRecordingConfirmation(asset, action, stream) {
            var allChans = stream.streamProperties && stream.streamProperties.allChannelNumbers;
            var chanToRecord = allChans && allChans.length && (allChans.includes(asset.displayChannel) ? asset.displayChannel : allChans[0]);
            var title = asset.seriesTitle || asset.title; // Prefer series title if available

            var options = {
                okLabel: CONFIRM_BUTTON_TYPE.YES,
                cancelLabel: CONFIRM_BUTTON_TYPE.NO,
                preOkMessage: messages.getMessageForCode('MSG-9092', {
                    TITLE: title,
                    DATE: productService.getCdvrDateText(asset, action),
                    CHANNEL: chanToRecord || undefined
                }),
                postOkMessage: messages.getMessageForCode('MSG-9091', {
                    TITLE: asset.title
                }),
                okAction: function okAction() {

                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToRecord',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'confirm',
                        modalName: 'cdvrConfirmRecord',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });

                    return cdvrService.scheduleRecording(action, stream).then(function () {
                        $rootScope.$broadcast('update-dvr', {}, /* no schedule options at this point */
                        asset, action);
                    }, function (err) {
                        // Analytics
                        $rootScope.$broadcast('Analytics:cdvr-record-failed', asset, action, {}, {
                            error: err,
                            errorCode: 'WCD-1400',
                            errorMessage: errorCodesService.getMessageForCode('WCD-1400', {
                                TITLE: asset.title
                            })
                        });
                        return $q.reject();
                    });
                },
                cancelAction: function cancelAction() {
                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToRecord',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'cancel',
                        modalName: 'cdvrConfirmRecord',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });
                },
                getErrorString: function getErrorString() {
                    // UNITSTR - CDVR_ERROR_RECORDING_FAIL
                    return errorCodesService.getMessageForCode('WCM-1400', {
                        TITLE: title
                    });
                },
                ariaLabel: 'Record ' + (asset.isEpisode ? 'episode,' : 'movie,'),
                ariaDescription: messages.getMessageForCode('MSG-9092', {
                    TITLE: title,
                    DATE: productService.getCdvrDateText(asset, action),
                    CHANNEL: chanToRecord || undefined
                })
            };

            modal.open({
                component: 'confirm',
                ariaDescribedBy: 'descriptionBlockText',
                ariaLabelledBy: 'labelText',
                resolve: { options: options }
            });

            // Analytics
            $rootScope.$emit('Analytics:modal-view', {
                context: 'cdvr',
                modalName: 'cdvrConfirmRecord',
                featureType: 'cdvrRequestToRecord',
                featureStepName: 'cdvrConfirmRecord',
                featureCurrentStep: 2,
                modalType: 'options',
                modalText: options.preOkMessage
            });
        }

        function showCdvrCancelSeriesRecordingConfirmation(asset, action) {
            var options = {
                okLabel: CONFIRM_BUTTON_TYPE.YES,
                cancelLabel: CONFIRM_BUTTON_TYPE.NO,
                preOkMessage: messages.getMessageForCode('MSG-9093'),
                postOkMessage: messages.getMessageForCode('MSG-9094', {
                    TITLE: asset.title
                }),
                okAction: function okAction() {

                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToCancel',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'confirm',
                        modalName: 'cdvrConfirmCancellation',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });

                    return cdvrService.cancelSeriesRecording(action).then(function () {
                        $rootScope.$broadcast('update-dvr', {}, /* no schedule options at this point */
                        asset, action);
                    }, function (err) {

                        var errorCode = 'WCD-1003';
                        var message = errorCodesService.getMessageForCode(errorCode);

                        // Analytics
                        $rootScope.$broadcast('Analytics:cdvr-cancel-recording-failed', asset, action, {}, {
                            error: err,
                            errorCode: errorCode,
                            errorMessage: message
                        });
                        return $q.reject();
                    });
                },
                ariaLabel: 'Cancel recording',
                ariaDescription: 'Are you sure you want to cancel all recordings for this series?',

                cancelAction: function cancelAction() {
                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToCancel',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'cancel',
                        modalName: 'cdvrConfirmCancellation',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });
                },
                getErrorString: function getErrorString() {
                    // UNISTR - CDVR_ERROR_CANCEL_RECORDING_FAIL
                    return errorCodesService.getMessageForCode('WCM-1400', {
                        TITLE: asset.title
                    });
                }
            };

            modal.open({
                component: 'confirm',
                ariaDescribedBy: 'descriptionBlockText',
                ariaLabelledBy: 'labelText',
                resolve: { options: options }
            });

            // Analytics
            $rootScope.$emit('Analytics:modal-view', {
                context: 'cdvr',
                featureType: 'cdvrRequestToCancel',
                featureStepName: 'cdvrConfirmCancellation',
                featureCurrentStep: 2,
                modalName: 'cdvrConfirmCancellation',
                modalType: 'options',
                modalText: options.preOkMessage
            });
        }

        function showCdvrCancelRecordingConfirmation(asset, action, stream) {
            var title = asset.title;
            var allChans = stream.streamProperties && stream.streamProperties.allChannelNumbers;
            var chanToRecord = allChans && allChans.length && (allChans.includes(asset.displayChannel) ? asset.displayChannel : allChans[0]);

            var options = {
                okLabel: CONFIRM_BUTTON_TYPE.YES,
                cancelLabel: CONFIRM_BUTTON_TYPE.NO,
                preOkMessage: messages.getMessageForCode('MSG-9095', {
                    TITLE: title,
                    DATE: productService.getCdvrDateText(asset, action),
                    CHANNEL: chanToRecord || undefined
                }),
                postOkMessage: messages.getMessageForCode('MSG-9094', {
                    TITLE: asset.title
                }),
                okAction: function okAction() {

                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToCancel',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'confirm',
                        modalName: 'cdvrConfirmCancellation',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });

                    return cdvrService.cancelRecording(action).then(function () {
                        $rootScope.$broadcast('update-dvr', {}, /* no schedule options at this point */
                        asset, action);
                    }, function (err) {

                        var errorCode = 'WCM-1003';
                        var message = errorCodesService.getAlertForCode(errorCode);

                        // Analytics
                        $rootScope.$broadcast('Analytics:cdvr-cancel-recording-failed', asset, action, {}, {
                            error: err,
                            errorCode: errorCode,
                            errorMessage: message
                        });

                        return $q.reject();
                    });
                },
                ariaLabel: 'Cancel recording,',
                ariaDescription: 'Would you like to cancel ' + title + ' on ' + productService.getCdvrDateText(asset, action) + (chanToRecord !== undefined ? ' on Channel ' + chanToRecord : '') + ', ' + asset.network.callsign + '?',

                cancelAction: function cancelAction() {
                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToCancel',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'cancel',
                        modalName: 'cdvrConfirmCancellation',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });
                },
                getErrorString: function getErrorString() {
                    // UNISTR - CDVR_ERROR_CANCEL_RECORDING_FAIL
                    return errorCodesService.getMessageForCode('WCM-1400', {
                        TITLE: asset.title
                    });
                }
            };

            modal.open({
                component: 'confirm',
                ariaDescribedBy: 'descriptionBlockText',
                ariaLabelledBy: 'labelText',
                resolve: { options: options }
            });

            // Analytics
            $rootScope.$emit('Analytics:modal-view', {
                context: 'cdvr',
                featureType: 'cdvrRequestToCancel',
                featureStepName: 'cdvrConfirmCancellation',
                featureCurrentStep: 2,
                modalName: 'cdvrConfirmCancellation',
                modalType: 'options',
                modalText: options.preOkMessage
            });
        }

        function showCdvrDeleteRecordingConfirmation(asset, action) {
            var options = {
                okLabel: CONFIRM_BUTTON_TYPE.YES,
                cancelLabel: CONFIRM_BUTTON_TYPE.NO,
                preOkMessage: messages.getMessageForCode('MSG-9096', {
                    TITLE: asset.title
                }),
                postOkMessage: messages.getMessageForCode('MSG-9097', {
                    TITLE: asset.title
                }),
                okAction: function okAction() {

                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToDelete',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'confirm',
                        modalName: 'cdvrConfirmDeletion',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });

                    return cdvrService.deleteRecording(action).then(function () {
                        $rootScope.$broadcast('update-dvr', {}, /* no schedule options at this point */
                        asset, action);
                    }, function (err) {

                        var errorCode = 'WCD-1012';
                        var message = errorCodesService.getMessageForCode(errorCode);

                        // Analytics
                        $rootScope.$broadcast('Analytics:cdvr-delete-recording-failed', asset, action, {
                            error: err,
                            errorCode: errorCode,
                            errorMessage: message
                        });

                        return $q.reject();
                    });
                },
                ariaLabel: 'Delete recording,',
                ariaDescription: 'Would you like to delete ' + asset.title + '?',

                cancelAction: function cancelAction() {
                    // Analytics
                    $rootScope.$emit('Analytics:select', {
                        context: 'cdvr',
                        featureType: 'cdvrRequestToDelete',
                        featureCurrentStep: 3,
                        elementStandardizedName: 'cancel',
                        modalName: 'cdvrConfirmDeletion',
                        modalType: 'options',
                        asset: asset,
                        action: action
                    });
                },
                getErrorString: function getErrorString() {
                    // UNISTR - CDVR_ERROR_DELETE_FAIL
                    return errorCodesService.getMessageForCode('WCM-1012');
                }
            };

            modal.open({
                component: 'confirm',
                ariaDescribedBy: 'descriptionBlockText',
                ariaLabelledBy: 'labelText',
                resolve: { options: options }
            });

            // Analytics
            $rootScope.$emit('Analytics:modal-view', {
                context: 'cdvr',
                featureType: 'cdvrRequestToDelete',
                featureStepName: 'cdvrConfirmDeletion',
                featureCurrentStep: 2,
                modalName: 'cdvrConfirmDeletion',
                modalType: 'options',
                modalText: options.preOkMessage
            });
        }

        /**
         * Format the information required to display the recording popup.
         */
        function showRecordCdvrSeriesPopup(asset, action) {
            var options = {
                asset: asset,
                action: action,
                preferredTmsGuideId: asset.cdvrChannelPickerTmsGuideIds[0],
                channels: ChannelService.getChannels() // to cache channels for screen reader
            };

            if (action.seasonIndex !== undefined && action.episodeIndex !== undefined && action.streamIndex !== undefined) {
                var recordingSeason = asset.seasons[action.seasonIndex];
                var recordingEpisode = recordingSeason.episodes[action.episodeIndex];
                var recordingStream = recordingEpisode.streamList[action.streamIndex];
                options.preferredTmsGuideId = recordingStream.streamProperties.tmsGuideServiceId;
            }

            modal.open({
                component: 'recordCdvrSeries',
                ariaLabelledBy: 'record-cdvr-series-title',
                ariaDescribedBy: 'record-cdvr-series-description',
                resolve: options
            });

            // Analytics
            $rootScope.$emit('Analytics:modal-view', {
                context: 'cdvr',
                modalName: 'cdvrConfirmRecord',
                modalType: 'options',
                modalText: options.preOkMessage,
                featureType: 'cdvrRequestToRecord',
                featureStepName: 'cdvrConfirmRecord',
                featureCurrentStep: 2,
                elementStandardizedName: 'confirm',
                asset: asset,
                action: action
            });
        }

        function showOtherWaysToWatch(asset) {
            modal.open({
                size: 'xl',
                component: 'otherWaysPopup',
                ariaLabelledBy: 'ariaLabelledByText',
                resolve: { asset: asset }
            });
        }

        function showRentalPopup(asset, action) {
            var options = {
                asset: asset,
                action: action
            };

            var modalPromise = modal.open({
                component: 'productRental',
                ariaLabelledBy: 'product-rental-title',
                ariaDescribedBy: 'product-rental-description',
                resolve: { options: options }
            });

            modalPromise.result.then(function () {
                // Do nothing; pressing the confirm or cancel buttons is handled elsewhere.
            }, function () {
                // Modal dismissed, rejecting the promise.
                try {
                    // Analytics: user cancelled confirmation dialog by clicking
                    // the 'x' or clicking outside the modal.
                    $rootScope.$broadcast('Analytics:select', {
                        source: 'productRentalConfirmDialog',
                        ignoreIfPurchaseStopIsSeen: true,
                        category: 'navigation',
                        context: 'tvodFlow',
                        featureStepName: 'rentConfirmation',
                        pageName: 'rentConfirmation',
                        elementUiName: 'cancel',
                        pageSectionName: 'conversionArea',
                        elementStandardizedName: 'cancel',
                        triggeredBy: 'user',
                        operationType: 'buttonClick',
                        featureCurrentStep: 4
                    });
                    $rootScope.$emit('Analytics:tvod-purchase-stop', { // cancelled
                        source: 'productRentalConfirmDialog',
                        ignoreIfPurchaseStopIsSeen: true,
                        context: 'tvodFlow',
                        success: false,
                        triggeredBy: 'user',
                        asset: asset,
                        featureCurrentStep: 5
                    });
                } catch (ex) {
                    $log.error('Error', ex);
                }
            });
        }

        function getActionIcon(asset, action) {
            return getParam(asset, action, 'icon');
        }

        function getActionLabel(asset, action) {
            return getParam(asset, action, 'label');
        }

        function getActionHoverText(asset, action) {
            return getParam(asset, action, 'hoverText');
        }

        function getOtherWaysToWatchSrOnlyLabel(asset, action) {
            return getParam(asset, action, 'otherWaysToWatchSrOnlyLabel');
        }

        function getOtherWaysActionLabel(asset, action) {
            var label = getParam(asset, action, 'otherWaysLabel');
            if (label === undefined) {
                label = getActionLabel(asset, action);
            }

            return label;
        }

        function getParam(asset, action, parameter) {
            if (action && action.actionType && actionTypeMap[action.actionType]) {
                var val = actionTypeMap[action.actionType][parameter];
                if (angular.isFunction(val) && asset) {
                    val = val(asset, action);
                }
                return val;
            }
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/actions/product-action-service.js.map
