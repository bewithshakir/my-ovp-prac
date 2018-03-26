(function () {
    'use strict';

    angular
        .module('ovpApp.player.streamService', [
            'ovpApp.config',
            'ovpApp.services.parentalControlsService',
            'ovpApp.adBlockerDetection',
            'ovpApp.services.drmSessionService',
            'ovpApp.player',
            'ovpApp.services.locationService',
            'ovpApp.playerControls.miniGuideData',
            'ovpApp.player.whatsOn',
            'ovpApp.legacy.deviceid',
            'ovpApp.messages',
            'ovpApp.components.alert',
            'ovpApp.player.blockingScreen',
            'ovpApp.services.errorCodes'])
        .factory('playerStreamService', playerStreamService);

    /* @ngInject */
    function playerStreamService(config, $http, parentalControlsService,
        adBlockerDetection, drmSessionService, $q, alert,
        $state, playerErrors, $rootScope, locationService,
        dummyEANAsset, whatsOn, playerService,
        deviceid, messages, $log, $timeout, $interval, blockingScreenService, errorCodesService, profileService) {

        let aegisPromise,
            playbackStoppedHandler;

        let currentAsset = null;

        let service = {
            playChannel,
            playVodAsset,
            playEAN
        };

        activate();

        return service;

        ////////////////

        function activate() {
            $rootScope.$on('player:parentalControlsUnblocked', onParentalControlsUnblocked);
        }

        /**
         * Play a live channel
         * @param  {object} options.player        flash player object to interact with
         * @param  {object} options.channel       channel object to play
         * @param  {object} options.channel.asset data delegate of the current asset on the chanenl
         * @return {promise}    Promise will resolve when playback successfully starts
         *                      or will reject if playback could not start
         */
        function playChannel({player, channel, triggeredBy}) {
            currentAsset = channel.asset;
            $rootScope.$broadcast('sap-reset');
            player.trigger('channel-changed', {channel, triggeredBy});
            blockingScreenService.hide();
            return whatsOn.now(channel).then(assetOnNow => {
                return checkChannelEntitlements({channel})

                .then(() => {
                    $rootScope.$broadcast('player:assetSelected', assetOnNow);
                    return handleParentalControls({player: player, asset: assetOnNow});
                })
                .then(() => getLinearStream(channel.streamUri, player))
                .then(streamInfo => {
                    triggerLiveStreamUriObtained(streamInfo, {player, channel});
                    playStream({
                        player: player,
                        uri: streamInfo.stream.streamUrlWithDAIScheme,
                        drm: streamInfo.drm,
                        mode: 'LIVE',
                        aegis: streamInfo.stream.aegis,
                        tokenRefreshSeconds: streamInfo.stream.token_refresh_seconds
                    });
                    return streamInfo;
                })
                .then(streamInfo => handleAdBlocker(streamInfo))
                .catch(convertError)
                .catch(error => {

                    // Analytics error
                    $rootScope.$emit('Analytics:playbackFailure', {
                        channel: channel,
                        asset: currentAsset,
                        cause: error,
                        errorCode: 'WVS-1001',
                        errorMessage: errorCodesService.getMessageForCode('WVS-1001')
                    });

                    return handleBlockedError(error, channel.asset)
                    .then(() => playChannel({player, channel}));
                });
            });
        }

        /**
         * Play a vod asset
         * @param  {object} options
         * @param  {object} options.player      flash player object to interact with
         * @param  {object} options.asset       data delegate of the asset
         * @param  {object} options.stream      the specific stream to play
         * @param  {bool}   options.isTrailer   true if this is a trailer
         * @param  {bool}   options.isCdvr      true if this is a cdvr playback
         * @param  {bool}   options.isStartover true if asset should start over instead of resume
         * @return {promise}    Promise will resolve when playback successfully starts
         *                      or will reject if playback could not start
         */
        function playVodAsset(options) {
            $rootScope.$broadcast('sap-reset');
            $rootScope.$broadcast('player:assetSelected', options.asset);

            currentAsset = options.asset;

            let operationType = 'playbackPlaySelected';
            let elementStandardizedName = options.isCdvr ? 'asset' : 'onDemandWatch';
            if (options.startTime !== 0) {
                operationType = 'playbackResumeSelected';
                elementStandardizedName = options.isCdvr ? 'asset' : 'onDemandResume';
            }
            if (options.isStartOver === true) {
                operationType = 'playbackRestartSelected';
            }

            if (options.isCdvr) {
                options.player.trigger('cdvr-content-selected', {asset: options.asset,
                    operationType: operationType,
                    elementStandardizedName: elementStandardizedName,
                    stream: options.stream});
            } else {
                options.player.trigger('vod-content-selected', {asset: options.asset,
                    runtimeInSeconds: options.stream.duration,
                    elementStandardizedName: elementStandardizedName,
                    contentBookmark: options.startTime, operationType: operationType});
            }

            blockingScreenService.hide();

            return checkVodEntitlements(options)
                .then(() => handleParentalControls(options))
                .then(() => getVODStream(options))
                .then(streamInfo => {
                    triggerVodStreamUriObtained(streamInfo, options);
                    playStream({
                        player: options.player,
                        uri: streamInfo.stream.stream_url,
                        drm: streamInfo.drm,
                        startTime: options.startTime,
                        eptTime: options.eptTime,
                        mode: 'VOD',
                        aegis: streamInfo.stream.aegis,
                        tokenRefreshSeconds: streamInfo.stream.token_refresh_seconds
                    });

                    return streamInfo;
                })
                .then(streamInfo => handleAdBlocker(streamInfo))
                .catch(convertError)
                .catch(error => {
                    // Analytics error
                    $rootScope.$emit('Analytics:playbackFailure', {
                        asset: currentAsset,
                        cause: error,
                        errorCode: 'WVS-1003',
                        errorMessage: errorCodesService.getMessageForCode('WVS-1003')
                    });

                    return handleBlockedError(error, options.asset)
                    .then(() => playVodAsset(options));
                });
        }

        /**
         * Play EAN message
         * @param  {object} options.player flash player object to interact with
         * @param  {object} options.eanUrl url to play from
         * @return {promise}     Promise will resolve when playback sucessfully starts
         *                       or will reject if playback could not start
         */
        function playEAN({player, eanUrl}) {
            $rootScope.$broadcast('player:assetSelected', dummyEANAsset);

            playStream({player, uri: eanUrl, mode: 'LIVE'});

            return $q.resolve();
        }

        function checkChannelEntitlements({channel}) {
            if (channel.available) {
                return $q.resolve(true);
            } else {
                return $q.reject(playerErrors.outOfHome);
            }
        }

        function aegisDeleteRequest(data) {
            $http({
                url: config.aegisUri(),
                params: data,
                method: 'DELETE',
                withCredentials: true
            });
        }

        function aegisRefreshRequest(data) {
            return $http({
                url: config.aegisRefreshUri(),
                params: data,
                method: 'GET',
                withCredentials: true,
                ignoreStatus: [400]
            });
        }

        function handleAegisToken(aegis, tokenRefreshSeconds, player) {
            if (!aegis || !tokenRefreshSeconds) {
                return;
            }
            let refreshInterval = tokenRefreshSeconds;
            let data = {'aegis' : aegis};

            // Clear previous listener
            if (playbackStoppedHandler) {
                player.off('playback-stopped', playbackStoppedHandler);
            }
            // Clear previous timer
            if (aegisPromise) {
                $interval.cancel(aegisPromise);
            }

            aegisPromise = $interval(() => {
                aegisRefreshRequest(data).then((data) => {
                    refreshInterval = data.token_refresh_seconds;
                }).catch(error => handleFraudDetection(error, player));
            }, refreshInterval * 1000);

            playbackStoppedHandler = function () {
                if (aegisPromise) {
                    $interval.cancel(aegisPromise);
                    aegisPromise = null;
                }
                aegisDeleteRequest(data);
            };

            player.on('playback-stopped', playbackStoppedHandler);
        }

        function handleFraudDetection(error, player) {
            if (error.status === 429) {
                let errorCode = 'WVS-1005';
                $rootScope.$emit('Analytics:playbackFailure', {
                    asset: currentAsset,
                    cause: error,
                    errorCode: errorCode,
                    errorMessage: errorCodesService.getMessageForCode(errorCode)
                });
                alert.open({
                    message: errorCodesService.getMessageForCode(errorCode),
                    buttonText: 'OK'
                });
                if (aegisPromise) {
                    $interval.cancel(aegisPromise);
                }
                // Restrict user from watching a video if aegis refresh url
                // returns an error of 429
                player.stop();
                return $q.reject(playerErrors.oohFraudDetection);
            }
            return $q.reject(error);
        }

        function checkVodEntitlements({asset, stream, isTrailer, isCdvr}) {
            return locationService.getLocation()
                .then(location => {
                    if (isTrailer || isCdvr) {
                        return true;
                    } else if (stream.streamProperties.ondemandStreamType === 'TOD') {
                        let tvodEntitlement = stream.streamProperties.tvodEntitlement;
                        let now = Math.round(Date.now() / 1000);
                        if (!tvodEntitlement || (now > tvodEntitlement.rentalEndTimeUtcSeconds)) {
                            return $q.reject(playerErrors.notRented);
                        } else {
                            return true;
                        }
                    } else if (!asset.isEntitled && !stream.streamProperties.entitled) {
                        return $q.reject(playerErrors.unentitled);
                    } else if (!location.behindOwnModem && !asset.availableOutOfHome) {
                        return $q.reject(playerErrors.outOfHome);
                    } else {
                        return true;
                    }
                });
        }

        function convertError(error = {}) {
            let result = playerErrors.unknown;

            if (angular.isString(error) && error in playerErrors) {
                result = error;
            } else if (error.status === 403 && error.data.context) {
                let context = error.data.context;
                if (context.InUSAOnly || context.blockedOOH) {
                    result = playerErrors.outOfHome;
                } else if (context.blockedByPCChannel || context.blockedByPCRating || context.incorrectPin) {
                    result = playerErrors.blocked;
                } else if (context.unentitled) {
                    result = playerErrors.unentitled;
                } else {
                    result = playerErrors.unknown;
                }
            } else if (error.status === 404) {
                result = playerErrors.notFound;
            }

            return $q.reject(result);
        }

        let blockingDefer;

        function handleBlockedError(error, asset) {
            if (error === playerErrors.blocked || error === playerErrors.adBlocker) {
                // Normally we detect blocking problems before trying to play, so this error
                // only occurs if we think the program is unblocked and yet the server tells
                // us it is. This can happen if asset data is missing.

                blockingScreenService.show({asset: asset, type: error});
                blockingDefer = $q.defer();
                return blockingDefer.promise;
            } else {
                return $q.reject(error);
            }
        }

        function onParentalControlsUnblocked() {
            if (blockingDefer) {
                blockingDefer.resolve();
                blockingDefer = undefined;
            }
        }

        function handleAdBlocker(streamInfo) {
            var isDai = streamInfo.stream.dai;
            var blocked = false;

            if (!config.adBlockerDetection.enabled ||
                !config.adBlockerDetection.blockPlaybackIfAdsBlocked) {
                return $q.resolve();
            }

            adBlockerDetection.adsBlocked().then(() => {
                // not blocked
                return $q.resolve();
            }, () => {
                // blocked
                if (config.adBlockerDetection.blockPlaybackOnlyIfDaiStream) {
                    if (isDai) {
                        blocked = true;
                    }
                } else {
                    blocked = true;
                }

                if (blocked) {
                    if (config.adBlockerDetection.debug) {
                        $log.debug('Blocking playback due to ad blocker');
                    }
                    blockingScreenService.show({type: 'adBlocker'});

                    return $q.reject(playerErrors.adBlocker);
                }

                return $q.resolve();
            });
        }

        function handleParentalControls({player, asset, stream, isTrailer}) {
            if (blockingDefer) {
                // If previous channel had a blocking defer, get rid of it
                blockingDefer.reject(playerErrors.tunedAway);
                blockingDefer = undefined;
            }

            if (isTrailer) {
                return $q.resolve();
            } else {
                let streamRating = stream && stream.streamProperties && stream.streamProperties.rating ?
                    stream.streamProperties.rating : '';

                // If data is missing, then we do not enforce asset parental controls. It's possible it will
                // fail if the server knows something we don't, in which case it goes to error handling
                let assetBlocked = asset ? asset.isBlocked : $q.resolve(false);
                return $q.all([
                    assetBlocked,
                    parentalControlsService.isBlockedByRating(streamRating),
                    parentalControlsService.isParentalControlsDisabledForClient()
                ]).then(([assetBlocked, streamBlocked, isPCDisabledForClient]) => {
                    if ((assetBlocked || streamBlocked) && !isPCDisabledForClient) {
                        blockingDefer = $q.defer();
                        blockingScreenService.show({type: 'parentalControls'});
                        return blockingDefer.promise;
                    } else {
                        return $q.resolve();
                    }
                });
            }
        }

        function triggerLiveStreamUriObtained(streamInfo, {player, channel}) {
            $rootScope.$broadcast('stream-uri-obtained', 'LIVE', streamInfo);
            player.trigger('stream-uri-obtained', {
                stream: streamInfo.stream,
                scrubbingEnabled: false,
                playerType: 'linear',
                contentMetadata: {
                    channelId: channel.tmsId,
                    channelIdType: 'TMS',
                    tmsProgramId: channel.asset && channel.asset.tmsProgramIds[0]
                }
            });

            return streamInfo;
        }

        function triggerVodStreamUriObtained(streamInfo, options) {
            $rootScope.$broadcast('stream-uri-obtained', 'VOD', streamInfo, options);
            let {player, asset, stream, isTrailer} = options;
            let prodProvider = asset.network ? asset.network.product_provider : '';
            // CDVR assets do not have a product provider?
            prodProvider = prodProvider || '';
            let index = prodProvider.indexOf(':');
            let provider = prodProvider.substring(index + 1);
            let product = prodProvider.substring(0, index);

            player.trigger('stream-uri-obtained', {
                stream: streamInfo.stream, //We need to pass the stream received from IPVS and not our stream delegate
                isTrailer: isTrailer,
                scrubbingEnabled: !isFastForwardDisabled(stream),
                playerType: options.isCdvr ? 'cdvr' : 'onDemand',
                contentBookmark: options.startTime,
                contentMetadata: {
                    product: product,
                    provider: provider,
                    contentIdType: 'thePlatform',  // TODO This type doesn't seem to be used by venona
                    contentId: String(asset.providerAssetIds && asset.providerAssetIds[0]),
                    providerAssetId: asset.providerAssetIds && asset.providerAssetIds[0],
                    tmsProgramId: asset.tmsProgramIds && asset.tmsProgramIds[0],
                    contentClass: asset.contentClass,
                    seriesIdType: (asset.isSeries || asset.isEpisode) && 'thePlatform',
                    seriesId: (asset.isSeries || asset.isEpisode) && asset.tmsSeriesId,
                    cdvrRecording: stream.cdvrRecording
                }
            });
            return streamInfo;
        }

        function isFastForwardDisabled(stream) {
            return stream && stream.streamProperties.tricks_mode &&
                stream.streamProperties.tricks_mode.FASTFORWARD !== undefined;
        }

        function playStream({player, uri, drm, startTime, eptTime, mode, aegis, tokenRefreshSeconds}) {
            if (!playerService.isValidPlayRoute()) {
                return;
            }

            drm = drm || null;
            startTime = startTime || 0;

            $rootScope.$broadcast('Session:setCapabilities', [
                {
                    capabilityName: 'DRMPlayback',
                    status: drm ? 'enabled' : 'disabled'
                }
            ]);
            blockingScreenService.hide();

            let mediaKeys = drm ? [{
                    sessionId: drm.sessionId,
                    ticketId: drm.ticketId
                }] : null;

            player.setMediaKeys(mediaKeys);

            player.setSrc([uri]);

            // set buffer lenght
            try {
                let bufferConfig = config.playerBufferControlParameters;
                if (bufferConfig.overrideDefaults) {
                    if (mode === 'LIVE') {
                        player.setBufferControlParameters({
                            initial: bufferConfig.initialBufferLengthInMilliSec,
                            current: bufferConfig.defaultPlaybackBufferLengthInMilliSec
                        });
                    } else if (mode === 'VOD') {
                        player.setBufferControlParameters({
                            initial: bufferConfig.initialBufferLengthInMilliSec,
                            current: bufferConfig.vodPlaybackBufferLengthInMilliSec
                        });
                    }
                }
            } catch (e) {
                $log.error('Error parsing playerBufferControlParameters', e);
            }

            // If we have the eptTime from bookmark then use that time to calculate
            // the correct position in the stream.
            if (eptTime !== undefined && eptTime >= 0) {
                player.setEptTime(eptTime);
            } else {
                player.setCurrentTime(startTime);
            }

            player.play();
            handleAegisToken(aegis, tokenRefreshSeconds, player);
        }

        function getLinearStream(uri, player) {
            let drm;

            return handleLinearDRM()
                .then(d => drm = d)
                .then(() => getLiveStreamData(drm))
                .then(data =>
                    $http({
                        url: config.piHost + uri,
                        params: data,
                        method: 'GET',
                        withCredentials: true
                    }))
                .then(result => {
                    if (!result.data.drm && config.playDrmOnlyStreams) {
                        return $q.reject();
                    } else {
                        result.data.streamUrlWithDAIScheme = getStreamUrlWithDAIScheme(result.data);
                        return {
                            drm: drm,
                            stream: result.data
                        };
                    }
                }).catch(error => handleFraudDetection(error, player));
        }

        function handleLinearDRM() {
            if (config.useDRMforLIVE || config.playDrmOnlyStreams) {
                return drmSessionService.getDRMSession();
            } else {
                return $q.resolve(null);
            }
        }

        function handleVODDRM() {
            if (config.useDRMforVOD || config.playDrmOnlyStreams) {
                return drmSessionService.getDRMSession();
            } else {
                return $q.resolve(null);
            }
        }

        function getLiveStreamData(drm) {
            let csid = profileService.isSpecU() ? config.csidForSpecULive : config.csidforLIVE;
            let data = {
                csid: csid,
                encoding: 'hls',
                'dai-supported': config.useDAIforLIVE,
                'drm-supported': !!drm,
                'vast-supported': config.vastSupport,
                'adID': deviceid.get()
            };
            if (!!drm) {
                data.sessionId = drm.sessionId;
            }

            return $q.all([
                parentalControlsService.isParentalControlsDisabledForClient(),
                parentalControlsService.getLocalPin()
            ]).then(([disabled, pin]) => {
                if (disabled) {
                    data.parentalControlPIN = pin;
                }
                return data;
            });
        }

        function getVODStream({stream, isTrailer, isCdvr, player}) {
            let uri, drm;

            if (isTrailer) {
                uri = config.piHost + stream.streamProperties.ipvsTrailerUrl;
            } else if (isCdvr) {
                uri = config.piHost + stream.streamProperties.cdvrRecording.playUrl;
            } else {
                uri = config.piHost + stream.streamProperties.mediaUrl;
            }

            return handleVODDRM()
                .then(d => {
                    drm = d;
                    return getVODStreamData(drm);
                })
                .then(data =>
                    $http({
                        url: uri,
                        params: data,
                        method: 'GET',
                        withCredentials: true
                    }))
                .then(result => {
                    if (!result.data.drm && config.playDrmOnlyStreams) {
                        return $q.reject();
                    } else {
                        return {
                            drm: drm,
                            stream: result.data,
                            isTrailer: isTrailer
                        };
                    }
                }).catch(error => handleFraudDetection(error, player));
        }

        function getVODStreamData(drm) {
            let csid = profileService.isSpecU() ? config.csidForSpecUVod : config.csidforVOD;
            let data = {
                'dai-supported': config.useDAIforVOD,
                'drm-supported': !!drm,
                csid: csid,
                encoding: 'hls',
                'vast-supported': config.vastSupport,
                'adID': deviceid.get()
            };

            if (!!drm) {
                data.sessionId = drm.sessionId;
            }

            return parentalControlsService.getLocalPin()
                .then(pin => {
                    data.parentalControlPIN = pin;
                    return data;
                });
        }

        function getStreamUrlWithDAIScheme(streamInfo) {
            var schemeUrl = streamInfo.stream_url;
            if (streamInfo.dai && config.useAlternateDAIScheme) {
                schemeUrl += (schemeUrl.indexOf('?') !== -1) ? '&' : '?';
                schemeUrl += 'imptoken=1';
            }
            return schemeUrl;
        }
    }
})();
