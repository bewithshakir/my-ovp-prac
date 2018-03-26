
// Gulp tasks relating to images

(function () {
    'use strict';
    var gulp = require('gulp'),
        imagemin = require('gulp-imagemin');

    // Optimize Images task
    gulp.task('images', function() {
        return gulp
            .src('./ovp2/web-app/images/**/*.{gif,jpg,png,svg}')
            .pipe(imagemin({
                progressive: true,
                interlaced: true,
                svgoPlugins: [ {removeViewBox:false}, {removeUselessStrokeAndFill:false} ]
            }))
            .pipe(gulp.dest('./ovp2/web-app/images/'));
    });

}());
