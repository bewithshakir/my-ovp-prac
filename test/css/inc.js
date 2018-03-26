
/* jshint undef: false */

casper.phantomCssInit = function phantomCssInit(dir) {
    'use strict';

    // Initialize PhantomCSS
    phantomcss.init({
        casper:                     casper,
        libraryRoot:                fs.absolute(fs.workingDirectory + '/node_modules/phantomcss'),
        screenshotRoot:             fs.absolute(fs.workingDirectory + '/test/css/shots/screenshots' + path + '/' + dir),
        comparisonResultRoot:       fs.absolute(fs.workingDirectory + '/test/css/shots/screenshots' + path + '/' + dir),
        failedComparisonsRoot:      fs.absolute(fs.workingDirectory + '/test/css/shots/failures' + path + '/' + dir),
        fileNameGetter:             casper.shotNameGetter,
        addLabelToFailedImage:      false,
        mismatchTolerance:          0.01,
        rebase:                     casper.cli.get('rebase')

        // cleanupComparisonImages: true,
        // fileNameGetter: function overide_file_naming(){},
        // onPass: function passCallback(){},
        // onFail: function failCallback(){},
        // onTimeout: function timeoutCallback(){},
        // onComplete: function completeCallback(){},
        // hideElements: '#thing.selector',
        // outputSettings: {
        //     errorColor: {red: 255, green: 255, blue: 0},
        //     errorType: 'movement',
        //     transparency: 0.25
        // }
    });
};

casper.getViewports = function getViewports(responsive) {
    'use strict';
    if (responsive === true) {
        return [
            [320, 568, 'iphone5'], // iPhone 5
            // [375, 667, 'iphone6'], // iPhone 6
            // [414, 736, 'iphone6p'], // iPhone 6+
            [768, 1024, 'ipadportrait'], // iPad Mini - Portrait
            // [1024, 768, 'ipadlandscape'], // iPad Mini - Landscape
            // [1280, 800, 'laptop'], // Laptop MDPI
            [1800, 900, 'laptopmax'] // Laptop Max
        ];
    } else {
        return [
            [1280, 800, 'laptop'] // Laptop MDPI
        ];
    }
};

casper.isFile = function isFile(path) {
    'use strict';
    var exists = false;
    try {
        exists = fs.isFile(path);
    } catch (e) {
        if (e.name !== 'NS_ERROR_FILE_TARGET_DOES_NOT_EXIST' && e.name !== 'NS_ERROR_FILE_NOT_FOUND') {
            // We weren't expecting this exception
            throw e;
        }
    }
    return exists;
};

casper.shotNameGetter = function shotNameGetter(root, fileName) {
    'use strict';

    var name,
        i = shotCount++;

    fileName = fileName || 'screenshot';
    if (casper.cli.get('responsive')) {
        name = root + fs.separator + fileName + '-' + i;
    } else {
        name = root + fs.separator + i + '-' + fileName;
    }

    if (casper.isFile(name + '.png')) {
        return name + '.diff.png';
    } else {
        return name + '.png';
    }
};

// Fill out the new login form and submit it,
// main purpose of this is to get cookies
casper.ovpLogin = function ovpLogin() {
    'use strict';
    var username = casper.cli.get('username'),
        password = casper.cli.get('password');

    casper.log('Logging into site using ' + username + ' creds...', 'debug');
    casper.waitForSelector('.login-submit', function () {
        this.sendKeys('#username', username);
        this.sendKeys('#password', password);
        this.click('.login-submit');
    });

    casper.waitForSelector('.parental-submit', function () {
        this.click('.parental-submit');
    });
};

// Dip into the `document` and attempt to wait for all image
// `src` to finish downloading.
casper.imagesToLoad = function imagesToLoad() {
    'use strict';
    return casper.evaluate(function () {
        var images = document.getElementsByTagName('img');
        return Array.prototype.every.call(images, function (i) {
            return i.complete;
        });
    });
};
