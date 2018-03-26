/*
 * Map jscs output to result set
 */

var map = require('map-stream'),
    fs = require('fs'),
    jscs = require('jscs');

module.exports = map(function (file, cb) {
    'use strict';

    var presets;

    file.jscs = {
        errors: []
    };

    fs.readFile('.jscsrc', 'utf8', function (err, data) {
        if (err) {
            file.jscs.errors.push(err);
        } else {
            presets = JSON.parse(data);
            try {
                var jscsInstance = new jscs();
                jscsInstance.registerDefaultRules();
                jscsInstance.configure(presets);
                var errors = jscsInstance.checkString(file.contents.toString(), file.relative);
                errors.getErrorList().forEach(function (err) {
                    err.file = file.path;
                    err.explanation = errors.explainError(err, true);
                    file.jscs.errors.push(err);
                });
            } catch (err) {
                err.file = file.path;
                err.explanation = err.message.replace('null:', file.relative + ':');
                file.jscs.errors.push(err);
            }
            cb(null, file);
        }
    });
});
