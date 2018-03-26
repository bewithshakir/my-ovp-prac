var Page = require('./Page.js')
var dvrPickerDlg = require('../dialogs/DvrPicker.dialog.js')


var rdvrSubMenuItems = [];
var DvrPage = Object.create(Page, {
    rdvrSubmenu: { get: function() { return 'site-header .sub-menu'}},
    rdvrToolbar: { get: function () { return '.rdvr-toolbar'} },
    rdvrNameLabelCss: { get: function () { return '.dvr-name-caption'} },
    rdvrNameValueCss: { get: function () { return '.dvr-name'} },
    rdvrRenameIconCss: { get: function () { return '.rdvr-toolbar .si-edit-f'} },  // the pencil icon to change the name
    rdvrSelectDvrLinkCss: { get: function () { return '.rdvr-toolbar .dvr-picker'} },  // the change dvr link to change dvrs
    rdvrSpaceUsedCss: { get: function () { return '.rdvr-toolbar .disk-usage .space-used'} },

    displayRemoteDvrDlg: {
        value: function () {
            console.log('Display Remote DVR dialog')
            browser.waitForVisible(DvrPage.rdvrSelectDvrLinkCss);
            browser.click(DvrPage.rdvrSelectDvrLinkCss);
        }
    },
    validateRdvrDlgFields: {
        value: function () {
            browser.waitForVisible(DvrPage.rdvrToolbar);
            browser.waitForVisible(DvrPage.rdvrSelectDvrLinkCss);
            expect(browser.getText(DvrPage.rdvrNameLabelCss)).toContain('DVR Name');
            expect(browser.getText(DvrPage.rdvrSelectDvrLinkCss)).toContain('Change DVR');
            expect(browser.isVisible(DvrPage.rdvrRenameIconCss)).toBe(true);
            expect(browser.isVisible(DvrPage.rdvrSpaceUsedCss)).toBe(true);
        }
    },
    fetchRdvrSubmenu: {
        value: function () {
            console.log('fetchRdvrSubmenu');
            browser.waitForVisible(DvrPage.rdvrSubmenu);
            console.log(browser.getText(DvrPage.rdvrSubmenu + ' > li:nth-child(1)'));
            var menu = $$(DvrPage.rdvrSubmenu);
            retCode = menu.forEach(function (listItem) {
                var a = listItem.getText();
                var b = a.split('\n');
                b.forEach(function(s) {
                    rdvrSubMenuItems.push(s);
                })
            });
        }
    },
    checkSubMenuItems: {
        value: function (value) {
            console.log('items length is ' + rdvrSubMenuItems.length);
            if (rdvrSubMenuItems.length === 0) {
                DvrPage.fetchRdvrSubmenu();
            }
            return rdvrSubMenuItems.includes(value);
        }
    },
    launchChangeRdvrDlg: {
        value: function () {
            browser.waitForVisible(DvrPage.rdvrSelectDvrLinkCss);
            browser.click(DvrPage.rdvrSelectDvrLinkCss);
            dvrPickerDlg.isDisplayed();
        }
    },

});
module.exports = DvrPage;
