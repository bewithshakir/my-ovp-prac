var Page = require('../pages/Page.js')

var dvrListItems = [];
var DvrPickerDlg = Object.create(Page, {

    DvrPickerDlgCss: { get: function () { return '.modal-dialog'} },

    // To respond to the PIN dialog, use these elements
    rdvrDlgCloseIconCss: { get: function () { return '.popupCloseClick'} },
    rdvrDlgTitleCss:  { get: function () { return '#modal  stb-picker .header'} },
    rdvrDlgListCss:  { get: function () { return '#modal  stb-picker .devices-list-container'} },
    rdvrDlgCloseBtnCss:  { get: function () { return '#modal stb-picker .kite-btn-primary'} },

    validateRdvrDlgFields: {
        value: function () {
            browser.waitForVisible(DvrPickerDlg.rdvrDlgCloseBtnCss);
            expect(browser.getText(DvrPickerDlg.rdvrDlgTitleCss)).toContain('Select your DVR');
            expect(browser.getText(DvrPickerDlg.rdvrDlgCloseBtnCss)).toContain('Close');
        }
    },
    isDisplayed: {
        value: function () {
            browser.waitForVisible(DvrPickerDlg.rdvrDlgCloseBtnCss);
        }
    },
    getDvrs: {
        value: function () {
            console.log('DvrPickerDlg.getDvrs');
            dvrListItems = [];
            browser.waitForVisible(DvrPickerDlg.rdvrDlgListCss);
            var menu = $$(DvrPickerDlg.rdvrDlgListCss);
            retCode = menu.forEach(function (listItem) {
                var a = listItem.getText();
                var b = a.split('\n');
                b.forEach(function(s) {
                    dvrListItems.push(s);
                })
            });
            return dvrListItems;
        }
    },
});
module.exports = DvrPickerDlg;
