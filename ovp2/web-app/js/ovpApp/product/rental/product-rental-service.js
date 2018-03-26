(function () {
    'use strict';

    angular.module('ovpApp.product.rental-service', [
        'ovpApp.services.entry',
        'ovpApp.config',
        'ovpApp.services.purchasePinService',
        'ovpApp.services.parentalControlsService',
        'ovpApp.services.drmSessionService',
        'ovpApp.services.dateFormat',
        'ovpApp.services.splunk',
        'ovpApp.components.pinEntry',
        'ovpApp.purchasePinDialog',
        'ovpApp.parentalControlsDialog'
    ])
    .factory('ProductRentalService', productService);

    /* @ngInject */
    function productService($http, $q, entryService, config, $log, $state, dateFormat, SplunkService,
        purchasePinService, parentalControlsService, drmSessionService, PIN_ENTRY_TYPE,
        purchasePinPopUpConfig, parentalControlsDialog, parentalControlsContext, $rootScope,
        errorCodesService) {

        let service = {
            getRentalOptions,
            confirmRental,
            validatePins,
            validatePurchasePin,
            normalizeRentalError,
            rent
        };

        return service;

        //////////////

        function getTitle(asset, stream) {
            let tmsProviderProgramID = stream.streamProperties.tmsProviderProgramID;
            return asset.programMetadata && asset.programMetadata[tmsProviderProgramID] ?
                asset.programMetadata[tmsProviderProgramID].title : asset.title;
        }

        function getRentalOptions(asset) {
            //Map first to make sure the index is correct
            return asset.streamList
                .map((stream, idx) => {
                    let expandedPrice = stream.streamProperties.price ?
                        stream.streamProperties.price.toString().split('.') : [0, 0];
                    let type = 'hd';
                    stream.streamProperties.attributes.forEach(attribute => {
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
                })
                .filter((streamOption) => streamOption.streamType === 'ONLINE_ONDEMAND' &&
                    streamOption.price > 0 && !streamOption.tvodEntitlement);
        }

        function confirmRental(asset, streamOption) {
            var defer = $q.defer();
            if (streamOption.streamIndex !== undefined) {
                let stream = asset.streamList[streamOption.streamIndex];
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
            return validateParentalControls(scope, asset, stream)
                .then(() => validatePurchasePin(scope, asset, stream));
        }

        function validateParentalControls(scope, asset, stream) {
            return $q.all([asset.isBlocked, parentalControlsService.isBlockedByRating(stream.streamProperties.rating)])
                .then(result => {
                let [isAssetBlocked, isStreamBlocked] = result;
                if (isAssetBlocked || isStreamBlocked) {
                    return parentalControlsService.isParentalControlsDisabledForClient().then((isPCDisabled) => {
                        if (!isPCDisabled) {
                            return parentalControlsDialog
                                .withContext(parentalControlsContext.PLAYBACK)
                                .unlock();
                        }
                    });
                }
            });
        }

        function validatePurchasePin(scope, asset, stream) {
            return $q.all([
                purchasePinService.isPINSet(),
                purchasePinService.isPurchasePINDisabledForClient()
            ]).then(([isPinSet, isPinDisabled]) => {
                if (!isPinSet || isPinDisabled) {
                    return {skipConfirm: false};
                } else {
                    const availableOutOfHome = stream ?
                        stream.availableOutOfHome : asset.tvodAvailableOutOfHome;
                    const options = angular.extend(
                        {},
                        purchasePinPopUpConfig[PIN_ENTRY_TYPE.VALIDATE],
                        {showOOHWarningMessage: !availableOutOfHome}
                    );

                    return scope.showPinValidationDialog(options)
                        .then(() => {
                            return {skipConfirm: true};
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
            let error = {
                code: 'WTX-9000'
            };
            error.message = errorCodesService.getMessageForCode(error.code);
            error.data = receivedError.data;

            // Refine error code if detailed response guides us to a more
            // exact error.
            if (receivedError.data && receivedError.data.context && receivedError.data.context.detailedResponseCode) {
                let [code] = receivedError.data.context.detailedResponseCode.split('.');
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
                let [drm, purchasePIN] = promiseData;

                return parentalControlsService.getLocalPin().then(parentalControlPIN => {
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
                        url: config.piHost +  stream.streamProperties.ipvsRentUrl,
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

                        let normalizedError = normalizeRentalError(error);

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
