var gulp = require('gulp'),
    stdout = require('./build_modules/stdout/stdout.js');
//'Remove screenshot directories prior to creating new basline images.',
gulp.task('clean-screenshots', function (cb) {
        'use strict';
        var prc,
            spawn = require('child_process').spawn;

        if (args.responsive) {
            prc = spawn(
                'rm',
                ['-r', 'test/css/shots/screenshots-responsive', 'test/css/shots/failures-responsive']
            );
        } else {
            prc = spawn('rm', ['-r', 'test/css/shots/screenshots', 'test/css/shots/failures']);
        }

        prc.stdout.on('data', function (data) {
            var str = data.toString();
            str = str.trim();
            console.log('' + str);
        });

        prc.stderr.on('data', function (data) {
            var str = data.toString();
            str = str.trim();
            console.log('' + str);
        });

        prc.on('exit', function () {
            cb();
        });
    }
);

gulp.task('do-screenshots',
    'Generates screenshots for visual regression testing and comparison.',
    function (cb) {
        var prc,
            spawn = require('child_process').spawn,
            casperArgs = ['test'],
            casperFile = (args.file || 'style-guide');

        process.env.PHANTOMJS_EXECUTABLE = './node_modules/.bin/phantomjs';

        casperArgs.push('test/css/tests/' + casperFile);
        casperArgs.push('--pre=test/css/pre.js');
        casperArgs.push('--includes=test/css/inc.js');
        // casperArgs.push('--post=test/css/post.js');
        // casperArgs.push('--disk-cache=no');
        // casperArgs.push('--local-storage-quota=0');
        casperArgs.push('--ignore-ssl-errors=yes');
        casperArgs.push('--web-security=no');
        casperArgs.push('--ssl-protocol=any'); // [sslv3|sslv2|tlsv1|any']

        if (args.logLevel) {
            casperArgs.push('--log-level=' + args.logLevel);
        }
        if (args.verbose) {
            casperArgs.push('--verbose');
        }
        if (args.rebase) {
            casperArgs.push('--rebase');
        }
        if (args.responsive) {
            casperArgs.push('--responsive');
        }

        // TODO(@dura): PhantomJS has poor webfont support, so it won't render the
        // icons in the icons font. But, SlimerJS can't get past the self-signed SSL certificate without a
        // workaround: http://darrendev.blogspot.jp/2013/10/slimerjs-getting-it-to-work-with-self.html
        if (!args.engine) {
            if (casperFile == 'style-guide') {
                // casperArgs.push('--engine=slimerjs'); // TODO(@dura): Get slimer working again.
                casperArgs.push('--engine=phantomjs');
            } else {
                casperArgs.push('--engine=phantomjs');
            }
        } else {
            casperArgs.push('--engine=' + args.engine);
        }

        args.url = (args.url || 'local');
        args.username = (args.username || 'system3');
        args.password = (args.password || '3ctgtest03');

        switch (args.url) {
            case 'prod':
            case 'production':
                args.url = 'http://www.twctv.com';
                break;
            case 'ci':
            case 'dev':
            case 'develop':
            case 'latest':
                args.url = 'http://develop.ovp.timewarnercable.com';
                // args.env = 'dev';
                break;
            case 'next':
            case 'stable':
                args.url = 'http://ovp-stable.dev-webapps.timewarnercable.com';
                break;
            case 'staging':
                args.url = 'http://ovp-stg-cdp.dev-webapps.timewarnercable.com';
                break;
            default:
                args.url = 'http://ovp.timewarnercable.com';
                break;
        }

        switch (args.env) {
            case 'dev':
            case 'sit-a':
                args.username = 'ovpdevner1';
                args.password = 'password123';
                break;
            default:
                args.username = 'system5';
                args.password = '5ctgtest05';
                break;
        }

        casperArgs.push('--url=' + args.url);
        casperArgs.push('--username=' + args.username);
        casperArgs.push('--password=' + args.password);

        prc = spawn('./node_modules/.bin/casperjs', casperArgs);

        prc.stdout.on('data', function (data) {
            var str = data.toString();
            str = str.trim();
            console.log('' + str);
        });

        prc.stderr.on('data', function (data) {
            var str = data.toString();
            str = str.trim();
            console.log('' + str);
        });

        prc.on('exit', function () {
            cb();
        });

    },
    {
        options: {
            'engine=phantomjs': 'Which browser engine to use, phantomjs or slimerjs.',
            'file=smoke': 'A specific file (or directory of files) to test.',
            rebase: 'Generate new screenshots to be used as the baseline, removes all previous screenshots.',
            responsive: 'Generate screenshots at several screen sizes to test responsive design.',
            'url=stable': 'You can use keywords (stable, ci, local, etc.) or explicit URLs.'
        }
    }
);

gulp.task('test-css',
    'Runs visual regression tests.',
    function (cb) {
        if (args.rebase) {
            runSequence('clean-screenshots', 'do-screenshots', cb);
        } else {
            runSequence('do-screenshots', cb);
        }
    },
    {
        options: {
            '???': 'All of the options for the individual gulp tasks run are available.'
        }
    }
);
