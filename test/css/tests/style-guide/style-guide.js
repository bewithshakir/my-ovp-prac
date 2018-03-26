
/* jshint undef: false */

casper.test.begin('Style Guide Smoke Test', (6 * viewports.length), function suite(test) {
    'use strict';

    casper.phantomCssInit('style-guide');

    casper.start(url);

    casper.each(viewports, function (self, viewport) {
        var width = viewport[0],
            height = viewport[1],
            label = viewport[2]; // jshint ignore:line

        casper.wait(1000, function () {

            casper.viewport(width, height, function () {

                test.comment('Opening at ' + width + 'px');

                casper.thenOpen(url + '/style-guide.html', function () {
                    phantomcss.screenshot('#type', 'type');
                    phantomcss.screenshot('#buttons', 'buttons');
                    phantomcss.screenshot('#twcicons', 'twcicons');
                    phantomcss.screenshot('#components-alerts', 'alerts');
                    phantomcss.screenshot('#ovp-components-spinner', 'spinner');
                    phantomcss.screenshot('#ovp-components-critic-ratings', 'critic');
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
