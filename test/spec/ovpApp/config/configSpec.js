/* jshint jasmine: true */
/* globals window */
describe('ovpApp.config', function () {
    'use strict';
    var config, configInstance;
    beforeEach(module('ovpApp.config'));
    beforeEach(inject(function (_config_) {
        config = _config_;
    }));

    it('installs version on initialization', function () {
        configInstance = new window.OvpConfig(window.defaultConfig, '1.0.1', window.btoa('[{"name": "test", "default": true, "piHost": "http://localhost:9876", "services": {"config": "/base/test/fixtures/tdcsConfig.json?test=true"}}]'));
        expect(configInstance.version).toEqual('1.0.1');
    });

    it('does not install parameter overrides if production', function (done) {
        window.localStorage.removeItem('device_id');
        window.localStorage.removeItem('env');
        var config = new window.OvpConfig(window.defaultConfig, '1.0.1', window.btoa('[{"name": "prod","default": true,"piHost": "http://localhost:9876","services": {"config": "/base/test/fixtures/tdcsConfig.json?test=true"}}]'), 'prod');
        spyOn(config, 'fetchUrlParamConfigs').and.returnValue({});
        config.initialize(function (err) {
            expect(err).toBe(null);
            done();
        });
        expect(config.fetchUrlParamConfigs.calls.count()).toEqual(0);
    });

    it('does install parameter overrides when not in production', function (done) {
        window.localStorage.removeItem('device_id');
        window.localStorage.removeItem('env');
        var config = new window.OvpConfig(window.defaultConfig, '1.0.1', window.btoa('[{"name": "test", "default": true, "piHost": "http://localhost:9876", "services": {"config": "/base/test/fixtures/tdcsConfig.json?test=true"}}]'), 'test');
        spyOn(config, 'fetchUrlParamConfigs');
        config.initialize(function (err, conf) {
            expect(err).toBe(null);
            expect(config.activityConfigStatus).toBeDefined();
            expect(config.activityConfigStatus).toBe('loaded');
            done();
        }, 'test');
        expect(config.fetchUrlParamConfigs.calls.count()).toEqual(1);
    });
});
