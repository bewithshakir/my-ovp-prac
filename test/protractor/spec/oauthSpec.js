/* globals browser, element, by, expect */
describe('oauth flow', function () {
    'use strict';
    var protractorUtils = require('./utils.js');
    beforeEach(function () {

    });

    it('should store a token in local storage after logging in', () => {
        browser.get('/');
        browser.executeScript('window.sessionStorage.setItem("env", \'"prod"\');');
        browser.refresh().then(function () {
            protractorUtils.login().then(() => {

                protractorUtils.getLocalStorage().then((exp) => {
                    var vals = JSON.parse(exp);
                    // browser.pause();
                    let expDiff = Date.now() + vals['twctv:oauth:expiration'];
                    expect(expDiff).toBeGreaterThan(3600000);
                    let token = vals['twctv:oauth.token'];
                    let deviceVerifier = vals['twctv:oauth:device_verifier'];
                    browser.refresh().then(() => {
                        browser.wait(function () {
                            return element(by.id('guide-link')).isPresent();
                        }, 10000).then(() => {
                            protractorUtils.getLocalStorage().then(vars => {
                                var newVals = JSON.parse(vars);
                                //TODO: Want to attempt to keep the current token
                                expect(newVals['twctv:oauth.token']).not.toBe(token);
                                expect(newVals['twctv:oauth:device_verifier']).toBe(deviceVerifier);
                                token = newVals['twctv:oauth.token'];

                                openTabGetStorage().then(storageVals => {
                                    //Don't refresh token if it is not required
                                    //TODO: This should stay the same if possible
                                    expect(storageVals['twctv:oauth.token']).not.toBe(token);
                                    expect(storageVals['twctv:oauth:device_verifier']).toBe(deviceVerifier);

                                    //Modify the expiration
                                    protractorUtils.setLocalStorage({
                                        'twctv:oauth.token': 'eeeeeeee-ffff-1111-aaaa-000000000000',
                                        '_lastWriteTime': Date.now()
                                    }).then(() => {
                                        browser.refresh();
                                        return browser.wait(function () {
                                            return element(by.id('guide-link')).isPresent();
                                        }, 10000).then(() => {
                                            return protractorUtils.getLocalStorage().then(vars => {
                                                var updatedVals = JSON.parse(vars);
                                                //Should have a new token _and_ a new device verifier (since they where)
                                                //Both updated
                                                expect(updatedVals['twctv:oauth.token'])
                                                    .not.toBe('eeeeeeee-ffff-1111-aaaa-000000000000');
                                                expect(updatedVals['twctv:oauth:device_verifier'])
                                                    .not.toBe(deviceVerifier);
                                                //5 hours 55 minutes and 0 seconds - temp tokens only last a few minutes
                                                expect(updatedVals['twctv:oauth:expiration'])
                                                    .toBeGreaterThan(21300000 + Date.now())
                                                return updatedVals;
                                            });
                                        });
                                    }).then((sharedVals) => {
                                        //Post refresh
                                        //Switch to tab1 and navigate.
                                        //Should pick up on the other token
                                        browser.getAllWindowHandles().then((handles) => {
                                            return browser.switchTo().window(handles[0]).then(() => {
                                                element(by.id('watchLater-link')).click();
                                                browser.wait(() => {
                                                    return element(by.id('watch-later-list-0')).isPresent();
                                                }, 15000).then(() => {
                                                    return protractorUtils.getLocalStorage().then(vars => {
                                                        var updatedVals = JSON.parse(vars);
                                                        expect(updatedVals['twctv:oauth.token'])
                                                            .toBe(sharedVals['twctv:oauth.token']);
                                                        expect(updatedVals['twctv:oauth:device_verifier'])
                                                            .toBe(sharedVals['twctv:oauth:device_verifier']);
                                                        return updatedVals;
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });



    function openTabGetStorage() {
        return browser.executeScript('window.open()').then(() => {
            return browser.getAllWindowHandles().then(function (handles) {
                return browser.switchTo().window(handles[1]).then(function () {
                    browser.get('/guide');
                    return browser.wait(function () {
                        return element(by.id('guide-link')).isPresent();
                    }, 10000).then(() => {
                        return protractorUtils.getLocalStorage().then(vars => {
                            return JSON.parse(vars);
                        });
                    });
                }); // 0 or 1 to switch between the 2 open windows
            });
        });
    }

});
