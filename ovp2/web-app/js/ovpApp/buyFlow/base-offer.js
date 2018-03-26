(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.baseOffer', [
        'ovpApp.buyFlow.bundleCheckbox',
        'ovpApp.buyFlow.networkCheckbox',
        'ovpApp.buyFlow.collapsedStep',
        'ovpApp.dataDelegate'
    ])
    .component('baseOffer', {
        bindings: {
            stepNumber: '<',
            title: '<stepTitle',
            offerings: '<',
            collapsed: '<',
            onTitleClick: '&',
            onContinue: '&',
            onCancel: '&'
        },

        templateUrl: '/js/ovpApp/buyFlow/base-offer.html',
        controller: class BaseOffer {
            /* @ngInject */
            constructor(delegateUtils, version) {
                angular.extend(this, {delegateUtils, version});
            }

            $onChanges(changes) {
                if (changes.offerings) {
                    // TODO: current code only supports one base offering. Do we need to support more?
                    this.bundle = this.offerings && this.offerings[0];
                }
            }

            getChannelImage(channel) {
                if (channel.imageUrl) {
                    return channel.imageUrl;
                } else {
                    return this.delegateUtils.networkImageFromTmsId(channel.tmsId)({width: 96});
                }
            }

            price() {
                return parseFloat(this.bundle.price);
            }

            iconPath(file) {
                let filename = file + '.svg';
                return this.version.appVersion + '/images/' + filename;
            }
        }
    });
})();
