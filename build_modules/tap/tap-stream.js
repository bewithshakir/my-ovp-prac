/* globals process */
/**
 * Translate stream to TAP and write to file
 *
 * getResults is a function to return the list of results
 */

var fs = require('fs'),
    map = require('map-stream'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    tapStringBuilder = require('./tap-string-builder');

module.exports = function (outputFilePathBase, getResults) {
    'use strict';

    var i = 1;

    return map(function (f, cb) {
        var outputFilePath = outputFilePathBase + i + '.tap',
            j = 1;

        i++;

        var results = getResults(f);

        if (results && results.length) {
            var tap = tapStringBuilder.getTap(results.map(function (result) {
                result.index = j;

                j++;

                return result;
            }));

            if (tap && outputFilePath) {
                mkdirp(path.dirname(outputFilePath), function (err) {
                    if (err) {
                        process.stderr.write(err);

                        cb(err);
                    } else {
                        fs.writeFile(outputFilePath, tap, function (err) {
                            if (err) {
                                process.stderr.write(err);

                                cb(err);
                            } else {
                                cb(null, f);
                            }
                        });
                    }
                });
            } else {
                cb(null, f);
            }
        } else {
            cb(null, f);
        }
    });
};

