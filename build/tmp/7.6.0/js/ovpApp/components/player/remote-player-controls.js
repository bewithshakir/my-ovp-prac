'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.remotePlayer.controls', ['ovpApp.components.ovp.remotePlayerCCSettings', 'ovpApp.components.modal']).component('remotePlayerControls', {
        bindings: {
            asset: '<',
            stb: '<'
        },
        templateUrl: '/js/ovpApp/components/player/remote-player-controls.html',
        controller: (function () {
            /* @ngInject */

            RemotePlayerControls.$inject = ["version", "modal", "StbSettingsService"];
            function RemotePlayerControls(version, modal, StbSettingsService) {
                _classCallCheck(this, RemotePlayerControls);

                angular.extend(this, { version: version, modal: modal, StbSettingsService: StbSettingsService });
            }

            _createClass(RemotePlayerControls, [{
                key: '$onChanges',
                value: function $onChanges() {
                    this.getCCSettings();
                }
            }, {
                key: 'getCCSettings',
                value: function getCCSettings() {
                    var _this = this;

                    if (this.stb) {
                        this.StbSettingsService.getSTBProperties(this.stb).then(function (result) {
                            _this.allowedCCOptions = result.closedCaptioning;
                            _this.allowedSAPOptions = result.secondaryAudio;

                            // Set default value for ccEnabled and sapEnabled
                            _this.isCCEnabled = _this.allowedCCOptions.selection.defaultValue === 'Off' ? false : true;
                            _this.isSAPAvailable = _this.allowedSAPOptions.selection ? true : false;
                            _this.isSapEnabled = !_this.isSAPAvailable || _this.allowedSAPOptions.selection.defaultValue === 'Off' ? false : true;

                            _this.StbSettingsService.getPreferences(_this.stb).then(function (preferences) {
                                _this.ccSettings = preferences.closedCaptioning || {};
                                _this.sapSettings = preferences.secondaryAudio || {};

                                _this.isCCEnabled = _this.ccSettings.selection === 'Off' ? false : true;
                                _this.isSapEnabled = !_this.isSAPAvailable || !_this.sapSettings || !_this.sapSettings.selection || _this.sapSettings.selection === 'Off' ? false : true;
                            });
                        });
                    }
                }

                // ********** Toggle Settings **************

            }, {
                key: 'showStbCcSettings',
                value: function showStbCcSettings() {
                    var _this2 = this;

                    this.modal.open({
                        component: 'ovp-remote-player-caption-settings',
                        windowClass: 'ovp-player-caption-settings',
                        showCloseIcon: false,
                        resolve: {
                            'stb': this.stb,
                            'allowedCCOptions': this.allowedCCOptions,
                            'ccSettings': this.ccSettings
                        }
                    }).result.then(function () {
                        return _this2.getCCSettings();
                    });
                }
            }, {
                key: 'ccToggle',
                value: function ccToggle() {
                    var _this3 = this;

                    this.isCCEnabled = !this.isCCEnabled;
                    var ccValue = this.isCCEnabled ? 'On' : 'Off';
                    this.StbSettingsService.updateCCSettings(this.stb, {
                        'selection': ccValue
                    }).then(function (preferences) {
                        _this3.isCCEnabled = preferences.closedCaptioning.selection === 'Off' ? false : true;
                    }, function () {
                        _this3.isCCEnabled = !_this3.isCCEnabled; // Reset on error
                    });
                }
            }, {
                key: 'sapToggle',
                value: function sapToggle() {
                    var _this4 = this;

                    this.isSapEnabled = !this.isSapEnabled;
                    this.StbSettingsService.toggleSAP(this.stb, this.isSapEnabled ? 'On' : 'Off').then(function (preferences) {
                        _this4.isSapEnabled = !preferences.secondaryAudio || preferences.secondaryAudio.selection === 'Off' ? false : true;
                    }, function () {
                        _this4.isSapEnabled = !_this4.isSapEnabled; // Reset on error
                    });
                }

                // ***************** Toggle Images

            }, {
                key: 'ccToggleImage',
                value: function ccToggleImage() {
                    if (this.ccHovered) {
                        return this.version.appVersion + '/images/cc-active.svg';
                    } else {
                        return this.isCCEnabled ? this.version.appVersion + '/images/cc-active.svg' : this.version.appVersion + '/images/cc.svg';
                    }
                }
            }, {
                key: 'sapToggleImage',
                value: function sapToggleImage() {
                    if (this.sapIconHovered) {
                        return this.version.appVersion + '/images/sap-dvs-active.svg';
                    } else {
                        return this.isSapEnabled ? this.version.appVersion + '/images/sap-dvs-active.svg' : this.version.appVersion + '/images/sap-dvs.svg';
                    }
                }
            }, {
                key: 'ccSettingsImage',
                value: function ccSettingsImage() {
                    if (this.ccSettingsHovered) {
                        return this.version.appVersion + '/images/settings-active.svg';
                    } else {
                        return this.version.appVersion + '/images/settings.svg';
                    }
                }
            }]);

            return RemotePlayerControls;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/player/remote-player-controls.js.map
