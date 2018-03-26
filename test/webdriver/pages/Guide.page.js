var Page = require('./Page.js')

var GuidePage = Object.create(Page, {

    calendarCSS: { get: function () { return ".calendar" } },
    currentDayCss: { get: function () { return ".day-box-container .date .day:nth-of-type(1)"} },
    currentDateCss: { get: function () { return ".day-box-container .date .day:nth-of-type(2)"} },
    filterAllChannelsCss: { get: function () { return ".channel-filter > a:nth-of-type(1)"} },
    filterFavoriteChannels: { get: function () { return ".channel-filter > a:nth-of-type(2)"} },
    filterRecordableChannels: { get: function () { return ".channel-filter > a:nth-of-type(3)"} },
    channelSearchCss: { get: function () { return "#channelSearch .searchField"} },
    gotoCss: { get: function () { return ".now"} },
    rightArrowCss: { get: function () { return "button.time-nav.next"} },
    leftArrowCss: { get: function () { return "button.time-nav.prev"} },
    timeListCss: { get: function () { return ".time-container .col:nth-of-type(1)"} },
    dateListCss: { get: function () { return ".carousel-layout > ul > li"} },

    guideListingCss: { get: function () { return '#content > div > section'} },
    guideContentCss: { get: function () { return '.channel-heading'} },
    guideChannelColumnCss: { get: function () { return '.channel-content-list-body'} },

    guideDown1TargetCss: { get: function () { return '#content > div > section > ul > div:nth-child(2) > li:nth-child(13)'} },
    firstChannelCss: { get: function () { return '#content > div > section > ul > div:nth-child(1) > li:nth-child(1)'} },

    firstChannelFavoriteCss: { get: function () { return '#content > div > section > ul > div:nth-child(1) > li:nth-child(1) > div > div.favorite'} },
    firstChannelNumberCss: { get: function () { return '#content ul :nth-child(1) > li:nth-child(1) .details .channel-number'} },
    firstChannelCallsignCss: { get: function () { return '#content ul :nth-child(1) > li:nth-child(1) .details .callsign'} },
    firstChannelLogoCss: { get: function () { return '#content ul :nth-child(1) > li:nth-child(1) .logo-box'} },
    leftCellTimeValueCss: { get: function () { return 'body > div.wrap.ng-scope > site-header > header > div:nth-child(5) > ui-view > div > guide-date > div > div.times > div > div > div:nth-child(1) > div'} },
    scrollDownA: {
        value: function (x) {
            browser.waitForVisible(GuidePage.firstChannelFavoriteCss);
            browser.moveToObject(GuidePage.firstChannelFavoriteCss, 0, 0);
            browser.click(GuidePage.firstChannelFavoriteCss);

            var goDown;
            for (goDown = 0; goDown < 25; goDown++) {
                browser.keys(browser.Keys.DOWN_ARROW)
                browser.pause(250);
            }
        }
    },

    scrollRight: {
        value: function (x) {
            var goRight;
            for (goRight = 0; goRight < 5; goRight++) {
                browser.keys(browser.Keys.RIGHT_ARROW)
                browser.pause(250);
            }
        }
    },

    validateGuideSmoke: {
        value: function () {
            browser.waitForVisible(GuidePage.currentDayCss);
            browser.waitForVisible(GuidePage.filterAllChannelsCss);
            browser.waitForVisible(GuidePage.rightArrowCss);
            browser.waitForVisible(GuidePage.channelSearchCss);
            browser.waitForVisible(GuidePage.guideChannelColumnCss);
            browser.waitForVisible(GuidePage.firstChannelNumberCss);
            browser.waitForVisible(GuidePage.firstChannelCallsignCss);
            browser.waitForVisible(GuidePage.firstChannelLogoCss);
            browser.waitForVisible(GuidePage.guideContentCss);
            expect($(GuidePage.leftArrowCss).isVisible()).toBe(false);
        }
    },


    nextTimeCss: { get: function () { return 'body > div.wrap.ng-scope > site-header > header > div:nth-child(5) > ui-view > div > guide-date > div > div.times > div > div > div:nth-child(5) > div'} },
    toggleFavorite : {
        value: function (x) {
            browser.getText(leftCellTimeValueCss, function (result) {
                console.log("value of current time is " + result.value + " :" + x)
                var lastTime = result.value
                console.log("value of last time is " + lastTime)
                browser
                    .click(rightArrowCss)
                    .pause(5000)
                    .getText(nextTimeCss, function (res1) {
                        console.log("value of new time is " + res1.value)
                        console.log("value of last time (inner) is " + lastTime)
                    })
                    .click(leftArrowCss)
            });
        }
    },

    validateArrowButtons: {
        value: function () {
            browser.waitForVisible(GuidePage.rightArrowCss);
            expect($(GuidePage.leftArrowCss).isVisible()).toBe(false);
            browser.click(GuidePage.rightArrowCss);
            browser.waitForVisible(GuidePage.leftArrowCss);
            expect($(GuidePage.leftArrowCss).isVisible()).toBe(true);
            browser.click(GuidePage.leftArrowCss);
            browser.pause(2000);
            expect($(GuidePage.leftArrowCss).isVisible()).toBe(false);
        }
    },
});
module.exports = GuidePage;