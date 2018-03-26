var subject, mockAnalyticsService;

describe('ovpApp.analytics.events.login', function () {
    'use strict';

    beforeEach(function () {
        module('ovpApp.analytics.events.login');
        module('ovpApp.analytics');
    });

    beforeEach(inject(function(
        _$injector_, _analyticsService_,
        _login_){

        mockAnalyticsService = _analyticsService_;
        subject = _login_;
     }));

    it('should expand an oauthToken', function() {

        // Expand no fields if source fields are empty
        let expanded = subject.expandOauthToken({});
        expect(expanded.oAuthToken).toEqual(undefined);
        expect(expanded.oAuthExpirationTimestamp).toEqual(undefined);

        // Expand no fields if source fields are empty
        expanded = subject.expandOauthToken({
            oauth: {}
        });
        expect(expanded.oAuthToken).toEqual(undefined);
        expect(expanded.oAuthExpirationTimestamp).toEqual(undefined);

        // Expand no fields if source fields are empty
        expanded = subject.expandOauthToken({
            oauth: {
                token: 'a'
            }
        });
        expect(expanded.oAuthToken).toEqual('a');
        expect(expanded.oAuthExpirationTimestamp).toEqual(undefined);

        // Expand no fields if source fields are empty
        expanded = subject.expandOauthToken({
            oauth: {
                expiration: '12'
            }
        });
        expect(expanded.oAuthToken).toEqual(undefined);
        expect(expanded.oAuthExpirationTimestamp).toEqual(12);

        // Expand no fields if source fields are empty
        expanded = subject.expandOauthToken({
            oauth: {
                token: 'a',
                expiration: '12'
            }
        });
        expect(expanded.oAuthToken).toEqual('a');
        expect(expanded.oAuthExpirationTimestamp).toEqual(12);
    });

});
