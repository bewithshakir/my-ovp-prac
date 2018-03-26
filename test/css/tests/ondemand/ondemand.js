
/* jshint undef: false */

casper.test.begin('On Demand Functional Test', (viewports.length * 3), function suite(test) {
    'use strict';

    casper.phantomCssInit('ondemand');

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

                casper.thenOpen(url + '/ondemand');

                // On Demand > Featured should be shown.
                casper.then(function () {
                    casper.waitForSelector('.box-art', function () {
                        casper.mouse.move('.product');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // A TV Series Product popover should be shown.
                casper.then(function () {
                    casper.click('a[href="#/tv_shows"]');
                    casper.waitForSelector('.box-art', function () {
                        casper.click('.product');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // TODO(@dura): Popover doesn't close.
                casper.then(function () {
                    casper.mouse.move('.popupCloseClick');
                    casper.click('.popupCloseClick');
                });

                casper.then(function () {
                    casper.click('a[href="#/movies"]');
                    casper.waitForSelector('.grid-item .box-art', function () {
                        casper.click('.product');
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
