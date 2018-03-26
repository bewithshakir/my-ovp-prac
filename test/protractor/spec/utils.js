/* globals window, browser, element, by, exports */
(function () {
    'use strict';

    exports.login = function login(user, pass) {
        if (!user) {
            user = 'system5';
        }
        if (!pass) {
            pass = '5ctgtest05';
        }
        return browser.wait(function () {
            return element(by.css('.login-form')).isPresent();
        }, 5000).then(function () {
            element(by.id('username')).sendKeys(user);
            element(by.id('password')).sendKeys(pass);

            return element(by.css('[value="Sign In"]')).click().then(() => {
                //Give a few moments to settle and draw the page.
                browser.sleep(500);
                browser.ignoreSynchronization = true; //Because we don't waint to wait for the dvr

                return browser.wait(function () {
                    return element(by.css('button.parental-submit')).isPresent();
                }, 10000).then(() => {
                    return element(by.css('button.parental-submit')).click().then(() => {
                        return browser.wait(function () {
                            return element(by.css('header.site-header')).isPresent();
                        }, 10000);

                    });
                });
            });
        });
    };

    exports.getLocalStorage = function () {
        var getAll = function () {
            var vals = {}, key;
            for (key in window.localStorage) {
                var value = window.localStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                } catch (e) {}
                vals[key] = value;
            }
            return JSON.stringify(vals);
        };
        return browser.executeScript(getAll);
    };

    exports.setLocalStorage = function (data) {
        var stringData = JSON.stringify(data);
        var setAll = `(function () {
            var key, setData = ${stringData};
            for (key in setData) {
                window.localStorage.setItem(key, JSON.stringify(setData[key]));
            }
        })()`
        return browser.executeScript(setAll);
    };
})();
