(function () {
    'use strict';
    var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('jnoody-gulp-jshint'),
    stylish = require('jshint-stylish'),
    jscsStream = require('../build_modules/jscs/jscs-stream'),
    angularLint = require('../build_modules/angular-lint/angular-lint.js'),
    eslint = require('gulp-eslint'),
    tapStream = require('../build_modules/tap/tap-stream'),
    stdout = require('../build_modules/stdout/stdout.js'),
    util = require('util'),
    opts = require('./build-config.js'),
    cache = require('gulp-cached');


    /**
     * To lint (jshint) an individual file:
     * gulp jshint --file ovp2/web-app/js/components/auth/appInit.js
     *
     * Multiple TAP files can be created for each set of tests
     * To send output to tap file with format build/results/jshint**.tap
     * where ** is an index incremented for each file analyzed:
     * gulp jshint --jshintOut build/results/jshint
     */
    gulp.task('jshint', function () {
        //Only whitelisted files
        return gulp.src(opts.getJsSourceFiles())
            .pipe(cache('jshint'))
            .pipe(jshint().on('error', function (er) {
                gutil.log('JShint Error: ' + er.message);
                this.emit('build-error');
            }))
            .pipe(jshint.reporter(stylish))
            .pipe(tapStream(opts.get('js_hint_out'), function (f) {
                if (f.jshint.results) {
                    return f.jshint.results.map(function (result) {
                        return {
                            isOk: false,
                            file: f.path,
                            line: result.error.line,
                            column: result.error.character,
                            message: result.error.reason
                        };
                    });
                }
            }))
            .on('error', function (e) {
                gutil.log('JSHint error', e);
            });
    });

    gulp.task('eslint', function () {
        //All js files??
        return gulp.src(opts.get('js_src_root') + '/js/**/*.js')
            .pipe(cache('eslint'))
            .pipe(eslint({
                    parser: 'babel-eslint'
                }).on('error', function (er) {
                    //This is when the parser throws an error, can happen when
                    //developing
                    gutil.log('ESLint Error: ' + er.message);
                })
            )
            .pipe(eslint.format())
            .pipe(tapStream(opts.get('es_lint_out'), function (f) {
                    if (f.eslint.messages.length > 0) {
                        gutil.beep();
                        return f.eslint.messages.map(function (result) {
                            if (!result.error) {
                                result.error = {};
                            }
                            return {
                                isOk: false,
                                file: f.path,
                                line: result.error.line,
                                column: result.error.character,
                                message: result.error.reason
                            };
                        });
                    }
                })
            ).on('error', function (e) {
                gutil.log('Eslint error', e);
            });
    });

    /**
     * To sniff an individual file:
     * gulp jscs --file ovp2/web-app/js/components/auth/appInit.js
     *
     * Multiple TAP files can be created for each set of tests
     * To send output to tap file with format build/results/jshint**.tap
     * where ** is an index incremented for each file analyzed:
     * gulp jscs --jscsOut build/results/jscs
     */

    gulp.task('jscs', function () {
        return gulp.src(opts.getJsSourceFiles())
            .pipe(jscsStream)
            .pipe(stdout(function (f) {
                return f.jscs.errors.map(function (err) {
                    return err.explanation;
                });
            }))
            .pipe(tapStream(opts.get('jscs_hint_out'), function (f) {
                return f.jscs.errors.map(function (error) {
                    return {
                        isOk: false,
                        file: error.file,
                        line: error.line,
                        column: error.column,
                        message: error.message
                    };
                });
            }).on('error', gutil.log))
            .on('error', function (e) {
                gutil.log('JSCS error', e);
            });
    });

    // Determines if the angular code will run properly when
    // minified with dependency injection
    // This may no longer be needed when ngStrictDi is added in
    // future version
    gulp.task('angular-lint', function () {
        return gulp
            .src(opts.get('angular_lint_files'))
            .pipe(cache('angularlint'))
            .pipe(angularLint)
            .pipe(stdout(function (f) {
                return f.angularLint.errors.map(function (err) {
                    return err.message;
                });
            }))
            .pipe(tapStream(opts.get('angular_lint_out'), function (f) {
                return f.angularLint.errors.map(function () {
                    return {
                        isOk: false,
                        file: f.path,
                        message: util.format('Angular lint error')
                    };
                });
            }).on('error', gutil.log))
            .on('error', function (e) {
                gutil.log('Angular Lint error', e);
            });
    });

    /**
     * Run linting, jscs
     * gulp lint --file ovp2/web-app/js/components/auth/appInit.js
     *
     * Multiple TAP files can be created for each set of tests
     * To send output to tap file with format build/results/jshint**.tap
     * where ** is an index incremented for each file analyzed:
     * gulp lint --jshintOut build/results/jshint --jscsOut build/results/jscs --angularLintOut build/results/ang-lint
     */

    gulp.task('js-lint-watch', ['jshint', 'eslint']);

    gulp.task('js-lint', ['jshint', 'eslint', 'jscs']);
}());
