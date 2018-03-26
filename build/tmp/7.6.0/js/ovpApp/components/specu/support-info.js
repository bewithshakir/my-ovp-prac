'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.components.specu.support', ['ovpApp.directives.focus']).component('supportInfoMessage', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/specu/support-info.html',
        controller: (function () {
            /* @ngInject */

            SupportInfoController.$inject = ["version", "$rootScope"];
            function SupportInfoController(version, $rootScope) {
                _classCallCheck(this, SupportInfoController);

                angular.extend(this, { version: version, $rootScope: $rootScope });
            }

            _createClass(SupportInfoController, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.resolve) {
                        this.universityInfo = this.resolve.universityInfo;
                        // email subject
                        if (this.universityInfo.email.indexOf('subject=') === -1) {
                            var joinWith = this.universityInfo.email.split('?').length > 1 ? '&' : '?';
                            this.universityInfo.email = this.universityInfo.email + joinWith + 'subject=SpectrumU%20Support';
                            this.universityInfo.emailSubject = 'SpectrumU Support';
                        } else {
                            this.universityInfo.emailSubject = this.universityInfo.email.split('?')[1].split('&').find(function (v) {
                                return v.indexOf('subject=') === 0;
                            }).split('=')[1];
                        }
                    }

                    // Analytics
                    this.$rootScope.$emit('Analytics:modal-view', {
                        modalName: 'settingsSupport',
                        modalType: 'options'
                    });
                }
            }, {
                key: 'clickEmail',
                value: function clickEmail(evt) {

                    // Analytics
                    this.$rootScope.$emit('Analytics:select', {
                        elementStandardizedName: 'supportEmailAddress',
                        triggeredUsing: evt.type === 'click' ? 'mouse' : 'keyboard'
                    });
                }
            }, {
                key: 'clickPhone',
                value: function clickPhone(evt) {

                    // Analytics
                    this.$rootScope.$emit('Analytics:select', {
                        elementStandardizedName: 'supportPhoneNumber',
                        triggeredUsing: evt.type === 'click' ? 'mouse' : 'keyboard'
                    });
                }
            }, {
                key: 'closeIcon',
                value: function closeIcon() {
                    return this.version.appVersion + '/images/close-x' + (this.activeCloseIcon ? '-active' : '') + '.svg';
                }
            }]);

            return SupportInfoController;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/specu/support-info.js.map
