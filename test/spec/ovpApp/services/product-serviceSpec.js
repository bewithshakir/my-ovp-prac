/* globals inject */
/* jshint jasmine: true */


xdescribe('ovpApp.product.service', function () {
    'use strict';

    var productService, $q, $httpBackend, entryService, $rootScope, ovpStorage, storageKeys,
        mockMessages = {
            parental_controls_block_message: 'pc',
            asset_nonPriviledged_message: 'unentitled',
            asset_outOfWindow_message: 'oow',
            ooh_content_message : 'outofhome',
        }
    // seriesEntryData = {
    //     'replaceString': '{tmsproviderseriesid}',
    //     'replaceType': 'tmsSeriesID',
    //     'uri': '/nationalnavigation/V1/symphoni/series/tmsproviderseriesid' +
    //         '/{tmsproviderseriesid}?division=Online&lineup=0&profile=twctv&cacheID=100'
    // },  eventEntryData = {
    //     'replaceString': '{tmsproviderseriesid}',
    //     'replaceType': 'tmsSeriesID',
    //     'uri': '/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/' +
    //         '{tmsproviderseriesid}?division=Online&lineup=0&profile=twctv&cacheID=100'
    // };

    beforeEach(module('ovpApp.product.service'));

    beforeEach(module(function ($provide) {
        $provide.value('messages', mockMessages);
        $provide.value('rxhttp', {defaults: {transformResponse: []}});
        $provide.value('dateFormat', {
            relative: {expanded: {atTime: a => "mock" + a.getTime()}}
        });
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    /* jscs:disable */
    beforeEach(inject((_productService_, _$q_, _$injector_, _entryService_,  _$rootScope_, _ovpStorage_, _storageKeys_) => {
        productService = _productService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        entryService = _entryService_;
        ovpStorage = _ovpStorage_;
        storageKeys = _storageKeys_;
        spyOn(entryService, 'forProfile').and.callFake(function () {
            var d = $q.defer();
            d.resolve({
                series: {
                    tmsSeriesID: function () {return 'fakeseriesurl';}
                },
                event: {
                    tmsProviderProgramID: function () {return 'fakeprogramurl';}
                }
            });
            return d;
        });
        ovpStorage.setItem(storageKeys.behindOwnModem, true);
        $httpBackend = _$injector_.get('$httpBackend');
    }));
    /* jscs:enable */

    describe('availabilityMessage', function () {
        it('should display blocked by parental controls message', function () {
            spyOn(mockErrorCodesService, 'getMessageForCode').and.returnValue('TestErrorString')
            let mockAsset = {
                isBlockedByParentalControls: true,
                availableOutOfHome: true,
                isEntitled: true
            }
            let result = productService.availabilityMessage(mockAsset);
            expect(result).toEqual('TestErrorString');
        });

        it('should prioritize rental information over PC message (not yet rented)', function () {
            let mockAsset = {
                isBlockedByParentalControls: true,
                availableOutOfHome: true,
                isEntitled: true,
                tvodStream: {
                    streamProperties: {
                        rentalWindowInHours: 24
                    }
                },
                price: 2
            };
            let result = productService.availabilityMessage(mockAsset);
            expect(result).toEqual("Rent for $2. Available for 24 hours.");
        });

        it('should prioritize rental information over PC message (already rented)', function () {
            let mockAsset = {
                isBlockedByParentalControls: true,
                availableOutOfHome: true,
                isEntitled: true,
                entitledTvodStream: {
                    streamProperties: {
                        tvodEntitlement: {
                            rentalEndTimeUtcSeconds: 1234
                        }
                    }
                }
            };
            let result = productService.availabilityMessage(mockAsset);
            expect(result).toEqual("Watch rental until mock1234000");
        });

        it('should prioritize unentitled over rental information', function () {
            let mockAsset = {
                isBlockedByParentalControls: true,
                availableOutOfHome: true,
                isEntitled: false,
                entitledTvodStream: {
                    streamProperties: {
                        tvodEntitlement: {
                            rentalEndTimeUtcSeconds: 1234
                        }
                    }
                }
            };
            let result = productService.availabilityMessage(mockAsset);
            expect(result).toEqual(mockMessages.asset_nonPriviledged_message);
        });

        it('should prioritize unentitledness over out of home availability', function () {
            var behindOwnModem = ovpStorage.getItem(storageKeys.behindOwnModem);
            let mockAsset = {
                isBlockedByParentalControls: true,
                availableOutOfHome: true,
                isEntitled: false,
                behindOwnModem: behindOwnModem,
                entitledTvodStream: {
                    streamProperties: {
                        tvodEntitlement: {
                            rentalEndTimeUtcSeconds: 1234
                        }
                    }
                }
            };

            mockAsset.availableOutOfHome = false;
            mockAsset.behindOwnModem = false;
            let result = productService.availabilityMessage(mockAsset);
            expect(result).toEqual(mockMessages.asset_nonPriviledged_message);
        });

        it('should prioritize out of window over out of home when coming from watch later', function () {
            let mockAsset = {
                isBlockedByParentalControls: true,
                availableOutOfHome: true,
                isEntitled: false,
                entitledTvodStream: {
                    streamProperties: {
                        tvodEntitlement: {
                            rentalEndTimeUtcSeconds: 1234
                        }
                    }
                }
            };
            mockAsset.availableOutOfHome = false;
            mockAsset.isOutOfWindow = true;

            let result = productService.availabilityMessage(mockAsset, true);
            expect(result).toEqual(mockMessages.asset_outOfWindow_message);
        });

        it('should ignore out of window when not coming from watch later', function () {
            let mockAsset = {
                isBlockedByParentalControls: true,
                availableOutOfHome: true,
                isEntitled: false,
                entitledTvodStream: {
                    streamProperties: {
                        tvodEntitlement: {
                            rentalEndTimeUtcSeconds: 1234
                        }
                    }
                }
            };
            mockAsset.availableOutOfHome = false;
            mockAsset.isOutOfWindow = true;

            let result = productService.availabilityMessage(mockAsset, false);
            expect(result).toEqual(mockMessages.asset_nonPriviledged_message);
        });
    });

    //TODO: flesh out this test suite
    xit('should instantiate the service', function () {
        expect(productService).toBeDefined();
    });

    xit('can load series data from search result', function (done) {
        productService.withSearchResults({ resultType: 'series', tmsSeriesId: 'foo' }).fetch().then(() => {
            done();
        }).then(null, done);
        $httpBackend.expectGET('/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/foo?division=' +
            'Online&lineup=0&profile=twctv&cacheID=100').respond('');
        $httpBackend.flush();
    });

});
