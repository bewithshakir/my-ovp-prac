define(function (require, exports, module) {
    'use strict';

    var MockRegistrar = module.exports.MockRegistrar = function () {
        this.featureMocks = {};
    };

    /**
     * Register a mock by general category name (RDVR, login, etc)
     *
     * mockFn should return the name of any ng modules that need to be loaded
     */
    MockRegistrar.prototype.registerFeatureMock = function (name, mockFn) {
        this.featureMocks[name] = mockFn;
    };

    MockRegistrar.prototype.mockFeature = function (name) {
        var mockFn = this.featureMocks[name];

        if (mockFn) {
            return mockFn();
        }
    };
});
