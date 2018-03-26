(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.review', [
        'ovpApp.components.modalKite'
    ])
    .component('reviewStep', {
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
        controller: class ReviewStep {
            /* @ngInject */
            constructor(alert, modalKite, version, $timeout) {
                angular.extend(this, {alert, modalKite, version, $timeout});
                this.checked = false;
            }

            check() {
                this.checked = !this.checked;
            }

            purchaseClick() {
                if (this.checked) {
                    this.onPurchase();
                } else {
                    // info-circle.svg
                    const title = '<img src="' + this.iconPath('info-circle') + '" class="modal-kite-warning"></image>';
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

            iconPath(file) {
                let filename = file + '.svg';
                return this.version.appVersion + '/images/' + filename;
            }

            agree() {
                this.check();
                this.closeModal();
            }

            closeModal() {
                this.modalKite.close();
            }

            openTerms() {
                this.modalKite.open({
                    size: 'lg',
                    title: 'Purchase Agreement',
                    body: 'Lorum Ipsum',
                    primaryButtonText: 'Close',
                    onPrimaryButton: this.closeModal.bind(this)
                });
            }

        }
    });
})();
