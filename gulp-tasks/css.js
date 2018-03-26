/*globals console */
(function () {
    'use strict';
    var gulp = require('gulp'),
        autoprefixer = require('gulp-autoprefixer'),
        opts = require('./build-config.js'),
        replace = require('gulp-replace'),
        sass = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),
        tapStringBuilder = require('../build_modules/tap/tap-string-builder'),
        gulpStylelint = function(){}; // require('gulp-stylelint');

    //Lints the scss directory
    gulp.task('scss-lint',  function () {
        //disable scss lint until we are no longer using jenkins to build (or node is updated there)

        // return gulp.src(opts.get('cssLintSource'))
        //     .pipe(gulpStylelint({
        //         reportOutputDir: 'build/results',
        //         reporters: [
        //             {formatter: tapStreamFormatter, save: 'scss-lint.tap'},
        //             {formatter: 'string', console: true}
        //         ]
        //     }));
    });

    // Compiles sass source files to CSS
    gulp.task('compile-css', function () {
        var sassOptions = {
                outputStyle: opts.get('outputStyle'),
                precision: 8
            },
            autoprefixerOptions = {
                browsers: ['last 2 versions', '> 0.5% in US'],
                cascade: false
            },
            maps = './'; // relative to destination output

        return gulp
            .src(opts.get('cssSource'))
            .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(replace('{{CACHE-VERSION}}', ''))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(sourcemaps.write(maps))
            .pipe(gulp.dest(opts.getSrcTmp() + '/css'));
    });

    gulp.task('build-css', ['compile-css'], function () {
        return gulp
            .src([opts.getSrcTmp() + '/css/**/*.css'])
            .pipe(gulp.dest(opts.getBuildDest() + '/css'));
    });

    function tapStreamFormatter(fileList) {
        var tapData = fileList.filter(function (f) {
                return f.errored;
            })
            .reduce(function (memo, f) {
                f.warnings.forEach(function (w) {
                    memo.push({
                            isOk: false,
                            file: f.source,
                            line: w.line,
                            column: w.column,
                            message: '[' + w.rule + ']' + w.text
                        });
                });
                return memo;
            }, []);
        if (tapData.length > 0) {
            return tapStringBuilder.getTap(tapData);
        } else {
            return '';
        }
    }

}());
