var LoginPage = require('../../pages/Login.page.js');
var CommonPage = require('../../pages/Common.page.js')

describe('Successful Login', function() {
    it("Successful Login smoke test", function () {
        LoginPage.open();
        LoginPage.login();
        LoginPage.submit();

        CommonPage.validateMenu();
        CommonPage.validateHeader();
        CommonPage.validateNoFooter();
    })
});
