//jshint ignore:start
/* jscs:disable */
var mockData = mockData || {};
mockData.nnsEntryPoint =
{
  "uri": "/nationalnavigation/V1/symphoni/entrypoint/?division=Online&lineup=0&profile=ovp&cacheID=6",
  "entryPointList": [
    {
      "name": "event",
      "ordinal": 0,
      "cacheID": 6,
      "entryPoints": [
        {
          "replaceString": "{tmsid}",
          "replaceType": "tmsProviderProgramID",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/{tmsid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "replaceString": "{providerassetid}",
          "replaceType": "providerAssetID",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/providerassetid/{providerassetid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "replaceString": "{theplatformmediaid}",
          "replaceType": "thePlatformMediaID",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/theplatformmediaid/{theplatformmediaid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "replaceString": "{offeringid}",
          "replaceType": "offeringID",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/offeringid/{offeringid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "replaceString": "{preludenationalmetadataid}",
          "replaceType": "nationalMetadataID",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/preludenationalmetadataid/{preludenationalmetadataid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "replaceString": "{ondemandproviderprogramid}",
          "replaceType": "ondemandProviderProgramID",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/ondemandproviderprogramid/{ondemandproviderprogramid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "series",
      "ordinal": 1,
      "cacheID": 6,
      "entryPoints": [
        {
          "replaceString": "{tmsproviderseriesid}",
          "replaceType": "tmsSeriesID",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/{tmsproviderseriesid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "replaceString": "{tmsproviderprogramid}",
          "replaceType": "tmsProviderProgramIDForSeries",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/series/tmsproviderprogramid/{tmsproviderprogramid}?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "autoComplete",
      "ordinal": 2,
      "cacheID": 6,
      "entryPoints": [
        {
          "replaceString": "{searchString}",
          "replaceType": "searchString",
          "uri": "/nationalnavigation/V1/symphoni/search/autocomplete?searchString={searchString}&division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "topSearches",
      "ordinal": 3,
      "cacheID": 6,
      "entryPoints": [
        {
          "uri": "/nationalnavigation/V1/symphoni/search/topsearches?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "networksGrid",
      "ordinal": 4,
      "cacheID": 6,
      "entryPoints": [
        {
          "uri": "/nationalnavigation/V1/symphoni/networksgrid/frontdoor?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "vodPortal",
      "ordinal": 5,
      "cacheID": 6,
      "entryPoints": [
        {
          "uri": "/nationalnavigation/V1/symphoni/vodportal/frontdoor?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "actor",
      "ordinal": 6,
      "cacheID": 6,
      "entryPoints": [
        {
          "uri": "/nationalnavigation/V1/symphoni/recommendations/tmsid/{tmsid}/actor/{personid}?division=Online&lineup=0&application=BROWSE&profile=ovp&cacheID=6",
          "replaceStrings": [
            {
              "replaceType": "tmsProviderProgramID",
              "replaceString": "{tmsid}"
            },
            {
              "replaceType": "tmsPersonID",
              "replaceString": "{personid}"
            }
          ]
        }
      ]
    },
    {
      "name": "director",
      "ordinal": 7,
      "cacheID": 6,
      "entryPoints": [
        {
          "uri": "/nationalnavigation/V1/symphoni/recommendations/tmsid/{tmsid}/director/{personid}?division=Online&lineup=0&application=BROWSE&profile=ovp&cacheID=6",
          "replaceStrings": [
            {
              "replaceType": "tmsProviderProgramID",
              "replaceString": "{tmsid}"
            },
            {
              "replaceType": "tmsPersonID",
              "replaceString": "{personid}"
            }
          ]
        }
      ]
    },
    {
      "name": "similarTo",
      "ordinal": 8,
      "cacheID": 6,
      "entryPoints": [
        {
          "replaceString": "{tmsid}",
          "replaceType": "tmsProviderProgramID",
          "uri": "/nationalnavigation/V1/symphoni/recommendations/tmsid/{tmsid}/similarto?division=Online&lineup=0&application=BROWSE&profile=ovp&cacheID=6"
        },
        {
          "replaceString": "{tmsproviderseriesid}",
          "replaceType": "tmsSeriesID",
          "uri": "/nationalnavigation/V1/symphoni/recommendations/tmsproviderseriesid/{tmsproviderseriesid}/similarto?division=Online&lineup=0&application=BROWSE&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "networksGridMenu",
      "ordinal": 9,
      "cacheID": 6,
      "entryPoints": [
        {
          "uri": "/nationalnavigation/V1/symphoni/networksgrid/menu?path=65921&division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "componentSearch",
      "ordinal": 10,
      "cacheID": 6,
      "entryPoints": [
        {
          "replaceString": "{searchString}",
          "replaceType": "searchString",
          "uri": "/nationalnavigation/V1/symphoni/search/component?searchString={searchString}&division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ]
    },
    {
      "name": "watchLater",
      "ordinal": 11,
      "cacheID": 48,
      "entryPoints": [
        {
          uri: "/nationalnavigation/V1/symphoni/watchlater/frontdoor?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48"
        }
      ]
    }
  ]
};

// https://services.timewarnercable.com/ipvs/api/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/10520907?division=Online&lineup=0&profile=ovp&cacheID=6
mockData.nnsSeriesData10520907 =
{
  "type": "episode_list",
  "alphaSortOn": "Affair",
  "availableOutOfHome": false,
  "details": {
    "crew": [
      {
        "name": "Joshua Jackson",
        "character": "Cole",
        "tmsPersonId": 73949,
        "role": "actor",
        "actorType": "Actor"
      },
      {
        "name": "Ruth Wilson",
        "character": "Alison",
        "tmsPersonId": 528324,
        "role": "actor",
        "actorType": "Actor"
      },
      {
        "name": "Dominic West",
        "character": "Noah",
        "tmsPersonId": 87263,
        "role": "actor",
        "actorType": "Actor"
      },
      {
        "name": "Maura Tierney",
        "character": "Helen",
        "tmsPersonId": 44454,
        "role": "actor",
        "actorType": "Actor"
      }
    ],
    "genres": [
      {
        "name": "Drama"
      }
    ],
    "long_desc": "Married couples' lives intertwine when two people begin an affair.",
    "num_assets": 18,
    "short_desc": "Married couples' lives intertwine when two people begin an affair.",
    "latest_episode": {
      "type": "event",
      "eventType": "EPISODE",
      "alphaSortOn": "Affair",
      "availableOutOfHome": false,
      "details": {
        "crew": [
          {
            "name": "Joshua Jackson",
            "character": "Cole",
            "tmsPersonId": 73949,
            "role": "actor",
            "actorType": "Actor"
          },
          {
            "name": "Ruth Wilson",
            "character": "Alison",
            "tmsPersonId": 528324,
            "role": "actor",
            "actorType": "Actor"
          },
          {
            "name": "Dominic West",
            "character": "Noah",
            "tmsPersonId": 87263,
            "role": "actor",
            "actorType": "Actor"
          },
          {
            "name": "Maura Tierney",
            "character": "Helen",
            "tmsPersonId": 44454,
            "role": "actor",
            "actorType": "Actor"
          },
          {
            "name": "Jeffrey Reiner",
            "tmsPersonId": 156541,
            "role": "director"
          }
        ],
        "episode_number": 3,
        "genres": [
          {
            "name": "Drama"
          }
        ],
        "long_desc": "There are serious consequences to Noah's love; Alison learns a truth.",
        "programMetadata": {
          "EP018704920014": {
            "title": "The Affair",
            "longDescription": "There are serious consequences to Noah's love; Alison learns a truth.",
            "shortDescription": "There are serious consequences to Noah's love; Alison learns a truth."
          }
        },
        "original_air_date": "2015-10-18",
        "original_network_name": "",
        "season_number": 2,
        "short_desc": "There are serious consequences to Noah's love; Alison learns a truth.",
        "year": 2015,
        "commonSenseMediaV2": {
          "rating": 18
        },
        "metacritic": {
          "rating": 78
        },
        "allRatings": [
          "TV-MA"
        ]
      },
      "tmsProgramIds": [
        "EP018704920014"
      ],
      "providerAssetIds": [
        "sho.com::XPMV0001441106246001"
      ],
      "image_uri": "https://services.timewarnercable.com/imageserver/program/EP018704920014",
      "network": {
        "callsign": "SHOW",
        "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
        "name": "Showtime",
        "product_provider": "SOD:SHOWTIME_HD",
        "product_providers": [
          "SOD:SHOWTIME_HD"
        ],
        "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
      },
      "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP018704920014",
      "streamList": [
        {
          "index": 0,
          "type": "ONLINE_ONDEMAND",
          "streamProperties": {
            "runtimeInSeconds": 3480,
            "rating": "TV-MA",
            "advisories": [
              "AS",
              "BN",
              "GL"
            ],
            "attributes": [
              "HIGH_DEF",
              "CLOSED_CAPTIONING"
            ],
            "drm_content_id": "XPMV0001441106246001",
            "startTime": "1445212800000",
            "endTime": "1453766400000",
            "price": 0.0,
            "hasPreview": false,
            "rentalWindowInHours": 24,
            "cancellationWindowInMinutes": 5,
            "providerAssetID": "sho.com::XPMV0001441106246001",
            "tmsProviderProgramID": "EP018704920014",
            "tmsProviderProgramIDForSeries": "SH018704920000",
            "thePlatformMediaId": "545802307973",
            "ondemandStreamType": "FOD",
            "display_runtime": "58:00",
            "availableOutOfHome": false,
            "availableInHome": true,
            "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001441106246001",
            "premium": true,
            "isAvailableOnISAVod": true,
            "isaVodProviderAssetId": "sho.com::XPMV0001441106246001",
            "tricks_mode": {

            }
          },
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "twcTvAvailable": true,
          "productProvider": "SOD:SHOWTIME_HD",
          "entitled": true,
          "parentallyBlocked": false,
          "parentallyBlockedByChannel": false,
          "parentallyBlockedByRating": false,
          "bookmark": {
            "providerAssetId": "sho.com::XPMV0001441106246001",
            "playMarkerSeconds": 3423,
            "tmsProgramId": "EP018704920014",
            "runtimeSeconds": 3423,
            "complete": true,
            "hidden": false,
            "lastWatchedUtcSeconds": 1445621694
          },
          "watchList": false
        }
      ],
      "alsoAvailableStreamCategories": [
        {
          "type": "OD",
          "categories": [
            {
              "title": "On Demand",
              "rating": "TV-MA",
              "streamIndices": [
                0
              ]
            }
          ]
        }
      ],
      "defaultStreamOrderIndices": [
        0
      ],
      "title": "The Affair",
      "titleWithoutArticles": "Affair",
      "seriesTitle": "The Affair",
      "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP018704920014?division=Online&lineup=0&profile=ovp&cacheID=6"
    },
    "commonSenseMediaV2": {
      "rating": 18
    },
    "metacritic": {
      "rating": 78
    },
    "allRatings": [
      "TV-14",
      "TV-MA"
    ]
  },
  "tmsSeriesId": 10520907,
  "tmsSeriesIdStr": "10520907",
  "image_uri": "https://services.timewarnercable.com/imageserver/series/10520907",
  "network": {
    "callsign": "SHOW",
    "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
    "name": "Showtime",
    "product_provider": "SOD:SHOWTIME_HD",
    "product_providers": [
      "SOD:SHOWTIME_HD"
    ],
    "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
  },
  "nmd_series_uri": "https://services.timewarnercable.com/nmd/series/10520907",
  "seasons": [
    {
      "episodes": [
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "Affair",
          "availableOutOfHome": false,
          "details": {
            "crew": [
              {
                "name": "Joshua Jackson",
                "character": "Cole",
                "tmsPersonId": 73949,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Ruth Wilson",
                "character": "Alison",
                "tmsPersonId": 528324,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Dominic West",
                "character": "Noah",
                "tmsPersonId": 87263,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Maura Tierney",
                "character": "Helen",
                "tmsPersonId": 44454,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Jeffrey Reiner",
                "tmsPersonId": 156541,
                "role": "director"
              }
            ],
            "episode_number": 3,
            "genres": [
              {
                "name": "Drama"
              }
            ],
            "long_desc": "There are serious consequences to Noah's love; Alison learns a truth.",
            "programMetadata": {
              "EP018704920014": {
                "title": "The Affair",
                "longDescription": "There are serious consequences to Noah's love; Alison learns a truth.",
                "shortDescription": "There are serious consequences to Noah's love; Alison learns a truth."
              }
            },
            "original_air_date": "2015-10-18",
            "original_network_name": "",
            "season_number": 2,
            "short_desc": "There are serious consequences to Noah's love; Alison learns a truth.",
            "year": 2015,
            "commonSenseMediaV2": {
              "rating": 18
            },
            "metacritic": {
              "rating": 78
            },
            "allRatings": [
              "TV-MA"
            ]
          },
          "tmsProgramIds": [
            "EP018704920014"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001441106246001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP018704920014",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP018704920014",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 3480,
                "rating": "TV-MA",
                "advisories": [
                  "AS",
                  "BN",
                  "GL"
                ],
                "attributes": [
                  "HIGH_DEF",
                  "CLOSED_CAPTIONING"
                ],
                "drm_content_id": "XPMV0001441106246001",
                "entitled": true,
                "startTime": "1445212800000",
                "endTime": "1453766400000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001441106246001",
                "tmsProviderProgramID": "EP018704920014",
                "tmsProviderProgramIDForSeries": "SH018704920000",
                "thePlatformMediaId": "545802307973",
                "ondemandStreamType": "FOD",
                "display_runtime": "58:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001441106246001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001441106246001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "bookmark": {
                "providerAssetId": "sho.com::XPMV0001441106246001",
                "playMarkerSeconds": 3423,
                "tmsProgramId": "EP018704920014",
                "runtimeSeconds": 3423,
                "complete": true,
                "hidden": false,
                "lastWatchedUtcSeconds": 1445621694
              },
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-MA",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "The Affair",
          "titleWithoutArticles": "Affair",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP018704920014?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "Affair",
          "availableOutOfHome": false,
          "details": {
            "crew": [
              {
                "name": "Joshua Jackson",
                "character": "Cole",
                "tmsPersonId": 73949,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Ruth Wilson",
                "character": "Alison",
                "tmsPersonId": 528324,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Dominic West",
                "character": "Noah",
                "tmsPersonId": 87263,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Maura Tierney",
                "character": "Helen",
                "tmsPersonId": 44454,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Jeffrey Reiner",
                "tmsPersonId": 156541,
                "role": "director"
              }
            ],
            "episode_number": 2,
            "genres": [
              {
                "name": "Drama"
              }
            ],
            "long_desc": "Alison's summer is interrupted; concerns arise over Cole's lifestyle.",
            "programMetadata": {
              "EP018704920013": {
                "title": "The Affair",
                "longDescription": "Alison's summer is interrupted; concerns arise over Cole's lifestyle.",
                "shortDescription": "Alison's summer is interrupted; concerns arise over Cole's lifestyle."
              }
            },
            "original_air_date": "2015-10-11",
            "original_network_name": "",
            "season_number": 2,
            "short_desc": "Alison's summer is interrupted; concerns arise over Cole's lifestyle.",
            "year": 2015,
            "commonSenseMediaV2": {
              "rating": 18
            },
            "metacritic": {
              "rating": 78
            },
            "allRatings": [
              "TV-MA"
            ]
          },
          "tmsProgramIds": [
            "EP018704920013"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001441106097001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP018704920013",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP018704920013",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 3600,
                "rating": "TV-MA",
                "advisories": [
                  "AS",
                  "BN",
                  "GL"
                ],
                "attributes": [
                  "HIGH_DEF",
                  "CLOSED_CAPTIONING"
                ],
                "drm_content_id": "XPMV0001441106097001",
                "startTime": "1444003200000",
                "endTime": "1453766400000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001441106097001",
                "tmsProviderProgramID": "EP018704920013",
                "tmsProviderProgramIDForSeries": "SH018704920000",
                "thePlatformMediaId": "536184899770",
                "ondemandStreamType": "FOD",
                "display_runtime": "01:00:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001441106097001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001441106097001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-MA",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "The Affair",
          "titleWithoutArticles": "Affair",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP018704920013?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "Affair",
          "availableOutOfHome": false,
          "details": {
            "crew": [
              {
                "name": "Joshua Jackson",
                "character": "Cole",
                "tmsPersonId": 73949,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Ruth Wilson",
                "character": "Alison",
                "tmsPersonId": 528324,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Dominic West",
                "character": "Noah",
                "tmsPersonId": 87263,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Maura Tierney",
                "character": "Helen",
                "tmsPersonId": 44454,
                "role": "actor",
                "actorType": "Actor"
              },
              {
                "name": "Jeffrey Reiner",
                "tmsPersonId": 156541,
                "role": "director"
              }
            ],
            "episode_number": 1,
            "genres": [
              {
                "name": "Drama"
              }
            ],
            "long_desc": "Noah and Helen try to have an amicable divorce, but inescapable conflict is revealed; Helen experiences surprising developments.",
            "programMetadata": {
              "EP018704920012": {
                "title": "The Affair",
                "longDescription": "Noah and Helen try to have an amicable divorce, but inescapable conflict is revealed; Helen experiences surprising developments.",
                "shortDescription": "Noah and Helen try to have an amicable divorce, but inescapable conflict is revealed; Helen experiences surprising developments."
              }
            },
            "original_air_date": "2015-10-04",
            "original_network_name": "",
            "season_number": 2,
            "short_desc": "Noah and Helen try to have an amicable divorce, but inescapable conflict is revealed; Helen experiences surprising developments.",
            "year": 2015,
            "commonSenseMediaV2": {
              "rating": 18
            },
            "metacritic": {
              "rating": 78
            },
            "allRatings": [
              "TV-MA"
            ]
          },
          "tmsProgramIds": [
            "EP018704920012"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001438497408001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP018704920012",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP018704920012",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 3540,
                "rating": "TV-MA",
                "advisories": [
                  "AS",
                  "GL",
                  "N"
                ],
                "attributes": [
                  "HIGH_DEF",
                  "CLOSED_CAPTIONING"
                ],
                "drm_content_id": "XPMV0001438497408001",
                "startTime": "1443139200000",
                "endTime": "1453766400000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001438497408001",
                "tmsProviderProgramID": "EP018704920012",
                "tmsProviderProgramIDForSeries": "SH018704920000",
                "thePlatformMediaId": "531768387832",
                "ondemandStreamType": "FOD",
                "display_runtime": "59:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001438497408001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001438497408001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-MA",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "The Affair",
          "titleWithoutArticles": "Affair",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP018704920012?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ],
      "name": "Season 2",
      "number": 1
    },
    {
      "episodes": [
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "S2 Noah Profile",
          "availableOutOfHome": false,
          "isPreview": true,
          "details": {
            "crew": [

            ],
            "genres": [

            ],
            "long_desc": "Noah tries to have it all.",
            "programMetadata": {
              "EP020208280013": {
                "title": "S2 Noah Profile",
                "longDescription": "Noah tries to have it all.",
                "shortDescription": "Noah tries to have it all."
              }
            },
            "original_air_date": "2015-09-25",
            "original_network_name": "",
            "short_desc": "Noah tries to have it all.",
            "year": 2015,
            "allRatings": [
              "TV-14"
            ]
          },
          "tmsProgramIds": [
            "EP020208280013"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001442919921001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP020208280013",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP020208280013",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 180,
                "rating": "TV-14",
                "advisories": [

                ],
                "attributes": [
                  "HIGH_DEF",
                  "CLOSED_CAPTIONING"
                ],
                "drm_content_id": "XPMV0001442919921001",
                "startTime": "1443139200000",
                "endTime": "1451520000000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001442919921001",
                "tmsProviderProgramID": "EP020208280013",
                "tmsProviderProgramIDForSeries": "SH020208280000",
                "thePlatformMediaId": "532200003516",
                "ondemandStreamType": "FOD",
                "display_runtime": "03:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001442919921001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001442919921001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-14",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "S2 Noah Profile",
          "titleWithoutArticles": "S2 Noah Profile",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP020208280013?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "S2 Alison Profile",
          "availableOutOfHome": false,
          "details": {
            "crew": [

            ],
            "genres": [

            ],
            "long_desc": "Alison tries to build a lasting relationship with Noah.",
            "programMetadata": {
              "EP020208280012": {
                "title": "S2 Alison Profile",
                "longDescription": "Alison tries to build a lasting relationship with Noah.",
                "shortDescription": "Alison tries to build a lasting relationship with Noah."
              }
            },
            "original_air_date": "2015-09-25",
            "original_network_name": "",
            "short_desc": "Alison tries to build a lasting relationship with Noah.",
            "year": 2015,
            "allRatings": [
              "TV-14"
            ]
          },
          "tmsProgramIds": [
            "EP020208280012"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001442919920001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP020208280012",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP020208280012",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 180,
                "rating": "TV-14",
                "advisories": [

                ],
                "attributes": [
                  "HIGH_DEF",
                  "CLOSED_CAPTIONING"
                ],
                "drm_content_id": "XPMV0001442919920001",
                "startTime": "1443139200000",
                "endTime": "1451520000000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001442919920001",
                "tmsProviderProgramID": "EP020208280012",
                "tmsProviderProgramIDForSeries": "SH020208280000",
                "thePlatformMediaId": "532198467677",
                "ondemandStreamType": "FOD",
                "display_runtime": "03:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001442919920001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001442919920001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-14",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "S2 Alison Profile",
          "titleWithoutArticles": "S2 Alison Profile",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP020208280012?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "About the Affair Season 2",
          "availableOutOfHome": false,
          "details": {
            "crew": [

            ],
            "genres": [

            ],
            "long_desc": "With a murder unsolved and a betrayal exposed, everyone's truth is suspect.",
            "programMetadata": {
              "EP020208280009": {
                "title": "About the Affair Season 2",
                "longDescription": "With a murder unsolved and a betrayal exposed, everyone's truth is suspect.",
                "shortDescription": "With a murder unsolved and a betrayal exposed, everyone's truth is suspect."
              }
            },
            "original_air_date": "2015-09-25",
            "original_network_name": "",
            "short_desc": "With a murder unsolved and a betrayal exposed, everyone's truth is suspect.",
            "year": 2015,
            "allRatings": [
              "TV-14"
            ]
          },
          "tmsProgramIds": [
            "EP020208280009"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001441272939001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP020208280009",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP020208280009",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 240,
                "rating": "TV-14",
                "advisories": [

                ],
                "attributes": [
                  "HIGH_DEF"
                ],
                "drm_content_id": "XPMV0001441272939001",
                "startTime": "1443139200000",
                "endTime": "1451520000000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001441272939001",
                "tmsProviderProgramID": "EP020208280009",
                "tmsProviderProgramIDForSeries": "SH020208280000",
                "thePlatformMediaId": "526083139669",
                "ondemandStreamType": "FOD",
                "display_runtime": "04:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001441272939001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001441272939001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-14",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "About the Affair Season 2",
          "titleWithoutArticles": "About the Affair Season 2",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP020208280009?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "Season 2 Trailer",
          "availableOutOfHome": false,
          "details": {
            "crew": [

            ],
            "genres": [

            ],
            "long_desc": "The fallout of Noah and Alison's affair.",
            "programMetadata": {
              "EP020208280010": {
                "title": "Season 2 Trailer",
                "longDescription": "The fallout of Noah and Alison's affair.",
                "shortDescription": "The fallout of Noah and Alison's affair."
              }
            },
            "original_air_date": "2015-09-25",
            "original_network_name": "",
            "short_desc": "The fallout of Noah and Alison's affair.",
            "year": 2015,
            "allRatings": [
              "TV-14"
            ]
          },
          "tmsProgramIds": [
            "EP020208280010"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001441185219001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP020208280010",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP020208280010",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 180,
                "rating": "TV-14",
                "advisories": [

                ],
                "attributes": [
                  "HIGH_DEF"
                ],
                "drm_content_id": "XPMV0001441185219001",
                "startTime": "1443139200000",
                "endTime": "1446422400000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001441185219001",
                "tmsProviderProgramID": "EP020208280010",
                "tmsProviderProgramIDForSeries": "SH020208280000",
                "thePlatformMediaId": "526051907696",
                "ondemandStreamType": "FOD",
                "display_runtime": "03:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001441185219001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001441185219001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-14",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "Season 2 Trailer",
          "titleWithoutArticles": "Season 2 Trailer",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP020208280010?division=Online&lineup=0&profile=ovp&cacheID=6"
        },
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "Beginning",
          "availableOutOfHome": false,
          "details": {
            "crew": [

            ],
            "genres": [

            ],
            "long_desc": "Catching up on the Golden Globe winning drama.",
            "programMetadata": {
              "EP020208280008": {
                "title": "The Beginning",
                "longDescription": "Catching up on the Golden Globe winning drama.",
                "shortDescription": "Catching up on the Golden Globe winning drama."
              }
            },
            "original_air_date": "2015-09-14",
            "original_network_name": "",
            "short_desc": "Catching up on the Golden Globe winning drama.",
            "year": 2015,
            "allRatings": [
              "TV-14"
            ]
          },
          "tmsProgramIds": [
            "EP020208280008"
          ],
          "providerAssetIds": [
            "sho.com::XPMV0001441272887001"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP020208280008",
          "network": {
            "callsign": "SHOW",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "Showtime",
            "product_provider": "SOD:SHOWTIME_HD",
            "product_providers": [
              "SOD:SHOWTIME_HD"
            ],
            "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP020208280008",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 180,
                "rating": "TV-14",
                "advisories": [

                ],
                "attributes": [
                  "HIGH_DEF",
                  "CLOSED_CAPTIONING"
                ],
                "drm_content_id": "XPMV0001441272887001",
                "startTime": "1442188800000",
                "endTime": "1451520000000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "sho.com::XPMV0001441272887001",
                "tmsProviderProgramID": "EP020208280008",
                "tmsProviderProgramIDForSeries": "SH020208280000",
                "thePlatformMediaId": "523089475672",
                "ondemandStreamType": "FOD",
                "display_runtime": "03:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/sho.com::XPMV0001441272887001",
                "premium": true,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "sho.com::XPMV0001441272887001",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "SHOW",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "Showtime",
                "product_provider": "SOD:SHOWTIME_HD",
                "product_providers": [
                  "SOD:SHOWTIME_HD"
                ],
                "networkImageQueryParams": "providerId=SHOWTIME_HD&productId=SOD"
              },
              "twcTvAvailable": true,
              "productProvider": "SOD:SHOWTIME_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-14",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "The Beginning",
          "titleWithoutArticles": "Beginning",
          "seriesTitle": "The Affair",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP020208280008?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ],
      "name": "Other",
      "number": 0
    }
  ],
  "title": "The Affair",
  "titleWithoutArticles": "Affair",
  "uri": "/ipvs/api/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/10520907?division=Online&lineup=0&profile=ovp&cacheID=6",
  "watchListSeries": false
};

//https://services.timewarnercable.com/nationalnavigation/V1/symphoni/entrypoint?division=online&lineup=0&profile=ovp

// 20151023120734
// https://services.timewarnercable.com/ipvs/api/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/3560383?division=Online&lineup=0&profile=ovp&cacheID=6
mockData.nnsSeriesData3560383 =
{
  "type": "episode_list",
  "alphaSortOn": "Shark Tank",
  "availableOutOfHome": false,
  "details": {
    "crew": [
      {
        "name": "Mark Cuban",
        "tmsPersonId": 310709,
        "role": "actor",
        "actorType": "Judge"
      },
      {
        "name": "Daymond John",
        "tmsPersonId": 547822,
        "role": "actor",
        "actorType": "Judge"
      },
      {
        "name": "Barbara Corcoran",
        "tmsPersonId": 547821,
        "role": "actor",
        "actorType": "Judge"
      },
      {
        "name": "Robert Herjavec",
        "tmsPersonId": 531717,
        "role": "actor",
        "actorType": "Judge"
      }
    ],
    "genres": [
      {
        "name": "Reality"
      }
    ],
    "long_desc": "Budding entrepreneurs have a shot at making their dreams come true.",
    "num_assets": 7,
    "short_desc": "Budding entrepreneurs have a shot at making their dreams come true.",
    "latest_episode": {
      "type": "event",
      "eventType": "EPISODE",
      "alphaSortOn": "Shark Tank",
      "availableOutOfHome": false,
      "details": {
        "crew": [
          {
            "name": "Mark Cuban",
            "tmsPersonId": 310709,
            "role": "actor",
            "actorType": "Judge"
          },
          {
            "name": "Daymond John",
            "tmsPersonId": 547822,
            "role": "actor",
            "actorType": "Judge"
          },
          {
            "name": "Barbara Corcoran",
            "tmsPersonId": 547821,
            "role": "actor",
            "actorType": "Judge"
          },
          {
            "name": "Robert Herjavec",
            "tmsPersonId": 531717,
            "role": "actor",
            "actorType": "Judge"
          }
        ],
        "episode_number": 4,
        "genres": [
          {
            "name": "Reality"
          }
        ],
        "long_desc": "A device that simplifies potty training; a mashup of brownies and cookies; an update on an inspirational toy business.",
        "programMetadata": {
          "EP011581290129": {
            "title": "Shark Tank",
            "longDescription": "A device that simplifies potty training; a mashup of brownies and cookies; an update on an inspirational toy business.",
            "shortDescription": "A device that simplifies potty training; a mashup of brownies and cookies; an update on an inspirational toy business."
          }
        },
        "original_air_date": "2015-10-16",
        "original_network_name": "",
        "season_number": 7,
        "short_desc": "A device that simplifies potty training; a mashup of brownies and cookies; an update on an inspirational toy business.",
        "year": 2015,
        "commonSenseMediaV2": {
          "rating": 13
        },
        "metacritic": {
          "rating": 58
        },
        "allRatings": [
          "TV-PG"
        ]
      },
      "tmsProgramIds": [
        "EP011581290129"
      ],
      "providerAssetIds": [
        "abc.com::MOVE0000000000201907"
      ],
      "image_uri": "https://services.timewarnercable.com/imageserver/program/EP011581290129",
      "network": {
        "callsign": "ABC",
        "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
        "name": "ABC",
        "product_provider": "PTOD:ABC_HD",
        "product_providers": [
          "PTOD:ABC_HD"
        ],
        "networkImageQueryParams": "providerId=ABC_HD&productId=PTOD"
      },
      "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP011581290129",
      "streamList": [
        {
          "index": 0,
          "type": "ONLINE_ONDEMAND",
          "streamProperties": {
            "runtimeInSeconds": 3300,
            "rating": "TV-PG",
            "advisories": [

            ],
            "attributes": [
              "HIGH_DEF",
              "CLOSED_CAPTIONING"
            ],
            "drm_content_id": "MOVE0000000000201907",
            "startTime": "1445299200000",
            "endTime": "1448063999000",
            "price": 0.0,
            "hasPreview": false,
            "rentalWindowInHours": 24,
            "cancellationWindowInMinutes": 5,
            "providerAssetID": "abc.com::MOVE0000000000201907",
            "tmsProviderProgramID": "EP011581290129",
            "tmsProviderProgramIDForSeries": "SH011581290000",
            "thePlatformMediaId": "546192963694",
            "ondemandStreamType": "FOD",
            "display_runtime": "55:00",
            "availableOutOfHome": false,
            "availableInHome": true,
            "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/abc.com::MOVE0000000000201907",
            "premium": false,
            "isAvailableOnISAVod": true,
            "isaVodProviderAssetId": "abc.com::MOVE0000000000201907",
            "tricks_mode": {
              "FASTFORWARD": [
                {
                  "start": 0,
                  "end": 3300
                }
              ]
            }
          },
          "network": {
            "callsign": "ABC",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "ABC",
            "product_provider": "PTOD:ABC_HD",
            "product_providers": [
              "PTOD:ABC_HD"
            ],
            "networkImageQueryParams": "providerId=ABC_HD&productId=PTOD"
          },
          "twcTvAvailable": true,
          "productProvider": "PTOD:ABC_HD",
          "entitled": true,
          "parentallyBlocked": false,
          "parentallyBlockedByChannel": false,
          "parentallyBlockedByRating": false,
          "watchList": false
        }
      ],
      "alsoAvailableStreamCategories": [
        {
          "type": "OD",
          "categories": [
            {
              "title": "On Demand",
              "rating": "TV-PG",
              "streamIndices": [
                0
              ]
            }
          ]
        }
      ],
      "defaultStreamOrderIndices": [
        0
      ],
      "title": "Shark Tank",
      "titleWithoutArticles": "Shark Tank",
      "seriesTitle": "Shark Tank",
      "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP011581290129?division=Online&lineup=0&profile=ovp&cacheID=6"
    },
    "commonSenseMediaV2": {
      "rating": 13
    },
    "metacritic": {
      "rating": 58
    },
    "allRatings": [
      "TV-PG"
    ]
  },
  "tmsSeriesId": 3560383,
  "tmsSeriesIdStr": "3560383",
  "image_uri": "https://services.timewarnercable.com/imageserver/series/3560383",
  "network": {
    "callsign": "ABC",
    "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
    "name": "ABC",
    "product_provider": "PTOD:ABC_HD",
    "product_providers": [
      "PTOD:ABC_HD"
    ],
    "networkImageQueryParams": "providerId=ABC_HD&productId=PTOD"
  },
  "nmd_series_uri": "https://services.timewarnercable.com/nmd/series/3560383",
  "seasons": [
    {
      "episodes": [
        {
          "type": "event",
          "eventType": "EPISODE",
          "alphaSortOn": "Shark Tank",
          "availableOutOfHome": false,
          "details": {
            "crew": [
              {
                "name": "Barbara Corcoran",
                "tmsPersonId": 547821,
                "role": "actor",
                "actorType": "Judge"
              },
              {
                "name": "Jeff Foxworthy",
                "tmsPersonId": 584,
                "role": "actor",
                "actorType": "Judge"
              },
              {
                "name": "Kevin Harrington",
                "tmsPersonId": 232714,
                "role": "actor",
                "actorType": "Judge"
              },
              {
                "name": "Robert Herjavec",
                "tmsPersonId": 531717,
                "role": "actor",
                "actorType": "Judge"
              }
            ],
            "episode_number": 3,
            "genres": [
              {
                "name": "Reality"
              }
            ],
            "long_desc": "Comic Jeff Foxworthy makes his debut as a guest Shark investor; actor Vincent Pastore pitches a business proposition; a flight attendant and her husband present their unique portable child's seat.",
            "programMetadata": {
              "EP011581290018": {
                "title": "Shark Tank",
                "longDescription": "Comic Jeff Foxworthy makes his debut as a guest Shark investor; actor Vincent Pastore pitches a business proposition; a flight attendant and her husband present their unique portable child's seat.",
                "shortDescription": "Comic Jeff Foxworthy makes his debut as a guest Shark investor; actor Vincent Pastore pitches a business proposition; a flight attendant and her husband present their unique portable child's seat."
              }
            },
            "original_air_date": "2011-04-08",
            "original_network_name": "",
            "season_number": 2,
            "short_desc": "Comic Jeff Foxworthy makes his debut as a guest Shark investor; actor Vincent Pastore pitches a business proposition; a flight attendant and her husband present their unique portable child's seat.",
            "year": 2011,
            "commonSenseMediaV2": {
              "rating": 13
            },
            "metacritic": {
              "rating": 58
            },
            "allRatings": [
              "TV-PG"
            ]
          },
          "tmsProgramIds": [
            "EP011581290018"
          ],
          "providerAssetIds": [
            "cnbc.com::NBCU2015101600002761"
          ],
          "image_uri": "https://services.timewarnercable.com/imageserver/program/EP011581290018",
          "network": {
            "callsign": "CNBC",
            "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
            "name": "CNBC",
            "product_provider": "NWOD:CNBC_HD",
            "product_providers": [
              "NWOD:CNBC_HD"
            ],
            "networkImageQueryParams": "providerId=CNBC_HD&productId=NWOD"
          },
          "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/EP011581290018",
          "streamList": [
            {
              "index": 0,
              "type": "ONLINE_ONDEMAND",
              "streamProperties": {
                "runtimeInSeconds": 3600,
                "rating": "TV-PG",
                "advisories": [

                ],
                "attributes": [
                  "HIGH_DEF",
                  "CLOSED_CAPTIONING"
                ],
                "drm_content_id": "NBCU2015101600002761",
                "startTime": "1445299200000",
                "endTime": "1445903999000",
                "price": 0.0,
                "hasPreview": false,
                "rentalWindowInHours": 24,
                "cancellationWindowInMinutes": 5,
                "providerAssetID": "cnbc.com::NBCU2015101600002761",
                "tmsProviderProgramID": "EP011581290018",
                "tmsProviderProgramIDForSeries": "SH011581290000",
                "thePlatformMediaId": "547914819622",
                "ondemandStreamType": "FOD",
                "display_runtime": "01:00:00",
                "availableOutOfHome": false,
                "availableInHome": true,
                "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/cnbc.com::NBCU2015101600002761",
                "premium": false,
                "isAvailableOnISAVod": true,
                "isaVodProviderAssetId": "cnbc.com::NBCU2015101600002761",
                "tricks_mode": {

                }
              },
              "network": {
                "callsign": "CNBC",
                "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
                "name": "CNBC",
                "product_provider": "NWOD:CNBC_HD",
                "product_providers": [
                  "NWOD:CNBC_HD"
                ],
                "networkImageQueryParams": "providerId=CNBC_HD&productId=NWOD"
              },
              "twcTvAvailable": true,
              "productProvider": "NWOD:CNBC_HD",
              "entitled": true,
              "parentallyBlocked": false,
              "parentallyBlockedByChannel": false,
              "parentallyBlockedByRating": false,
              "watchList": false
            }
          ],
          "alsoAvailableStreamCategories": [
            {
              "type": "OD",
              "categories": [
                {
                  "title": "On Demand",
                  "rating": "TV-PG",
                  "streamIndices": [
                    0
                  ]
                }
              ]
            }
          ],
          "defaultStreamOrderIndices": [
            0
          ],
          "title": "Shark Tank",
          "titleWithoutArticles": "Shark Tank",
          "seriesTitle": "Shark Tank",
          "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/tmsid/EP011581290018?division=Online&lineup=0&profile=ovp&cacheID=6"
        }
      ],
      "name": "Season 2",
      "number": 2
    }
  ],
  "title": "Shark Tank",
  "titleWithoutArticles": "Shark Tank",
  "uri": "/ipvs/api/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/3560383?division=Online&lineup=0&profile=ovp&cacheID=6",
  "watchListSeries": false
}

// 184481 with CDVR streams
// https://pi-sit-b.timewarnercable.com/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/184481?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1&displayOutOfHomeOnly=false&deviceOutOfHome=false&flickable=true&dvr=true&macaddress=10EA590215D3&rdvrVersion=2&watchLive=true&watchOnDemand=true&tuneToChannel=true&cdvrDeviceId=YY00C0747364&cdvrEnabled=true&tvodRent=true&tvodWatch=true
mockData.nnsSeriesData184481 = {
	"type": "episode_list",
	"alphaSortOn": "PJs",
	"availableOutOfHome": false,
	"linearAvailableOutOfHome": false,
	"vodAvailableOutOfHome": false,
	"tvodAvailableOutOfHome": false,
	"vodOutOfWindow": true,
	"details": {
		"crew": [{
			"name": "Eddie Murphy",
			"character": "Thurgoode Orenthal Stubbs",
			"tmsPersonId": 1227,
			"role": "actor",
			"actorType": "Voice"
		}, {
			"name": "Loretta Devine",
			"character": "Muriel Stubbs",
			"tmsPersonId": 72587,
			"role": "actor",
			"actorType": "Voice"
		}, {
			"name": "James Black",
			"character": "Tarnell",
			"tmsPersonId": 68427,
			"role": "actor",
			"actorType": "Voice"
		}, {
			"name": "Michael Paul Chan",
			"character": "Jimmy Ho",
			"tmsPersonId": 45659,
			"role": "actor",
			"actorType": "Voice"
		}],
		"genres": [{
			"name": "Animated"
		}, {
			"name": "Animation"
		}, {
			"name": "Comedy"
		}],
		"long_desc": "Animated series looks at life in a big-city housing project.",
		"num_assets": 27,
		"totalEpisodes": 27,
		"originalAirDateMillis": 915926400000,
		"short_desc": "Animated series looks at life in a big-city housing project.",
		"latest_episode": {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "National Buffoon's European Vacation",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "James Black",
					"tmsPersonId": 68427,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Michael Paul Chan",
					"tmsPersonId": 45659,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "John Logue",
					"tmsPersonId": 198652,
					"role": "director"
				}],
				"episode_number": 4,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine.",
				"programMetadata": {
					"EP002971100040": {
						"title": "National Buffoon's European Vacation",
						"longDescription": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine.",
						"shortDescription": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine."
					}
				},
				"original_air_date": "2001-02-11",
				"original_network_name": "",
				"season_number": 3,
				"short_desc": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine.",
				"year": 2001,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100040",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100040"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100040",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100040",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472999400000",
					"startTimeString": "2016-09-04T08:30:00.000-06:00",
					"endTime": "1473001200000",
					"endTimeString": "2016-09-04T09:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100040",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"rdvrRecording": {
						"recordingState": "scheduled",
						"recordSeries": false,
						"conflicted": false,
						"settings": {
							"deleteWhenSpaceIsNeeded": true,
							"numEpisodesToKeep": 1,
							"priority": "MAX",
							"recordOnlyAtThisAirTime": false,
							"recordOnlyNewEpisodes": false,
							"startAdjustMinutes": 0,
							"stopAdjustMinutes": 0
						}
					},
					"cdvrRecording": {
						"cdvrState": "scheduled",
						"recordingId": "59116_1472999400_1473001200-EP002971100040",
						"tmsProgramId": "EP002971100040",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1472999400,
						"stopTimeSec": 1473001200,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1472999400_1473001200-EP002971100040",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1472999400_1473001200-EP002971100040"
					},
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100040"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1473060600000",
					"startTimeString": "2016-09-05T01:30:00.000-06:00",
					"endTime": "1473062400000",
					"endTimeString": "2016-09-05T02:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100040",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100040"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "editRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrCancelRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "National Buffoon's European Vacation",
			"titleWithoutArticles": "National Buffoon's European Vacation",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100040?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		},
		"allRatings": ["TV-14", "TV-PG"],
		"allVPPs": [],
		"allIpVPPs": [],
		"seriesRecording": true,
		"entitled": true,
		"tvodEntitled": false,
		"linearEntitledIp": true,
		"linearEntitledQam": true,
		"staleDvrCache": false
	},
	"tmsSeriesId": 184481,
	"tmsSeriesIdStr": "184481",
	"tmsGuideServiceIds": [59116],
	"ipTmsGuideServiceIds": [59116],
	"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/series/184481",
	"network": {
		"callsign": "FUSEHD",
		"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
		"name": "FUSEHD",
		"networkImageQueryParams": "network=FUSEHD"
	},
	"nmd_series_uri": "https://pi-sit-b.timewarnercable.com/nmd/series/184481",
	"actionGroups": {
		"defaultGroup": {
			"actionObjects": [{
				"actionType": "cdvrCancelSeriesRecording"
			}]
		}
	},
	"seasons": [{
		"episodes": [{
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "National Buffoon's European Vacation",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "James Black",
					"tmsPersonId": 68427,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Michael Paul Chan",
					"tmsPersonId": 45659,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "John Logue",
					"tmsPersonId": 198652,
					"role": "director"
				}],
				"episode_number": 4,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine.",
				"programMetadata": {
					"EP002971100040": {
						"title": "National Buffoon's European Vacation",
						"longDescription": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine.",
						"shortDescription": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine."
					}
				},
				"original_air_date": "2001-02-11",
				"original_network_name": "",
				"season_number": 3,
				"short_desc": "Thurgood takes credit for the gifts bestowed on Muriel by a secret admirer. Voices of Eddie Murphy, Michele Morgan and Loretta Devine.",
				"year": 2001,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100040",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100040"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100040",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100040",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472999400000",
					"startTimeString": "2016-09-04T08:30:00.000-06:00",
					"endTime": "1473001200000",
					"endTimeString": "2016-09-04T09:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100040",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"rdvrRecording": {
						"recordingState": "scheduled",
						"recordSeries": false,
						"conflicted": false,
						"settings": {
							"deleteWhenSpaceIsNeeded": true,
							"numEpisodesToKeep": 1,
							"priority": "MAX",
							"recordOnlyAtThisAirTime": false,
							"recordOnlyNewEpisodes": false,
							"startAdjustMinutes": 0,
							"stopAdjustMinutes": 0
						}
					},
					"cdvrRecording": {
						"cdvrState": "scheduled",
						"recordingId": "59116_1472999400_1473001200-EP002971100040",
						"tmsProgramId": "EP002971100040",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1472999400,
						"stopTimeSec": 1473001200,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1472999400_1473001200-EP002971100040",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1472999400_1473001200-EP002971100040"
					},
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100040"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1473060600000",
					"startTimeString": "2016-09-05T01:30:00.000-06:00",
					"endTime": "1473062400000",
					"endTimeString": "2016-09-05T02:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100040",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100040"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "editRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrCancelRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "National Buffoon's European Vacation",
			"titleWithoutArticles": "National Buffoon's European Vacation",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100040?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Smoke Gets in Your High-Rise",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "James Black",
					"tmsPersonId": 68427,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Michael Paul Chan",
					"tmsPersonId": 45659,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Paul Harrod",
					"tmsPersonId": 210599,
					"role": "director"
				}],
				"episode_number": 3,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood makes a deal to place a cigarette advertisement on the side of the Hilton-Jacobs building in exchange for free air-conditioning.",
				"programMetadata": {
					"EP002971100039": {
						"title": "Smoke Gets in Your High-Rise",
						"longDescription": "Thurgood makes a deal to place a cigarette advertisement on the side of the Hilton-Jacobs building in exchange for free air-conditioning.",
						"shortDescription": "Thurgood makes a deal to place a cigarette advertisement on the side of the Hilton-Jacobs building in exchange for free air-conditioning."
					}
				},
				"original_air_date": "2001-02-04",
				"original_network_name": "",
				"season_number": 3,
				"short_desc": "Thurgood makes a deal to place a cigarette advertisement on the side of the Hilton-Jacobs building in exchange for free air-conditioning.",
				"year": 2001,
				"allRatings": [],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100039",
				"entitled": false,
				"tvodEntitled": false,
				"linearEntitledIp": false,
				"linearEntitledQam": false,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100039"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [],
			"ipTmsGuideServiceIds": [],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100039",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "Fuse",
				"networkImageQueryParams": "network=Fuse"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100039",
			"streamList": [{
				"index": 0,
				"type": "CDVR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"startTime": "1471397400000",
					"startTimeString": "2016-08-16T19:30:00.000-06:00",
					"endTime": "1471397400000",
					"endTimeString": "2016-08-16T19:30:00.000-06:00",
					"programStartTime": 1471397400000,
					"display_runtime": "30:00",
					"parentSeriesId": "184481",
					"cdvrRecording": {
						"cdvrState": "completed",
						"recordingId": "59116_1471397400_1471399200-EP002971100039",
						"tmsProgramId": "EP002971100039",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1471397400,
						"stopTimeSec": 1471399200,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1471397400_1471399200-EP002971100039",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1471397400_1471399200-EP002971100039"
					},
                    "bookmark": {
                        "playMarkerSeconds": 793,
                        "runtimeSeconds": 1800,
                        "complete": false,
                        "hidden": false,
                        "lastWatchedUtcSeconds": 0
                    },
					"entitled": false
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "Fuse",
					"networkImageQueryParams": "network=Fuse"
				},
				"defaultStream": true
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "cdvrResumeRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrDeleteRecording",
						"streamIndex": 0
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": []
				}, {
					"title": "Watch On TV",
					"actionObjects": []
				}]
			},
			"title": "Smoke Gets in Your High-Rise",
			"titleWithoutArticles": "Smoke Gets in Your High-Rise",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100039?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Boyz Under the Hood",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 1,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Juicy turns out to be a talented mechanic when Thurgood and the guys decide to overhaul a broken-down old car.",
				"programMetadata": {
					"EP002971100031": {
						"title": "Boyz Under the Hood",
						"longDescription": "Juicy turns out to be a talented mechanic when Thurgood and the guys decide to overhaul a broken-down old car.",
						"shortDescription": "Juicy turns out to be a talented mechanic when Thurgood and the guys decide to overhaul a broken-down old car."
					}
				},
				"original_air_date": "2000-10-08",
				"original_network_name": "",
				"season_number": 3,
				"short_desc": "Juicy turns out to be a talented mechanic when Thurgood and the guys decide to overhaul a broken-down old car.",
				"year": 2000,
				"allRatings": ["TV-14", "TV-PG"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100031",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100031"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100031",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100031",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472886000000",
					"startTimeString": "2016-09-03T01:00:00.000-06:00",
					"endTime": "1472887800000",
					"endTimeString": "2016-09-03T01:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100031",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"cdvrRecording": {
						"cdvrState": "scheduled",
						"recordingId": "59116_1472886000_1472887800-EP002971100031",
						"tmsProgramId": "EP002971100031",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1472886000,
						"stopTimeSec": 1472887800,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1472886000_1472887800-EP002971100031",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1472886000_1472887800-EP002971100031"
					},
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100031"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-PG",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472909400000",
					"startTimeString": "2016-09-03T07:30:00.000-06:00",
					"endTime": "1472911200000",
					"endTimeString": "2016-09-03T08:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100031",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100031"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrCancelRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Boyz Under the Hood",
			"titleWithoutArticles": "Boyz Under the Hood",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100031?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}],
		"name": "Season 3",
		"number": 3
	}, {
		"episodes": [{
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Last Affirmative Action Hero",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "James Black",
					"tmsPersonId": 68427,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Michael Paul Chan",
					"tmsPersonId": 45659,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 16,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood offers up his expertise when Jackie Chan comes to the projects to shoot a movie. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and others.",
				"programMetadata": {
					"EP002971100033": {
						"title": "The Last Affirmative Action Hero",
						"longDescription": "Thurgood offers up his expertise when Jackie Chan comes to the projects to shoot a movie. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and others.",
						"shortDescription": "Thurgood offers up his expertise when Jackie Chan comes to the projects to shoot a movie. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and others."
					}
				},
				"original_air_date": "2000-08-29",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood offers up his expertise when Jackie Chan comes to the projects to shoot a movie. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and others.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100033",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100033"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100033",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100033",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472799600000",
					"startTimeString": "2016-09-02T01:00:00.000-06:00",
					"endTime": "1472801400000",
					"endTimeString": "2016-09-02T01:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100033",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100033"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472837400000",
					"startTimeString": "2016-09-02T11:30:00.000-06:00",
					"endTime": "1472839200000",
					"endTimeString": "2016-09-02T12:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100033",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100033"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "The Last Affirmative Action Hero",
			"titleWithoutArticles": "Last Affirmative Action Hero",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100033?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Cliffhangin' With Mr. Super",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 15,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood and Bebe wake up in the same bed together after a night of hard drinking. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and Jenifer Lewis.",
				"programMetadata": {
					"EP002971100032": {
						"title": "Cliffhangin' With Mr. Super",
						"longDescription": "Thurgood and Bebe wake up in the same bed together after a night of hard drinking. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and Jenifer Lewis.",
						"shortDescription": "Thurgood and Bebe wake up in the same bed together after a night of hard drinking. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and Jenifer Lewis."
					}
				},
				"original_air_date": "2000-08-15",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood and Bebe wake up in the same bed together after a night of hard drinking. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales, Michele Morgan and Jenifer Lewis.",
				"year": 2000,
				"allRatings": [],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100032",
				"entitled": false,
				"tvodEntitled": false,
				"linearEntitledIp": false,
				"linearEntitledQam": false,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100032"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [],
			"ipTmsGuideServiceIds": [],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100032",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "Fuse",
				"networkImageQueryParams": "network=Fuse"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100032",
			"streamList": [{
				"index": 0,
				"type": "CDVR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"startTime": "1471395600000",
					"startTimeString": "2016-08-16T19:00:00.000-06:00",
					"endTime": "1471395600000",
					"endTimeString": "2016-08-16T19:00:00.000-06:00",
					"programStartTime": 1471395600000,
					"display_runtime": "30:00",
					"parentSeriesId": "184481",
					"cdvrRecording": {
						"cdvrState": "completed",
						"recordingId": "59116_1471395600_1471397400-EP002971100032",
						"tmsProgramId": "EP002971100032",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1471395600,
						"stopTimeSec": 1471397400,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1471395600_1471397400-EP002971100032",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1471395600_1471397400-EP002971100032"
					},
					"entitled": false
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "Fuse",
					"networkImageQueryParams": "network=Fuse"
				},
				"defaultStream": true
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "cdvrPlayRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrDeleteRecording",
						"streamIndex": 0
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": []
				}, {
					"title": "Watch On TV",
					"actionObjects": []
				}]
			},
			"title": "Cliffhangin' With Mr. Super",
			"titleWithoutArticles": "Cliffhangin' With Mr. Super",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100032?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Jeffersons",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 13,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood claims kinship with Sally Hemings and President Thomas Jefferson. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Crystal Scales.",
				"programMetadata": {
					"EP002971100029": {
						"title": "The Jeffersons",
						"longDescription": "Thurgood claims kinship with Sally Hemings and President Thomas Jefferson. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Crystal Scales.",
						"shortDescription": "Thurgood claims kinship with Sally Hemings and President Thomas Jefferson. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Crystal Scales."
					}
				},
				"original_air_date": "2000-07-25",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood claims kinship with Sally Hemings and President Thomas Jefferson. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Crystal Scales.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100029",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100029"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100029",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100029",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472389200000",
					"startTimeString": "2016-08-28T07:00:00.000-06:00",
					"endTime": "1472391000000",
					"endTimeString": "2016-08-28T07:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100029",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"cdvrRecording": {
						"cdvrState": "scheduled",
						"recordingId": "59116_1472389200_1472391000-EP002971100029",
						"tmsProgramId": "EP002971100029",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1472389200,
						"stopTimeSec": 1472391000,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1472389200_1472391000-EP002971100029",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1472389200_1472391000-EP002971100029"
					},
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100029"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472455800000",
					"startTimeString": "2016-08-29T01:30:00.000-06:00",
					"endTime": "1472457600000",
					"endTimeString": "2016-08-29T02:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100029",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"cdvrRecording": {
						"cdvrState": "scheduled",
						"recordingId": "59116_1472455800_1472457600-EP002971100029",
						"tmsProgramId": "EP002971100029",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1472455800,
						"stopTimeSec": 1472457600,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1472455800_1472457600-EP002971100029",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1472455800_1472457600-EP002971100029"
					},
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100029"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrCancelRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrCancelRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "The Jeffersons",
			"titleWithoutArticles": "Jeffersons",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100029?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "What's Eating Juicy Hudson?",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 12,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "When Juicy stops doing errands for his shut-in parents, Papa Hudson hazards a trip into the outside world.",
				"programMetadata": {
					"EP002971100028": {
						"title": "What's Eating Juicy Hudson?",
						"longDescription": "When Juicy stops doing errands for his shut-in parents, Papa Hudson hazards a trip into the outside world.",
						"shortDescription": "When Juicy stops doing errands for his shut-in parents, Papa Hudson hazards a trip into the outside world."
					}
				},
				"original_air_date": "2000-07-18",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "When Juicy stops doing errands for his shut-in parents, Papa Hudson hazards a trip into the outside world.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100028",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100028"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100028",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100028",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472801400000",
					"startTimeString": "2016-09-02T01:30:00.000-06:00",
					"endTime": "1472803200000",
					"endTimeString": "2016-09-02T02:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100028",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100028"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472839200000",
					"startTimeString": "2016-09-02T12:00:00.000-06:00",
					"endTime": "1472841000000",
					"endTimeString": "2016-09-02T12:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100028",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100028"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "What's Eating Juicy Hudson?",
			"titleWithoutArticles": "What's Eating Juicy Hudson?",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100028?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Ghetto Superstars",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 11,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood vows to turn Calvin and Juicy into rap stars. Voices of Eddie Murphy, Loretta Devine and Ja'net DuBois. Guest voice: Snoop Dogg.",
				"programMetadata": {
					"EP002971100024": {
						"title": "Ghetto Superstars",
						"longDescription": "Thurgood vows to turn Calvin and Juicy into rap stars. Voices of Eddie Murphy, Loretta Devine and Ja'net DuBois. Guest voice: Snoop Dogg.",
						"shortDescription": "Thurgood vows to turn Calvin and Juicy into rap stars. Voices of Eddie Murphy, Loretta Devine and Ja'net DuBois. Guest voice: Snoop Dogg."
					}
				},
				"original_air_date": "2000-07-11",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood vows to turn Calvin and Juicy into rap stars. Voices of Eddie Murphy, Loretta Devine and Ja'net DuBois. Guest voice: Snoop Dogg.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100024",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100024"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100024",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "Fuse",
				"networkImageQueryParams": "network=Fuse"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100024",
			"streamList": [{
				"index": 0,
				"type": "CDVR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"startTime": "1471789800000",
					"startTimeString": "2016-08-21T08:30:00.000-06:00",
					"endTime": "1471789800000",
					"endTimeString": "2016-08-21T08:30:00.000-06:00",
					"programStartTime": 1471789800000,
					"display_runtime": "30:00",
					"parentSeriesId": "184481",
					"cdvrRecording": {
						"cdvrState": "completed",
						"recordingId": "59116_1471789800_1471791600-EP002971100024",
						"tmsProgramId": "EP002971100024",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1471789800,
						"stopTimeSec": 1471791600,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1471789800_1471791600-EP002971100024",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1471789800_1471791600-EP002971100024"
					},
					"entitled": false
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "Fuse",
					"networkImageQueryParams": "network=Fuse"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "CDVR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"startTime": "1471849200000",
					"startTimeString": "2016-08-22T01:00:00.000-06:00",
					"endTime": "1471849200000",
					"endTimeString": "2016-08-22T01:00:00.000-06:00",
					"programStartTime": 1471849200000,
					"display_runtime": "30:00",
					"parentSeriesId": "184481",
					"cdvrRecording": {
						"cdvrState": "completed",
						"recordingId": "59116_1471849200_1471851000-EP002971100024",
						"tmsProgramId": "EP002971100024",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1471849200,
						"stopTimeSec": 1471851000,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1471849200_1471851000-EP002971100024",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1471849200_1471851000-EP002971100024"
					},
					"entitled": false
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "Fuse",
					"networkImageQueryParams": "network=Fuse"
				},
				"defaultStream": false
			}, {
				"index": 2,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472794200000",
					"startTimeString": "2016-09-01T23:30:00.000-06:00",
					"endTime": "1472796000000",
					"endTimeString": "2016-09-02T00:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100024",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100024"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 3,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472832000000",
					"startTimeString": "2016-09-02T10:00:00.000-06:00",
					"endTime": "1472833800000",
					"endTimeString": "2016-09-02T10:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100024",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100024"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "cdvrPlayRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrDeleteRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrPlayRecording",
						"streamIndex": 1
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 3
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 3
					}]
				}]
			},
			"title": "Ghetto Superstars",
			"titleWithoutArticles": "Ghetto Superstars",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100024?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Fear of a Black Rat",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 10,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood traps a rat in the building and enters him into the local rat fights run by promoter Don King.",
				"programMetadata": {
					"EP002971100027": {
						"title": "Fear of a Black Rat",
						"longDescription": "Thurgood traps a rat in the building and enters him into the local rat fights run by promoter Don King.",
						"shortDescription": "Thurgood traps a rat in the building and enters him into the local rat fights run by promoter Don King."
					}
				},
				"original_air_date": "2000-07-11",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood traps a rat in the building and enters him into the local rat fights run by promoter Don King.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100027",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100027"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100027",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100027",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472797800000",
					"startTimeString": "2016-09-02T00:30:00.000-06:00",
					"endTime": "1472799600000",
					"endTimeString": "2016-09-02T01:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100027",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100027"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472835600000",
					"startTimeString": "2016-09-02T11:00:00.000-06:00",
					"endTime": "1472837400000",
					"endTimeString": "2016-09-02T11:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100027",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100027"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Fear of a Black Rat",
			"titleWithoutArticles": "Fear of a Black Rat",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100027?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Who Da Boss",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Stephen Maclean",
					"tmsPersonId": 327611,
					"role": "director"
				}],
				"episode_number": 9,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood must answer to Muriel about the building's shortcomings after she becomes a H.U.D.-appointed supervisor.",
				"programMetadata": {
					"EP002971100025": {
						"title": "Who Da Boss",
						"longDescription": "Thurgood must answer to Muriel about the building's shortcomings after she becomes a H.U.D.-appointed supervisor.",
						"shortDescription": "Thurgood must answer to Muriel about the building's shortcomings after she becomes a H.U.D.-appointed supervisor."
					}
				},
				"original_air_date": "2000-07-04",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood must answer to Muriel about the building's shortcomings after she becomes a H.U.D.-appointed supervisor.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100025",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100025"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100025",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100025",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472796000000",
					"startTimeString": "2016-09-02T00:00:00.000-06:00",
					"endTime": "1472797800000",
					"endTimeString": "2016-09-02T00:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100025",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100025"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472833800000",
					"startTimeString": "2016-09-02T10:30:00.000-06:00",
					"endTime": "1472835600000",
					"endTimeString": "2016-09-02T11:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100025",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100025"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Who Da Boss",
			"titleWithoutArticles": "Who Da Boss",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100025?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Let's Get Ready to Crumble",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "William X. Jarcho",
					"tmsPersonId": 206626,
					"role": "director"
				}],
				"episode_number": 8,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood divulges that he was once a professional wrestler with a grudge against wrestler Deke \"The Physique\" Van Owen.",
				"programMetadata": {
					"EP002971100026": {
						"title": "Let's Get Ready to Crumble",
						"longDescription": "Thurgood divulges that he was once a professional wrestler with a grudge against wrestler Deke \"The Physique\" Van Owen.",
						"shortDescription": "Thurgood divulges that he was once a professional wrestler with a grudge against wrestler Deke \"The Physique\" Van Owen."
					}
				},
				"original_air_date": "2000-07-04",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood divulges that he was once a professional wrestler with a grudge against wrestler Deke \"The Physique\" Van Owen.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100026",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100026"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100026",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100026",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472884200000",
					"startTimeString": "2016-09-03T00:30:00.000-06:00",
					"endTime": "1472886000000",
					"endTimeString": "2016-09-03T01:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100026",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100026"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472907600000",
					"startTimeString": "2016-09-03T07:00:00.000-06:00",
					"endTime": "1472909400000",
					"endTimeString": "2016-09-03T07:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100026",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100026"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 2,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472997600000",
					"startTimeString": "2016-09-04T08:00:00.000-06:00",
					"endTime": "1472999400000",
					"endTimeString": "2016-09-04T08:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100026",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100026"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 3,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1473058800000",
					"startTimeString": "2016-09-05T01:00:00.000-06:00",
					"endTime": "1473060600000",
					"endTimeString": "2016-09-05T01:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100026",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100026"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 3
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 3
					}]
				}]
			},
			"title": "Let's Get Ready to Crumble",
			"titleWithoutArticles": "Let's Get Ready to Crumble",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100026?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Weave's Have a Dream",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 7,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "When Muriel and her sister Bebe start a hair salon, their competitive spirit degenerates into cattiness.",
				"programMetadata": {
					"EP002971100021": {
						"title": "Weave's Have a Dream",
						"longDescription": "When Muriel and her sister Bebe start a hair salon, their competitive spirit degenerates into cattiness.",
						"shortDescription": "When Muriel and her sister Bebe start a hair salon, their competitive spirit degenerates into cattiness."
					}
				},
				"original_air_date": "2000-06-27",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "When Muriel and her sister Bebe start a hair salon, their competitive spirit degenerates into cattiness.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100021",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100021"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100021",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100021",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472718600000",
					"startTimeString": "2016-09-01T02:30:00.000-06:00",
					"endTime": "1472720400000",
					"endTimeString": "2016-09-01T03:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100021",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100021"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472761800000",
					"startTimeString": "2016-09-01T14:30:00.000-06:00",
					"endTime": "1472763600000",
					"endTimeString": "2016-09-01T15:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100021",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100021"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Weave's Have a Dream",
			"titleWithoutArticles": "Weave's Have a Dream",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100021?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Smokey the Squatter",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 6,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood plots to get rid of Smokey, who is squatting in one of the building's spare apartments. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Shawn Michael Howard.",
				"programMetadata": {
					"EP002971100020": {
						"title": "Smokey the Squatter",
						"longDescription": "Thurgood plots to get rid of Smokey, who is squatting in one of the building's spare apartments. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Shawn Michael Howard.",
						"shortDescription": "Thurgood plots to get rid of Smokey, who is squatting in one of the building's spare apartments. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Shawn Michael Howard."
					}
				},
				"original_air_date": "2000-06-27",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood plots to get rid of Smokey, who is squatting in one of the building's spare apartments. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois and Shawn Michael Howard.",
				"year": 2000,
				"allRatings": ["TV-14", "TV-PG"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100020",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100020"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100020",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100020",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-PG",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472716800000",
					"startTimeString": "2016-09-01T02:00:00.000-06:00",
					"endTime": "1472718600000",
					"endTimeString": "2016-09-01T02:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100020",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100020"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472760000000",
					"startTimeString": "2016-09-01T14:00:00.000-06:00",
					"endTime": "1472761800000",
					"endTimeString": "2016-09-01T14:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100020",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100020"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Smokey the Squatter",
			"titleWithoutArticles": "Smokey the Squatter",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100020?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Haiti and the Tramp",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 5,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Afraid of losing his best friend, Thurgood tries to break up the burgeoning relationship between Walter and Haiti Lady.",
				"programMetadata": {
					"EP002971100019": {
						"title": "Haiti and the Tramp",
						"longDescription": "Afraid of losing his best friend, Thurgood tries to break up the burgeoning relationship between Walter and Haiti Lady.",
						"shortDescription": "Afraid of losing his best friend, Thurgood tries to break up the burgeoning relationship between Walter and Haiti Lady."
					}
				},
				"original_air_date": "2000-06-13",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Afraid of losing his best friend, Thurgood tries to break up the burgeoning relationship between Walter and Haiti Lady.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100019",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100019"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100019",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "Fuse",
				"networkImageQueryParams": "network=Fuse"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100019",
			"streamList": [{
				"index": 0,
				"type": "CDVR",
				"streamProperties": {
					"runtimeInSeconds": 1140,
					"startTime": "1471473660000",
					"startTimeString": "2016-08-17T16:41:00.000-06:00",
					"endTime": "1471473660000",
					"endTimeString": "2016-08-17T16:41:00.000-06:00",
					"programStartTime": 1471473660000,
					"display_runtime": "19:00",
					"parentSeriesId": "184481",
					"cdvrRecording": {
						"cdvrState": "completed",
						"recordingId": "59116_1471473642_1471474800-EP002971100019",
						"tmsProgramId": "EP002971100019",
						"tmsSeriesId": "184481",
						"tmsGuideId": "59116",
						"startTimeSec": 1471473660,
						"stopTimeSec": 1471474800,
						"deleteUrl": "/ipvs/api/smarttv/cdvr/v1/programs/59116_1471473642_1471474800-EP002971100019",
						"playUrl": "/ipvs/api/smarttv/stream/cdvr/v1/59116_1471473642_1471474800-EP002971100019"
					},
					"entitled": false
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "Fuse",
					"networkImageQueryParams": "network=Fuse"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472392800000",
					"startTimeString": "2016-08-28T08:00:00.000-06:00",
					"endTime": "1472394600000",
					"endTimeString": "2016-08-28T08:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100019",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100019"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 2,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472459400000",
					"startTimeString": "2016-08-29T02:30:00.000-06:00",
					"endTime": "1472461200000",
					"endTimeString": "2016-08-29T03:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100019",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100019"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "cdvrPlayRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrDeleteRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 2
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 2
					}]
				}]
			},
			"title": "Haiti and the Tramp",
			"titleWithoutArticles": "Haiti and the Tramp",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100019?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "HJs",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 4,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood (voice of Eddie Murphy) and the residents resurrect an abandoned radio station and wind up with a hit show.",
				"programMetadata": {
					"EP002971100018": {
						"title": "The HJs",
						"longDescription": "Thurgood (voice of Eddie Murphy) and the residents resurrect an abandoned radio station and wind up with a hit show.",
						"shortDescription": "Thurgood (voice of Eddie Murphy) and the residents resurrect an abandoned radio station and wind up with a hit show."
					}
				},
				"original_air_date": "2000-06-13",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Thurgood (voice of Eddie Murphy) and the residents resurrect an abandoned radio station and wind up with a hit show.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100018",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100018"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100018",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100018",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472713200000",
					"startTimeString": "2016-09-01T01:00:00.000-06:00",
					"endTime": "1472715000000",
					"endTimeString": "2016-09-01T01:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100018",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100018"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472756400000",
					"startTimeString": "2016-09-01T13:00:00.000-06:00",
					"endTime": "1472758200000",
					"endTimeString": "2016-09-01T13:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100018",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100018"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "The HJs",
			"titleWithoutArticles": "HJs",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100018?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Preacher's Wife",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 3,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Shocked while fixing wiring at the church, Thurgood (voice of Eddie Murphy) is electrified into trying to be a preacher.",
				"programMetadata": {
					"EP002971100016": {
						"title": "The Preacher's Wife",
						"longDescription": "Shocked while fixing wiring at the church, Thurgood (voice of Eddie Murphy) is electrified into trying to be a preacher.",
						"shortDescription": "Shocked while fixing wiring at the church, Thurgood (voice of Eddie Murphy) is electrified into trying to be a preacher."
					}
				},
				"original_air_date": "2000-06-06",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Shocked while fixing wiring at the church, Thurgood (voice of Eddie Murphy) is electrified into trying to be a preacher.",
				"year": 2000,
				"allRatings": ["TV-14", "TV-PG"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100016",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100016"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100016",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100016",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-PG",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472715000000",
					"startTimeString": "2016-09-01T01:30:00.000-06:00",
					"endTime": "1472716800000",
					"endTimeString": "2016-09-01T02:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100016",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100016"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472758200000",
					"startTimeString": "2016-09-01T13:30:00.000-06:00",
					"endTime": "1472760000000",
					"endTimeString": "2016-09-01T14:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100016",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100016"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "The Preacher's Wife",
			"titleWithoutArticles": "Preacher's Wife",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100016?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Home School Daze",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 1,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Lacking a high-school diploma, Thurgood takes classes when the tenants home-school children during a teachers' strike.",
				"programMetadata": {
					"EP002971100015": {
						"title": "Home School Daze",
						"longDescription": "Lacking a high-school diploma, Thurgood takes classes when the tenants home-school children during a teachers' strike.",
						"shortDescription": "Lacking a high-school diploma, Thurgood takes classes when the tenants home-school children during a teachers' strike."
					}
				},
				"original_air_date": "2000-05-30",
				"original_network_name": "",
				"season_number": 2,
				"short_desc": "Lacking a high-school diploma, Thurgood takes classes when the tenants home-school children during a teachers' strike.",
				"year": 2000,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100015",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100015"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100015",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100015",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472391000000",
					"startTimeString": "2016-08-28T07:30:00.000-06:00",
					"endTime": "1472392800000",
					"endTimeString": "2016-08-28T08:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100015",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100015"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472457600000",
					"startTimeString": "2016-08-29T02:00:00.000-06:00",
					"endTime": "1472459400000",
					"endTimeString": "2016-08-29T02:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100015",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100015"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Home School Daze",
			"titleWithoutArticles": "Home School Daze",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100015?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}],
		"name": "Season 2",
		"number": 2
	}, {
		"episodes": [{
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Haiti Sings the Blues",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 13,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "After Thurgood and Haiti Lady get into a spat, she puts a curse on him, and he must beg her forgiveness.",
				"programMetadata": {
					"EP002971100014": {
						"title": "Haiti Sings the Blues",
						"longDescription": "After Thurgood and Haiti Lady get into a spat, she puts a curse on him, and he must beg her forgiveness.",
						"shortDescription": "After Thurgood and Haiti Lady get into a spat, she puts a curse on him, and he must beg her forgiveness."
					}
				},
				"original_air_date": "1999-05-18",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "After Thurgood and Haiti Lady get into a spat, she puts a curse on him, and he must beg her forgiveness.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100014",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100014"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100014",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100014",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472000400000",
					"startTimeString": "2016-08-23T19:00:00.000-06:00",
					"endTime": "1472002200000",
					"endTimeString": "2016-08-23T19:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100014",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100014"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472072400000",
					"startTimeString": "2016-08-24T15:00:00.000-06:00",
					"endTime": "1472074200000",
					"endTimeString": "2016-08-24T15:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100014",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100014"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Haiti Sings the Blues",
			"titleWithoutArticles": "Haiti Sings the Blues",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100014?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "House Potty",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 12,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood feels old and outdated when his plan to install space-age toilets in the building blows up in his face.",
				"programMetadata": {
					"EP002971100013": {
						"title": "House Potty",
						"longDescription": "Thurgood feels old and outdated when his plan to install space-age toilets in the building blows up in his face.",
						"shortDescription": "Thurgood feels old and outdated when his plan to install space-age toilets in the building blows up in his face."
					}
				},
				"original_air_date": "1999-05-11",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "Thurgood feels old and outdated when his plan to install space-age toilets in the building blows up in his face.",
				"year": 1999,
				"allRatings": ["TV-14", "TV-PG"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100013",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100013"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100013",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100013",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472281200000",
					"startTimeString": "2016-08-27T01:00:00.000-06:00",
					"endTime": "1472283000000",
					"endTimeString": "2016-08-27T01:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100013",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100013"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472311800000",
					"startTimeString": "2016-08-27T09:30:00.000-06:00",
					"endTime": "1472313600000",
					"endTimeString": "2016-08-27T10:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100013",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100013"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 2,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472607000000",
					"startTimeString": "2016-08-30T19:30:00.000-06:00",
					"endTime": "1472608800000",
					"endTimeString": "2016-08-30T20:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100013",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100013"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 3,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-PG",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472628600000",
					"startTimeString": "2016-08-31T01:30:00.000-06:00",
					"endTime": "1472630400000",
					"endTimeString": "2016-08-31T02:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100013",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100013"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 3
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 3
					}]
				}]
			},
			"title": "House Potty",
			"titleWithoutArticles": "House Potty",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100013?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "U Go Kart",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 11,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood remains closemouthed when Calvin and Juicy's go-cart mysteriously disappears. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"programMetadata": {
					"EP002971100012": {
						"title": "U Go Kart",
						"longDescription": "Thurgood remains closemouthed when Calvin and Juicy's go-cart mysteriously disappears. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
						"shortDescription": "Thurgood remains closemouthed when Calvin and Juicy's go-cart mysteriously disappears. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan."
					}
				},
				"original_air_date": "1999-05-04",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "Thurgood remains closemouthed when Calvin and Juicy's go-cart mysteriously disappears. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100012",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100012"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100012",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100012",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472279400000",
					"startTimeString": "2016-08-27T00:30:00.000-06:00",
					"endTime": "1472281200000",
					"endTimeString": "2016-08-27T01:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100012",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100012"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472310000000",
					"startTimeString": "2016-08-27T09:00:00.000-06:00",
					"endTime": "1472311800000",
					"endTimeString": "2016-08-27T09:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100012",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100012"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 2,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472605200000",
					"startTimeString": "2016-08-30T19:00:00.000-06:00",
					"endTime": "1472607000000",
					"endTimeString": "2016-08-30T19:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100012",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100012"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 3,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472626800000",
					"startTimeString": "2016-08-31T01:00:00.000-06:00",
					"endTime": "1472628600000",
					"endTimeString": "2016-08-31T01:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100012",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100012"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 3
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 3
					}]
				}]
			},
			"title": "U Go Kart",
			"titleWithoutArticles": "U Go Kart",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100012?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Operation Gumbo Drop",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 10,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood and Juicy compete for a Grill Master 3000 in a barbecue contest. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"programMetadata": {
					"EP002971100010": {
						"title": "Operation Gumbo Drop",
						"longDescription": "Thurgood and Juicy compete for a Grill Master 3000 in a barbecue contest. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
						"shortDescription": "Thurgood and Juicy compete for a Grill Master 3000 in a barbecue contest. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan."
					}
				},
				"original_air_date": "1999-04-13",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "Thurgood and Juicy compete for a Grill Master 3000 in a barbecue contest. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100010",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100010"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100010",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100010",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472110200000",
					"startTimeString": "2016-08-25T01:30:00.000-06:00",
					"endTime": "1472112000000",
					"endTimeString": "2016-08-25T02:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100010",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100010"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472160600000",
					"startTimeString": "2016-08-25T15:30:00.000-06:00",
					"endTime": "1472162400000",
					"endTimeString": "2016-08-25T16:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100010",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100010"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 2,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472603400000",
					"startTimeString": "2016-08-30T18:30:00.000-06:00",
					"endTime": "1472605200000",
					"endTimeString": "2016-08-30T19:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100010",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100010"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 3,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472625000000",
					"startTimeString": "2016-08-31T00:30:00.000-06:00",
					"endTime": "1472626800000",
					"endTimeString": "2016-08-31T01:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100010",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100010"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 3
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 3
					}]
				}]
			},
			"title": "Operation Gumbo Drop",
			"titleWithoutArticles": "Operation Gumbo Drop",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100010?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Boyz 'N the Woods",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 9,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "When Thurgood fails to send Calvin and Juicy to summer camp, he takes the boys camping with Sanchez and Walter.",
				"programMetadata": {
					"EP002971100009": {
						"title": "Boyz 'N the Woods",
						"longDescription": "When Thurgood fails to send Calvin and Juicy to summer camp, he takes the boys camping with Sanchez and Walter.",
						"shortDescription": "When Thurgood fails to send Calvin and Juicy to summer camp, he takes the boys camping with Sanchez and Walter."
					}
				},
				"original_air_date": "1999-04-06",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "When Thurgood fails to send Calvin and Juicy to summer camp, he takes the boys camping with Sanchez and Walter.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100009",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100009"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100009",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100009",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472108400000",
					"startTimeString": "2016-08-25T01:00:00.000-06:00",
					"endTime": "1472110200000",
					"endTimeString": "2016-08-25T01:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100009",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100009"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472158800000",
					"startTimeString": "2016-08-25T15:00:00.000-06:00",
					"endTime": "1472160600000",
					"endTimeString": "2016-08-25T15:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100009",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100009"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 2,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472601600000",
					"startTimeString": "2016-08-30T18:00:00.000-06:00",
					"endTime": "1472603400000",
					"endTimeString": "2016-08-30T18:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100009",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100009"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}, {
				"index": 3,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472623200000",
					"startTimeString": "2016-08-31T00:00:00.000-06:00",
					"endTime": "1472625000000",
					"endTimeString": "2016-08-31T00:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100009",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100009"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 3
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 2
					}, {
						"actionType": "scheduleRecording",
						"streamIndex": 3
					}]
				}]
			},
			"title": "Boyz 'N the Woods",
			"titleWithoutArticles": "Boyz 'N the Woods",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100009?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "He's Gotta Have It",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "David Bleiman",
					"tmsPersonId": 194775,
					"role": "director"
				}],
				"episode_number": 8,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood becomes hooked on a prescription drug when he discovers that it enhances his libido. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"programMetadata": {
					"EP002971100008": {
						"title": "He's Gotta Have It",
						"longDescription": "Thurgood becomes hooked on a prescription drug when he discovers that it enhances his libido. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
						"shortDescription": "Thurgood becomes hooked on a prescription drug when he discovers that it enhances his libido. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan."
					}
				},
				"original_air_date": "1999-02-23",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "Thurgood becomes hooked on a prescription drug when he discovers that it enhances his libido. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100008",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100008"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100008",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100008",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472005800000",
					"startTimeString": "2016-08-23T20:30:00.000-06:00",
					"endTime": "1472007600000",
					"endTimeString": "2016-08-23T21:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100008",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100008"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472077800000",
					"startTimeString": "2016-08-24T16:30:00.000-06:00",
					"endTime": "1472079600000",
					"endTimeString": "2016-08-24T17:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100008",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100008"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "He's Gotta Have It",
			"titleWithoutArticles": "He's Gotta Have It",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100008?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Hero Ain't Nothing but a Super",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 7,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "When Muriel busts a burglar in the projects, Thurgood takes credit for it. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"programMetadata": {
					"EP002971100007": {
						"title": "A Hero Ain't Nothing but a Super",
						"longDescription": "When Muriel busts a burglar in the projects, Thurgood takes credit for it. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
						"shortDescription": "When Muriel busts a burglar in the projects, Thurgood takes credit for it. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan."
					}
				},
				"original_air_date": "1999-02-16",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "When Muriel busts a burglar in the projects, Thurgood takes credit for it. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100007",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100007"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100007",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100007",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472004000000",
					"startTimeString": "2016-08-23T20:00:00.000-06:00",
					"endTime": "1472005800000",
					"endTimeString": "2016-08-23T20:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100007",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100007"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472076000000",
					"startTimeString": "2016-08-24T16:00:00.000-06:00",
					"endTime": "1472077800000",
					"endTimeString": "2016-08-24T16:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100007",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100007"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "A Hero Ain't Nothing but a Super",
			"titleWithoutArticles": "Hero Ain't Nothing but a Super",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100007?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Bougie Nights",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 6,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "When Thurgood discovers a hidden penthouse apartment in the building, he turns it into his plush playground.",
				"programMetadata": {
					"EP002971100006": {
						"title": "Bougie Nights",
						"longDescription": "When Thurgood discovers a hidden penthouse apartment in the building, he turns it into his plush playground.",
						"shortDescription": "When Thurgood discovers a hidden penthouse apartment in the building, he turns it into his plush playground."
					}
				},
				"original_air_date": "1999-02-09",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "When Thurgood discovers a hidden penthouse apartment in the building, he turns it into his plush playground.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100006",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100006"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100006",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100006",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472106600000",
					"startTimeString": "2016-08-25T00:30:00.000-06:00",
					"endTime": "1472108400000",
					"endTimeString": "2016-08-25T01:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100006",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100006"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472157000000",
					"startTimeString": "2016-08-25T14:30:00.000-06:00",
					"endTime": "1472158800000",
					"endTimeString": "2016-08-25T15:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100006",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100006"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Bougie Nights",
			"titleWithoutArticles": "Bougie Nights",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100006?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Journal Fever",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 4,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "When Muriel comes down with the flu, Thurgood struggles to nurse her back to health. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"programMetadata": {
					"EP002971100004": {
						"title": "Journal Fever",
						"longDescription": "When Muriel comes down with the flu, Thurgood struggles to nurse her back to health. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
						"shortDescription": "When Muriel comes down with the flu, Thurgood struggles to nurse her back to health. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan."
					}
				},
				"original_air_date": "1999-01-26",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "When Muriel comes down with the flu, Thurgood struggles to nurse her back to health. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100004",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100004"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100004",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100004",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472104800000",
					"startTimeString": "2016-08-25T00:00:00.000-06:00",
					"endTime": "1472106600000",
					"endTimeString": "2016-08-25T00:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100004",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100004"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472155200000",
					"startTimeString": "2016-08-25T14:00:00.000-06:00",
					"endTime": "1472157000000",
					"endTimeString": "2016-08-25T14:30:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100004",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100004"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Journal Fever",
			"titleWithoutArticles": "Journal Fever",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100004?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}, {
			"type": "event",
			"eventType": "EPISODE",
			"alphaSortOn": "Bones, Bugs and Harmony",
			"availableOutOfHome": false,
			"linearAvailableOutOfHome": false,
			"vodAvailableOutOfHome": false,
			"tvodAvailableOutOfHome": false,
			"vodOutOfWindow": true,
			"details": {
				"crew": [{
					"name": "Eddie Murphy",
					"tmsPersonId": 1227,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Loretta Devine",
					"tmsPersonId": 72587,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Ja'net DuBois",
					"tmsPersonId": 77951,
					"role": "actor",
					"actorType": "Voice"
				}, {
					"name": "Crystal Scales",
					"tmsPersonId": 185256,
					"role": "actor",
					"actorType": "Voice"
				}],
				"episode_number": 2,
				"genres": [{
					"name": "Animated"
				}, {
					"name": "Animation"
				}, {
					"name": "Comedy"
				}],
				"long_desc": "Thurgood draws the wrong conclusion when he discovers Mrs. Avery eating dog food. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"programMetadata": {
					"EP002971100002": {
						"title": "Bones, Bugs and Harmony",
						"longDescription": "Thurgood draws the wrong conclusion when he discovers Mrs. Avery eating dog food. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
						"shortDescription": "Thurgood draws the wrong conclusion when he discovers Mrs. Avery eating dog food. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan."
					}
				},
				"original_air_date": "1999-01-12",
				"original_network_name": "",
				"season_number": 1,
				"short_desc": "Thurgood draws the wrong conclusion when he discovers Mrs. Avery eating dog food. Voices of Eddie Murphy, Loretta Devine, Ja'net DuBois, Crystal Scales and Michele Morgan.",
				"year": 1999,
				"allRatings": ["TV-14"],
				"allVPPs": [],
				"allIpVPPs": [],
				"programType": "Series",
				"tmsProviderProgramID": "EP002971100002",
				"entitled": true,
				"tvodEntitled": false,
				"linearEntitledIp": true,
				"linearEntitledQam": true,
				"staleDvrCache": false
			},
			"tmsProgramIds": ["EP002971100002"],
			"providerAssetIds": [],
			"tmsGuideServiceIds": [59116],
			"ipTmsGuideServiceIds": [59116],
			"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/EP002971100002",
			"network": {
				"callsign": "FUSEHD",
				"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
				"name": "FUSEHD",
				"networkImageQueryParams": "network=FUSEHD"
			},
			"nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/EP002971100002",
			"streamList": [{
				"index": 0,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472002200000",
					"startTimeString": "2016-08-23T19:30:00.000-06:00",
					"endTime": "1472004000000",
					"endTimeString": "2016-08-23T20:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100002",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100002"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": true
			}, {
				"index": 1,
				"type": "LINEAR",
				"streamProperties": {
					"runtimeInSeconds": 1800,
					"rating": "TV-14",
					"advisories": [],
					"attributes": ["CLOSED_CAPTIONING", "HIGH_DEF", "STEREO"],
					"startTime": "1472074200000",
					"startTimeString": "2016-08-24T15:30:00.000-06:00",
					"endTime": "1472076000000",
					"endTimeString": "2016-08-24T16:00:00.000-06:00",
					"mystroServiceID": 14346,
					"tmsProviderProgramID": "EP002971100002",
					"allChannelNumbers": [169, 900],
					"tmsGuideServiceId": 59116,
					"display_runtime": "30:00",
					"availableOutOfHome": false,
					"ipStreamUri": "/ipvs/api/smarttv/stream/live/v1/176",
					"primaryAudioLanguage": "en",
					"isAvailableOnIp": true,
					"isAvailableOnQam": true,
					"entitled": true,
					"entitledIp": true,
					"entitledQam": true,
					"cdvrEnabled": true,
					"cdvrScheduleUrl": "/ipvs/api/smarttv/cdvr/v1/schedule/59116/EP002971100002"
				},
				"network": {
					"callsign": "FUSEHD",
					"image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
					"name": "FUSEHD",
					"networkImageQueryParams": "network=FUSEHD"
				},
				"defaultStream": false
			}],
			"actionGroups": {
				"defaultGroup": {
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "otherWaysToWatch"
					}]
				},
				"othersGroup": [{
					"title": "Watch Here",
					"actionObjects": [{
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 0
					}, {
						"actionType": "cdvrScheduleRecording",
						"streamIndex": 1
					}]
				}, {
					"title": "Watch On TV",
					"actionObjects": [{
						"actionType": "scheduleRecording",
						"streamIndex": 1
					}]
				}]
			},
			"title": "Bones, Bugs and Harmony",
			"titleWithoutArticles": "Bones, Bugs and Harmony",
			"seriesTitle": "The PJs",
			"uri": "/nationalnavigation/V1/symphoni/event/tmsid/EP002971100002?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
		}],
		"name": "Season 1",
		"number": 1
	}],
	"title": "The PJs",
	"titleWithoutArticles": "PJs",
	"uri": "/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/184481?division=ATGW-SIT02&lineup=8&profile=ovp_v4&cacheID=1"
}

// 20151023143022
// https://services.timewarnercable.com/ipvs/api/nationalnavigation/V1/symphoni/eventproviderassetid/starzencore.com::MOVE0450000001246353?division=Online&lineup=0&profile=ovp&cacheID=6
mockData.nnsMovieDataMOVE0450000001246353 = {
  "type": "event",
  "eventType": "MOVIE",
  "image_uri": "https://services.timewarnercable.com/imageserver/program/MV000000130000",
  "name": "1941",
  "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/providerassetid/starzencore.com::MOVE0450000001246353?division=Online&lineup=0&profile=ovp&cacheID=6",
  "media": {
    "results": [
      {
        "type": "event",
        "eventType": "MOVIE",
        "alphaSortOn": "1941",
        "availableOutOfHome": true,
        "details": {
          "crew": [
            {
              "name": "John Belushi",
              "character": "Captain Wild Bill Kelso",
              "tmsPersonId": 32538,
              "role": "actor",
              "actorType": "Actor"
            },
            {
              "name": "Dan Aykroyd",
              "character": "Sgt. Frank Tree",
              "tmsPersonId": 76,
              "role": "actor",
              "actorType": "Actor"
            },
            {
              "name": "Lorraine Gary",
              "character": "Joan Douglas",
              "tmsPersonId": 71755,
              "role": "actor",
              "actorType": "Actor"
            },
            {
              "name": "Ned Beatty",
              "character": "Ward Douglas",
              "tmsPersonId": 47868,
              "role": "actor",
              "actorType": "Actor"
            },
            {
              "name": "Steven Spielberg",
              "tmsPersonId": 1672,
              "role": "director"
            }
          ],
          "genres": [
            {
              "name": "Action"
            },
            {
              "name": "Comedy"
            }
          ],
          "long_desc": "After Japan's attack on Pearl Harbor, residents of California descend into a wild panic, afraid that they might be the next target. Among them are Wild Bill Kelso (John Belushi), a crazed National Guard pilot; Sgt. Frank Tree (Dan Aykroyd), a patriotic, straight-laced tank crew commander; Ward Douglas (Ned Beatty), a civilian willing to help with the American war effort at any cost; and Maj. Gen. Joseph W. Stilwell (Robert Stack), who tries his hardest to maintain sanity amid the chaos.",
          "programMetadata": {
            "MV000000130000": {
              "title": "1941",
              "longDescription": "After Japan's attack on Pearl Harbor, residents of California descend into a wild panic, afraid that they might be the next target. Among them are Wild Bill Kelso (John Belushi), a crazed National Guard pilot; Sgt. Frank Tree (Dan Aykroyd), a patriotic, straight-laced tank crew commander; Ward Douglas (Ned Beatty), a civilian willing to help with the American war effort at any cost; and Maj. Gen. Joseph W. Stilwell (Robert Stack), who tries his hardest to maintain sanity amid the chaos.",
              "shortDescription": "Southern Californians and military personnel panic under rumors of a Japanese attack in their own backyard."
            }
          },
          "original_air_date": "",
          "original_network_name": "",
          "short_desc": "Southern Californians and military personnel panic under rumors of a Japanese attack in their own backyard.",
          "year": 1979,
          "allRatings": [
            "PG"
          ]
        },
        "tmsProgramIds": [
          "MV000000130000"
        ],
        "providerAssetIds": [
          "starzencore.com::MOVE0450000001246353"
        ],
        "image_uri": "https://services.timewarnercable.com/imageserver/program/MV000000130000",
        "network": {
          "callsign": "ENCRHD",
          "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
          "name": "Encore",
          "product_provider": "SVOD:ENCORE_HD_EXP",
          "product_providers": [
            "SVOD:ENCORE_HD_EXP"
          ],
          "networkImageQueryParams": "providerId=ENCORE_HD_EXP&productId=SVOD"
        },
        "nmd_main_uri": "https://services.timewarnercable.com/nmd/v3/program/tms/MV000000130000",
        "streamList": [
          {
            "index": 0,
            "type": "ONLINE_ONDEMAND",
            "streamProperties": {
              "runtimeInSeconds": 7140,
              "rating": "PG",
              "advisories": [
                "EL",
                "AS",
                "V"
              ],
              "attributes": [
                "CLOSED_CAPTIONING"
              ],
              "drm_content_id": "MOVE0450000001246353",
              "startTime": "1428019200000",
              "endTime": "1446681600000",
              "price": 0.0,
              "hasPreview": false,
              "rentalWindowInHours": 24,
              "cancellationWindowInMinutes": 5,
              "providerAssetID": "starzencore.com::MOVE0450000001246353",
              "tmsProviderProgramID": "MV000000130000",
              "thePlatformMediaId": "409048131768",
              "ondemandStreamType": "FOD",
              "display_runtime": "01:59:00",
              "availableOutOfHome": true,
              "availableInHome": true,
              "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/starzencore.com::MOVE0450000001246353",
              "premium": false,
              "isAvailableOnISAVod": true,
              "isaVodProviderAssetId": "starzencore.com::MOVE0450000001246353",
              "tricks_mode": {

              }
            },
            "network": {
              "callsign": "ENCRHD",
              "image_uri": "https://services.timewarnercable.com/imageserver/image/default",
              "name": "Encore",
              "product_provider": "SVOD:ENCORE_HD_EXP",
              "product_providers": [
                "SVOD:ENCORE_HD_EXP"
              ],
              "networkImageQueryParams": "providerId=ENCORE_HD_EXP&productId=SVOD"
            },
            "twcTvAvailable": true,
            "productProvider": "SVOD:ENCORE_HD_EXP",
            "entitled": true,
            "parentallyBlocked": false,
            "parentallyBlockedByChannel": false,
            "parentallyBlockedByRating": false,
            "bookmark": {
              "providerAssetId": "starzencore.com::MOVE0450000001246353",
              "playMarkerSeconds": 3073,
              "entertainmentPlayMarkerSeconds": 3073,
              "tmsProgramId": "MV000000130000",
              "runtimeSeconds": 7142,
              "complete": false,
              "hidden": false,
              "lastWatchedUtcSeconds": 1445627735
            },
            "watchList": true
          }
        ],
        "alsoAvailableStreamCategories": [
          {
            "type": "OD",
            "categories": [
              {
                "title": "On Demand",
                "rating": "PG",
                "streamIndices": [

                ]
              }
            ]
          }
        ],
        "defaultStreamOrderIndices": [
          0
        ],
        "title": "1941",
        "titleWithoutArticles": "1941",
        "uri": "/ipvs/api/nationalnavigation/V1/symphoni/event/providerassetid/starzencore.com::MOVE0450000001246353?division=Online&lineup=0&profile=ovp&cacheID=6"
      }
    ]
  }
}

// https://services.timewarnercable.com/ipvs/api//nationalnavigation/V1/symphoni/watchlater/frontdoor?division=ATGW-SIT03&lineup=8294&profile=ovp_v4&cacheID=48'
mockData.watchLaterFrontDoor = {
  'uiHint': 'previewMenuPage',
  'availableOutOfHome': true,
  'name': 'Watch Later',
  'uri': '/nationalnavigation/V1/symphoni/watchlater/frontdoor?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26',
  'twcTvNetworkDisplayMode': 'default',
  'results': [{
      'type': 'media_list',
      'uiHint': 'boxArtList',
      'context': 'inProgress',
      'availableOutOfHome': true,
      'name': 'In-Progress (using canned data)',
      'uri': '',
      'twcTvNetworkDisplayMode': 'default',
      'num_categories': 0,
      'total_results': 8,
      'media': [{
          'type': 'episode_list',
          'alphaSortOn': 'Bob\'s Burgers',
          'availableOutOfHome': true,
          'details': {
              'num_assets': 5,
              'latest_episode': {
                  'type': 'event',
                  'details': {
                      'genres': [{
                          'name': 'Holiday'
                      }, {
                          'name': 'Animated'
                      }, {
                          'name': 'Animation'
                      }, {
                          'name': 'Comedy'
                      }, {
                          'name': 'Other'
                      }]
                  },
                  'tmsProgramIds': [
                      'EP012792980098'
                  ],
                  'providerAssetIds': [
                      'fox.com::MFOX0014162420160218'
                  ],
                  'tmsGuideServiceIds': [

                  ],
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/EP012792980098',
                  'network': {
                      'callsign': 'FOX',
                      'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                      'name': 'Fox',
                      'product_provider': 'PTOD:FOX_NETSHOWS_HD_C3',
                      'product_providers': [
                          'PTOD:FOX_NETSHOWS_HD_C3'
                      ],
                      'networkImageQueryParams': 'providerId=FOX_NETSHOWS_HD_C3&productId=PTOD'
                  },
                  'title': 'The Gene and Courtney Show',
                  'seriesTitle': 'Bob\'s Burgers',
                  'uri': '/nationalnavigation/V1/symphoni/event/tmsid/EP012792980098?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
              },
              'allRatings': [
                  'TV-14',
                  'TV-PG'
              ]
          },
          'tmsSeriesId': 8127591,
          'tmsSeriesIdStr': '8127591',
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/series/8127591',
          'network': {
              'callsign': 'FOX',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'Fox',
              'product_provider': 'PTOD:FOX_NETSHOWS_HD_C3',
              'product_providers': [
                  'PTOD:FOX_NETSHOWS_HD_C3'
              ],
              'networkImageQueryParams': 'providerId=FOX_NETSHOWS_HD_C3&productId=PTOD'
          },
          'title': 'Bob\'s Burgers',
          'titleWithoutArticles': 'Bob\'s Burgers',
          'uri': '/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/8127591?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'episode_list',
          'alphaSortOn': 'Black Ink Crew: Chicago',
          'availableOutOfHome': true,
          'details': {
              'num_assets': 7,
              'latest_episode': {
                  'type': 'event',
                  'details': {
                      'genres': [{
                          'name': 'Life & Style'
                      }, {
                          'name': 'Reality'
                      }]
                  },
                  'tmsProgramIds': [
                      'EP022638840008'
                  ],
                  'providerAssetIds': [
                      'vh1.com::XPMV0000000000375076'
                  ],
                  'tmsGuideServiceIds': [

                  ],
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/EP022638840008',
                  'network': {
                      'callsign': 'VH1',
                      'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                      'name': 'VH1',
                      'product_provider': 'ENTOD:VH1_HD',
                      'product_providers': [
                          'ENTOD:VH1_HD'
                      ],
                      'networkImageQueryParams': 'providerId=VH1_HD&productId=ENTOD'
                  },
                  'title': 'Yacht Rocked',
                  'seriesTitle': 'Black Ink Crew: Chicago',
                  'uri': '/nationalnavigation/V1/symphoni/event/tmsid/EP022638840008?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
              },
              'allRatings': [
                  'TV-14'
              ]
          },
          'tmsSeriesId': 12110626,
          'tmsSeriesIdStr': '12110626',
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/series/12110626',
          'network': {
              'callsign': 'VH1',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'VH1',
              'product_provider': 'ENTOD:VH1_HD',
              'product_providers': [
                  'ENTOD:VH1_HD'
              ],
              'networkImageQueryParams': 'providerId=VH1_HD&productId=ENTOD'
          },
          'title': 'Black Ink Crew: Chicago',
          'titleWithoutArticles': 'Black Ink Crew: Chicago',
          'uri': '/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/12110626?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'event',
          'alphaSortOn': 'True Story',
          'availableOutOfHome': false,
          'details': {
              'genres': [{
                  'name': 'Thriller'
              }, {
                  'name': 'Crime'
              }, {
                  'name': 'Mystery'
              }],
              'original_air_date': '',
              'year': 2015,
              'allRatings': [
                  'R'
              ]
          },
          'tmsProgramIds': [
              'MV006934850000'
          ],
          'providerAssetIds': [
              'hbohodhd.com::HAHM0000000005859813'
          ],
          'tmsGuideServiceIds': [

          ],
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/MV006934850000',
          'network': {
              'callsign': 'HBO',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'HBO',
              'product_provider': 'HOD:HBO_HD',
              'product_providers': [
                  'HOD:HBO_HD'
              ],
              'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
          },
          'streamList': [{
              'index': 0,
              'type': 'ONLINE_ONDEMAND',
              'streamProperties': {
                  'runtimeInSeconds': 6000,
                  'rating': 'R',
                  'advisories': [
                      'EL',
                      'MV'
                  ],
                  'attributes': [
                      'HIGH_DEF',
                      'CLOSED_CAPTIONING'
                  ],
                  'drm_content_id': 'HAHM0000000005859813',
                  'startTime': '1455667200000',
                  'startTimeString': '2016-02-16T17:00:00.000-07:00',
                  'endTime': '1456617600000',
                  'endTimeString': '2016-02-27T17:00:00.000-07:00',
                  'price': 0.0,
                  'hasPreview': false,
                  'rentalWindowInHours': 24,
                  'cancellationWindowInMinutes': 0,
                  'providerAssetID': 'hbohodhd.com::HAHM0000000005859813',
                  'tmsProviderProgramID': 'MV006934850000',
                  'thePlatformMediaId': '618129987960',
                  'ondemandStreamType': 'FOD',
                  'display_runtime': '01:40:00',
                  'availableOutOfHome': false,
                  'availableInHome': true,
                  'mediaUrl': '/ipvs/api/smarttv/stream/vod/v1/hbohodhd.com::HAHM0000000005859813',
                  'premium': true,
                  'primaryAudioLanguage': 'en',
                  'isAvailableOnISAVod': false,
                  'entitled': true,
                  'bookmark': {
                      'providerAssetId': 'hbohodhd.com::HAHM0000000005859813',
                      'playMarkerSeconds': 239,
                      'entertainmentPlayMarkerSeconds': 239,
                      'tmsProgramId': 'MV006934850000',
                      'runtimeSeconds': 5982,
                      'complete': false,
                      'hidden': false,
                      'lastWatchedUtcSeconds': 1455828483
                  },
                  'tricks_mode': {

                  }
              },
              'network': {
                  'callsign': 'HBO',
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                  'name': 'HBO',
                  'product_provider': 'HOD:HBO_HD',
                  'product_providers': [
                      'HOD:HBO_HD'
                  ],
                  'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
              }
          }],
          'title': 'True Story',
          'titleWithoutArticles': 'True Story',
          'uri': '/nationalnavigation/V1/symphoni/event/tmsid/MV006934850000?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'event',
          'alphaSortOn': 'Furious 7',
          'availableOutOfHome': false,
          'details': {
              'genres': [{
                  'name': 'Action'
              }, {
                  'name': 'Thriller'
              }],
              'original_air_date': '',
              'year': 2015,
              'allRatings': [
                  'PG-13'
              ]
          },
          'tmsProgramIds': [
              'MV005640180000'
          ],
          'providerAssetIds': [
              'hbohodhd.com::HAHM0000000002847639'
          ],
          'tmsGuideServiceIds': [

          ],
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/MV005640180000',
          'network': {
              'callsign': 'HBO',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'HBO',
              'product_provider': 'HOD:HBO_HD',
              'product_providers': [
                  'HOD:HBO_HD'
              ],
              'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
          },
          'streamList': [{
              'index': 0,
              'type': 'ONLINE_ONDEMAND',
              'streamProperties': {
                  'runtimeInSeconds': 8280,
                  'rating': 'PG-13',
                  'advisories': [
                      'AS',
                      'EL',
                      'V'
                  ],
                  'attributes': [
                      'HIGH_DEF',
                      'CLOSED_CAPTIONING'
                  ],
                  'drm_content_id': 'HAHM0000000002847639',
                  'startTime': '1455408000000',
                  'startTimeString': '2016-02-13T17:00:00.000-07:00',
                  'endTime': '1457827200000',
                  'endTimeString': '2016-03-12T17:00:00.000-07:00',
                  'price': 0.0,
                  'hasPreview': false,
                  'rentalWindowInHours': 24,
                  'cancellationWindowInMinutes': 0,
                  'providerAssetID': 'hbohodhd.com::HAHM0000000002847639',
                  'tmsProviderProgramID': 'MV005640180000',
                  'thePlatformMediaId': '620044355824',
                  'ondemandStreamType': 'FOD',
                  'display_runtime': '02:18:00',
                  'availableOutOfHome': false,
                  'availableInHome': true,
                  'mediaUrl': '/ipvs/api/smarttv/stream/vod/v1/hbohodhd.com::HAHM0000000002847639',
                  'premium': true,
                  'primaryAudioLanguage': 'en',
                  'isAvailableOnISAVod': false,
                  'entitled': true,
                  'bookmark': {
                      'providerAssetId': 'hbohodhd.com::HAHM0000000002847639',
                      'playMarkerSeconds': 7599,
                      'entertainmentPlayMarkerSeconds': 7599,
                      'tmsProgramId': 'MV005640180000',
                      'runtimeSeconds': 8280,
                      'complete': false,
                      'hidden': false,
                      'lastWatchedUtcSeconds': 1455818702
                  },
                  'tricks_mode': {

                  }
              },
              'network': {
                  'callsign': 'HBO',
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                  'name': 'HBO',
                  'product_provider': 'HOD:HBO_HD',
                  'product_providers': [
                      'HOD:HBO_HD'
                  ],
                  'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
              }
          }],
          'title': 'Furious 7',
          'titleWithoutArticles': 'Furious 7',
          'uri': '/nationalnavigation/V1/symphoni/event/tmsid/MV005640180000?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'event',
          'alphaSortOn': 'Amber\'s Story',
          'availableOutOfHome': true,
          'details': {
              'genres': [{
                  'name': 'Drama'
              }],
              'original_air_date': '',
              'year': 2006,
              'allRatings': [
                  'TV-14'
              ]
          },
          'tmsProgramIds': [
              'MV001819550000'
          ],
          'providerAssetIds': [
              'lmn.com::LMSM0563741512070000'
          ],
          'tmsGuideServiceIds': [

          ],
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/MV001819550000',
          'network': {
              'callsign': 'LMN',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'LMN',
              'product_provider': 'FMOD:LMN',
              'product_providers': [
                  'FMOD:LMN'
              ],
              'networkImageQueryParams': 'providerId=LMN&productId=FMOD'
          },
          'streamList': [{
              'index': 0,
              'type': 'ONLINE_ONDEMAND',
              'streamProperties': {
                  'runtimeInSeconds': 5280,
                  'rating': 'TV-14',
                  'advisories': [
                      'AS'
                  ],
                  'attributes': [
                      'STEREO',
                      'CLOSED_CAPTIONING'
                  ],
                  'drm_content_id': 'LMSM0563741512070000',
                  'startTime': '1451606400000',
                  'startTimeString': '2015-12-31T17:00:00.000-07:00',
                  'endTime': '1457049599000',
                  'endTimeString': '2016-03-03T16:59:59.000-07:00',
                  'price': 0.0,
                  'hasPreview': false,
                  'rentalWindowInHours': 24,
                  'cancellationWindowInMinutes': 0,
                  'providerAssetID': 'lmn.com::LMSM0563741512070000',
                  'tmsProviderProgramID': 'MV001819550000',
                  'thePlatformMediaId': '594122307915',
                  'ondemandStreamType': 'FOD',
                  'display_runtime': '01:28:00',
                  'availableOutOfHome': true,
                  'availableInHome': true,
                  'mediaUrl': '/ipvs/api/smarttv/stream/vod/v1/lmn.com::LMSM0563741512070000',
                  'premium': false,
                  'primaryAudioLanguage': 'en',
                  'isAvailableOnISAVod': false,
                  'entitled': true,
                  'bookmark': {
                      'providerAssetId': 'lmn.com::LMSM0563741512070000',
                      'playMarkerSeconds': 65,
                      'entertainmentPlayMarkerSeconds': 65,
                      'tmsProgramId': 'MV001819550000',
                      'runtimeSeconds': 5264,
                      'complete': false,
                      'hidden': false,
                      'lastWatchedUtcSeconds': 1455817143
                  },
                  'tricks_mode': {

                  }
              },
              'network': {
                  'callsign': 'LMN',
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                  'name': 'LMN',
                  'product_provider': 'FMOD:LMN',
                  'product_providers': [
                      'FMOD:LMN'
                  ],
                  'networkImageQueryParams': 'providerId=LMN&productId=FMOD'
              }
          }],
          'title': 'Amber\'s Story',
          'titleWithoutArticles': 'Amber\'s Story',
          'uri': '/nationalnavigation/V1/symphoni/event/tmsid/MV001819550000?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'event',
          'alphaSortOn': 'Home Again',
          'availableOutOfHome': true,
          'details': {
              'episode_number': 4,
              'genres': [{
                  'name': 'Drama'
              }, {
                  'name': 'Science fiction'
              }, {
                  'name': 'Sci-Fi/Fantasy'
              }],
              'original_air_date': '2016-02-08',
              'season_number': 10,
              'year': 2016,
              'allRatings': [
                  'TV-14'
              ]
          },
          'tmsProgramIds': [
              'EP000809550224'
          ],
          'providerAssetIds': [
              'fox.com::MFOX0014143420160216'
          ],
          'tmsGuideServiceIds': [

          ],
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/EP000809550224',
          'network': {
              'callsign': 'FOX',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'Fox',
              'product_provider': 'PTOD:FOX_NETSHOWS_HD',
              'product_providers': [
                  'PTOD:FOX_NETSHOWS_HD'
              ],
              'networkImageQueryParams': 'providerId=FOX_NETSHOWS_HD&productId=PTOD'
          },
          'streamList': [{
              'index': 0,
              'type': 'ONLINE_ONDEMAND',
              'streamProperties': {
                  'runtimeInSeconds': 3420,
                  'rating': 'TV-14',
                  'advisories': [

                  ],
                  'attributes': [
                      'HIGH_DEF',
                      'CLOSED_CAPTIONING'
                  ],
                  'drm_content_id': 'MFOX0014143420160216',
                  'startTime': '1455580800000',
                  'startTimeString': '2016-02-15T17:00:00.000-07:00',
                  'endTime': '1459209599000',
                  'endTimeString': '2016-03-28T17:59:59.000-06:00',
                  'price': 0.0,
                  'hasPreview': false,
                  'rentalWindowInHours': 24,
                  'cancellationWindowInMinutes': 0,
                  'providerAssetID': 'fox.com::MFOX0014143420160216',
                  'tmsProviderProgramID': 'EP000809550224',
                  'tmsProviderProgramIDForSeries': 'SH000809550000',
                  'thePlatformMediaId': '622312515701',
                  'ondemandStreamType': 'FOD',
                  'display_runtime': '57:00',
                  'availableOutOfHome': true,
                  'availableInHome': true,
                  'mediaUrl': '/ipvs/api/smarttv/stream/vod/v1/fox.com::MFOX0014143420160216',
                  'premium': false,
                  'primaryAudioLanguage': 'en',
                  'isAvailableOnISAVod': false,
                  'entitled': true,
                  'bookmark': {
                      'providerAssetId': 'fox.com::MFOX0014143420160216',
                      'playMarkerSeconds': 1,
                      'entertainmentPlayMarkerSeconds': 0,
                      'tmsProgramId': 'EP000809550224',
                      'runtimeSeconds': 3420,
                      'complete': false,
                      'hidden': false,
                      'lastWatchedUtcSeconds': 1455814301
                  },
                  'tricks_mode': {
                      'FASTFORWARD': [{
                          'start': 0,
                          'end': 3420
                      }]
                  }
              },
              'network': {
                  'callsign': 'FOX',
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                  'name': 'Fox',
                  'product_provider': 'PTOD:FOX_NETSHOWS_HD',
                  'product_providers': [
                      'PTOD:FOX_NETSHOWS_HD'
                  ],
                  'networkImageQueryParams': 'providerId=FOX_NETSHOWS_HD&productId=PTOD'
              }
          }],
          'title': 'Home Again',
          'titleWithoutArticles': 'Home Again',
          'seriesTitle': 'The X-Files',
          'uri': '/nationalnavigation/V1/symphoni/event/tmsid/EP000809550224?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'event',
          'alphaSortOn': 'Looper',
          'availableOutOfHome': true,
          'details': {
              'genres': [{
                  'name': 'Action'
              }, {
                  'name': 'Thriller'
              }, {
                  'name': 'Science fiction'
              }, {
                  'name': 'Sci-Fi/Fantasy'
              }],
              'original_air_date': '',
              'year': 2012,
              'allRatings': [
                  'TV-14'
              ]
          },
          'tmsProgramIds': [
              'MV003874000000'
          ],
          'providerAssetIds': [
              'fxm.com::MFXM3013303820160101'
          ],
          'tmsGuideServiceIds': [

          ],
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/MV003874000000',
          'network': {
              'callsign': 'FX',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'FXM',
              'product_provider': 'FMOD:FXM_HD',
              'product_providers': [
                  'FMOD:FXM_HD'
              ],
              'networkImageQueryParams': 'providerId=FXM_HD&productId=FMOD'
          },
          'streamList': [{
              'index': 0,
              'type': 'ONLINE_ONDEMAND',
              'streamProperties': {
                  'runtimeInSeconds': 7020,
                  'rating': 'TV-14',
                  'advisories': [
                      'EL',
                      'AS',
                      'N',
                      'V'
                  ],
                  'attributes': [
                      'HIGH_DEF',
                      'STEREO',
                      'CLOSED_CAPTIONING'
                  ],
                  'drm_content_id': 'MFXM3013303820160101',
                  'startTime': '1451606400000',
                  'startTimeString': '2015-12-31T17:00:00.000-07:00',
                  'endTime': '1456790399000',
                  'endTimeString': '2016-02-29T16:59:59.000-07:00',
                  'price': 0.0,
                  'hasPreview': false,
                  'rentalWindowInHours': 24,
                  'cancellationWindowInMinutes': 0,
                  'providerAssetID': 'fxm.com::MFXM3013303820160101',
                  'tmsProviderProgramID': 'MV003874000000',
                  'thePlatformMediaId': '594614851517',
                  'ondemandStreamType': 'FOD',
                  'display_runtime': '01:57:00',
                  'availableOutOfHome': true,
                  'availableInHome': true,
                  'mediaUrl': '/ipvs/api/smarttv/stream/vod/v1/fxm.com::MFXM3013303820160101',
                  'premium': false,
                  'primaryAudioLanguage': 'en',
                  'isAvailableOnISAVod': false,
                  'entitled': true,
                  'bookmark': {
                      'providerAssetId': 'fxm.com::MFXM3013303820160101',
                      'playMarkerSeconds': 5,
                      'entertainmentPlayMarkerSeconds': 5,
                      'tmsProgramId': 'MV003874000000',
                      'runtimeSeconds': 6919,
                      'complete': false,
                      'hidden': false,
                      'lastWatchedUtcSeconds': 1455754231
                  },
                  'tricks_mode': {
                      'FASTFORWARD': [{
                          'start': 0,
                          'end': 7020
                      }]
                  }
              },
              'network': {
                  'callsign': 'FX',
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                  'name': 'FXM',
                  'product_provider': 'FMOD:FXM_HD',
                  'product_providers': [
                      'FMOD:FXM_HD'
                  ],
                  'networkImageQueryParams': 'providerId=FXM_HD&productId=FMOD'
              }
          }],
          'title': 'Looper',
          'titleWithoutArticles': 'Looper',
          'uri': '/nationalnavigation/V1/symphoni/event/tmsid/MV003874000000?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'event',
          'alphaSortOn': 'Walk Among the Tombstones',
          'availableOutOfHome': false,
          'details': {
              'genres': [{
                  'name': 'Action'
              }, {
                  'name': 'Thriller'
              }, {
                  'name': 'Crime'
              }, {
                  'name': 'Mystery'
              }],
              'original_air_date': '',
              'year': 2014,
              'allRatings': [
                  'R'
              ]
          },
          'tmsProgramIds': [
              'MV005492410000'
          ],
          'providerAssetIds': [
              'hbohodhd.com::HAHM0000000004847643'
          ],
          'tmsGuideServiceIds': [

          ],
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/MV005492410000',
          'network': {
              'callsign': 'HBO',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'HBO',
              'product_provider': 'HOD:HBO_HD',
              'product_providers': [
                  'HOD:HBO_HD'
              ],
              'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
          },
          'streamList': [{
              'index': 0,
              'type': 'ONLINE_ONDEMAND',
              'streamProperties': {
                  'runtimeInSeconds': 6900,
                  'rating': 'R',
                  'advisories': [
                      'AS',
                      'EL',
                      'N',
                      'V'
                  ],
                  'attributes': [
                      'HIGH_DEF',
                      'CLOSED_CAPTIONING'
                  ],
                  'drm_content_id': 'HAHM0000000004847643',
                  'startTime': '1454803200000',
                  'startTimeString': '2016-02-06T17:00:00.000-07:00',
                  'endTime': '1457222400000',
                  'endTimeString': '2016-03-05T17:00:00.000-07:00',
                  'price': 0.0,
                  'hasPreview': false,
                  'rentalWindowInHours': 24,
                  'cancellationWindowInMinutes': 0,
                  'providerAssetID': 'hbohodhd.com::HAHM0000000004847643',
                  'tmsProviderProgramID': 'MV005492410000',
                  'thePlatformMediaId': '614771267593',
                  'ondemandStreamType': 'FOD',
                  'display_runtime': '01:55:00',
                  'availableOutOfHome': false,
                  'availableInHome': true,
                  'mediaUrl': '/ipvs/api/smarttv/stream/vod/v1/hbohodhd.com::HAHM0000000004847643',
                  'premium': true,
                  'primaryAudioLanguage': 'en',
                  'isAvailableOnISAVod': false,
                  'entitled': true,
                  'bookmark': {
                      'providerAssetId': 'hbohodhd.com::HAHM0000000004847643',
                      'playMarkerSeconds': 16,
                      'entertainmentPlayMarkerSeconds': 16,
                      'tmsProgramId': 'MV005492410000',
                      'runtimeSeconds': 6888,
                      'complete': false,
                      'hidden': false,
                      'lastWatchedUtcSeconds': 1455753669
                  },
                  'tricks_mode': {

                  }
              },
              'network': {
                  'callsign': 'HBO',
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                  'name': 'HBO',
                  'product_provider': 'HOD:HBO_HD',
                  'product_providers': [
                      'HOD:HBO_HD'
                  ],
                  'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
              }
          }],
          'title': 'A Walk Among the Tombstones',
          'titleWithoutArticles': 'Walk Among the Tombstones',
          'uri': '/nationalnavigation/V1/symphoni/event/tmsid/MV005492410000?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }]
  }, {
      'type': 'media_list',
      'uiHint': 'list',
      'context': 'saved',
      'availableOutOfHome': true,
      'name': 'Saved for Later (using canned data)',
      'uri': '',
      'twcTvNetworkDisplayMode': 'default',
      'num_categories': 0,
      'total_results': 2,
      'media': [{
          'type': 'event',
          'alphaSortOn': 'Mad Max: Fury Road',
          'availableOutOfHome': false,
          'details': {
              'genres': [{
                  'name': 'Action'
              }],
              'original_air_date': '',
              'year': 2015,
              'allRatings': [
                  'R'
              ]
          },
          'tmsProgramIds': [
              'MV005926760000'
          ],
          'providerAssetIds': [
              'hbohodhd.com::HAHM0000000003833283'
          ],
          'tmsGuideServiceIds': [

          ],
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/MV005926760000',
          'network': {
              'callsign': 'HBO',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'HBO',
              'product_provider': 'HOD:HBO_HD',
              'product_providers': [
                  'HOD:HBO_HD'
              ],
              'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
          },
          'streamList': [{
              'index': 0,
              'type': 'ONLINE_ONDEMAND',
              'streamProperties': {
                  'runtimeInSeconds': 7260,
                  'rating': 'R',
                  'advisories': [
                      'BN',
                      'V'
                  ],
                  'attributes': [
                      'HIGH_DEF',
                      'CLOSED_CAPTIONING'
                  ],
                  'drm_content_id': 'HAHM0000000003833283',
                  'startTime': '1454889600000',
                  'startTimeString': '2016-02-07T17:00:00.000-07:00',
                  'endTime': '1459728000000',
                  'endTimeString': '2016-04-03T18:00:00.000-06:00',
                  'price': 0.0,
                  'hasPreview': false,
                  'rentalWindowInHours': 24,
                  'cancellationWindowInMinutes': 0,
                  'providerAssetID': 'hbohodhd.com::HAHM0000000003833283',
                  'tmsProviderProgramID': 'MV005926760000',
                  'thePlatformMediaId': '613316163596',
                  'ondemandStreamType': 'FOD',
                  'display_runtime': '02:01:00',
                  'availableOutOfHome': false,
                  'availableInHome': true,
                  'mediaUrl': '/ipvs/api/smarttv/stream/vod/v1/hbohodhd.com::HAHM0000000003833283',
                  'premium': true,
                  'primaryAudioLanguage': 'en',
                  'isAvailableOnISAVod': false,
                  'entitled': true,
                  'bookmark': {
                      'providerAssetId': 'hbohodhd.com::HAHM0000000003833283',
                      'playMarkerSeconds': 6561,
                      'entertainmentPlayMarkerSeconds': 6561,
                      'tmsProgramId': 'MV005926760000',
                      'runtimeSeconds': 7264,
                      'complete': false,
                      'hidden': true,
                      'lastWatchedUtcSeconds': 1455561047
                  },
                  'tricks_mode': {

                  }
              },
              'network': {
                  'callsign': 'HBO',
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                  'name': 'HBO',
                  'product_provider': 'HOD:HBO_HD',
                  'product_providers': [
                      'HOD:HBO_HD'
                  ],
                  'networkImageQueryParams': 'providerId=HBO_HD&productId=HOD'
              }
          }],
          'title': 'Mad Max: Fury Road',
          'titleWithoutArticles': 'Mad Max: Fury Road',
          'uri': '/nationalnavigation/V1/symphoni/event/tmsid/MV005926760000?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }, {
          'type': 'episode_list',
          'alphaSortOn': 'Friends',
          'availableOutOfHome': false,
          'details': {
              'num_assets': 2,
              'latest_episode': {
                  'type': 'event',
                  'details': {
                      'genres': [{
                          'name': 'Comedy'
                      }]
                  },
                  'tmsProgramIds': [
                      'EP001151270094'
                  ],
                  'providerAssetIds': [
                      'tbs.com::TBSD0001061601006955'
                  ],
                  'tmsGuideServiceIds': [

                  ],
                  'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/program/EP001151270094',
                  'network': {
                      'callsign': 'TBS',
                      'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
                      'name': 'TBS',
                      'product_provider': 'ENTOD:TBS_HD',
                      'product_providers': [
                          'ENTOD:TBS_HD'
                      ],
                      'networkImageQueryParams': 'providerId=TBS_HD&productId=ENTOD'
                  },
                  'title': 'The One With All the Rugby',
                  'seriesTitle': 'Friends',
                  'uri': '/nationalnavigation/V1/symphoni/event/tmsid/EP001151270094?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
              },
              'allRatings': [
                  'TV-14',
                  'TV-PG'
              ]
          },
          'tmsSeriesId': 183931,
          'tmsSeriesIdStr': '183931',
          'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/series/183931',
          'network': {
              'callsign': 'TBS',
              'image_uri': 'https://pi-dev.timewarnercable.com/imageserver/image/default',
              'name': 'TBS',
              'product_provider': 'ENTOD:TBS_HD',
              'product_providers': [
                  'ENTOD:TBS_HD'
              ],
              'networkImageQueryParams': 'providerId=TBS_HD&productId=ENTOD'
          },
          'title': 'Friends',
          'titleWithoutArticles': 'Friends',
          'uri': '/nationalnavigation/V1/symphoni/series/tmsproviderseriesid/183931?division=CLT&lineup=168&application=WATCH_LATER&profile=ovp_v4&cacheID=26'
      }]
  }, {
      'type': 'media_list',
      'uiHint': 'list',
      'context': 'rented',
      'availableOutOfHome': true,
      'name': 'Rented',
      'uri': '',
      'twcTvNetworkDisplayMode': 'default',
      'num_categories': 0,
      'total_results': 0,
      'media': [

      ]
  }],
  'num_categories': 3
}

mockData.nnsMovieDataMV006133690000 =
{
    "type": "event",
    "eventType": "MOVIE",
    "image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/MV006133690000",
    "name": "Norm of the North",
    "uri": "/nationalnavigation/V1/symphoni/event/tmsid/MV006133690000?division=ATGW-SIT12&lineup=202&application=VOD_PORTAL&profile=ovp_v4&cacheID=5",
    "media": {
        "results": [{
            "type": "event",
            "eventType": "MOVIE",
            "alphaSortOn": "Norm of the North",
            "availableOutOfHome": true,
            "linearAvailableOutOfHome": false,
            "vodAvailableOutOfHome": true,
            "tvodAvailableOutOfHome": false,
            "vodOutOfWindow": false,
            "details": {
                "crew": [{
                    "name": "Rob Schneider",
                    "character": "Norm",
                    "tmsPersonId": 54827,
                    "role": "actor",
                    "actorType": "Voice"
                }, {
                    "name": "Heather Graham",
                    "character": "Vera",
                    "tmsPersonId": 77349,
                    "role": "actor",
                    "actorType": "Voice"
                }, {
                    "name": "Ken Jeong",
                    "character": "Mr. Greene",
                    "tmsPersonId": 313030,
                    "role": "actor",
                    "actorType": "Voice"
                }, {
                    "name": "Bill Nighy",
                    "character": "Socrates",
                    "tmsPersonId": 83203,
                    "role": "actor",
                    "actorType": "Voice"
                }, {
                    "name": "Trevor Wall",
                    "tmsPersonId": 843364,
                    "role": "director"
                }],
                "hasNewStreams": false,
                "genres": [{
                    "name": "Action"
                }, {
                    "name": "Kids & Family"
                }, {
                    "name": "Animated"
                }, {
                    "name": "Animation"
                }, {
                    "name": "Comedy"
                }, {
                    "name": "Children"
                }],
                "long_desc": "Norm (Rob Schneider) the polar bear doesn't know how to hunt, but he does possess the unique ability to talk to humans. When the wealthy Mr. Greene (Ken Jeong) unveils his idea to build luxury condos in the Arctic, Norm realizes that his beloved home is in jeopardy. Accompanied by three mischievous lemmings, Norm stows away on a ship to New York. Once there, he meets a surprising ally (Maya Kay) who helps him hatch a scheme to sabotage the shady developer's plans.",
                "programMetadata": {
                    "MV006133690000": {
                        "title": "Norm of the North",
                        "longDescription": "Norm (Rob Schneider) the polar bear doesn't know how to hunt, but he does possess the unique ability to talk to humans. When the wealthy Mr. Greene (Ken Jeong) unveils his idea to build luxury condos in the Arctic, Norm realizes that his beloved home is in jeopardy. Accompanied by three mischievous lemmings, Norm stows away on a ship to New York. Once there, he meets a surprising ally (Maya Kay) who helps him hatch a scheme to sabotage the shady developer's plans.",
                        "shortDescription": "A polar bear (Rob Schneider) and three mischievous lemmings travel to New York to stop a shady developer (Ken Jeong) from building luxury condos in the Arctic."
                    }
                },
                "original_air_date": "",
                "original_network_name": "",
                "short_desc": "A polar bear (Rob Schneider) and three mischievous lemmings travel to New York to stop a shady developer (Ken Jeong) from building luxury condos in the Arctic.",
                "year": 2016,
                "commonSenseMediaV2": {
                    "rating": 6
                },
                "metacritic": {
                    "rating": 21
                },
                "allRatings": ["PG"],
                "allVPPs": ["EPXOD:EPIX_HD"],
                "allIpVPPs": ["EPXOD:EPIX_HD"],
                "programType": "FeatureFilm",
                "tmsProviderProgramID": "MV006133690000",
                "watchListProviderAssetID": "epixhd.com::XPMV0000000000522797",
                "entitled": true,
                "tvodEntitled": false,
                "linearEntitledIp": false,
                "linearEntitledQam": false
            },
            "tmsProgramIds": ["MV006133690000"],
            "providerAssetIds": ["epixhd.com::XPMV0000000000522797"],
            "tmsGuideServiceIds": [],
            "ipTmsGuideServiceIds": [],
            "cdvrChannelPickerTmsGuideIds": [],
            "image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/program/MV006133690000",
            "network": {
                "callsign": "EPIX",
                "image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
                "name": "Epix",
                "product_provider": "EPXOD:EPIX_HD",
                "product_providers": ["EPXOD:EPIX_HD"],
                "networkImageQueryParams": "providerId=EPIX_HD&productId=EPXOD"
            },
            "nmd_main_uri": "https://pi-sit-b.timewarnercable.com/nmd/v3/program/tms/MV006133690000",
            "streamList": [{
                "index": 0,
                "type": "ONLINE_ONDEMAND",
                "streamProperties": {
                    "runtimeInSeconds": 5400,
                    "rating": "PG",
                    "advisories": ["AS"],
                    "attributes": ["HIGH_DEF", "STEREO", "CLOSED_CAPTIONING"],
                    "drm_content_id": "XPMV0000000000522797",
                    "startTime": "1477958460000",
                    "startTimeString": "2016-10-31T18:01:00.000-06:00",
                    "endTime": "1496275140000",
                    "endTimeString": "2017-05-31T17:59:00.000-06:00",
                    "price": 0.0,
                    "hasPreview": false,
                    "rentalWindowInHours": 24,
                    "cancellationWindowInMinutes": 0,
                    "providerAssetID": "epixhd.com::XPMV0000000000522797",
                    "tmsProviderProgramID": "MV006133690000",
                    "thePlatformMediaId": "793632323941",
                    "ondemandStreamType": "SVOD",
                    "display_runtime": "01:30:00",
                    "availableOutOfHome": true,
                    "availableInHome": true,
                    "mediaUrl": "/ipvs/api/smarttv/stream/vod/v1/epixhd.com::XPMV0000000000522797",
                    "premium": true,
                    "primaryAudioLanguage": "en",
                    "isAvailableOnISAVod": false,
                    "entitled": true,
                    "parentallyBlockedByChannel": false,
                    "parentallyBlockedByRating": true,
                    "tricks_mode": {}
                },
                "network": {
                    "callsign": "EPIX",
                    "image_uri": "https://pi-sit-b.timewarnercable.com/imageserver/image/default",
                    "name": "Epix",
                    "product_provider": "EPXOD:EPIX_HD",
                    "product_providers": ["EPXOD:EPIX_HD"],
                    "networkImageQueryParams": "providerId=EPIX_HD&productId=EPXOD"
                },
                "defaultStream": true
            }],
            "actionGroups": {
                "defaultGroup": {
                    "actionObjects": [{
                        "actionType": "watchOnDemandIP",
                        "streamIndex": 0
                    }, {
                        "actionType": "addToWatchList",
                        "streamIndex": 0
                    }]
                },
                "othersGroup": [{
                    "title": "Watch Here",
                    "actionObjects": []
                }, {
                    "title": "Watch On TV",
                    "actionObjects": []
                }]
            },
            "title": "Norm of the North",
            "titleWithoutArticles": "Norm of the North",
            "uri": "/nationalnavigation/V1/symphoni/event/tmsid/MV006133690000?division=ATGW-SIT12&lineup=202&application=VOD_PORTAL&profile=ovp_v4&cacheID=5"
        }]
    }
}
