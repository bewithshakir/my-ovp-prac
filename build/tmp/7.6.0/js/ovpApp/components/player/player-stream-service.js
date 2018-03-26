'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    playerStreamService.$inject = ["config", "$http", "parentalControlsService", "adBlockerDetection", "drmSessionService", "$q", "alert", "$state", "playerErrors", "$rootScope", "locationService", "dummyEANAsset", "whatsOn", "playerService", "deviceid", "messages", "$log", "$timeout", "$interval", "blockingScreenService", "errorCodesService", "profileService"];
    angular.module('ovpApp.player.streamService', ['ovpApp.config', 'ovpApp.services.parentalControlsService', 'ovpApp.adBlockerDetection', 'ovpApp.services.drmSessionService', 'ovpApp.player', 'ovpApp.services.locationService', 'ovpApp.playerControls.miniGuideData', 'ovpApp.player.whatsOn', 'ovpApp.legacy.deviceid', 'ovpApp.messages', 'ovpApp.components.alert', 'ovpApp.player.blockingScreen', 'ovpApp.services.errorCodes']).factory('playerStreamService', playerStreamService);

    /* @ngInject */
    function playerStreamService(config, $http, parentalControlsService, adBlockerDetection, drmSessionService, $q, alert, $state, playerErrors, $rootScope, locationService, dummyEANAsset, whatsOn, playerService, deviceid, messages, $log, $timeout, $interval, blockingScreenService, errorCodesService, profileService) {

        var aegisPromise = undefined,
            playbackStoppedHandler = undefined;

        var currentAsset = null;

        var service = {
            playChannel: playChannel,
            playVodAsset: playVodAsset,
            playEAN: playEAN
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
        function playChannel(_ref) {
            var player = _ref.player;
            var channel = _ref.channel;
            var triggeredBy = _ref.triggeredBy;

            currentAsset = channel.asset;
            $rootScope.$broadcast('sap-reset');
            player.trigger('channel-changed', { channel: channel, triggeredBy: triggeredBy });
            blockingScreenService.hide();
            return whatsOn.now(channel).then(function (assetOnNow) {
                return checkChannelEntitlements({ channel: channel }).then(function () {
                    $rootScope.$broadcast('player:assetSelected', assetOnNow);
                    return handleParentalControls({ player: player, asset: assetOnNow });
                }).then(function () {
                    return getLinearStream(channel.streamUri, player);
                }).then(function (streamInfo) {
                    triggerLiveStreamUriObtained(streamInfo, { player: player, channel: channel });
                    playStream({
                        player: player,
                        uri: streamInfo.stream.streamUrlWithDAIScheme,
                        drm: streamInfo.drm,
                        mode: 'LIVE',
                        aegis: streamInfo.stream.aegis,
                        tokenRefreshSeconds: streamInfo.stream.token_refresh_seconds
                    });
                    return streamInfo;
                }).then(function (streamInfo) {
                    return handleAdBlocker(streamInfo);
                })['catch'](convertError)['catch'](function (error) {

                    // Analytics error
                    $rootScope.$emit('Analytics:playbackFailure', {
                        channel: channel,
                        asset: currentAsset,
                        cause: error,
                        errorCode: 'WVS-1001',
                        errorMessage: errorCodesService.getMessageForCode('WVS-1001')
                    });

                    return handleBlockedError(error, channel.asset).then(function () {
                        return playChannel({ player: player, channel: channel });
                    });
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

            var operationType = 'playbackPlaySelected';
            var elementStandardizedName = options.isCdvr ? 'asset' : 'onDemandWatch';
            if (options.startTime !== 0) {
                operationType = 'playbackResumeSelected';
                elementStandardizedName = options.isCdvr ? 'asset' : 'onDemandResume';
            }
            if (options.isStartOver === true) {
                operationType = 'playbackRestartSelected';
            }

            if (options.isCdvr) {
                options.player.trigger('cdvr-content-selected', { asset: options.asset,
                    operationType: operationType,
                    elementStandardizedName: elementStandardizedName,
                    stream: options.stream });
            } else {
                options.player.trigger('vod-content-selected', { asset: options.asset,
                    runtimeInSeconds: options.stream.duration,
                    elementStandardizedName: elementStandardizedName,
                    contentBookmark: options.startTime, operationType: operationType });
            }

            blockingScreenService.hide();

            return checkVodEntitlements(options).then(function () {
                return handleParentalControls(options);
            }).then(function () {
                return getVODStream(options);
            }).then(function (streamInfo) {
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
            }).then(function (streamInfo) {
                return handleAdBlocker(streamInfo);
            })['catch'](convertError)['catch'](function (error) {
                // Analytics error
                $rootScope.$emit('Analytics:playbackFailure', {
                    asset: currentAsset,
                    cause: error,
                    errorCode: 'WVS-1003',
                    errorMessage: errorCodesService.getMessageForCode('WVS-1003')
                });

                return handleBlockedError(error, options.asset).then(function () {
                    return playVodAsset(options);
                });
            });
        }

        /**
         * Play EAN message
         * @param  {object} options.player flash player object to interact with
         * @param  {object} options.eanUrl url to play from
         * @return {promise}     Promise will resolve when playback sucessfully starts
         *                       or will reject if playback could not start
         */
        function playEAN(_ref2) {
            var player = _ref2.player;
            var eanUrl = _ref2.eanUrl;

            $rootScope.$broadcast('player:assetSelected', dummyEANAsset);

            playStream({ player: player, uri: eanUrl, mode: 'LIVE' });

            return $q.resolve();
        }

        function checkChannelEntitlements(_ref3) {
            var channel = _ref3.channel;

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
            var refreshInterval = tokenRefreshSeconds;
            var data = { 'aegis': aegis };

            // Clear previous listener
            if (playbackStoppedHandler) {
                player.off('playback-stopped', playbackStoppedHandler);
            }
            // Clear previous timer
            if (aegisPromise) {
                $interval.cancel(aegisPromise);
            }

            aegisPromise = $interval(function () {
                aegisRefreshRequest(data).then(function (data) {
                    refreshInterval = data.token_refresh_seconds;
                })['catch'](function (error) {
                    return handleFraudDetection(error, player);
                });
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
                var errorCode = 'WVS-1005';
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

        function checkVodEntitlements(_ref4) {
            var asset = _ref4.asset;
            var stream = _ref4.stream;
            var isTrailer = _ref4.isTrailer;
            var isCdvr = _ref4.isCdvr;

            return locationService.getLocation().then(function (location) {
                if (isTrailer || isCdvr) {
                    return true;
                } else if (stream.streamProperties.ondemandStreamType === 'TOD') {
                    var tvodEntitlement = stream.streamProperties.tvodEntitlement;
                    var now = Math.round(Date.now() / 1000);
                    if (!tvodEntitlement || now > tvodEntitlement.rentalEndTimeUtcSeconds) {
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

        function convertError() {
            var error = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var result = playerErrors.unknown;

            if (angular.isString(error) && error in playerErrors) {
                result = error;
            } else if (error.status === 403 && error.data.context) {
                var context = error.data.context;
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

        var blockingDefer = undefined;

        function handleBlockedError(error, asset) {
            if (error === playerErrors.blocked || error === playerErrors.adBlocker) {
                // Normally we detect blocking problems before trying to play, so this error
                // only occurs if we think the program is unblocked and yet the server tells
                // us it is. This can happen if asset data is missing.

                blockingScreenService.show({ asset: asset, type: error });
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

            if (!config.adBlockerDetection.enabled || !config.adBlockerDetection.blockPlaybackIfAdsBlocked) {
                return $q.resolve();
            }

            adBlockerDetection.adsBlocked().then(function () {
                // not blocked
                return $q.resolve();
            }, function () {
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
                    blockingScreenService.show({ type: 'adBlocker' });

                    return $q.reject(playerErrors.adBlocker);
                }

                return $q.resolve();
            });
        }

        function handleParentalControls(_ref5) {
            var player = _ref5.player;
            var asset = _ref5.asset;
            var stream = _ref5.stream;
            var isTrailer = _ref5.isTrailer;

            if (blockingDefer) {
                // If previous channel had a blocking defer, get rid of it
                blockingDefer.reject(playerErrors.tunedAway);
                blockingDefer = undefined;
            }

            if (isTrailer) {
                return $q.resolve();
            } else {
                var streamRating = stream && stream.streamProperties && stream.streamProperties.rating ? stream.streamProperties.rating : '';

                // If data is missing, then we do not enforce asset parental controls. It's possible it will
                // fail if the server knows something we don't, in which case it goes to error handling
                var assetBlocked = asset ? asset.isBlocked : $q.resolve(false);
                return $q.all([assetBlocked, parentalControlsService.isBlockedByRating(streamRating), parentalControlsService.isParentalControlsDisabledForClient()]).then(function (_ref6) {
                    var _ref62 = _slicedToArray(_ref6, 3);

                    var assetBlocked = _ref62[0];
                    var streamBlocked = _ref62[1];
                    var isPCDisabledForClient = _ref62[2];

                    if ((assetBlocked || streamBlocked) && !isPCDisabledForClient) {
                        blockingDefer = $q.defer();
                        blockingScreenService.show({ type: 'parentalControls' });
                        return blockingDefer.promise;
                    } else {
                        return $q.resolve();
                    }
                });
            }
        }

        function triggerLiveStreamUriObtained(streamInfo, _ref7) {
            var player = _ref7.player;
            var channel = _ref7.channel;

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
            var player = options.player;
            var asset = options.asset;
            var stream = options.stream;
            var isTrailer = options.isTrailer;

            var prodProvider = asset.network ? asset.network.product_provider : '';
            // CDVR assets do not have a product provider?
            prodProvider = prodProvider || '';
            var index = prodProvider.indexOf(':');
            var provider = prodProvider.substring(index + 1);
            var product = prodProvider.substring(0, index);

            player.trigger('stream-uri-obtained', {
                stream: streamInfo.stream, //We need to pass the stream received from IPVS and not our stream delegate
                isTrailer: isTrailer,
                scrubbingEnabled: !isFastForwardDisabled(stream),
                playerType: options.isCdvr ? 'cdvr' : 'onDemand',
                contentBookmark: options.startTime,
                contentMetadata: {
                    product: product,
                    provider: provider,
                    contentIdType: 'thePlatform', // TODO This type doesn't seem to be used by venona
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
            return stream && stream.streamProperties.tricks_mode && stream.streamProperties.tricks_mode.FASTFORWARD !== undefined;
        }

        function playStream(_ref8) {
            var player = _ref8.player;
            var uri = _ref8.uri;
            var drm = _ref8.drm;
            var startTime = _ref8.startTime;
            var eptTime = _ref8.eptTime;
            var mode = _ref8.mode;
            var aegis = _ref8.aegis;
            var tokenRefreshSeconds = _ref8.tokenRefreshSeconds;

            if (!playerService.isValidPlayRoute()) {
                return;
            }

            drm = drm || null;
            startTime = startTime || 0;

            $rootScope.$broadcast('Session:setCapabilities', [{
                capabilityName: 'DRMPlayback',
                status: drm ? 'enabled' : 'disabled'
            }]);
            blockingScreenService.hide();

            var mediaKeys = drm ? [{
                sessionId: drm.sessionId,
                ticketId: drm.ticketId
            }] : null;

            player.setMediaKeys(mediaKeys);

            player.setSrc([uri]);

            // set buffer lenght
            try {
                var bufferConfig = config.playerBufferControlParameters;
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
            var drm = undefined;

            return handleLinearDRM().then(function (d) {
                return drm = d;
            }).then(function () {
                return getLiveStreamData(drm);
            }).then(function (data) {
                return $http({
                    url: config.piHost + uri,
                    params: data,
                    method: 'GET',
                    withCredentials: true
                });
            }).then(function (result) {
                if (!result.data.drm && config.playDrmOnlyStreams) {
                    return $q.reject();
                } else {
                    result.data.streamUrlWithDAIScheme = getStreamUrlWithDAIScheme(result.data);
                    return {
                        drm: drm,
                        stream: result.data
                    };
                }
            })['catch'](function (error) {
                return handleFraudDetection(error, player);
            });
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
            var csid = profileService.isSpecU() ? config.csidForSpecULive : config.csidforLIVE;
            var data = {
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

            return $q.all([parentalControlsService.isParentalControlsDisabledForClient(), parentalControlsService.getLocalPin()]).then(function (_ref9) {
                var _ref92 = _slicedToArray(_ref9, 2);

                var disabled = _ref92[0];
                var pin = _ref92[1];

                if (disabled) {
                    data.parentalControlPIN = pin;
                }
                return data;
            });
        }

        function getVODStream(_ref10) {
            var stream = _ref10.stream;
            var isTrailer = _ref10.isTrailer;
            var isCdvr = _ref10.isCdvr;
            var player = _ref10.player;

            var uri = undefined,
                drm = undefined;

            if (isTrailer) {
                uri = config.piHost + stream.streamProperties.ipvsTrailerUrl;
            } else if (isCdvr) {
                uri = config.piHost + stream.streamProperties.cdvrRecording.playUrl;
            } else {
                uri = config.piHost + stream.streamProperties.mediaUrl;
            }

            return handleVODDRM().then(function (d) {
                drm = d;
                return getVODStreamData(drm);
            }).then(function (data) {
                return $http({
                    url: uri,
                    params: data,
                    method: 'GET',
                    withCredentials: true
                });
            }).then(function (result) {
                if (!result.data.drm && config.playDrmOnlyStreams) {
                    return $q.reject();
                } else {
                    return {
                        drm: drm,
                        stream: result.data,
                        isTrailer: isTrailer
                    };
                }
            })['catch'](function (error) {
                return handleFraudDetection(error, player);
            });
        }

        function getVODStreamData(drm) {
            var csid = profileService.isSpecU() ? config.csidForSpecUVod : config.csidforVOD;
            var data = {
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

            return parentalControlsService.getLocalPin().then(function (pin) {
                data.parentalControlPIN = pin;
                return data;
            });
        }

        function getStreamUrlWithDAIScheme(streamInfo) {
            var schemeUrl = streamInfo.stream_url;
            if (streamInfo.dai && config.useAlternateDAIScheme) {
                schemeUrl += schemeUrl.indexOf('?') !== -1 ? '&' : '?';
                schemeUrl += 'imptoken=1';
            }
            return schemeUrl;
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/player-stream-service.js.map
