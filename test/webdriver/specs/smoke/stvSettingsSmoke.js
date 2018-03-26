var LoginPage = require('../../pages/Login.page.js');
var SettingsPage = require('../../pages/Settings.page.js');
var CommonPage = require('../../pages/Common.page.js')

describe('Settings Page', function() {
    it("Settings Page smoke test", function () {
        LoginPage.open();
        LoginPage.login();
        LoginPage.submit();

        CommonPage.clickSettingsMenuItem();
        SettingsPage.validateSettingsSmoke();
        CommonPage.validateMenu();
        CommonPage.validateHeader();
        CommonPage.validateFooter();
    })
});
