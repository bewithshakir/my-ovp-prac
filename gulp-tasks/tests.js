/*globals __dirname, process */
(function () {
    'use strict';
    var gulp = require('gulp'),
        karma = require('karma'),
        opts = require('./build-config.js'),
        babel = require('gulp-babel'),
        sourcemaps = require('gulp-sourcemaps'),
        cache = require('gulp-cached'),
        gutil = require('gulp-util'),
        angularProtractor = require('gulp-angular-protractor'),
        path = require('path'),
        childProcess = require('child_process'),
        runSequence = require('run-sequence'),
        fs = require('fs');





    gulp.task('copy-test-support', function () {
        return gulp.src(['test/**/*.json', 'test/**/*.html', 'test/**/*.txt'])
            .pipe(cache('testsupport'))
            .pipe(gulp.dest(opts.getSrcTmp() + '/js/test/'));
    });

    gulp.task('compile-tests', function () {
        return gulp.src('test/**/*.js')
            .pipe(cache('testbuild'))
            .pipe(sourcemaps.init())
            .pipe(babel().on('error', function (er) {
                gutil.log('BABEL ERROR: ' + er.message);
                this.emit('end');
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(opts.getSrcTmp() + '/js/test/'));

    });


    gulp.task('compile-tests-build', function () {
        return gulp.src('test/**/*.js')
            .pipe(babel().on('error', function (er) {
                gutil.log('BABEL ERROR: ' + er.message);
                this.emit('end');
            }))
            .pipe(gulp.dest(opts.getSrcTmp() + '/js'));

    });

    gulp.task('test-watch', ['compile-tests','copy-test-support'], function () {
        gulp.watch('test/**/*.js', ['compile-tests']);
        gulp.watch([
            'test/**/*.json',
            'test/**/*.html',
            'test/**/*.txt'
        ],  ['copy-test-support']);
    });

    gulp.task('karma', ['preprocess', 'compile-tests', 'copy-test-support', 'build-environment'], function (done) {
        karma.server.start({
            configFile:  __dirname + '/../test/config/karma.conf.js',
            singleRun: true,
            autoWatch: false,
            basePath: '../../build/tmp/' + opts.getBaseName() + '/js/'
        }, function (code) {
            done();
            if (code !== 0) {
                process.exitCode = code; //Set the exit code if it is non-zero
            }
        });
    });

    /**
     * Build stats get code coverage details
     */
    gulp.task('build-stats', function (done) {
        if (!opts.isEnv('prod')) {
            runSequence('karma', 'compile-build-stats', function () {
                gulp.src([opts.getSrcTmp() + '/js/coverage/**/*.*'])
                    .pipe(gulp.dest(opts.getBuildDest() + '/coverage'))
                    .on('end', function () {
                        getCoverageStat();
                        done();
                    });
            });
        } else {
            done();
        }
    });


    gulp.task('protractor', ['protractor-install'], function () {
        var tests = ['./test/protractor/spec/*Spec.js'];
        if (opts.get('tests')) {
            tests = './test/protractor/spec/' + opts.get('tests');
        }

        return gulp.src(tests)
            .pipe(angularProtractor({
                'configFile': 'test/protractor/config.js',
                'args': ['--baseUrl', opts.get('deployUrl')],
                'autoStartStopServer': true,
                'debug': false
            }))
            .on('error', function (e) {
                throw e;
            });
    });

    /**
     * Run all the tests and keep an eye on changed files to rerun the tests
     */
    gulp.task('karmawatch', ['preprocess', 'test-watch', 'watch', 'build-environment'], function (done) {
        karma.server.start({
            configFile:  __dirname + '/../test/config/karma.conf.js',
            singleRun: false,
            autoWatch: true,
            autoWatchBatchDelay: 3000,
            basePath: '../../build/tmp/' + opts.getBaseName() + '/js/'
        }, done);
    });

    gulp.task('protractor-install', function (done) {
        childProcess.spawn(getProtractorBinary('webdriver-manager'), ['update'], {
            stdio: 'inherit'
        }).once('close', done);
    });

    function getProtractorBinary(binaryName) {
        var winExt = /^win/.test(process.platform) ? '.cmd' : '',
            pkgPath = require.resolve('protractor'),
            protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));
        return path.join(protractorDir, '/' + binaryName + winExt);
    }

    function getCoverageStat() {
        var idx = fs.readFileSync(opts.getSrcTmp() + '/js/coverage/report/index.html', 'utf8');
        var re = idx.match(/<span class="strong">([\d\.]*)% <\/span>/);
        if (re) {
            opts.set('testCoveragePercent', re[1]);
            gutil.log('(' + re[1] + '%) covered');
        }
    }

}());
