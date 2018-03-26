var LoginPage = require('../../pages/Login.page.js');
var CommonPage = require('../../pages/Common.page.js')
var GuidePage = require('../../pages/Guide.page.js')

describe('stvGuide', function() {
    it("stvGuide smoke test", function () {
        LoginPage.open();
        LoginPage.login();
        LoginPage.submit();

        CommonPage.clickGuideMenuItem();
        CommonPage.validateMenu();
        CommonPage.validateFooter();

        //new_utils(browser).verifyNumOfFooterLinks();
        // GuidePage.toggleFavorite('1');

        GuidePage.validateGuideSmoke();
        GuidePage.validateArrowButtons();

        // GuidePage.scrollDownA();
        // browser
        //     .pause(5000)
        //     .end();


    })
});
