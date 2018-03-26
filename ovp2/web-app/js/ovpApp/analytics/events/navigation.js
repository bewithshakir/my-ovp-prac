(function () {
    'use strict';

    angular.module('ovpApp.analytics.events.navigation', [
        'ovpApp.config',
        'ovpApp.analytics.analyticsService',
        'ovpApp.legacy.stringUtil',
        'ovpApp.analytics.events.navigationTimer',
        'ovpApp.analytics.analyticsAssetHelper'
    ])
    .factory('navigation', navigationEvents)
    .constant('analyticsMenuItemData', {
        'livetv':         'liveTv',
        'ovp.guide':      'guide',
        'ovp.ondemand':   'onDemand',
        'ovp.dvr':        'dvrManager',
        'ovp.cdvr':       'cdvr',
        'ovp.watchLater': 'myLibrary',
        'ovp.settings':   'settings',
        'ovp.store':      'videoStore'
    })
    .constant('analyticsPageViewData', {
        'login': {
            appSection: 'preAuthentication',
            pageName: 'login'
        },

        'novideoservice': {
            appSection: 'appIntro',
            pageName: 'stream2NoVideoService'
        },

        'ovp.sadtverror': {
            appSection: 'appIntro',
            pageName: 'sadTvError'
        },

        'ovp.guide': {
            appSection: 'guide',
            pageName: 'guide',
            isLazyLoad: true
        },

        'ovp.store': {
            appSection: 'curatedCatalog',
            pageName: 'curatedVideoStore',
            isLazyLoad: true
        },

        'ovp.cdvr.recorded': {
            appSection: 'dvrManager',
            pageName: 'dvrRecordings',
            isLazyLoad: true
        },

        'ovp.cdvr.scheduled': {
            appSection: 'dvrManager',
            pageName: 'dvrScheduled',
            isLazyLoad: true
        },

        'ovp.livetv': {
            appSection: 'liveTv',
            pageName: 'playerLiveTv',
            dependsOnFlash: true
        },

        'product.series.episodes': {
            appSection: 'curatedCatalog',
            pageName: 'productPage'
        },

        'product.event': {
            appSection: 'curatedCatalog',
            pageName: 'productPage'
        },

        'search': {
            appSection: 'search',
            pageName: 'search'
        },

        'search.error': {
            appSection: 'search',
            pageName: 'search'
        },

        'search.recent': {
            appSection: 'search',
            pageName: 'search',
            pageType: 'searchResultsPage'
        },

        'search.quickresults': {
            appSection: 'search',
            pageName: 'search',
            pageType: 'searchResultsPage'
        },

        'search.results': {
            appSection: 'search',
            pageName: 'search',
            pageType: 'searchResultsPage'
        },

        'search.person': {
            appSection: 'search',
            pageName: 'curatedCastAndCrew',
            pageType: 'curatedSearchCastAndCrew'
        },

        'search.sports': {
            appSection: 'search',
            pageName: 'curatedSports',
            pageType: 'curatedSearchEvents'
        },

        'search.team': {
            appSection: 'search',
            pageName: 'curatedSports',
            pageType: 'curatedSearchSports'
        },

        'ovp.watchLater': {
            appSection: 'myLibrary',
            pageName: 'myLibrary',
            isLazyLoad: true
        },

        'ovp.settings.favorites': {
            appSection: 'settings',
            pageName: 'settingsFavorites'
        },

        'ovp.settings.accessibility': {
            appSection: 'settings',
            pageName: 'settingsAccessibility'
        },

        'ovp.settings.parentalControls': {
            appSection: 'settings',
            pageName: 'settingsParentalControls',
            isLazyLoad: true
        },

        'ovp.settings.devices': {
            appSection: 'settings',
            pageName: 'settingsDevicesPage',
            isLazyLoad: true
        },

        'ovp.settings.purchasePin': {
            appSection: 'settings',
            pageName: 'settingsPurchaseControls'
        },

        'ovp.settings.stb': {
            appSection: 'settings',
            pageName: 'settingsDevicesPage',
            isLazyLoad: false
        },

        'ovp.settings.stb.purchasePin': {
            appSection: 'settings',
            pageName: 'settingsPurchaseControls'
        },

        'ovp.settings.stb.parentalControls': {
            appSection: 'settings',
            pageName: 'settingsParentalControls'
        },

        'ovp.dvr.my-recordings': {
            appSection: 'dvrManager',
            pageName: 'dvrRecordings',
            isLazyLoad: true
        },

        'ovp.dvr.scheduled': {
            appSection: 'dvrManager',
            pageName: 'dvrScheduled',
            isLazyLoad: true
        },

        'ovp.dvr.priority': {
            appSection: 'dvrManager',
            pageName: 'dvrSeriesManager',
            isLazyLoad: true
        },

        'ovp.mobilelogin': {
            appSection: 'preAuthentication',
            pageName: 'downloadAppForm'
        },

        'buyFlow': {
            appSection: 'stream2',
            pageName: 'abstract',
            context: 'stream2'
        },

        'buyFlow.welcome': {
            appSection: 'stream2',
            pageName: 'stream2SignUp',
            context: 'stream2'
        },

        'buyFlow.confirmation': {
            appSection: 'stream2',
            pageName: 'stream2PurchaseConfirmation',
            context: 'stream2'
        }
    })
    .run(function loadHandler(navigation) {
            return navigation;
        });

    /* @ngInject */
    function navigationEvents($rootScope, analyticsService, $log,
        analyticsEnums, $window, stringUtil, navigationTimer, config, $q,
        analyticsAssetHelper, playerService, analyticsMenuItemData, analyticsPageViewData) {

        // Track the timestamp of when navigation has begun. Defaults to 0
        // to indicate "we don't know when this started".
        let routeStartTime = 0;

        // Collects the routing information as we receive it.
        let routingState = null;

        // Timer for detecting when a page has timed out.
        let timeoutTimer = null;

        // Variable to keep track of when the application is routing the user
        // to a destination, instead of the user navigating themselves.
        let triggeredByMemento = null;

        // Access the analytics state so we can track when controllers
        // are active or not.
        let state = analyticsService.state;

        // Capture timestamp of when a tracked modal dialog begins to display.
        let modalStartTimestamp = null;

        /**
         * Capture the time at which routing has begun. This assumes a single
         * route-start event per user navigation.
         * @param e event
         * @param data Data for the event.
         */
        function startNavigation(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: startNavigation', data, routingState);
                }

                // Capture transition data.
                data.toState = data.transition.to();
                data.toParams = data.transition.params('to');
                data.wasReactivated = data.transition.wasReactivated || false;

                if (angular.isDefined(data.transition.targetState) &&
                    angular.isDefined(data.transition.targetState().params()) &&
                    angular.isDefined(data.transition.targetState().params().analyticsAppTriggeredRouting)) {
                    appTriggeredRouting();
                }

                // Consume the triggeredByMemento, if it has been populated.
                let triggeredBy = triggeredByMemento || 'user';
                triggeredByMemento = null;

                // Retrieve any analytics for the current destination.
                let pageAnalytics = analyticsPageViewData[data.transition.to().name] || data.toState.analytics;

                // Nothing to do if we're routing to and from pages without analytics
                if (!angular.isDefined(pageAnalytics)) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Routing ignored: page has no analytics:', data);
                    }
                    return;
                }

                // Default 'isLazyLoad' to false.
                pageAnalytics.isLazyLoad = pageAnalytics.isLazyLoad || false;

                if (state.isNavigationPaused()) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Ignoring route: navigation paused.');
                    }
                    return;
                }

                // Determine the 'appSection' and 'pageName' field values.
                let appSection =  pageAnalytics.appSection;
                let pageName = null;
                if (angular.isDefined(pageAnalytics.pageName)) {
                    pageName = pageAnalytics.pageName;
                }

                // Derive curatedCatalog page names.
                let analyticSection = pageAnalytics;
                if (angular.isDefined(analyticSection.categoryHint)) {
                    pageName = analyticsAssetHelper.normalizeContentCategoryName(analyticSection.categoryHint);
                }

                // Generate a unique pageId for this content, utilizing the incoming
                // parameters, if any.
                let pageId = '';
                if (angular.isDefined(data.toState.url)) {
                    pageId = data.toState.url;
                }
                if (angular.isDefined(data.toParams)) {
                    let str = Object.keys(data.toParams).sort().map(function (key) {
                        return key + '=' + (data.toParams[key] ? data.toParams[key] : '');
                    }).join('&');

                    pageId += '?' + str;
                }

                // Apply given pageType, if any.
                let pageType = null;
                if (angular.isDefined(pageAnalytics.pageType)) {
                    pageType = pageAnalytics.pageType;
                }

                // Does this page depend on flash, when we know flash is not available?
                if (state.getFlashUnavailable() && pageAnalytics.dependsOnFlash) {
                    $log.debug('Analytics: flash is unavailable', pageAnalytics);
                    flashWarning(null, {
                        pageName: 'adobeFlashNotAvailableWarning'
                    });
                    return;
                }

                // Ignore re-route to current page.
                if (state.getCurrentPageName() === pageName &&
                    state.getCurrentAppSection() === appSection) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: ignoring rerouting event to same page.', data);
                    }
                    return;
                }

                // Ignore re-route to page we are already en route to.
                if (routingState &&
                    routingState.appSection === appSection &&
                    routingState.pageName === pageName &&
                    routingState.pageId === pageId) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: ignoring duplicate routing event to same page.');
                    }
                    return;
                }

                // If we have a timeout timer, cancel it now.
                if (timeoutTimer) {
                    navigationTimer.cancelTimer();
                    timeoutTimer = null;
                }

                // If the new destination does not have an analytics section, we can't
                // begin tracking it as a new destination, so stop processing now.
                if (!pageAnalytics) {
                    if (analyticsService.isDebug()) {
                        $log.debug('No analytics section for new destination, so halting now.');
                    }
                    return;
                }

                // Track the beginning of the page navigation.
                // $log.debug('Analytics: startNavigation to ' + appSection +
                //     ', ' + pageName, data);
                routeStartTime = Date.now();

                // Capture routing details
                routingState = {
                    triggeredBy: triggeredBy,
                    renderInitTimestamp: routeStartTime,
                    pageName: pageName,
                    appSection: appSection,
                    pageId: pageId,
                    pageDisplayType: pageAnalytics.pageDisplayType || 'page',
                    pageType: pageType || '',
                    pageViewType: 'normal',
                    settings: {},
                    appliedSorts: extractSorts(appSection, pageName, data.toParams),
                    appliedFilters: extractFilters(appSection, pageName, data.toParams),
                    partialRenderedMs: null,
                    partialRenderedTimestamp: null,
                    fullyRenderedMs: null,
                    fullyRenderedTimestamp: null,
                    isLazyLoad: pageAnalytics.isLazyLoad,
                    viewRenderedStatus: analyticsEnums.ViewRenderedStatus.NO_RENDER,
                    featureName: pageAnalytics.featureName,
                    featureType: pageAnalytics.featureType,
                    featureCurrentStep: pageAnalytics.featureCurrentStep,
                    featureNumberOfSteps: pageAnalytics.featureNumberOfSteps
                };

                // TVOD feature data may need to be included in some navigations.
                if (pageAnalytics.checkForTvod) {
                    // routingState.checkForTvod = pageAnalytics.checkForTvod;
                    let tvodFlow = state.getTvodFlowState();
                    if (tvodFlow) {
                        angular.extend(routingState, tvodFlow);
                        delete routingState.featureCurrentStep;
                    }
                }

                // Capture pageView context, if any. Example: 'tvodFlow'
                if (angular.isDefined(pageAnalytics.context)) {

                    // Process context-specific pageView events
                    routingState.context = pageAnalytics.context;

                    // Process TVOD pageView events
                    let tvodFlow = state.getTvodFlowState();
                    if ('tvodFlow' === pageAnalytics.context && tvodFlow) {

                        if ('rentConfirmation' === routingState.pageName) {
                            tvodFlow.featureCurrentStep = 3;
                            angular.extend(routingState, tvodFlow);
                        } else if ('pinEntryPurchase' === routingState.pageName) {
                            tvodFlow.featureCurrentStep = 5;
                            angular.extend(routingState, tvodFlow);
                        }

                    } else if (pageAnalytics.context === 'stream2') {

                        // Default field values for 'stream2' pageView actions.
                        routingState.featureName = routingState.featureName || 'stream2';
                        routingState.featureNumberOfSteps = 6;
                        routingState.featureType = routingState.featureType || 'stream2BuyFlow';
                        routingState.appSection = routingState.appSection || 'stream2';
                    }
                }

                // Start the timeout timer.
                timeoutTimer = navigationTimer.startTimer(
                    routingState.appSection, routingState.pageName);

                // Record new current location. (Must happen before
                // pageChangeComplete nulls the routingState)
                state.setCurrentPageName(routingState.pageName);
                state.setCurrentAppSection(routingState.appSection);

                // If the controller for this page is already loaded and active,
                // we can complete the page right away, since we won't receive
                // a 'pageChangeComplete' event. The trick here is ensuring
                // the controller is actually loaded, and won't reload due to
                // a parameter change.
                if (data.wasReactivated) {

                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Page is already loaded and active.');
                    }

                    // Turn off lazy load, since this page is ready to go.
                    routingState.isLazyLoad = false;
                    analyticsService.event('pageViewInit', routingState);
                } else {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: (not already active) after startNav, routingState', routingState);
                    }
                    analyticsService.event('pageViewInit', routingState);
                }

                // If navigating away from a
                if (!playerService.isValidPlayRoute()) {
                    $rootScope.$emit('Analytics:playback-stopped', {
                        TriggeredBy: 'exitPlayer'
                    });
                }
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Extract any sorting criteria for the given page.
         *
         * @param appSection The appSection for the given page.
         * @param pageName The pageName for the given page.
         * @param params The parameters for the given page.
         * @return Array of sorts, possibly empty.
         */
        function extractSorts(appSection, pageName, params) {
            try {
                if (appSection && pageName && params) {
                    // TODO: Expand this logic as-needed for other pages.
                    // Do nothing. Use params to quiet the linter
                    return [];
                }
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }

            // Fallthrough
            return [];
        }

        /**
         * Extract any filtering criteria for the given page.
         *
         * @param appSection The appSection for the given page.
         * @param pageName The pageName for the given page.
         * @param params The parameters for the given page.
         * @return Array of filters, possibly empty.
         */
        function extractFilters(appSection, pageName, params) {

            // Short-circuit if nothing to process.
            if (!params) {
                return [];
            }

            // $log.debug('Analytics: extractFilters appSection=' + appSection +
            //     ', pageName=' + pageName + ', params' + pageName, params);

            // Extract video store filter.
            if (appSection === 'curatedCatalog' &&
                pageName === 'curatedVideoStore') {
                if (params.category && params.category.indexOf('&catName=') > 0) {

                    let queryParameters = stringUtil.extractSingleValueParametersAsObject(params.category);
                    return [queryParameters.catName] || [];
                }
            }

            // Fallthrough (default value)
            return [];
        }

        /**
         * Capture a 'partially rendered' event from a page. Here, 'partially rendered'
         * means the page isn't fully rendered, but has rendered enough to provide
         * controls with which a user can interact.

         * @param e event
         * @param data eventData
         */
        function partiallyRendered(/*e, data*/) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: partiallyRendered');
                }
                if (!routingState) {
                    // Do nothing if we've already published this pageView.
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Ignoring partiallyRendered event because ' +
                            'not tracking a navigation event.');
                    }
                    return;
                }

                let now = Date.now();
                routingState.partialRenderedTimestamp = now;
                routingState.partialRenderedMs = now - routeStartTime;
                routingState.viewRenderedStatus = analyticsEnums.ViewRenderedStatus.PARTIAL;

                analyticsService.event('pageViewPartiallyRendered', routingState);
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Capture the end of a page change sequence.
         * @param e event
         * @param data eventData
         */
        function pageChangeComplete(/*e, data*/) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: pageChangeComplete:', routingState);
                }

                if (timeoutTimer) {
                    navigationTimer.cancelTimer();
                    timeoutTimer = null;
                }

                if (!routingState) {
                    // Some pages send us multiple events in fast succession, such as
                    // search-input.
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Ignoring pageComplete event because ' +
                            'it has already been submitted.');
                    }
                    return;
                }

                let now = Date.now();

                // Update routingState:
                routingState.fullyRenderedTimestamp = now;
                routingState.fullyRenderedMs = now - routeStartTime;
                routingState.viewRenderedStatus = analyticsEnums.ViewRenderedStatus.COMPLETE;

                // Backfill partial render time, if one doesn't exist.
                if (!routingState.partialRenderedTimestamp) {
                    routingState.partialRenderedTimestamp = routingState.fullyRenderedTimestamp;
                    routingState.partialRenderedMs = routingState.fullyRenderedMs;
                }

                // Send pageView event.
                analyticsService.event('pageViewCompleted', routingState);

                // Clear our routing state, since we're no longer tracking it.
                routingState = null;
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Capture the end of a page change sequence.
         * @param e event
         * @param data eventData
         */
        function modalStart() {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: modalStart');
                }
                modalStartTimestamp = Date.now();
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Capture the end of a page change sequence.
         * @param e event
         * @param data eventData
         */
        function modalView(e, data, options = null) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: modalView:', data);
                }

                // Set message defaults.
                data.modalName = data.modalName || 'notification';
                data.modalType = data.modalType || 'message';

                let eventData = angular.copy(data);

                // Global defaults for modalViews
                eventData.triggeredBy = data.triggeredBy || 'user';

                // Capture load time, with fallback to 0 if no start timestamp.
                eventData.loadTimeMs = (modalStartTimestamp ? Date.now() - modalStartTimestamp : 0);

                // If tvodFlow, add feature steps
                let tvodFlow = state.getTvodFlowState();
                if (tvodFlow) {
                    if ('pinEntryPurchase' === data.modalName) {
                        tvodFlow.featureCurrentStep = 3;
                        angular.extend(eventData, tvodFlow);
                        eventData.featureStepName = 'pinEntryPurchase';
                    } else if ('pinEntryParentalControl' === data.modalName) {
                        tvodFlow.featureCurrentStep = 3;
                        angular.extend(eventData, tvodFlow);
                        eventData.featureStepName = 'pinEntryParentalControl';
                    } else if ('notification' === data.modalName) {
                        tvodFlow.featureCurrentStep = 0;
                        angular.extend(eventData, tvodFlow);
                    }
                }

                // Send pageView event.
                analyticsService.event('modalView', eventData, options);

                // Clear our routing state, since we're no longer tracking it.
                routingState = null;
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Capture when the flash warning component is displayed to the user.
         *
         * @param e event
         * @param data Data for the event.
         */
        function flashWarning(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: flashWarning, currPage=' + state.getCurrentPageName(),
                        data, routingState);
                }

                if (state.getCurrentPageName() === data.pageName) {
                    // We often get two flash warnings when playing on demand content.
                    $log.debug('Analytics: Suppressing double-routing to same flash warning page.');
                    return;
                }

                // Track that flash is now unavailable.
                state.setFlashUnavailable(true);

                // Ignore this event if not logged in.
                if (!state.getIsLoggedIn()) {
                    return;
                }

                let now = Date.now();

                // Ignore flash warning when destination page has no analytics.
                if (!routingState) {
                    $log.warn('Analytics: Received flash warning for destination page without analytics.');
                    routeStartTime = now;
                    routingState = {
                        isLazyLoad: false,
                        triggeredBy: 'application'
                    };
                }

                // Override the ongoing page-view navigation.
                routingState.pageName = data.pageName;
                if (data && data.toState && data.toState.url) {
                    routingState.pageId = data.toState.url;
                }
                routingState.renderInitTimestamp = routeStartTime;
                routingState.fullyRenderedMs = now - routeStartTime;
                routingState.fullyRenderedTimestamp = now;
                routingState.viewRenderedStatus = analyticsEnums.ViewRenderedStatus.COMPLETE;

                analyticsService.event('pageViewInit', routingState);
                analyticsService.event('pageViewCompleted', routingState);

                // Record new current location. (Must happen before
                // we null the routingState)
                state.setCurrentPageName(routingState.pageName);
                state.setCurrentAppSection(routingState.appSection);

                routingState = null;
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        function selectContent(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: selectContent, page=' + state.getCurrentPageName(),
                        data);
                }

                // Determine search result facet.
                let payload = angular.extend({}, data);

                // Set default values
                payload.triggeredBy = data.triggeredBy || 'user';
                payload.operationType = data.operationType || 'assetSelection';
                payload.pageSectionName = data.pageSectionName || 'contentArea';
                payload.category = data.category || 'navigation';
                if (data.pageSubSectionName) {
                    payload.pageSubSectionName = data.pageSubSectionName;
                }

                // Use global accessiblity class to determine input device.
                payload.triggeredUsing = analyticsService.getTriggeredBy();

                // Override pageSubSectionName, if needed.
                if (data.mylibCatName) {
                    payload.pageSubSectionName = analyticsAssetHelper.toLowerCamelCase(data.mylibCatName);
                } else if (payload.pageSubSectionName) {
                    payload.pageSubSectionName = analyticsAssetHelper.toLowerCamelCase(payload.pageSubSectionName);
                }

                let pageName = state.getCurrentPageName();
                if ('curatedVideoStore' === pageName) {

                    // TVOD purchase
                    payload.elementStandardizedName = 'videoStore';

                } else if (['search','curatedCastAndCrew', 'curatedSports'].indexOf(pageName) >= 0 &&
                    data.asset && data.asset.resultDisplay) {

                    // Search result
                    payload.category = 'search';
                    payload.operationType = 'searchResultSelected';
                    payload.selectedResultName = data.asset.title;
                    payload.queryId = data.asset.dsQueryId;
                    payload.elementIndex = data.asset.searchResultIndex;

                    if (pageName === 'curatedSports') {
                        payload.selectedResultFacet = 'sports';
                    } else if (pageName === 'curatedCastAndCrew') {
                        payload.selectedResultFacet = 'person';
                    } else {
                        payload.selectedResultFacet = data.asset.resultDisplay.toLowerCase();
                    }
                }

                // Populate navPageSecondaryName.
                if ('curatedCollections' === payload.navPagePrimaryName && !payload.navPageSecondaryName) {
                    payload.navPageSecondaryName = pageName;
                }

                // Capture content identifiers
                payload.elementType = data.elementType || 'link';
                let assetOrShow = data.asset || data.showFromGuide;
                payload.tmsProgramId = analyticsAssetHelper.getTmsProgramId(assetOrShow);
                payload.tmsSeriesId = analyticsAssetHelper.getTmsSeriesId(assetOrShow);
                payload.providerAssetId = analyticsAssetHelper.getProviderAssetId(assetOrShow);
                payload.tmsGuideId =
                    analyticsAssetHelper.getTmsGuideId(data.channel) ||
                    analyticsAssetHelper.getTmsGuideId(assetOrShow);
                payload.streamStartTimestamp = analyticsAssetHelper.getAirtime(assetOrShow);

                // Prune deprecated/irrelevant/undefined payload values.
                delete payload.isBlockedByRating;
                delete payload.asset;
                delete payload.showFromGuide;
                delete payload.asset;
                analyticsAssetHelper.pruneUndefinedValues(payload);

                analyticsService.event('selectContent', payload);

            } catch (ex) {
                $log.error('Analytics: selectContent error', ex);
            }
        }

        /**
         * Generate an event when the Guide's channel filters have changed.
         * @param e The event
         * @param data Data for the event, including the filter name.
         */
        function guideUpdateFilters(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: guideUpdateFilters', data);
                }
                // Are we changing the filter on the Guide page, or the mini-guide
                // on the live tv page?
                let isMiniGuide = ('playerLiveTv' === state.getCurrentPageName());

                // Drop this event if the filter hasn't actually changed.
                let oldFilter = isMiniGuide ? state.getCurrentMiniGuideFilter() : state.getCurrentGuideFilter();
                let newFilter = data.filter ? data.filter.label || data.filter.name : null;
                if (oldFilter === newFilter) {
                    return;
                }

                delete data.filter;

                // Capture the filter change.
                if (isMiniGuide) {
                    state.setCurrentMiniGuideFilter(newFilter);
                } else {
                    state.setCurrentGuideFilter(newFilter);
                }
                data.operationType = 'filterApplied';
                data.elementStandardizedName = 'filterChannels';
                data.pageSectionName = 'guideOptionsSelectArea';
                data.appliedFilters = newFilter === null ? [] : [newFilter];

                if (data.triggeredBy === 'user') {
                    data.triggeredUsing = analyticsService.getTriggeredBy();
                }

                selectAction(null, data);
            }
            catch (ex) {
                $log.error('Analytics guideUpdateFilters:', ex);
            }
        }

        /**
         * Generate an event when the Guide's channel filters have changed.
         * @param e The event
         * @param data Data for the event, including the filter name.
         */
        function guideUpdateSort(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: guideUpdateSort', data);
                }

                data.operationType = 'sortApplied';
                data.pageSectionName = 'guideOptionsSelectArea';
                data.appliedSorts = [];

                if (data.sort && data.sort.name) {
                    data.appliedSorts = [data.sort.name];
                    data.elementStandardizedName = (data.sort.id === 'networkAToZ' ?
                        'sortByAlphabetical' :
                        'sortByNumber');
                }

                if (data.triggeredBy === 'user') {
                    data.triggeredUsing = analyticsService.getTriggeredBy();
                }

                delete data.sort;

                selectAction(null, data);
            }
            catch (ex) {
                $log.error('Analytics guideUpdateFilters:', ex);
            }
        }

        /**
         * Record that the application is about to route the user to a destination,
         * instead of the user.
         */
        function appTriggeredRouting(/*e, data*/) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: appTriggeredRouting');
                }
                triggeredByMemento = 'application';
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Receive notification that the page navigation timer has fired,
         * which may result in the publication of an event for page navigation
         * timing out.
         */
        function timerTimedout(/*e, data*/) {
            try {
                if (routingState) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Page navigation timed out.');
                    }
                    routingState.viewRenderedStatus = analyticsEnums.ViewRenderedStatus.TIMEOUT;
                    analyticsService.event('pageViewTimeout', routingState);
                    routingState = null;
                }
            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        function selectAction(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: selectAction', data);
                }

                // Global defaults for selectActions
                data.triggeredBy = data.triggeredBy || 'user';

                // Use global accessiblity class to determine input device.
                if (data.triggeredBy !== 'application') {
                    data.triggeredUsing = analyticsService.getTriggeredBy();
                }

                data.category = data.category || 'navigation';
                data.operationType = data.operationType || 'buttonClick';
                data.pageSectionName = data.pageSectionName || 'conversionArea';

                // Additional data for favoriteToggle
                if ('favoriteToggle' === data.operationType) {
                    data.elementStandardizedName = (data.toggleState ? 'favoriteAdd' : 'favoriteRemove');
                    data.pageSectionName = 'guideArea';
                }

                // Special handling of pageSectionName
                if ('DeriveFromOpType' === data.pageSectionName) {
                    let currPage = state.getCurrentPageName();

                    // Override page sectionName for the closed caption & SAP toggles
                    if (['closedCaptionToggle', 'sapToggle'].indexOf(data.operationType) >= 0) {
                        data.pageSectionName = (currPage === 'playerLiveTv' ? 'liveTvArea' : 'settingsSelectArea');
                    }
                }

                // If 'cdvrSettings' is present, convert all values to strings.
                if (data.cdvrSettings) {
                    data.cdvrSettings = analyticsAssetHelper.convertAllValuesToStrings(data.cdvrSettings);
                }

                // Normalize the element name, if needed.
                if (data.nonNormalizedElementStdName) {
                    data.elementStandardizedName =
                        analyticsAssetHelper.normalizeContentCategoryName(data.nonNormalizedElementStdName);
                }

                // Special handling for TVOD selectActions
                if (data.context === 'tvodFlow') {

                    // Retrieve the current tvod flow state.
                    let tvodFlow = state.getTvodFlowState();

                    // Drop events that can be ignored.
                    if (tvodFlow.purchaseStopSeen === true &&
                        data.ignoreIfPurchaseStopIsSeen === true) {
                        if (analyticsService.isDebug()) {
                            $log.debug('Analytics: Discarding ignorable tvod event', tvodFlow, data);
                        }
                        return;
                    }

                    // Update TVOD flow state
                    tvodFlow.featureCurrentStep = data.featureCurrentStep;

                    // Add tvodFlow data to event data and publish selectAction event.
                    angular.extend(data, tvodFlow);

                } else if (data.context === 'cdvr') {

                    // Special handling for CDVR selectActions
                    data.featureName = data.featureName || 'cdvr';
                    data.pageSectionName = data.pageSectionName || 'conversionArea';
                    data.operationType = data.operationType || 'buttonClick';
                    data.featureNumberOfSteps = data.featureNumberOfSteps || 100;

                    if (data.asset) {
                        data.recordingOptions = analyticsAssetHelper.extractRecordingOptions(
                            data.asset, data.cdvrSettings);
                    }

                } else if (data.context === 'stream2') {

                    // For Stream2, backfill required fields with default values.
                    data.category = data.category || 'navigation';
                    data.pageSectionName = data.pageSectionName || 'conversionArea';
                    data.operationType = data.operationType || 'buttonClick';
                    data.featureName = data.featureName || 'stream2';
                    data.featureNumberOfSteps = data.featureNumberOfSteps || 6;
                    data.featureType = data.featureType || 'stream2BuyFlow';

                    // User can jump around between steps, so record the last
                    // step they actually performed.
                    data.featurePreviousStep = state.getStream2BuyFlowPreviousStep();

                    // User's current step becomes the next 'previous' step. No
                    // need to reset this when they're done, since a user cannot
                    // revisit the buyFlow after they complete it.
                    state.setStream2BuyFlowPreviousStep(data.featureCurrentStep);
                }

                // If operationType = playButtonClicked, we need to capture all
                // the usual playbackSelect event fields.
                if ('playButtonClicked' === data.operationType) {
                    analyticsAssetHelper.populateChannelData(data, data.channel);
                    analyticsAssetHelper.populateAssetData(data, data.asset);
                    if (data.stream) {
                        analyticsAssetHelper.populateStreamData(data, data.stream);
                    } else {
                        analyticsAssetHelper.populateStreamData(data, data.asset.defaultStream);
                    }
                    analyticsAssetHelper.populateTvodData(data, data.asset);

                    // Until DRM type changes...
                    data.drmType = 'adobePrimeTime';

                    // Delete unneeded data.
                    delete data.asset;
                    delete data.action;
                }

                analyticsService.event('selectAction', data);

            } catch (ex) {
                $log.error('Analytics selectAction:', ex);
            }
        }

        function switchScreen(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: switchScreen', data);
                }

                // Apply default values for event
                data.switchScreenDirection = data.switchScreenDirection || 'toTv';
                data.triggeredBy = data.triggeredBy || 'user';
                data.category = data.category || 'navigation';
                data.switchScreenId = data.switchScreenId || 'unknown';
                data.success = data.success || true;

                if (data.error || data.errorCode) {

                    data.success = false;
                    data.errorType = 'switchScreen';

                    if (!angular.isDefined(data.errorCode)) {
                        data.errorCode = 'dvr' === state.getLastPlaybackType() ?
                            'WCM-1603' : 'WCM-1001';
                    }

                    // Capture optional client error code.
                    if (data.error && data.error.status) {
                        data.clientErrorCode = data.error.status.toString();
                    }
                    delete data.error;
                }

                analyticsService.event('switchScreen', data);

            } catch (ex) {
                $log.error('Analytics switchScreen:', ex);
            }
        }

        /**
         * Record that the PIN entry dialog is being displayed, so we'll probably
         * be receiving some pinEntry events soon. This lets us capture the reason
         * for the upcoming pinEntry events.
         *
         * @param e Incoming event.
         * @param data Data Event data, including context data for future pinEntry events.
         */
        function showPinDialog(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: showPinDialog', data);
                }

                let currentPage = state.getCurrentPageName();

                modalStart();

                if (data.context === 'parentalControlFlow') {
                    data.modalName = 'pinEntryParentalControl';
                    data.modalType = 'options';
                    data.pinEntryContext = {
                        category: 'navigation',
                        pinType: 'parentalControl',
                        context: data.context
                    };

                    // If we're on the settings page, we actually want a blank
                    // context for the modal-view and the pinEntry events.
                    if (currentPage === 'settingsParentalControls') {
                        delete data.context;
                        delete data.pinEntryContext.context;
                    }

                } else if (data.context === 'tvodFlow') {
                    data.modalName = 'pinEntryPurchase';
                    data.modalType = 'options';
                    data.operationType = 'purchaseControl';
                    data.pinEntryContext = {
                        category: 'navigation',
                        pinType: 'purchaseControl',
                        operationType: 'purchaseControl',
                        context: data.context
                    };

                    // If we're on the settings page, we actually want a blank context
                    // and operationType for the modal-view and the pinEntry events.
                    if (currentPage === 'settingsPurchaseControls') {
                        delete data.context;
                        delete data.pinEntryContext.context;
                        delete data.operationType;
                        delete data.pinEntryContext.operationType;
                    }
                }

                modalView(null, data);

                // Capture the reason for the impending PIN attempts.
                state.setPINEntryContext(data.pinEntryContext);

            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Record an attempt to enter a PIN.
         *
         * @param e Incoming event.
         * @param data Data about the PIN entry. Mainly whether it succeeded or not.
         */
        function pinEntry(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: pinEntry', data);
                }

                // If no context, ignore this pin entry.
                let pinEntryContext = state.getPINEntryContext();
                if (null === pinEntryContext) {
                    return;
                }

                // Retrieve the PIN entry context, and add values specific to
                // this attempt to it before publishing it.
                let pinData = angular.copy(pinEntryContext);
                pinData.success = data.success;

                // Attach tvod flow data
                let tvodFlow = state.getTvodFlowState();
                if (tvodFlow) {
                    tvodFlow.featureCurrentStep = 6;
                    angular.extend(pinData, tvodFlow);
                }

                analyticsService.event('pinEntry', pinData);

            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Capture the start of the purchase process for a purchaseable asset.
         *
         * @param e Incoming event.
         * @param data Data about the purchase.
         */
        function tvodPurchaseStart() {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: tvodPurchaseStart');
                }

                let tvodFlow = state.getTvodFlowState();
                tvodFlow.featureCurrentStep = 2;
                tvodFlow.featureStepName = 'purchaseStart';
                let purchaseStartData = angular.extend({}, tvodFlow);

                analyticsService.event('purchaseStart', purchaseStartData);

                // Remove the featureStepName so it doesn't get repeated.
                delete tvodFlow.featureStepName;

            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * Capture the end of the purchase process for a purchaseable asset.
         *
         * @param e Incoming event.
         * @param data Data about the purchase.
         */
        function tvodPurchaseStop(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: tvodPurchaseStop', angular.copy(data),
                        angular.copy(state.getTvodFlowState()));
                }

                // Retrieve and update tvodFlow state
                let tvodFlow = state.getTvodFlowState();

                // Do nothing if there's nothing to do.
                if (!tvodFlow) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: tvodPurchaseStop - No TVOD flow to halt.');
                    }
                    return;
                }

                // Process errors
                if (data.error) {
                    data.context = 'tvodFlow';
                    data.success = false;
                    data.purchaseId = data.error && data.error.headers ? data.error.headers('x-trace-id') : undefined;
                    data.triggeredBy = 'application';
                    data.errorType = 'tvod';

                    let error = data.error;
                    if (error.data && error.data.context &&
                        error.data.context.detailedResponseCode) {
                        data.clientErrorCode = error.data.context.detailedResponseCode;
                    }
                    delete data.error;
                }

                // Drop events that can be ignored.
                if (tvodFlow.purchaseStopSeen === true &&
                    data.ignoreIfPurchaseStopIsSeen === true) {
                    if (analyticsService.isDebug()) {
                        $log.debug('Analytics: Discarding ignorable tvod event', tvodFlow, data);
                    }
                    return;
                }

                // Track that we've seen the purchaseStop.
                tvodFlow.purchaseStopSeen = true;

                // Feature step defers to whatever we were given, otherwise
                // this is the second-to-last step in the flow.
                if (data.featureCurrentStep) {
                    tvodFlow.featureCurrentStep = data.featureCurrentStep;
                } else {
                    tvodFlow.featureCurrentStep = tvodFlow.featureNumberOfSteps - 1;
                }

                // Capture purchaseId
                tvodFlow.purchaseId = data.purchaseId;
                state.setTvodFlowState(tvodFlow);

                // Build event data
                let purchaseData = angular.extend({}, tvodFlow, data);
                purchaseData.featureStepName = 'purchaseStop';

                // Capture tmsProgramId so we can identify this asset's playbackSelect event.
                if (data.asset) {
                    purchaseData.tmsProgramId = analyticsAssetHelper.getTmsProgramId(data.asset);
                }

                // Store the purchase data for later use in playbackSelect event.
                state.setLatestPurchase(purchaseData);

                analyticsService.event('purchaseStop', purchaseData);

                // If purchase stopped with a failure, clear the tvodFlow state.
                if (!data.success) {
                    state.setTvodFlowState(null);
                }

            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        /**
         * The PIN entry dialog is closed, so we'll stop expecting pinEntry events.
         * Clears the PIN entry context.
         *
         * @param e Incoming event.
         */
        function closePinDialog(e, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: closePinDialog', data, state.getTvodFlowState());
                }

                state.setPINEntryContext(null);

                // If we're in a TVOD flow state, we need to halt it now.
                // Additional handling for a dismissed PIN dialog.
                if (!data.pinValidated) {

                    // Halt TVOD event flow & clear flow data
                    if (state.getTvodFlowState()) {
                        tvodPurchaseStop({}, { // cancelled
                            context: 'tvodFlow',
                            triggeredBy: 'user',
                            success: false
                        });

                        state.setTvodFlowState(null);
                    }
                }
            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        function pauseNavigation(/* e */) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: pauseNavigation');
                }

                state.pauseNavigation();
            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        function unpauseNavigation(/* e */) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: unpauseNavigation');
                }

                state.unpauseNavigation();
            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        function goToDesktopVersionClicked() {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: goToDesktopVersionClicked');
                }

                let eventData = {
                    elementStandardizedName: 'goToDesktopVersion'
                };

                // We know we're about to go offline.
                $rootScope.$emit('Analytics:prepareForRefresh');

                selectAction(null, eventData);

            } catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        function rdvrPrioritization(evt, data) {
            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: rdvrPrioritization', evt, data);
                }

                let eventData = {
                    elementStandardizedName: 'changePriority',
                    operationType: evt.name === 'Analytics:rdvr-higher-priority' ?
                        'increasePriority' : 'decreasePriority'
                };

                selectAction(null, eventData);

            } catch (ex) {
                $log.error('Analytics rdvrPrioritization:', ex);
            }
        }

        function selectChannel(e, data) {

            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: selectChannel', data);
                }

                selectAction(null, {
                    operationType: 'playButtonClicked',
                    asset: data.channel.asset,
                    channel: data.channel,
                    triggeredBy: data.triggeredBy,
                    playbackType: 'linear',
                    scrubbingCapability: 'none',
                    pageSectionName: 'conversionArea',
                    elementStandardizedName: 'watch'
                });

            } catch (ex) {
                $log.error('Analytics: ', ex);
            }
        }

        function selectChannelCard(e, data) {

            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: selectChannelCard', data);
                }

                selectAction(null, {
                    operationType: 'networkSelection',
                    pageSectionName: 'networkArea',
                    navPagePrimaryName: 'curatedCollections',
                    navPageSecondaryName: 'curatedNetworks'
                });

            } catch (ex) {
                $log.error('Analytics: ', ex);
            }
        }


        function menuItemClick(e, menuItem) {

            try {
                if (analyticsService.isDebug()) {
                    $log.debug('Analytics: menuItemClick', menuItem);
                }

                // Special handling for 'search' menu item
                if (menuItem.id === 'search') {
                    $rootScope.$emit('Analytics:search-start');
                    return;
                }

                // Only send event if there's something to work with.
                let elementName = analyticsMenuItemData[menuItem.link];
                if (elementName) {
                    selectAction(null, {
                        pageSectionName: 'navGlobal',
                        elementStandardizedName: elementName,
                        operationType: 'navigationClick'
                    });
                }
            } catch (ex) {
                $log.error('Analytics: ', ex);
            }
        }

        /**
         * Function for attaching all navigation event listeners.
         */
        function attachEventListeners() {
            try {
                $rootScope.$on('Analytics:route-start', startNavigation);
                $rootScope.$on('Analytics:flash-warning', flashWarning);
                $rootScope.$on('Analytics:partial-render', partiallyRendered);

                // Modal view navigation events
                $rootScope.$on('Analytics:modal-start', modalStart);
                $rootScope.$on('Analytics:modal-view', modalView);

                // Handle pageChangeComplete events. The one with the "Analytics:"
                // prefix allows the rest of the app to ignore them.
                $rootScope.$on('pageChangeComplete', pageChangeComplete);
                $rootScope.$on('Analytics:pageChangeComplete', pageChangeComplete);

                $rootScope.$on('Analytics:applicationTriggeredRouting', appTriggeredRouting);

                $rootScope.$on('Analytics:pauseNavigation', pauseNavigation);
                $rootScope.$on('Analytics:unpauseNavigation', unpauseNavigation);

                $rootScope.$on('Analytics:timeout', timerTimedout);

                $rootScope.$on('Analytics:select', selectAction);
                $rootScope.$on('Analytics:selectContent', selectContent);
                $rootScope.$on('Analytics:switchScreen', switchScreen);
                $rootScope.$on('Analytics:guide:updateFilter', guideUpdateFilters);
                $rootScope.$on('Analytics:guide:updateSort', guideUpdateSort);

                $rootScope.$on('Analytics:rdvr-higher-priority', rdvrPrioritization);
                $rootScope.$on('Analytics:rdvr-lower-priority', rdvrPrioritization);

                // TVOD
                $rootScope.$on('Analytics:tvod-purchase-stop', tvodPurchaseStop);

                // PIN entry events
                $rootScope.$on('Analytics:showPinDialog', showPinDialog);
                $rootScope.$on('Analytics:pinEntry', pinEntry);
                $rootScope.$on('Analytics:closePinDialog', closePinDialog);

                $rootScope.$on('goToDesktopVersionClicked', goToDesktopVersionClicked);

                $rootScope.$on('Analytics:select-channel', selectChannel);
                $rootScope.$on('Analytics:select-channel-card', selectChannelCard);
                $rootScope.$on('Analytics:menu-item-click', menuItemClick);

            }
            catch (ex) {
                $log.error('Analytics navigation:', ex);
            }
        }

        // Now attach the event listeners.
        attachEventListeners();

        return {
            appTriggeredRouting,
            attachEventListeners,
            closePinDialog,
            extractFilters,
            extractSorts,
            flashWarning,
            goToDesktopVersionClicked,
            guideUpdateFilters,
            guideUpdateSort,
            modalStart,
            modalView,
            pageChangeComplete,
            partiallyRendered,
            pauseNavigation,
            pinEntry,
            selectAction,
            selectContent,
            showPinDialog,
            startNavigation,
            switchScreen,
            timerTimedout,
            tvodPurchaseStart,
            tvodPurchaseStop,
            unpauseNavigation
        };
    }
}());
