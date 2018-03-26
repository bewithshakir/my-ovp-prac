var LoginPage = require('../../pages/Login.page.js');
var CommonPage = require('../../pages/Common.page.js')
var MyLibraryPage = require('../../pages/MyLibrary.page.js')

describe('My Library', function() {
    it("My Library smoke test", function () {
        LoginPage.open();
        LoginPage.login();
        LoginPage.submit();

        CommonPage.clickMyLibraryMenuItem();
        MyLibraryPage.printMyLibraryCategories();
        // MyLibraryPage.checkRentals();
        // MyLibraryPage.checkRecentlyWatched();
        // MyLibraryPage.checkWatchlist();

        CommonPage.validateMenu();
        CommonPage.validateHeader();
        CommonPage.validateFooter();

    })
});
