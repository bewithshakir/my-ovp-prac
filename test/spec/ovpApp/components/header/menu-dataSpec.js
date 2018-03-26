/*jshint undef: false */
/*jshint nomen: true */
describe('ovpApp.components.header.data', function () {
    'use strict';

    var service, $httpBackend, $scope, $rootScope, $q;


    beforeEach(module('rx'));
    beforeEach(module('ui.router'));
    beforeEach(module('ovpApp.components.header.data'));


    beforeEach(module(function($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(inject(function (_menuData_, _$httpBackend_, _$state_, _$rootScope_, _$q_) {
        service = _menuData_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
    }));

    describe('authorizeTab', function () {
        it('should mark as enabled if no requirements', function (done) {

            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            let model = {
                requires: undefined
            };

            service._private.authorizeTab(model)
                .then(function () {
                    expect(model.enabled).toEqual(true);
                    done();
                });

            $rootScope.$apply();
        });

        it('should mark as disabled if capability is lacking', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            let model = {
                requires: 'dvroperations'
            };

            service._private.authorizeTab(model)
                .then(function () {
                    expect(model.enabled).toEqual(false);
                    done();
                });

            $rootScope.$apply();
        });

        it('should mark as enabled if capability is present', function (done) {
            $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
                .respond(200, { market: 'CLT', lineupId: '168' });

            let model = {
                requires: 'someothercapability'
            };

            spyOn(mockProfileService, 'hasCapability').and.returnValue($q.resolve(true));

            service._private.authorizeTab(model)
                .then(function () {
                    expect(model.enabled).toEqual(true);
                    done();
                });

            $rootScope.$apply();
        });
    });


    /*
     * Creates a mock capabilities service
     *
     * @param {Object} capabilities A map of capabilities, example { watchlive: true }
     */
    function MockCapabilitiesService(capabilities = {}) {
        this.capabilities = capabilities;
    }

    MockCapabilitiesService.prototype.hasCapability = function (capabilityName) {
        let result;
        if (!this.capabilities[capabilityName]) {
            result = true;
        } else {
            result = this.capabilities[capabilityName].authorized;
        }

        return {
            then: angular.bind(this, function (cb1) {
                cb1(result);
                return {then: angular.bind(this, (cb2) => cb2())};
            })
        };
    };

    MockCapabilitiesService.prototype.isTVODWatchEnabled = function () {
        return {
            then: angular.bind(this, function (cb) {
                cb(true);
            })
        };
    };

    MockCapabilitiesService.prototype.isTVODRentEnabled = function () {
        return {
            then: angular.bind(this, function (cb) {
                cb(true);
            })
        };
    };

    MockCapabilitiesService.prototype.isTVODEnabled = function () {
        return {
            then: angular.bind(this, function (cb) {
                cb(true);
            })
        };
    };

    MockCapabilitiesService.prototype.isCdvrEnabled = function () {
        return {
            then: angular.bind(this, function (cb) {
                cb(false);
            })
        };
    };

    MockCapabilitiesService.prototype.getCode = function (capabilityName) {
        return {
            then: angular.bind(this, function (cb) {
                cb(this.capabilities[capabilityName].code);
            })
        };
    };
    MockCapabilitiesService.prototype.isAccessibilityEnabled = function () {
      return {
           then: angular.bind(this, function (cb) {
               cb(true);
           })
      };
    };
});
