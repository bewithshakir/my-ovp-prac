var Page = require('./Page.js')

var username = "";
var password = "";

var LoginPage = Object.create(Page, {
    /**
     * define elements
     */
    usernameCss: { get: function () { return '#username'} },
    passwordCss: { get: function () { return '#password'} },
    rememberMeCss:     { get: function () { return '#content ovp-login-form  span.kite-custom-control-indicator'} },
    gotitButtonCss: { get: function () { return '.parental-form .btn'} },
    submitButtonCss: { get: function () { return '#content  input.kite-btn'} },

    descCss: { get: function () { return '#login-description'} },
    alertButtonCss: { get: function () { return '#popup-button'} },  // Dialog appears when window is too small

    /**
     * define or overwrite page methods
     */
    open: { value: function() {
        console.log('Open the website');
        Page.open.call(this, '');
    } },

    // preserves the original hard-coded login
    login: { value: function() {
        username = process.env.OVP_USERNAME;
        password = process.env.OVP_PASSWORD;
        u = process.env.OVERRIDE_USERNAME;
        p = process.env.OVERRIDE_PASSWORD;
        if (u) {
            username = u;
        }
        if (p) {
            password = p;
        }

        console.log('Enter values to login as ' + username)
        browser.waitForVisible(LoginPage.usernameCss);
        browser.setValue(LoginPage.usernameCss, username);
        browser.setValue(LoginPage.passwordCss, password);
        browser.waitForVisible(LoginPage.usernameCss);
        browser.click(LoginPage.rememberMeCss);
    }},

    invalidLogin: { value: function() {
        console.log('Enter values to login')
        browser.waitForVisible(LoginPage.usernameCss);
        browser.setValue(LoginPage.usernameCss, 'nottaUser');
        browser.setValue(LoginPage.passwordCss, 'nottaPassword');
        browser.waitForVisible(LoginPage.usernameCss);
        browser.click(LoginPage.rememberMeCss);
        console.log('After invalid login entry')
    } },

    submit: { value: function() {
        console.log('Submit and deal with message')
        browser.waitForVisible(LoginPage.submitButtonCss);
        browser.click(LoginPage.submitButtonCss);
        browser.waitForVisible(LoginPage.gotitButtonCss);
        browser.click(LoginPage.gotitButtonCss);
    } },

    loginDlgLogoCss: { get: function() { return '#content div.login-form h1.kite-h3'}},
    loginDlgTermsMsgCss: { get: function() { return '#content ovp-login-form :nth-child(5)'}},
    loginDlgTermsLinkCss: { get: function() { return '#content ovp-login-form :nth-child(5) > a:nth-child(1)'}},
    loginDlgInvalidUserMsgCss: { get: function() { return '#login-error .error-message .ng-binding'}},

    validateLoginBox: { value: function() {
        console.log('Validate Login Area');
        browser.waitForVisible(LoginPage.loginDlgLogoCss);
        browser.waitForVisible(LoginPage.loginDlgTermsLinkCss);
        expect($(LoginPage.loginDlgLogoCss).isVisible()).toBe(true);
        expect(browser.getText(LoginPage.loginDlgTermsMsgCss)).toBe('By clicking the "Sign In" button, you agree to the Terms and Conditions and Privacy Policy.');
    } },

    checkLoginErrorMsg: { value: function() {
        console.log('Check Login Error Message');
        browser.waitForVisible(LoginPage.loginDlgInvalidUserMsgCss);
        var t = browser.getText(LoginPage.loginDlgInvalidUserMsgCss);
        console.log("dialog message is " + t);
        expect(t).toBe('The info you entered doesn\'t match our records. Please try again. (WLI-1010)');
        }
    },

    ftTitleCss: { get: function() { return '#content  feature-tour .title'}},
    ftLiveCss: { get: function() { return '#tour-slides > div:nth-child(1) > feature-tour-slide  h2:nth-child(2)'}},
    ftChannelsCss: { get: function() { return '#tour-slides > div:nth-child(2) > feature-tour-slide  h2:nth-child(2)'}},
    ftExploreCss: { get: function() { return '#tour-slides > div:nth-child(3) > feature-tour-slide  h2:nth-child(2)'}},
    ftEveryWayCss: { get: function() { return '#tour-slides > div:nth-child(4) > feature-tour-slide  h2:nth-child(2)'}},
    ftThousandsCss: { get: function() { return '#tour-slides > div:nth-child(5) > feature-tour-slide  h2:nth-child(2)'}},
    ftFinishCss: { get: function() { return '#tour-slides > div:nth-child(6) > feature-tour-slide h2:nth-child(2)'}},
    ftDvrCss: { get: function() { return '#tour-slides > div:nth-child(7) > feature-tour-slide  h2:nth-child(2)'}},
    ftChargeCss: { get: function() { return '#tour-slides > div:nth-child(8) > feature-tour-slide  h2:nth-child(2)'}},

    validateFeatureTour: { value: function() {
        console.log('Validate Feature Tour on Login Page');
        browser.waitForVisible(LoginPage.ftTitleCss);
        //browser.waitForVisible(LoginPage.loginDlgTermsLinkCss);
        expect($(LoginPage.loginDlgLogoCss).isVisible()).toBe(true);
        expect(browser.getText(LoginPage.ftTitleCss)).toBe('Scroll to explore');
        expect(browser.getText(LoginPage.ftLiveCss)).toBe('Live TV almost anywhere');
        expect(browser.getText(LoginPage.ftChannelsCss)).toBe('Channels A - Z or 1, 2, 3');
        expect(browser.getText(LoginPage.ftExploreCss)).toBe('Search for anything, from anywhere');
        expect(browser.getText(LoginPage.ftEveryWayCss)).toBe('Every way to watch');
        expect(browser.getText(LoginPage.ftThousandsCss)).toBe('Thousands of FREE On Demand shows');
        expect(browser.getText(LoginPage.ftFinishCss)).toBe('Finish where you left off');
        expect(browser.getText(LoginPage.ftDvrCss)).toBe('Set your DVR');
        expect(browser.getText(LoginPage.ftChargeCss)).toBe("You're in charge");
    } },
    getUsername: { value: function() { return username}},
    getPassword: { value: function() { return password}},


});
module.exports = LoginPage;
