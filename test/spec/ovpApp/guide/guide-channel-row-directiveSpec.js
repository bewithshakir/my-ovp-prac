/* globals window */
describe('GuideChannelRowController', function () {
    'use strict';

    var scope, rootScope, element,
        stagedData = [
            {startTimeSec: 30, tmsProgramId: 3, durationMinutes: 60, icons: ['New', 'HD']},
            {startTimeSec: 40, tmsProgramId: 4, durationMinutes: 60, icons: ['New', 'HD']},
            {startTimeSec: 10, tmsProgramId: 1, durationMinutes: 90, icons: ['New', 'HD']},
            {startTimeSec: 25, tmsProgramId: 2, durationMinutes: 60, icons: []},
            {startTimeSec: 50, tmsProgramId: 5, durationMinutes: 60, icons: ['HD']},
            {startTimeSec: 60, tmsProgramId: 6, durationMinutes: 60, icons: ['HD']},
            {startTimeSec: 70, tmsProgramId: 7, durationMinutes: 60, icons: ['HD']},
            {startTimeSec: 80, tmsProgramId: 8, durationMinutes: 600, icons: ['HD']},
            {startTimeSec: 36080, tmsProgramId: 8, durationMinutes: 60, icons: ['HD']}
        ]
        ;

    beforeEach(module('ovpApp.guide'));
    beforeEach(function () {
        module('ovpApp.services.profileService', function($provide) {
            $provide.value('profileService', mockProfileService);
        });
        module('ovpApp.guide', function ($provide) {
            $provide.factory('guideShowDirective', () => {
                return {};
            });
        });
    });
    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
    }));


    beforeEach(inject(function ($compile, $rootScope) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        element = angular.element('<guide-channel-row></guide-channel-row>');
        $compile(element)(scope, null, {
            transcludeControllers: {
                'guide-scroll-container': {
                    instance: {
                        getPixelsPerHour: function () {
                            return 10;
                        },
                        adjacentZone: function (zone, testZone) {
                            return testZone.indexOf(zone) >= 0;
                        }
                    }
                }
            }
        });

        scope.$digest();
    }));

    it('channel.staged should update channel content', function () {
        window.requestAnimationFrame = function(cb) {
            cb();
        }
        scope.channel = {
            staged: stagedData
        };
        scope.zone = {
            zoneIndex: 0
        };
        rootScope.$broadcast('displayZone', [0,0]);
        scope.$apply();
        expect(scope.channel.staged).toEqual([]);
        expect(element.find('.channel-content').length).toEqual(9);
        rootScope.$broadcast('displayZone', [0, 1]);
        scope.$apply();
        expect(element.find('.channel-content').length).toEqual(9);

    });

    it('displayZone event test', function () {
        scope.channel = {
            staged: stagedData
        };
        scope.zone = {
            zoneIndex: 2
        };
        scope.$apply();
        rootScope.$broadcast('displayZone', [1, 2, 3]);
        expect(scope.channel.displayed).toEqual(true);
        rootScope.$broadcast('displayZone', [4, 5, 6]);
        expect(scope.channel.displayed).toEqual(false);
        scope.zone = {
            zoneIndex: 5
        };
        scope.$apply();
        rootScope.$broadcast('displayZone', [1, 2, 3]);
        expect(scope.channel.displayed).toEqual(false);
        rootScope.$broadcast('displayZone', [4, 5, 6]);
        expect(scope.channel.displayed).toEqual(true);
    });
});
