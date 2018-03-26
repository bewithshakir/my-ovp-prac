var loginPage = require('../pages/Login.page.js');
var commonPage = require('../pages/Common.page.js')
var settingsPage = require('../pages/Settings.page.js')
var onDemandPage = require('../pages/OnDemand.page.js')

describe('Unit Test Parental Controls Methods', function() {
    it("Login", function () {
        loginPage.open();
        loginPage.login();
        loginPage.submit();
    }),
    xit("Call Edit Controls twice", function () {
        settingsPage.editParentalControls();
        settingsPage.editParentalControls();
    }),
    xit("Block Movies", function () {
        settingsPage.editParentalControls();
        console.log('SET ALL MOVIE RATINGS');
        settingsPage.clearAllTvRatings();
        browser.pause(1000);
        settingsPage.setAllMovieRatings();
        browser.pause(30000);

        commonPage.clickOnDemandMenuItem();
        browser.waitForVisible(onDemandPage.moviesSubMenuItemCss);
        console.log('Verify movies are blocked');
        browser.click(onDemandPage.moviesSubMenuItemCss);
        browser.pause(5000);
        console.log('Verify tv shows are NOT blocked');
        browser.click(onDemandPage.tvShowsSubMenuItemCss);
        browser.pause(5000);
    }),
    it("Block TV", function () {
        settingsPage.editParentalControls();
        settingsPage.clearAllMovieRatings();
        browser.pause(1000);
        settingsPage.setAllTvRatings();
        browser.pause(30000);

        commonPage.clickOnDemandMenuItem();
        browser.waitForVisible(onDemandPage.tvShowsSubMenuItemCss);
        browser.click(onDemandPage.tvShowsSubMenuItemCss);
        console.log('Verify tv shows are blocked');
        browser.pause(5000);
        browser.click(onDemandPage.moviesSubMenuItemCss);
        console.log('Verify all movies are NOT blocked');
        browser.pause(5000);
    }),
    xit("UnBlock TV", function () {
        settingsPage.editParentalControls();
        settingsPage.clearAllTvRatings();
        browser.pause(30000);

        commonPage.clickOnDemandMenuItem();
        browser.waitForVisible(onDemandPage.tvShowsSubMenuItemCss);
        browser.click(onDemandPage.tvShowsSubMenuItemCss);
        console.log('Verify tv shows are NOT blocked');
        browser.pause(5000);
        console.log('Verify all movies are NOT blocked');
        browser.click(onDemandPage.moviesSubMenuItemCss);
        browser.pause(5000);
    }),

    xit("Turn Parental Controls On", function() {
        settingsPage.editParentalControls();
        settingsPage.setAllTvRatings();
        browser.pause(1000);
        settingsPage.setAllMovieRatings();
        console.log('Waiting for parental controls to take effect')
        browser.pause(5000);

        // settingsPage.changeParentalControls(true);
        commonPage.clickOnDemandMenuItem();
        browser.waitForVisible(onDemandPage.tvShowsSubMenuItemCss);
        browser.click(onDemandPage.tvShowsSubMenuItemCss);
        browser.waitForVisible('.loading-tracker');
        browser.waitForVisible('.loading-tracker', 10000, false);
        browser.waitForVisible('#content ondemand-category  ovp-grid-list   ovp-product:nth-child(5)');
        var count = onDemandPage.findLockedItemCountGridList(10);
        console.log('tv shows has ' + count + ' blocked items');
        console.log('Verify tv shows are blocked');
        browser.pause(5000);

        browser.click(onDemandPage.moviesSubMenuItemCss);
        // browser.waitForVisible('.loading-tracker');
        // browser.waitForVisible('.loading-tracker', 10000, false);
        browser.waitForVisible('#content ondemand-category  ovp-grid-list   ovp-product:nth-child(5)');
        browser.pause(2000);
        var count = onDemandPage.findLockedItemCountGridList(10);
        console.log('movies has ' + count + ' blocked items');
        console.log('Verify movies are blocked');
        browser.pause(5000);


        settingsPage.changeParentalControls(false);
        browser.pause(5000);
        commonPage.clickOnDemandMenuItem();
        browser.waitForVisible(onDemandPage.tvShowsSubMenuItemCss);
        browser.click(onDemandPage.tvShowsSubMenuItemCss);
        browser.waitForVisible('.loading-tracker');
        browser.waitForVisible('.loading-tracker', 10000, false);
        browser.waitForVisible('#content ondemand-category  ovp-grid-list   ovp-product:nth-child(5)');
        var count = onDemandPage.findLockedItemCountGridList(10);
        console.log('tv shows has ' + count + ' blocked items');
        console.log('Verify tv shows are NOT blocked');
        browser.pause(5000);

        browser.click(onDemandPage.moviesSubMenuItemCss);
        // browser.waitForVisible('.loading-tracker');
        // browser.waitForVisible('.loading-tracker', 10000, false);
        browser.waitForVisible('#content ondemand-category  ovp-grid-list   ovp-product:nth-child(5)');
        browser.pause(2000);
        var count = onDemandPage.findLockedItemCountGridList(10);
        console.log('movies has ' + count + ' blocked items');
        console.log('Verify movies are NOT blocked');
        browser.pause(5000);
        console.log('Refreshing page');
        browser.refresh();
        browser.pause(5000);

    })


});
