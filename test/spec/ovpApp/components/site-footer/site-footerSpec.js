describe('ovpApp.components.ovpFooter', function () {
    'use strict';

    let environmentConstants, scope, config, controller;

    beforeEach(module('ovpApp.services.errorCodes'));

    beforeEach(module('ovpApp.config'));
    beforeEach(module('ovpApp.components.ovpFooter'));
    beforeEach(inject(function ($rootScope, _environmentConstants_, _config_, _$componentController_) {
        scope = $rootScope.$new();
        environmentConstants = _environmentConstants_;

        controller = _$componentController_('siteFooter');

        config = _config_;
    }));

    it('if the environment is production, devTools is hidden', function () {
        config.environmentKey = 'prod';

        controller.$onInit();
        expect(controller.showDev).toEqual(false);
    });

    it('if the environment is not production, devTools is not hidden', function () {
        config.environmentKey = 'sitb';

        controller.$onInit();
        expect(controller.showDev).toEqual(true);
    });

});
