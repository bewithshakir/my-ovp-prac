/* globals inject, getJSONFixture */
/* jshint jasmine: true */

describe('ovpApp.services.cdvr', function () {
    'use strict';
    var $httpBackend, $rootScope, cdvrService, $q;

    beforeEach(module('ovpApp.services.cdvr'));
    
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));
    
    beforeEach(module(function ($provide) {
        $provide.value('productService', {
            withTmsId: function (id) {
                return {
                    fetch: function () {
                        return $q.resolve({
                            //Mock Product Service Data Delagate
                            _context: {
                                data: {}
                            },
                            tmsProgramId: id
                        });
                    }
                };
            },
            withTmsSeriesId: function (id) {
                return {
                    fetch: function () {
                        return $q.resolve({
                            _context: {
                                data: {}
                            },
                            tmsSeriesId: id
                        });
                    }
                };
            }
        });
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    /* jscs:disable */
    beforeEach(inject(function (_$injector_, _$rootScope_, _$httpBackend_, _cdvrService_, _$q_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        cdvrService = _cdvrService_;
        $q = _$q_;

        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
        $httpBackend.whenGET('/ipvs/api/smarttv/lineup/v1').respond(getJSONFixture('cdvr/lineup.json'));
        $httpBackend.whenGET('/nationalnavigation/V1/symphoni/entrypoint?division=ATGW-SIT02&lineup=8&profile=ovp_v6')
            .respond(getJSONFixture('cdvr/entrypoint.json'));
        $httpBackend.whenGET('/nationalnavigation/V1/symphoni/dvrmanager/frontdoor?'+
            'division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=92')
                .respond(getJSONFixture('cdvr/dvrmanager.json'));
        $httpBackend.whenGET('/ipvs/api/smarttv/cdvr/v1/programs').respond(getJSONFixture('cdvr/program.json'));
        //This should not be here (CDVR shouldn't rely on stb)
        $httpBackend.whenGET('/nrs/api/stbs').respond(getJSONFixture('cdvr/stbs.json'));
        $httpBackend.whenGET('/ipvs/api/smarttv/cdvr/v1/programs').respond(getJSONFixture('cdvr/program.json'));
        $httpBackend.whenGET('/ipvs/api/smarttv/info/v1/name').respond(getJSONFixture('cdvr/name.json'));
    }));

    it('should get a list of recorded programs', function(){
        cdvrService.getProgramList().then(function (recordings) {
            expect(recordings.length).toBe(8);
            expect(recordings[0].title).toBe('General Hospital');
            expect(recordings[3].network.callsign).toBe('FUSEHD');
            expect(recordings[2].genreString).toBe('Reality');
            // asyncFinish();
        });
        $httpBackend.flush();
    });
});
