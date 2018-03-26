(() => {
    'use strict';
    angular.module('ovpApp.components.ovp.ccSettings', ['ovpApp.version',
            'ovpApp.services.ovpStorage',
            'ui.bootstrap',
            'ovpApp.directives.dropdownList',
            'ovpApp.directives.focus',
            'ovpApp.directives.arrowNav'
        ])
        .component('ovpCaptionSettings', {
            bindings: {
                modalInstance: '<'
            },
            templateUrl: '/js/ovpApp/components/ovp/ovp-cc-settings/ovp-player-cc-settings.html',
            controller: class CCSettingsController {
                /* @ngInject */
                constructor(version, $rootScope, ovpStorage, storageKeys) {
                    angular.extend(this, {
                        version,
                        $rootScope,
                        ovpStorage,
                        storageKeys
                    });
                }

                $onInit() {
                    this.ccSettings = {};
                    this.isVisible = false;
                    this.appVersion = this.version.appVersion;
                    this.focus = {}; // Focus option used in template
                    this.colorOptions = [{
                        color: '#000000',
                        index: 0,
                        name: 'Default'
                    }, {
                        color: '#FFFFFF',
                        index: 1,
                        name: 'White'
                    }, {
                        color: '#000000',
                        index: 2,
                        name: 'Black'
                    }, {
                        color: '#FF0000',
                        index: 3,
                        name: 'Red'
                    }, {
                        color: '#008000',
                        index: 4,
                        name: 'Green'
                    }, {
                        color: '#0000FF',
                        index: 5,
                        name: 'Blue'
                    }, {
                        color: '#FFFF00',
                        index: 6,
                        name: 'Yellow'
                    }, {
                        color: '#FF00FF',
                        index: 7,
                        name: 'Magenta'
                    }, {
                        color: '#00FFFF',
                        index: 8,
                        name: 'Cyan'
                    }];

                    this.textOpacityOptions = [{
                        text: 'Default',
                        index: 0
                    }, {
                        text: 'Opaque',
                        index: 1
                    }, {
                        text: 'Semitransparent',
                        index: 2
                    }];

                    this.fontOptions = [{
                        text: 'Default',
                        index: 0
                    }, {
                        text: 'Monospaced with serifs',
                        index: 1
                    }, {
                        text: 'Monospaced without serifs',
                        index: 2
                    }, {
                        text: 'Proportional with serifs',
                        index: 3
                    }, {
                        text: 'Proportional without serifs',
                        index: 4
                    }, {
                        text: 'Casual',
                        index: 5
                    }, {
                        text: 'Cursive',
                        index: 6
                    }, {
                        text: 'Small capitals',
                        index: 7
                    }];

                    this.fontSizeOptions = [{
                        text: 'Default',
                        index: 0
                    }, {
                        text: 'Small',
                        index: 1
                    }, {
                        text: 'Medium',
                        index: 2
                    }, {
                        text: 'Large',
                        index: 3
                    }];

                    this.fontEdgeOptions = [

                        {
                            text: 'Default',
                            index: 0
                        }, {
                            text: 'None',
                            index: 1
                        }, {
                            text: 'Raised',
                            index: 2
                        }, {
                            text: 'Depressed',
                            index: 3
                        }, {
                            text: 'Uniform',
                            index: 4
                        }, {
                            text: 'Left drop shadow',
                            index: 5
                        }, {
                            text: 'Right drop shadow',
                            index: 6
                        }
                    ];

                    this.backgroundOpacityOptions = [{
                        text: 'Default',
                        index: 0
                    }, {
                        text: 'Opaque',
                        index: 1
                    }, {
                        text: 'Semitransparent',
                        index: 2
                    }, {
                        text: 'Transparent',
                        index: 3
                    }];

                    this.windowOpacityOptions = [{
                        text: 'Default',
                        index: 0
                    }, {
                        text: 'Opaque',
                        index: 1
                    }, {
                        text: 'Semitransparent',
                        index: 2
                    }, {
                        text: 'Transparent',
                        index: 3
                    }];

                    let ccSettings = this.ovpStorage.getItem(this.storageKeys.ccSettings);
                    if (ccSettings) {
                        this.ccSettings = ccSettings;
                    } else {
                        this.resetCCSetting();
                    }
                    this.initSetterMethods();
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
                            textOpacitySelectedIndex: option.index
                        });
                    };
                    this.setFont = (option) => {
                        this.setCCSettings({
                            fontSelectedIndex: option.index
                        });
                    };
                    this.setFontSize = (option) => {
                        this.setCCSettings({
                            fontSizeSelectedIndex: option.index
                        });
                    };
                    this.setFontEdge = (option) => {
                        this.setCCSettings({
                            edgeSelectedIndex: option.index
                        });
                    };
                    this.setBackgroundOpacity = (option) => {
                        this.setCCSettings({
                            backgroundOpacitySelectedIndex: option.index
                        });
                    };
                    this.setWindowOpacity = (option) => {
                        this.setCCSettings({
                            windowOpacitySelectedIndex: option.index
                        });
                    };

                    // Color settings
                    this.setTextColor = (color) => {
                        this.setCCSettings({
                            textColorSelectedIndex: color.index
                        });
                    };
                    this.setBackgroundColor = (color) => {
                        this.setCCSettings({
                            backgroundColorSelectedIndex: color.index
                        });
                    };
                    this.setWindowColor = (color) => {
                        this.setCCSettings({
                            windowColorSelectedIndex: color.index
                        });
                    };
                }

                // Restore default cc settings value
                restoreDefault() {
                    this.resetCCSetting();
                    this.$rootScope.$broadcast('cc-settings-changed', this.ccSettings);
                }

                resetCCSetting() {
                    this.ccSettings = {
                        backgroundColorSelectedIndex: 0,
                        backgroundOpacitySelectedIndex: 0,
                        edgeSelectedIndex: 0,
                        fontSelectedIndex: 0,
                        fontSizeSelectedIndex: 0,
                        textColorSelectedIndex: 0,
                        textOpacitySelectedIndex: 0,
                        windowColorSelectedIndex: 0,
                        windowOpacitySelectedIndex: 0
                    };
                }

                setCCSettings(setting) {
                    angular.merge(this.ccSettings, setting);
                    this.$rootScope.$broadcast('cc-settings-changed', this.ccSettings);
                }
            }
        });
})();
