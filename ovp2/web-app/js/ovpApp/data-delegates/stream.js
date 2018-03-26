(function () {
    'use strict';

    angular.module('ovpApp.dataDelegate')
    .factory('streamViewModelDefinition', streamViewModelDefinition)
    .constant('CDVR_STATE', {
            SCHEDULED: 'scheduled',
            IN_PROGRESS: 'inProgress',
            COMPLETED: 'completed'
        });

    /* @ngInject */
    function streamViewModelDefinition(DataDelegate, delegateUtils, CDVR_STATE) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            cdvrState: cached(function () {
                if (this.cdvrRecording) {
                    return this.cdvrRecording.cdvrState;
                }
            }),
            isCDVRRecorded: cached(function () {
                return this.cdvrState === CDVR_STATE.IN_PROGRESS || this.cdvrState === CDVR_STATE.COMPLETED;
            }),
            isOnDemandStream: function () {
                return (this.type === 'ONLINE_ONDEMAND');
            },
            isLinearStream: function () {
                return this.type === 'LINEAR';
            },
            isOnNow: function () {
                let now = Date.now();
                return this.streamProperties.startTime <= now &&
                    this.streamProperties.endTime > now;
            },
            duration: cached(function () {
                if (this.isOnDemandStream) {
                    return this.streamProperties.runtimeInSeconds;
                } else if (this.isCDVRRecorded) {
                    return this.cdvrRecording.stopTimeSec -
                        this.cdvrRecording.startTimeSec;
                }
            }),
            isEntitled: cached(function () {
                if (this.isCDVRRecorded) {
                    // DVR always entitled. TODO - This can be removed when NNS
                    // starts returning this with the proper value
                    return true;
                } else if (this.streamProperties.tvodEntitlement) {
                    return true;
                } else {
                    return this.streamProperties.entitled;
                }
            }),
            cdvrNotCompleted: cached(function () {
                let cdvrRecording = this.streamProperties && this.streamProperties.cdvrRecording;
                return !!cdvrRecording && cdvrRecording.cdvrState !== CDVR_STATE.COMPLETED;
            }),
            isTvodStream: function () {
                return this.isOnDemandStream && this.streamProperties.price > 0;
            },
            bookmark: 'streamProperties.bookmark',
            cdvrRecording: 'streamProperties.cdvrRecording',
            streamProperties: 'streamProperties',
            index: 'index',
            defaultStream: 'defaultStream',
            type: 'type',
            network: 'network',
            // Get stream properties formatted for display
            streamProps: cached(function () {
                return delegateUtils.getStreamProps([this]);
            })
        });
    }
})();
