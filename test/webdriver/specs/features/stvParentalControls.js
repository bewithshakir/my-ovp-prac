var loginPage = require('../../pages/Login.page.js');
var commonPage = require('../../pages/Common.page.js')
var settingsPage = require('../../pages/Settings.page.js')
var onDemandPage = require('../../pages/OnDemand.page.js')
var pinDlg = require('../../dialogs/Pin.js')

describe('Test Settings Parental Controls', function() {
    it("Login", function () {
        loginPage.open();
        loginPage.login();
        loginPage.submit();
    }),
    it("Set/Reset Parental Controls PIN (C967748)", function() {

        settingsPage.showPCdialog();

        if (browser.isVisible(pinDlg.pinCss)) {
            console.log('Pin Dialog detected - click on forgot PIN');
            browser.waitForVisible(pinDlg.forgotPinLinkCss);
            browser.click(pinDlg.forgotPinLinkCss);  // launch reset PIN dialog
            browser.waitForVisible(pinDlg.passwordTextCss);
        } else {
            console.log('Unexpected dialog or state detected');
            expect($(pinDlg.pinCss).isVisible()).toBe(true);
        }

        expect($(pinDlg.passwordTextCss).isVisible()).toBe(true);
        pinDlg.validateResetPinFields();
        pinDlg.resetDlgCancel();

    })


});
