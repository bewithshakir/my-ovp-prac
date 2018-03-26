'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.settings', ['ovpApp.settings.router']).component('settingsMainPage', {
        templateUrl: '/js/ovpApp/settings/settings.html',
        bindings: {
            stb: '<'
        },
        controller: (function () {
            /* @ngInject */

            SettingsController.$inject = ["$state", "$timeout", "settingsStateService", "config", "$document", "stbService"];
            function SettingsController($state, $timeout, settingsStateService, config, $document, stbService) {
                _classCallCheck(this, SettingsController);

                angular.extend(this, { $state: $state, $timeout: $timeout, settingsStateService: settingsStateService,
                    config: config, $document: $document, stbService: stbService });
            }

            _createClass(SettingsController, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.menuItems = [];
                    this.stbCategory = this.config.stbSettings;

                    this.menuItemsPromise = this.settingsStateService.getStates().then(function (states) {
                        _this.menuItems = states;
                        _this.$doCheck();
                    });

                    this.stbObserver = this.stbService.currentStbSource['do'](function (stb) {
                        return _this.stb = stb;
                    }) // Save a reference to the set top box every time, including the first
                    .skip(1) // Skip the first to keep from entering a reload loop
                    .subscribe(function () {
                        if (_this.$state.current.name.indexOf('ovp.settings.stb') === 0) {
                            _this.$state.reload('ovp.settings.stb');
                        }
                    });
                }
            }, {
                key: '$doCheck',
                value: function $doCheck() {
                    var menuStates = this.menuItems.map(function (m) {
                        return m.enabled();
                    });
                    if (!angular.equals(this.oldMenuStates, menuStates)) {
                        this.handleMenuChange();
                        this.oldMenuStates = menuStates;
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.stbObserver.dispose();
                }
            }, {
                key: 'menuItemFocussed',
                value: function menuItemFocussed(menuItem) {
                    this.goTo(menuItem, { location: 'replace' });
                }
            }, {
                key: 'menuItemMouseDownHandler',
                value: function menuItemMouseDownHandler(menuItem, $event) {
                    if (this.isLeftMouseButton($event)) {
                        this.goTo(menuItem);
                    }
                }
            }, {
                key: 'isLeftMouseButton',
                value: function isLeftMouseButton(event) {
                    if ('buttons' in event) {
                        return event.buttons == 1;
                    }
                    var button = event.which || event.button;
                    return button == 1;
                }
            }, {
                key: 'goTo',
                value: function goTo(menuItem, options) {
                    var alreadyThere = this.$state.current.name === menuItem.state;
                    var goingThere = this.$state.transition && this.$state.transition.to().name === menuItem.state;
                    if (!alreadyThere && !goingThere) {
                        this.$state.go(menuItem.state, {}, options);
                    }
                }
            }, {
                key: 'handleMenuChange',
                value: function handleMenuChange() {
                    var _this2 = this;

                    this.menuCategory = [];
                    this.menuItems.forEach(function (menu) {
                        if (menu.enabled()) {
                            if (menu.type === _this2.config.globalSettings && _this2.menuCategory.indexOf(_this2.config.globalSettings) === -1) {
                                _this2.menuCategory.push(_this2.config.globalSettings);
                            } else if (menu.type === _this2.config.websiteSettings && _this2.menuCategory.indexOf(_this2.config.websiteSettings) === -1) {
                                _this2.menuCategory.push(_this2.config.websiteSettings);
                            } else if (menu.type === _this2.config.stbSettings && _this2.menuCategory.indexOf(_this2.config.stbSettings) === -1) {
                                _this2.menuCategory.push(_this2.config.stbSettings);
                            }
                        }
                    });
                }
            }, {
                key: 'onClick',
                value: function onClick($event) {
                    //Firefox doesn't recognize, `event.keyCode` correctly so adding `event.which` check.
                    if ($event.keyCode === 32 || $event.which === 32) {
                        $event.preventDefault();
                    }
                }
            }, {
                key: 'onKeyDown',
                value: function onKeyDown($event) {
                    var keys = { left: 37, up: 38, right: 39, down: 40, tab: 9, enter: 13 },
                        activeLiElement = angular.element(this.$document[0].activeElement).parent(),
                        activeLiParentElement = activeLiElement.parent(),
                        parentElementAnchors = undefined;

                    if ($event.keyCode === keys.down || $event.keyCode === keys.right) {
                        if (!activeLiElement.next().hasClass('list-item')) {
                            parentElementAnchors = activeLiParentElement.next().find('a')[0];
                            if (parentElementAnchors) {
                                parentElementAnchors.focus();
                            }
                        } else {
                            activeLiElement.next().find('a').focus();
                        }
                        $event.preventDefault();
                    } else if ($event.keyCode === keys.up || $event.keyCode === keys.left) {
                        if (!activeLiElement.prev().hasClass('list-item')) {
                            parentElementAnchors = activeLiParentElement.prev().find('a');
                            if (parentElementAnchors && parentElementAnchors.length > 0) {
                                parentElementAnchors[parentElementAnchors.length - 1].focus();
                            }
                        } else {
                            activeLiElement.prev().find('a').focus();
                        }
                        $event.preventDefault();
                    } else if ($event.keyCode === keys.enter) {
                        this.$timeout((function () {
                            // This will work since we assign tabIndex as 0 to the first
                            // focussable form field of tabPanel.
                            // When accessing the setting using a deep-link we need to set focus asynchronously
                            // otherwise focus gets lost. So putting this in a $timeout.
                            this.$document.find('.settings-tabpanel').find('[tabindex = 0]')[0].focus();
                        }).bind(this), 0);
                        $event.preventDefault();
                    }
                }
            }, {
                key: 'setAriaControls',
                value: function setAriaControls(category, menu) {
                    return 'panel' + (this.menuCategory.indexOf(category) + this.menuItems.indexOf(menu) + 1);
                }
            }, {
                key: 'exit',
                value: function exit(event) {
                    //Handling Esc/Ctrl+up/left/Shift+tab Event
                    var keys = {
                        left: 37,
                        up: 38,
                        esc: 27,
                        tab: 9
                    };
                    if (event.keyCode === keys.esc || event.ctrlKey && (event.keyCode === keys.up || event.keyCode === keys.left)) {
                        angular.element('.sidebar-nav-settings li a.active').focus();
                    }
                }
            }]);

            return SettingsController;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/settings/settings.js.map
