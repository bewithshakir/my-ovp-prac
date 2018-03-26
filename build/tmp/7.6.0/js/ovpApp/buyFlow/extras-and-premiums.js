'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('ovpApp.buyFlow.extrasAndPremiums', ['ovpApp.buyFlow.bundleCheckbox', 'ovpApp.buyFlow.networkCheckbox', 'ovpApp.buyFlow.collapsedStep']).component('extrasAndPremiums', {
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
        controller: (function () {
            /* @ngInject */

            function ExtrasAndPremiums() {
                _classCallCheck(this, ExtrasAndPremiums);

                angular.extend(this, {});
            }

            _createClass(ExtrasAndPremiums, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    var _this = this;

                    if (changes.offerings) {
                        if (!this.offerings) {
                            this.networks = [];
                            this.bundles = [];
                        } else {
                            //"networks" are offerings with exactly one channel
                            this.networks = this.offerings.filter(function (offering) {
                                return offering.channels && offering.channels.length === 1;
                            });
                            this.networks.forEach(function (network) {
                                return network.checked = false;
                            });
                            //"bundles" are offerings which encompass multiple channels
                            this.bundles = this.offerings.filter(function (bundle) {
                                return bundle.channels === null || bundle.channels.length > 1;
                            });
                            this.bundles.forEach(function (bundle) {
                                bundle.checked = false;
                                // Create references to the corresponding networks, for quick lookup later
                                bundle.childNetworks = _this.networks.filter(function (network) {
                                    return bundle.channels && bundle.channels.find(function (channel) {
                                        return channel.tmsId === network.channels[0].tmsId;
                                    });
                                });
                            });
                        }
                    }
                }
            }, {
                key: 'bundleToggled',
                value: function bundleToggled(bundle, checked) {
                    bundle.checked = checked;
                    bundle.childNetworks.forEach(function (network) {
                        return network.checked = checked;
                    });

                    this.updateInBundleFlags();
                    this.onUpdatePrice({ price: this.price(), component: this.title });
                }
            }, {
                key: 'networkToggled',
                value: function networkToggled(network, checked) {
                    network.checked = checked;
                    this.bundles.forEach(function (bundle) {
                        return bundle.checked = bundle.childNetworks.every(function (network) {
                            return network.checked;
                        });
                    });

                    this.updateInBundleFlags();
                    this.onUpdatePrice({ price: this.price(), component: this.title });
                }
            }, {
                key: 'updateInBundleFlags',
                value: function updateInBundleFlags() {
                    this.networks.forEach(function (network) {
                        return network.inBundle = false;
                    });
                    this.bundles.filter(function (bundle) {
                        return bundle.checked;
                    }).forEach(function (bundle) {
                        return bundle.childNetworks.forEach(function (network) {
                            return network.inBundle = true;
                        });
                    });
                }
            }, {
                key: 'regularCaption',
                value: function regularCaption() {
                    var bundles = this.bundles.filter(function (bundle) {
                        return bundle.checked;
                    });
                    // Deliberately not checking if the network is in a bundle. If there are both
                    //   networks and bundles, we prioritize listing the networks. So bundles will
                    //   only be listed for the Extras page, since it has no individual networks
                    var networks = this.networks.filter(function (network) {
                        return network.checked;
                    });

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
            }, {
                key: 'boldCaption',
                value: function boldCaption() {
                    var bundles = this.bundles.filter(function (bundle) {
                        return bundle.checked;
                    });
                    // Deliberately not checking if the network is in a bundle. If there are both
                    //   networks and bundles, we prioritize listing the networks. So bundles will
                    //   only be listed for the Extras page, since it has no individual networks
                    var networks = this.networks.filter(function (network) {
                        return network.checked;
                    });

                    if (networks.length > 0) {
                        return networks.map(function (n) {
                            return n.name;
                        }).join(' | ');
                    } else if (bundles.length > 0) {
                        return bundles.map(function (n) {
                            return n.name;
                        }).join(' | ');
                    } else {
                        return '';
                    }
                }
            }, {
                key: 'price',
                value: function price() {
                    return this.offerings.reduce(function (memo, current) {
                        if (current.checked && !current.inBundle) {
                            return memo + parseFloat(current.price);
                        } else {
                            return memo;
                        }
                    }, 0);
                }
            }]);

            return ExtrasAndPremiums;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/extras-and-premiums.js.map
