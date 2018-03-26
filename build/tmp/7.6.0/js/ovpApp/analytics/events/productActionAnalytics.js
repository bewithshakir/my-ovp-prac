'use strict';

(function () {
    'use strict';

    productActionAnalytics.$inject = ["actionTypeMap", "$state", "$rootScope", "analyticsService", "$log", "analyticsAssetHelper", "navigation"];
    angular.module('ovpApp.analytics.events.productActionAnalytics', ['ovpApp.config', 'ovpApp.analytics.analyticsService', 'ovpApp.analytics.analyticsAssetHelper']).factory('productActionAnalytics', productActionAnalytics).run(["productActionAnalytics", function loadHandler(productActionAnalytics) {
        return productActionAnalytics;
    }]);

    /* @ngInject */
    function productActionAnalytics(actionTypeMap, $state, $rootScope, analyticsService, $log, analyticsAssetHelper, navigation) {

        // Access the analytics state so we can track when controllers
        // are active or not.
        var analyticsState = analyticsService.state;

        function attachEventListeners() {
            try {
                $rootScope.$on('product:action', handleProductAction);
            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Conditionally generate a venona event for the given product action.
         * @param e event
         * @param action The action to execute.
         * @param asset Optional asset upon which to execute the action.
         * @param stream Optional stream to which action applies.
         */
        function handleProductAction(e, action, asset, stream) {
            try {

                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: handleProductAction: ' + action.actionType, action, asset, stream);
                }

                switch (action.actionType) {

                    case actionTypeMap.addToWatchList.id:
                        navigation.selectAction(null, {
                            operationType: 'watchListAdd',
                            elementStandardizedName: 'watchListAdd'
                        });
                        break;

                    case actionTypeMap.removeFromWatchList.id:
                        navigation.selectAction(null, {
                            operationType: 'watchListRemove',
                            elementStandardizedName: 'watchListRemove'
                        });
                        break;

                    case actionTypeMap.watchOnDemandIP.id:
                    case actionTypeMap.resumeOnDemandIP.id:

                        var isResume = actionTypeMap.resumeOnDemandIP.id === action.actionType;

                        navigation.selectAction(null, {
                            operationType: 'playButtonClicked',
                            asset: asset,
                            stream: stream,
                            action: action,
                            playbackType: 'vod',
                            scrubbingCapability: 'all',
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: isResume ? 'resume' : 'watch'
                        });
                        break;

                    case actionTypeMap.watchLiveIP.id:
                        navigation.selectAction(null, {
                            operationType: 'playButtonClicked',
                            asset: asset,
                            stream: stream,
                            action: action,
                            playbackType: 'linear',
                            contentClass: 'linear',
                            scrubbingCapability: 'none',
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: 'liveTvWatch'
                        });
                        break;

                    case actionTypeMap.resumeOnDemandOnTv.id:
                    case actionTypeMap.watchOnDemandOnTv.id:

                        var isStartVod = actionTypeMap.watchOnDemandOnTv.id === action.actionType;

                        navigation.selectAction(null, {
                            operationType: 'playButtonClicked',
                            asset: asset,
                            stream: stream,
                            action: action,
                            playbackType: 'vod',
                            scrubbingCapability: 'all',
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: isStartVod ? 'start' : 'resume'
                        });
                        break;

                    case actionTypeMap.watchLiveOnTv.id:

                        navigation.selectAction(null, {
                            operationType: 'playButtonClicked',
                            asset: asset,
                            stream: stream,
                            action: action,
                            playbackType: 'linear',
                            contentClass: 'linear',
                            scrubbingCapability: 'none',
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: 'liveTvWatch'
                        });
                        break;

                    case actionTypeMap.playRecordingOnTv.id:

                        navigation.selectAction(null, {
                            operationType: 'playButtonClicked',
                            asset: asset,
                            stream: stream,
                            action: action,
                            playbackType: 'dvr',
                            contentClass: 'dvr',
                            scrubbingCapability: 'all',
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: 'dvrWatch'
                        });
                        break;

                    case actionTypeMap.cdvrPlayRecording.id:
                    case actionTypeMap.cdvrResumeRecording.id:
                        var isStartRecording = actionTypeMap.cdvrPlayRecording.id === action.actionType;

                        navigation.selectAction(null, {
                            operationType: 'playButtonClicked',
                            asset: asset,
                            stream: stream,
                            action: action,
                            playbackType: 'dvr',
                            contentClass: 'cdvr',
                            scrubbingCapability: 'all',
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: isStartRecording ? 'start' : 'resume'
                        });
                        break;

                    case actionTypeMap.cdvrScheduleRecording.id:

                        var payload = {
                            context: 'cdvr',
                            featureType: 'cdvrRequestToRecord',
                            featureStepName: 'productPage',
                            featureCurrentStep: 1,
                            elementStandardizedName: 'cdvrRecord',
                            asset: asset,
                            stream: stream,
                            action: action
                        };

                        // If this is an episode of a series, add the appropriate
                        // section & subsection data.
                        if (angular.isDefined(asset.tmsSeriesId)) {
                            payload.pageSectionName = 'episodeListArea';
                            payload.pageSubSectionName = 'episodeConversionArea';
                        }

                        navigation.selectAction(null, payload);
                        break;

                    case actionTypeMap.cdvrScheduleSeriesRecording.id:

                        var cdvrRecordSeriesPayload = {
                            context: 'cdvr',
                            featureType: 'cdvrRequestToRecord',
                            featureStepName: 'productPage',
                            featureCurrentStep: 1,
                            elementStandardizedName: 'cdvrRecord',
                            pageSectionName: 'conversionArea',
                            pageSubSectionName: 'episodeConversionArea',
                            asset: asset,
                            stream: stream,
                            action: action
                        };

                        // Additional data population based on state name.
                        switch ($state.current.name) {
                            case 'product.series.episodes':
                                cdvrRecordSeriesPayload.navPagePrimaryName = 'episodes';
                                break;
                            case 'product.series.info':
                                cdvrRecordSeriesPayload.navPagePrimaryName = 'info';
                                break;
                        }

                        navigation.selectAction(null, cdvrRecordSeriesPayload);
                        break;

                    case actionTypeMap.cdvrCancelSeriesRecording.id:

                        navigation.selectAction(null, {
                            context: 'cdvr',
                            featureType: 'cdvrRequestToCancel',
                            featureStepName: 'productPage',
                            featureCurrentStep: 1,
                            elementStandardizedName: 'cdvrCancelRecording',
                            asset: asset,
                            stream: stream,
                            action: action
                        });
                        break;

                    case actionTypeMap.cdvrCancelRecording.id:
                        navigation.selectAction(null, {
                            context: 'cdvr',
                            featureType: 'cdvrRequestToCancel',
                            featureStepName: 'productPage',
                            featureCurrentStep: 1,
                            elementStandardizedName: 'cdvrCancelRecording',
                            asset: asset,
                            stream: stream,
                            action: action
                        });
                        break;

                    case actionTypeMap.cdvrDeleteRecording.id:
                        navigation.selectAction(null, {
                            context: 'cdvr',
                            featureType: 'cdvrRequestToDelete',
                            featureStepName: 'productPage',
                            featureCurrentStep: 1,
                            elementStandardizedName: 'cdvrDeleteRecording',
                            asset: asset,
                            stream: stream,
                            action: action
                        });
                        break;

                    case actionTypeMap.otherWaysToWatch.id:
                        navigation.selectAction(null, {
                            elementStandardizedName: 'otherWaysToWatch',
                            pageSectionName: 'episodeListArea',
                            pageSubSectionName: 'episodeConversionArea'
                        });
                        break;

                    case actionTypeMap.rentOnDemand.id:

                        // Create a new TVOD flow state object to track this transaction.
                        analyticsState.setTvodFlowState({
                            context: 'tvodFlow',
                            featureType: 'tvodPurchase',
                            featureName: 'tvod',
                            purchaseStopSeen: false,
                            featureNumberOfSteps: 100
                        });

                        // Create new transaction ID by telling SDK we're starting a new flow.
                        // This is especially necessary after an abandoned TVOD flow.
                        analyticsService.getSDK().restartFlow();

                        navigation.selectAction(null, {
                            category: 'navigation',
                            context: 'tvodFlow',
                            elementUiName: actionTypeMap.rentOnDemand.label(asset, action),
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: 'rent',
                            triggeredBy: 'user',
                            operationType: 'buttonClick',
                            featureStepName: 'selectAction_rent',
                            featureCurrentStep: 1
                        });

                        navigation.tvodPurchaseStart();
                        break;

                    case actionTypeMap.watchTrailerIP.id:
                        navigation.selectAction(null, {
                            operationType: 'playButtonClicked',
                            asset: asset,
                            stream: stream,
                            action: action,
                            playbackType: 'vod',
                            contentClass: 'trailer',
                            scrubbingCapability: 'all',
                            pageSectionName: 'conversionArea',
                            elementStandardizedName: 'watchTrailer'
                        });
                        break;

                    default:
                        $log.debug('Analytics: handleProductAction - ignored: ' + action.actionType);
                        break;
                }
            } catch (ex) {
                $log.error('Analytics:', ex);
            }
        }

        // Now attach the event listeners.
        attachEventListeners();

        return {
            handleProductAction: handleProductAction,
            attachEventListeners: attachEventListeners
        };
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/analytics/events/productActionAnalytics.js.map
