(() => {
    'use strict';
    angular.module('ovpApp.components.specu.support', [
        'ovpApp.directives.focus'
    ]).component('supportInfoMessage', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/specu/support-info.html',
        controller: class SupportInfoController {
            /* @ngInject */
            constructor(version, $rootScope) {
                angular.extend(this, {version, $rootScope});
            }

            $onChanges(changes) {
                if (changes.resolve) {
                    this.universityInfo = this.resolve.universityInfo;
                    // email subject
                    if (this.universityInfo.email.indexOf('subject=') === -1) {
                        let joinWith = (this.universityInfo.email.split('?').length > 1) ? '&' : '?';
                        this.universityInfo.email = this.universityInfo.email +
                            joinWith + 'subject=SpectrumU%20Support';
                        this.universityInfo.emailSubject = 'SpectrumU Support';
                    } else {
                        this.universityInfo.emailSubject = this.universityInfo.email.split('?')[1]
                            .split('&').find((v) => v.indexOf('subject=') === 0).split('=')[1];
                    }
                }

                // Analytics
                this.$rootScope.$emit('Analytics:modal-view', {
                    modalName: 'settingsSupport',
                    modalType: 'options'
                });
            }

            clickEmail(evt) {

                // Analytics
                this.$rootScope.$emit('Analytics:select', {
                    elementStandardizedName: 'supportEmailAddress',
                    triggeredUsing: (evt.type === 'click' ? 'mouse' : 'keyboard')
                });
            }

            clickPhone(evt) {

                // Analytics
                this.$rootScope.$emit('Analytics:select', {
                    elementStandardizedName: 'supportPhoneNumber',
                    triggeredUsing: (evt.type === 'click' ? 'mouse' : 'keyboard')
                });
            }

            closeIcon() {
                return this.version.appVersion + '/images/close-x' +
                    (this.activeCloseIcon ? '-active' : '') + '.svg';
            }
        }
    });
})();
