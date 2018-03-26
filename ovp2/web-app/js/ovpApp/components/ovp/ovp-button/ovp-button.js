(function () {
    'use strict';

    angular.module('ovpApp.components.ovp.button', ['ngAria'])
        .component('ovpButton', {
            bindings: {
                label: '@',
                disabled: '@', // TODO: this should be refactored to be a boolean, not a string
                icon: '@',
                focus: '@',
                wide: '<',
                onClick: '&',
                onClickConfirm: '&?'
            },
            templateUrl: '/js/ovpApp/components/ovp/ovp-button/ovp-button.html',
            controller: class ComponentName {
                /* @ngInject */
                constructor($element, $parse) {
                    angular.extend(this, {$element, $parse});
                }

                $onInit() {
                    this.hasClickConfirm = this.onClickConfirm && this.onClickConfirm();
                }

                $postLink() {
                    this.$element.addClass('ovp-button');
                }

                iconClass() {
                    let classNames = {
                        icon: !!this.icon
                    };
                    const possibilities = ['watch-now', 'record-series', 'record-show', 'locked'];
                    possibilities.forEach(iconName => {
                        if (this.icon == iconName) {
                            classNames[iconName] = true;
                        }
                    });
                    return classNames;
                }
            }
        });
})();
