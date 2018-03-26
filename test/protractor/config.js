exports.config = {
    //Using local jar, otherwise use: seleniumAddress: 'http://localhost:4444/wd/hub'
    seleniumServerJar: '../../node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
    //chromeDriver: '../../node_modules/protractor/selenium/chromedriver_2.21'
    framework: 'jasmine'
};
