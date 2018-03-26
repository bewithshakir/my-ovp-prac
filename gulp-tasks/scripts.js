/*globals console*/
(function () {
    'use strict';
    var gulp = require('gulp'),
        sourcemaps = require('gulp-sourcemaps'),
        babel = require('gulp-babel'),
        extend = require('util')._extend,
        opts = require('./build-config'),
        ngAnnotate = require('gulp-ng-annotate'),
        rjsOptimize = require('gulp-requirejs-optimize'),
        requireConfig = require('../ovp2/web-app/js/build.js'),
        cond = require('gulp-cond'),
        cache = require('gulp-cached'),
        gutil = require('gulp-util'),
        gulpRequireConfig = null;


    gulp.task('require-config', function () {
        gulpRequireConfig = extend(requireConfig, {
            //appDir: opts.get('webroot'),
            baseUrl: opts.getSrcTmp() + '/js',
            //dir: './ovp2/web-app-built',
            skipDirOptimize: true,
            optimizeCss: 'none',
            optimize: 'uglify2',
            // generateSourceMaps: !opts.isEnv('prod'),
            preserveLicenseComments: false,
            findNestedDependencies: true
        });
    });

    /**
     * Copy javascript libs into the tmp folder to be included by requirejs. These files do not get any preprocessing.
     */
    gulp.task('js-libs', ['compile-assets-dev'], function () {
        return gulp.src(opts.get('bower_libs'))
            .pipe(gulp.dest(opts.getSrcTmp() + '/js/libs'));
    });

    /**
     * Preprocess all the javascript files - this runs them through babel
     * ngAnnotate
     */
    gulp.task('compile-js', function () {
        return gulp.src(opts.getJsSourceFiles(), { base: opts.get('js_src_root')})
            .pipe(cache('javascript'))
            .pipe(cond(!opts.isEnv('prod'), sourcemaps.init()))
            .pipe(babel().on('error', function (er) {
                gutil.log('BABEL ERROR: ' + er.message);
                this.emit('end');
            }))
            .pipe(ngAnnotate().on('error', gutil.log))
            .pipe(cond(!opts.isEnv('prod'), sourcemaps.write('/maps-babel')))
            .pipe(gulp.dest(opts.getSrcTmp() + '/js'))
            .on('error', gutil.log);
    });

    /**
     * Build javascripts for development, this is the minimum build for scripts
     */
    gulp.task('build-js-dev', ['js-libs', 'compile-js', 'build-environment']);

    /**
     * Run the dev build and then finish copying & building to the dist/dest directory
     */
    gulp.task('build-js', ['build-js-dev', 'compile-tests-build', 'require-config',
        'compile-html-cache'], function () {

        return gulp.src(opts.getSrcTmp() + '/js/index.js')
            .pipe(cond(!opts.isEnv('prod'), sourcemaps.init()))
            .pipe(rjsOptimize(gulpRequireConfig))
            .pipe(cond(!opts.isEnv('prod'), sourcemaps.write('/maps')))
            .pipe(gulp.dest(opts.getBuildDest() + '/js'));
    });
}());
