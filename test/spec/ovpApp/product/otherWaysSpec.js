
describe('ovpApp.product.movieController', function () {
    'use strict';

    var $rootScope, $compile, $httpBackend;

    beforeEach(function () {
        module('ovpApp.product.otherWays');
        module('ovpApp.ovpAppTemplates');
        module('ovpApp.dataDelegate');
    });

    beforeEach(module('ovpApp.services.splunk', function($provide) {
        $provide.value('SplunkService', {});
    }));

    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(module(function($provide) {
        const noop = () => {}
        let mockDateFormat = {
            relative: {
                expanded: {
                    atTime: noop
                },
                short: noop
            }
        }
        mockDateFormat.relative.short.atTime = noop;
        $provide.value('dateFormat', mockDateFormat);
        $provide.value('errorCodesService', mockErrorCodesService);
    }));

    /* jscs: disable */
    beforeEach(inject(function (_$rootScope_, _$compile_, _$injector_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $httpBackend = _$injector_.get('$httpBackend');
        $httpBackend.whenGET('/api/smarttv/info/v1/ipvideotrial')
                    .respond(200, {});
    }));

    describe('OtherWaysController', function () {

        it('should create an element', function() {
            var htmlStr = compileDirective();
            expect(htmlStr).toBeDefined();
        });

        it('should create a label', function () {
            var htmlStr = compileDirective();
            expect(htmlStr).toContain('Future Airing');
            expect(htmlStr).toContain('On Demand');
        });

        function compileDirective() {
            var date = new Date();
            date.setHours(18);
            date.setMinutes(0);
            var epoch6 = date.getTime() + '';
            date.setHours(19);
            var today7 = date.getTime() + '';

            $rootScope.vm = {
                movie: {
                    watchOnTvActions: [
                        {
                            actionType: 'futureAiring',
                            streamIndex: 0
                        },
                        {
                            actionType: 'futureAiring',
                            streamIndex: 1
                        },
                        {
                            actionType: 'watchOnDemandIP',
                            streamIndex: 2
                        }
                    ],
                    watchHereActions: [],
                    streamList: [
                        {
                            streamProperties: {
                                startTime: '1454790735000',
                                endTime: '1454790745000'
                            }
                        },
                        {
                            streamProperties: {
                                startTime: epoch6,
                                endTime: today7
                            }
                        },
                        {
                            streamProperties: {
                                startTime: '1454590735000',
                                endTime: '1454790735000'
                            }
                        }
                    ]
                }
            };
            var compiled = $compile('<other-ways asset="vm.movie" class="other-ways"></other-ways>')($rootScope);

            $rootScope.$digest();

            var htmlStr = compiled[0].innerHTML;
            return htmlStr;
        }

    });
});
