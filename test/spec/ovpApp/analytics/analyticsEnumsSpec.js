
describe('ovpApp.analytics.analyticsEnums', function () {
    'use strict';

    var subject;

    beforeEach(function () {
        module('ovpApp.analytics.analyticsEnums');
    });

    beforeEach(inject(function(_analyticsEnums_){
        subject = _analyticsEnums_;
    }));

    it('should be obtainable and have values', function() {
        expect(subject).not.toBeNull();

        expect(subject.SearchType).not.toBeNull();
        expect(subject.SearchType.PREDICTIVE).not.toBeNull();

        expect(subject.ViewRenderedStatus).not.toBeNull();
        expect(subject.ViewRenderedStatus.COMPLETE).not.toBeNull();
    });
});
