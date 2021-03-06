'use strict';

(function () {
    'use strict';

    LiveController.$inject = ["location", "$state", "$stateParams", "ovpStorage", "storageKeys", "playerService", "$rootScope"];
    angular.module('ovpApp.live', ['ovpApp.live.router', 'ovpApp.services.ovpStorage', 'ovpApp.player']).controller('LiveController', LiveController);

    /* @ngInject */
    function LiveController(location, $state, $stateParams, ovpStorage, storageKeys, playerService, $rootScope) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.options = {
                mode: 'LIVE',
                liveTmsId: $stateParams.tmsid,
                eanUrl: $stateParams.eanUrl || $stateParams.testEanUrl
            };

            playerService.playStream(vm.options);
            $rootScope.$broadcast('pageChangeComplete', $state.current);

            // Do not store EAN params
            if ($stateParams.eanUrl || $stateParams.testEanUrl) {
                ovpStorage.setItem(storageKeys.state, { state: $state.current.name, params: {} });
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/liveTv/liveTv.js.map
