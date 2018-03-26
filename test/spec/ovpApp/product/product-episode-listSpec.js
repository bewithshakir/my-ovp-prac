/* globals inject */
/* jshint jasmine: true */
describe('ovpApp.product.episodes', function () {
    'use strict';

    let $rootScope, $scope, controller, $compile, $componentController;

    beforeEach(module('ovpApp.product.episodes'));

    beforeEach(module(function($provide) {
        const noop = () => {}
        let mockDateFormat = {
            absolute: {
                atTime: jasmine.createSpy().and.returnValue('formatted date')
            }
        }
        $provide.value('dateFormat', mockDateFormat);
    }));

    beforeEach(inject(function (_$rootScope_, _$compile_, $httpBackend, _$componentController_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $componentController = _$componentController_;
        $compile = _$compile_;

        $httpBackend.expectGET('/js/ovpApp/product/product-episode-list.html')
            .respond(200, '<div>hello world</div>')
    }));

    describe('extractBonusContent', function () {
        beforeEach(function () {    
            let element = angular.element("<product-episode-list></product-episode-list>")
            element = $compile(element)($scope);
            controller = $componentController('productEpisodeList', {
                $scope: $scope,
                productService: {},
                $state: {
                    previous: {name: ''}, 
                    go: () => {}
                },
                $stateParams: {
                    app: null,
                    tmsProgramId: null
                },
                $element: element
            }, {series: {}});
        });

        it('should do normal seasons if there is no bonus content', function () {
            let season1 = {
                name: 'Season 1',
                episodes: []
            };
            let season2 = {
                name: 'Season 2',
                episodes: []
            };

            controller.series.seasons =[season1, season2];
            controller.extractBonusContent();

            expect(controller.seasons).toBeDefined();
            expect(controller.seasons.length).toEqual(2);
            expect(controller.seasons[0]).toEqual(season1);
            expect(controller.seasons[1]).toEqual(season2);
        });

        it('should put preview episodes in preview season', function () {
            let other = {
                name: 'Other',
                episodes: [{
                    title: 'a',
                    isPreview: true
                }, {
                    title: 'b',
                    isPreview: true
                }]
            };

            let season1 = {
                name: 'Season 1',
                episodes: []
            };
            let season2 = {
                name: 'Season 2',
                episodes: []
            };

            controller.series.seasons =[other, season1, season2];
            controller.extractBonusContent();

            expect(controller.seasons).toBeDefined();
            expect(controller.seasons.length).toEqual(3);
            expect(controller.seasons[0]).toEqual(season1);
            expect(controller.seasons[1]).toEqual(season2);
            expect(controller.seasons[2].name).toEqual('Clips and more');
            expect(controller.seasons[2].episodes).toBeDefined();
            expect(controller.seasons[2].episodes.length).toEqual(2);
        });

        it('should put nonpreview episodes in other season', function () {
            let other = {
                name: 'Other',
                episodes: [{
                    title: 'a',
                    isPreview: false
                }, {
                    title: 'b',
                    isPreview: false
                }]
            };

            let season1 = {
                name: 'Season 1',
                episodes: []
            };
            let season2 = {
                name: 'Season 2',
                episodes: []
            };

            controller.series.seasons = [other, season1, season2];
            controller.extractBonusContent();

            expect(controller.seasons).toBeDefined();
            expect(controller.seasons.length).toEqual(3);
            expect(controller.seasons[0]).toEqual(season1);
            expect(controller.seasons[1]).toEqual(season2);
            expect(controller.seasons[2].name).toEqual('Other episodes');
            expect(controller.seasons[2].episodes).toBeDefined();
            expect(controller.seasons[2].episodes.length).toEqual(2);
        });

        it('should create both preview and other if both are needed', function () {
            let other = {
                name: 'Other',
                episodes: [{
                    title: 'a',
                    isPreview: false
                }, {
                    title: 'b',
                    isPreview: true
                }]
            };

            let season1 = {
                name: 'Season 1',
                episodes: []
            };
            let season2 = {
                name: 'Season 2',
                episodes: []
            };

            controller.series.seasons = [other, season1, season2];
            controller.extractBonusContent();

            expect(controller.seasons).toBeDefined();
            expect(controller.seasons.length).toEqual(4);
            expect(controller.seasons[0]).toEqual(season1);
            expect(controller.seasons[1]).toEqual(season2);
            expect(controller.seasons[2].name).toEqual('Other episodes');
            expect(controller.seasons[2].episodes).toBeDefined();
            expect(controller.seasons[2].episodes.length).toEqual(1);
            expect(controller.seasons[2].episodes[0].title).toEqual('a');
            expect(controller.seasons[3].name).toEqual('Clips and more');
            expect(controller.seasons[3].episodes).toBeDefined();
            expect(controller.seasons[3].episodes.length).toEqual(1);
            expect(controller.seasons[3].episodes[0].title).toEqual('b');
        });
    });

    describe('findNextEpisode', function () {
        beforeEach(function () {
            let element = angular.element("<product-episode-list></product-episode-list>")
            element = $compile(element)($scope);
            controller = $componentController('productEpisodeList', {
                $scope: $scope,
                productService: {},
                $state: {
                    previous: {name: 'ovp.ondemand.majorCategory'}, 
                    go: () => {}
                },
                $element: element
            }, {series: {}});
        });

        function season(seasonNumber, episodeNumbers) {
            return {
                name: 'Season ' + seasonNumber,
                number: seasonNumber,
                episodes: episodeNumbers.map(num => ep(seasonNumber, num))
            }
        }

        function ep(seasonNumber, episodeNumber) {
            return {
                seasonNumber,
                episodeNumber,
                originalAirDate: 1000 * seasonNumber + episodeNumber
            }
        }

        it('should find next episode in same season', function () {
            let mockSeasons = [
                season(1, [1, 2, 3]), 
                season(2, [1, 2, 3])
            ];

            let result = controller.findNextEpisode(mockSeasons[0].episodes[0], mockSeasons);

            expect(result).toBe(mockSeasons[0].episodes[1]);
        });

        it('should find next episode in same season (opposite episode order)', function () {
            let mockSeasons = [
                season(1, [3, 2, 1]), 
                season(2, [3, 2, 1])
            ];

            let result = controller.findNextEpisode(mockSeasons[0].episodes[2], mockSeasons);

            expect(result).toBe(mockSeasons[0].episodes[1]);
        });

        it('should find next episode in same season, with gap', function () {
            let mockSeasons = [
                season(1, [1, 3, 4]), 
                season(2, [1, 2, 3])
            ];

            let result = controller.findNextEpisode(mockSeasons[0].episodes[0], mockSeasons);

            expect(result).toBe(mockSeasons[0].episodes[1]);
        });

        it('should find next episode in next season', function () {
            let mockSeasons = [
                season(1, [1, 2, 3]), 
                season(2, [1, 2, 3]),
                season(3, [1, 2, 3])
            ];

            let result = controller.findNextEpisode(mockSeasons[0].episodes[2], mockSeasons);

            expect(result).toBe(mockSeasons[1].episodes[0]);
        });


        it('should find next episode in next season (opposite season order)', function () {
            let mockSeasons = [
                season(3, [1, 2, 3]),
                season(2, [1, 2, 3]),
                season(1, [1, 2, 3]) 
            ];

            let result = controller.findNextEpisode(mockSeasons[2].episodes[2], mockSeasons);

            expect(result).toBe(mockSeasons[1].episodes[0]);
        });

        it('should find next episode in next season with episode gap', function () {
            let mockSeasons = [
                season(1, [1, 2, 3]), 
                season(2, [2, 3, 4])
            ];

            let result = controller.findNextEpisode(mockSeasons[0].episodes[2], mockSeasons);

            expect(result).toBe(mockSeasons[1].episodes[0]);
        });

        it('should find next episode in next season with season gap', function () {
            let mockSeasons = [
                season(1, [1, 2, 3]), 
                season(3, [1, 2, 3])
            ];

            let result = controller.findNextEpisode(mockSeasons[0].episodes[2], mockSeasons);

            expect(result).toBe(mockSeasons[1].episodes[0]);
        });

        it('should return undefined if no episode number available', function () {
            let mockSeasons = [{
                name: 'Other',
                number: 0,
                episodes: [{
                    seasonNumber: undefined,
                    episodeNumber: undefined,
                    originalAirDate: 1000
                }, {
                    seasonNumber: undefined,
                    episodeNumber: undefined,
                    originalAirDate: 2000
                }]
            }];

            let result = controller.findNextEpisode(mockSeasons[0].episodes[0], mockSeasons);

            expect(result).toEqual(undefined);
        });

        it('should return undefined if no next episode can be found', function () {
            let mockSeasons = [
                season(1, [1, 2]), 
                season(2, [1, 2])
            ];

            let result = controller.findNextEpisode(mockSeasons[1].episodes[1], mockSeasons);

            expect(result).toEqual(undefined);
        });
    });

    describe('pickElevatedEpisode', function () {
        describe('from livetv', function () {
            const seasonName = 'Currently airing live';

            beforeEach(function () {
                let element = angular.element("<product-episode-list></product-episode-list>")
                element = $compile(element)($scope);
                controller = $componentController('productEpisodeList', {
                    $scope: $scope,
                    productService: {},
                    $state: {
                        previous: {name: 'ovp.livetv'}, 
                        go: () => {}
                    },
                    $element: element
                }, {series: {}});
                controller.app = "livetv";
            });

            it('should elevate currently airing if 1 exists', function () {
                let notLive = {};
                let live = {
                    isOnNow: true
                };
                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [notLive, live]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual(seasonName);
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(live);
                expect(controller.elevated.episode).not.toBe(live, 'should copy');
                expect(controller.seasons[0].episodes[1]).toBe(live, 'should leave original in place');
            });

            it('should work with more than 1 season', function () {
                let notLive1 = {};
                let notLive2 = {};
                let live = {
                    isOnNow: true
                };

                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [notLive1, notLive2]
                }, {
                    name: 'Season 2',
                    episodes: [live]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual(seasonName);
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(live);
                expect(controller.elevated.episode).not.toBe(live, 'should copy');
                expect(controller.seasons[1].episodes[0]).toBe(live, 'should leave original in place');
            });

            it('should elevate first if multiple exists', function () {
                let notLive = {};
                let live1 = {
                    isOnNow: true
                };
                let live2 = {
                    isOnNow: true
                };

                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [notLive, live1]
                }, {
                    name: 'Season 2',
                    episodes: [live2]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual(seasonName);
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(live1);
                expect(controller.elevated.episode).not.toBe(live1, 'should copy');
                expect(controller.seasons[0].episodes[1]).toBe(live1, 'should leave original in place');
            });

            it('should elevate nothing if nothing is currently airing', function () {
                
            });
        });

        describe('from ondemand', function () {
            beforeEach(function () {
                let element = angular.element("<product-episode-list></product-episode-list>")
                element = $compile(element)($scope);
                controller = $componentController('productEpisodeList', {
                    $scope: $scope,
                    productService: {},
                    $state: {
                        previous: {name: 'ovp.ondemand.majorCategory'}, 
                        go: () => {}
                    },
                    $element: element
                }, {series: {}});
                controller.app = "ondemand";
            });

            it('should elevate most recently bookmarked episode if it is incomplete', function () {
                let neverPlayed = {

                };
                let mostRecent = {
                    bookmark: {
                        lastWatchedUtcSeconds: 1000,
                        complete: false,
                        playMarkerSeconds: 50,
                        runtimeSeconds: 100
                    }
                };
                let notAsRecent = {
                    bookmark: {
                        lastWatchedUtcSeconds: 999,
                        complete: false,
                        playMarkerSeconds: 50,
                        runtimeSeconds: 100
                    },
                };
                let onNowButNotBookmarked = {
                    isOnNow: true
                };

                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [neverPlayed, mostRecent]
                }, {
                    name: 'Season 2',
                    episodes: [onNowButNotBookmarked, notAsRecent]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual('You were watching');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(mostRecent);
                expect(controller.elevated.episode).not.toBe(mostRecent, 'should copy');
                expect(controller.seasons[0].episodes[1]).toBe(mostRecent, 'should leave original in place');
            });

            it('should elevate next episode if most recently bookmarked is complete', function () {
                let neverPlayed = {
                    seasonNumber: 1,
                    episodeNumber: 1
                };
                let mostRecent = {
                    seasonNumber: 1,
                    episodeNumber: 2,
                    bookmark: {
                        lastWatchedUtcSeconds: 1000,
                        complete: true,
                        playMarkerSeconds: 50,
                        runtimeSeconds: 100
                    }
                };
                let nextEpisode = {
                    seasonNumber: 2,
                    episodeNumber: 1
                };
                let notAsRecent = {
                    seasonNumber: 2,
                    episodeNumber: 2,
                    bookmark: {
                        lastWatchedUtcSeconds: 999,
                        complete: true,
                        playMarkerSeconds: 50,
                        runtimeSeconds: 100
                    },
                };

                controller.seasons = [{
                    name: 'Season 1',
                    number: 1,
                    episodes: [neverPlayed, mostRecent]
                }, {
                    name: 'Season 2',
                    number: 2,
                    episodes: [nextEpisode, notAsRecent]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual('You finished Episode 2');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(nextEpisode);
                expect(controller.elevated.episode).not.toBe(nextEpisode, 'should copy');
                expect(controller.seasons[1].episodes[0]).toBe(nextEpisode, 'should leave original in place');
            });


            it('should elevate latest episode if there is no next episode', function () {
                let neverPlayed = {
                    seasonNumber: 1,
                    episodeNumber: 1
                };
                let mostRecent = {
                    seasonNumber: 1,
                    episodeNumber: 2,
                    bookmark: {
                        lastWatchedUtcSeconds: 1000,
                        complete: true,
                        playMarkerSeconds: 50,
                        runtimeSeconds: 100
                    }
                };

                controller.seasons = [{
                    name: 'Season 1',
                    number: 1,
                    episodes: [neverPlayed, mostRecent]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual('Watch the latest episode');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(mostRecent);
                expect(controller.elevated.episode).not.toBe(mostRecent, 'should copy');
                expect(controller.seasons[0].episodes[1]).toBe(mostRecent, 'should leave original in place');
            });

            it('should elevate latest by episode number if there is no bookmark', function () {
                let neverPlayed = {
                    seasonNumber: 1,
                    episodeNumber: 1
                };
                let neverPlayed2 = {
                    seasonNumber: 1,
                    episodeNumber: 2,
                };
                let neverPlayed3 = {
                    seasonNumber: 1,
                    episodeNumber: 2,
                };

                controller.seasons = [{
                    name: 'Season 1',
                    number: 1,
                    episodes: [neverPlayed, neverPlayed2]
                }, {
                    name: 'Season 2',
                    numbeR: 2,
                    episodes: [neverPlayed3]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual('Watch the latest episode');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(neverPlayed3);
                expect(controller.elevated.episode).not.toBe(neverPlayed3, 'should copy');
                expect(controller.seasons[1].episodes[0]).toBe(neverPlayed3, 'should leave original in place');
            });

            it('should elevate latest by original air date if there is no bookmark and no season/episode data', function () {
                let neverPlayed = {
                    originalAirDate: 1000
                };
                let neverPlayed2 = {
                    originalAirDate: 2000
                };
                let neverPlayed3 = {
                    originalAirDate: 3000
                };

                controller.seasons = [{
                    name: 'Other',
                    number: 0,
                    episodes: [neverPlayed, neverPlayed2, neverPlayed3]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual('Watch the latest episode');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(neverPlayed3);
                expect(controller.elevated.episode).not.toBe(neverPlayed3, 'should copy');
                expect(controller.seasons[0].episodes[2]).toBe(neverPlayed3, 'should leave original in place');
            });
        });

        describe('from dvr my recordings', function () {
            beforeEach(function () {
                let element = angular.element("<product-episode-list></product-episode-list>")
                element = $compile(element)($scope);
                controller = $componentController('productEpisodeList', {
                    $scope: $scope,
                    productService: {},
                    $state: {
                        previous: {name: 'ovp.dvr.my-recordings'}, 
                        go: () => {}
                    },
                    $element: element
                }, {series: {}});
                controller.app = "rdvr";
            });

            it('should elevate mostRecent recording (in prog)', function () {
                let mostRecent = {
                    streamList: [{
                        isCdvrRecorded: false,
                    }, {
                        isCDVRRecorded: true,
                        cdvrRecording: {
                            stopTimeSec: 200
                        },
                        cdvrState: 'inProgress'
                    }]
                };
                let notAsRecent = {
                    streamList: [{
                        isCDVRRecorded: true,
                        cdvrRecording: {
                            stopTimeSec: 100
                        },
                        cdvrState: 'inProgress'
                    }]
                };
                let notRecorded = {
                    streamList: [{
                        isCdvr: false
                    }]
                };

                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [notRecorded, notAsRecent]
                }, {
                    name: 'Season 2',
                    episodes: [mostRecent]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual('Currently recording');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(mostRecent);
                expect(controller.elevated.episode).not.toBe(mostRecent, 'should copy');
                expect(controller.seasons[1].episodes[0]).toBe(mostRecent, 'should leave original in place');
            });

            it('should elevate mostRecent recording (complete)', function () {
                let mostRecent = {
                    streamList: [{
                        isCdvrRecorded: false,
                    }, {
                        isCDVRRecorded: true,
                        cdvrRecording: {
                            stopTimeSec: 200
                        },
                        cdvrState: 'completed'
                    }]
                };
                let notAsRecent = {
                    streamList: [{
                        isCDVRRecorded: true,
                        cdvrRecording: {
                            stopTimeSec: 100
                        },
                        cdvrState: 'completed'
                    }]
                };
                let notRecorded = {
                    streamList: [{
                        isCdvr: false
                    }]
                };

                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [notRecorded, notAsRecent]
                }, {
                    name: 'Season 2',
                    episodes: [mostRecent]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual('You\'ve recorded');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(mostRecent);
                expect(controller.elevated.episode).not.toBe(mostRecent, 'should copy');
                expect(controller.seasons[1].episodes[0]).toBe(mostRecent, 'should leave original in place');
            });
        });

        describe('from dvr scheduled', function () {
            beforeEach(function () {
                let element = angular.element("<product-episode-list></product-episode-list>")
                element = $compile(element)($scope);
                controller = $componentController('productEpisodeList', {
                    $scope: $scope,
                    productService: {},
                    $state: {
                        previous: {name: 'ovp.dvr.my-recordings'}, 
                        go: () => {}
                    },
                    $element: element
                }, {series: {}});
                controller.app = 'rdvr';
                controller.tmsProgramId = 2;
            });

            function doTest(onNow) {
                let wrongEpisode = {
                    tmsProgramIds: [1, 3, 5, 7],

                };
                let rightEpisode = {
                    tmsProgramIds: [2, 4, 6, 8],
                    isOnNow: onNow,
                    nextLinearStream: {
                        streamProperties: {
                            startTime: 12345
                        }
                    }
                };

                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [wrongEpisode, rightEpisode]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual(onNow ? 'Currently airing live' : 'formatted date');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(rightEpisode);
                expect(controller.elevated.episode).not.toBe(rightEpisode, 'should copy');
                expect(controller.seasons[0].episodes[1]).toBe(rightEpisode, 'should leave original in place');
            }

            it('should elevate specified episode (current)', function () {
                doTest(true);
            });

            it('should elevate specified episode (future)', function () {
                doTest(false);
            });
        });

        describe('from search', function () {
            
        });

        describe('from guide', function () {
            beforeEach(function () {
                let element = angular.element("<product-episode-list></product-episode-list>")
                element = $compile(element)($scope);
                controller = $componentController('productEpisodeList', {
                    $scope: $scope,
                    productService: {},
                    $state: {
                        previous: {name: 'ovp.guide'}, 
                        go: () => {}
                    },
                    $element: element
                }, {series: {}});
                controller.app = "guide";
                controller.tmsProgramId = 2;
            });

            function doTest(onNow) {
                let wrongEpisode = {
                    tmsProgramIds: [1, 3, 5, 7],
                };
                let rightEpisode = {
                    tmsProgramIds: [2, 4, 6, 8],
                    isOnNow: onNow
                };

                controller.seasons = [{
                    name: 'Season 1',
                    episodes: [wrongEpisode, rightEpisode]
                }];

                controller.pickElevatedEpisode();

                expect(controller.elevated).toBeDefined();
                expect(controller.elevated.description).toEqual(onNow ? 'Currently airing live' : 'Upcoming');
                expect(controller.elevated.episode).toBeDefined();
                expect(controller.elevated.episode).toEqual(rightEpisode);
                expect(controller.elevated.episode).not.toBe(rightEpisode, 'should copy');
                expect(controller.seasons[0].episodes[1]).toBe(rightEpisode, 'should leave original in place');
            }

            it('should elevate specified episode (current)', function () {
                doTest(true);
            });

            it('should elevate specified episode (future)', function () {
                doTest(false);
            });
        });
    });

    describe('selectDefaultEpisode', function () {
        beforeEach(function () {      
            let element = angular.element("<product-episode-list></product-episode-list>")
            element = $compile(element)($scope);      
            controller = $componentController('productEpisodeList', {
                $scope: $scope,
                productService: {},
                $state: {
                    previous: {name: ''}, 
                    go: () => {}
                },
                $element: element
            }, {series: {}});
            controller.tmsProgramId = 2;
        });

        it('should match programID if supplied', function () {
            //Injected $stateParams.tmsProgramId = 2

            let match = {
                tmsProgramIds: [1, 2]
            };

            let junk = {
                tmsProgramIds: [3, 4]
            };

            controller.seasons = [{
                name: 'Season 1',
                episodes: [junk, junk, junk]
            }, {
                name: 'Season 2',
                episodes: [junk, match, junk]
            }];

            controller.selectDefaultEpisode();
            expect(controller.selectedEpisode).toBe(match);
        });

        it('should check .seasons, not .series.seasons', function () {
            //Injected $stateParams.tmsProgramId = 2

            let match = {
                tmsProgramIds: [1, 2]
            };

            let wrongMatch = {
                tmsProgramIds: [1, 2]
            };

            controller.seasons = [{
                name: 'Season 1',
                episodes: [match]
            }];

            controller.series.seasons = [{
                name: 'Season 1',
                episodes: [wrongMatch]
            }];

            controller.selectDefaultEpisode();
            expect(controller.selectedEpisode).toBe(match);
        });

        it('should find first match', function () {
            //Injected $stateParams.tmsProgramId = 2

            let match = {
                tmsProgramIds: [1, 2]
            };

            let wrongMatch = {
                tmsProgramIds: [1, 2]
            };

            controller.seasons = [{
                name: 'Continue watching',
                episodes: [match]
            }, {
                name: 'Season 1',
                episodes: [wrongMatch]
            }];

            controller.selectDefaultEpisode();
            expect(controller.selectedEpisode).toBe(match);
        });

        it('should fall back to season 0 episode 0', function () {
            //Inject an empty state
            let element = angular.element("<product-episode-list></product-episode-list>")
            element = $compile(element)($scope);
            var currController = $componentController('productEpisodeList', {
                $scope: $scope,
                productService: {},
                $state: {previous: {name: ''}},
                $element: element
            }, {series: {}});
            currController.tmsProgramId = 2;

            let first = {
                tmsProgramIds: [1, 2]
            };
            let second = {
                tmsProgramIds: [3, 4]
            };
            let third = {
                tmsProgramIds: [5, 6]
            };


            currController.seasons = [{
                name: 'Season 1',
                episodes: [first, second]
            }, {
                name: 'Season 2',
                episodes: [third]
            }];

            currController.selectDefaultEpisode();
            expect(currController.selectedEpisode).toBe(first);
        });
    });
});
