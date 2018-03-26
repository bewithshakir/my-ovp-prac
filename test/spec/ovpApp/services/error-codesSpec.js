/* globals inject, mockData */
/* jshint jasmine: true */

describe('ovpApp.services.errorCodes', function () {
    'use strict';
    var errorCodesService, $httpBackend, mockData;

    beforeEach(module('ovpApp.services.errorCodes'));
    beforeEach(inject(function(_errorCodesService_, _$httpBackend_) {
        errorCodesService = _errorCodesService_;
        $httpBackend = _$httpBackend_;
        jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
        mockData = getJSONFixture('errorCodes.json');
    }));

    it('error codes default should return when error codes service call fails', () => {
        $httpBackend.expectGET('/tdcs/public/errors?apiKey=void&clientType=ONEAPP-OVP')
            .respond(500);
        $httpBackend.flush();

        expect(errorCodesService.getMessageForCode('TMP-1000')).toBe('We\'re sorry, something didn\'t work quite right. Please try again later.');
    });

    it('error codes should return default error message when no error code exists', () => {
        pending('STVWEB-1044');
        expect(false).toBe(true);
    });

    it('error code should replace wildcard with value', () => {
        let str = errorCodesService.getMessageForCode('WCM-1439', {
            TITLE: 'INSERTIONTESTSTRING'
        });
        expect(str).toBe('INSERTIONTESTSTRING is already scheduled to record.');
    });

    it('should replace {{ERROR_CODE}} by with the current error code', () => {
        expect(errorCodesService.getMessageForCode('WEN-1022', {
            TITLE: 'INSERTIONTESTSTRING'
        })).toBe('We\'re sorry, we\'re having trouble verifying your subscription.' + 
        ' Please give us a call at (855) 757-7328 and we\'ll be happy to help.');
    });

    it('should show the raw variable if not replaced', () => {
        let failResult = errorCodesService.getMessageForCode('WCM-1439', {
            NTITLE: 'INSERTIONTESTSTRING'
        });
        expect(failResult).toBe('{{TITLE}} is already scheduled to record.');
    });

    it('error code service is should update error codes if the ecdb has changed', () => {
        //http://restpatterns.mindtouch.us/HTTP_Headers/If-Modified-Since
        //service will return a 304 if not modified header is same as millisecond timestamp
        pending('STVWEB-1144');
        expect(false).toBe(true);
    });
});
