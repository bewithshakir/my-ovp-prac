/* globals process */
/**
 * Print results from a stream to stdout
 *
 * getMessages is a function to return the list of results
 */

var map = require('map-stream'),
    os = require('os');

module.exports = function (getMessages) {
    'use strict';

    return map(function (f, cb) {
        var messages = getMessages(f);

        if (messages && messages.length) {
            process.stdout.write(messages.join(os.EOL) + os.EOL);
        }

        cb(null, f);
    });
};
