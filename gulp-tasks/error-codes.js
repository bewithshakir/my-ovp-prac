(function () {
    'use strict';
    var gulp = require('gulp'),
        opts = require('./build-config.js'),
        download = require('gulp-download'),
        rename = require('gulp-rename'),
        debug = require('gulp-debug'),
        transform = require('gulp-transform'),
        changed = require('gulp-changed'),
        runSequence = require('run-sequence'),
        timestamp = Date(),
        dest = './ovp2/web-app/js/ovpApp/config/error-codes/',
        filename = 'error-codes-defaults.js';

    gulp.task('update-error-codes', function (done) {
        runSequence(
            'download-error-codes',
            'check-for-error-code-changes',
        done);
    });

    gulp.task('download-error-codes', function() {
        var url = opts.getErrorCodeDBUrl();
        return download(url)
            .pipe(transform('utf8', function(content){
                var transformed = `
// Last Updated: ${timestamp}
// jscs:disable
/* eslint-disable */
// jshint ignore: start
(function () {
    'use strict';

    /**
     *        ~~~~~~~~~~~~~~~DO NOT EDIT THIS FILE DIRECTLY~~~~~~~~~~~~~~
     * This file is automatically generated by the gulp task 'update-error-codes'.
     * If you need to add additional error codes that do not exist in the ECDB, 
     * you can do so in ./error-codes-overrides.js.
     */

    angular.module('ovpApp.config.errorCodes.defaults', [])
        .constant('ERROR_CODES_DEFAULTS', ${content})
        .constant('ERROR_CODES_LAST_UPDATED', '${timestamp}');
}());
`;
                return transformed;
            }))
            .pipe(debug({title: 'error-codes:'}))
            .pipe(rename(filename))
            .pipe(gulp.dest('temp/error-codes'))
            .pipe(debug({title: 'error-codes: saving temp file:'}));
    });

    gulp.task('check-for-error-code-changes', function() {
        return gulp.src('temp/error-codes/*.js')
        .pipe(changed(dest))
        .pipe(debug({title: 'error-codes: checking for changes:'}))
        .pipe(gulp.dest(dest));
    });
    
}());