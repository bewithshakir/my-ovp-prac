/*jshint ignore:start */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
/*jshint ignore:end */
define(function () {
    'use strict';

    return {
        paths: {
            $: 'libs/jquery-1.7.2',
            _: 'libs/underscore-1.8.3.min',

            sprintf: 'libs/sprintf',
            'jquery-ui': 'libs/jquery-ui-1.8.16.custom.min',
            angular: 'libs/angular/1.5.8/angular',
            analytics: 'libs/analytics.min',
            splunk: 'libs/splunk.dist',
            moment: 'libs/moment/moment.min',
            'angular-moment': 'libs/moment/angular-moment.min',
            'sha1': 'libs/sha1',

            // BEGIN VPNS dependencies
            'vpns': 'libs/vpns-client/client',
            'ppp': 'libs/vpns-client/ppp',
            'selectn': 'libs/selectn/index',
            'hnav-timers': 'libs/vpns-client/hnav-timers/index',
            'inactivityTimer': 'libs/vpns-client/hnav-timers/lib/inactivityTimer',
            'lazyTimer': 'libs/vpns-client/hnav-timers/lib/lazyTimer',
            'retryTimer': 'libs/vpns-client/hnav-timers/lib/retryTimer',
            'noop': 'libs/vpns-client/noop/index',
            'registrationService': 'libs/vpns-client/registrationService',
            'javascript-state-machine': 'libs/vpns-client/state-machine.min',

            'DataDelegate': 'libs/delegate/dataDelegate',
            'object/is': 'libs/object/is',
            'object/options': 'libs/object/options',

            'rx': 'libs/rx/rx.all',
            'rx-angular': 'libs/rx/rx.angular.min',
            'rx.virtualtime': 'test/util/rx.virtualtime',
            'rx.testing': 'test/util/rx.testing',
            'stickyStates': 'libs/angular-libs/stickyStates',
            'ui-bootstrap': 'libs/angular-libs/ui-bootstrap-2.5.0.min',
            'angular-ui-router': 'libs/angular-libs/angular-ui-router'
        },
        shim: {
            $: {
                exports: '$'
            },
            _: {
                exports: '_'
            },
            sha1: {
                exports: 'jsSHA'
            },
            'jquery-ui': {
                deps: ['$']
            },
            placeholder: {
                deps: ['$']
            },
            angular: {
                deps: ['$'],
                exports: 'angular'
            },
            'rx-angular': {
                deps: ['angular']
            },
            DataDelegate: {
                exports: 'DataDelegate'
            },
            'angular-ui-router': {
                deps: ['angular']
            },
            'stickyStates': {
                deps: ['angular-ui-router']
            }
        }
    };
});
