/* jshint maxlen: 1000 */
'use strict';

(function () {
    'use strict';

    angular.module('ovpApp.messages.local', []).constant('OVPAPP_MESSAGES_LOCAL', [{
        'name': 'please_enter_pin',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9044',
        'full_customer_message': 'Enter your 4-digit PIN'
    }, {
        'name': 'parental_controls_block_message',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9045',
        'full_customer_message': 'Parental Controls have been activated'
    }, {
        'name': 'unlock_stb_parental_controls',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9046',
        'full_customer_message': 'Please enter your current Spectrum Receiver<br/>blocking PIN'
    }, {
        'name': 'stb_new_blocking_pin',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9047',
        'full_customer_message': 'Please create your new Spectrum Receiver<br/>blocking PIN'
    }, {
        'name': 'new_pin',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9048',
        'full_customer_message': 'The first step is to create a Parental Controls PIN.'
    }, {
        'name': 'pin_not_replace_stb',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9050',
        'full_customer_message': 'This will only work across your Spectrum TV&reg; apps, but does not replace your PIN on your set top box at home.'
    }, {
        'name': 'auth_form_enter_password',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9051',
        'full_customer_message': 'Please enter your master account password to reset your PIN.' //51
    }, {
        'name': 'unlock_purchase_pin',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9053',
        'full_customer_message': 'Please enter your Purchase PIN.'
    }, {
        'name': 'unlock_purchase_pin_to_rent_asset',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9054',
        'full_customer_message': 'Please enter your Purchase PIN to rent this title'
    }, {
        'name': 'new_purchase_pin',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9056',
        'full_customer_message': 'To use this feature you need to create a Purchase PIN.'
    }, {
        'name': 'reset_purchase_pin_instruction',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9057',
        'full_customer_message': 'Please enter new PIN'
    }, {
        'name': 'new_purchase_pin_instruction',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9058',
        'full_customer_message': 'New 4-digit PIN'
    }, {
        'name': 'action_hover_play_trailer',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9061',
        'full_customer_message': 'Watch the Trailer'
    }, {
        'name': 'action_hover_delete',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9062',
        'full_customer_message': 'Permanently delete this recorded show'
    }, {
        'name': 'action_hover_options',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9063',
        'full_customer_message': 'Edit the options of this recorded show' //63
    }, {
        'name': 'action_hover_watch_later',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9064',
        'full_customer_message': 'Add this to Watch Later list'
    }, {
        'name': 'action_hover_remove_watch_later',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9065',
        'full_customer_message': 'Remove this from Watch Later'
    }, {
        'name': 'free_price',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9069',
        'full_customer_message': 'Free'
    }, {
        'name': 'rent_loading',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9070',
        'full_customer_message': 'You are about to watch...'
    }, {
        'name': 'RENT_SINGLE_OPTION_TITLE',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9071',
        'full_customer_message': 'Are you sure you want to rent this?' //71
    }, {
        'name': 'RENT_COMPLEX_OPTION_TITLE',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9072',
        'full_customer_message': 'What would you like to rent?' //72
    }, {
        'name': 'BUTTON_ROLLOVER_WATCH_ON_TV_LIVE',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9073',
        'full_customer_message': 'Watch live on your TV' //73
    }, {
        'name': 'BUTTON_ROLLOVER_WATCH_ON_TV_OD',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9074',
        'full_customer_message': 'Watch On Demand on your TV' //74
    }, {
        'name': 'BUTTON_ROLLOVER_WATCH_ON_TV_BOOKMARK',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9075',
        'full_customer_message': 'Resume on your TV' //75
    }, {
        'name': 'BUTTON_ROLLOVER_WATCH_ON_TV_DVR',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9076',
        'full_customer_message': 'Watch your DVR recording on your TV' //76
    }, {
        'name': 'BUTTON_ROLLOVER_RECORD_SERIES',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9077',
        'full_customer_message': 'Record the series' //77
    }, {
        'name': 'BUTTON_ROLLOVER_RECORD_CANCEL_SERIES',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9078',
        'full_customer_message': 'Cancel recording for the series' //78
    }, {
        'name': 'CDVR_RECORDINGS_EMPTY_MESSAGE',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9079',
        'full_customer_message': 'You don’t have any recordings right now' //79
    }, {
        'name': 'CDVR_SCHEDULED_EMPTY_MESSAGE',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9080',
        'full_customer_message': 'You don’t have any scheduled recordings' //80
    }, {
        'name': 'connectivity.offlineText',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9084',
        'full_customer_message': 'Your computer is offline.' //84
    }, {
        'name': 'connectivity.onlineText',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9085',
        'full_customer_message': 'Your computer is back online.' //85
    }, {
        'name': 'connectivity.retryNowText',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9086',
        'full_customer_message': 'Retry Now' //86
    }, {
        'name': 'connectivity.retryingNowText',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9087',
        'full_customer_message': 'Retrying now...' //87
    }, {
        'name': 'flickToTvPlaying',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9088',
        'full_customer_message': 'Playing {{TITLE}} on {{STB}}' //88
    }, {
        'name': 'recordingUpdated',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9089',
        'full_customer_message': 'Recording was updated successfully' //89
    }, {
        'name': 'recordingCancelled',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9090',
        'full_customer_message': 'Recording cancelled successfully' //90
    }, {
        'name': 'recordingSetSuccessfully',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9091',
        'full_customer_message': 'Recording for {{TITLE}} successfully set' //91
    }, {
        'name': 'recordingConfirm',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9092',
        'full_customer_message': 'Would you like to record {{TITLE}} on {{DATE}} on channel {{CHANNEL}}?' //92
    }, {
        'name': 'cancelAllRecordingsConfirm',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9093',
        'full_customer_message': 'Are you sure you want to cancel all recordings for this series?' //93
    }, {
        'name': 'recordingCancelledWithTitle',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9094',
        'full_customer_message': 'Recording for {{TITLE}} successfully canceled' //94
    }, {
        'name': 'cancelRecordingConfirm',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9095',
        'full_customer_message': 'Would you like to cancel {{TITLE}} on {{DATE}} on channel {{CHANNEL}}?' //95
    }, {
        'name': 'deleteRecordingConfirm',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9096',
        'full_customer_message': 'Would you like to delete {{TITLE}}?' //96
    }, {
        'name': 'deleteRecordingSuccessful',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9097',
        'full_customer_message': '{{TITLE}} successfully deleted' //97
    }, {
        'name': 'dvr.conflicts.selectToResolve',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9098',
        'full_customer_message': 'There is a recording conflict.  Please click the conflict to resolve.'
    }, {
        'name': 'name_your_stb',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9099',
        'full_customer_message': 'Please name your set top box.'
    }, {
        'name': 'ih_message',
        'header': 'Welcome home',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9100',
        'full_customer_message': 'Your complete Spectrum TV&reg; channel line-up is now available.'
    }, {
        'name': 'ivrTelUri',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9101',
        'full_customer_message': 'tel: {{IVR_NUMBER}}'
    }, {
        'name': 'no_favorites_set',
        'header': '',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9102',
        'full_customer_message': 'You currently have no favorite channels set. To add channels to your favorites list, click OK.'
    }, {
        'name': 'lockedOutLoginFailure',
        'header': 'You have been locked out.',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9103',
        'full_customer_message': 'You\'ve exceeded the maximum number of sign-in attempts. Please try again later, or you can retrieve or reset your password.'
    }, {
        'name': 'tvodUnavailable',
        'header': 'Connect to Your Spectrum Internet',
        'status': 'active',
        'altText': null,
        'full_code': 'MSG-9104',
        'full_customer_message': 'Due to programming restrictions, movie rentals are available only when you\'re connected to your Spectrum Internet service.'
    }]);
})();
//# sourceMappingURL=../../maps-babel/ovpApp/config/messages-defaults.js.map
