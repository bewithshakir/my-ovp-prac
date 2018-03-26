function Page () {
    this.title = 'My Page';
}

var flag = false;
Page.prototype.open = function (path) {
    browser.url('/' + path);
    if (!flag) {
        var backend = 'figaro-prod';
        console.log('===== Override default environment with ' + backend + ' =====');
        flag = true;
        browser.localStorage('POST', {key: "env", value: backend});
        browser.pause(1000);
        browser.url('/' + path);
        console.log('===== Override completes =====');
    }
};
module.exports = new Page();
