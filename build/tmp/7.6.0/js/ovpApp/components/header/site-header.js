'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    positionUnderHeader.$inject = ["$transitions", "$state", "$rootScope"];
    angular.module('ovpApp.components.header', ['ovpApp.components.header.toggler', 'ovpApp.components.header.data', 'ovpApp.components.header.menuItem', 'ovpApp.components.ooh', 'ovpApp.components.settingsMenu', 'ovpApp.remotePlayer.setTopConnection', 'ovpApp.messages', 'ovpApp.legacy.httpUtil', 'ovpApp.search.input', 'ovpApp.services.homePage', 'ovpApp.services.stbService', 'ovpApp.components.mainMenu', 'ui.bootstrap', 'ui.router', 'ovpApp.oauth', 'ovpApp.directives.focus', 'ngCookies', 'ovpApp.config', 'ovpApp.components.offCanvasMenu', 'ovpApp.components.modal', 'ovpApp.customerInfo.service', 'ovpApp.components.specu.support', 'ovpApp.components.specu.signout']).directive('positionUnderHeader', positionUnderHeader).component('siteHeader', {
        templateUrl: '/js/ovpApp/components/header/site-header.html',
        controller: (function () {
            /* @ngInject */

            SiteHeader.$inject = ["httpUtil", "OauthService", "$state", "config", "modal", "customerInfoService", "$window", "profileService", "OvpSrcService", "$http", "$rootScope"];
            function SiteHeader(httpUtil, OauthService, $state, config, modal, customerInfoService, $window, profileService, OvpSrcService, $http, $rootScope) {
                _classCallCheck(this, SiteHeader);

                angular.extend(this, { httpUtil: httpUtil, OauthService: OauthService, $state: $state, config: config, modal: modal, customerInfoService: customerInfoService,
                    $window: $window, profileService: profileService, OvpSrcService: OvpSrcService, $http: $http, $rootScope: $rootScope });
            }

            _createClass(SiteHeader, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.OauthService.waitUntilAuthenticated().then(function () {
                        _this.loggedIn = true;
                    });
                }
            }, {
                key: 'isSpecU',
                value: function isSpecU() {
                    return this.$state.current.name.indexOf('ovp.specu') === 0 || this.profileService.isSpecU();
                }
            }, {
                key: 'isBulkMDU',
                value: function isBulkMDU() {
                    return this.profileService.isBulkMDU();
                }
            }, {
                key: 'isMenuVisible',
                value: function isMenuVisible() {
                    return !this.isSpecU() && !this.isBulkMDU() && this.config.offCanvasMenu.enabled;
                }
            }, {
                key: 'signOut',
                value: function signOut() {
                    if (this.isSpecU() && this.$state.current.name !== 'ovp.specuwelcome' && this.$state.current.name !== 'ovp.specuerror') {
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
            }, {
                key: 'signOutText',
                value: function signOutText() {
                    if (this.$state.current.name === 'ovp.specuwelcome' || this.$state.current.name === 'ovp.specuerror') {
                        // In this context, the link indicates they want to sign in with their
                        //    residential account, so 'sign in' is the desired label
                        return 'Sign In';
                    } else {
                        return 'Sign Out';
                    }
                }
            }, {
                key: 'getLogoPath',
                value: function getLogoPath() {
                    if (this.isSpecU()) {
                        return 'images/logo-specu-horiz.png';
                    } else if (this.isBulkMDU()) {
                        return 'images/logo-bulk-mdu-horiz.svg';
                    } else {
                        return 'images/logo-horiz.png';
                    }
                }
            }, {
                key: 'getLogoAltText',
                value: function getLogoAltText() {
                    if (this.isSpecU()) {
                        return 'Spectrum U, back to live tv';
                    } else if (this.isBulkMDU()) {
                        return 'Spectrum Community Solutions, back to live TV';
                    } else {
                        return 'spectrum tv, back to live tv';
                    }
                }
            }, {
                key: 'toggleOffCanvasMenu',
                value: function toggleOffCanvasMenu() {
                    var _this2 = this;

                    this.modal.open({
                        showCloseIcon: false,
                        windowClass: 'off-canvas-menu',
                        component: 'offCanvasMenu',
                        resolve: {
                            userName: function userName() {
                                if (_this2.loggedIn) {
                                    return _this2.customerInfoService.getName();
                                }
                                return '';
                            },
                            loggedIn: this.loggedIn
                        }
                    });
                    var body = angular.element(this.$window.document).find('body');
                    body.addClass('off-canvas-scrollbar');
                }
            }, {
                key: 'openSupportDialog',
                value: function openSupportDialog() {
                    var _this3 = this;

                    var supportInfoUrl = '' + this.config.piHost + this.config.specU.universityInfoUrl,
                        options = { withCredentials: true };

                    this.modal.open({
                        showCloseIcon: false,
                        windowClass: 'support-info-message',
                        component: 'supportInfoMessage',
                        ariaDescribedBy: 'spec-support-info-description',
                        ariaLabelledBy: 'spec-support-info-title',
                        resolve: {
                            universityInfo: function universityInfo() {
                                return _this3.$http.get(supportInfoUrl, options).then(function (result) {
                                    var info = result.data.metaData;
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
            }]);

            return SiteHeader;
        })()
    });

    function positionUnderHeader($transitions, $state, $rootScope) {
        return {
            restrict: 'A',
            scope: {},
            link: function link(scope, el) {
                var header = 66;
                var easHeight = 84;
                var menuHeight = 50;
                var gradient = 30;
                var eas = undefined,
                    menu = undefined,
                    subheader = undefined,
                    sum = undefined;

                activate();

                /////////

                function activate() {
                    var data = $state.current.data || {};
                    eas = 0;
                    subheader = !data.hideSubMenu && data.subheader || 0;
                    menu = data.hideMenu ? 0 : menuHeight;

                    reposition();

                    var dispose = $transitions.onSuccess({}, function (transition) {
                        var data = transition.to().data || {};
                        subheader = !data.hideSubMenu && data.subheader || 0;
                        menu = data.hideMenu ? 0 : menuHeight;

                        reposition();
                    });

                    var vpnsListener = $rootScope.$on('VpnsAlert', function () {
                        eas = easHeight;
                        reposition();
                    });
                    var easEndListener = $rootScope.$on('EAS:end', function () {
                        eas = 0;
                        reposition();
                    });

                    scope.$on('$destroy', function () {
                        dispose();
                        vpnsListener();
                        easEndListener();
                    });
                }

                function isVideoVisible() {
                    return $state.includes('ovp.livetv') || $state.current.name.startsWith('ovp.ondemand.play');
                }

                function reposition() {
                    var newSum = header + eas + menu;
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
//# sourceMappingURL=../../../maps-babel/ovpApp/components/header/site-header.js.map
