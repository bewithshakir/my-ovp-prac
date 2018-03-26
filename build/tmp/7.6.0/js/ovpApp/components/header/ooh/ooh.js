'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.components.ooh', ['ovpApp.messages', 'ovpApp.filters.toTrusted', 'ovpApp.services.ovpStorage', 'ovpApp.components.alert', 'ovpApp.services.locationService', 'ovpApp.services.errorCodes', 'ovpApp.services.profileService']).component('ooh', {
        templateUrl: '/js/ovpApp/components/header/ooh/ooh.html',
        controller: (function () {
            /* @ngInject */

            OohController.$inject = ["$timeout", "messages", "$scope", "ovpStorage", "storageKeys", "alert", "locationService", "OauthService", "profileService", "errorCodesService"];
            function OohController($timeout, messages, $scope, ovpStorage, storageKeys, alert, locationService, OauthService, profileService, errorCodesService) {
                _classCallCheck(this, OohController);

                angular.extend(this, { $timeout: $timeout, messages: messages, $scope: $scope, ovpStorage: ovpStorage, storageKeys: storageKeys, alert: alert,
                    locationService: locationService, OauthService: OauthService, profileService: profileService, errorCodesService: errorCodesService });
            }

            _createClass(OohController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.tooltip = this.errorCodesService.getMessageForCode('WLC-1005');
                    this.status = {
                        isopen: false
                    };
                    this.$scope.$on('LocationService:locationChanged', function () {
                        return _this.getLocation();
                    });
                }
            }, {
                key: '$postLink',
                value: function $postLink() {
                    this.getLocation();
                }
            }, {
                key: 'toggleDropdown',
                value: function toggleDropdown($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.status.isopen = !this.status.isopen;
                }
            }, {
                key: 'showOutOfUSMessage',
                value: function showOutOfUSMessage() {
                    this.alert.open(this.errorCodesService.getAlertForCode('WLC-1002'));
                }
            }, {
                key: 'showOutOfHomeMessage',
                value: function showOutOfHomeMessage() {
                    this.alert.open(this.errorCodesService.getAlertForCode('WLC-1006'));
                }
            }, {
                key: 'showInHomeMessage',
                value: function showInHomeMessage() {
                    this.alert.open(this.errorCodesService.getAlertForCode('MSG-9100'));
                }
            }, {
                key: 'getLocation',
                value: function getLocation() {
                    var _this2 = this;

                    if (this.profileService.isSpecUOrBulkMDU()) {
                        // Ignore OOH messages for specU / bulk MDU
                        return;
                    }
                    this.OauthService.waitUntilAuthenticated().then(function () {
                        return _this2.locationService.getLocation();
                    }).then(function (location) {
                        return _this2.oohDone(location);
                    });
                }
            }, {
                key: 'oohDone',
                value: function oohDone(location) {
                    var isFirstCheck = typeof this.ovpStorage.getItem(this.storageKeys.behindOwnModem) !== 'boolean',
                        lastBehindOwnModem = this.ovpStorage.getItem(this.storageKeys.behindOwnModem) === true;

                    if (isFirstCheck) {
                        if (!location.inUS) {
                            this.showOutOfUSMessage();
                        } else if (!location.behindOwnModem) {
                            this.showOutOfHomeMessage();
                        }
                    } else if (lastBehindOwnModem !== location.behindOwnModem) {

                        if (!location.behindOwnModem) {
                            this.showOutOfHomeMessage();
                        } else if (location.behindOwnModem) {
                            this.showInHomeMessage();
                        }
                    }

                    this.isOoh = !location.behindOwnModem;
                    this.ovpStorage.setItem(this.storageKeys.behindOwnModem, location.behindOwnModem);
                }
            }]);

            return OohController;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/header/ooh/ooh.js.map
