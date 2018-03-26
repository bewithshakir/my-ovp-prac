/**
 * Lint angular code
 */

var map = require('map-stream'),
    ngAnnotate = require('ng-annotate'),
    diff = require('diff');

module.exports =  map(function (file, cb) {
    'use strict';

    file.angularLint = {
        errors: []
    };

    var src = file.contents.toString(),
        res = ngAnnotate(src, {
            add: true,
            es6: true
        });

    if (res.src !== src) {
        file.angularLint.errors.push({
            file: file.relative,
            message: diff.createPatch(file.relative, src, res.src, 'Your code', 'Desired code')
        });
    }

    cb(null, file);
});
