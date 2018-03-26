/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.services.parentalControlsService', function () {
    'use strict';

    var parentalControlsService, $scope, $q, $httpBackend, $http, config, $timeout,
        mockGetChannelsNoBlocks =  [
            {
                'logoUrl': 'http://services.timewarnercable.com/imageserver/image/default?productId=ENTOD&providerId=AE',     //jshint ignore:line
                'name': 'A&E Network',
                'ncsNetworkId': '2',
                'linearCount': 1,
                'vodCount': 1,
                'services': [
                    {
                        'blocked': false,
                        'callsign': 'AEDM',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/31764',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 1481,
                        'networkName': 'A&E OnDemand'
                    },
                    {
                        'blocked': false,
                        'callsign': 'AETVHD',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/51529',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 6,
                        'networkName': 'A&E HD'
                    }
                ]
            },
            {
                'logoUrl': 'http://services.timewarnercable.com/imageserver/image/default?productId=ENTOD&providerId=AE',    //jshint ignore:line
                'name': 'A&E Network',
                'ncsNetworkId': '2',
                'linearCount': 1,
                'vodCount': 1,
                'services': [
                    {
                        'blocked': false,
                        'callsign': 'AEDM',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/31764',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 1490,
                        'networkName': 'A&E OnDemand'
                    },
                    {
                        'blocked': false,
                        'callsign': 'AETVHD',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/51529',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 7,
                        'networkName': 'A&E HD'
                    }
                ]
            }
        ],
        mockGetChannelsBlocks =  [
            {
                'logoUrl': 'http://services.timewarnercable.com/imageserver/image/default?productId=LMOD&providerId=HISTORYESP', //jshint ignore:line
                'name': 'History en Espanol',
                'ncsNetworkId': '168',
                'linearCount': 1,
                'vodCount': 1,
                'services': [
                    {
                        'blocked': true,
                        'callsign': 'HISTE',
                        'hd': false,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/43362',
                        'ncsNetworkId': '168',
                        'ncsServiceId': '253',
                        'networkName': 'History Channel en Espanol',
                        'tmsGuideId': 43362
                    },
                    {
                        'blocked': true,
                        'callsign': 'HISTE',
                        'hd': false,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/image/default?productId=LMOD&providerId=HISTORYESP', //jshint ignore:line
                        'ncsNetworkId': '168',
                        'ncsServiceId': '2723',
                        'networkName': 'History_ESP OnDemand'
                    }
                ]
            },
            {
                'logoUrl': 'http://services.timewarnercable.com/imageserver/image/default?productId=ENTOD&providerId=AE',    //jshint ignore:line
                'name': 'A&E Network',
                'ncsNetworkId': '2',
                'linearCount': 1,
                'vodCount': 1,
                'services': [
                    {
                        'blocked': true,
                        'callsign': 'AEDM',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/31764',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 1490,
                        'networkName': 'A&E OnDemand',
                        'tmsGuideId': 31764,
                        'productProviders': [
                          'ENTOD:AEHD'
                        ]
                    },
                    {
                        'blocked': false,
                        'callsign': 'AETVHD',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/51529',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 7,
                        'networkName': 'A&E HD',
                        'tmsGuideId': 51529
                    }
                ]
            }
        ],
        mockGetParentalControlsForUser = {
            'loggedInUsername': 'ovpdevner1',
            'loggedInAsAdmin': true,
            'adminUsername': 'ovpdevner1',
            'pinSet': false,
            'users': [
                {
                    'guid': 'CF0CF91D-6617-6F94-6532-5FFC1F9607EB',
                    'username': 'ovpdevner1',
                    'name': 'Owen Kinyungu',
                    'admin': true
                }
            ]
        }, mockParentalControlsByRating = {
            'parentalControls': {
                'TVRatings': [
                    {
                        'rating': 'TV-Y',
                        'blocked': false
                    },
                    {
                        'rating': 'TV-Y7',
                        'blocked': false
                    },
                    {
                        'rating': 'TV-G',
                        'blocked': false
                    },
                    {
                        'rating': 'TV-PG',
                        'blocked': false
                    },
                    {
                        'rating': 'TV-14',
                        'blocked': true
                    },
                    {
                        'rating': 'TV-MA',
                        'blocked': true
                    }
                ],
                'MovieRatings': [
                    {
                        'rating': 'G',
                        'blocked': false
                    },
                    {
                        'rating': 'PG',
                        'blocked': false
                    },
                    {
                        'rating': 'PG-13',
                        'blocked': false
                    },
                    {
                        'rating': 'R',
                        'blocked': true
                    },
                    {
                        'rating': 'NC-17',
                        'blocked': true
                    },
                    {
                        'rating': 'ADULT',
                        'blocked': true
                    }
                ],
                'blockUnrated': false
            }
        };

    beforeEach(module('ovpApp.services.parentalControlsService'));

    /* jscs:disable */
    beforeEach(inject(function (_$controller_, _$rootScope_, _config_, $window,
                                _$q_, _$injector_, _parentalControlsService_, _$http_,
                                _$timeout_) {
        $scope = _$rootScope_.$new();
        config = _config_;
        $q = _$q_;
        $httpBackend = _$injector_.get('$httpBackend');
        $http = _$http_;
        parentalControlsService = _parentalControlsService_;
        $timeout = _$timeout_;
    }));
    /* jscs:enable */

    it('should instantiate the service', function () {
        expect(parentalControlsService).toBeDefined();
    });

    beforeEach(inject(function () {
        spyOn(config.parentalControls, 'parentalControlsForUserUrl')
            .and.returnValue('/base/ovpApp/fixtures/getParentalControlsForUser.json');

        spyOn(config.parentalControls, 'setPINUrl')
            .and.returnValue('/base/ovpApp/fixtures/setPIN.txt');

        spyOn(config.parentalControls, 'parentalControlsByRatingUrl')
            .and.returnValue('/base/ovpApp/fixtures/parentalControlsByRating.json');

        spyOn(parentalControlsService, 'getParentalControlsDomainKey').and.callFake(function () {
            var defer = new $q.defer();
            defer.resolve('ovpdevner1');
            return defer.promise;
        });

        spyOn(parentalControlsService, 'isParentalControlsDisabledForClient').and.callFake(function () {
            var defer = new $q.defer();
            defer.resolve(false);
            return defer.promise;
        });
    }));

    it('getParentalControlsForUser sets loggedInUsername, isPrimary' +
        'Account ', function (done) {

            $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
                .respond(200, mockGetParentalControlsForUser);

            parentalControlsService.getLoggedInUsername().then(username => {
                expect(username).toEqual('ovpdevner1');
                parentalControlsService.isPrimaryAccount().then(isPrimaryAccount => {
                    expect(isPrimaryAccount).toEqual(true);
                    done();
                });
            });
            $httpBackend.flush();
        });

    it('during setPin for first time, ratings should be updated', function (done) {
        spyOn(parentalControlsService, 'setDefaultRatings').and.callFake(function () {
            var defer = $q.defer();
            defer.resolve();
            return defer.promise;
        });

        spyOn(parentalControlsService, 'setPIN').and.callFake(function () {
            var defer = $q.defer();
            defer.resolve();
            return defer.promise;
        });

        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
            .respond(200, mockGetParentalControlsForUser);

        parentalControlsService.getParentalControlsForUser().then(function () {
            parentalControlsService.setPINForFirstTimeWithDefaultRatings('1111').then(function () {
                expect(parentalControlsService.setDefaultRatings).toHaveBeenCalled();
                done();
            });
        });
        $httpBackend.flush();
    });

    it('TV-14 is blocked', function (done) {
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
            .respond(200, mockGetParentalControlsForUser);

        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
            .respond(200, mockParentalControlsByRating);

        parentalControlsService.isTvShowBlockedByRating('TV-14').then(function (result) {
            expect(result).toEqual(true);
            done();
        });
        $httpBackend.flush();
    });

    it('PG is not blocked', function (done) {
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
            .respond(200, mockGetParentalControlsForUser);

        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
            .respond(200, mockParentalControlsByRating);

        parentalControlsService.isTvShowBlockedByRating('PG').then(function (result) {
            expect(result).toEqual(false);
            done();
        });
        $httpBackend.flush();
    });

    it('R is blocked', function (done) {
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
            .respond(200, mockGetParentalControlsForUser);

        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
            .respond(200, mockParentalControlsByRating);

        parentalControlsService.isMovieBlockedByRating('R').then(function (result) {
            expect(result).toEqual(true);
            done();
        });
        $httpBackend.flush();
    });

    it('PG-13 is not blocked', function (done) {
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
            .respond(200, mockGetParentalControlsForUser);

        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
            .respond(200, mockParentalControlsByRating);

        parentalControlsService.isMovieBlockedByRating('PG-13').then(function (result) {
            expect(result).toEqual(false);
            done();
        });
        $httpBackend.flush();
    });

    describe('isBlockedByRating', function () {
        it('isBlockedByRating accepts string (blocked)', function (done) {
             $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
                .respond(200, mockGetParentalControlsForUser);

            $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
                .respond(200, mockParentalControlsByRating);

            parentalControlsService.isBlockedByRating('TV-14').then(function (result) {
                expect(result).toEqual(true);
                done();
            });
            $httpBackend.flush();
        });

        it('isBlockedByRating accepts string (unblocked)', function (done) {
             $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
                .respond(200, mockGetParentalControlsForUser);

            $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
                .respond(200, mockParentalControlsByRating);

            parentalControlsService.isBlockedByRating('PG').then(function (result) {
                expect(result).toEqual(false);
                done();
            });
            $httpBackend.flush();
        });

        it('isBlockedByRating accepts array (both blocked)', function (done) {
             $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
                .respond(200, mockGetParentalControlsForUser);

            $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
                .respond(200, mockParentalControlsByRating);

            parentalControlsService.isBlockedByRating(['TV-14', 'R']).then(function (result) {
                expect(result).toEqual(true);
                done();
            });
            $httpBackend.flush();
        });

        it('isBlockedByRating accepts array (one blocked)', function (done) {
             $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
                .respond(200, mockGetParentalControlsForUser);

            $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
                .respond(200, mockParentalControlsByRating);

            parentalControlsService.isBlockedByRating(['PG', 'R']).then(function (result) {
                expect(result).toEqual(false);
                done();
            });
            $httpBackend.flush();
        });

        it('isBlockedByRating accepts array (none blocked)', function (done) {
             $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
                .respond(200, mockGetParentalControlsForUser);

            $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
                .respond(200, mockParentalControlsByRating);

            parentalControlsService.isBlockedByRating(['PG', 'PG-13']).then(function (result) {
                expect(result).toEqual(false);
                done();
            });
            $httpBackend.flush();
        });
    });

    it('from ratings json create valid update ratings json', function () {
        var validUpdateRatingsJson = {
            'parentalControls': {
                'blockedTVRatings': [
                    'TV-14',
                    'TV-MA'
                ],
                'blockedMovieRatings': [
                    'PG-13',
                    'R',
                    'NC-17',
                    'ADULT'
                    //'NR'
                ],
                'blockUnrated': false
            }
        };

        expect(parentalControlsService.createRatingsUpdateJson('PG', 'TV-PG'))
            .toEqual(validUpdateRatingsJson);
    });

    it('from channels json should create valid json for service update', function () {
        var validJsonForService = {'parentalControls': {
            'blockedChannels': [
                {
                    'ncsServiceId': 1481
                },
                {
                    'ncsServiceId': 6
                },
                {
                    'ncsServiceId': 1490
                },
                {
                    'ncsServiceId': 7
                }
            ]
        }
        }, validChannelInput = [
            {
                'logoUrl': 'http://services.timewarnercable.com/imageserver/image/default?productId=ENTOD&providerId=AE',     //jshint ignore:line
                'name': 'A&E Network',
                'ncsNetworkId': '2',
                'linearCount': 1,
                'vodCount': 1,
                'services': [
                    {
                        'blocked': true,
                        'callsign': 'AEDM',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/31764',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 1481,
                        'networkName': 'A&E OnDemand'
                    },
                    {
                        'blocked': true,
                        'callsign': 'AETVHD',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/51529',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 6,
                        'networkName': 'A&E HD'
                    }
                ]
            },
            {
                'logoUrl': 'http://services.timewarnercable.com/imageserver/image/default?productId=ENTOD&providerId=AE',    //jshint ignore:line
                'name': 'A&E Network',
                'ncsNetworkId': '2',
                'linearCount': 1,
                'vodCount': 1,
                'services': [
                    {
                        'blocked': true,
                        'callsign': 'AEDM',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/31764',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 1490,
                        'networkName': 'A&E OnDemand'
                    },
                    {
                        'blocked': true,
                        'callsign': 'AETVHD',
                        'hd': true,
                        'imageUrl': 'http://services.timewarnercable.com/imageserver/guide/51529',
                        'ncsNetworkId': '2',
                        'ncsServiceId': 7,
                        'networkName': 'A&E HD'
                    }
                ]
            }
        ];
        expect(parentalControlsService.createChannelUpdateJson(validChannelInput)).toEqual(validJsonForService);
    });

    it('should set defaults if pin is not set, and no channels are set', function (done) {
        spyOn(parentalControlsService, 'isPINSet').and.callFake(function () {
            var defer = new $q.defer();
            defer.resolve(false);
            return defer.promise;
        });

        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
            .respond(200, mockGetChannelsNoBlocks);

        parentalControlsService.shouldSetDefaults().then(shouldSetDefaults => {
            expect(shouldSetDefaults).toEqual(true);
            done();
        });
        $httpBackend.flush();
    });

    it('should not set defaults if pin is not set, and channels are set', function (done) {
        spyOn(parentalControlsService, 'isPINSet').and.callFake(function () {
            var defer = new $q.defer();
            defer.resolve(false);
            return defer.promise;
        });

        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
            .respond(200, mockGetChannelsBlocks);

        parentalControlsService.shouldSetDefaults().then(shouldSetDefaults => {
            expect(shouldSetDefaults).toEqual(false);
            done();
        });
        $httpBackend.flush();
    });

    it('should not set defaults if pin is set', function (done) {
        spyOn(parentalControlsService, 'isPINSet').and.callFake(function () {
            var defer = new $q.defer();
            defer.resolve(true);
            return defer.promise;
        });

        parentalControlsService.shouldSetDefaults().then(shouldSetDefaults => {
            expect(shouldSetDefaults).toEqual(false);
            done();
        });

        $scope.$apply();
    });

    it('should block channels by the tmsGuideServiceId', function () {
        //One id, absent from the data
        parentalControlsService.isChannelBlockedByTmsGuideServiceId([10]).then(function (result) {
            expect(result).toBe(false);
        });

        //One id, blocked
        parentalControlsService.isChannelBlockedByTmsGuideServiceId([31764]).then(function (result) {
            expect(result).toBe(true);
        });

        //One id, blocked, but not in an array
        parentalControlsService.isChannelBlockedByTmsGuideServiceId(31764).then(function (result) {
            expect(result).toBe(true);
        });

        //One id, unblocked
        parentalControlsService.isChannelBlockedByTmsGuideServiceId([51529]).then(function (result) {
            expect(result).toBe(false);
        });

        //Two ids, both absent from channel data
        parentalControlsService.isChannelBlockedByTmsGuideServiceId([10, 14]).then(function (result) {
            expect(result).toBe(false);
        });

        //Two ids, one blocked, one absent
        parentalControlsService.isChannelBlockedByTmsGuideServiceId([31764, 10]).then(function (result) {
            expect(result).toBe(false);
        });

        //Two ids, one blocked, one unblocked
        parentalControlsService.isChannelBlockedByTmsGuideServiceId([31764, 51529]).then(function (result) {
            expect(result).toBe(false);
        });

        //Two ids, both blocked
        parentalControlsService.isChannelBlockedByTmsGuideServiceId([31764, 43362]).then(function (result) {
            expect(result).toBe(true);
        });

        $httpBackend.whenGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
            .respond(200, mockGetChannelsBlocks);
        $httpBackend.flush();
    });


    it('should block assets that have a rating OR a channel block', function () {

        //Blocked because tv rating, channel ok
        parentalControlsService.isBlocked(['TV-MA'], [10]).then(function (res) {
            expect(res.isBlocked).toBe(true);
            expect(res.reason).toBe('rating');
        });

        //Blocked because of channel
        parentalControlsService.isBlocked(['TV-G'], [31764]).then(function (res) {
            expect(res.isBlocked).toBe(true);
            expect(res.reason).toBe('channel');
        });

        //Not blocked because of channel, one channel blocks - another does not
        parentalControlsService.isBlocked(['TV-G'], [31764, 10]).then(function (res) {
            expect(res.isBlocked).toBe(false);
        });

        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
            .respond(200, mockGetParentalControlsForUser);
        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
            .respond(200, mockGetChannelsBlocks);
        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
            .respond(200, mockParentalControlsByRating);

        $httpBackend.flush();
    });

    it('should not request the blocked channels if it is blocked by rating', function () {
        //Blocked because tv rating
        parentalControlsService.isBlocked(['TV-MA'], [10]).then(function (res) {
            expect(res.isBlocked).toBe(true);
            expect(res.reason).toBe('rating');
        });

        // $httpBackend.whenGET('/ipvs/api/smarttv/parentalcontrol/v1')
        //     .respond(200, mockGetParentalControlsForUser);
        // $httpBackend.whenGET('/ipvs/api/smarttv/parentalcontrol/v1/ratings')
        //     .respond(200, mockParentalControlsByRating);
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
           .respond(200, mockGetParentalControlsForUser);

        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
            .respond(200, mockGetChannelsBlocks);
        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
           .respond(200, mockParentalControlsByRating);
        $httpBackend.flush();
    });

    it('should not request the blocked channels if it is blocked by rating', function () {
        //Blocked because tv rating
        parentalControlsService.isBlocked(['TV-G'], [10]).then(function (res) {
            expect(res.isBlocked).toBe(false);
        });

        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
           .respond(200, mockGetParentalControlsForUser);
        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
           .respond(200, mockGetChannelsBlocks);
        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
           .respond(200, mockParentalControlsByRating);
        $httpBackend.flush();
    });

    it('should not block if there are no provider ids', function () {
        parentalControlsService.isBlocked(['TV-G'], null, []).then(function (res) {
            expect(res.isBlocked).toBe(false);
        });
        parentalControlsService.isBlocked(['TV-G']).then(function (res) {
            expect(res.isBlocked).toBe(false);
        });
        // /ENTOD:AEHD
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
           .respond(200, mockGetParentalControlsForUser);
        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
           .respond(200, mockParentalControlsByRating);
        $httpBackend.flush();
    });

    it('should not block by provider ids if no provider ids are blocked', function () {
        parentalControlsService.isBlocked(['TV-G'], null, ['NOTHING']).then(function (res) {
            expect(res.isBlocked).toBe(false);
        });
        // /ENTOD:AEHD
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
           .respond(200, mockGetParentalControlsForUser);
        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
           .respond(200, mockGetChannelsBlocks);
        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
           .respond(200, mockParentalControlsByRating);
        $httpBackend.flush();
    });


    it('should block by provider id if all provider id are blocked', function () {
        parentalControlsService.isBlocked(['TV-G'], null, ['ENTOD:AEHD']).then(function (res) {
            expect(res.isBlocked).toBe(true);
        });
        $httpBackend.expectGET('/base/ovpApp/fixtures/getParentalControlsForUser.json')
           .respond(200, mockGetParentalControlsForUser);
        $httpBackend.expectGET('/ipvs/api/smarttv/parentalcontrol/v1/blockedchannels')
            .respond(200, mockGetChannelsBlocks);
        $httpBackend.expectGET('/base/ovpApp/fixtures/parentalControlsByRating.json')
           .respond(200, mockParentalControlsByRating); //TV-14 & TV-MA are blocked as are R and up

        $httpBackend.flush();
    });


});
