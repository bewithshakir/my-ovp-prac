(function () {
    'use strict';

    angular
        .module('ovpApp.components.modal', [
            'ovpApp.directives.ovp-fullscreen',
            'ui.bootstrap'
        ])
        .factory('modal', modal);

    /* @ngInject */
    function modal($uibModal, $transitions, $document, ovpFullscreen, $rootScope) {
        let modals = [];

        const service = {
            open
        };

        activate();

        return service;

        ////////////////

        function activate() {
            $transitions.onSuccess({}, function () {
                modals.forEach(modal => modal.dismiss('navigated away'));
                modals = [];
            });
        }

        function open(options = {}) {
            $rootScope.$emit('Analytics:modal-start');
            if (!options.windowTemplateUrl) {
                if (options.showCloseIcon !== false) {
                    options.windowTemplateUrl = '/js/ovpApp/components/modal/window-frame-with-close-icon.html';
                } else {
                    options.windowTemplateUrl = '/js/ovpApp/components/modal/window-frame.html';
                }
            }

            let modalEl;
            if (ovpFullscreen.isEnabled()) {
                //Need to append dialog in playback context to the
                //player wrapper so that they also show up in full screen
                modalEl = $document.find('#playerWrapper').eq(0);
            } else {
                modalEl = $document.find('#modal').eq(0);
            }
            options.appendTo = modalEl.length > 0 && modalEl;

            const modal = $uibModal.open(options);

            modals.push(modal);
            modal.closed.then(() => {
                const index = modals.indexOf(modal);
                if (index > -1) {
                    modals.splice(index, 1);
                }
            });

            return modal;
        }
    }
})();
