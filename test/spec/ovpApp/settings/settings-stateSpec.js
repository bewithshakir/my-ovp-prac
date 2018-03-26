/*jshint undef: false */
/*jshint nomen: true */
describe('ovpApp.settings.settingsStateService', function () {
    'use strict';

    var $injector, config, stbs = [], $q, $rootScope;

    beforeEach(function () {
        module('ovpApp.settings.settingsStateService');
        module(function ($provide) {
            $provide.constant('stbService', {
                getSTBs: function () {
                    return $q.resolve(stbs);
                }
            });
            $provide.constant('capabilitiesService', {
                hasCapability: function () {
                    return $q.resolve(true);
                },
                isTVODRentEnabled: function () {
                    return $q.resolve(true);
                },
                isAccessibilityEnabled: function () {
                    return $q.resolve(true);
                }
            });
        });
    });

    beforeEach(inject(function (_$injector_, _config_, _$q_, _$rootScope_) {
        $injector = _$injector_;
        config = _config_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should get the menu states', function () {
        let settingsStateService = $injector.get('settingsStateService');
        expect(settingsStateService.states.length).toBeGreaterThan(0);
    });

    it('should only enable the stb settings menu if stbs exist', function () {
        config.stbSettingsEnabled = true;
        let settingsStateService = $injector.get('settingsStateService');
        //Force a digest cycle to finish the $q.all in the state service init
        $rootScope.$apply();

        expect(settingsStateService.states.some(item => {
            return item.state.indexOf('ovp.settings.stb.') === 0 && item.enabled();
        })).toBe(false, 'Some stb settings menu items are enabled');
    });

});
