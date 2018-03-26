var Page = require('./Page.js')
var pinDlg = require('../dialogs/Pin.js')
var commonPage = require('./Common.page.js')


var SettingsPage = Object.create(Page, {
    favoritesCss: { get: function () { return '#sidebar-wrapper-settings>ul:nth-child(2)>li>a'} },
    parentalControlsCss: { get: function () { return '#sidebar-wrapper-settings>ul:nth-child(3)>li>a'} },
    accessibilityCss: { get: function () { return '#sidebar-wrapper-settings>ul:nth-child(3)>li:nth-child(4)'} },
    purchasePinCss: { get: function () { return '#sidebar-wrapper-settings>ul:nth-child(3)>li:nth-child(3)'} },

    channelIdCss: { get: function () { return '.favChanId'} },
    channelNameCss: { get: function () { return '.favCallSign'} },
    channelFavoriteButtonCss: { get: function () { return '.favBtn'} },

    parentalControlsFrameTitleCss: { get: function () { return '#parentalControls > h1'} },
    purchasePinFrameTitleCss: { get: function () { return '#purchasePin > h1'} },
    accessibilityFrameTitleCss: { get: function () { return '#accessibility > h1'} },

    validateSettingsSmoke: {
        value: function () {
            console.log('SettingsPage.validateSettingsSmoke');
            browser.waitForVisible(SettingsPage.favoritesCss);
            expect(browser.getText(SettingsPage.favoritesCss)).toBe('Favorites');
            expect($(SettingsPage.channelIdCss).isVisible()).toBe(true);
            expect($(SettingsPage.channelNameCss).isVisible()).toBe(true);
            expect($(SettingsPage.channelFavoriteButtonCss).isVisible()).toBe(true);
            browser.click(SettingsPage.parentalControlsCss);
            browser.waitForVisible(SettingsPage.parentalControlsFrameTitleCss)
            expect(browser.getText(SettingsPage.parentalControlsFrameTitleCss)).toBe('Website Parental Controls');
            browser.click(SettingsPage.purchasePinCss);
            browser.waitForVisible(SettingsPage.purchasePinFrameTitleCss);
            expect(browser.getText(SettingsPage.purchasePinFrameTitleCss)).toBe('Website Purchase PIN');
            browser.click(SettingsPage.accessibilityCss)
            browser.waitForVisible(SettingsPage.accessibilityFrameTitleCss)
            expect(browser.getText(SettingsPage.accessibilityFrameTitleCss)).toBe('Website Accessibility');
            // TODO:
            //validateListContains( menuItemCss, menuItems)
        }
    },

    open: { value: function(path) {
        console.log('Open the settings page ' + path);
        Page.open.call(this, path);
    } },

    parentalContolsSwitchCss: { get: function () { return '#parentalControls .switch'} },
    accessibilitySwitchCss: { get: function () { return 'ovp-switch'} },
    pcEnabledSwitchValueCss: { get: function () { return '#pc_enabled'} },

    // pass a boolean to represent the desired state: enabled / disabled
    changeAccessibility: { value: function(desiredState) {
        SettingsPage.open('settings/accessibility');
        browser.waitForVisible(SettingsPage.accessibilitySwitchCss);
        console.log('Waiting for animation to complete on accesibility enabled switch');
        browser.pause(1000);

        var buttonState = browser.getAttribute(SettingsPage.accessibilitySwitchCss, 'button-enabled');
        console.log('SettingsPage.changeAccessibility requested ' + desiredState + ' currently ' + buttonState);
        var currentState = buttonState == 'true';

        if (currentState !== desiredState) {
            browser.click(SettingsPage.accessibilitySwitchCss);
            browser.waitForVisible(SettingsPage.accessibilitySwitchCss);
            currentState = browser.getAttribute(SettingsPage.accessibilitySwitchCss, 'button-enabled');
            console.log('SettingsPage.changeAccessibility set to ' + currentState);
        }
    }
    },


    // pass a boolean to represent the desired state: enabled / disabled
    changeParentalControls: { value: function(desiredState) {
        SettingsPage.open('settings/parentalControls');
        browser.waitForVisible(SettingsPage.pcEnabledSwitchValueCss);
        browser.waitForVisible(commonPage.feedbackCss);

        console.log('Waiting for animation to complete on PC enabled switch');
        browser.pause(1000);
        var buttonState = (browser.getAttribute(SettingsPage.pcEnabledSwitchValueCss, 'button-enabled') == 'true');
        console.log('SettingsPage.changeParentalControls requested ' + desiredState + ' ' + typeof desiredState + ' currently ' + buttonState + ' ' + typeof buttonState);
        var currentState = buttonState == 'true';
        if (currentState !== desiredState) {
            browser.click(SettingsPage.parentalContolsSwitchCss);
            browser.waitForVisible(SettingsPage.parentalContolsSwitchCss);
            currentState = browser.getAttribute(SettingsPage.pcEnabledSwitchValueCss, 'button-enabled');
            pinVisible = browser.waitForVisible(pinDlg.pinCss, 1000);
            if (pinVisible) {
                pinDlg.enterPin('0000');
                pinDlg.pinSubmit();
            }
            browser.waitForVisible(SettingsPage.pcEnabledSwitchValueCss);
            console.log('SettingsPage.changeParentalControls set to ' + currentState);
        }
    }
    },


    editParentalControls: { value: function() {
        console.log('editParentalControls...')
        SettingsPage.open('settings/parentalControls');
        browser.waitForVisible('.loading-tracker');
        browser.waitForVisible('.loading-tracker', 10000, false);
        console.log('Waiting for animation to complete on PC enabled switch');
        browser.pause(1000);  // wait for animation to move pc enabled switch
        if (!browser.isVisible(SettingsPage.parentalControlsLockedContainerCss)) {
            console.log('Parental controls not locked');
            return;
        }
        browser.waitForVisible(SettingsPage.parentalControlsLockedContainerCss);
        console.log('Clicking on locked ');
        browser.click(SettingsPage.parentalControlsLockedContainerCss, 5,5); //
        pinVisible = browser.waitForVisible(pinDlg.pinCss, 1000);
        console.log('Entering PIN');
        if (pinVisible) {
            pinDlg.enterPin('0000');
            pinDlg.pinSubmit();
        }

        console.log('waiting for blocked to go away');
        browser.pause(1500);

        // browser.waitForVisible(SettingsPage.parentalControlsLockedContainerCss, 5000,false);

    }},

    // The actual set the pin form
    parentalControlsLockedContainerCss: { get: function () { return '.row.pc-locked.ng-scope'} },
    tvYbuttonCss: { get: function () { return '#parentalControls > div.blocks-container > div:nth-child(2) ovp-parental-controls-slider a:nth-child(1)'} },
    tvMabuttonCss: { get: function () { return '#parentalControls > div.blocks-container > div:nth-child(2) ovp-parental-controls-slider a:nth-child(6)'} },
    // The actual set the pin form
    movieGbuttonCss: { get: function () { return '#parentalControls > div.blocks-container > div:nth-child(3) ovp-parental-controls-slider a:nth-child(1)'} },
    movieAdultButtonCss: { get: function () { return '#parentalControls > div.blocks-container > div:nth-child(3) ovp-parental-controls-slider a:nth-child(6)'} },

    setAllTvRatings: {
        value: function () {
            console.log('setAllTvRatings')
            browser.waitForVisible(SettingsPage.tvYbuttonCss);
            browser.click(SettingsPage.tvYbuttonCss);
            if (!SettingsPage.isBlocked(SettingsPage.tvYbuttonCss)) {
                console.log('Clicking TV-Y button to set all tv blocks')
                browser.click(SettingsPage.tvYbuttonCss);
            } else {
                console.log('All tv blocks already set');
            }
        }
    },
    clearAllTvRatings: {
        value: function () {
            console.log('clearAllTvRatings');
            browser.waitForVisible(SettingsPage.tvMabuttonCss);
            if (SettingsPage.isBlocked(SettingsPage.tvMabuttonCss)) {
                console.log('Clicking tv MA button to clear all tv blocks')
                browser.click(SettingsPage.tvMabuttonCss);
            } else {
                console.log('All tv blocks already clear');
            }
        }
    },
    setAllMovieRatings: {
        value: function () {
            console.log('setAllMovieRatings')
            browser.waitForVisible(SettingsPage.movieGbuttonCss);
            if (!SettingsPage.isBlocked(SettingsPage.movieGbuttonCss)) {
                console.log('Clicking movie G button to set all movie blocks')
                browser.click(SettingsPage.movieGbuttonCss);
            } else {
                console.log('All movie blocks already set');
            }
        }
    },
    clearAllMovieRatings: {
        value: function () {
            console.log('clearAllMovieRatings');
            browser.waitForVisible(SettingsPage.movieAdultButtonCss);
            if (SettingsPage.isBlocked(SettingsPage.movieAdultButtonCss)) {
                console.log('Clicking movie Adult to clear all movie blocks');
                browser.click(SettingsPage.movieAdultButtonCss);
            } else {
                console.log('All movie blocks already clear');
            }
        }
    },
    isBlocked: {
        value: function(elementName) {
            blockedName = elementName + ' > span.twcicon-svg.twcicon-svg-lock';
            return browser.isVisible(blockedName);
        }
    },
    showPCdialog: { value: function() {
        console.log('launch PIN dialog')
        SettingsPage.open('settings/parentalControls');
        browser.waitForVisible(SettingsPage.pcEnabledSwitchValueCss);
        browser.waitForVisible(commonPage.feedbackCss);

        browser.pause(1000); //wait for animation
        browser.click(SettingsPage.pcEnabledSwitchValueCss);
        browser.waitForVisible(pinDlg.pinDlgCss, 1000);

    }}
});

module.exports = SettingsPage;