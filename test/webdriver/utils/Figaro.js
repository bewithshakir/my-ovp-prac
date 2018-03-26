var Page = require('../pages/Page.js');
var loginPage = require('../pages/Login.page.js')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var Figaro = Object.create(Page, {
    uploadMockObject: {
        value: function ( deviceId, payload) {
            var data = JSON.stringify({
                "username": loginPage.getUsername(),
                "password": loginPage.getPassword(),
                "deviceId": deviceId,
                "uniqueId": "328947294723947238472834723",
                "stbOverride": true,
                "stbString": payload
            });

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    console.log(this.responseText);
                }
            });

            console.log(data);
            xhr.open("PUT", "https://stva.figaro.spectrumtoolbox.com/auth/oauth/auto/authorize/authorization");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Cache-Control", "no-cache");

            xhr.send(data);
        }
    }

});

module.exports = Figaro;