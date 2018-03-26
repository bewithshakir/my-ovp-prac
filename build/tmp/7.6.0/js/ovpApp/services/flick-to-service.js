'use strict';

(function () {
    'use strict';
    FlickToService.$inject = ["config", "$http", "stbService", "$log", "$q", "$rootScope", "errorCodesService"];
    angular.module('ovpApp.services.flickTo', ['ovpApp.config', 'ovpApp.services.stbService']).factory('flickToService', FlickToService);

    /* @ngInject */
    function FlickToService(config, $http, stbService, $log, $q, $rootScope, errorCodesService) {

        var flickToQamUrl = config.piHost + config.flickVod;

        var service = {
            flickToVodQam: flickToVodQam,
            tuneToChannel: tuneToChannel
        };

        return service;

        function flickToQamRequest(providerAssetId, macAddress, offsetInSeconds) {
            return $http({
                url: flickToQamUrl + '/' + providerAssetId + '/mac/' + macAddress + '?offsetInSeconds=' + offsetInSeconds,
                withCredentials: true,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: ''
            });
        }

        // /ipvs/api/smarttv/flick/vod/nbc.com::NBCU2015111600002329/mac/44:E0:8E:B9:09:1B?offsetInSeconds=0
        function flickToVodQam(providerAssetId, offset, stb) {
            var offsetInSeconds = 0;
            if (offset !== undefined) {
                offsetInSeconds = offset;
            }

            if (stb) {
                return flickToQamRequest(providerAssetId, stb.macAddress, offsetInSeconds);
            } else {
                return stbService.getCurrentStbPromise().then(function (currentStb) {
                    return flickToQamRequest(providerAssetId, currentStb.macAddress, offsetInSeconds);
                });
            }
        }

        function tuneToChannel(stream) {
            var channelNumber = stream.channelNumber,
                defer = $q.defer();
            if (!channelNumber) {
                if (stream.streamProperties.allChannelNumbers && stream.streamProperties.allChannelNumbers.length) {
                    channelNumber = stream.streamProperties.allChannelNumbers[0];
                } else {
                    var errorCode = 'WCM-1000';
                    var errorMessage = errorCodesService.getMessageForCode(errorCode);

                    // Analytics (switchScreen)
                    $rootScope.$broadcast('Analytics:switchScreen', {
                        switchScreenId: 'unknown',
                        errorCode: errorCode,
                        clientErrorCode: 'Channel not found',
                        errorMessage: errorMessage
                    });
                    defer.reject({
                        clientErrorCode: 'Channel not found',
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    });
                }
            } else {
                var errorCode = 'WCM-1000';
                var errorMessage = errorCodesService.getMessageForCode(errorCode);

                // Analytics (switchScreen)
                $rootScope.$broadcast('Analytics:switchScreen', {
                    switchScreenId: 'unknown',
                    errorCode: errorCode,
                    clientErrorCode: 'Channel not found',
                    errorMessage: errorMessage
                });
                defer.reject({
                    clientErrorCode: 'Channel not found',
                    errorCode: errorCode,
                    errorMessage: errorMessage
                });
            }

            stbService.getCurrentStbPromise().then(function (currentStb) {
                var url = config.piHost + config.smartTvApi + config.epgsApi + config.epgs.stbTune;

                var data = {
                    apicall: 'tune-channel',
                    mac: currentStb.macAddress,
                    channel: channelNumber
                };

                return $http({
                    url: url,
                    withCredentials: true,
                    method: 'GET',
                    params: data
                }).then(function (res) {
                    // Analytics (switchScreen)
                    $rootScope.$broadcast('Analytics:switchScreen', {
                        switchScreenId: currentStb.macAddress
                    });

                    defer.resolve(res);
                }, function (error) {

                    var errorCode = 'WCM-1000';
                    var errorMessage = errorCodesService.getMessageForCode(errorCode);

                    // Analytics (switchScreen)
                    $rootScope.$broadcast('Analytics:switchScreen', {
                        switchScreenId: currentStb ? currentStb.macAddress : 'unknown',
                        errorCode: errorCode,
                        clientErrorCode: JSON.stringify(error),
                        error: error,
                        errorMessage: errorMessage
                    });

                    defer.reject({
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    });
                    $log.error('Error flicking to watch', error);
                });
            });
            return defer.promise;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/flick-to-service.js.map
