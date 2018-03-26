'use strict';

(function () {
    'use strict';

    productService.$inject = ["$http", "$q", "entryService", "config", "$rootScope", "delegateFactory", "$timeout", "profileService", "messages", "dateFormat", "rx", "rxhttp", "$log", "locationService", "errorCodesService"];
    angular.module('ovpApp.product.service', ['ovpApp.components.alert', 'ovpApp.services.entry', 'ovpApp.config', 'ovpApp.services.profileService', 'ovpApp.dataDelegate', 'ovpApp.services.dateFormat', 'ovpApp.services.locationService', 'ovpApp.services.errorCodes', 'ovpApp.messages']).factory('productService', productService);

    /* @ngInject */
    function productService($http, $q, entryService, config, $rootScope, delegateFactory, $timeout, profileService, messages, dateFormat, rx, rxhttp, $log, locationService, errorCodesService) {

        var service = {
            availabilityMessage: availabilityMessage,
            getCdvrDateText: getCdvrDateText,
            withTmsSeriesId: withTmsSeriesId,
            withTmsId: withTmsId,
            withProviderAssetId: withProviderAssetId,
            withUri: withUri
        };

        var transformQueue = undefined;
        var hasAccessibility = undefined;
        var ooh = undefined;
        profileService.isAccessibilityEnabled().then(function (hasCapability) {
            hasAccessibility = hasCapability;
        });
        locationService.getLocation().then(function (location) {
            ooh = !location.behindOwnModem;
        });
        $rootScope.$on('LocationService:locationChanged', function (event, location) {
            ooh = !location.behindOwnModem;
        });

        $rootScope.$on('Session:setCapabilities', function () {
            //Refresh accessibility capability on refresh
            profileService.isAccessibilityEnabled().then(function (hasCapability) {
                hasAccessibility = hasCapability;
            });
        });

        activate();

        return service;

        //////////////////////////

        function activate() {
            //Catch malformed JSON, for example, a 404 response returns an error string
            transformQueue = [function (val) {
                try {
                    angular.fromJson(val);
                } catch (e) {
                    val = '{}';
                    $log.error('Unable to parse json from server response');
                }
                return val;
            }];
            transformQueue = transformQueue.concat(rxhttp.defaults.transformResponse);
        }

        function availabilityMessage(asset) {
            var cameFromWatchLater = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (!asset) {
                return;
            }
            if (asset.isOutOfWindow && cameFromWatchLater) {
                return errorCodesService.getMessageForCode('WGU-1004');
            } else if (!asset.isEntitled) {
                return errorCodesService.getMessageForCode('WEN-1004', {
                    IVR_NUMBER: config.ivrNumber
                });
            } else if (ooh && !asset.availableOutOfHome) {
                return errorCodesService.getMessageForCode('WLC-1012');
            } else if (asset.entitledTvodStream) {
                var endTime = asset.entitledTvodStream.streamProperties.tvodEntitlement.rentalEndTimeUtcSeconds;
                var time = dateFormat.relative.expanded.atTime(new Date(endTime * 1000));
                return 'Watch rental until ' + time;
            } else if (asset.tvodStream) {
                if (asset.isComplexOffering) {
                    var cheapestStream = asset.streamList.filter(function (str) {
                        return str.isTvodStream;
                    }).sort(function (a, b) {
                        return a.streamProperties.price - b.streamProperties.price;
                    }).shift();
                    return 'Rent from $' + cheapestStream.streamProperties.price + '. Available for ' + cheapestStream.streamProperties.rentalWindowInHours + ' hours.';
                }
                return 'Rent for $' + asset.price + '. Available for ' + asset.tvodStream.streamProperties.rentalWindowInHours + ' hours.';
            } else if (asset.isBlockedByParentalControls) {
                return messages.getMessageForCode('MSG-9045');
            }
        }

        function getCdvrDateText(asset, action) {
            if (action.streamIndex >= 0 && asset && asset.streamList) {
                var dvrStream = asset.streamList[action.streamIndex];
                var startTimeMsec;

                // Prefer the CDVR time if available as it is more specific to
                // the actual recording than perhaps the stream's airtime.
                if (dvrStream.streamProperties.cdvrRecording) {
                    startTimeMsec = dvrStream.streamProperties.cdvrRecording.startTimeSec * 1000;
                } else {
                    startTimeMsec = parseInt(dvrStream.streamProperties.startTime, 10);
                }

                var dateString = dateFormat.absolute.expanded.atTime(new Date(startTimeMsec));

                return dateString;
            }
        }

        function withTmsSeriesId(tmsSeriesId, params) {
            return buildFetcher('tmsSeriesId', tmsSeriesId, params);
        }

        function withTmsId(tmsId, params) {
            return buildFetcher('tmsProviderProgramId', tmsId, params);
        }

        function withProviderAssetId(id, params) {
            return buildFetcher('providerAssetId', id, params);
        }

        function buildFetcher(type, id, params) {
            var promises = {};
            return {
                fetch: function fetch() {
                    var waitForFresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                    if (!promises[waitForFresh]) {
                        promises[waitForFresh] = constructPartialUri(type, id, params).then(function (uri) {
                            return _fetch(uri, waitForFresh);
                        }).then(function (data) {
                            promises[waitForFresh] = undefined;
                            return data;
                        });
                    }
                    return promises[waitForFresh];
                }
            };
        }

        function withUri(uri) {
            return {
                fetch: function fetch() {
                    var waitForFresh = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
                    return _fetch(uri, waitForFresh);
                }
            };
        }

        /**
         * Constructs a partial uri, similar (or, ideally, identical) to the ones passed into .withUri()
         *
         * @param  {string}            type    id type
         * @param  {number or string}  id      the tmsProviderProgramId or tmsSeriesId
         * @param  {object}            params  additional parameters
         * @return {promise}                   promise which resolves to partial uri which can be passed into fetch()
         */
        function constructPartialUri(type, id, params) {
            return entryService.forDefaultProfile().then(function (service) {
                var contextParams = {};

                var serviceTypeMap = {
                    'tmsSeriesId': service.series.tmsSeriesID,
                    'tmsProviderProgramId': service.event.tmsProviderProgramID,
                    'providerAssetId': service.event.providerAssetID
                };

                var requestParams = '';
                if (!params) {
                    params = {
                        app: 'search'
                    };
                }

                if (params) {
                    if (params.app) {
                        contextParams.app = params.app;
                    }
                    if (params.airtime) {
                        contextParams.airtimeUtcSec = params.airtime;
                    }
                    if (params.serviceId) {
                        contextParams.mystroServiceId = params.serviceId;
                    }
                    if (params.tmsGuideServiceId) {
                        contextParams.tmsGuideServiceId = params.tmsGuideServiceId;
                    }

                    requestParams = Object.keys(contextParams).reduce(function (prev, current) {
                        return prev + ('&' + current + '=' + contextParams[current]);
                    }, '');
                }

                if (serviceTypeMap[type]) {
                    return serviceTypeMap[type](id) + requestParams;
                } else {
                    return 'Invalid result type ' + type;
                }
            });
        }

        function _fetch(partialUri, waitForFresh) {
            return rxhttp.get(config.piHost + partialUri, {
                withCredentials: true,
                transformResponse: transformQueue
            }).retry(3) // retry for normal failures
            ['do'](function (result) {
                if (waitForFresh && isStale(result)) {
                    throw 'stale';
                }
            }).retryWhen(retryStaleResults) // retry for stale data only
            .map(function (response) {
                return delegateFactory.createInstance(response.data);
            }).toPromise($q);
        }

        function isStale(result) {
            return result && result.data && result.data.details && result.data.details.staleDvrCache;
        }

        function retryStaleResults(errors) {
            var staleErrors = errors['do'](function (error) {
                if (error !== 'stale') {
                    throw error; //re-emit the error.
                }
            });
            var maxRetries = 10;

            return rx.Observable.range(1, maxRetries).zip(staleErrors, function (i) {
                return i * i * 100;
            }) //Exponential back off 100ms, 400, 900, 1600, 2500, etc
            .flatMap(function (i) {
                return rx.Observable.timer(i);
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/product/product-service.js.map
