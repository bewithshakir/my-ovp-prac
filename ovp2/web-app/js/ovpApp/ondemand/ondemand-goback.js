(function () {
    'use strict';

    angular
        .module('ovpApp.ondemand.goback', [
            'ovpApp.directives.ovp-fullscreen'
        ])
        .factory('ondemandGoBack', ondemandGoBack);

    /** @ngInject */
    function ondemandGoBack($window, $state, ovpFullscreen) {
        return function (asset, isTrailer) {
            //Make sure we exit full screen before we go back.
            ovpFullscreen.exitFullscreen();

            if ($state.previous && $state.previous.name !== '') {
                if ($state.previous.name === 'ovp.ondemand') {
                    // required to handle goBack firing twice for a Deep linked asset
                    // once in onUnentitled and other from onPlayVodAssetError
                    // for a Deep linked asset which is not avilable OOH.
                    return;
                }
                // User was navigating in the app. Return them to the previous page
                $window.history.back();
            } else {
                // Playback was deep linked into, so there's nothing really to go "back" to
                if (isTrailer && asset && asset.clickRoute) {
                    $state.go(...asset.clickRoute);
                } else {
                    $state.go('ovp.ondemand');
                }
            }
        };
    }
}());
