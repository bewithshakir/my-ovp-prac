/* globals inject */
/* jshint jasmine: true */

 describe('ovpApp.services.capabilitiesService', function () {
    'use strict';

    var capabilitiesService, $scope, $q, $httpBackend, $window, CAPABILITIES_STATE_MAP,
        PROTECTED_STATE, CAPABILITIES, $state, AccessibilityService, config, ovpStorage,
        $timeout,
        mockResponse = {
            'dvroperations': {
                'authorized': true,
                'msg': 'success',
                'code': 0
            },
            'viewguide': {
                'authorized': true,
                'msg': 'success',
                'code': 0
            },
            'watchondemand': {
                'authorized': false,
                'msg': 'failure',
                'code': 0
            },
            'tunetochannel': {
                'authorized': true,
                'msg': 'success',
                'code': 0
            },
            'watchlive': {
                'authorized': false,
                'msg': 'success',
                'code': 102
            },
            'accessibility': {
                'authorized': true,
                'msg': 'accessibility.notEnabled',
                'hide': false,
                'code': 118
            },
            'tvod': {
                'authorized': false,
                'msg': 'success',
                'hide': false,
                'code': 0
            }
        };

    beforeEach(module('ovpApp.services.capabilitiesService'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function (
        _$rootScope_,
        _$q_,
        _$injector_, _$window_, _CAPABILITIES_STATE_MAP_, _PROTECTED_STATE_,
        _$timeout_,
        _CAPABILITIES_,
        _$httpBackend_,
        _capabilitiesService_,
        _$state_,
        _AccessibilityService_,
        _ovpStorage_,
        _config_) {
        capabilitiesService = _capabilitiesService_;
        ovpStorage = _ovpStorage_;

        $timeout = _$timeout_;
        config = _config_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $window = _$window_;
        CAPABILITIES_STATE_MAP = _CAPABILITIES_STATE_MAP_;
        PROTECTED_STATE = _PROTECTED_STATE_;
        CAPABILITIES = _CAPABILITIES_;
        $state = _$state_;
        AccessibilityService = _AccessibilityService_;
        AccessibilityService.isEnabled = () => $q.resolve(false);
        ovpStorage.initUserStorage = () => $q.resolve();
        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
    }));

    describe('state correspondance', function () {
        it('livetv', function () {
            var state = $state.get('PROTECTED_STATE.LIVE');
            expect(state).toBeDefined(PROTECTED_STATE.LIVE + ' doesn\'t correspond to a state');
        });

        it('guide', function () {
            var state = $state.get(PROTECTED_STATE.GUIDE);
            expect(state).toBeDefined(PROTECTED_STATE.GUIDE + ' doesn\'t correspond to a state');
        });

        it('on demand', function () {
            var state = $state.get(PROTECTED_STATE.ONDEMAND);
            expect(state).toBeDefined(PROTECTED_STATE.ONDEMAND + ' doesn\'t correspond to a state');
        });

        it('rdvr', function () {
            var state = $state.get(PROTECTED_STATE.RDVR);
            expect(state).toBeDefined(PROTECTED_STATE.RDVR + ' doesn\'t correspond to a state');
        });
    });

    it('should instantiate the service', function () {
        expect(capabilitiesService).toBeDefined();
    });

    it('should return if guide is enabled', function (done) {
        var isGuideEnabled = false;
        capabilitiesService.refreshCapabilities();

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        $httpBackend.flush();



        capabilitiesService.hasCapability(CAPABILITIES.GUIDE).then(function (isEnabled) {
            isGuideEnabled = isEnabled;
            expect(isGuideEnabled).toEqual(true);
            done();
        });

        $scope.$apply();
    });

    it('should return if accessibility is enabled', function () {
        var isAccessibilityEnabled = false;
        capabilitiesService.refreshCapabilities();

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        



        capabilitiesService.hasCapability(CAPABILITIES.ACCESSIBILITY).then(function (isEnabled) {
            isAccessibilityEnabled = isEnabled;
        });

        $httpBackend.flush();

        expect(isAccessibilityEnabled).toEqual(true);

    });

    it('should return guide is enabled and ondemand is disabled from cache', function () {
        capabilitiesService.refreshCapabilities();

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        

        var isGuideEnabled = false,
            isOnDemandEnabled = true;

        capabilitiesService.hasCapability(CAPABILITIES.GUIDE).then(function (isEnabled) {
            isGuideEnabled = isEnabled;
        });

        $httpBackend.flush();

        expect(isGuideEnabled).toEqual(true);

        capabilitiesService.hasCapability(CAPABILITIES.ONDEMAND).then(function (isEnabled) {
            isOnDemandEnabled = isEnabled;
        });
        $scope.$apply();
        expect(isOnDemandEnabled).toEqual(false);
    });

    it('should get code from disabled livetv', function () {
        capabilitiesService.refreshCapabilities();

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));


        var errorCode = -1;

        capabilitiesService.getCode('watchlive').then(function (code) {
            errorCode = code;
        });

        $httpBackend.flush();
        expect(errorCode).toEqual(102);
    });

    it('should return false for livetv state when user not authorized for livetv', function () {
        capabilitiesService.refreshCapabilities();

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        

        capabilitiesService.hasCapability(CAPABILITIES.LIVE).then(function (result) {
            expect(result).toEqual(false);
        });
        $httpBackend.flush();
    });

    it('should make several requests if the service fails', function () {
        capabilitiesService.getCapabilities();

        // Retry only when cache is available
        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, {});

        capabilitiesService.getCapabilities().catch(function (err) {
            expect(err.status).toBe(500);
        });

        $httpBackend.flush();
        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(500, null);

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(500, null);

        $timeout.flush();
    });


});
