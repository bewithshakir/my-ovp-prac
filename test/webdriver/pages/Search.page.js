var Page = require('./Page.js')

var SearchPage = Object.create(Page, {
    searchCss: { get: function () { return '#search-link'} },
    searchBarCss: { get: function () { return '#query'} },
    closeSearchBarCss: { get: function () { return '#search > div > search-header > nav > div > div > search-input > form > div > a > span'} },

    searchTitleCss: { get: function () { return '#quickResults > div > div > div:nth-child(1) > h4'} },
    searchPersonCss: { get: function () { return '#quickResults > div > div > div:nth-child(2) > h4'} },
    searchSportsCss: { get: function () { return '#quickResults > div > div > div:nth-child(3) > h4'} },
    searchTeamCss: { get: function () { return '#quickResults > div > div > div:nth-child(4) > h4'} },
    searchResltsTitleCss: { get: function () { return '.container'} },
    recentSearchesCss: { get: function () { return '#recentSearches > div > div > div > h4'} },

    validateSearchSmoke: {
        value: function () {
            browser.waitForVisible(SearchPage.searchBarCss);
            browser.pause(2000);

            // browser.elementIdClear(SearchPage.searchBarCss);
            browser.setValue(SearchPage.searchBarCss, 'Mi');
            browser.pause(2000);
            browser.waitForVisible(SearchPage.searchTitleCss);
            browser.waitForVisible(SearchPage.searchPersonCss);
            browser.waitForVisible(SearchPage.searchSportsCss);
            browser.waitForVisible(SearchPage.searchTeamCss);

            expect(browser.getText(SearchPage.searchTitleCss)).toBe('Title');
            expect(browser.getText(SearchPage.searchPersonCss)).toBe('Person');
            expect(browser.getText(SearchPage.searchSportsCss)).toBe('Sports');
            expect(browser.getText(SearchPage.searchTeamCss)).toBe('Team');
        }
    },

    executeSearch: {
        value: function (searchString) {
            // browser.elementIdClear(searchBarCss);
            browser.setValue(SearchPage.searchBarCss, '');
            browser.setValue(SearchPage.searchBarCss, searchString);
            browser.waitForVisible(SearchPage.searchResltsTitleCss);
            expect($(SearchPage.searchResltsTitleCss).isVisible()).toBe(true);
        }
    }

});

module.exports = SearchPage;
