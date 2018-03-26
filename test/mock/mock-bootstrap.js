define(function (require, exports, module) {
    'use strict';

    var config = require('config/config'),
        MockRegistrar = require('mock/mock-registrar').MockRegistrar,
        mockRegistrar = new MockRegistrar(),
        login = require('mock/login-mock'),

        features = module.exports.FEATURES = {
            LOGIN: 'login',
            RDVR: 'rdvr'
        };

    if (config.useFixtures) {
        mockRegistrar.registerFeatureMock(features.LOGIN, function () {
            login.mock();
        });

        mockRegistrar.registerFeatureMock(features.RDVR, function () {
            return 'ovpApp.rdvr.mockDataService';
        });
    }

    module.exports.bootstrap = function (features) {
        var ngModules = [];

        if (config.useFixtures) {
            for (var i = 0; i < features.length; i++) {
                var ngModule = mockRegistrar.mockFeature(features[i]);

                if (ngModule) {
                    ngModules.push(ngModule);
                }
            }
        }

        return ngModules;
    };
});
