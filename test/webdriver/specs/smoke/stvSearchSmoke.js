var LoginPage = require('../../pages/Login.page.js');
var SearchPage = require('../../pages/Search.page.js');
var CommonPage = require('../../pages/Common.page.js')

describe('Search Page', function() {
    it("Search Page smoke test", function () {
        LoginPage.open();
        LoginPage.login();
        LoginPage.submit();

        CommonPage.clickSearchMenuItem();
        SearchPage.validateSearchSmoke();

        SearchPage.executeSearch('Tupac Shakur');
        // TODO:  Address issue requiring promises
        // SearchPage.executeSearch('Jennifer Lawrence');
        // SearchPage.executeSearch('Sophie Turner');
        CommonPage.validateHeader();
        CommonPage.validateNoMenu();
        CommonPage.validateNoFooter();
    })
});
