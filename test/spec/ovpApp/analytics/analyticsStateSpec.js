
describe('ovpApp.analytics.state', function () {
    'use strict';

    var subject;

    beforeEach(function () {
        module('ovpApp.analytics.state');
    });

    beforeEach(inject(function(_AnalyticsState_){
        subject = new _AnalyticsState_();
    }));

    it('AnalyticsState should not be null', function() {
        expect(subject).not.toBeNull();
        expect(typeof subject).toEqual('object');
        expect(typeof subject.getLastStreamUriEvent).toEqual('function');
    });

    it('AnalyticsState should get and set the TvodFlowState', function() {
        expect(subject.getTvodFlowState()).toBeNull();

        let exampleData = {
            value: 1
        };

        subject.setTvodFlowState(exampleData);
        expect(subject.getTvodFlowState()).toBe(exampleData);
    });
});
