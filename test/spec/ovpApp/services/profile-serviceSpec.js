/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.services.profileService', function () {
    'use strict';
    var capabilitiesService, $scope, $q, $httpBackend, $window, CAPABILITIES_STATE_MAP,
        PROTECTED_STATE, CAPABILITIES, $state, AccessibilityService, config, ovpStorage,
        profileService, OauthDataManager;
    
    beforeEach(module('ovpApp.services.profileService'));

    beforeEach(inject(function (
        _$rootScope_,
        _$q_,
        _$injector_, _$window_, _CAPABILITIES_STATE_MAP_, _PROTECTED_STATE_,
        _CAPABILITIES_,
        _$httpBackend_,
        _capabilitiesService_,
        _AccessibilityService_,
        _ovpStorage_,
        _config_,
        _profileService_,
        _OauthDataManager_
    ) {
            
        profileService = _profileService_;
        capabilitiesService = _capabilitiesService_;
        ovpStorage = _ovpStorage_;

        config = _config_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $window = _$window_;
        CAPABILITIES_STATE_MAP = _CAPABILITIES_STATE_MAP_;
        PROTECTED_STATE = _PROTECTED_STATE_;
        CAPABILITIES = _CAPABILITIES_;
        AccessibilityService = _AccessibilityService_;
        OauthDataManager = _OauthDataManager_;
        AccessibilityService.isEnabled = () => $q.resolve(false);
        ovpStorage.initUserStorage = () => $q.resolve();

        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
    }));

    it('should not be the mock profileService object', function(){
        expect(profileService).toBeDefined();
        expect(profileService.isMockService).toBeUndefined();
    });

    it('should return false if TVOD is capability is false', function () {
        var isTVODEnabled = null;
        
        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        profileService.postAuth();
        $httpBackend.flush();

        profileService.isTVODEnabled().then(function (isEnabled) {
            isTVODEnabled = isEnabled;
        });

        $scope.$apply();
        expect(isTVODEnabled).toEqual(false);

    });

    it('should return guide as next available state when ' +
        'not authorized for livetv', function () {

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        profileService.postAuth();
        $httpBackend.flush();

        profileService.hasCapability(CAPABILITIES.LIVE).then(function (result) {
            expect(result).toEqual(false);
            if (!result) {
                profileService.getFirstAvailableState().then(function (result) {
                    expect(result).toEqual(PROTECTED_STATE.GUIDE);
                });
            }
        });
        $scope.$apply();
    });

    it('should return guide as next available state when ' +
        'not authorized for ondemand', function () {

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        profileService.postAuth();
        $httpBackend.flush();

        profileService.hasCapability(CAPABILITIES.ONDEMAND).then(function (result) {
            expect(result).toEqual(false);
            if (!result) {
                profileService.getFirstAvailableState().then(function (result) {
                    expect(result).toEqual(PROTECTED_STATE.GUIDE);
                });
            }
        });

        $scope.$apply();
    });

    it('should check if accessibility is enabled', function() {
        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, getJSONFixture('capabilities/capabilities.json'));
        profileService.postAuth();
        $httpBackend.flush();

        var spyEn = spyOn(AccessibilityService, 'isEnabled').and.callFake(function() {
            return $q.resolve(true);
        });

        profileService.isAccessibilityEnabled().then((access) =>{
            expect(access).toBe(true);
        });

        $scope.$apply();
        expect(spyEn).toHaveBeenCalled();
    });

    it('should check if cdvr is enabled', function() {
        let data = getJSONFixture('capabilities/capabilities.json')
        data.cdvr.authorized = true;
        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, data);
        profileService.postAuth();
        $httpBackend.flush();

        var spyEn = spyOn(AccessibilityService, 'isEnabled').and.callFake(function() {
            return $q.resolve(true);
        });

        profileService.isCdvrEnabled().then((access) =>{
            expect(access).toBe(true);
        });

        $scope.$apply();
        expect(spyEn).toHaveBeenCalled();
    });

    it('should make a ham sandwich and turn off rdvr if cdvr is enabled', function() {
        let data = getJSONFixture('capabilities/capabilities.json')
        data.cdvr.authorized = true;
        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, data);
        profileService.postAuth();
        $httpBackend.flush();

        var spyEn = spyOn(AccessibilityService, 'isEnabled').and.callFake(function() {
            return $q.resolve(true);
        });

        profileService.isRdvrEnabled().then((access) =>{
            expect(access).toBe(false);
        });

        $scope.$apply();
        expect(spyEn).toHaveBeenCalled();
    });

    it('should enable rdvr if accessibility and cdvr are disabled', function() {
        // Enable specU
        config.specU.enabled = true;

        let data = getJSONFixture('capabilities/capabilities.json');
        data.cdvr.authorized = false;
        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, data);
        profileService.postAuth();
        $httpBackend.flush();

        var accountSpy = spyOn(OauthDataManager, 'get').and.callFake(function() {
            return {
                accountType: 'not SPECU'
            };
        });

        var spyEn = spyOn(AccessibilityService, 'isEnabled').and.callFake(function() {
            return $q.resolve(false);
        });

        profileService.isRdvrEnabled().then((access) =>{
            expect(access).toBe(true);
        });

        $scope.$apply();
        expect(spyEn).toHaveBeenCalled();
        expect(accountSpy).toHaveBeenCalled();
    });

    it('should enable TVOD if it should be enabled', function() {
        let data = getJSONFixture('capabilities/capabilities.json');
        data.tvod.authorized = true;
        config.tvodRent = true;

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, data);
        profileService.postAuth();
        $httpBackend.flush();

        profileService.isTVODEnabled().then((tvod) =>{
            expect(tvod).toBe(true);
        });

        $scope.$apply();
    });

    it('should correctly determine twctv usage', function() {
        let dat = getJSONFixture('capabilities/capabilities.json');
        dat.dvroperations.authorized = false;
        dat.watchondemand.authorized = false;
        dat.viewguide.authorized = false;
        dat.watchlive.authorized = false;

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, dat);
        profileService.postAuth();
        $httpBackend.flush();

        profileService.canUseTwctv().then((twctv) =>{
            expect(twctv).toBe(false);
        });

        $scope.$apply();

        let datas = getJSONFixture('capabilities/capabilities.json');
        datas.dvroperations.authorized = false;
        datas.watchlive.authorized = false;

        $httpBackend.expectGET('/ipvs/api/smarttv/user/capabilities/v2?bstCapable=true')
            .respond(200, datas);

        profileService.refreshProfile();
        $httpBackend.flush();

         profileService.canUseTwctv().then((twctv) =>{
            expect(twctv).toBe(true);
        });

        $scope.$apply();
});

    it('should determine SpecU from account type (true)', function () {
        // Enable specU
        config.specU.enabled = true;

        spyOn(OauthDataManager, 'get').and.callFake(function() {
            return {
                accountType: 'SPECU'
            };
        });

        expect(profileService.isSpecU()).toEqual(true);
    });

    it('should determine SpecU from account type (false)', function () {
        // Enable specU
        config.specU.enabled = true;

        spyOn(OauthDataManager, 'get').and.callFake(function() {
            return {
                accountType: 'Not SPECU'
            };
        });

        expect(profileService.isSpecU()).toEqual(false);
    });

});