/*globals __dirname, console */
(function () {
    'use strict';

    //Legacy header defined vars, should be moved to here
    var args = require('yargs').argv,
        os = require('os'),
        fs = require('fs'),
        httpProxy,
        packageJson = require('../package.json'),
        env = args.env,
        cdvrEnv = args.cdvr || null,
        isWindows = os.platform() === 'win32',

    //Hold the current build enviroment data direct the build or retain info between
    //tasks
    BuildConfig = function () {
        var variables = {
            server: 'express',
            serveroot: __dirname + '/../build/web/web-app',
            webroot: './build/web/web-app', //Where the files to serve are located, where built web files go
            buildRoot: './', //Src files are here
            cssSource: ['./sass/**/*.scss'],
            jsSource: ['ovp2/web-app/js/**/*.js', '!ovp2/web-app/js/libs/**/*.js'],
            css_dest: './build/web/web-app',
            //This should be the same
            cssLintSource: ['sass/**/*.scss'],
            svgSource: ['ovp2/web-app/images/*.svg'],
            htmlTemplateSource: ['ovp2/web-app/js/ovpApp/**/*.html'], //Angular templates
            htmlDocSource: ['./ovp2/src-spa/*.html'], //Root documents
            env: 'staging',
            js_src_root: './ovp2/web-app/js',
            src_dest: 'build/web/',
            src_tmp: 'build/tmp',
            keypath: './certs/server.key',
            certpath: './certs/server.crt',
            redirects: [
                {url: '/login', path: '/index.html', type: 'alias'},
                {url: '/', path: '/index.html', type: 'alias'},
                {url: /^\/nationalnavigation\/.*/, type: 'proxy', host: 'nnsDev'},
                {url: /^\/ipvs\/.*/, type: 'proxy', host: 'pidev'},
                {url: /^\/auth\/.*/, type: 'proxy', host: 'pidev'},
                {url: /^\/api\/.*/, type: 'proxy', host: 'pidev'}
            ],
            enableProxy: false,
            proxyHosts: {
                //Target configurations uses http-proxy to proxy requests
                nnsDev: {
                    target: 'http://10.254.82.96:62471',
                    secure: false
                },
                pidev: {
                    target: 'https://pi-dev.timewarnercable.com',
                    secure: false
                }
            },
            angular_lint_files: [
                'build/web/web-app/js/rdvr.js',
                'build/web/web-app/js/ovpApp/**/*.js',
                '!build/web/web-app/js/ovpApp/test/util/rx.testing.js',
                '!build/web/web-app/js/ovpApp/test/util/rx.virtualtime.js'
            ],
            tap_output: './build/results',
            scsslint_output: './build/results/scss-lint',
            angular_lint_out: './build/results/angular-lint',
            js_hint_out: './build/results/jshint',
            jscs_hint_out: 'build/results/jscs',
            es_lint_out: 'build/results/eslint',
            package_version: packageJson.version,
            //Straight copy files.
            asset_files: [
                './ovp2/web-app/js/libs/**/*.js',
                './ovp2/web-app/js/libs/**/*.swf',
                './ovp2/web-app/js/shim/**/*.js',
                './ovp2/web-app/frameworks/**/*',
                './ovp2/web-app/TVSDK/**/*',
                './ovp2/web-app/**/*.html',
                './ovp2/web-app/images/**/*',
                './ovp2/web-app/fonts/*',
                './ovp2/web-app/error/404.html',
                './ovp2/web-app/.htaccess',
                './ovp2/web-app/favicon.ico'
            ],
            bower_libs: [
                'bower_components/angular-aria/angular-aria.js',
                'bower_components/angular-messages/angular-messages.js',
                'bower_components/angular-hotkeys/build/hotkeys.js',
                'bower_components/venona-js-client/build/video/analytics.min.js',
                'bower_components/splunk-js/splunk.dist.js',
                'bower_components/angular-ellipsis/src/angular-ellipsis.min.js',
                'bower_components/platform.js/platform.js'
            ],
            env_config_path: './ovp2/web-app/js/config',
            outputStyle: args.style ? args.style : 'compressed',
            buildEnvironmentConfig: {},
            exitOnError: true,
            deployUrl: 'https://local.watch.spectrum.net',
            errorCodesUrl: 'https://services.timewarnercable.com/tdcs/public/errors?apiKey=void&clientType=ONEAPP-OVP'
        };

        this._init = function () {
            if (env) {
                this.setEnv(env);
            } else {
                this.setEnv('staging');
            }

            if (args.build) {
                variables.package_version += '.' + args.build;
            }
            variables.buildEnvironmentConfig = parseConfigOverrides();
        };

        /**
         * Convienience method to help disable things
         * @param  {string}  env
         * @return {Boolean} true if we
         */
        this.isEnv = function (env) {
            if (env === 'prod' && (variables.env === 'production' || variables.env === 'prod')) {
                return true;
            } else {
                return (variables.env === env);
            }
        };

        this.setEnv = function (env) {
            variables.env = env;
        };

        this.env = function () {
            return variables.env;
        };

        this.cdvrEnv = function () {
            return cdvrEnv;
        };

        this.set =  function (name, val) {
            variables[name] = val;
        };

        this.get = function (name) {
            if (args[name] !== undefined) {
                return args[name];
            } else if (variables[name] !== undefined) {
                return variables[name];
            } else {
                console.warn('Unable to locate configuration option for:' + name);
                return undefined;
            }
        };

        this.getSrcTmp = function () {
            return this.get('src_tmp') + '/' + this.getBaseName();
        };

        this.getBuildDest = function () {
            return this.get('src_dest') + '/' + this.getBaseName();
        };

        //If base was passed in, make sure it is wrapped in '/', this trims it
        //and adds them back.
        this.getBaseName = function () {
            if (args.base) {
                return args.base;
            } else {
                return variables.package_version;
            }
        };

        //Get the filename that we should attempt to build - this is based off the
        //'base' parameter. This will name the file the same as you might expect
        this.getZipName = function () {
            var base = 'ovp', basematch;
            if (args.base) {
                basematch = args.base.match(/[\/]?(.+)[\/]?/)[1];
                return basematch;
            } else {
                return base + '-' + this.getBaseName() + '-' + this.getCommitHashShort();
            }
        };

        this.getRedirect = function (url) {
            var searchFunction;
            if (url.indexOf('?') >= 0) {
                url = url.substring(0, url.indexOf('?'));
            }

            searchFunction = function (redir) {
                if (redir.url instanceof RegExp && redir.url.test(url)) {
                    return true;
                } else {
                    return (url === redir.url);
                }
            };

            return variables.redirects.find(searchFunction);
        };

        this.proxyRequest = function (clientRequest, clientResponse, redir) {
            var proxyHost = variables.proxyHosts[redir.host], proxy;
            if (!proxyHost._activeProxy) {
                if (!httpProxy) {
                    httpProxy = require('http-proxy');
                }
                proxy = proxyHost._activeProxy = httpProxy.createProxyServer(proxyHost);
                proxy.on('error', function (err) {
                    console.log('Error with proxy ' + clientRequest.url, err);
                });
            }
            proxyHost._activeProxy.web(clientRequest, clientResponse);
        };

        //This only sort of makes sense here, but I am not sure where else it would belong
        this.serverMiddleWare = function (rootFolder) {
            var self = this;
            var serverRootAbs = __dirname + '/../' + rootFolder;
            return function (req, res, next) {
                var file, redir = self.getRedirect(req.url);
                if (redir) {
                    console.log('Getting redirected: [' + req.url + '] ');
                    if (redir.type === 'alias') {
                        file = serverRootAbs + redir.path;
                        fs.readFile(file, function (err, data) {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(data);
                            res.end();
                        });
                    } else if (redir.type === 'proxy') {
                        self.proxyRequest(req, res, redir);
                    } else if (redir) {
                        res.writeHead(302, {'Location': redir.path});
                        res.end();
                    }
                } else {
                    next();
                }
            };
        };

        this.setCommitHash = function (hash) {
            variables._git_commit_hash = hash;
        };

        this.setCommitHashShort = function (hash) {
            variables._git_commit_hash_short = hash;
        };

        this.getCommitHash = function () {
            if (variables._git_commit_hash) {
                return variables._git_commit_hash;
            } else {
                throw 'Unable to get GIT hash, make sure task depends on gitrev';
            }
        };

        this.getCommitHashShort = function () {
            if (variables._git_commit_hash_short) {
                return variables._git_commit_hash_short;
            } else {
                throw 'Unable to get GIT hash, make sure task depends on gitrev';
            }
        };

        this.getJsSourceFiles = function () {
            return variables.jsSource;
        };

        this.isWindows = function () {
            return isWindows;
        };

        this.getStateVis = function () {
            if (!this.isEnv('prod')) {
                return '<script src="//unpkg.com/ui-router-visualizer@3"></script>';
            } else {
                return '';
            }
        }

        this.getErrorCodeDBUrl = function() {
            return variables.errorCodesUrl;
        }

        this._init();

        /**
         * Grab -D parameters from the build script in order to override config.js variables.
         * @return {Object} buildEnvironmentConfig
         */
        function parseConfigOverrides() {
            var steps, config = {};
            var overrides = args.D;
            if (!overrides) {
                return {};
            }

            if (!overrides.map) {
                overrides = [overrides];
            }
            overrides.map(function (over) {
                return over.split('=');
            }).forEach(function (arg) {
                var last, len;
                if (arg.length > 1) {
                    steps = arg[0].split('.');
                    if (steps.length > 1) {
                        len = steps.length;
                        last = config;
                        steps.forEach(function (step, idx) {
                            if (!last[step]) {
                                last[step] = {};
                            }
                            if (idx == (len - 1)) {
                                last[step] = arg[1];
                            } else {
                                last = last[step];
                            }
                        });
                    } else {

                        config[arg[0]] = arg[1];
                    }
                }
            });
            return config;
        }
    };
    module.exports = new BuildConfig();
}());
