describe('streamViewModelDefinition', function () {
    'use strict';

    var streamViewModelDefinition,
        cdvrInProgressDataDelegate,
        cdvrCompletedDataDelegate,
        cdvrScheduledDataDelegate,
        mockCDVRInProgressStream = {
            streamProperties: {
                cdvrRecording: {
                    cdvrState: 'inProgress',
                    stopTimeSec: 1472161000,
                    startTimeSec: 1472160112
                },
                entitled: false,
                runtimeInSeconds: 7200
                }
            },
        mockCDVRCompletedStream = {
            streamProperties: {
                cdvrRecording: {
                    cdvrState: 'completed',
                    stopTimeSec: 1472161000,
                    startTimeSec: 1472160112
                },
                entitled: false,
                runtimeInSeconds: 7200
                }
            },
        mockCDVRScheduledStream = {
            streamProperties: {
                cdvrRecording: {
                    cdvrState: 'scheduled',
                    stopTimeSec: 1472161000,
                    startTimeSec: 1472160112
                },
                entitled: false,
                runtimeInSeconds: 7200
                }
            },
        mockOnDemandStream = {
            streamProperties: {
                runtimeInSeconds: 7200,
                entitled: false
            },
            type: 'ONLINE_ONDEMAND'
        },

        mockTvodStream = {
            streamProperties: {
                runtimeInSeconds: 7200,
                entitled: false,
                tvodEntitlement: {}
            },
            type: 'ONLINE_ONDEMAND'
        },
        onDemandDataDelegate,
        tvodDataDelegate,
        CDVR_STATE;

    beforeEach(module('ovpApp.dataDelegate'));

    beforeEach(inject(function (_streamViewModelDefinition_, _CDVR_STATE_) {
        streamViewModelDefinition = _streamViewModelDefinition_;
        cdvrInProgressDataDelegate = streamViewModelDefinition
            .createInstance(mockCDVRInProgressStream);
        cdvrScheduledDataDelegate = streamViewModelDefinition
            .createInstance(mockCDVRScheduledStream);
        cdvrCompletedDataDelegate = streamViewModelDefinition
            .createInstance(mockCDVRCompletedStream);
        onDemandDataDelegate = streamViewModelDefinition
            .createInstance(mockOnDemandStream);
        tvodDataDelegate = streamViewModelDefinition
            .createInstance(mockTvodStream);
        CDVR_STATE = _CDVR_STATE_;
    }));

    it('stream will return isDVRRecordable if inProgress', function () {
        expect(cdvrInProgressDataDelegate.cdvrState).toBe(CDVR_STATE.IN_PROGRESS);
        expect(cdvrInProgressDataDelegate.isOnDemandStream).toBe(false);
        expect(cdvrInProgressDataDelegate.isCDVRRecorded).toBe(true);
    });

    it('stream will return recorded length for duration if cDVR recorded', () => {
        expect(cdvrInProgressDataDelegate.duration).toBe(888);
        expect(onDemandDataDelegate.duration).toBe(7200);
    });

    it('cdvrNotCompleted returns false if recorded or any a non-dvr stream', function () {
        expect(cdvrCompletedDataDelegate.cdvrNotCompleted).toBe(false);
        expect(onDemandDataDelegate.cdvrNotCompleted).toBe(false);
    });

    it('cdvrNotCompleted returns true if scheduled or in-progress ', function () {
        expect(cdvrScheduledDataDelegate.cdvrNotCompleted).toBe(true);
        expect(cdvrInProgressDataDelegate.cdvrNotCompleted).toBe(true);
    });

    it('isEntitled returns true completed or in-progress ', function () {
        expect(cdvrCompletedDataDelegate.isEntitled).toBe(true);
        expect(cdvrInProgressDataDelegate.isEntitled).toBe(true);
    });

    it('isEntitled returns JSON entitlement value for scheduled and OD with no tvod', function () {
        expect(cdvrScheduledDataDelegate.isEntitled).toBe(false);
        expect(onDemandDataDelegate.isEntitled).toBe(false);

    });

    it('isEntitled returns true if TVOD entitlement is present', function () {
        expect(tvodDataDelegate.isEntitled).toBe(true);
    });

});
