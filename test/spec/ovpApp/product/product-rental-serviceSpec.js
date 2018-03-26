/*global window,spyOn*/
describe('ovpApp.product.rental-service', function () {
    'use strict';
    var $httpBackend,
        $rootScope,
        ProductRentalService,
        mockParentalControlsService,
        mockPuchasePinService,
        mockDrmSessionService,
        mockAsset,
        mockMoment;

    beforeEach(module('ovpApp.product.rental-service'));

    beforeEach(module('ovpApp.services.splunk', function($provide) {
        $provide.value('SplunkService', {});
    }));

    beforeEach(function () {


        mockAsset = {
            streamList: [
                {
                    type: 'ONLINE_ONDEMAND',
                    streamProperties: {
                        attributes: ['HIGH_DEF', 'newValue'],
                        rating: 'R',
                        runtimeInSeconds: 3600,
                        price: 0.00,
                        edition: 'gold',
                        ipvsRentUrl: '/rent/xxx',
                        providerAssetID: '1',
                        tmsProviderProgramID: '111'
                    }
                },
                {
                    type: 'ONLINE_ONDEMAND',
                    streamProperties: {
                        attributes: ['HIGH_DEF', 'newValue'],
                        rating: 'R',
                        runtimeInSeconds: 3600,
                        price: 2.99,
                        edition: 'gold',
                        ipvsRentUrl: '/rent/xxx',
                        providerAssetID: '1',
                        tmsProviderProgramID: '222'
                    }
                },
                {
                    type: 'ONLINE_ONDEMAND',
                    streamProperties: {
                        attributes: ['THREE_D', 'newValue'],
                        rating: 'R',
                        runtimeInSeconds: 3600,
                        price: 5.00,
                        edition: 'unedited',
                        ipvsRentUrl: '/rent/xxx',
                        providerAssetID: 2,
                        tmsProviderProgramID: '333'
                    }
                }
            ],
            programMetadata: {
               '111': {title: '111'},
               '222': {title: '222'},
               '333': {title: '333'}
            },
            title: 'none',
            year: 1996
        };

        module(function ($provide) {
            $provide.service('purchasePinService', function () {});
            $provide.service('parentalControlsService', function () {});
            $provide.service('drmSessionService', function () {});
            $provide.service('$state', function () {});
            $provide.service('$', function () {});
            $provide.value('errorCodesService', mockErrorCodesService);
        });
    });

    beforeEach(inject(function (
        _$httpBackend_,
        purchasePinService,
        parentalControlsService,
        drmSessionService,
        _ProductRentalService_,
        $q,
        $state,
        _$rootScope_, moment) {

        $rootScope  = _$rootScope_;
        $httpBackend = _$httpBackend_;
        mockParentalControlsService = parentalControlsService;
        mockPuchasePinService = purchasePinService;
        mockDrmSessionService = drmSessionService;
        ProductRentalService = _ProductRentalService_;
        mockMoment = moment;

        $httpBackend.whenGET('/api/smarttv/info/v1/ipvideotrial')
                    .respond(200, {});

        mockMoment.duration = jasmine
            .createSpy('duration')
            .and
            .returnValue({hours: function () {return 10;}, minutes: function () {return 0;}});
        mockPuchasePinService.isPINSet = jasmine.createSpy('isPINSet').and.returnValue($q.resolve(true));
        mockPuchasePinService.isPurchasePINDisabledForClient = jasmine.createSpy('isPurchasePINDisabledForClient')
            .and.returnValue($q.resolve(true));
        mockPuchasePinService.getLocalPin = jasmine.createSpy('purchasePinService.getLocalPin').and
            .returnValue($q.resolve('fakepin'));
        mockParentalControlsService.isParentalControlsDisabledForClient = jasmine
            .createSpy('mockParentalControlsService.isParentalControlsDisabledForClient')
            .and
            .returnValue($q.resolve(true));
        mockParentalControlsService.getLocalPin = jasmine
            .createSpy('mockParentalControlsService.getLocalPin')
            .and
            .returnValue($q.resolve('fakepin'));

        drmSessionService.getDRMSession = jasmine
            .createSpy()
            .and
            .returnValue($q.resolve({session: 'mockSession'}));
        $state.go = jasmine.createSpy('go');

    }));

    it('should create an options list for all the possible streams, except free streams', function () {
        var result = ProductRentalService.getRentalOptions(mockAsset);

        expect(result.length).toBe(2);
        expect(result[0].type).toBe('hd');
        expect(result[1].type).toBe('3d');
    });

    it('should send the proper request to the service when', function () {
        var rentalOptions = ProductRentalService.getRentalOptions(mockAsset);
        $httpBackend
            .expectPOST('/rent/xxx?drm-supported=true&encoding=hls&parentalControlPIN=fakepin&purchasePIN=fakepin')
            .respond('200', '');
        ProductRentalService.confirmRental(mockAsset, rentalOptions[0]);
        $rootScope.$apply();
        expect(mockPuchasePinService.getLocalPin).toHaveBeenCalled();
        expect(mockDrmSessionService.getDRMSession).toHaveBeenCalled();
        expect(mockParentalControlsService.getLocalPin).toHaveBeenCalled();
    });

    it('should get valid asset title', function () {
        var rentalOptions = ProductRentalService.getRentalOptions(mockAsset);
        rentalOptions.forEach((opt) => {
            expect(opt.title).toBe(opt.tmsProviderProgramID);
        });
    });

    it('should determine the correct error', function () {
        var rentalOptions = ProductRentalService.getRentalOptions(mockAsset);
        rentalOptions.forEach((opt) => {
            expect(opt.title).toBe(opt.tmsProviderProgramID);
        });
    });

    it('should generate the correct error message for 400.x errors', function () {


        let response = {
            data: {
                context: {
                    detailedResponseCode: '400.9',
                    detailedResponseDescription: 'Some technical description'
                }
            }
        };

        let error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response = {
            data: {
                context: {
                    detailedResponseCode: '400',
                    detailedResponseDescription: 'Some technical description'
                }
            }
        };

        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '401';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '403';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '404';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WRN-1404');

        response.data.context.detailedResponseCode = '405';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '406';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '415';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '422';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '422.15';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '422.100';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '451';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WRN-1451');

        response.data.context.detailedResponseCode = '452';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WRN-1451');

        response.data.context.detailedResponseCode = '500';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '500.9';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '502';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');

        response.data.context.detailedResponseCode = '503';
        error = ProductRentalService.normalizeRentalError(response);
        expect(error.code).toBe('WTX-9000');
    });

});
