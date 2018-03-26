(function () {
    'use strict';

    angular.module('ovpApp.analytics.analyticsAssetHelper', [])
    .factory('analyticsAssetHelper', AnalyticsAssetHelper);

    /* @ngInject */
    function AnalyticsAssetHelper($log) {

        function populateChannelData(target, channel) {
            // Do nothing if no channel to work with.
            if (!channel) {
                return target;
            }

            target.contentFormat = channel.hd ? 'HD' : 'SD';
            target.favorite = channel.favorite;
            target.callSign = channel.callSign;
            target.tmsGuideId = channel.tmsId;

            // parentallyBlocked by channel is deprecated. Do not use.
            // target.parentallyBlocked = channel.isParentallyBlocked;
            return target;
        }

        function populateAssetData(target, asset) {
            // Do nothing if no asset to work with.
            if (!asset) {
                return target;
            }

            target.parentallyBlocked = isParentallyBlocked(asset);
            target.rating = asset.rating || null;
            target.tmsProgramId = getTmsProgramId(asset);
            target.tmsSeriesId = getTmsSeriesId(asset);
            if (asset.scheduledStartTimeSec) {
                target.startTimestamp = asset.scheduledStartTimeSec;
            }
            if (asset.scheduledEndTimeSec) {
                target.endTimestamp = asset.scheduledEndTimeSec;
            }
            if (target.entitled || asset.isEntitled) {
                target.entitled = target.entitled || asset.isEntitled;
            }

            // Default contentClass to what was already set, otherwise use what
            // the asset provides.
            if (asset.contentClass && !target.contentClass) {
                target.contentClass = asset.contentClass.toLowerCase();
            }

            if (asset.network) {
                target.callSign = asset.network.callsign;
            }

            return target;
        }

        function isTvodAsset(asset) {
            return asset &&
                asset.isTvodEntitled &&
                asset.tvodStream &&
                asset.tvodStream.streamProperties &&
                asset.tvodStream.streamProperties.tvodEntitlement;
        }

        function populateTvodData(target, asset) {

            // Do nothing if no asset to work with.
            if (!isTvodAsset(asset)) {
                return target;
            }

            target.operationType = 'playbackPlaySelected';
            target.purchaseType = 'rent';

            let tvodStreamProperties = asset.tvodStream.streamProperties;

            // Collect rental expiration date in milliseconds.
            target.rentalExpirationDate = tvodStreamProperties.tvodEntitlement.rentalEndTimeUtcSeconds ?
                tvodStreamProperties.tvodEntitlement.rentalEndTimeUtcSeconds * 1000 :
                undefined;

            target.rentalDurationHours = tvodStreamProperties.rentalWindowInHours;

            if (tvodStreamProperties.price) {
                target.price = '' + tvodStreamProperties.price;
            }
        }

        function populateStreamData(target, stream) {

            // Do nothing if no stream to work with.
            if (!stream) {
                return target;
            }

            // Validate we have a usable streaming format.
            target.streamingFormat = stream.type ? stream.type.toLowerCase() : 'hls';
            if (['hls', 'smooth', 'dash'].indexOf(target.streamingFormat) < 0) {
                // Streaming format not recognized, so revert to default.
                target.streamingFormat = 'hls';
            }

            let streamProps = stream.streamProperties;
            if (streamProps) {
                if (streamProps.attributes) {
                    target.contentFormat = streamProps.attributes.indexOf('HIGH_DEF') > -1 ? 'HD' : 'SD';
                    target.closedCaptioningCapable = streamProps.attributes.indexOf('CLOSED_CAPTIONING') > -1;
                }

                // Overrides network callsign from asset.
                if (stream.network && stream.network.callsign) {
                    target.callSign = stream.network.callsign;
                }

                // Bookmark data if on-demand
                if (isOnDemandContentClass(target.contentClass)) {
                    target.bookmarkPositionSec = 0;
                    if (streamProps.bookmark && streamProps.bookmark.playMarkerSeconds) {
                        target.bookmarkPositionSec = streamProps.bookmark.playMarkerSeconds || 0;
                    }
                }

                // CDVR attributes
                if (streamProps.cdvrRecording) {
                    target.dvrRecordingId = streamProps.cdvrRecording.recordingId;
                    target.contentUri = streamProps.cdvrRecording.playUrl;
                    target.tmsGuideId = streamProps.cdvrRecording.tmsGuideId;

                    // These times are expected to be in milliseconds.
                    target.recordingStartTimestamp = streamProps.cdvrRecording.startTimeSec;
                    target.recordingStopTimestamp = streamProps.cdvrRecording.stopTimeSec;
                }

                // We may have a guide ID on the stream.
                if (streamProps.tmsGuideId) {
                    target.tmsGuideId = streamProps.tmsGuideId.toString();
                } else if (streamProps.tmsGuideServiceId) {
                    target.tmsGuideId = streamProps.tmsGuideServiceId.toString();
                }

                if (streamProps.providerAssetID) {
                    target.providerAssetId = streamProps.providerAssetID;
                }

                // Capture tmsProgramId from the stream, because it may vary
                // if the asset has multiple tmsProgramIds.
                target.tmsProgramId = getTmsProgramId(stream);
            }

            return target;
        }

        /**
         * Returns true if the given contentClass indicates an on-demand asset.
         *
         * @param contentClass contentClass of asset to examine.
         * @return True if this is an on-demand type of asset, otherwise false.
         */
        function isOnDemandContentClass(contentClass) {
            let result = (contentClass && contentClass.endsWith('od') || false);
            return result;
        }

        function populateEventData(target, evt) {
            // Do nothing if no event to work with.
            if (!evt) {
                return target;
            }

            if (evt.runtimeInSeconds && Number.isInteger(evt.runtimeInSeconds)) {
                target.runtime = evt.runtimeInSeconds * 1000;
            }
            target.operationType = target.operationType || evt.operationType;

            // Override the 'triggeredBy' field if the incoming event specifies it.
            target.triggeredBy = (angular.isDefined(evt.triggeredBy) ? evt.triggeredBy : 'user');

            return target;
        }

        /**
         * Find and return the tmsProgramId in this asset or stream, if defined.
         *
         * @param assetOrStream The asset or stream object to examine.
         *
         * @return The tmsProgramId as a string, or undefined.
         */
        function getTmsProgramId(assetOrStream) {

            // If no assetOrStream, nothing to return.
            if (!assetOrStream) {
                return undefined;
            }

            // Case 1: Simple value on asset.
            if (assetOrStream.tmsProgramId) {
                return '' + assetOrStream.tmsProgramId;
            }

            // Case 2: Look for tmsProviderProgramId in streamProperties
            // (This is only if the incoming arg is a populated stream)
            if (assetOrStream.streamProperties &&
                assetOrStream.streamProperties.tmsProviderProgramID) {
                return '' + assetOrStream.streamProperties.tmsProviderProgramID;
            }

            // Case 3: Get first value from array of tmsProgramIds, if it exists.
            return getFirstArrayValueAsString(assetOrStream.tmsProgramIds, undefined);
        }

        /**
         * Convert the given object to an array.
         * @param obj An object that may already be an array, or an object with
         *            integer indices to values. Values are assumed to already be
         *            strings. Indices are assumed to start at zero and have no
         *            gaps.
         * @return An array containing the values in obj.
         */
        function objToArray(obj) {

            // Short circuit: Already given an array.
            if (Array.isArray(obj)) {
                return obj;
            }

            // Main logic: convert indexed object to an array. Assume indices are
            // sequential integers.
            let result = [];
            let idx = 0;
            while (obj && obj[idx]) {
                result.push('' + obj[idx]);
                ++idx;
            }

            return result;
        }

        /**
         * Find and return the tmsSeriesId in this asset, if defined.
         *
         * @param asset to examine
         *
         * @return The tmsSeriesId as a string, or undefined.
         */
        function getTmsSeriesId(asset) {

            // If no asset, nothing to return.
            if (!asset) {
                return undefined;
            }

            // Case 1: Simple value on asset.
            if (asset.tmsSeriesId) {
                return '' + asset.tmsSeriesId;
            }

            // Case 2: If this is a 'show' from the Guide page, value might
            // be in the 'stateOptions' subobject.
            if (asset.stateOptions && asset.stateOptions.tmsSeriesId) {
                return asset.stateOptions.tmsSeriesId;
            }

            // Case 3: Get first value from array of tmsSeriesIds, if it exists.
            return getFirstArrayValueAsString(asset.tmsSeriesIds, undefined);
        }

        /**
         * Find and return the tmsSeriesId in this asset, if defined.
         *
         * @param asset to examine
         *
         * @return The tmsSeriesId as a string, or undefined.
         */
        function getEpisodeTitle(asset) {

            // If no asset, nothing to return.
            if (!asset) {
                return undefined;
            }

            // Case 1: A series has a series title and a title.
            if (asset.title && asset.seriesTitle) {
                return '' + asset.title;
            }

            // Fallthrough is undefined.
            return undefined;
        }

        /**
        * Find and return the assetProviderId in this asset, if defined.
         *
         * @param asset to examine
         *
         * @return The assetProviderId as a string, or undefined.
         */
        function getProviderAssetId(asset) {

            // If no asset, nothing to return.
            if (!asset) {
                return undefined;
            }

            // Case 1: Simple value on asset.
            if (asset.providerAssetId) {
                return '' + asset.providerAssetId;
            }

            // Case 2: Get first value from array of tmsProgramIds, if it exists.
            return getFirstArrayValueAsString(asset.providerAssetIds, undefined);
        }

        /**
         * Find and return the tmsGuideId in this asset, if defined.
         *
         * @param asset to examine
         *
         * @return The assetProviderId as a string, or undefined.
         */
        function getTmsGuideId(asset) {

            // If no asset, nothing to return.
            if (!asset) {
                return undefined;
            }

            // Case 1: Simple value on asset.
            if (asset.tmsGuideId) {
                return '' + asset.tmsGuideId;
            }

            // Fallthrough: undefined.
            return undefined;
        }

        /**
         * Find and return the airtime of this asset, if defined. This generally
         * only works for shows from the guide.
         *
         * @param asset to examine
         *
         * @return The airtime, or undefined.
         */
        function getAirtime(asset) {

            // If no asset, nothing to return.
            if (!asset) {
                return undefined;
            }

            // Case 1: If this is a 'show' from the Guide page, value might
            // be in the 'stateOptions' subobject.
            if (asset.stateOptions && asset.stateOptions.tmsSeriesId) {
                return asset.stateOptions.airtime;
            }

            // Fallthrough: undefined.
            return undefined;
        }

        /**
         * Determine if this asset has been parentally blocked or not.
         *
         * @param asset to examine
         *
         * @return True if asset is parentally blocked, otherwise false.
         */
        function isParentallyBlocked(asset) {

            let isBlocked = false;

            if (asset && asset.defaultStream && asset.defaultStream.streamProperties) {

                isBlocked = asset.defaultStream.streamProperties.parentallyBlockedByChannel ||
                    asset.defaultStream.streamProperties.parentallyBlockedByRating ||
                    asset.isBlockedByParentalControls ||
                    false;

            } else if (asset) {
                isBlocked = asset.isBlockedByParentalControls || false;
            }

            return isBlocked;
        }

        /**
         * Retrieve the contentClass for an asset
         *
         * @param asset to work with
         *
         * @return Null if no contentClass, otherwise the given contentClass in lowercase.
         */
        function getContentClass(asset) {

            // Validate we have something to work with.
            if (!asset.contentClass) {
                $log.error('Playback: no content class supplied', asset);
                return null;
            }

            // Normalize incoming content class.
            return asset.contentClass.toLowerCase();
        }

        /**
         * Retrieve the first value from a given array, if it exists, as a string.
         *
         * @param possibleArray Possible array to act upon.
         * @param defaultValue Value to return if unable to return first value for any reason.
         *
         * @return First array value cast to a string, otherwise an empty string.
         */
        function getFirstArrayValueAsString(possibleArray, defaultValue) {

            if (possibleArray &&
                Array.isArray(possibleArray) &&
                possibleArray.length > 0) {

                return '' + possibleArray[0];
            }

            // Fallthrough
            return defaultValue;
        }

        function extractRecordingOptions(asset, cdvrSettings) {
            // $log.debug('Analytics: extractRecordingOptions', asset, cdvrSettings);

            let result = {};

            // Capture cdvrSettings
            if (cdvrSettings) {
                angular.extend(result, cdvrSettings);
            }

            // If no asset to work with, return now.
            if (!asset) {
                return result;
            }

            // Capture asset data.
            let defaultStream = asset.defaultStream || null;
            let defaultStreamProperties = defaultStream && defaultStream.streamProperties || null;

            if (defaultStreamProperties) {
                setStringValue(result, 'startTime', defaultStreamProperties.startTime);
                setStringValue(result, 'endTime', defaultStreamProperties.endTime);
                setStringValue(result, 'channelId', defaultStreamProperties.tmsGuideServiceId);
            }

            let network = asset.network || null;
            if (network && network.callsign) {
                result.callsign = network.callsign;
            }

            result.channelNumber = (asset.displayChannel ? '' + asset.displayChannel : undefined);
            result.title = asset.seriesTitle || asset.title;  // Prefer series title if available
            result.seriesId = getTmsSeriesId(asset);
            result.episodeTitle = getEpisodeTitle(asset);
            result.programId = getTmsProgramId(asset);
            setStringValue(result, 'episodeNumber', asset.episodeNumber);

            // Prune undefined values
            pruneUndefinedValues(result);

            // $log.debug('Analytics: extractRecordingOptions complete', asset, result);

            return result;
        }

        function setStringValue(object, id, value) {
            if (value) {
                object[id] = '' + value;
            }
        }

        /**
         * Copy all the named property values in the given object to string
         * equivalents in the returned object. Non-scalar properties (like objects)
         * are not returned in the result.
         * @param obj The object containing scalar properties to convert.
         * @return New object containing string versions of the scalar properties in obj.
         */
        function convertAllValuesToStrings(obj) {
            let result = {};
            for (var property in obj) {
                // Only grab non-object child properties.
                if (obj.hasOwnProperty(property) && typeof obj[property] !== 'object' && obj[property] !== null) {
                    let value = obj[property];
                    if (typeof value === 'string') {
                        result[property] = obj[property];
                    } else if (typeof value !== 'string') {
                        result[property] = value.toString();
                    } else {
                        $log.warn('Analytics: Unexpected property type: ' + typeof value +
                            ' for property ' + property, obj);
                    }
                }
            }

            return result;
        }

        /**
         * Remove all attributes from the given object whose value is 'undefined'.
         *
         * @param obj The object from which to remove undefined values.
         */
        function pruneUndefinedValues(obj) {
            for (var property in obj) {
                // Only grab non-object child properties.
                if (obj.hasOwnProperty(property) && typeof obj[property] === 'undefined') {
                    // $log.debug('Removing undefined property: ' + property);
                    delete obj[property];
                }
            }

            return obj;
        }

        /**
         * Convert the incoming on-demand category name, such as 'Movies', 'Kids',
         * etc, to one of the venona normalized names, such as 'curatedMovies',
         * 'curatedKids', etc.
         *
         * @param name The incoming content category name.
         * @return Normalized equivalent for the given name.
         */
        function normalizeContentCategoryName(name) {
            if ('Featured' === name) {
                return 'curatedFeatured';
            } else if ('TV Shows' === name) {
                return 'curatedTvShows';
            } else if ('Movies' === name) {
                return 'curatedMovies';
            } else if ('Kids' === name) {
                return 'curatedKids';
            } else if ('Networks' === name) {
                return 'curatedNetworks';
            }

            // Fallthrough
            return 'curatedCatalog';
        }

        function toLowerCamelCase(name) {

            if (!name) {
                return name;
            }

            // Remove whitespace & lowercase the first letter
            // and convert first letters of the remaining words into uppercase
            let words = name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1));
            words[0] = words[0].charAt(0).toLowerCase() + words[0].slice(1);
            let newName = words.join('');

            // $log.debug('Analytics: toLowerCamelCase [' + name + '] -> [' + newName + ']');
            return newName;
        }

        let service = {
            populateChannelData,
            populateAssetData,
            populateStreamData,
            populateTvodData,
            populateEventData,
            isTvodAsset,
            getTmsProgramId,
            getTmsSeriesId,
            getTmsGuideId,
            getAirtime,
            getEpisodeTitle,
            getProviderAssetId,
            getContentClass,
            isParentallyBlocked,
            extractRecordingOptions,
            convertAllValuesToStrings,
            objToArray,
            toLowerCamelCase,
            isOnDemandContentClass,
            normalizeContentCategoryName,
            pruneUndefinedValues
        };

        return service;
    }
}());
