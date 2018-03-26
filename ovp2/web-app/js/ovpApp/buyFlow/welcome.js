(function () {
    'use strict';
    angular.module('ovpApp.buyFlow.welcome', [
        'ovpApp.messages',
        'ovpApp.buyFlow.service',
        'ovpApp.dataDelegate',
        'ovpApp.directives.focus'
        ])
    .component('buyFlowWelcome', {
        templateUrl: '/js/ovpApp/buyFlow/welcome.html',
        controller: class BuyFlowWelcomeController {
            /* @ngInject */
            constructor(messages, $state, $timeout, $window, $document,
                config, $rootScope, buyFlowService, delegateUtils) {
                angular.extend(this, {messages, $state, $timeout, $window,
                    $document, config, $rootScope, buyFlowService, delegateUtils});
            }

            $onInit() {
                this.phone = this.config.streamPlusIvrNumber;
                this.buyFlowEnabled = this.config.streamPlus.buyFlowEnabled;
                this.streamBuyUrl = this.config.streamBuyUrl;
                this.buyFlowService.getBaseOffers().then(result=> {
                    this.networks = result[0].networks;
                });
                // Analytics
                this.$rootScope.$broadcast('pageChangeComplete', this.$state.current);
            }
            $postLink() {
                // Added timeout to avoid focus issue on Windows 7 + IE
                this.$timeout(function () {
                    // Focus should be on the 'Get Started' button.
                    angular.element('.streamplus-welcome')[0].focus();
                }.bind(this), 200);
            }
            getNetworkIcons(network) {
                return this.delegateUtils.networkImageFromTmsId(network.tmsId)({width: 96});
            }
            start() {
                if (!this.buyFlowEnabled) {
                    this.$window.open(this.streamBuyUrl);
                    return;
                }

                // Analytics:
                // Analytics (must happen before popup)
                this.$rootScope.$broadcast('Analytics:select', {
                    category: 'navigation',
                    context: 'stream2',
                    elementUiName: 'Let\'s get started',
                    pageSectionName: 'conversionArea',
                    elementStandardizedName: 'confirm',
                    triggeredBy: 'user',
                    operationType: 'buttonClick',
                    featureName: 'stream2',
                    featureType: 'stream2BuyFlow',
                    featureCurrentStep: 1
                });

                this.$state.go('buyFlow.offers');
            }
        }
    });
}());
