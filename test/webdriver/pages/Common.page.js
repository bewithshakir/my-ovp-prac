var Page = require('./Page.js')

var Common = Object.create(Page, {

    menuFrameCss: { get: function () { return   '.navbar.sub-navigation' } },
    menuItemLiveCss: { get: function () { return  '#livetv-link' } },
    menuItemGuideCss: { get: function () { return  '#guide-link' } },
    menuItemLaterCss: { get: function () { return  '#watchLater-link' } },
    menuItemOnDemandCss: { get: function () { return  '#ondemand-link' } },
    menuItemCloudDvrCss: { get: function () { return  '#watchAnytime-link' } },
    menuItemRemoteDvrCss: { get: function () { return  '#dvr-link' } },
    menuItemStoreCss: { get: function () { return  '#store-link' } },
    menuItemSettingsCss: { get: function () { return '#settings-link' } },

    validateMenu: { value:  function() {
        console.log('Validate the menu');
        browser.waitForVisible(Common.menuItemSettingsCss);
        browser.waitForVisible(Common.searchCss);

        expect(browser.getText(Common.menuItemLiveCss)).toBe('Live TV');
        expect(browser.getText(Common.menuItemGuideCss)).toBe('Guide');
        expect(browser.getText(Common.menuItemLaterCss)).toBe('My Library');
        expect(browser.getText(Common.menuItemOnDemandCss)).toBe('On Demand');
        expect(browser.getText(Common.menuItemCloudDvrCss)).toBe('DVR');
        expect(browser.getText(Common.menuItemStoreCss)).toBe('Video Store');
        expect(browser.getText(Common.menuItemSettingsCss)).toBe('Settings');
        expect($(Common.searchCss).isVisible()).toBe(true);
    }
    },

    headerSupportCss: { get: function () { return '.top-level-nav__links li:nth-child(2)>a' } },
    signOutCss: { get: function () { return '.top-level-nav__links li:nth-child(3)>a'} },
    logoCss: { get: function () { return '.top-level-nav__logo .logo-header' } },

    validateHeader: { value:  function() {
        console.log('Validate the common header');
        browser.waitForVisible(Common.headerSupportCss);
        browser.waitForVisible(Common.signOutCss);
        browser.waitForVisible(Common.logoCss);
        expect(browser.getText(Common.headerSupportCss)).toBe('Support');
        expect(browser.getText(Common.signOutCss)).toBe('Sign Out');
        expect($(Common.logoCss).isVisible()).toBe(true);
    }
    },

    footerListCss: { get: function() {return '.site-footer > ul > li'}},
    siteFooterCss: { get: function () { return '.site-footer' } },
    copyrightCss: { get: function () { return '.site-footer  ul > li:nth-child(1)' } },
    privacyCss: { get: function () { return '.site-footer  ul > li:nth-child(2)' } },
    californiaCss: { get: function () { return '.site-footer  ul > li:nth-child(3)' } },
    termsCss: { get: function () { return '.site-footer  ul > li:nth-child(4)' } },
    feedbackCss: { get: function () { return '.site-footer  ul > li:nth-child(5)' } },
    devToolsCss: { get: function () { return '.site-footer  ul > li:nth-child(6)' } },
    charterFooterIconCss: { get: function () { return 'body > site-footer > div > footer > div.logo-wrapper > a > img' } },

    validateFooter: { value: function () {
        console.log('Validate the common footer');
        browser.waitForVisible(Common.siteFooterCss);
        browser.waitForVisible(Common.charterFooterIconCss);

        // var retCode = Common.validateListContains(Common.footerListCss, ['Feedback', 'Terms of Use']);
        // expect(retCode).toBe(true);

        expect($(Common.charterFooterIconCss).isVisible()).toBe(true);
        expect(browser.getText(Common.copyrightCss)).toBe('© 2017 Charter Communications');
        expect(browser.getText(Common.privacyCss)).toBe('Privacy Policy');
        expect(browser.getText(Common.californiaCss)).toBe('Your California Privacy Rights');
        expect(browser.getText(Common.termsCss)).toBe('Terms and Conditions');
        expect(browser.getText(Common.feedbackCss)).toBe('Feedback');
        expect($(Common.charterFooterIconCss).isVisible()).toBe(true);
    }
    },

    validateNoMenu: { value: function () {
        console.log('Validate common menu is not displayed');
        expect($(Common.menuFrameCss).isVisible()).toBe(false);
    }
    },

    validateNoFooter: { value: function () {
        console.log('Validate common footer is not displayed');
        expect($(Common.siteFooterCss).isVisible()).toBe(false);
    }
    },
    searchCss: { get: function () { return '#search-link'} },
    searchBarCss: { get: function () { return '#query'} },
    closeSearchBarCss: { get: function () { return 'form > div > a > span'} },

    needHelpLinkCss: { get: function () { return '.pull-right' } },
    footerLinksCss: { get: function () { return '.list-inline' } },
    supportLinkCss: { get: function () { return 'ul.nav.navbar-nav.top-navbar-right li:nth-child(2) a' } },


    clickDvrMenuItem: {
        value: function () {
            console.log('Clicking on DVR on the main menu');
            browser.waitForVisible(Common.menuItemSettingsCss);
            if (browser.isVisible(Common.menuItemRemoteDvrCss)) {
                browser.click(Common.menuItemRemoteDvrCss);
            } else {
                browser.click(Common.menuItemCloudDvrCss);
            }
            console.log('Waiting to see if "Unable to display recordings dialog is displayed');
            browser.pause(3000);
            if (browser.isVisible('#alert-title') &&  browser.isVisible('#popup-button')) {
                console.log('Discovered dialog - ' + browser.getText('#alert-title'));
                browser.click('#popup-button');
                browser.waitForVisible('#alert-title', 5000, true);
            }
        }
    },
    clickSettingsMenuItem: {
        value: function () {
            console.log('Clicking on Settings on the main menu');
            browser.waitForVisible(Common.menuItemSettingsCss);
            browser.click(Common.menuItemSettingsCss);
        }
    },
    clickLiveTvMenuItem: {
        value: function () {
            console.log('Clicking on Live TV on the main menu');
            browser.waitForVisible(Common.menuItemLiveCss);
            browser.click(Common.menuItemLiveCss);
        }
    },

    clickGuideMenuItem: {
        value: function () {
            console.log('Clicking on Guide on the main menu');
            browser.waitForVisible(Common.menuItemGuideCss);
            browser.click(Common.menuItemGuideCss);
        }
    },

    clickSearchMenuItem: {
        value: function () {
            console.log('Clicking on Search on the main menu');
            browser.waitForVisible(Common.searchCss);
            browser.click(Common.searchCss);
        }
    },

    clickOnDemandMenuItem: {
        value: function () {
            console.log('Clicking on On Demand on the main menu');
            browser.waitForVisible(Common.menuItemOnDemandCss);
            browser.click(Common.menuItemOnDemandCss);
        }
    },

    clickVideoStoreMenuItem: {
        value: function () {
            console.log('Clicking on Video Store on the main menu');
            browser.waitForVisible(Common.menuItemStoreCss);
            browser.click(Common.menuItemStoreCss);
        }
    },

    signOutOfSTVWeb: {
        value: function () {
            console.log('Clicking on Sign Out on the main menu');
            browser.waitForVisible(Common.signOutCss);
            browser.click(Common.signOutCss);
        }
    },

    clickMyLibraryMenuItem: {
        value: function () {
            console.log('Clicking on My Library on the main menu');
            browser.waitForVisible(Common.menuItemLaterCss);
            browser.click(Common.menuItemLaterCss);
        }
    },

    waitForNotVisible: { value: function (elementVal) {
        for( var i = 0; i < 30; i++) {
            console.log('Checking to see if element ' + elementVal + ' is visible')
            if (browser.isVisible(elementVal)) {
                browser.pause(1000);
            } else {
                break;
            }
        }
        return browser.isVisible(elementVal);
    }
    },

    validateListContains: { value: function( locator, contents) {
        console.log('validate list ('+locator + ') contains')
        browser.waitForVisible(locator);
        var ID = $$(locator);
        var retCode;
        contents.forEach(function(searchFor) {
            console.log('Checking for ' + searchFor + ' in ' + locator);
            retCode = ID.some(function (listItem) {
                if(listItem.getText().includes(searchFor)) {
                    return true;
                }
            });
            return retCode;
        });
        return retCode;
    }},

    loadingTracker: { get: function() {return '.loading-tracker'}}
});
module.exports = Common;
