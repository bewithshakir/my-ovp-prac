var Page = require('./Page.js')

var OnDemandPage = Object.create(Page, {

    swimlaneRightArrow: { get: function () { return 'div.control-arrow.default-arrow-icon.arrow-right'} },

    onDemandMenuCss: { get: function () { return 'div.sub-header-container'} },
    categoryTitle1Css: { get: function () { return 'gallery-summary-page :nth-child(2)  ovp-carousel h2'} },
    categoryTitle3Css: { get: function () { return 'gallery-summary-page :nth-child(4)  ovp-carousel h2'} },

    category1BoxArtStatus1: { get: function () { return 'gallery-summary-page div:nth-child(2) ovp-carousel .carousel-layout  ovp-product:nth-child(1) .playStatus'} },
    category1AssetTitle1: { get: function () { return 'gallery-summary-page div:nth-child(2) ovp-carousel .carousel-layout  ovp-product:nth-child(1) .program-title'} },
    category1NetworkIcon1: { get: function () { return 'gallery-summary-page div:nth-child(2) ovp-carousel .carousel-layout  ovp-product:nth-child(1) img'} },
    featuredSubMenuItemCss: { get: function () { return 'div.sub-header-container > div > ul > li:nth-child(1) > a'} },
    tvShowsSubMenuItemCss: { get: function () { return 'div.sub-header-container > div > ul > li:nth-child(2) > a'} },
    moviesSubMenuItemCss: { get: function () { return 'div.sub-header-container > div > ul > li:nth-child(3) > a'} },
    kidsSubMenuItemCss: { get: function () { return 'div.sub-header-container > div > ul > li:nth-child(4) > a'} },

    /**
     * works for TV Shows, Movies, Kids, But NOT Featured (which is a Carousel)
     * param: howMany - look at this many titles
     */
    findLockedItemCountGridList: {
        value: function(howMany) {
            var count = 0;
            for( var idx = 1; idx <= howMany; idx++) {
                var loc = '#content ondemand-category ovp-grid-list ovp-product:nth-child(' + idx + ') .twcicon-svg-lock';
                if(browser.isVisible(loc)) {
                    count++;
                }
            }
            return count;
        }
    },


    validateOnDemandSmoke: {
        value: function () {
            // browser.waitForVisible(OnDemandPage.swimlaneRightArrow);
            browser.waitForVisible(OnDemandPage.onDemandMenuCss);
            browser.waitForVisible(OnDemandPage.categoryTitle1Css);
            browser.waitForVisible(OnDemandPage.category1BoxArtStatus1);
            browser.waitForVisible(OnDemandPage.category1AssetTitle1);
            browser.waitForVisible(OnDemandPage.category1NetworkIcon1);
            browser.waitForVisible(OnDemandPage.tvShowsSubMenuItemCss);
            // expect($(OnDemandPage.swimlaneRightArrow).isVisible()).toBe(true);
            expect($(OnDemandPage.onDemandMenuCss).isVisible()).toBe(true);
            expect($(OnDemandPage.categoryTitle1Css).isVisible()).toBe(true);
            expect($(OnDemandPage.category1BoxArtStatus1).isVisible()).toBe(true);
            expect($(OnDemandPage.category1AssetTitle1).isVisible()).toBe(true);
            expect($(OnDemandPage.category1NetworkIcon1).isVisible()).toBe(true);
            expect($(OnDemandPage.tvShowsSubMenuItemCss).isVisible()).toBe(true);

        }
    }
});
module.exports = OnDemandPage;