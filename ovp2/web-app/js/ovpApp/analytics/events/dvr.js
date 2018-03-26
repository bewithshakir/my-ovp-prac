(function () {
    'use strict';

    angular.module('ovpApp.analytics.events.dvr', [
        'ovpApp.analytics.analyticsService'
    ])
    .factory('analyticsDvr', dvrEvents)
    .run(function loadHandler(analyticsDvr) {
            return analyticsDvr;
        });

    /* @ngInject */
    function dvrEvents($rootScope, analyticsService, $log, analyticsAssetHelper) {

        function cdvrRequestToRecord(asset, action, settings, errorData) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: cdvrRequestToRecord', asset, action, settings, errorData);
                }

                let data = {
                    success: (errorData && errorData.error ? false : true),
                    context: 'cdvr',
                    featureName: 'cdvr',
                    featureCurrentStep: 4,
                    featureStepName: 'requestToRecord',
                    featureNumberOfSteps: 100,
                    featureType: 'cdvrRequestToRecord',
                    recordingOptions: analyticsAssetHelper.extractRecordingOptions(asset)
                };

                if (errorData) {
                    data.errorType = 'cdvr';
                    data.errorCode = errorData.errorCode;
                    data.errorMessage = errorData.errorMessage;
                    data.clientErrorCode = extractErrorCode(errorData.error);
                }

                if (action && action.actionType === 'cdvrScheduleRecording') {
                    data.recordingOptions.recordingScheduleType = 'Single';
                } else if (action && action.actionType === 'cdvrScheduleSeriesRecording') {
                    data.recordingOptions.recordingScheduleType = 'Series';
                }

                // Extend recordingOption with settings, if available.
                if (settings) {
                    data.recordingOptions = angular.extend(data.recordingOptions,
                            analyticsAssetHelper.convertAllValuesToStrings(settings));
                }

                analyticsService.event('requestToRecord', data);

            } catch (ex) {
                $log.error('Analytics:', ex);
            }
        }

        function extractErrorCode(error) {
            let errCode = '' + error.status;
            if (error.data && error.data.context && error.data.context.detailedResponseCode) {
                errCode = error.data.context.detailedResponseCode;
            }

            return errCode;
        }

        function cdvrRequestToCancel(asset, action, settings, errorData) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: cdvrRequestToCancel', asset, action, settings, errorData);
                }

                let data = {
                    success: (errorData ? false : true),
                    context: 'cdvr',
                    featureName: 'cdvr',
                    featureCurrentStep: 4,
                    featureStepName: 'requestToCancelRecording',
                    featureNumberOfSteps: 100,
                    featureType: 'cdvrRequestToCancel',
                    recordingOptions: analyticsAssetHelper.extractRecordingOptions(asset)
                };

                if (action && action.actionType === 'cdvrCancelRecording') {
                    data.recordingOptions.recordingScheduleType = 'Single';
                } else if (action && action.actionType === 'cdvrCancelSeriesRecording') {
                    data.recordingOptions.recordingScheduleType = 'Series';
                }

                if (errorData) {
                    data.errorType = 'cdvr';
                    data.errorCode = errorData.errorCode;
                    data.errorMessage = errorData.errorMessage;
                    data.clientErrorCode = extractErrorCode(errorData.error);
                }

                analyticsService.event('requestToCancelRecording', data);

            } catch (ex) {
                $log.error('Analytics:', ex);
            }
        }

        function cdvrRequestToDelete(asset, action, errorData) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: cdvrRequestToDelete: asset, action, errorData', asset, action, errorData);
                }

                let data = {
                    success: (errorData ? false : true),
                    context: 'cdvr',
                    featureName: 'cdvr',
                    featureCurrentStep: 4,
                    featureNumberOfSteps: 100,
                    featureStepName: 'requestToDeleteRecording',
                    featureType: 'cdvrRequestToDelete',
                    recordingOptions: analyticsAssetHelper.extractRecordingOptions(asset)
                };

                if (errorData) {
                    data.errorType = 'cdvr';
                    data.errorCode = errorData.errorCode;
                    data.errorMessage = errorData.errorMessage;
                    data.clientErrorCode = extractErrorCode(errorData.error);
                }

                analyticsService.event('requestToDeleteRecording', data);

            } catch (ex) {
                $log.error('Analytics:', ex);
            }
        }

        /**
         * Function for attaching event listeners.
         */
        function attachEventListeners() {
            try {
                $rootScope.$on('update-dvr', (evt, schedule, asset, action) => {
                    if (action && action.actionType === 'cdvrScheduleRecording') {
                        cdvrRequestToRecord(asset, action);
                    } else if (action && action.actionType === 'cdvrDeleteRecording') {
                        cdvrRequestToDelete(asset, action);
                    } else if (action && (
                        action.actionType === 'cdvrCancelRecording' ||
                        action.actionType === 'cdvrCancelSeriesRecording')) {
                        cdvrRequestToCancel(asset, action);
                    } else {
                        if (analyticsService.isDebug()) {
                            $log.debug('Analytics: unhandled update-dvr event', evt, schedule, asset, action);
                        }
                    }
                });
                $rootScope.$on('Analytics:cdvr-record-failed', (evt, asset, action, settings, errorData) => {
                    cdvrRequestToRecord(asset, action, settings, errorData);
                });
                $rootScope.$on('Analytics:cdvr-delete-recording-failed',
                    (evt, asset, action, error) => {
                    cdvrRequestToDelete(asset, action, error);
                });
                $rootScope.$on('Analytics:cdvr-cancel-recording-failed',
                    (evt, asset, action, settings, error) => {
                    cdvrRequestToCancel(asset, action, settings, error);
                });
                $rootScope.$on('Analytics:cdvr-schedule-series-recording', (evt, asset, action, settings) => {
                    cdvrRequestToRecord(asset, action, settings);
                });
            }
            catch (ex) {
                $log.error('Analytics:', ex);
            }
        }

        // Attach the event listeners.
        attachEventListeners();

        return {
            cdvrRequestToRecord,
            cdvrRequestToDelete
        };
    }
}());
