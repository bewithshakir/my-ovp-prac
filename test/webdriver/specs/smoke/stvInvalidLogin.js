var LoginPage = require('../../pages/Login.page.js');
var CommonPage = require('../../pages/Common.page.js')

describe('Invalid Login', function() {
    it("Invalid Login smoke test", function () {
        LoginPage.open();
        LoginPage.invalidLogin();
        browser.waitForVisible(LoginPage.submitButtonCss);
        browser.click(LoginPage.submitButtonCss);
        LoginPage.checkLoginErrorMsg();
        CommonPage.validateNoMenu();
        // Tab from the Password field to the Footer
        for(var i = 0; i < 7; i++) {
            browser.keys("\uE004");
        }
        LoginPage.validateFeatureTour();
        CommonPage.validateFooter();
    })
});
