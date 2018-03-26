
/* jshint undef: false, unused: false */

casper.start();

// casper.options.verbose = true;
// casper.options.logLevel = 'debug';
casper.options.waitTimeout = 7500;

var fs = require('fs'),
    phantomcss = require(fs.absolute(fs.workingDirectory + '/node_modules/phantomcss/phantomcss.js')),
    url = casper.cli.get('url'),
    responsive = casper.cli.get('responsive'),
    viewports = casper.getViewports(responsive),
    path = (responsive) ? '-responsive' : '',
    shotCount = 0;

/*
 * Capture the output of `console.log()` and `alert()` statements included in the
 * JavaScript on the site that is being tested.
 */
casper.on('remote.message', function (msg) {
    'use strict';
    this.echo('Logged in browser -> ' + msg, 'debug');
});

casper.on('remote.alert', function (msg) {
    'use strict';
    this.log('Alert shown in browser -> ' + msg, 'info');
});

casper.on('error', function (err) {
    'use strict';
    this.die('PhantomJS has errored: ' + err);
});

casper.on('resource.error', function (err) {
    'use strict';
    this.log('Resource load error: ' + err.url, 'warning');
});

/*
 * When a waitFor function times-out, log the error and save a screenshot
 * of the UI in its current state.
 */
casper.on('waitFor.timeout', function () {
    'use strict';
    this.capture(fs.workingDirectory + '/test/css/shots/timeouts/' + shotCount + '-timeout.png');
});

// Define global tearDown() function for the test scenarios.
casper.test.tearDown(function () {
    'use strict';
    casper.test.comment('Tear down test suite and clear cookies.');
    casper.clear();
    phantom.clearCookies();
});

casper.test.done();
