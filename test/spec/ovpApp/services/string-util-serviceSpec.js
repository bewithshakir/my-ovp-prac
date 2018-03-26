/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.legacy.stringUtil', function () {
    'use strict';

    var service, $stringUtil, $stringU2;

    beforeEach(module('ovpApp.legacy.stringUtil'));

    /* jscs:disable */
    beforeEach(inject(function (_$injector_) {
        service = _$injector_.get('stringUtil');
    }));
    /* jscs:enable */

    it('should produce version 4 guids of the proper format and length', function () {
        // A 'version 4' GUID is randomly generated. This is indicated with a
        // '4' at the beginning of the third segment.
        let verificationRegex = /^\w{8}[\-]\w{4}[\-][4]{1}\w{3}[\-]\w{4}[\-]\w{12}$/;
        for (var i=0; i<10; ++i) {
            let guid = service.guid();
            if (!verificationRegex.test(guid)) {
                throw 'Invalid version 4 GUID generated: ' + guid;
            }
        }
    });

    it('should add the first parameter to a uri correctly', function () {
        expect(
            service.addParameterToUri('http://watch.spectrum.net/', 'param1', 'value1')).
            toEqual('http://watch.spectrum.net/?param1=value1');
    });

    it('should escape parameter values', function () {
        expect(
            service.addParameterToUri('http://watch.spectrum.net/', 'param1', 'value1 with space')).
            toEqual('http://watch.spectrum.net/?param1=value1%20with%20space');
    });

    it('should not add blank parameter names', function () {
        expect(
            service.addParameterToUri('http://watch.spectrum.net/', '', 'value1')).
            toEqual('http://watch.spectrum.net/');

        expect(
            service.addParameterToUri('http://watch.spectrum.net/', null, 'value1')).
            toEqual('http://watch.spectrum.net/');
    });

    it('should extract parameters from a full URL', function () {
        let result = service.extractSingleValueParametersAsObject('http://watch.spectrum.net/?i=main&mode=front&sid=de8d49b78a85a322c4155015fdce22c4&enc=+Hello%20&empty');

        expect(result).not.toBeNull();
        expect(result.i).toEqual('main');
        expect(result.mode).toEqual('front');
        expect(result.sid).toEqual('de8d49b78a85a322c4155015fdce22c4');
        expect(result.empty).toEqual('');
    });

    it('should extract parameters from just a query string', function () {
        let result = service.extractSingleValueParametersAsObject('?i=main&mode=front&sid=de8d49b78a85a322c4155015fdce22c4&enc=+Hello%20&empty');

        expect(result).not.toBeNull();
        expect(result.i).toEqual('main');
        expect(result.mode).toEqual('front');
        expect(result.sid).toEqual('de8d49b78a85a322c4155015fdce22c4');
        expect(result.empty).toEqual('');
    });

    it('should return an empty object from a null or empty uri', function () {
        let result = service.extractSingleValueParametersAsObject('');
        expect(_.isEmpty(result)).toBeTruthy();

        result = service.extractSingleValueParametersAsObject(null);
        expect(_.isEmpty(result)).toBeTruthy();
    });

    it('should return an empty object from URL without query parameters', function () {
        let result = service.extractSingleValueParametersAsObject('http://watch.spectrum.net/');
        expect(_.isEmpty(result)).toBeTruthy();
    });

});
