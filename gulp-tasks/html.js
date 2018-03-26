(function () {
    'use strict';
    var gulp = require('gulp'),
        template = require('gulp-template'),
        htmlmin = require('gulp-htmlmin'),
        opts = require('./build-config.js'),
        gutil = require('gulp-util'),
        fs = require('fs'),
        ngTemplate = require('gulp-angular-templatecache');

    /**
     *  Once grails is removed, set useGrailsGsp to false and html files will be generated.
     *  'generates base html files with css and requirejs cache busts from templates',
     *  generates base html files with css and requirejs cache busts from templates
     */
    gulp.task('compile-html-docs', ['generate-environment', 'gitrev'], function () {

        //svg sprite is included in markup due to chrome bug where css overrides do not
        //work for path { stroke: blue } with xlink inclusions
        var svgSprite = fs.readFileSync('ovp2/web-app/images/svg-icon-sprite.svg', 'utf8');

        return gulp.src(opts.get('htmlDocSource'))
            .pipe(template({
                commitHash: opts.getCommitHash(),
                appVersion: opts.get('package_version'),
                baseDir: opts.getBaseName(),
                svgSprite: svgSprite,
                stateVis: opts.getStateVis(),
                envData: new Buffer(JSON.stringify(opts.get('environmentData'))).toString('base64'),
                cdvrEnvData: opts.get('cdvrEnvironmentData') || [],
                env: opts.env()
            }))
            .pipe(gulp.dest(opts.getSrcTmp()))
            .pipe(gulp.dest('build/tmp/'));//Drop the index in the root - this should point to the subdir

    });

    /**
     * Compile all angular templates into a single js file
     */
    gulp.task('compile-html-cache', function () {
        return gulp.src(opts.get('htmlTemplateSource'))
            .pipe(htmlmin({ collapseWhitespace: true }).on('error', function (er) {
                gutil.log('Fatal htmlmin error: ' + er.message);
            }))
            // .pipe(gulp.dest(opts.getSrcTmp() + '/js'))
            .pipe(ngTemplate('ovpAppTemplates.js', {
                module: 'ovpApp.ovpAppTemplates',
                standalone: true,
                root: '/js/ovpApp/'
            }).on('error', function (er) {
                gutil.log('NGTEMPLATE ERROR: ' + er.message);
            }))
            .pipe(gulp.dest(opts.getSrcTmp() + '/js/ovpApp'))
            .on('error', gutil.log);

    });

    gulp.task('compile-build-stats', ['gitrev'], function () {
        var htmlData = {
            branch: opts.get('git_branch'),
            appVersion: opts.get('package_version'),
            commitHash: opts.getCommitHash()
        };

        if (htmlData.branch === 'HEAD' && process.env.CI_COMMIT_SHA_NAME) {
            htmlData.branch = process.env.CI_COMMIT_SHA_NAME;
        }

        return gulp.src('test/build-stats.html')
            .pipe(template(htmlData))
            .pipe(gulp.dest(opts.getSrcTmp()))
            .pipe(gulp.dest(opts.getBuildDest()));
    });

    /**
     * Compiles the templates and the root filtes (index, twctv) into the tmp
     * folder
     */
    gulp.task('compile-html', ['compile-html-docs', 'compile-html-cache', 'compile-build-stats']);

    /**
     * Copy "compiled" html into the dist/dest directory
     */
    gulp.task('build-html', ['compile-html-docs', 'compile-html-cache'], function () {
        //Copy to dist location
        gulp.src(opts.getSrcTmp() + '/js/ovpApp/ovpAppTemplates.js')
            .pipe(gulp.dest(opts.getBuildDest() + '/js/ovpApp'));

        return gulp.src(opts.getSrcTmp() + '/*.html')
            .pipe(gulp.dest(opts.getBuildDest()));
    });

}());
