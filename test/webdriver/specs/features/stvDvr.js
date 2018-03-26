var loginPage = require('../../pages/Login.page.js');
var commonPage = require('../../pages/Common.page.js')
var settingsPage = require('../../pages/Settings.page.js');
var remoteDvrPage = require('../../pages/RemoteDvr.page.js')
var dvrPickerDlg = require('../../dialogs/DvrPicker.dialog.js');
var figaro = require('../../utils/Figaro.js')

var deviceId = "";

describe('Mock Object Example - DVR List validation ', function() {

    it("Login and get device id", function () {
        loginPage.open();
        loginPage.login();
        loginPage.submit();
        // After logging in the device_id has been changed to a new device_id.  
        // Unlike manual execution. This device id is unique each time automation is executed
        val = browser.localStorage('GET', 'device_id');
        deviceId = val.value.replace('"','').replace('"','');
        console.log("After login deviceId is -" + deviceId + "-");
    }),

    it("Upload mock object", function () {
        var payload = "[{\"macAddress\": \"CoolMac\", \"macAddressNormalized\": \"74EAE8145AD2\", \"dvr\": true, \"flickable\": true, \"simpleRecordingsOnly\": false, \"tuneLinear\": true, \"clientType\": \"ODN\", \"rdvrVersion\": 2, \"name\": \"family room\", \"guideDaysAvailable\": 14 }, {\"macAddress\": \"10EA59C73FA9\", \"macAddressNormalized\": \"10EA59C73FA9\", \"dvr\": true, \"flickable\": true, \"simpleRecordingsOnly\": false, \"tuneLinear\": true, \"clientType\": \"ODN\", \"rdvrVersion\": 2, \"name\": \"living room\", \"guideDaysAvailable\": 14 }, {\"macAddress\": \"001AC336E6B7\", \"macAddressNormalized\": \"001AC336E6B7\", \"dvr\": true, \"flickable\": true, \"simpleRecordingsOnly\": false, \"tuneLinear\": true, \"clientType\": \"ODN\", \"rdvrVersion\": 2, \"name\": \"bedroom\", \"guideDaysAvailable\": 14 } ]";
        figaro.uploadMockObject(deviceId, payload);
    }),

    it("DVR Configuration Example", function () {
        console.log('Turn off accesibility to access remote dvr functionality');
        settingsPage.changeAccessibility(true);
        settingsPage.changeAccessibility(false);

        commonPage.clickDvrMenuItem();
        // remoteDvrPage.fetchRdvrSubmenu();
        remoteDvrPage.checkSubMenuItems();
        remoteDvrPage.validateRdvrDlgFields();
        remoteDvrPage.launchChangeRdvrDlg();

        dvrNames = ['living room', 'family room', 'bedroom'];
        browser.pause(5000);

        var dvrs = dvrPickerDlg.getDvrs();
        dvrNames.some(function(dvrName) {
            if (!dvrs.includes(dvrName)) {
                expect('Could not find dvrName ').toEqual(dvrName)
            }
        })
    })
});
