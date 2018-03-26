(() => {
    'use strict';
    angular.module('ovpApp.components.mobile.login', [
        'ovpApp.services.profileService',
        'ovpApp.config',
        'ovpApp.src-service'
    ])
    .component('mobileLogin', {
        /* @ngInject */
        templateUrl: '/js/ovpApp/components/mobile-login/mobileLogin.html',
        controller: class MobileLoginController {
            /* @ngInject */
            constructor($rootScope, $window, $state, config, OvpSrcService, profileService) {
                angular.extend(this, {$rootScope, $window, $state, config,
                    OvpSrcService, profileService});
            }

            $onInit() {
                this.iconClass = false;
                this.areYouSure = false;

                if (this.$window.navigator.userAgent.match(/android/i)) {
                    this.store = {
                        imageUrl: 'https://play.google.com/intl/en_us/badges/images/apps/en-play-badge-border.png',
                        alt: 'Get it on Google Play',
                        link: this.profileService.isSpecU() ? this.config.specU.androidAppStoreLink :
                            this.config.androidAppStoreLink,
                        ariaLabel: 'Get it on Google Play'
                    };
                } else if (this.$window.navigator.userAgent.match(/(ipad)|(iphone)|(ipod)/i)) {
                    this.store = {
                        imageUrl: 'https://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg',
                        alt: 'Get it on App Store',
                        link: this.profileService.isSpecU() ? this.config.specU.iosAppStoreLink :
                            this.config.iosAppStoreLink,
                        ariaLabel: 'Download on the App Store'
                    };
                }

                if (this.profileService.isSpecU()) {
                    this.heading = 'Get the Spectrum U App';
                    this.message = 'For the best TV experience on campus, install the Spectrum U App.';
                    this.logo = {
                        url: this.OvpSrcService.versionPath('/images/launcher-icon-stva-university.png'),
                        alt: 'SepcU'
                    };
                    this.buttonText = 'Continue to the desktop version';
                } else {
                    this.logo = {
                        url: this.OvpSrcService.versionPath('/images/spectrum_app_icon.png'),
                        alt: 'Sepctrum App'
                    };
                    this.heading = 'Get the Spectrum TV App';
                    this.message = `For the best TV-watching experience on the go,
                                    install the Spectrum TV App on your device.`;
                    this.buttonText = 'Continue to the desktop version';
                }

                // Page change is complete.
                this.$rootScope.$emit('Analytics:pageChangeComplete');
            }

            next() {
                if (this.areYouSure) {
                    this.goToDesktopVersion();
                } else {
                    this.areYouSure = true;
                    this.logo = false;
                    this.iconClass = 'si si-circle-info-f';
                    this.heading = 'Are You Sure?';
                    this.message = `Some features on this website may not be available
                                    from your mobile device. For the best TV-watching experience
                                    on the go, take advantage of the Spectrum TV App.`;
                }
            }

            goToDesktopVersion() {
                this.$rootScope.$emit('goToDesktopVersionClicked');

                this.$state.go('ovp.livetv');
            }

            downloadApp() {
                this.$rootScope.$broadcast('Analytics:select', {
                    category: 'navigation',
                    elementStandardizedName: 'downloadStvaApp'
                });
                return true;
            }
        }
    });
})();
