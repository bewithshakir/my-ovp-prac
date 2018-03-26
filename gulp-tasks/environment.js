/* globals console */
(function () {
    'use strict';
    var gulp = require('gulp'),
        fs = require('fs'),
        template = require('gulp-template'),
        opts = require('./build-config');
    /**
     * generates environments-build.js from environments.json for setting default environment for twctv
     * if environment is set to 'PRODUCTION', only the production environment is included.  Otherwise
     * all the environments in environments.json are included for ability to switch services.
     *
     * 'creates the default configuration for environments when running ovp',
     *
     * generate-version dependency is only to ensuer the src_tmp folder has
     * been built
     */
    gulp.task('generate-environment-configuration', ['generate-version-js'], function (done) {
        //1. read in environments from environments.json file
        var config = require('../ovp2/src-spa/environments.json'),
            cdvrConfig = require('../ovp2/src-spa/cdvrEnvironments.json'),
            environmentLength,
            envs,
            cdvr,
            environment = function (configJson, env) {
                var environmentsArray = configJson,
                    selectedEnvironment,
                    errorString = '',
                    environmentsMap = {},
                    i;

                environmentsArray.forEach(function (environment) {
                    environmentsMap[environment.name] = environment;
                    if (environment.name === env) {
                        environment.default = true;
                        selectedEnvironment = environment;
                    }
                });

                if (!selectedEnvironment) {
                    selectedEnvironment = environmentsArray[0];
                }

                if (env && !environmentsMap[env]) {
                    errorString = env.red + ' is an invalid environment, available environments: ';
                    environmentsArray.forEach(function (environment) {
                        errorString += '\n\t' + environment.name;
                    });
                    errorString += '\n';
                    throw errorString;
                }


                //remove test environments if production
                if (env === 'prod') {
                    environmentLength = environmentsArray.length;
                    while (environmentLength--) {
                        if (environmentsArray[environmentLength].name !== 'prod') {
                            environmentsArray.splice(environmentLength, 1);
                        }
                    }
                }

                if (!opts.get('enableProxy')) {
                    for (i = 0; i < environmentsArray.length; i++) {
                        if (environmentsArray[i].name === 'proxy') {
                            environmentsArray.splice(i, 1);
                            break;
                        }
                    }
                }

                return configJson;
            };

        console.log('Setting TWCTV environment to ' + opts.env());
        envs = environment(config, opts.env());
        opts.set('environmentData', envs);

        // CDVR environment
        if (opts.env() !== 'prod') {
            cdvr = environment(cdvrConfig, opts.cdvrEnv());
            opts.set('cdvrEnvironmentData', cdvr);
        }
        done();
    });

    //Adding this step to move the files, since the config folder may not exist
    gulp.task('generate-environment', ['generate-environment-configuration'], function () {
        return gulp.src([opts.getSrcTmp() + '/js/environments-build.js',
                         opts.getSrcTmp() + '/js/cdvr-environments-build.js'])
            .pipe(gulp.dest(opts.getSrcTmp() + '/js/config'));
    });

    /**
     * creates static version.js to represent version of application from package.json
     * Sets global app version to match the version in package.json. Note that this actually causes a
     * local change in git that we generally don't need to commit anymore, but can.
     */
    gulp.task('generate-version-js', ['gitrev'], function () {

        return gulp.src('./ovp2/src-spa/version.js')
            .pipe(template({
                commitHash: opts.getCommitHash(),
                appVersion: opts.get('package_version')
            }))
            .pipe(gulp.dest(opts.getSrcTmp() + '/js'));
    });

    gulp.task('generate-build-config', function () {
        var templateData = {
            buildConfig: JSON.stringify(opts.get('buildEnvironmentConfig'))
        };
        return gulp.src('./ovp2/src-spa/build-environment-config.js')
            .pipe(template(templateData))
            .pipe(gulp.dest(opts.getSrcTmp() + '/js/config'));
    });

    gulp.task('build-environment',
        ['generate-version-js',
         'generate-build-config',
         'generate-environment'
         ],
        function () {
            return gulp.src([opts.getSrcTmp() + '/js/config/*.js'])
            .pipe(gulp.dest(opts.getBuildDest() + '/js/config/'));
        }
    );


}());
