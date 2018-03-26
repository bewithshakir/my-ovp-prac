
(function () {
    'use strict';
    angular.module('ovpApp.settings', [
        'ovpApp.settings.router'
        ])

    .component('settingsMainPage', {
        templateUrl: '/js/ovpApp/settings/settings.html',
        bindings: {
            stb: '<'
        },
        controller: class SettingsController {
            /* @ngInject */
            constructor($state, $timeout, settingsStateService, config,
                $document, stbService) {

                angular.extend(this, {$state, $timeout, settingsStateService,
                    config, $document, stbService});
            }

            $onInit() {
                this.menuItems = [];
                this.stbCategory = this.config.stbSettings;

                this.menuItemsPromise = this.settingsStateService.getStates().then(states => {
                    this.menuItems = states;
                    this.$doCheck();
                });

                this.stbObserver = this.stbService.currentStbSource
                    .do(stb => this.stb = stb) // Save a reference to the set top box every time, including the first
                    .skip(1) // Skip the first to keep from entering a reload loop
                    .subscribe(() => {
                        if (this.$state.current.name.indexOf('ovp.settings.stb') === 0) {
                            this.$state.reload('ovp.settings.stb');
                        }
                    });
            }

            $doCheck() {
                const menuStates = this.menuItems.map(m => m.enabled());
                if (!angular.equals(this.oldMenuStates, menuStates)) {
                    this.handleMenuChange();
                    this.oldMenuStates = menuStates;
                }
            }

            $onDestroy() {
                this.stbObserver.dispose();
            }

            menuItemFocussed(menuItem) {
                this.goTo(menuItem, {location: 'replace'});
            }

            menuItemMouseDownHandler(menuItem, $event) {
                if (this.isLeftMouseButton($event)) {
                    this.goTo(menuItem);
                }
            }

            isLeftMouseButton(event) {
                if ('buttons' in event) {
                    return event.buttons == 1;
                }
                const button = event.which || event.button;
                return button == 1;
            }

            goTo(menuItem, options) {
                const alreadyThere = this.$state.current.name === menuItem.state;
                const goingThere = this.$state.transition && this.$state.transition.to().name === menuItem.state;
                if (!alreadyThere && !goingThere) {
                    this.$state.go(menuItem.state, {}, options);
                }
            }

            handleMenuChange() {
                this.menuCategory = [];
                this.menuItems.forEach((menu) => {
                    if (menu.enabled()) {
                        if (menu.type === this.config.globalSettings &&
                            this.menuCategory.indexOf(this.config.globalSettings) === -1) {
                            this.menuCategory.push(this.config.globalSettings);
                        } else if (menu.type === this.config.websiteSettings &&
                            this.menuCategory.indexOf(this.config.websiteSettings) === -1) {
                            this.menuCategory.push(this.config.websiteSettings);
                        } else if (menu.type === this.config.stbSettings &&
                            this.menuCategory.indexOf(this.config.stbSettings) === -1) {
                            this.menuCategory.push(this.config.stbSettings);
                        }
                    }
                });
            }

            onClick($event) {
                //Firefox doesn't recognize, `event.keyCode` correctly so adding `event.which` check.
                if ($event.keyCode === 32 || $event.which === 32) {
                    $event.preventDefault();
                }
            }

            onKeyDown($event) {
                let keys = {left: 37, up: 38, right: 39, down: 40, tab: 9, enter: 13},
                    activeLiElement = angular.element(this.$document[0].activeElement).parent(),
                    activeLiParentElement = activeLiElement.parent(),
                    parentElementAnchors;

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
                    this.$timeout(function () {
                        // This will work since we assign tabIndex as 0 to the first
                        // focussable form field of tabPanel.
                        // When accessing the setting using a deep-link we need to set focus asynchronously
                        // otherwise focus gets lost. So putting this in a $timeout.
                        this.$document.find('.settings-tabpanel').find('[tabindex = 0]')[0].focus();
                    }.bind(this), 0);
                    $event.preventDefault();
                }
            }

            setAriaControls(category, menu) {
                return 'panel' + (this.menuCategory.indexOf(category) + this.menuItems.indexOf(menu) + 1);
            }

            exit(event) {
                //Handling Esc/Ctrl+up/left/Shift+tab Event
                const keys = {
                    left: 37,
                    up: 38,
                    esc: 27,
                    tab: 9
                };
                if (event.keyCode === keys.esc || (event.ctrlKey &&
                   (event.keyCode === keys.up || event.keyCode === keys.left))) {
                    angular.element('.sidebar-nav-settings li a.active').focus();
                }
            }
        }
    });
}());
