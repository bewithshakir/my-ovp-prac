'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.legacy.stringUtil', []).factory('stringUtil', LegacyStringUtil);

    /* ngInject */
    function LegacyStringUtil() {
        var keystr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            service = {
            guid: guid,
            fromBase64: base64decode,
            toBase64: base64encode,
            addParameterToUri: addParameterToUri,
            extractSingleValueParametersAsObject: extractSingleValueParametersAsObject,
            capitalizeFirstLetter: capitalizeFirstLetter,
            formatPageTitle: formatPageTitle
        };

        return service;

        /**
         * Produce a randomly-generated GUID in the format:
         * 8-4-4-4-12
         * Example: 123e4567-e89b-12d3-a456-426655440000
         * @see http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
         * @return {string} GUID
         */
        /* jscs:disable */
        function guid() {
            // Embedded '4' marks this as a 'version 4' (aka randomly-generated) GUID.
            /*jslint bitwise: true */
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
            /*jslint bitwise: false */
        }
        /* jscs:enable */

        function base64encode(input) {
            var output = '',
                chr1,
                chr2,
                chr3,
                enc1,
                enc2,
                enc3,
                enc4,
                i = 0;
            input = utf8Encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                /* jshint ignore:start */
                enc1 = chr1 >> 2;
                enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                enc4 = chr3 & 63;
                /* jshint ignore:end */

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + keystr.charAt(enc1) + keystr.charAt(enc2) + keystr.charAt(enc3) + keystr.charAt(enc4);
            }
            return output;
        }

        function base64decode(input) {
            var output = '',
                chr1,
                chr2,
                chr3,
                enc1,
                enc2,
                enc3,
                enc4,
                i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

            while (i < input.length) {

                enc1 = keystr.indexOf(input.charAt(i++));
                enc2 = keystr.indexOf(input.charAt(i++));
                enc3 = keystr.indexOf(input.charAt(i++));
                enc4 = keystr.indexOf(input.charAt(i++));

                /* jshint ignore:start */
                chr1 = enc1 << 2 | enc2 >> 4;
                chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                chr3 = (enc3 & 3) << 6 | enc4;
                /* jshint ignore:end */

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }

            output = utf8Decode(output);

            return output;
        }

        function utf8Encode(string) {
            string = string.replace(/\r\n/g, '\n');
            var utftext = '',
                c,
                n;

            for (n = 0; n < string.length; n++) {

                c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    utftext += String.fromCharCode(c >> 6 | 192); //jshint ignore:line
                    utftext += String.fromCharCode(c & 63 | 128); //jshint ignore:line
                } else {
                        utftext += String.fromCharCode(c >> 12 | 224); //jshint ignore:line
                        utftext += String.fromCharCode(c >> 6 & 63 | 128); //jshint ignore:line
                        utftext += String.fromCharCode(c & 63 | 128); //jshint ignore:line
                    }
            }

            return utftext;
        }

        function utf8Decode(utftext) {
            var string = '',
                i = 0,
                c = 0,
                c2 = 0,
                c3;

            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if (c > 191 && c < 224) {
                    c2 = utftext.charCodeAt(i + 1);
                    /* jshint ignore:start */
                    string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                    /* jshint ignore:end */
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    /* jshint ignore:start */
                    string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    /* jshint ignore:end */
                    i += 3;
                }
            }
            return string;
        }

        function addParameterToUri(uri, parameter, value) {

            // Do nothing if any value is missing.
            if (!uri || !parameter || !value) {
                return uri;
            }

            if (uri.indexOf('?') < 0) {
                // No parameters in URI yet. This would be the first.
                return uri + '?' + parameter + '=' + encodeURI(value);
            }

            // URI has parameters.
            return uri + '&' + parameter + '=' + encodeURI(value);
        }

        /**
         * Extract single value query parameters and values from a URI.
         * Based on logic from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
         *
         * Example: Given URI of http://watch.spectrumtv.net/?a=one&b=two, this will return
         * an object like: {a: 'one', b: 'two'}
         *
         * @param uri The URI containing query parameters to parse out.
         *
         * @return An object containing the query parameters and their values. This will never be null.
         */
        function extractSingleValueParametersAsObject(uri) {

            var urlParams = {};

            try {
                var _ret = (function () {

                    // If no URI, return empty object result.
                    if (!uri) {
                        return {
                            v: urlParams
                        };
                    }

                    var queryString = undefined;

                    var queryIdx = uri.indexOf('?');
                    if (queryIdx < 0) {
                        // No query string, so return default empty object.
                        return {
                            v: urlParams
                        };
                    } else if (queryIdx === 0) {
                        // The given uri is a query string, beginning with "?".
                        queryString = uri;
                    } else {
                        // Common case: URI with a query string, like "http://watch.spectrumtv.net/?a=one&b=two"
                        queryString = '?' + uri.split('?')[1];
                    }

                    // Use regex to split out the query parameters.
                    var match = undefined,
                        pl = /\+/g,
                        // Regex for replacing addition symbol with a space
                    search = /([^&=]+)=?([^&]*)/g,
                        decode = function decode(s) {
                        return decodeURIComponent(s.replace(pl, ' '));
                    },
                        query = queryString.substring(1);

                    // Build up the result object with matching query parameters and their values.
                    match = search.exec(query);
                    while (match) {
                        urlParams[decode(match[1])] = decode(match[2]);
                        match = search.exec(query);
                    }
                })();

                if (typeof _ret === 'object') return _ret.v;
            } catch (ex) {
                // console.error(ex);
            }
            return urlParams;
        }

        function formatPageTitle(str) {
            str = str.replace('_', ' ');
            str = capitalizeFirstLetter(str);
            str = str.replace('Tv', 'TV');
            return str;
        }

        function capitalizeFirstLetter(string) {
            var str = '';
            var words = string.split(' ');
            words.forEach(function (word) {
                str += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
            });
            return str;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/string-utils-service.js.map
