
/* jshint undef: false */

casper.test.begin('Guide Smoke Test', (viewports.length), function suite(test) {
    'use strict';

    casper.phantomCssInit('guide');

    casper.start(url, function () {
        casper.ovpLogin();
    });

    casper.each(viewports, function (self, viewport) {
        var width = viewport[0],
            height = viewport[1],
            label = viewport[2]; // jshint ignore:line

        casper.wait(1000, function () {

            casper.viewport(width, height, function () {

                test.comment('Opening at ' + width);

                casper.thenOpen(url + '/guide');

                // The Guide should scroll out to the future.
                casper.then(function () {
                    casper.waitForSelector('#timeNavigation .next a', function () {
                        casper.click('#timeNavigation .next a');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // The Product Popover should be displayed.
                casper.then(function () {
                    casper.waitForSelector('.recordIcon', function () {
                        casper.click('#show29');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // The header should be sticky.
                casper.then(function () {
                    casper.waitForSelector('.recordIcon', function () {
                        casper.scrollTo(0, 600);
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

            });

        });

    });

    casper.then(function checkScreenshots() {
        phantomcss.compareSession();
    });

    casper.run(function () {
        this.log('THE END.');
        // phantomcss.getExitStatus(); // pass or fail?
        test.done();
    });

});
