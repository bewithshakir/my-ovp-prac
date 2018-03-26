/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.product.service', function () {
    'use strict';

    var entryService, $q, $httpBackend,
        smartTvLineup = {
            market: 'foo',
            lineupId: 0
        },
        entryResponseGeneratorForProfile = function (profile) {
            let query = 'division=foo&lineup=0&profile=' + profile;
            /*jshint -W109*/
            return {
                "uri": "/entrypoint/" + query + "&cacheID=125",
                "entryPointList": [
                    {
                        "name": "homePage",
                        "ordinal": 0,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/homepage/frontdoor?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "rta",
                        "ordinal": 1,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/rta/schedule??" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "event",
                        "ordinal": 2,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "replaceString": "{tmsid}",
                                "replaceType": "tmsProviderProgramID",
                                "uri": "/event/tmsid/{tmsid}?" + query + "&cacheID=125"
                            },
                            {
                                "replaceString": "{providerassetid}",
                                "replaceType": "providerAssetID",
                                "uri": "/event/providerassetid/{providerassetid}?" + query + "&cacheID=125"
                            },
                            {
                                "replaceString": "{offeringid}",
                                "replaceType": "offeringID",
                                "uri": "/event/offeringid/{offeringid}?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "ppv",
                        "ordinal": 3,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/ppv/guideid/{guideid}?" + query + "&cacheID=125",
                                "replaceStrings": [
                                    {
                                        "replaceType": "tmsGuideServiceID",
                                        "replaceString": "{guideid}"
                                    }
                                ]
                            },
                            {
                                "uri": "/ppv/guideid/{guideid}/tmsid/{tmsid}?" + query + "&cacheID=125",
                                "replaceStrings": [
                                    {
                                        "replaceType": "tmsGuideServiceID",
                                        "replaceString": "{guideid}"
                                    },
                                    {
                                        "replaceType": "tmsProviderProgramID",
                                        "replaceString": "{tmsid}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "series",
                        "ordinal": 4,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "replaceString": "{tmsproviderseriesid}",
                                "replaceType": "tmsSeriesID",
                                "uri": "/series/tmsproviderseriesid/{tmsproviderseriesid}?" + query + "&cacheID=125"
                            },
                            {
                                "replaceString": "{tmsproviderprogramid}",
                                "replaceType": "tmsProviderProgramIDForSeries",
                                "uri": "/series/tmsproviderprogramid/{tmsproviderprogramid}?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "autoComplete",
                        "ordinal": 5,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "replaceString": "{searchString}",
                                "replaceType": "searchString",
                                "uri": "/search/autocomplete?searchString={searchString}&" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "topSearches",
                        "ordinal": 6,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/search/topsearches?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "networkPortal",
                        "ordinal": 8,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/networkportal/networks?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "networksGrid",
                        "ordinal": 9,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/networksgrid/frontdoor?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "vodPortal",
                        "ordinal": 10,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/vodportal/frontdoor?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "keyboard",
                        "ordinal": 11,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/search/keyboard?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "odserviceList",
                        "ordinal": 12,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/odservice/list?" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "networksGridMenu",
                        "ordinal": 16,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "uri": "/networksgrid/menu?path=65921&" + query + "&cacheID=125"
                            }
                        ]
                    },
                    {
                        "name": "componentSearch",
                        "ordinal": 17,
                        "cacheID": 125,
                        "entryPoints": [
                            {
                                "replaceString": "{searchString}",
                                "replaceType": "searchString",
                                "uri": "/search/component?searchString={searchString}&" + query + "&cacheID=125"
                            }
                        ]
                    }
                ]
            };
        };

    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(module('ovpApp.services.entry'));

    /* jscs:disable */
    beforeEach(inject((_entryService_, _$q_, _$injector_) => {
        entryService = _entryService_;
        $q = _$q_;

        $httpBackend = _$injector_.get('$httpBackend');
    }));
    /* jscs:enable */

    it('should instantiate the service', function () {
        expect(entryService).toBeDefined();
    });

    it('returns a promise', function () {
        expect(entryService.forProfile('bar').then).toBeDefined();
    });

    it('can load and parse results', function () {
        entryService.forProfile('bar').then(service => {
            expect(service.event.tmsProviderProgramID).toBeDefined();
        });

        $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
            .respond(200, { market: 'foo', lineupId: '0' });
        $httpBackend.expectGET('/nationalnavigation/V1/symphoni/entrypoint?division=foo&lineup=0&profile=bar')
            .respond(entryResponseGeneratorForProfile('foo'));
        $httpBackend.flush();
    });

    it('can transform uri', function () {
        entryService.forProfile('bar').then(service => {
            expect(service.event.tmsProviderProgramID('1234'))
                .toEqual('/event/tmsid/1234?division=foo&lineup=0&profile=bar&cacheID=125');
            expect(service.event.providerAssetID('1234'))
                .toEqual('/event/providerassetid/1234?division=foo&lineup=0&profile=bar&cacheID=125');
            expect(service.homePage())
                .toEqual('/homepage/frontdoor?division=foo&lineup=0&profile=bar&cacheID=125');
            expect(service.ppv.tmsGuideServiceID).toBeDefined();
            expect(service.ppv.tmsGuideServiceID_tmsProviderProgramID).toBeDefined();
            expect(service.ppv.tmsGuideServiceID('1234'))
                .toEqual(('/ppv/guideid/1234?division=foo&lineup=0&profile=bar&cacheID=125'))
            expect(service.ppv.tmsGuideServiceID_tmsProviderProgramID('1234', '5678'))
                .toEqual('/ppv/guideid/1234/tmsid/5678?division=foo&lineup=0&profile=bar&cacheID=125')
        });
        $httpBackend.expectGET('/ipvs/api/smarttv/lineup/v1')
            .respond(200, { market: 'foo', lineupId: '0' });
        $httpBackend.expectGET('/nationalnavigation/V1/symphoni/entrypoint?division=foo&lineup=0&profile=bar')
            .respond(entryResponseGeneratorForProfile('bar'));
        $httpBackend.flush();
    });

});
