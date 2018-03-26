'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';

    ondemandGoBack.$inject = ["$window", "$state", "ovpFullscreen"];
    angular.module('ovpApp.ondemand.goback', ['ovpApp.directives.ovp-fullscreen']).factory('ondemandGoBack', ondemandGoBack);

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
                    $state.go.apply($state, _toConsumableArray(asset.clickRoute));
                } else {
                    $state.go('ovp.ondemand');
                }
            }
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/ondemand/ondemand-goback.js.map
