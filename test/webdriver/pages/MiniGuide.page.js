var Page = require('./Page.js')
var commonPage = require('./Common.page.js')

var MiniGuidePage = Object.create(Page, {
        videoFrameCss: { get: function () { return '#playerWrapper'} },
        miniGuideMenuCss: { get: function () { return '#playerWrapper .filter-selection'} },
        filtersSubmenuCss: { get: function () { return '#filters-menu > div.filter-wrapper.accessibilityUser'} },
        miniGuideDropDownCss: { get: function () { return '#playerWrapper > player-controls > div > mini-guide > div > div.filter-selection'} },
        sortHeaderCss: { get: function () { return '#playerWrapper player-controls mini-guide .top-gradient-css'} },
        filtersHeaderCss: { get: function () { return '#filters-menu > div.filter-wrapper.accessibilityUser > section > div.filter-header'} },
        //sortApplyButtonCss: { get: function () { return '#filters-menu > div.button-wrapper.ng-scope > button.btn.btn-primary'} },
        //sortCancelButtonCss: { get: function () { return '#filters-menu > div.button-wrapper.ng-scope > button.btn.btn-default'} },
        filtersApplyButtonCss: { get: function () { return '#filters-menu .filter-wrapper .btn.btn-primary'} },
        filtersCancelButtonCss: { get: function () { return '#filters-menu .filter-wrapper .btn.btn-default'} },
        miniGuideControlsCss: { get: function () { return '#playerWrapper player-controls mini-guide .filter-selection'} },


        clickVideoFrame: {
            value: function () {
                console.log('Clicking in video frame to launch Mini-Guide');
                browser.waitForVisible(MiniGuidePage.videoFrameCss);
                browser.click(MiniGuidePage.videoFrameCss, 200, 200);
            }
        },

        dismissMiniGuide: {
            value: function () {
                console.log('Dismiss Mini Guide');
                console.log('   Checking to ensure Mini-Guide is visible');
                browser.waitForVisible(MiniGuidePage.miniGuideDropDownCss);
                browser.pause(1000);
                browser.click(MiniGuidePage.videoFrameCss, 640, 400);
                console.log('   Waiting for Mini-Guide to be not visible');
                commonPage.waitForNotVisible(MiniGuidePage.miniGuideDropDownCss);
            }
        },
        validateMiniGuideSmoke: {
            value: function () {
                console.log('Validate Mini-Guide components');
                browser.waitForVisible(MiniGuidePage.miniGuideMenuCss);
                browser.waitForVisible(MiniGuidePage.filtersSubmenuCss);
                browser.waitForVisible(MiniGuidePage.sortHeaderCss);
                browser.waitForVisible(MiniGuidePage.filtersHeaderCss);
                // Missing, should it be?
                //browser.waitForVisible(MiniGuidePage.sortApplyButtonCss);
                //browser.waitForVisible(MiniGuidePage.sortCancelButtonCss);
                browser.waitForVisible(MiniGuidePage.filtersApplyButtonCss);
                browser.waitForVisible(MiniGuidePage.filtersCancelButtonCss);
                // new_utils(browser).validateListContains(filtersSubmenuCss, ["TV Shows", "Movies", "Sports"]);
            }
        },
        getMiniGuideRowCss: {
            value: function (index) {
                return '#channel-browser > li:nth-of-type(' + index + ')';
            }
        },
        getMiniGuideLockCss: {
            value: function (index) {
                return getMiniGuideRowCss + ' .status-icon .twcicon-svg';
            }
        },

    })
    ;

module.exports = MiniGuidePage;
