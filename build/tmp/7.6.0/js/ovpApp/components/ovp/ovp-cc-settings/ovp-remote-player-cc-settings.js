'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.ovp.remotePlayerCCSettings', ['ovpApp.version', 'ovpApp.services.ovpStorage', 'ui.bootstrap', 'ovpApp.directives.dropdownList', 'ovpApp.directives.focus', 'ovpApp.directives.arrowNav', 'ovpApp.services.stbService', 'ovpApp.services.stbSettingsService']).component('ovpRemotePlayerCaptionSettings', {
        bindings: {
            modalInstance: '<',
            resolve: '<'
        },
        templateUrl: '/js/ovpApp/components/ovp/ovp-cc-settings/ovp-remote-player-cc-settings.html',
        controller: (function () {
            /* @ngInject */

            CCSettingsController.$inject = ["version", "$rootScope", "ovpStorage", "storageKeys", "stbService", "StbSettingsService"];
            function CCSettingsController(version, $rootScope, ovpStorage, storageKeys, stbService, StbSettingsService) {
                _classCallCheck(this, CCSettingsController);

                angular.extend(this, {
                    version: version,
                    $rootScope: $rootScope,
                    ovpStorage: ovpStorage,
                    storageKeys: storageKeys,
                    stbService: stbService,
                    StbSettingsService: StbSettingsService
                });
            }

            _createClass(CCSettingsController, [{
                key: '$onInit',
                value: function $onInit() {
                    this.ccSettings = this.ccSettings || {};
                    this.isVisible = false;
                    this.appVersion = this.version.appVersion;
                    this.focus = {}; // Focus option used in template

                    this.initSetterMethods();
                }
            }, {
                key: '$onChanges',
                value: function $onChanges() {
                    var _this = this;

                    if (this.resolve.stb && this.resolve.allowedCCOptions && this.resolve.ccSettings) {
                        (function () {
                            _this.stb = _this.resolve.stb;
                            var cc = _this.resolve.allowedCCOptions,
                                indexFn = function indexFn(value, index) {
                                return {
                                    'text': value,
                                    'index': index
                                };
                            },
                                getDefaultOpt = function getDefaultOpt(setting) {
                                var index = setting.defaultValue ? setting.allowedValues.indexOf(setting.defaultValue) : 0;
                                return index >= 0 ? index : 0;
                            };
                            _this.textOpacityOptions = cc.textStyle.allowedValues.map(indexFn);
                            _this.fontOptions = cc.textFont.allowedValues.map(indexFn);
                            _this.fontSizeOptions = cc.textSize.allowedValues.map(indexFn);
                            _this.backgroundOpacityOptions = cc.backgroundStyle.allowedValues.map(indexFn);
                            _this.digitalSourceOptions = cc.digitalSource.allowedValues.map(indexFn);
                            _this.formatSourceOptions = cc.formatSource.allowedValues.map(indexFn);
                            _this.textColorOptions = cc.textColor.allowedValues.map(indexFn);
                            _this.backgroundColorOptions = cc.backgroundColor.allowedValues.map(indexFn);

                            _this.ccDefaultSettings = {
                                backgroundColor: getDefaultOpt(cc.backgroundColor),
                                backgroundOpacity: getDefaultOpt(cc.backgroundStyle),
                                font: getDefaultOpt(cc.textFont),
                                fontSize: getDefaultOpt(cc.textSize),
                                textColor: getDefaultOpt(cc.textColor),
                                textOpacity: getDefaultOpt(cc.textStyle),
                                digitalSource: getDefaultOpt(cc.digitalSource),
                                formatSource: getDefaultOpt(cc.formatSource)
                            };

                            var settings = _this.resolve.ccSettings,
                                getIndex = function getIndex(settingStr) {
                                var index = cc[settingStr].allowedValues.indexOf(settings[settingStr]);
                                return index >= 0 ? index : getDefaultOpt(cc[settingStr]);
                            };
                            _this.ccSettings = {
                                backgroundColor: getIndex('backgroundColor'),
                                backgroundOpacity: getIndex('backgroundStyle'),
                                font: getIndex('textFont'),
                                fontSize: getIndex('textSize'),
                                textColor: getIndex('textColor'),
                                textOpacity: getIndex('textStyle'),
                                digitalSource: getIndex('digitalSource'),
                                formatSource: getIndex('formatSource')
                            };
                        })();
                    }
                }
            }, {
                key: 'hide',
                value: function hide() {
                    this.modalInstance.dismiss();
                }

                // ***** Setter methods ******
                // anonymous function assigned to variable so that we can pass it to child elements
                // and reference to `this` inside function will point to CCSettingsController
            }, {
                key: 'initSetterMethods',
                value: function initSetterMethods() {
                    var _this2 = this;

                    this.setTextOpacity = function (option) {
                        _this2.setCCSettings({
                            textOpacity: option.index
                        });
                    };
                    this.setFont = function (option) {
                        _this2.setCCSettings({
                            font: option.index
                        });
                    };
                    this.setFontSize = function (option) {
                        _this2.setCCSettings({
                            fontSize: option.index
                        });
                    };
                    this.setBackgroundOpacity = function (option) {
                        _this2.setCCSettings({
                            backgroundOpacity: option.index
                        });
                    };

                    // Color settings
                    this.setTextColor = function (color) {
                        _this2.setCCSettings({
                            textColor: color.index
                        });
                    };
                    this.setBackgroundColor = function (color) {
                        _this2.setCCSettings({
                            backgroundColor: color.index
                        });
                    };

                    // Selection settings
                    this.setDigitalSource = function (src) {
                        _this2.setCCSettings({
                            digitalSource: src.index
                        });
                    };
                    this.setFormatSource = function (src) {
                        _this2.setCCSettings({
                            formatSource: src.index
                        });
                    };
                }

                // Restore default cc settings value
            }, {
                key: 'restoreDefault',
                value: function restoreDefault() {
                    this.resetCCSetting();
                }
            }, {
                key: 'resetCCSetting',
                value: function resetCCSetting() {
                    this.ccSettings = this.ccDefaultSettings;
                    this.setCCSettings(this.ccSettings);
                }
            }, {
                key: 'setCCSettings',
                value: function setCCSettings(setting) {
                    angular.merge(this.ccSettings, setting);
                    this.StbSettingsService.updateCCSettings(this.stb, {
                        backgroundColor: this.backgroundColorOptions[this.ccSettings.backgroundColor].text,
                        backgroundStyle: this.backgroundOpacityOptions[this.ccSettings.backgroundOpacity].text,
                        digitalSource: this.digitalSourceOptions[this.ccSettings.digitalSource].text,
                        formatSource: this.formatSourceOptions[this.ccSettings.formatSource].text,
                        textColor: this.textColorOptions[this.ccSettings.textColor].text,
                        textFont: this.fontOptions[this.ccSettings.font].text,
                        textSize: this.fontSizeOptions[this.ccSettings.fontSize].text,
                        textStyle: this.textOpacityOptions[this.ccSettings.textOpacity].text
                    });
                }
            }]);

            return CCSettingsController;
        })()
    });
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-cc-settings/ovp-remote-player-cc-settings.js.map
