(function () {
    'use strict';

    angular
        .module('ovpApp.components.modalKite', [
            'ui.bootstrap'
        ])
        .factory('modalKite', modalKite)
        .component('modalKiteComponent', {
            bindings: {
                resolve: '<',
                modalInstance: '<'
            },
            templateUrl: '/js/ovpApp/components/modal-kite/modal-kite.html',
            controller: class ModalKite {
                $onChanges(changes) {
                    if (changes.resolve) {
                        this.title = this.resolve.title;
                        this.body = this.resolve.body;
                        this.primaryButtonText = this.resolve.primaryButtonText;
                        this.onPrimaryButton = this.resolve.onPrimaryButton;
                        this.secondaryButtonText = this.resolve.secondaryButtonText;
                        this.onSecondaryButton = this.resolve.onSecondaryButton;
                        this.tertiaryButtonText = this.resolve.tertiaryButtonText;
                        this.onTertiaryButton = this.resolve.onTertiaryButton;
                        this.onClose = this.resolve.onClose;
                    }
                }
            }
        });

    /* @ngInject */
    function modalKite($uibModal, $document) {
        let openModal = null;

        return {
            open: open,
            close: close
        };

        ////////////////

        function open(options = {}) {
            options.animation = true;
            options.ariaLabelledBy = 'modal-title';
            options.ariaDescribedBy = 'modal-body';
            options.component = 'modalKiteComponent';
            options.openedClass = 'modal-kite-open';
            options.resolve = {
                title: () => options.title,
                body: () => options.body,
                primaryButtonText: () => options.primaryButtonText,
                onPrimaryButton: () => options.onPrimaryButton,
                secondaryButtonText: () => options.secondaryButtonText,
                onSecondaryButton: () => options.onSecondaryButton,
                tertiaryButtonText: () => options.tertiaryButtonText,
                onTertiaryButton: () => options.onTertiaryButton,
                onClose: () => options.onClose
            };

            const modalEl = $document.find('#modal').eq(0);
            options.appendTo = modalEl.length > 0 && modalEl;

            openModal = $uibModal.open(options);

            openModal.result.then(() => {
                if (options.onClose) {
                    options.onClose.call(this);
                }
            });

            return openModal;
        }

        function close() {
            openModal.close();
        }
    }
})();
