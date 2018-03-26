describe('ovpApp.product.rental-controller', function () {
    'use strict';

    var $httpBackend,
        $rootScope,
        $componentController,
        mockProductRentalService,
        mockCapabiltiesService,
        mockParentalControlsService,
        mockPuchasePinService,
        mockDrmSessionService,
        mockAsset,
        mockMoment,
        mockUibModalStack;

    beforeEach(function () {

        //Create a mock asset - this is a shell for a event delegate
        mockAsset = {
            streamList: [
                {
                    streamProperties: {
                        attributes: ['HIGH_DEF', 'newValue'],
                        rating: 'R',
                        runtimeInSeconds: 3600,
                        price: 0.00,
                        edition: 'gold',
                        ipvsRentUrl: '/rent/xxx',
                        providerAssetID: '1'
                    }
                },
                {
                    streamProperties: {
                        attributes: ['THREE_D', 'newValue'],
                        rating: 'R',
                        runtimeInSeconds: 3600,
                        price: 5.00,
                        edition: 'unedited',
                        ipvsRentUrl: '/rent/xxx',
                        providerAssetID: 2
                    }
                }
            ],
            title: 'none',
            year: 1996
        };



        //Stub mocked modules - will need to add the functions in the injector
        //since they might have dependencies (on $q mostly);
        module(function ($provide, $controllerProvider) {
            $provide.service('purchasePinService', function () {});
            $provide.service('parentalControlsService', function () {});
            $provide.service('drmSessionService', function () {});
            $provide.service('ProductRentalService', function () {});
            $provide.service('$state', function () {});
            $provide.service('$', function () {});

            $controllerProvider.register('PurchasePinDialogController', function ($scope) {
                $scope.popup = null;
            });
        });


        module('ovpApp.product.rental');
    });

    beforeEach(inject(function (
        _$httpBackend_,
        purchasePinService,
        parentalControlsService,
        drmSessionService,
        ProductRentalService,
        capabilitiesService,
        $q,
        $state,
        _$rootScope_,
        _$componentController_, moment, $uibModalStack) {

        $componentController = _$componentController_;
        $rootScope  = _$rootScope_;
        $httpBackend = _$httpBackend_;
        mockParentalControlsService = parentalControlsService;
        mockPuchasePinService = purchasePinService;
        mockDrmSessionService = drmSessionService;
        mockProductRentalService = ProductRentalService;
        mockCapabiltiesService = capabilitiesService;
        mockMoment = moment;
        mockUibModalStack = $uibModalStack;

        mockMoment.duration = jasmine
            .createSpy('duration')
            .and
            .returnValue({hours: function () {return 10;}, minutes: function () {return 0;}});
        mockProductRentalService.confirmRental = jasmine
            .createSpy('confirmRental')
            .and
            .returnValue($q.resolve({data: 'nothing'}));
        mockProductRentalService.getRentalOptions = jasmine
            .createSpy('getRentalOptions')
            .and
            .returnValue([
                {
                    title: null,
                    type: 'hd',
                    rating: 'R',
                    year: 1996,
                    length: 10,
                    price: 4.99,
                    streamIndex: 0,
                    edition: null
                }
            ]);
        spyOn(mockCapabiltiesService, 'hasCapability').and.callFake(function(capability) {
            if (capability === 'accessibility') {
                return $q.resolve(false);
            }

            return $q.resolve(true);
        });
        spyOn(mockUibModalStack, 'getTop').and.callFake(function() {
            return {
               value: {
                  modalDomEl: {
                     addClass: function () {},
                     removeClass: function () {}
                  }
               }
            };
        });

        mockAsset.isBlocked = $q.resolve(false);

    }));

    it('should activate the controller with an asset and an action set on the scope', function () {
        var $testScope = $rootScope.$new();
        $testScope.event = mockAsset;
        $testScope.action = 'something';

        let ProductRentalController = $componentController('productRental', {
            $scope: $testScope
        });

        ProductRentalController.resolve = {
            options: {
                asset: mockAsset,
                action: 'something'
            }
        };
        ProductRentalController.$onInit();

        expect(mockProductRentalService.getRentalOptions).toHaveBeenCalled();

    });

    it('should attempt to rent when the confirm step happens', function () {
        var $testScope = $rootScope.$new();
        $testScope.event = mockAsset;
        $testScope.action = 'something';

        let ProductRentalController = $componentController('productRental', {
            $scope: $testScope
        });
        //Gets the mock 'rental option'
        ProductRentalController.selectedOption =  mockProductRentalService.getRentalOptions();
        ProductRentalController.confirm();
        expect(mockProductRentalService.confirmRental).toHaveBeenCalled();
    });
});
