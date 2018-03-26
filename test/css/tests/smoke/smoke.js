
/* jshint undef: false */

casper.test.begin('Smoke Test', (viewports.length * 2), function suite(test) {
    'use strict';

    // Initialize test suite, and pass directory name for screenshots.
    casper.phantomCssInit('smoke');

    casper.start();

    casper.each(viewports, function (self, viewport) {
        var width = viewport[0],
            height = viewport[1],
            label = viewport[2]; // jshint ignore:line

        casper.wait(1000, function () {

            casper.viewport(width, height, function () {

                test.comment('Opening at ' + width);

                casper.thenOpen(url);

                casper.then(function () {
                    casper.waitForSelector('.slide-image', function () {
                        casper.waitFor(casper.imagesToLoad, function () {
                            casper.log('Login page should be shown.', 'debug');
                            phantomcss.screenshot('body', 1000);
                        });
                    });
                });

                casper.then(function () {
                    var username = casper.cli.get('username'),
                        password = casper.cli.get('password');

                    casper.waitForSelector('.login-submit', function () {
                        casper.sendKeys('#username', username);
                        casper.sendKeys('#password', password);
                        casper.click('.login-submit');
                        casper.log('Parental message should be shown.', 'debug');
                        phantomcss.screenshot('body', 1000);
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.parental-submit', function () {
                        casper.click('.parental-submit');
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('#liveTv-link', function () {
                        casper.log('Live TV page should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.menu-primary > li:nth-child(3) > a', function () {
                        casper.click('.menu-primary > li:nth-child(3) > a');
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.recordIcon', function () {
                        casper.mouse.move('.row .showCell');
                        casper.log('Guide page should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.menu-primary > li:nth-child(4) > a', function () {
                        casper.click('.menu-primary > li:nth-child(4) > a');
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.box-art', function () {
                        casper.mouse.move('.product');
                        casper.log('On Demand > Featured page should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.click('#subNav .movies > a');
                    casper.waitForSelector('#gridbtn', function () {
                        casper.click('#gridbtn');
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.box-art', function () {
                        casper.log('On Demand > Movies > Grid view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.click('#listbtn');
                    casper.waitForSelector('.list-table .grid-item', function () {
                        casper.log('On Demand > Movies > List view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.click('#subNav .networks > a');
                    casper.waitForSelector('.box-art', function () {
                        casper.log('On Demand > Networks should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.click('#networksCategory > li:first-child > a');
                    casper.waitForSelector('.list-table .grid-item', function () {
                        casper.log('A&E list view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    // Make sure a DVR that supports RDVR is selected
                    casper.click('#device-list > li:nth-child(3) > a');
                    casper.click('#dvr-link');
                    casper.waitForSelector('.grid-btn', function () {
                        casper.click('.grid-btn');
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.row-art', function () {
                        casper.mouse.move('.my-recordings-item');
                        casper.log('DVR > My Recordings > Grid view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.click('.list-btn');
                    casper.waitForSelector('.ovp-check-box', function () {
                        casper.click('.ovp-check-box');
                        casper.log('DVR > My Recordings > List view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.click('.sub-menu li:nth-child(2) > a');
                    casper.waitForSelector('.row-title', function () {
                        casper.log('DVR > Scheduled view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // casper.then(function () {
                //     if (casper.exists('.conflict-header')) {
                //         casper.click('.conflict-header');

                //         casper.waitForSelector('.edit-conflict-content', function () {
                //             casper.log('DVR > Resolve Conflict dialog should be shown.', 'debug');
                //             phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                //         });
                //         casper.click('.edit-conflict-content .ovp-button');
                //     }
                // });

                casper.then(function () {
                    casper.click('.sub-menu li:nth-child(3) > a');
                    casper.waitForSelector('.row-title', function () {
                        casper.mouse.move('.row-title');
                        casper.log('DVR > Series Priority view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.tools a#settings', function () {
                        casper.click('.tools a#settings');
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.channel', function () {
                        casper.click('#heart');
                        casper.log('The Settings > Favorites view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.sendKeys('#channelSearch input', '512');
                    casper.sendKeys('#channelSearch input', casper.page.event.key.Enter);
                    casper.log('The Settings > Favorites view should be scrolled to channel 512.', 'debug');
                    phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                });

                casper.then(function () {
                    casper.waitForSelector('.settingsParental', function () {
                        casper.click('.settingsParental > a');
                        casper.log('The Settings > Parental Controls view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.settingsDevices', function () {
                        casper.click('.settingsDevices > a');
                        casper.log('The Settings > Devices view should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.search-field', function () {
                        casper.sendKeys('.search-field', 'fu');
                        casper.sendKeys('.search-field', casper.page.event.key.Enter);
                    });
                });

                casper.then(function () {
                    casper.waitForSelector('.searchResults .resultRow', function () {
                        casper.click('#default-searchFilter');
                        casper.log('The TV Listings Search Results should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // Deep link to appropriate page, because the target is `_blank`
                casper.thenOpen(url + '/login/privacy');

                casper.then(function () {
                    casper.waitForSelector('.legal', function () {
                        casper.log('The Privacy Policy page should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // Deep link to appropriate page, because the target is `_blank`
                casper.thenOpen(url + '/login/terms');

                casper.then(function () {
                    casper.waitForSelector('.legal', function () {
                        casper.log('The Terms of Use page should be shown.', 'debug');
                        phantomcss.screenshot({top: 0, left: 0, width: width, height: height}, 1000);
                    });
                });

                // TODO(@dura): --responsive tests will probably require that the user
                // logout, otherwise the login page isn't shown.
                // casper.logOut

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
