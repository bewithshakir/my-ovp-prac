'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    modalKite.$inject = ["$uibModal", "$document"];
    angular.module('ovpApp.components.modalKite', ['ui.bootstrap']).factory('modalKite', modalKite).component('modalKiteComponent', {
        bindings: {
            resolve: '<',
            modalInstance: '<'
        },
        templateUrl: '/js/ovpApp/components/modal-kite/modal-kite.html',
        controller: (function () {
            function ModalKite() {
                _classCallCheck(this, ModalKite);
            }

            _createClass(ModalKite, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
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
            }]);

            return ModalKite;
        })()
    });

    /* @ngInject */
    function modalKite($uibModal, $document) {
        var openModal = null;

        return {
            open: open,
            close: close
        };

        ////////////////

        function open() {
            var _this = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            options.animation = true;
            options.ariaLabelledBy = 'modal-title';
            options.ariaDescribedBy = 'modal-body';
            options.component = 'modalKiteComponent';
            options.openedClass = 'modal-kite-open';
            options.resolve = {
                title: function title() {
                    return options.title;
                },
                body: function body() {
                    return options.body;
                },
                primaryButtonText: function primaryButtonText() {
                    return options.primaryButtonText;
                },
                onPrimaryButton: function onPrimaryButton() {
                    return options.onPrimaryButton;
                },
                secondaryButtonText: function secondaryButtonText() {
                    return options.secondaryButtonText;
                },
                onSecondaryButton: function onSecondaryButton() {
                    return options.onSecondaryButton;
                },
                tertiaryButtonText: function tertiaryButtonText() {
                    return options.tertiaryButtonText;
                },
                onTertiaryButton: function onTertiaryButton() {
                    return options.onTertiaryButton;
                },
                onClose: function onClose() {
                    return options.onClose;
                }
            };

            var modalEl = $document.find('#modal').eq(0);
            options.appendTo = modalEl.length > 0 && modalEl;

            openModal = $uibModal.open(options);

            openModal.result.then(function () {
                if (options.onClose) {
                    options.onClose.call(_this);
                }
            });

            return openModal;
        }

        function close() {
            openModal.close();
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/modal-kite/modal-kite.js.map
