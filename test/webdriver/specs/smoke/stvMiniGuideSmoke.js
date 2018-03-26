var LoginPage = require('../../pages/Login.page.js');
var MiniGuidePage = require('../../pages/MiniGuide.page.js');
var CommonPage = require('../../pages/Common.page.js')

describe('MiniGuide', function() {
    it("Mini Guide Smoke Test", function () {
        LoginPage.open();
        LoginPage.login();
        LoginPage.submit();

        browser.waitForVisible(MiniGuidePage.videoFrameCss);
        browser.waitForVisible(MiniGuidePage.miniGuideDropDownCss);
        console.log('Found mini guide menu ')
        browser.pause(5000);
        browser.click(MiniGuidePage.miniGuideDropDownCss);
        MiniGuidePage.validateMiniGuideSmoke();

        CommonPage.validateMenu();
        CommonPage.validateHeader();
        CommonPage.validateNoFooter();
    })
});
