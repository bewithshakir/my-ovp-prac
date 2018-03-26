(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.bundleCheckbox', [
        'ovpApp.config',
        'ovpApp.dataDelegate'
    ])
    .component('bundleCheckbox', {
        bindings: {
            bundle: '<',
            checked: '<',
            onChange: '&'
        },
        templateUrl: '/js/ovpApp/buyFlow/bundle-checkbox.html',
        controller: class BundleCheckbox {
            /* @ngInject */
            constructor(config, delegateUtils) {
                angular.extend(this, {config, delegateUtils});
            }

            toggle(event) {
                this.checked = !this.checked;
                this.onChange({checked: this.checked});
                event.preventDefault();
            }

            getChannelImage(channel) {
                if (channel.imageUrl) {
                    return channel.imageUrl;
                } else {
                    return this.delegateUtils.networkImageFromTmsId(channel.tmsId)({width: 84});
                }
            }
        }
    });
})();
