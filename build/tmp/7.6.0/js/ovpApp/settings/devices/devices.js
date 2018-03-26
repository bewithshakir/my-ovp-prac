'use strict';

(function () {
    'use strict';
    DevicesController.$inject = ["$scope", "$rootScope", "stbService", "alert", "$state", "errorCodesService", "messages"];
    angular.module('ovpApp.settings.devices', ['ovpApp.messages', 'ovpApp.services.stbService', 'ovpApp.components.alert', 'ovpApp.services.errorCodes']).controller('DevicesController', DevicesController);

    /* @ngInject */
    function DevicesController($scope, $rootScope, stbService, alert, $state, errorCodesService, messages) {

        var vm = this;
        vm.isActive = isActive;
        vm.beginEdit = beginEdit;
        vm.saveEdit = saveEdit;
        vm.cancelEdit = cancelEdit;
        vm.connect = connect;
        vm.stbs = [];
        vm.$state = $state;
        vm.inputChanged = inputChanged;

        activate();

        /////////////////////

        function activate() {
            stbService.getSTBs().then(function (data) {
                stbService.getCurrentStb().then(function (stb) {
                    vm.stbs = data;
                    vm.currentStb = stb;
                    $rootScope.$broadcast('pageChangeComplete', $state.current);
                });
            })['catch'](function () {
                vm.stbs = [];
                vm.currentStb = undefined;
            });

            var unregister = $rootScope.$on('set-top-box-selected', function ($event, stb) {
                // If the stb comes from JSON string it may not match.
                // angular.equals is used to determine if we in fact
                // have a new object.
                if (!angular.equals(vm.setTopBox, stb)) {
                    vm.currentStb = stb;
                }
            });

            $scope.$on('$destroy', unregister);
        }

        function isActive(stb) {
            return vm.currentStb && vm.currentStb.macAddress == stb.macAddress;
        }

        function beginEdit(stb) {
            if (!stb.dvr) {
                showDoesNotSupportRenameMessage();
            } else {
                stb.oldName = stb.name;
                stb.isEditing = true;
            }
        }

        function inputChanged(stb) {
            // filter out special characters
            stb.name = stb.name.replace(/\W/g, '');
        }

        function showDoesNotSupportRenameMessage() {
            alert.open({
                message: errorCodesService.getMessageForCode('WCM-1010'),
                buttonText: 'OK'
            });
        }

        function showNameYourSetTopMessage() {
            alert.open({
                message: messages.getMessageForCode('MSG-9099'),
                buttonText: 'OK'
            });
        }

        function saveEdit(stb) {
            if (!stb.name || stb.name.length === 0) {
                showNameYourSetTopMessage();
            } else {
                if (stb.name != stb.oldName) {
                    stbService.postStbName(stb, stb.name);

                    // TODO: Analytics Event
                    // $rootScope.$emit('EG:stbRenamed', {
                    //     newName: stb.name,
                    //     oldName: stb.oldName,
                    //     deviceId: stb.macAddress,
                    //     isDvr: stb.isDvr
                    // });
                }
                stb.isEditing = false;
                stb.oldName = undefined;
            }
        }

        function cancelEdit(stb) {
            stb.name = stb.oldName;
            stb.isEditing = false;
            stb.oldName = undefined;
        }

        function connect(stb) {
            stbService.setCurrentStb(stb);
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/devices/devices.js.map
