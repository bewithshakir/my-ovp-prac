/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.services.entitlementsService', function () {
    'use strict';

    let EntitlementsService, $q, $rootScope, $httpBackend;

    beforeEach(module('ovpApp.services.entitlementsService'));
    beforeEach(module('rx'));
    //
    // beforeEach(function () {
    //     let mockEpgsService = {
    //         getChannels: function () {
    //             return $q.resolve([{
    //                 streamTmsGuideId: 1,
    //                 twcTvEntitled: false
    //             }, {
    //                 streamTmsGuideId: 2,
    //                 twcTvEntitled: false
    //             }, {
    //                 streamTmsGuideId: 11,
    //                 twcTvEntitled: true
    //             }, {
    //                 streamTmsGuideId: 12,
    //                 twcTvEntitled: true
    //             }]);
    //         }
    //     };
    //
    //     module(function ($provide) {
    //         $provide.value('epgsService', mockEpgsService);
    //     });
    // });

    /* jscs:disable */
    beforeEach(inject(function (_$httpBackend_, _EntitlementsService_, _$q_, _$timeout_, _$injector_, _$rootScope_, _stbService_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels?includeUnentitled=true')
            .respond(200,
                [{
                    ncsNetworkId: '466',
                    name: 'ABC',
                    services: [
                        {
                            callSign: 'A',
                            networkName: 'A',
                            productProviders: [
                              'A'
                            ],
                            entitled: false,
                            blocked: false,
                            tmsGuideId: 1
                        },
                        {
                            callSign: 'B',
                            networkName: 'B',
                            productProviders: [
                              'B'
                            ],
                            entitled: false,
                            blocked: false,
                            tmsGuideId: 2
                        },
                        {
                            callSign: 'C',
                            networkName: 'C',
                            productProviders: [
                              'C'
                            ],
                            entitled: false,
                            blocked: false
                        }
                    ]
                },
                {
                    ncsNetworkId: '467',
                    name: 'LMN',
                    services: [
                        {
                            callSign: 'L',
                            networkName: 'L',
                            productProviders: [
                              'L'
                            ],
                            entitled: true,
                            blocked: false,
                            tmsGuideId: 12
                        },
                        {
                            callSign: 'M',
                            networkName: 'M',
                            productProviders: [
                              'M'
                            ],
                            entitled: true,
                            blocked: false
                        },
                        {
                            callSign: 'N',
                            networkName: 'N',
                            productProviders: [
                              'N'
                            ],
                            entitled: true,
                            blocked: false
                        }
                    ]
                },
                {  // Mixed live and VOD services
                    ncsNetworkId: '500',
                    name: 'OPQ',
                    services: [
                        {
                            callSign: 'O',
                            networkName: 'O',
                            productProviders: [
                                'O'
                            ],
                            blocked: false,
                            entitled: true,
                            live: true
                        },
                        {
                            callSign: 'P',
                            networkName: 'P',
                            productProviders: [
                                'P'
                            ],
                            entitled: true,
                            blocked: false,
                            live: false
                        },
                        {
                            callSign: 'Q',
                            networkName: 'Q',
                            productProviders: [
                                'Q'
                            ],
                            entitled: false,
                            blocked: false,
                            live: false
                        }
                    ]
                },
                { // All Live channels, no VOD
                    ncsNetworkId: '501',
                    name: 'RST',
                    services: [
                        {
                            callSign: 'R',
                            networkName: 'R',
                            productProviders: [
                                'R'
                            ],
                            blocked: false,
                            entitled: true,
                            live: true
                        },
                        {
                            callSign: 'S',
                            networkName: 'S',
                            productProviders: [
                                'S'
                            ],
                            entitled: false,
                            blocked: false,
                            live: true
                        },
                        {
                            callSign: 'T',
                            networkName: 'T',
                            productProviders: [
                                'T'
                            ],
                            entitled: false,
                            blocked: false,
                            live: true
                        }
                    ]
                },
                {
                    ncsNetworkId: '468',
                    name: 'XYZ',
                    services: [
                        {
                            callSign: 'X',
                            networkName: 'X',
                            productProviders: [
                              'X'
                            ],
                            entitled: true,
                            blocked: true,
                            tmsGuideId: 11
                        },
                        {
                            callSign: 'Y',
                            networkName: 'Y',
                            productProviders: [
                              'Y'
                            ],
                            entitled: true,
                            blocked: true
                        },
                        {
                            callSign: 'Z',
                            networkName: 'Z',
                            productProviders: [
                              'Z'
                            ],
                            entitled: true,
                            blocked: true
                        }
                    ]
                }]
            );

        EntitlementsService = _EntitlementsService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));
    /* jscs:enable */

    it('should instantiate the service', function () {
        expect(EntitlementsService).toBeDefined();
    });

    describe('isVodNetworkEntitled', function () {
        describe('vpps', function () {
            it('should return true if VOD vpp is entitled & channel is VOD only (!live)', function (done) {
                EntitlementsService.isVodNetworkEntitled(['o', 'p'])
                    .then(result => {
                        expect(result).toEqual(true);
                        done();
                    });

                $rootScope.$apply();
                $httpBackend.flush();
            });
        });

        describe('vpps', function () {
            it('should return false if VOD vpp is not entitled & channel is VOD only (!live)', function (done) {
                EntitlementsService.isVodNetworkEntitled(['q'])
                    .then(result => {
                        expect(result).toEqual(false);
                        done();
                    });

                $rootScope.$apply();
                $httpBackend.flush();
            });
        });

        describe('vpps', function () {
            it('should return false if VOD vpp is only live', function () {
                EntitlementsService.isVodNetworkEntitled(['r', 's', 't'])
                    .then(result => {
                        expect(result).toEqual(false);
                    });

                $rootScope.$apply();
                $httpBackend.flush();
            });
        });
    });

});
