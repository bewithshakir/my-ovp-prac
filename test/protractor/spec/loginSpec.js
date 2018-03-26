/* globals browser, element, by, expect */
describe('login', function () {
    'use strict';
    var protractorUtils = require('./utils.js');
    // console.log("L:gonSpec", protractorUtils);

    afterEach(function () {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        browser.restart();
    });

    xit('should navigate to my-recordings by default', function () {
        browser.get('/rdvr');
        protractorUtils.login('system1', '1ctgtest01').then(() => {
            browser.wait(function () {
                return element(by.css('.sub-view-header-disk-usage')).isPresent();
            }, 10000).then(() => {
                //Now on the my-recordings page!
                expect(browser.getLocationAbsUrl()).toMatch('/rdvr/my-recordings');
                browser.ignoreSynchronization = true;
            });
        });
    });

    it('should render the my-recordings page if the deep url is dvr#/rdvr/my-recordings', function () {
        browser.get('/dvr#/rdvr/my-recordings');
        protractorUtils.login().then(() => {
            expect(browser.getLocationAbsUrl()).toMatch('/rdvr/my-recordings');
            browser.ignoreSynchronization = false;
        });
    });

    it('should render the my-recordings page if the deep url is dvr#/rdvr/scheduled', function () {
        browser.get('/dvr#/rdvr/scheduled');
        protractorUtils.login().then(() => {
            expect(browser.getLocationAbsUrl()).toMatch('/rdvr/scheduled');
            browser.ignoreSynchronization = false;
        });
    });

    it('should redirect to livetv if the url is bogus', function () {
        browser.get('/adsfdsafewaqfe');
        protractorUtils.login().then(() => {
            expect(browser.getLocationAbsUrl()).toMatch('/livetv');
            browser.ignoreSynchronization = false;
        });
    });

    it('should render the livetv page by default', function () {
        browser.get('/');
        protractorUtils.login().then(() => {
            expect(browser.getLocationAbsUrl()).toMatch('/livetv');
            browser.ignoreSynchronization = false;
        });
    });

});
