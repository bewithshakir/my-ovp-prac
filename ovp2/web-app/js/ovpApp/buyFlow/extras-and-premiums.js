(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.extrasAndPremiums', [
        'ovpApp.buyFlow.bundleCheckbox',
        'ovpApp.buyFlow.networkCheckbox',
        'ovpApp.buyFlow.collapsedStep'
    ])
    .component('extrasAndPremiums', {
        bindings: {
            stepNumber: '<',
            stepNumberClass: '<',
            itemBodyClass: '<',
            title: '<stepTitle',
            offerings: '<',
            collapsed: '<',
            onTitleClick: '&',
            onUpdatePrice: '&',
            onContinue: '&',
            onBack: '&',
            onCancel: '&'
        },

        templateUrl: '/js/ovpApp/buyFlow/extras-and-premiums.html',
        controller: class ExtrasAndPremiums {
            /* @ngInject */
            constructor() {
                angular.extend(this, {});
            }
            $onChanges(changes) {
                if (changes.offerings) {
                    if (!this.offerings) {
                        this.networks = [];
                        this.bundles = [];
                    } else {
                        //"networks" are offerings with exactly one channel
                        this.networks = this.offerings.filter(
                            offering => offering.channels && offering.channels.length === 1);
                        this.networks.forEach(network => network.checked = false);
                        //"bundles" are offerings which encompass multiple channels
                        this.bundles = this.offerings.filter(
                            bundle => bundle.channels === null || bundle.channels.length > 1);
                        this.bundles.forEach(bundle => {
                            bundle.checked = false;
                            // Create references to the corresponding networks, for quick lookup later
                            bundle.childNetworks = this.networks.filter(
                                network => bundle.channels && bundle.channels.find(
                                    channel => channel.tmsId === network.channels[0].tmsId));
                        });
                    }
                }
            }

            bundleToggled(bundle, checked) {
                bundle.checked = checked;
                bundle.childNetworks.forEach(network => network.checked = checked);

                this.updateInBundleFlags();
                this.onUpdatePrice({price: this.price(), component: this.title});
            }

            networkToggled(network, checked) {
                network.checked = checked;
                this.bundles.forEach(bundle => bundle.checked = bundle.childNetworks.every(network => network.checked));

                this.updateInBundleFlags();
                this.onUpdatePrice({price: this.price(), component: this.title});
            }

            updateInBundleFlags() {
                this.networks.forEach(network => network.inBundle = false);
                this.bundles.filter(bundle => bundle.checked)
                    .forEach(bundle => bundle.childNetworks.forEach(network => network.inBundle = true));
            }

            regularCaption() {
                const bundles = this.bundles.filter(bundle => bundle.checked);
                // Deliberately not checking if the network is in a bundle. If there are both
                //   networks and bundles, we prioritize listing the networks. So bundles will
                //   only be listed for the Extras page, since it has no individual networks
                const networks = this.networks.filter(network => network.checked);

                if (networks.length === 1) {
                    return 'Network:';
                } else if (networks.length > 1) {
                    return 'Networks:';
                } else if (bundles.length === 1) {
                    return 'Package:';
                } else if (bundles.length > 1) {
                    return 'Packages:';
                } else {
                    return '';
                }
            }

            boldCaption() {
                const bundles = this.bundles.filter(bundle => bundle.checked);
                // Deliberately not checking if the network is in a bundle. If there are both
                //   networks and bundles, we prioritize listing the networks. So bundles will
                //   only be listed for the Extras page, since it has no individual networks
                const networks = this.networks.filter(network => network.checked);

                if (networks.length > 0) {
                    return networks.map(n => n.name).join(' | ');
                } else if (bundles.length > 0) {
                    return bundles.map(n => n.name).join(' | ');
                } else {
                    return '';
                }
            }

            price() {
                return this.offerings.reduce((memo, current) => {
                    if (current.checked && !current.inBundle) {
                        return memo + parseFloat(current.price);
                    } else {
                        return memo;
                    }
                }, 0);
            }
        }
    });
})();
