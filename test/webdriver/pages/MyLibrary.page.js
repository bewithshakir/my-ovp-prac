var Page = require('./Page.js')


var MyLibraryPage = Object.create(Page, {
    recentlyWatchedCss: { get: function () { return '#watch-later-list-0'} },
    watchlistCss: { get: function () { return '#watch-later-list-1'} },
    // TODO: find new selectors
    recentlyWatchedClearListCss: { get: function () { return '#watch-later > section:nth-child(2) > a'} },
    watchlistClearListCss: { get: function () { return '#watch-later > section:nth-child(2) > a'} },
    rentals: { get: function () { return '#watch-later-list-2'} },
    watchLaterCategoriesCss: { get: function () { return '#watch-later h2'} },

    printMyLibraryCategories: {
        value: function() {
            console.log('MyLibraryPage printMyLibraryCategories');
            var categories = []
            browser.waitForVisible(MyLibraryPage.watchLaterCategoriesCss);
            var menu = $$(MyLibraryPage.watchLaterCategoriesCss);
            retCode = menu.forEach(function (listItem) {
                var a = listItem.getText();
                var b = a.split('\n');
                b.forEach(function(s) {
                    console.log(s);
                    categories.push(s);
                })
            });
            return categories;
        }
    },
    checkMyLibraryTitles: {
        value: function () {
            this.checkRecentlyWatched();
            this.checkWatchlist();
            this.checkRentals();
        }
    },

    checkRecentlyWatched: {
        value: function () {
            console.log('MyLibraryPage checkRecentlyWatched');
            browser.pause(2500)
            if (browser.isVisible(MyLibraryPage.recentlyWatchedCss)) {
                expect(browser.getText(MyLibraryPage.recentlyWatchedCss)).toBe('Recently Watched');
                // TODO: find new selectors
                // expect(browser.getText(MyLibraryPage.recentlyWatchedClearListCss)).toBe('Clear List');
            }
        }
    },

    checkWatchlist: {
        value: function () {
            console.log('MyLibraryPage checkWatchlist');
            browser.pause(2500);
            if (browser.isVisible(MyLibraryPage.watchlistCss)) {
                expect(browser.getText(MyLibraryPage.watchlistCss)).toBe('Watchlist');
                // TODO: find new selectors
                // expect(browser.getText(MyLibraryPage.watchlistClearListCss)).toBe('Clear List');
            }
        }
    },

    checkRentals: {
        value: function () {
            console.log('MyLibraryPage checkWatchlist');
            browser.pause(2500);
            if (browser.isVisible(MyLibraryPage.rentals)) {
                expect(browser.getText(MyLibraryPage.rentals)).toBe('Rentals');
            }
        }
    },
});
module.exports = MyLibraryPage;
