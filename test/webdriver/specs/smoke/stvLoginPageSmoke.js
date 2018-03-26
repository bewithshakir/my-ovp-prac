var LoginPage = require('../../pages/Login.page.js');
var CommonPage = require('../../pages/Common.page.js')

describe('Login Page Validation', function() {
    it("Login Page Only smoke test", function () {
        LoginPage.open();
        CommonPage.validateNoMenu();
        LoginPage.validateLoginBox();
        LoginPage.validateFeatureTour();
        CommonPage.validateFooter();
    })
});
