(function () {
    'use strict';

    angular.module('ovpApp.analytics.analyticsEnums', [])
    .constant('analyticsEnums', {

        // Simple enumeration for SearchType
        SearchType: Object.freeze({
            NONE: null,
            PREDICTIVE: 'predictive',
            KEYWORD: 'keyword'
        }),

        // Simple enumeration for ViewRenderedStatus
        ViewRenderedStatus: Object.freeze({
            PARTIAL: 'partial',
            COMPLETE: 'complete',
            TIMEOUT: 'timeout',
            NO_RENDER: 'noRender'
        })

    });
}());
