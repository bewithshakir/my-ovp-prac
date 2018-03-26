/* eslint-disable */
/* jshint -W109 */
/* jshint -W101 */
(function () {
    'use strict';

    angular.module('ovpApp.config.errorCodes.overrides', [])
    .constant('ERROR_CODES_OVERRIDES', {
        'errorCodes': [
            {
                'name': 'flashNotEnabledMessages1225',
                'header': 'Flash Player Required',
                'status': 'active',
                'altText': 'Adobe Flash Player Required. To watch TV, you\'ll need to activate Adobe Flash Player on your browser.',
                'full_error_code': 'TMP-9098',
                'full_customer_message': 'In most cases, Flash Player is pre-installed, so simply follow the prompts to allow or activate Flash. ' +
                    'If Flash Player isn\'t installed, you\'ll be prompted to install it, which should take only a moment.'
            },
            {
                'name': 'flashNotEnabledMessages1225.subTitle',
                'header': '',
                'status': 'active',
                'full_error_code': 'TMP-9099',
                'full_customer_message': 'To watch TV, you\'ll need Adobe Flash Player:'
            },
            {
                'name': 'flashNotEnabledMessages1115',
                'header': 'One Quick Step Before You Can Watch TV',
                'status': 'active',
                'altText': 'To watch TV, you\'ll need to activate Adobe Flash Player on your browser.',
                'full_error_code': 'TMP-9100',
                'full_customer_message': 'In most cases, Flash Player is pre-installed, so simply follow the prompts to allow or activate Flash. ' +
                    'If Flash Player isn\'t installed, you\'ll be prompted to install it, which should take only a moment.'
            },
            {
                'name': 'flashNotEnabledMessages1115.subTitle',
                'header': '',
                'status': 'active',
                'full_error_code': 'TMP-9101',
                'full_customer_message': 'To watch TV, you\'ll need Adobe Flash Player:'
            }
        ]
    });
}());
/*eslint-enable */
