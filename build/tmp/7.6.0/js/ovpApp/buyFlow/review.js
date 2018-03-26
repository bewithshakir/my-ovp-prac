'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.review', ['ovpApp.components.modalKite']).component('reviewStep', {
        bindings: {
            stepNumber: '<',
            stepNumberClass: '<',
            itemBodyClass: '<',
            title: '<stepTitle',
            cart: '<',
            price: '<',
            collapsed: '<',
            onTitleClick: '&',
            onBack: '&',
            onContinue: '&',
            onCancel: '&',
            onPurchase: '&'
        },

        templateUrl: '/js/ovpApp/buyFlow/review.html',
        controller: (function () {
            /* @ngInject */

            ReviewStep.$inject = ["alert", "modalKite", "version", "$timeout"];
            function ReviewStep(alert, modalKite, version, $timeout) {
                _classCallCheck(this, ReviewStep);

                angular.extend(this, { alert: alert, modalKite: modalKite, version: version, $timeout: $timeout });
                this.checked = false;
            }

            _createClass(ReviewStep, [{
                key: 'check',
                value: function check() {
                    this.checked = !this.checked;
                }
            }, {
                key: 'purchaseClick',
                value: function purchaseClick() {
                    if (this.checked) {
                        this.onPurchase();
                    } else {
                        // info-circle.svg
                        var title = '<img src="' + this.iconPath('info-circle') + '" class="modal-kite-warning"></image>';
                        this.modalKite.open({
                            size: 'md',
                            title: title,
                            body: 'Please agree to the purchase agreement to continue.',
                            primaryButtonText: 'Agree',
                            onPrimaryButton: this.agree.bind(this),
                            secondaryButtonText: 'Decline',
                            onSecondaryButton: this.closeModal.bind(this)
                        });
                    }
                }
            }, {
                key: 'iconPath',
                value: function iconPath(file) {
                    var filename = file + '.svg';
                    return this.version.appVersion + '/images/' + filename;
                }
            }, {
                key: 'agree',
                value: function agree() {
                    this.check();
                    this.closeModal();
                }
            }, {
                key: 'closeModal',
                value: function closeModal() {
                    this.modalKite.close();
                }
            }, {
                key: 'openTerms',
                value: function openTerms() {
                    this.modalKite.open({
                        size: 'lg',
                        title: 'Purchase Agreement',
                        body: 'Lorum Ipsum',
                        primaryButtonText: 'Close',
                        onPrimaryButton: this.closeModal.bind(this)
                    });
                }
            }]);

            return ReviewStep;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/review.js.map
