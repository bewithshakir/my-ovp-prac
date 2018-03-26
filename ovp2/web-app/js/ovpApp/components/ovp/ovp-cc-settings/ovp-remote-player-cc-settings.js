(() => {
    'use strict';
    angular.module('ovpApp.components.ovp.remotePlayerCCSettings', ['ovpApp.version',
            'ovpApp.services.ovpStorage',
            'ui.bootstrap',
            'ovpApp.directives.dropdownList',
            'ovpApp.directives.focus',
            'ovpApp.directives.arrowNav',
            'ovpApp.services.stbService',
            'ovpApp.services.stbSettingsService'
        ])
        .component('ovpRemotePlayerCaptionSettings', {
            bindings: {
                modalInstance: '<',
                resolve: '<'
            },
            templateUrl: '/js/ovpApp/components/ovp/ovp-cc-settings/ovp-remote-player-cc-settings.html',
            controller: class CCSettingsController {
                /* @ngInject */
                constructor(version, $rootScope, ovpStorage, storageKeys, stbService, StbSettingsService) {
                    angular.extend(this, {
                        version,
                        $rootScope,
                        ovpStorage,
                        storageKeys,
                        stbService,
                        StbSettingsService
                    });
                }

                $onInit() {
                    this.ccSettings = this.ccSettings || {};
                    this.isVisible = false;
                    this.appVersion = this.version.appVersion;
                    this.focus = {}; // Focus option used in template

                    this.initSetterMethods();
                }

                $onChanges() {
                    if (this.resolve.stb && this.resolve.allowedCCOptions && this.resolve.ccSettings) {
                        this.stb = this.resolve.stb;
                        let cc =  this.resolve.allowedCCOptions,
                            indexFn = (value, index) => {
                                return {
                                    'text': value,
                                    'index': index
                                };
                            },
                            getDefaultOpt = (setting) => {
                                let index = setting.defaultValue ?
                                    setting.allowedValues.indexOf(setting.defaultValue) : 0;
                                return (index >= 0) ? index : 0;
                            };
                        this.textOpacityOptions = cc.textStyle.allowedValues.map(indexFn);
                        this.fontOptions = cc.textFont.allowedValues.map(indexFn);
                        this.fontSizeOptions = cc.textSize.allowedValues.map(indexFn);
                        this.backgroundOpacityOptions = cc.backgroundStyle.allowedValues.map(indexFn);
                        this.digitalSourceOptions = cc.digitalSource.allowedValues.map(indexFn);
                        this.formatSourceOptions = cc.formatSource.allowedValues.map(indexFn);
                        this.textColorOptions = cc.textColor.allowedValues.map(indexFn);
                        this.backgroundColorOptions = cc.backgroundColor.allowedValues.map(indexFn);

                        this.ccDefaultSettings = {
                            backgroundColor: getDefaultOpt(cc.backgroundColor),
                            backgroundOpacity: getDefaultOpt(cc.backgroundStyle),
                            font: getDefaultOpt(cc.textFont),
                            fontSize: getDefaultOpt(cc.textSize),
                            textColor: getDefaultOpt(cc.textColor),
                            textOpacity: getDefaultOpt(cc.textStyle),
                            digitalSource: getDefaultOpt(cc.digitalSource),
                            formatSource: getDefaultOpt(cc.formatSource)
                        };

                        let settings = this.resolve.ccSettings,
                            getIndex = (settingStr) => {
                                let index = cc[settingStr].allowedValues.indexOf(settings[settingStr]);
                                return (index >= 0) ? index : getDefaultOpt(cc[settingStr]);
                            };
                        this.ccSettings = {
                            backgroundColor: getIndex('backgroundColor'),
                            backgroundOpacity: getIndex('backgroundStyle'),
                            font: getIndex('textFont'),
                            fontSize: getIndex('textSize'),
                            textColor: getIndex('textColor'),
                            textOpacity: getIndex('textStyle'),
                            digitalSource: getIndex('digitalSource'),
                            formatSource: getIndex('formatSource')
                        };
                    }
                }

                hide() {
                    this.modalInstance.dismiss();
                }

                // ***** Setter methods ******
                // anonymous function assigned to variable so that we can pass it to child elements
                // and reference to `this` inside function will point to CCSettingsController
                initSetterMethods() {
                    this.setTextOpacity = (option) => {
                        this.setCCSettings({
                            textOpacity: option.index
                        });
                    };
                    this.setFont = (option) => {
                        this.setCCSettings({
                            font: option.index
                        });
                    };
                    this.setFontSize = (option) => {
                        this.setCCSettings({
                            fontSize: option.index
                        });
                    };
                    this.setBackgroundOpacity = (option) => {
                        this.setCCSettings({
                            backgroundOpacity: option.index
                        });
                    };

                    // Color settings
                    this.setTextColor = (color) => {
                        this.setCCSettings({
                            textColor: color.index
                        });
                    };
                    this.setBackgroundColor = (color) => {
                        this.setCCSettings({
                            backgroundColor: color.index
                        });
                    };

                    // Selection settings
                    this.setDigitalSource = (src) => {
                        this.setCCSettings({
                            digitalSource: src.index
                        });
                    };
                    this.setFormatSource = (src) => {
                        this.setCCSettings({
                            formatSource: src.index
                        });
                    };
                }

                // Restore default cc settings value
                restoreDefault() {
                    this.resetCCSetting();
                }

                resetCCSetting() {
                    this.ccSettings = this.ccDefaultSettings;
                    this.setCCSettings(this.ccSettings);
                }

                setCCSettings(setting) {
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
            }
        });
})();
