/* globals window */
require(['/base/build.js'], function (build) {
    'use strict';
    build.baseUrl = '/base';
    require.config(build);
    require([
        'DataDelegate',
        'rx',
        'rx-angular',
        'rx.virtualtime',
        'rx.testing',
        'stickyStates',
        'ui-bootstrap'
    ], function () {
        window.__karma__.start();
    });
});
