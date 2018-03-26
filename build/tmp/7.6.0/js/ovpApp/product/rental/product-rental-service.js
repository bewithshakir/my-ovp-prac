'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    productService.$inject = ["$http", "$q", "entryService", "config", "$log", "$state", "dateFormat", "SplunkService", "purchasePinService", "parentalControlsService", "drmSessionService", "PIN_ENTRY_TYPE", "purchasePinPopUpConfig", "parentalControlsDialog", "parentalControlsContext", "$rootScope", "errorCodesService"];
    angular.module('ovpApp.product.rental-service', ['ovpApp.services.entry', 'ovpApp.config', 'ovpApp.services.purchasePinService', 'ovpApp.services.parentalControlsService', 'ovpApp.services.drmSessionService', 'ovpApp.services.dateFormat', 'ovpApp.services.splunk', 'ovpApp.components.pinEntry', 'ovpApp.purchasePinDialog', 'ovpApp.parentalControlsDialog']).factory('ProductRentalService', productService);

    /* @ngInject */
    function productService($http, $q, entryService, config, $log, $state, dateFormat, SplunkService, purchasePinService, parentalControlsService, drmSessionService, PIN_ENTRY_TYPE, purchasePinPopUpConfig, parentalControlsDialog, parentalControlsContext, $rootScope, errorCodesService) {

        var service = {
            getRentalOptions: getRentalOptions,
            confirmRental: confirmRental,
            validatePins: validatePins,
            validatePurchasePin: validatePurchasePin,
            normalizeRentalError: normalizeRentalError,
            rent: rent
        };

        return service;

        //////////////

        function getTitle(asset, stream) {
            var tmsProviderProgramID = stream.streamProperties.tmsProviderProgramID;
            return asset.programMetadata && asset.programMetadata[tmsProviderProgramID] ? asset.programMetadata[tmsProviderProgramID].title : asset.title;
        }

        function getRentalOptions(asset) {
            //Map first to make sure the index is correct
            return asset.streamList.map(function (stream, idx) {
                var expandedPrice = stream.streamProperties.price ? stream.streamProperties.price.toString().split('.') : [0, 0];
                var type = 'hd';
                stream.streamProperties.attributes.forEach(function (attribute) {
                    if (attribute === 'HIGH_DEF') {
                        type = 'hd';
                    } else if (attribute === 'STANDARD_DEF') {
                        type = 'sd';
                    } else if (attribute === 'THREE_D') {
                        type = '3d';
                    }
                });
                return {
                    title: getTitle(asset, stream),
                    type: type,
                    streamType: stream.type,
                    rating: stream.streamProperties.rating,
                    year: asset.year,
                    length: dateFormat.runtime(stream.streamProperties.runtimeInSeconds),
                    price: stream.streamProperties.price,
                    streamIndex: idx,
                    edition: stream.streamProperties.edition,
                    tmsProviderProgramID: stream.streamProperties.tmsProviderProgramID,
                    rentalDurationHours: stream.streamProperties.rentalWindowInHours,
                    tvodEntitlement: stream.streamProperties.tvodEntitlement,
                    readerPrice: expandedPrice[0] + ' dollars and ' + expandedPrice[1] + ' cents'
                };
            }).filter(function (streamOption) {
                return streamOption.streamType === 'ONLINE_ONDEMAND' && streamOption.price > 0 && !streamOption.tvodEntitlement;
            });
        }

        function confirmRental(asset, streamOption) {
            var defer = $q.defer();
            if (streamOption.streamIndex !== undefined) {
                (function () {
                    var stream = asset.streamList[streamOption.streamIndex];
                    if (stream && stream.streamProperties && stream.streamProperties.ipvsRentUrl) {
                        rent(asset, stream).then(function (result) {
                            $state.go('ovp.ondemand.playProduct', {
                                productID: stream.streamProperties.providerAssetID,
                                streamIndex: streamOption.streamIndex
                            }).then(function () {
                                defer.resolve(result);
                            });
                        }, function (err) {
                            defer.reject(err);
                        });
                    } else {
                        defer.reject({
                            code: 'WTX-9000',
                            message: errorCodesService.getMessageForCode('WTX-9000'),
                            data: {
                                context: {
                                    detailedResponseDescription: 'Invalid options selected'
                                }
                            }
                        });
                    }
                })();
            } else {
                defer.reject({
                    code: 'WTX-9000',
                    message: errorCodesService.getMessageForCode('WTX-9000'),
                    data: {
                        context: {
                            detailedResponseDescription: 'Invalid rental option'
                        }
                    }
                });
            }
            return defer.promise;
        }

        function validatePins(scope, asset, stream) {
            return validateParentalControls(scope, asset, stream).then(function () {
                return validatePurchasePin(scope, asset, stream);
            });
        }

        function validateParentalControls(scope, asset, stream) {
            return $q.all([asset.isBlocked, parentalControlsService.isBlockedByRating(stream.streamProperties.rating)]).then(function (result) {
                var _result = _slicedToArray(result, 2);

                var isAssetBlocked = _result[0];
                var isStreamBlocked = _result[1];

                if (isAssetBlocked || isStreamBlocked) {
                    return parentalControlsService.isParentalControlsDisabledForClient().then(function (isPCDisabled) {
                        if (!isPCDisabled) {
                            return parentalControlsDialog.withContext(parentalControlsContext.PLAYBACK).unlock();
                        }
                    });
                }
            });
        }

        function validatePurchasePin(scope, asset, stream) {
            return $q.all([purchasePinService.isPINSet(), purchasePinService.isPurchasePINDisabledForClient()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2);

                var isPinSet = _ref2[0];
                var isPinDisabled = _ref2[1];

                if (!isPinSet || isPinDisabled) {
                    return { skipConfirm: false };
                } else {
                    var availableOutOfHome = stream ? stream.availableOutOfHome : asset.tvodAvailableOutOfHome;
                    var options = angular.extend({}, purchasePinPopUpConfig[PIN_ENTRY_TYPE.VALIDATE], { showOOHWarningMessage: !availableOutOfHome });

                    return scope.showPinValidationDialog(options).then(function () {
                        return { skipConfirm: true };
                    });
                }
            });
        }

        /**
         * Normalize the given error.
         *
         * @param receivedError The error to normalize
         * @return Error object containing a code and message.
         */
        function normalizeRentalError(receivedError) {

            // Assume default error code and message, unless we can
            // narrow it down via the detailed response.
            var error = {
                code: 'WTX-9000'
            };
            error.message = errorCodesService.getMessageForCode(error.code);
            error.data = receivedError.data;

            // Refine error code if detailed response guides us to a more
            // exact error.
            if (receivedError.data && receivedError.data.context && receivedError.data.context.detailedResponseCode) {
                var _receivedError$data$context$detailedResponseCode$split = receivedError.data.context.detailedResponseCode.split('.');

                var _receivedError$data$context$detailedResponseCode$split2 = _slicedToArray(_receivedError$data$context$detailedResponseCode$split, 1);

                var code = _receivedError$data$context$detailedResponseCode$split2[0];

                switch (code) {
                    case '404':
                        error.code = 'WRN-1404';
                        error.message = errorCodesService.getMessageForCode(error.code);
                        break;
                    case '451':
                    case '452':
                        error.code = 'WRN-1451';
                        error.message = errorCodesService.getMessageForCode(error.code, {
                            IVR_NUMBER: config.ivrNumber
                        });
                        break;
                }
            }

            return error;
        }

        /**
         * Send the rental request - this is the final step in the rental process
         * that actually gets the stream data that needs to be passed to the player.
         *
         * @param  {Event#DataDelegate} asset
         * @param  {Stream Object} stream       A stream object that was passed to the view
         * @return {Promise}                    A promise that will resolve when the rental process is complete
         */
        function rent(asset, stream) {
            var requestData,
                drmSessionPromise = drmSessionService.getDRMSession(),
                purchasePINPromise = purchasePinService.getLocalPin();

            return $q.all([drmSessionPromise, purchasePINPromise]).then(function (promiseData) {
                var _promiseData = _slicedToArray(promiseData, 2);

                var drm = _promiseData[0];
                var purchasePIN = _promiseData[1];

                return parentalControlsService.getLocalPin().then(function (parentalControlPIN) {
                    requestData = {
                        'drm-supported': drm !== undefined,
                        'encoding': 'hls'
                    };

                    if (parentalControlPIN) {
                        requestData.parentalControlPIN = parentalControlPIN;
                    }

                    if (drm !== undefined) {
                        requestData.sessionId = drm.sessionId;
                    }

                    if (purchasePIN) {
                        requestData.purchasePIN = purchasePIN;
                    }

                    return $http({
                        url: config.piHost + stream.streamProperties.ipvsRentUrl,
                        method: 'POST',
                        params: requestData,
                        data: {
                            price: stream.streamProperties.price
                        },
                        withCredentials: true
                    }).then(function (result) {

                        // Analytics
                        $rootScope.$emit('Analytics:tvod-purchase-stop', { // success
                            context: 'tvodFlow',
                            success: true,
                            purchaseId: result.headers('x-trace-id'),
                            asset: asset,
                            triggeredBy: 'application'
                        });

                        return {
                            drmData: drm,
                            streamInfo: result.data
                        };
                    }, function (error) {

                        var normalizedError = normalizeRentalError(error);

                        // Analytics
                        $rootScope.$emit('Analytics:tvod-purchase-stop', { // failed
                            error: angular.copy(error),
                            errorCode: normalizedError.code,
                            errorMessage: normalizedError.message,
                            asset: asset
                        });

                        return $q.reject(normalizedError);
                    });
                });
            });
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/product/rental/product-rental-service.js.map
