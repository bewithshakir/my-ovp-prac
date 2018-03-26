# Automated Testing of OVP #

## Webdriver.io Testing
### Webdriver.io Docs
[http://webdriver.io/guide.html](http://webdriver.io/guide.html)

### Running
- `export WEBDRIVERIO_APP_BASEURL=` and set to whatever location you are running the app on currently.
- `export SELENIUM_HUB_HOST=` and set to whatever location you are running the selenium hub on
    - You can start your own selenium hub, or
        - `docker-compose -f docker-compose-webdriverio-local.yml up`
        - `export SELENIUM_HUB_HOST=localhost`
`node_modules/.bin/wdio ./wdio.conf.js`

### Adding
To add new tests, create any pattern of sub-directories inside `/test/webdriver/`.

## End-to-End Testing

To work with protractor E2E, please install protractor and update webdriver by running the following commands:

```
npm install -g protractor
webdriver-manager update
```

To run the tests, run the following commands, in separate terminal windows:

`gulp run-ovp --backend-less`
`webdriver-manager start`
`npm test`

Alternatively, run the simple file server to test components outside of the
normal place. This mocks controllers & data to create a test harness that users
only mock data.

`node test/protractor/support/testServer.js`
`webdriver-manager start`
`npm test`

## Karma Unit Tests

## Visual Design Regression Testing

This is commonly thought of as "CSS Regression Testing" or "CSS Unit Testing"; however, many things other than CSS can break a website's visual design. So, it's more productive to focus on catching visual or functional regressions, rather than focusing on "unit testing" the CSS or checking if the CSS is "correct".

The dependencies are [PhantomJS](http://phantomjs.org/), [CasperJS](http://casperjs.org/) and [PhantomCSS](https://github.com/Huddle/PhantomCSS). It is also recommended to install [SlimerJS](http://slimerjs.org/), but optional.

```bash
# Install packages
$ cd path/to/ovp2
$ npm install
```

Although the packages are installable via `npm install`, they are not actual Node Modules themselves. Most of the tools recommend installing them globally, so if you experience problems with getting things to work, all the packages have alternative methods of installation detailed in their respective documentation.

_**TODO: Notes for Windows users?**_

### Running the tests

PhantomCSS takes screenshots captured by CasperJS and compares them to baseline images using [Resemble.js](http://huddle.github.io/Resemble.js/) to test for rgb pixel differences. PhantomCSS then generates image diffs to help you find the cause.

A simple workflow involves...

1. Generate a baseline set of images, usually from `develop` branch or `ci`.
2. Make some CSS changes.
3. Take new screenshots and compare them.

```bash
# Set up a local server to run OVP
$ gulp run-ovp

# Checkout the baseline branch
$ git checkout develop

# Generate baseline screenshots
$ gulp test-css

# Create a new feature branch
$ git checkout -b my-feature
# Make some CSS changes and compile the CSS
$ touch _buttons.scss
$ gulp css

# Generate exact same screenshots, but this time with your CSS changes applied
$ gulp test-css
```

At this point there should be several screenshots in the `test/css/shots/` directory.

```
shots/
├── failures/
|   └── style-guide/
|       ├── screenshot_1.fail.png
|       └── screenshot_3.fail.png
└── screenshots/
    └── style-guide/
        ├── screenshot_0.diff.png
        ├── screenshot_0.png
        ├── screenshot_1.diff.png
        ├── screenshot_1.fail.png
        ├── screenshot_1.png
        ├── screenshot_2.diff.png
        ├── screenshot_2.png
        ├── screenshot_3.diff.png
        ├── screenshot_3.fail.png
        └── screenshot_3.png
```

In the `screenshots/` directory, you can see the baseline images, images with your changes (`*.diff.png`), and the failures. There is also a specific `failures/` directory to make reviewing the failures easier. Pixel differences between the baseline and diff are marked in pink in the failure image.

![Baseline, failure and diff examples side-by-side.](https://github.webapps.rr.com/ovp/ovp2/blob/develop/assets/readme-imagediff.png)

The smallest CSS change will almost certainly generate a "failure". However, this is expected and even desired. The goal isn't to eliminate failures, but to make sure there are no *_unexpected_* failures. If you do find problems in the diffs, fix the issues and generate new diffs with `gulp test-css`. Once you've looked through the diffs and are satisfied you haven't broken anything, you can open a Pull Request with your CSS changes.

#### Other CLI options

You can pass several arguments to the `gulp test-css` task to adjust how the tests are run, see `gulp help` for full details.

```bash
# Generate screenshots at different responsive viewport sizes, e.g. mobile/tablet/desktop
$ gulp test-css --responsive

# Generate a new set of baseline images
# Note: This will delete *all* previous screenshots
$ gulp test-css --rebase

# Run all the test scenarios in the `test/css/tests/smoke/` directory
$ gulp test-css --file=smoke
# Run only the DVR tests
$ gulp test-css --file=smoke/dvr.js

# Take screenshots from a specific URL
$ gulp test-css --url='http://ovp-stable.dev-webapps.timewarnercable.com'
# or using a nickname for the URL
$ gulp test-css --url=stable
```

### Caveats

- This is _not_ meant to replace functional tests, if we need functional test scenarios before, we still need them now.
- These tests are meant to catch _differences_ from one build to the next. They are _not_ meant to test the "correctness" of the headless browser's rendering engines. A particular component not rendering _correctly_ in PhantomJS is of less concern then the component rendering differently from one branch to the next.
- PhantomJS and SlimerJS typically do not render webpages the exact same as their "real world" counterparts. The screenshots do not indicate what the site would actually look like in Webkit or FireFox, or any other consumer browser for that matter.
- These tests are a tool to increase a developer's confidence that they haven't broken anything drastically. However, the developer must complete his/her due diligence in testing the UI across _all_ the browsers TWCTV supports.
