(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.networkCheckbox', [
        'ovpApp.config',
        'ovpApp.dataDelegate'
    ])
    .component('networkCheckbox', {
        bindings: {
            network: '<',
            checked: '<',
            inBundle: '<',
            onChange: '&'
        },
        templateUrl: '/js/ovpApp/buyFlow/network-checkbox.html',
        controller: class NetworkCheckbox {
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
