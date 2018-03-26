var Page = require('./Page.js');
var pinDlg = require('../dialogs/Pin.js');
var commonPage = require('./Common.page.js');

var LiveTvPage = Object.create(Page, {
    networkIconCss: { get: function () { return 'div.left-col.asset-metadata.control-item > div.network-logo > img' } },
    shortDescriptionCss: { get: function () { return 'div.title-panel > div.title.truncate.ng-binding'} },
    infoIconCss: { get: function () { return '#info-panel-control > img'} },
    ccIconCss: { get: function () { return 'div.right-col.common-controls > toggle-cc > div > img'} },
    sapIconCss: { get: function () { return 'div.right-col.common-controls > toggle-sap'} },
    ccSettingsIconCss: { get: function () { return 'div.right-col.common-controls > toggle-cc-settings > div > img'} },
    unblockButtonCss: { get: function () { return '#unblock-parental-controls-button'} },

    validateLiveTV: {
        value: function () {
            new_utils(browser).commonHeader();
            new_utils(browser).validateMenu();
            new_utils(browser).clickUnblockButton(); // when parental controls is on
            new_utils(browser).enterParentalControlPIN('1111');
            new_utils(browser).validateNoTrailer();
            new_utils(browser).validateSupportNavigation(); // Sometimes gets an 'Unable to Fullfill' request error modal
            new_utils(browser).clickBrowserBackButton();
        }
    },

    validateCommonLiveTVElements: {
        value: function () {
            browser.waitForVisible(networkIconCss);
            browser.waitForElementVisible(shortDescriptionCss);
            browser.waitForElementVisible(infoIconCss);
            browser.waitForElementVisible(ccIconCss);
            browser.waitForElementVisible(sapIconCss);
            browser.waitForElementVisible(ccSettingsIconCss);
        }
    },

    signOutAndCloseBrowser: {
        value: function () {
            new_utils(browser).signOutOfSTVWeb();
            browser.end();
        }
    },

    isPCblocked: {
        value: function () {
            return browser.isVisible(LiveTvPage.unblockButtonCss);

        }
    },

    // One way to disable parental controls is to use the blocking screen
    // This method will return false if the unblock dialog is not displayed
    // even though parental controls may be enabled
    disableParentalControls: {
        value: function () {
            retCode = isPCblocked();
            if(retCode) {
                browser.click(LiveTvPage.unblockButtonCss);
                pinDlg.enterPin('0000');
                commonPage.waitForNotVisible(LiveTvPage.unblockButtonCss);
            }
            return retCode;
        }
    }


})
;

module.exports = LiveTvPage;