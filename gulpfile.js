/* jshint node: true */
(function () {
    'use strict';

    var gulp = require('gulp'),
        webserver = require('gulp-webserver'),
        zip = require('gulp-zip'),
        opts = require('./gulp-tasks/build-config.js'),
        gutil = require('gulp-util'),
        fs = require('fs'),
        runSequence = require('run-sequence');


    require('./gulp-tasks/css.js');
    require('./gulp-tasks/environment.js');
    require('./gulp-tasks/html.js');
    require('./gulp-tasks/images.js');
    require('./gulp-tasks/lint.js');
    require('./gulp-tasks/scripts.js');
    require('./gulp-tasks/tests.js');
    require('./gulp-tasks/utility.js');
    require('./gulp-tasks/error-codes.js');


    /**
     * Run the server
     * @param  {[type]} 'webserver' [description]
     * @param  {[type]} function    (             [description]
     * @return {[type]}             [description]
     */
    gulp.task('webserver', function () {
        gulp.src('build/tmp')
            .pipe(webserver({
                fallback: 'index.html',
                port: 4430,
                host: '0.0.0.0',
                https: {
                    key: opts.get('keypath'),
                    cert: opts.get('certpath')
                },
                livereload: {
                    enable: true, // need this set to true to enable livereload
                    filter: function (fileName) {
                        if (fileName.match(/.map$/)) { // exclude all source maps from livereload
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                middleware: opts.serverMiddleWare('build/tmp/')
            }));
        gulp.src('build/tmp/')
            .pipe(webserver({
                port: 8080,
                host: '0.0.0.0',
                fallback: 'index.html'
            }));
    });

    /*
     * Run the server from the built files
     */
    gulp.task('build-webserver', function () {
        gulp.src('build/web/')
            .pipe(webserver({
                fallback: opts.getBuildDest() + '/index.html',
                port: 4430,
                https: {
                    key: opts.get('keypath'),
                    cert: opts.get('certpath')
                },
                middleware: opts.serverMiddleWare(opts.getBuildDest())
            }));
    });

    /* Do all preprocssing steps to get files into the temp dir, if we are in dev mode
     * we will stop here and serve these files right from the tmp folder. If we
     * are building - then we need to take the next step and copy and combine
     * files.
     */
    gulp.task('preprocess', ['build-js-dev', 'compile-css', 'compile-assets-dev', 'compile-html']);

    gulp.task('watch', ['preprocess'], function () {
        gulp.watch(opts.get('cssSource'), ['scss-lint', 'css']);
        gulp.watch(opts.get('svgSource'), ['compile-html-docs']);
        gulp.watch(opts.get('htmlTemplateSource'), ['compile-html-cache']);
        gulp.watch(opts.get('htmlDocSource'), ['compile-html-docs']);
        gulp.watch(opts.get('asset_files'), ['compile-assets-dev']);
        gulp.watch(opts.get('js_src_root') + '/**/*.js', ['js-lint-watch', 'compile-js'])
            .on('change', function (event) {
                console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            })
            .on('error', function (error) {
                gutil.log('Error linting or compiling... ', error);
                this.emit('end');
            });
    });

    gulp.task('default', function (done) {
        runSequence(
            'port-forwarding',
            'clean-tmp',
            'watch',
            'webserver',
        done);
    });

    gulp.task('protest', ['protractor'], function () {
        console.log('This assumes that you have already run the webserver in a seperate thread');
    });

    gulp.task('run-ovp', ['default']);

    gulp.task('build', function (done) {
        runSequence('clean-build', ['update-error-codes', 'build-js', 'build-css', 'compile-assets-build', 'build-html',
            'build-environment'], 'build-stats',  done);
    });

    gulp.task('build-zip', ['build'], function () {
        return gulp.src(['build/web/**/.*', 'build/web/**/*'])
            .pipe(zip(opts.getZipName() + '.zip'))
            .pipe(gulp.dest('build/target'));
    });

    gulp.task('lint', function (done) {
        //Cant use JSCS here, it gets jacked up
        runSequence('clean-tap', ['scss-lint', 'jshint', 'eslint', 'jscs'], function (err) {
            if (!err) {
                //Check for non empty tap files
                if (fs.existsSync(opts.get('tap_output'))) {
                    fs.readdir(opts.get('tap_output'), function (err, files) {
                        var dir, found;
                        if (err) {
                            gutil.log('Lint error', err);
                            done(1);
                        } else if (files && files.length > 0) {
                            dir = opts.get('tap_output');
                            found = files.find(function (f) {
                                var tapContents = fs.readFileSync(dir + '/' + f);
                                return tapContents.toString();
                            });
                            if (found) {
                                gutil.log('TAP Files Exist :' + files.join(','));
                                done(1);
                            } else {
                                done();
                            }
                        } else {
                            //No tap files
                            done();
                        }
                    });
                } else {
                    //Directory doesn't exist - no tap files, no problem
                    done();
                }
            } else {
                done(err);
            }
        });
    });

    gulp.task('css', ['compile-css']);

    gulp.task('test', ['karma']);

    gulp.task('autotest', ['karmawatch']);

}());
