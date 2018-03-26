/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.rdvr.service', function () {
    'use strict';

    var rdvrService, $httpBackend, $scope, $rootScope, rdvrCacheService, ovpStorage,
        mockStb = {
            macAddressNormalized: '12345678',
            rdvrVersion: 2,
            dvr: true
        };

    beforeEach(module('ovpApp.rdvr.rdvrService', function ($provide) {
        $provide.value('recordingViewModelDefinition', {
            createInstance: function (data) {
                return data;
            }
        })

    }));
    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
    }));
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    /* jscs:disable */
    beforeEach(inject(function (_rdvrService_, _$q_, _$timeout_,
                                _$injector_, _$rootScope_, _rdvrCacheService_, _ovpStorage_) {

        rdvrCacheService = _rdvrCacheService_;
        rdvrService = _rdvrService_;
        $httpBackend = _$injector_.get('$httpBackend');
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        ovpStorage = _ovpStorage_;
    }));
    /* jscs:enable */

    it('should instantiate the service', function () {
        expect(rdvrService).toBeDefined();
    });


    describe('getSeriesPriorities', function () {
        //just forwards along to the series-priority datasource
    });

    describe('setSeriesPriorities', function () {
       //just forwards along to the series-priority datasource
    });

    describe('getMyRecordingGroups', function () {
        it('should group recordings', function () {

        });
    });

    describe('getCompletedAndInProgressRecordings', function () {
        //just forwards along to the my-recordings datasource
    });

    describe('deleteRecordings', function () {
        it('should reset disk usage on successful deletion', function () {

        });
    });


    describe('getUsage', function () {
        //just forwards along to the disk-usage datasource
    });

    describe('cancelScheduled', function () {
        //just forward along to the scheduled recordings datasource
    });

    describe('scheduleRecording', function () {
        //just forward along to the scheduled recordings datasource

    });

    describe('playCompletedRecording', function () {
        it('should handle success', function (done) {
            rdvrService.playCompletedRecording(mockStb, {
                mystroServiceId: '123',
                tmsProgramId: '1',
                startTime: 1234566
            }).then(done);

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/recorded/play/123/1/1234566')
                .respond(200);

            $httpBackend.flush();
        });

        it('should handle failure', function (done) {
            rdvrService.playCompletedRecording(mockStb, {
                mystroServiceId: '123',
                tmsProgramId: '1',
                startTime: 1234566
            }).then(null, done);

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/recorded/play/123/1/1234566')
                .respond(404);

            $httpBackend.flush();
        });
    });

    describe('resumeCompletedRecording', function () {
        it('should handle success', function (done) {
            rdvrService.resumeCompletedRecording(mockStb, {
                mystroServiceId: '123',
                tmsProgramId: '1',
                startTime: 1234566
            }).then(done);

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/recorded/play/resume/123/1/1234566')
                .respond(200);

            $httpBackend.flush();
        });

        it('should handle failure', function (done) {
            rdvrService.resumeCompletedRecording(mockStb, {
                mystroServiceId: '123',
                tmsProgramId: '1',
                startTime: 1234566
            }).then(null, done);

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/recorded/play/resume/123/1/1234566')
                .respond(404);

            $httpBackend.flush();
        });
    });

    describe('getScheduledConflicts', function () {
        it('should get conflicts for a scheduled recordings', function (done) {
            rdvrService.getScheduledConflicts(mockStb, {
                mystroServiceId: '123',
                tmsProgramId: '1',
                startTime: 1234566
            }).then(done);

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/scheduled/conflicts/123/1/1234566/single')
                .respond(200, {
                    conflictingRecordings: []
                });

            $httpBackend.flush();
        });

        it('should retry first failure', function (done) {
            rdvrService.getScheduledConflicts(mockStb, {
                mystroServiceId: '123',
                tmsProgramId: '1',
                startTime: 1234566
            }).then(done);

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/scheduled/conflicts/123/1/1234566/single')
                .respond(500, 'fail');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/scheduled/conflicts/123/1/1234566/single')
                .respond(200, {
                    conflictingRecordings: []
                });

            $httpBackend.flush();
        });

        it('should fail to get conflicts for a scheduled recording not found', function (done) {
            rdvrService.getScheduledConflicts(mockStb, {
                mystroServiceId: '123',
                tmsProgramId: '1',
                startTime: 1234566
            }).then(null, done);

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/scheduled/conflicts/123/1/1234566/single')
                .respond(500, 'fail');

            $httpBackend.expectGET('/nrs/api/rdvr2/dvr/12345678/scheduled/conflicts/123/1/1234566/single')
                .respond(500, 'fail');

            $httpBackend.flush();
        });
    });

    describe('getSeriesRecordingSettings', function () {
        it('should return valid displayChannel', function () {
            let result = rdvrService.getSeriesRecordingSettings({
                series: {
                    displayChannel: 302
                },
                episode: {},
                stream: {
                    streamProperties: {
                        allChannelNumbers: [21, 302]
                    }
                }
            });
            expect(result.displayChannel).toBe(302);
        });
        it('should return first channel if displayChannel is not available', function () {
            let result = rdvrService.getSeriesRecordingSettings({
                series: {},
                episode: {},
                stream: {
                    streamProperties: {
                        allChannelNumbers: [21, 302]
                    }
                }
            });
            expect(result.displayChannel).toBe(21);
        });
        it('should return first channel if displayChannel is not set', function () {
            let result = rdvrService.getSeriesRecordingSettings({
                series: {
                    displayChannel: 212
                },
                episode: {},
                stream: {
                    streamProperties: {
                        allChannelNumbers: [21, 302]
                    }
                }
            });
            expect(result.displayChannel).toBe(21);
        });
    });

    describe('getEventRecordingSettings', function () {
        it('should return valid displayChannel', function () {
            let result = rdvrService.getEventRecordingSettings({
                asset: {
                    displayChannel: 302,
                    tmsProgramIds: []
                },
                stream: {
                    streamProperties: {
                        allChannelNumbers: [21, 302]
                    }
                }
            });
            expect(result.displayChannel).toBe(302);
        });
        it('should return first channel if displayChannel is not available', function () {
            let result = rdvrService.getEventRecordingSettings({
                asset: {
                    tmsProgramIds: []
                },
                stream: {
                    streamProperties: {
                        allChannelNumbers: [21, 302]
                    }
                }
            });
            expect(result.displayChannel).toBe(21);
        });
        it('should return first channel if displayChannel is not set', function () {
            let result = rdvrService.getEventRecordingSettings({
                asset: {
                    displayChannel: 212,
                    tmsProgramIds: []
                },
                stream: {
                    streamProperties: {
                        allChannelNumbers: [21, 302]
                    }
                }
            });
            expect(result.displayChannel).toBe(21);
        });
    });
});
