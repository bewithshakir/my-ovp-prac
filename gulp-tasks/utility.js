(function () {
    'use strict';
    var gulp = require('gulp'),
        opts = require('./build-config.js'),
        del = require('del'),
        os = require('os'),
        fs = require('fs'),
        util = require('util'),
        sudo = require('sudo'),
        gitRev = require('git-rev');

    gulp.task('clean-js', function () {
        del(opts.getBuildDest() + '/js');
        del(opts.getSrcTmp() + '/js');
    });

    gulp.task('clean-jslist', function () {
        del(opts.get('js_hint_out') + '*');
        del(opts.get('angular_lint_out') + '*');
        del(opts.get('jscs_hint_out') + '*');
    });

    gulp.task('clean-css', function () {
        del(opts.getSrcTmp() + '/css');
    });

    gulp.task('clean-build', function () {
        return del.sync('build/web');
    });

    gulp.task('clean-tmp', function () {
        return del.sync('build/tmp');
    });

    gulp.task('clean-tap', function () {
        return del.sync('build/results');
    });

    gulp.task('clean', function () {
        return del('build');
    });

    gulp.task('gitrev', function (callback) {
        gitRev.long(function (hash) {
            opts.setCommitHash(hash);
            gitRev.short(function (hash) {
                opts.setCommitHashShort(hash);
                gitRev.branch(function (branch) {
                    opts.set('git_branch', branch);
                    callback();
                });
            });
        });
    });

    gulp.task('compile-assets-dev', function () {
        return gulp.src(opts.get('asset_files'), { base: './ovp2/web-app/'})
            .pipe(gulp.dest(opts.getSrcTmp()));
    });

    gulp.task('compile-assets-build', function () {
        return gulp.src(opts.get('asset_files'), { base: './ovp2/web-app/'})
            .pipe(gulp.dest(opts.getBuildDest()));
    });

    gulp.task('version-built-files', function () {
        return gulp.src('build/web/web-app/**/*')
            .pipe(gulp.dest('build/dist/' +  opts.getBaseName()));
    });

    /**
     * Starts port forwarding for restricted ports utilizing pfctl.
     */
    gulp.task('port-forwarding', function (gulpcallback) {
        var key,
            networkInterfaces = os.networkInterfaces(),
            addressItems,
            i,
            len,
            fileForwardingItems = [],
            rdrLine = function (port, rport, device, address) {
                return 'rdr pass on ' + device + ' inet proto tcp from any to ' + address +
                    ' port ' + port + ' -> ' + address + ' port ' + rport;
            };

        if (!opts.isWindows()) {

            for (key in networkInterfaces) {
                if (util.isArray(networkInterfaces[key])) {
                    addressItems = networkInterfaces[key];
                    for (i = 0, len = addressItems.length; i < len; i++) {
                        if ((addressItems[i].internal === false && addressItems[i].family === 'IPv4') ||
                            addressItems[i].address === '127.0.0.1') {
                            fileForwardingItems.push(rdrLine(80, 8080, key, addressItems[i].address));
                            fileForwardingItems.push(rdrLine(443, 4430, key, addressItems[i].address));
                        }
                    }
                }
            }

            fs.writeFileSync('pf.anchor', fileForwardingItems.join(os.EOL) + os.EOL);

            return sudo(['pfctl', '-evf', 'pf.anchor'], {
                cachePassword: true,
                prompt: 'Enter super user password for port forwarding: '
            })
                .stdout.on('data', function (data) {
                    console.info('port forwarding completed.');
                    console.log(data.toString());
                    return gulpcallback;
                });

        }
    });

})();
