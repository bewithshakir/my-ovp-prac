(() => {
    'use strict';

    angular.module('ovpApp.components.header', [
        'ovpApp.components.header.toggler',
        'ovpApp.components.header.data',
        'ovpApp.components.header.menuItem',
        'ovpApp.components.ooh',
        'ovpApp.components.settingsMenu',
        'ovpApp.remotePlayer.setTopConnection',
        'ovpApp.messages',
        'ovpApp.legacy.httpUtil',
        'ovpApp.search.input',
        'ovpApp.services.homePage',
        'ovpApp.services.stbService',
        'ovpApp.components.mainMenu',
        'ui.bootstrap',
        'ui.router',
        'ovpApp.oauth',
        'ovpApp.directives.focus',
        'ngCookies',
        'ovpApp.config',
        'ovpApp.components.offCanvasMenu',
        'ovpApp.components.modal',
        'ovpApp.customerInfo.service',
        'ovpApp.components.specu.support',
        'ovpApp.components.specu.signout'
    ])
    .directive('positionUnderHeader', positionUnderHeader)
    .component('siteHeader', {
        templateUrl: '/js/ovpApp/components/header/site-header.html',
        controller: class SiteHeader {
            /* @ngInject */
            constructor(httpUtil, OauthService, $state, config, modal, customerInfoService, $window,
                profileService, OvpSrcService, $http, $rootScope) {
                angular.extend(this, {httpUtil, OauthService, $state, config, modal, customerInfoService,
                    $window, profileService, OvpSrcService, $http, $rootScope});
            }

            $onInit() {
                this.OauthService.waitUntilAuthenticated()
                    .then(() => {
                        this.loggedIn = true;
                    });
            }

            isSpecU() {
                return (this.$state.current.name.indexOf('ovp.specu') === 0) ||
                    this.profileService.isSpecU();
            }

            isBulkMDU () {
                return this.profileService.isBulkMDU();
            }

            isMenuVisible() {
                return !this.isSpecU() && !this.isBulkMDU() && this.config.offCanvasMenu.enabled;
            }

            signOut() {
                if (this.isSpecU() && this.$state.current.name !== 'ovp.specuwelcome' &&
                    this.$state.current.name !== 'ovp.specuerror') {
                    this.modal.open({
                        showCloseIcon: false,
                        windowClass: 'specu-page',
                        component: 'specuSignout',
                        ariaLabelledBy: 'labelText',
                        ariaDescribedBy: 'descriptionBlockText'
                    });
                } else {
                    this.httpUtil.logout();
                }
            }

            signOutText() {
                if (this.$state.current.name === 'ovp.specuwelcome' ||
                    this.$state.current.name === 'ovp.specuerror') {
                    // In this context, the link indicates they want to sign in with their
                    //    residential account, so 'sign in' is the desired label
                    return 'Sign In';
                } else {
                    return 'Sign Out';
                }
            }

            getLogoPath() {
                if (this.isSpecU()) {
                    return 'images/logo-specu-horiz.png';
                } else if (this.isBulkMDU()) {
                    return 'images/logo-bulk-mdu-horiz.svg';
                } else {
                    return 'images/logo-horiz.png';
                }
            }

            getLogoAltText() {
                if (this.isSpecU()) {
                    return 'Spectrum U, back to live tv';
                } else if (this.isBulkMDU()) {
                    return 'Spectrum Community Solutions, back to live TV';
                } else {
                    return 'spectrum tv, back to live tv';
                }
            }

            toggleOffCanvasMenu() {
                this.modal.open({
                    showCloseIcon: false,
                    windowClass: 'off-canvas-menu',
                    component: 'offCanvasMenu',
                    resolve: {
                        userName: () => {
                            if (this.loggedIn) {
                                return this.customerInfoService.getName();
                            }
                            return '';
                        },
                        loggedIn: this.loggedIn
                    }
                });
                var body = angular.element(this.$window.document).find('body');
                body.addClass('off-canvas-scrollbar');
            }

            openSupportDialog() {
                let supportInfoUrl = `${this.config.piHost}${this.config.specU.universityInfoUrl}`,
                    options = {withCredentials: true};

                this.modal.open({
                    showCloseIcon: false,
                    windowClass: 'support-info-message',
                    component: 'supportInfoMessage',
                    ariaDescribedBy: 'spec-support-info-description',
                    ariaLabelledBy: 'spec-support-info-title',
                    resolve: {
                        universityInfo: () => {
                            return this.$http.get(supportInfoUrl, options)
                                .then(result => {
                                    let info = result.data.metaData;
                                    return {
                                        name: info.Title,
                                        helpdesk: info.SupportName,
                                        email: info.SupportEmail,
                                        phone: info.SupportPhone
                                    };
                                });
                        }
                    }
                });
            }
        }
    });

    function positionUnderHeader($transitions, $state, $rootScope) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, el) {
                const header = 66;
                const easHeight = 84;
                const menuHeight = 50;
                const gradient = 30;
                let eas, menu, subheader, sum;

                activate();

                /////////

                function activate() {
                    const data = $state.current.data || {};
                    eas = 0;
                    subheader = (!data.hideSubMenu && data.subheader) || 0;
                    menu = data.hideMenu ? 0 : menuHeight;

                    reposition();

                    const dispose = $transitions.onSuccess({},
                        function (transition) {
                            const data = transition.to().data || {};
                            subheader = (!data.hideSubMenu && data.subheader) || 0;
                            menu = data.hideMenu ? 0 : menuHeight;

                            reposition();
                        }
                    );

                    let vpnsListener = $rootScope.$on('VpnsAlert', () => {
                        eas = easHeight;
                        reposition();
                    });
                    let easEndListener = $rootScope.$on('EAS:end', () => {
                        eas = 0;
                        reposition();
                    });

                    scope.$on('$destroy', ()=> {
                        dispose();
                        vpnsListener();
                        easEndListener();
                    });
                }

                function isVideoVisible() {
                    return $state.includes('ovp.livetv') ||
                           $state.current.name.startsWith('ovp.ondemand.play');
                }

                function reposition() {
                    let newSum = header + eas + menu;
                    // Overlap video with gradient below header main menu
                    if (!isVideoVisible()) {
                        newSum = newSum + subheader + gradient;
                    }
                    if (newSum !== sum) {
                        sum = newSum;
                        el.css('padding-top', sum);
                    }
                }
            }
        };
    }
})();
