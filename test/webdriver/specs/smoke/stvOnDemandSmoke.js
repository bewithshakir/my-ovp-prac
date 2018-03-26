var LoginPage = require('../../pages/Login.page.js');
var OnDemandPage = require('../../pages/OnDemand.page.js');
var CommonPage = require('../../pages/Common.page.js')

describe('On Demand', function() {
    it("On Demand smoke test", function () {
        LoginPage.open();
        LoginPage.login();
        LoginPage.submit();

        CommonPage.clickOnDemandMenuItem();
        OnDemandPage.validateOnDemandSmoke();

        CommonPage.validateMenu();
        CommonPage.validateHeader();
        CommonPage.validateFooter();
    })
});
