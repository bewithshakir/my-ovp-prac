/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.services.stbService', function () {
    'use strict';

    var stbService, $scope, $q, dateUtil, $httpBackend, $http, stbJson, profileService, $rootScope;

    beforeEach(module('rx'));
    beforeEach(module('ovpApp.services.stbService'));
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));


    /* jscs:disable */
    beforeEach(inject(function (_realStbService_, _$rootScope_, _$q_, _$injector_, _$http_,
                                _dateUtil_, _profileService_, _customerInfoService_) {
        stbService = _realStbService_;
        dateUtil = _dateUtil_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $httpBackend = _$injector_.get('$httpBackend');
        $http = _$http_;
        profileService = _profileService_;
        $rootScope = _$rootScope_;

        spyOn(_customerInfoService_, 'getName').and.callFake(function () {
            return $q.resolve('mock');
        });

        spyOn(profileService, 'canUseGuide').and.callFake(function() {
            return $q.resolve(true);
        });
    }));
    /* jscs:enable */

    afterEach(function () {
        $scope.$destroy();
        localStorage.clear();
    });

    it('should instantiate the service', function () {
        expect(stbService).toBeDefined();
    });

    it('should resolve promise when the headend is set', function () {
        $httpBackend.expectGET('/nrs/api/stbs')
                .respond(stbJson);
        var headendDefer = stbService.getHeadend();

        headendDefer.then(function (data) {
            expect(data).toEqual({'id': 'my_headend'});
        });

        headendDefer.catch(function (data) {
            expect(data).toEqual({'id': 'my_headend'});
        });

        stbService.setHeadend({'id': 'my_headend'});

        $httpBackend.flush();
    });

    it('should resolve promise when the request times out', function () {
        // Stub handleHttpError so an error is not thrown
        spyOn(stbService, '_handleHttpError').and.callFake( () => {});

        $httpBackend.expectGET('/nrs/api/stbs')
                .respond(() => {return [0, {}];});
        var stbPromise = stbService.getCurrentStbPromise().then(function (stb) {
            expect(stb).toEqual(undefined);
        });
        $httpBackend.flush();
    });

    it('should return formatted date relative to set-top-box', function () {

        var boxDate = new Date(),
            localDate = dateUtil.addHours(boxDate, stbService.getOffsetFromGMT()),
            mockFormat = 'yyyymmddjjnn';

        // Convert the box date to GMT prior to passing in
        boxDate = dateUtil.addMinutes(boxDate, -1 * localDate.getTimezoneOffset());

        expect(stbService.formatUnix(boxDate.getTime() / 1000, mockFormat))
            .toEqual(dateUtil.formatDate(localDate, mockFormat));
    });

    describe('fetch STBs', function () {
        it('should default to first DVR device', function () {
            $httpBackend.expectGET('/nrs/api/stbs')
                .respond(stbJson);

            $scope.$on('set-top-box-selected', function (evt, stb) {
                expect(stb.name).toEqual('mock');
            });

            stbService.getSTBs().then(function (result) {
                expect(result).toBeDefined();
                expect(result[0].macAddress).toBe('00:21:BE:A9:41:DD');
            });

            $httpBackend.flush();
        });
    });

    describe('current device', function () {
        it('should be remembered', function () {
            $httpBackend.expectGET('/nrs/api/stbs')
                .respond(stbJson);

            stbService.getSTBs().then(function (stbs) {
                var stbToSelect = stbs[2];

                stbService.getCurrentStb().then(stb => {

                    expect(stb.name).toEqual('mock');

                    stbService.setCurrentStb(stbToSelect).then(() => {
                        stbService.getCurrentStb().then(stb => {
                            expect(stb.name).toEqual('mock2');
                        });
                    });
                });
            });

            $httpBackend.flush();
        });
    });
    /* jscs:disable requireSpaceBeforeObjectValues, validateIndentation */
    stbJson =
        {'offsetFromGMT':-4, 'headend':'76_52_229_148_168', 'masDivision':'CLT',
         'lineupId':168, 'canonicalTimeZone':'US/Eastern', 'setTopBoxes':[
           {
              'macAddress':'00:21:BE:A9:41:DD',
              'macAddressNormalized':'0021BEA941DD',
              'dvr':false,
              'flickable':false,
              'guideDaysAvailable':7
           },
           {
              'macAddress':'00:19:47:D1:45:36',
              'macAddressNormalized':'001947D14536',
              'dvr':true,
              'flickable':false,
              'rdvrVersion':1,
              'guideDaysAvailable':7,
              'name':'mock'
           },
           {
              'macAddress':'00:21:BE:DF:3B:88',
              'macAddressNormalized':'0021BEDF3B88',
              'dvr':true,
              'flickable':false,
              'rdvrVersion':2,
              'guideDaysAvailable':7,
              'name': 'mock2'
           },
           {
              'macAddress':'00:1B:D7:59:98:F5',
              'macAddressNormalized':'001BD75998F5',
              'dvr':true,
              'flickable':false,
              'rdvrVersion':2,
              'guideDaysAvailable':7
           },
           {
              'macAddress':'00:21:BE:5C:78:76',
              'macAddressNormalized':'0021BE5C7876',
              'dvr':true,
              'flickable':false,
              'rdvrVersion':2,
              'guideDaysAvailable':7
           }
        ], 'guideDaysAvailable':7};
    /* jscs:enable requireSpaceBeforeObjectValues, validateIndentation*/
});
