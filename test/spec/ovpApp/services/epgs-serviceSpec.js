/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.services.epgsService', function () {
    'use strict';

    var epgsService, $httpBackend, $q, $timeout, $rootScope, stbService, headendId;

    beforeEach(module('ovpApp.services.epgsService'));
    
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    /* jscs:disable */
    beforeEach(inject(function (_epgsService_, _$q_, _$timeout_, _$injector_, _$rootScope_, _stbService_,
                                _realEpgsService_) {
        epgsService = _realEpgsService_;
        $q = _$q_;
        $timeout = _$timeout_;
        $httpBackend = _$injector_.get('$httpBackend');
        $rootScope = _$rootScope_;
        stbService = _stbService_;
        headendId = '10_254_18_9_4092';
        spyOn(stbService, 'getHeadend').and.returnValue({then: (callback) => {
            return callback({id: headendId});
        }});


    }));
    /* jscs:enable */

    it('should instantiate the service', function () {
        expect(epgsService).toBeDefined();
    });

    it('should successfully retrieve channels from the service and resolve the promise', function () {
        stbService.setHeadend({'id': headendId});

        var testUrl = new RegExp('.*\?headend=' + headendId);
        $rootScope.$apply();
        epgsService.getChannels();

        $httpBackend.expectGET(testUrl)
            .respond('');

        $httpBackend.flush();
        $rootScope.$apply();
    });

    it('should return results as an array', function () {
        stbService.setHeadend({'id': headendId});

        var result;

        epgsService.getChannels().then(function (data) {
            result = data;
            expect(result instanceof Array).toEqual(true);
        });

        var testUrl = new RegExp('.*\?headend=' + headendId);

        $httpBackend.expectGET(testUrl)
            .respond({channels: [{channelNumber: 0, mystroServiceId: 0}, {channelNumber: 1, mystroServiceId: 1}]});

        $httpBackend.flush();
        $rootScope.$apply();
    });

    it('should return cached channel list on second invocation of getChannels', function () {
        stbService.setHeadend({'id': headendId});
        var testUrl = new RegExp('.*\?headend=' + headendId);

        $httpBackend.expectGET(testUrl)
            .respond('');

        epgsService.getChannels().then(function () {
            epgsService.getChannels();
        });

        $httpBackend.flush();
    });

    it('clear channels should force get channels to make another http request', function () {
        stbService.setHeadend({'id': headendId});

        var testUrl = new RegExp('.*\?headend=' + headendId);

        $httpBackend.expectGET(testUrl)
            .respond('');

        epgsService.getChannels().then(function () {
            epgsService.clearChannels();

            $httpBackend.expectGET(testUrl)
                .respond('');

            epgsService.getChannels();
        });

        $httpBackend.flush();

    });
});
