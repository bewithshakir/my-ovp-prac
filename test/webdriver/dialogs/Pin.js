var Page = require('../pages/Page.js')

var PinDlg = Object.create(Page, {

    pinDlgCss: { get: function () { return '.modal-dialog'} },

    // To respond to the PIN dialog, use these elements
    closePinDlgCss: { get: function () { return '.popupCloseClick'} },
    pinCss:  { get: function () { return '#pin'} },
    pinInstructionsCss:  { get: function () { return '#pinInstructions'} },
    submitPinCss:  { get: function () { return '#pin-submit-button'} },
    forgotPinLinkCss:  { get: function () { return '.pin-form .help-link'} },

    validateEnterPinFields: {
        value: function () {
            browser.waitForVisible(PinDlg.forgotPinLinkCss);
            expect(browser.getText(PinDlg.pinInstructionsCss)).toContain('Parental Controls have been activated');
            expect(browser.getText(PinDlg.forgotPinLinkCss)).toContain('Forgot your PIN');
            console.log('Label above PIN entry field is: ' + browser.elementIdAttribute(pin,'label') + ' :' );
        }
    },
    enterPin: {
        value: function (pin) {
            browser.waitForVisible(PinDlg.pinCss);
            browser.setValue(PinDlg.pinCss, pin);
        }
    },
    pinSubmit: {
        value: function () {
            browser.waitForVisible(PinDlg.submitPinCss);
            browser.click(PinDlg.submitPinCss);
        }
    },
    pinCancel: {
        value: function () {
            browser.waitForVisible(PinDlg.closeResetDlgCss);
            browser.click(PinDlg.submitPinCss);
        }
    },

    pinAlertTitleCss: { get: function () { return '.pin-form .alert p:nth-of-type(1)'} },
    pinAlertQuestionCss: { get: function () { return '.pin-form .alert p:nth-of-type(2)'} },

    verifyPinAlert: {
        value: function (displayed) {
            expect(browser.isVisible(PinDlg.pinAlertTitleCss)).toBe(displayed);
            if(displayed) {
            } else {
                expect(browser.isVisible(PinDlg.pinAlertTitleCss)).toContain('The PIN you entered is incorrect.');
                expect(browser.isVisible(PinDlg.pinAlertQuestionCss)).toContain('Did you forget your PIN?\n');
            }
        }
    },

    // In case you need to set / reset your pin, use these elements to navigate to the reset pin form
    closeResetDlgCss: { get: function () { return '.popupCloseClick'} },
    msg1Css: { get: function () { return '#formInstructions p:nth-of-type(1)'} },
    msg2Css: { get: function () { return '#formInstructions p:nth-of-type(2)'} },
    passwordTextCss: { get: function () { return '#password'} },
    submitResetCss: { get: function () { return '.auth-form .submit-login'} },
    forgotPasswordLinkCss: { get: function () { return 'auth-form .help-link'} },

    validateResetPinFields: {
        value: function () {
            browser.waitForVisible(PinDlg.forgotPasswordLinkCss);
            expect(browser.getText(PinDlg.msg1Css)).toContain('Please enter your master account password to reset your PIN.');
            expect(browser.getText(PinDlg.msg2Css)).toContain('If you have trouble resetting your PIN, please call');
            expect(browser.getText(PinDlg.forgotPasswordLinkCss)).toContain('Forgot your password');
            expect(browser.isVisible(PinDlg.submitResetCss)).toBe(true);
            expect(browser.isVisible(PinDlg.closeResetDlgCss)).toBe(true);
        }
    },
    enterPassword: {
        value: function (password) {
            browser.waitForVisible(PinDlg.passwordTextCss);
            browser.setValue(PinDlg.passwordTextCss, password);
        }
    },
    resetDlgSubmit: {
        value: function () {
            browser.waitForVisible(PinDlg.submitResetCss);
            browser.click(PinDlg.submitResetCss);
        }
    },
    resetDlgCancel: {
        value: function () {
            browser.waitForVisible(PinDlg.closeResetDlgCss);
            browser.click(PinDlg.closeResetDlgCss);
        }
    },

    // The actual set the pin form
    createMsg1Css: { get: function () { return '#formInstructions p:nth-of-type(1)'} },
    createMsg2Css: { get: function () { return '#formInstructions p:nth-of-type(2)'} },
    newPinTextCss: { get: function () { return '#newPin'} },
    confirmPinTextCss: { get: function () { return '#confirmPin'} },
    createPinCss: { get: function () { return '.pin-form .btn'} },
    createMatchErrorCss: { get: function () { return 'pin-reset .help-block'} },

    validateCreatePinFields: {
        value: function () {
            browser.waitForVisible(PinDlg.closeResetDlgCss);
            browser.click(PinDlg.closeResetDlgCss);
        }
    },
    enterNewPin: {
        value: function (_pin) {
            browser.waitForVisible(PinDlg.newPinTextCss);
            browser.setValue(PinDlg.newPinTextCss, _pin);
        }
    },
    enterConfirmPin: {
        value: function (_pin) {
            browser.waitForVisible(PinDlg.confirmPinTextCss);
            browser.setValue(PinDlg.confirmPinTextCss, _pin);
        }
    },
    submitNewPin: {
        value: function() {
            browser.waitForVisible(PinDlg.createPinCss);
            browser.click(PinDlg.createPinCss);
            browser.waitForVisible(PinDlg.createPinCss, 5000, false);
        }
    }


});
module.exports = PinDlg;
