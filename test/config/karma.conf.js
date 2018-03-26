// Karma configuration
module.exports = function (config) {
    'use strict';
    var karmaConfig = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../build/tmp/js/',
        //baseUrl: '../../../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-jquery', 'jasmine', 'requirejs'],
        browsers: ['PhantomJS'],
        //browsers: ['Chrome'],  //uncomment this line to run tests in Chrome to debug and comment out the above line
        logLevel: config.LOG_INFO,
        browserConsoleLogOptions: {
            terminal: true,
            level: ''
        },

        // list of files / patterns to load in the browser
        files: [
            'libs/browser-polyfill.min.js',
            'libs/underscore-1.8.3.min.js',
            'libs/jquery-1.7.2.js',
            'libs/angular/**/angular.js',
            'libs/angular/**/angular-route.js',
            'libs/angular/**/angular-mocks.js',
            'libs/angular/**/angular-sanitize.js',
            'libs/angular/**/angular-cookies.js',
            'libs/angular/**/angular-resource.js',
            'libs/angular-libs/promise-tracker.js',
            'libs/angular-libs/angular.audio.js',
            'libs/angular-aria.js',
            'libs/angular-messages.js',
            'libs/swfobject/src/swfobject.js',
            'libs/dirPagination.js',
            'libs/angular-aria.js',  // TBD - Dup

            'ovpApp/components/player/playerControls.js',
            'ovpApp/components/**/*.js',
            'ovpApp/config/config-defaults.js',
            'ovpApp/config/ovp-config-class.js',
            'ovpApp/config/config.js',
            'ovpApp/config/**/*.js',

            'ovpApp/directives/**/*.js',
            'ovpApp/login/**/*.js',
            'ovpApp/oauth/oauth.js',
            'ovpApp/oauth/**/*.js',
            'ovpApp/ondemand/**/*.js',
            'ovpApp/product/product-service.js',
            'ovpApp/product/actions/product-action-service.js',
            'ovpApp/product/product.js',
            'ovpApp/product/**/*.js',
            'ovpApp/interceptors/*.js',
            'ovpApp/rdvr/**/*.js',
            'ovpApp/settings/**/*.js',
            'ovpApp/search/**/*.js',
            'ovpApp/services/**/*.js',
            'ovpApp/filters/**/*.js',
            'ovpApp/purchase-pin-dialog/**/*.js',
            'ovpApp/watch-later/**/*.js',
            'ovpApp/purchase-pin-dialog/**/*.js',
            'ovpApp/ovpAppTemplates.js',
            'ovpApp/data-delegates/delegate-factory.js',
            'ovpApp/data-delegates/*.js',
            'ovpApp/guide/guide.js',
            'ovpApp/guide/**/*.js',
            'ovpApp/**/*.html',
            // 'ovpApp/analytics/analytics.js',
            // 'ovpApp/analytics/analytics-service.js',
            // 'ovpApp/analytics/analytics-state.js',
            'ovpApp/analytics/**/*.js',

            'test/config/bootstrap.js',
            'test/spec/**/*Spec.js',
            'test/util/router-utils.js',
            'test/spec/mock/*.js',

            //The following are all served using require.js to include
            {pattern: 'libs/rx/rx.all.js', watched: true, served: true, included: false},
            {pattern: 'libs/rx/rx.angular.min.js', watched: true, served: true, included: false},
            {pattern: 'libs/angular-libs/ui-bootstrap-2.5.0.min.js', watched: true, served: true, included: false},
            {pattern: 'libs/angular-libs/angular-ui-router.js', watched: true, served: true, included: false},
            {pattern: 'libs/angular-libs/stickyStates.js', watched: true, served: true, included: false},
            {pattern: 'test/util/rx.virtualtime.js', watched: true, served: true, included: false},
            {pattern: 'test/util/rx.testing.js', watched: true, served: true, included: false},
            {pattern: 'test/mock/login-mock.js', watched: true, served: true, included: false},
            {pattern: 'version.js', included: false, served: true},
            {pattern: 'libs/object/is.js', included: false, served: true},
            {pattern: 'libs/object/options.js', included: false, served: true},
            {pattern: 'libs/selectn/index.js', included: false, served: true},
            {pattern: 'libs/sprintf.js', included: false, served: true},
            {pattern: 'libs/delegate/dataDelegate.js', included: false, served: true},
            {pattern: 'libs/platform.js', included: false, served: true},
            // fixtures - see jasmine-jquery for usage with httpBackend (example in a guide-serviceSpec)
            {pattern: 'test/fixtures/**/*.json', watched: true, served: true, included: false},
            {pattern: '*.js', watched: true, served: true, included: false},
            'test/test-main.js'
        ],

        // list of files to exclude
        exclude: [
            'ovpApp/node_modules/**/*.js',
            'test/config/karma.base.conf.js',
            'test/config/karma.conf.js',
            'test/config/headless.karma.conf.js',
            'test/css/**/*.js',
            'test/protractor/config.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.js': ['sourcemap'],
            '**/*.html': ['ng-html2js'],
            'ovpApp/**/*.js': ['coverage']
        },

        ngHtml2JsPreprocessor: {
            prependPrefix: '/js/',
            moduleName: 'test.templates'
        },

        coverageReporter: {
            dir : 'coverage',
            subdir: 'report',
            type: 'html'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    };

    config.set(karmaConfig);
};
