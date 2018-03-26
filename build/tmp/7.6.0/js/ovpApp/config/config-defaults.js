/* globals window */
'use strict';

(function () {
    'use strict';
    /**
     * Make the defaults global for initilization of the config class prior to angular bootstrap, this should be
     * passed to the OvpConfig class when it is initialized to create the basis for all configuration.
     * These values may be overridden by:
     * 1. Passed build parameters i.e. `-Dvideo_api='https://localhost/vs/api/v3'`
     * 2. Selected environment parameters: (Paraments attributed to environments.json)
     * 3. ActivityConfig parameters.
     *
     * If a function must reference the current configuration - then this should use the global configuration class:
     *  window.currentConfig instead of a local closure variable.
     */
    var defaultConfig = {
        confirmMessageDelayMs: 5000, // Delay closing dialog after displaying results message
        playerBufferControlParameters: {
            overrideDefaults: true,
            initialBufferLengthInMilliSec: 1500,
            defaultPlaybackBufferLengthInMilliSec: 30000,
            vodPlaybackBufferLengthInMilliSec: 60000
        },
        playerBitrateControlParameters: {
            overrideDefaults: false,
            bitrateControlPolicy: 'aggressivePolicy',
            initialBitrateInBitsPerSec: 0,
            minimumBitrateInBitsPerSec: 0,
            maximumBitrateInBitsPerSec: 0
        },
        playerChannelBrowserDefaultSortByType: 'networkAToZ',
        playDrmOnlyStreams: true,
        showPlayerChannelBrowserFiltersOutOfHome: false,
        analytics: {
            applicationName: 'OneApp',
            customer: 'Charter',
            domain: 'video',
            applicationType: 'OVP',
            debug: false,
            debugIgnored: ['apiCall'],
            filterFields: true,
            blacklist: {
                urls: ['https://v-collector.dp-bkp.prd-aws.charter.net/api/collector', 'https://splunk.ovp.timewarnercable.com/']
            },
            pageTimeoutMillis: 30000,
            venona: {
                enabled: true,
                events: {
                    checkAvailableChannels: true,
                    error: true,
                    login: true,
                    loginStart: true,
                    loginActionComplete: true,
                    loginStop: true,
                    logout: true,
                    apiCall: true,
                    playbackSelect: true,
                    playbackStreamUriAcquired: true,
                    playbackStart: true,
                    bufferingStart: true,
                    bufferingStop: true,
                    playbackTrickPlayStart: true,
                    playbackTrickPlayStop: true,
                    playbackStop: true,
                    playbackBitRateUpshift: true,
                    playbackBitRateDownshift: true,
                    playbackPauseStart: true,
                    playbackPauseStop: true
                }
            }
        },
        offCanvasMenu: {
            enabled: false,
            manageAccountLink: 'https://www.spectrum.net/login/?target=https://www.spectrum.net/my-account/',
            getSupportLink: 'http://www.spectrum.net/support/'
        },
        supportLink: 'http://www.spectrum.net/support/tv/spectrumtvcom-support/',
        piHost: 'https://api.spectrum.net',
        registrationHost: 'https://www.spectrum.net',
        forgotHost: 'https://www.spectrum.net',
        smartTvApi: '/ipvs/api/smarttv',
        oAuthApi: '/auth/oauth',
        nrsApi: '/nrs/api',
        nmdEpgsApiV1: '/nmdepgs/v1',
        epgsApi: '/epg/v0',
        nnsApi: '/nationalnavigation/V1',
        nnsVersion: '/nationalnavigation/V1/data/swversion',
        authorize: '/authenticate',
        customerInfo: '/secured/customer-info',
        favoritesService: {
            get: '/favorites/channels/v1', // Retrieve List of Favorite Channels
            set: '/favorites/channels/v1/set', // Set Favorite Channels
            add: '/favorites/channels/v1/add', // Add a Favorite Channel
            channelStatus: '/favorites/channels/v1/channelNumber', // Status of a Favorite Channel
            serviceIdStatus: '/favorites/channels/v1/ncsServiceId', // Status of a Favorite Channel
            remove: '/favorites/channels/v1/remove' // Remove a Favorite Channel
        },
        location: '/location/v1',
        watchlist: '/watchList/v1',
        watchListParameters: {
            showOutOfWindow: false
        },
        vod: {
            globalBookmarks: '/bookmarks/v2'
        },
        oAuth: {
            routes: ['piHost', 'vpns.baseUri'],
            tempRequest: '/request',
            authorize: '/device/authorize',
            autoAuthorize: '/auto/authorize',
            masqueradeAuthorize: '/masquerade/authorize',
            status: '/token/status',
            token: '/token',
            refresh: '/refresh',
            consumerKey: 'void', //overwritten by environment
            s: 'void', //overwritten by environment
            tokenExchange: '/ssotoken/exchange'
        },
        flashNotEnabledMessage: '1225',
        ssoEnabled: false,
        masqueradeEnabled: false,
        // https://chalk.charter.com/display/XGI/Stream+2.0
        streamPlus: {
            offers: '/ipvs/api/smarttv/offers',
            base: '/v1/base',
            cart: '/v1/cart',
            eligible: '/ipvs/api/smarttv/offers/v1/buyflow/eligible',
            enabled: false,
            buyFlowEnabled: false
        },
        //Keeping buyUrl outside "streamPlus" because it is also used by "no-video-service" page
        buyUrl: 'https://buy.spectrum.com',
        streamBuyUrl: 'https://www.spectrum.com/stream',
        smartTv: {
            info: '/info/v1/name',
            capabilities: '/user/capabilities/v3',
            adobeSession: '/adobe/session',
            cdvrBookmark: '/action/dvr/v1/bookmark',
            cdvrProgram: '/cdvr/v1/programs'
        },
        registration: {
            createUsername: '/my-account/create/',
            forgot: '/forgot/'
        },
        epgs: {
            genres: '/genres',
            stbTune: '/stb/tune',
            stbUpdate: '/stb/update-name',
            guideGrid: '/guide/grid',
            channelListQam: '/guide/channels',
            channelListIp: '/channels/v1',
            guideSearch: '/searchListings',
            guide: '/guide',
            grid: '/grid',
            details: '/details',
            ipOnlyGuide: '/guide/v2/twctv/grid'
        },
        nrs: {
            stb: '/stbs'
        },
        nns: {
            entryPoint: '/symphoni/entrypoint',
            qamStbConfig: 'ovp_v6',
            ipOnlyConfig: 'ovp_acc_v6',
            specUConfig: 'ovp_specu_v1',
            bulkMDUConfig: 'ovp_bulk_mdu_v1'
        },
        search: {
            minimumCharacters: 1,
            quickResultsPerColumn: 10,
            fullResultsPerCategory: 50
        },
        piPolicyPath: '/utilities/sftpwebserver/OVP/0.2/clientaccesspolicy.html',
        useFixtures: false,
        env: 'ENV_NOT_SET',
        name: 'ENV_NOT_SET',
        ajaxAnalyticsEnabled: 'false',
        drmLAUri: 'http://twc.live.ott.irdeto.com/playready/rightsmanager.asmx',
        eulaMd5: 'D63A2F0C07FBB797C4B0CC65FC1A9699',
        iosAppStoreLink: 'https://geo.itunes.apple.com/us/app/twc-tv/id420455839?mt=8',
        androidAppStoreLink: 'https://play.google.com/store/apps/details?id=com.TWCableTV',
        image_api: 'https://services.timewarnercable.com/imageserver',
        timewarner_cable: 'http://www.timewarnercable.com',
        help_twcable: 'http://help.twcable.com/html/policies.html',
        optout: 'https://www.timewarnercable.com/en/our-company/legal/privacy-policy/arbitration-opt-out.html',
        services: {
            guide: '/secured/guide/grid',
            dvrBase: '/rdvr*/dvr/',
            dvrScheduled: '/scheduled',
            dvrSchedule: '/schedule',
            dvrRecorded: '/recorded',
            dvrRecordedResume: '/recorded/play/resume/',
            dvrRecordedPlay: '/recorded/play/',
            dvrRecording: '/recording',
            dvrDiskUsage: '/usage',
            dvrRecordedDelete: '/recorded/delete',
            dvrSeriesPriorities: '/series/priorities',
            dvrConflicts: '/scheduled/conflicts',
            stbs: '/secured/stb',
            tune: '/secured/stb/tune',
            config: '/tdcs/public/inform?clientType=ONEAPP-OVP',
            configAuth: '/tdcs/inform',
            streamingChannels: '/ipvs/api/smarttv/channels/v1',
            onNowOnNext: '/ipvs/api/smarttv/guide/v1/twctv',
            headend: '/data/lookupHeadEnd/',
            headend_info: '/secured/guide/headend/info',
            fips: '/ipvs/api/eas/v1/storecustomerfips'
        },
        vpns: {
            baseUri: 'https://vpns-sys.timewarnercable.com'
        },
        cdvrEnabled: true, // Enabled, but user still has to individually have the capability
        ipOnlyEnabled: true,
        easEnabled: 'false',
        eanChannelNumber: 9999,
        channelRenderLimit: 200,
        channelRenderBuffer: 10,
        throttleScrollingInterval: 250,
        flickVod: '/ipvs/api/smarttv/flick/vod',
        remoteSessionControlEnabled: false,
        locationService: '/api/smarttv/location/v1',
        minorCategoryPodThreshold: 0,
        vodAssetsPerPage: 100,
        maxApplicationWidth: 1600,
        minApplicationWidth: 1000,
        resetScheduledRecordingsDelayInMs: 30000,
        adEnabled: true,
        vodDrmEnabled: true,
        versionCheckTimeoutIntervalMS: 600000, //600000 milliseconds = 10 minutes
        tvodRent: true,
        tvodWatch: true,
        liveTvDrmEnabled: true,
        mockExpressUrl: 'https://ovp.timewarnercable.com:4435',
        loginPath: '/',
        parentalControlsRootUrl: function parentalControlsRootUrl() {
            return window.currentConfig.piHost;
        },
        parentalControls: {
            parentalControlsForUserUrl: function parentalControlsForUserUrl() {
                return window.currentConfig.parentalControlsRootUrl() + '/ipvs/api/smarttv/parentalcontrol/v1';
            },
            parentalControlsByRatingUrl: function parentalControlsByRatingUrl() {
                return window.currentConfig.parentalControlsRootUrl() + '/ipvs/api/smarttv/parentalcontrol/v1/ratings';
            },
            validatePINUrl: function validatePINUrl() {
                return window.currentConfig.parentalControlsRootUrl() + '/ipvs/api/smarttv/parentalcontrol/v1/pin/validate';
            },
            setPINUrl: function setPINUrl() {
                return window.currentConfig.parentalControlsRootUrl() + '/ipvs/api/smarttv/parentalcontrol/v1/pin';
            },
            parentalControlsByChannelUrl: function parentalControlsByChannelUrl() {
                return window.currentConfig.parentalControlsRootUrl() + '/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels';
            },
            updateParentalControlsByChannelUrl: function updateParentalControlsByChannelUrl() {
                return window.currentConfig.parentalControlsRootUrl() + '/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels';
            },
            validateAdminPasswordUrl: function validateAdminPasswordUrl() {
                return window.currentConfig.parentalControlsRootUrl() + '/ipvs/api/smarttv/parentalcontrol/v1/admin/validate';
            }
        },
        purchasePinRootUrl: function purchasePinRootUrl() {
            return window.currentConfig.piHost;
        },
        purchasePin: {
            purchasePINUrl: function purchasePINUrl() {
                return window.currentConfig.purchasePinRootUrl() + '/ipvs/api/smarttv/tvod/v1/pin';
            },
            validatePurchasePINUrl: function validatePurchasePINUrl() {
                return window.currentConfig.purchasePinRootUrl() + '/ipvs/api/smarttv/tvod/v1/pin/validate';
            }
        },
        customerInfoUrl: function customerInfoUrl() {
            return this.piHost + this.smartTvApi + this.smartTv.info;
        },
        capabilitiesUrl: function capabilitiesUrl() {
            return this.piHost + this.smartTvApi + this.smartTv.capabilities;
        },
        capabilitiesCacheTimeoutInMinutes: 1440, // 24 hours
        capabilitiesRefreshOnFailureInMinutes: 1,
        capabilitiesFailureRetryCount: 3,
        locationUrl: function locationUrl() {
            return this.piHost + this.smartTvApi + this.location;
        },
        featureTourSlides: [{
            index: 0,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-livetv',
            headerText: '',
            subHeaderText: 'Live TV almost anywhere',
            description: 'Watch all of your favorite channels at home and many top-rated ' + ' networks from any WiFi connection.'
        }, {
            index: 1,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-channel-sort',
            headerText: '',
            subHeaderText: 'Channels A - Z or 1, 2, 3',
            description: 'Click anywhere on live video to sort the live TV guide by channel ' + 'name or channel number. It\'s your choice!',
            'class': 'pull-image-left'
        }, {
            index: 2,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-search',
            headerText: '',
            subHeaderText: 'Search for anything, from anywhere',
            description: 'Search by title, person or sports team to easily find live TV, On ' + 'Demand and recorded DVR content.',
            'class': 'pull-image-right'
        }, {
            index: 3,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-every-way',
            headerText: '',
            subHeaderText: 'Every way to watch',
            description: 'Live TV, On Demand or on your DVR - it\'s all in one place. Spend ' + 'less time searching and more time watching.',
            'class': 'pull-image-left'
        }, {
            index: 4,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-ondemand',
            headerText: '',
            subHeaderText: 'Thousands of <u>FREE</u> On Demand shows',
            description: 'Browse by category or network, then add your favorites to Watch ' + 'Later to keep them all in one place.',
            'class': 'pull-image-right'
        }, {
            index: 5,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-in-progress',
            headerText: '',
            subHeaderText: 'Finish where you left off',
            description: 'Find your in progress On Demand shows in the Watch Later menu. Tap the ' + 'show, then Resume to continue watching.',
            'class': 'pull-image-left'
        }, {
            index: 6,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-set-dvr',
            headerText: '',
            subHeaderText: 'Set your DVR',
            description: 'To record a show, select the episode from the episode list, then choose' + ' Record. Select a series or single recording, choose your options and you\'re good to go!',
            'class': 'pull-image-right'
        }, {
            index: 7,
            imageUrl: '/imageserver/supporting?image=ovp-6-0-parental-controls',
            headerText: '',
            subHeaderText: 'You\'re in charge',
            description: 'Set a PIN and block by rating or channel. Blocks apply to all devices ' + 'signed in with the same user name. To remove the block, just enter the PIN.',
            'class': 'pull-image-left'
        }],
        intervalForChannelBrowserUpdateInMinutes: 2,
        intervalForOnNowOnNextUpdateInMinutes: 15,
        thresholdForOnNextTitleUpdateInMinutes: 5,
        useAlternateDAIScheme: 'true',
        useDAIforLIVE: true,
        useDAIforVOD: true,
        useDRMforLIVE: true,
        useDRMforVOD: true,
        csidforLIVE: 'stva_ovp_pc_live',
        csidforVOD: 'stva_ovp_pc_vod',
        csidForSpecULive: 'stvu_ovp_pc_live',
        csidForSpecUVod: 'stvu_ovp_pc_vod',

        splunkControlParameters: {
            'splunkLoggingEnabled': true,
            'splunkHeartbeatEnabled': true,
            'splunkPlayerStatusEnabled': true,
            'splunkExceptionLoggingEnabled': true,
            'reportFrequencyMs': 30000,
            'maxBufferSizeRecords': 50,
            'heartbeatFrequencyMs': 120000
        },

        playerParameters: {
            'skipSeconds': 30,
            'playerControlsTimeoutMS': 15000,
            'infoPopupTimeoutMs': 5000
        },

        splunk: {
            domain: 'https://splunk.dev-spectrum.net/',
            path: 'device/',
            clientName: 'ovp',
            url: function url() {
                return this.domain + 'device/ovp/logger?apikey=' + defaultConfig.oAuth.consumerKey;
            }
        },
        newEpisodeThreshold: 7, //Days old an episode should be before it is considered new
        displayRawRentError: true,
        hideDevTools: false, //Tools will always be disabled for prod, this will disable for other environments.
        guide: {
            zoneHeightMultiplier: 2, // This sets the zone size to (x * screen height)
            zoneWidthMultiplier: 2, // This sets the zone size to (x * screen width)
            prefetchDistance: 1, //This currently only works for vertical prefetch
            viewportWidthMultiplier: 2, //When calculating visible zones, use this size to determine zones in view
            viewportHeightMultiplier: 2
        },
        vastSupport: true,
        globalSettings: 'Global',
        websiteSettings: 'Website',
        adBlockerDetection: { // Check to see if user has an ad blocker installed
            enabled: true, // ad block detection is enabled
            blockPlaybackIfAdsBlocked: true, // block playback if ad blocker is installed
            blockPlaybackOnlyIfDaiStream: true, // Block playback only on DAI streams.
            debug: true // log debug statements to console
        },
        stbSettings: 'Spectrum Receiver',
        stbSettingsEnabled: false,
        stbSettingsParentalControls: {
            timeBlockEnabled: false,
            channelBlockEnabled: false
        },
        aegisRefreshUri: function aegisRefreshUri() {
            return this.piHost + this.smartTvApi + '/aegis/v1/refresh';
        },
        aegisUri: function aegisUri() {
            return this.piHost + this.smartTvApi + '/aegis/v1';
        },
        connectivityService: {
            enabled: true,
            debug: false,
            checkXhrEnabled: true,
            checkXhrPath: 'favicon.ico',
            checkXhrIntervalMs: 30000,
            checkXhrMaxIntervalMs: 300000, // 5 minutes
            delayMessageWhenNotPlayingMs: 3000, // 3 seconds
            // How long to wait before showing the offline message.  This is subtracted
            // from the default playback buffer.  For example, VOD playback has a 60
            // second buffer, so we would wait 55 seconds before showing the offline message
            // 60000 - 5000 = 55000
            delayMessageWhenPlayingMs: 5000,
            debounceOnlineMs: 15000
        },
        authNeededTrackingDomain: '.timewarnercable.com',
        maxPlayerSegmentError: 3, //Maximum number of failures for the same file before restarting the stream
        enableSegmentErrorRestart: true, // Enable restart of a live stream if repeated 404s occur.
        forgotPinNumber: '1-844-762-1297',
        ivrNumber: '1-800-892-2253', //
        _accessibilityIvrNumber: '1-844-762-1301', //Use ivrNumber, it gets updated wiht this value on capabilities
        streamPlusIvrNumber: '(000)000-0000', //TBD,
        blacklistLoginPhone: '(855) 757-7328',
        errorCodesService: {
            checkIntervalMs: 30 * 60 * 1000 // 30 minutes
        },
        autoAccessDisabledTimePeriodInMinutes: 1440,
        specU: {
            enabled: false, //Spec U auto access enabled
            universityInfoUrl: '/specu/info',
            maxSignOutIntervalInMs: 86400000, // 24 hour configuration for specu user signout
            iosAppStoreLink: 'https://itunes.apple.com/us/app/spectrumu/id827887111?mt=8',
            androidAppStoreLink: 'https://play.google.com/store/apps/details?id=com.charter.university'
        },
        bulkMDU: {
            enabled: false
        }
    };
    if (window.defaultConfig) {
        for (var key in window.defaultConfig) {
            if (window.defaultConfig.hasOwnProperty(key)) {
                defaultConfig[key] = window.defaultConfig[key];
            }
        }
    }
    window.defaultConfig = defaultConfig;
})();
//# sourceMappingURL=../../maps-babel/ovpApp/config/config-defaults.js.map
